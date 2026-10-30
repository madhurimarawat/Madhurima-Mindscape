/**
 * File: js/saved-articles.js
 * Author: Madhurima Rawat
 * Date: October 29, 2026
 * Description:
 * Displays and manages the saved articles collection for Madhurima Mindscape.
 * Retrieves saved article paths from the existing localStorage keys used by
 * post-actions.js, dynamically generates article cards, updates the saved
 * article count, handles article removal, displays status messages, and
 * manages the empty reading list state. Supports GitHub Pages and local
 * development environments.
 */

document.addEventListener("DOMContentLoaded", () => {
    const STORAGE_PREFIX = "mindscape-saved-posts-";
    const STATUS_DISPLAY_TIME = 4000;
    const STATUS_FADE_TIME = 500;

    const list = document.getElementById("saved-articles-list");
    const emptyState = document.getElementById("saved-empty");
    const count = document.getElementById("saved-count");
    const status = document.getElementById("saved-status");
    const todayDate = document.getElementById("today-date");

    let statusTimeout;
    let fadeTimeout;

    if (!list || !emptyState || !count || !status) {
        console.error("Saved Articles: Required page elements are missing.");
        return;
    }

    // --------------------------------------------------
    // DISPLAY TODAY'S DATE
    // --------------------------------------------------

    function displayTodayDate() {
        if (!todayDate) return;

        todayDate.textContent = new Intl.DateTimeFormat("en-IN", {
            weekday: "long",
            day: "numeric",
            month: "long",
            year: "numeric"
        }).format(new Date());
    }

    // --------------------------------------------------
    // DISPLAY CENTERED STATUS MESSAGE AND FADE IT OUT
    // --------------------------------------------------

    function showStatusMessage(message) {
        clearTimeout(statusTimeout);
        clearTimeout(fadeTimeout);

        status.textContent = message;
        status.classList.remove("status-fade");
        status.hidden = false;

        statusTimeout = setTimeout(() => {
            status.classList.add("status-fade");

            fadeTimeout = setTimeout(() => {
                status.textContent = "";
                status.classList.remove("status-fade");
            }, STATUS_FADE_TIME);
        }, STATUS_DISPLAY_TIME);
    }

    // --------------------------------------------------
    // FIND ALL SAVED-ARTICLE STORAGE KEYS
    // --------------------------------------------------

    function getStorageKeys() {
        const keys = [];

        for (let index = 0; index < localStorage.length; index++) {
            const key = localStorage.key(index);

            if (key && key.startsWith(STORAGE_PREFIX)) {
                keys.push(key);
            }
        }

        return keys;
    }

    function readKey(key) {
        try {
            const value = JSON.parse(
                localStorage.getItem(key) || "[]"
            );

            return Array.isArray(value) ? value.map(String) : [];
        } catch (error) {
            console.error("Could not read saved list:", key, error);
            return [];
        }
    }

    function getAllSavedArticles() {
        const keys = getStorageKeys();
        const uniquePaths = new Set();

        keys.forEach(key => {
            readKey(key).forEach(path => {
                if (path) uniquePaths.add(path);
            });
        });

        return {
            keys,
            paths: [...uniquePaths]
        };
    }

    // --------------------------------------------------
    // NORMALIZE SAVED PATHS
    // --------------------------------------------------

    function getArticleUrl(savedPath) {
        try {
            // Saved IDs are pathnames from window.location.pathname.
            // Resolve them against this site's origin.
            const url = new URL(savedPath, window.location.origin);

            if (url.origin !== window.location.origin) {
                return null;
            }

            url.hash = "";
            url.search = "";

            return url;
        } catch (error) {
            console.warn("Invalid saved article path:", savedPath);
            return null;
        }
    }

    // --------------------------------------------------
    // FETCH AN ARTICLE'S DETAILS
    // --------------------------------------------------

    async function fetchArticleDetails(savedPath) {
        const url = getArticleUrl(savedPath);

        if (!url) {
            return {
                id: savedPath,
                url: "#",
                title: "Saved article",
                description: "This article's address could not be read.",
                date: "",
                image: "",
                unavailable: true
            };
        }

        try {
            const response = await fetch(url.href, {
                credentials: "same-origin"
            });

            if (!response.ok) {
                throw new Error("HTTP " + response.status);
            }

            const html = await response.text();

            const parser = new DOMParser();
            const documentPage = parser.parseFromString(
                html,
                "text/html"
            );

            const title =
                documentPage.querySelector("h2")?.textContent?.trim() ||
                documentPage.querySelector('meta[property="og:title"]')
                    ?.content?.trim() ||
                documentPage.querySelector("title")?.textContent?.trim() ||
                "Untitled article";

            const description =
                documentPage.querySelector('meta[name="description"]')
                    ?.content?.trim() ||
                documentPage.querySelector('meta[property="og:description"]')
                    ?.content?.trim() ||
                documentPage.querySelector(".intro p")
                    ?.textContent?.trim() ||
                "Open this article to continue reading.";

            const image =
                documentPage.querySelector('meta[property="og:image"]')
                    ?.content?.trim() ||
                documentPage.querySelector('meta[name="twitter:image"]')
                    ?.content?.trim() ||
                "";

            const publicationDate =
                documentPage.querySelector(".date-class")
                    ?.textContent?.trim() ||
                documentPage.querySelector('meta[name="date"]')
                    ?.content?.trim() ||
                "";

            let imageUrl = "";

            if (image) {
                try {
                    const candidate = new URL(image, url.href);

                    if (
                        candidate.protocol === "https:" ||
                        candidate.protocol === "http:"
                    ) {
                        imageUrl = candidate.href;
                    }
                } catch {
                    imageUrl = "";
                }
            }

            return {
                id: savedPath,
                url: url.href,
                title,
                description,
                date: publicationDate,
                image: imageUrl,
                unavailable: false
            };
        } catch (error) {
            console.warn(
                "Could not fetch saved article:",
                savedPath,
                error
            );

            return {
                id: savedPath,
                url: url.href,
                title: "Saved article",
                description:
                    "We couldn't load this article's details. You can still try opening it.",
                date: "",
                image: "",
                unavailable: true
            };
        }
    }

    // --------------------------------------------------
    // CREATE PAGE ELEMENTS SAFELY
    // --------------------------------------------------

    function createElement(tag, className, text) {
        const element = document.createElement(tag);

        if (className) {
            element.className = className;
        }

        if (text !== undefined) {
            element.textContent = text;
        }

        return element;
    }

    function renderCard(article) {
        const card = createElement("article", "saved-card");

        if (article.image) {
            const image = createElement("img", "saved-card-image");

            image.src = article.image;
            image.alt = "";
            image.loading = "lazy";

            image.addEventListener("error", () => {
                image.remove();
            });

            card.appendChild(image);
        }

        const content = createElement("div", "saved-card-content");

        if (article.date) {
            content.appendChild(
                createElement("p", "saved-card-date", article.date)
            );
        }

        content.appendChild(
            createElement("h3", "", article.title)
        );

        content.appendChild(
            createElement(
                "p",
                "saved-card-description",
                article.description
            )
        );

        const actions = createElement("div", "saved-card-actions");

        const readLink = createElement(
            "a",
            "saved-read-link",
            "Read Article"
        );

        readLink.href = article.url;

        readLink.appendChild(
            createElement("i", "fas fa-arrow-right")
        );

        readLink.setAttribute(
            "aria-label",
            "Read " + article.title
        );

        const removeButton = createElement(
            "button",
            "saved-remove-button",
            "Remove"
        );

        removeButton.type = "button";

        removeButton.setAttribute(
            "aria-label",
            "Remove " + article.title + " from Saved Articles"
        );

        removeButton.addEventListener("click", () => {
            removeSavedArticle(article.id);
        });

        actions.append(readLink, removeButton);
        content.appendChild(actions);
        card.appendChild(content);

        return card;
    }

    // --------------------------------------------------
    // REMOVE A POST FROM EVERY MATCHING KEY
    // --------------------------------------------------

    function removeSavedArticle(articlePath) {
        try {
            const keys = getStorageKeys();

            keys.forEach(key => {
                const updated = readKey(key).filter(
                    path => path !== articlePath
                );

                localStorage.setItem(key, JSON.stringify(updated));
            });

            showStatusMessage(
                "Article removed from your reading list."
            );

            renderSavedArticles();
        } catch (error) {
            console.error("Could not remove saved article:", error);

            showStatusMessage(
                "Unable to remove this article. Please check browser storage settings."
            );
        }
    }

    // --------------------------------------------------
    // RENDER THE COMPLETE READING LIST
    // --------------------------------------------------

    async function renderSavedArticles() {
        list.replaceChildren();

        const saved = getAllSavedArticles();

        count.textContent =
            saved.paths.length +
            (saved.paths.length === 1
                ? " Article Saved"
                : " Articles Saved");

        if (saved.paths.length === 0) {
            list.hidden = true;
            emptyState.hidden = false;
            return;
        }

        list.hidden = false;
        emptyState.hidden = true;

        const loading = createElement(
            "p",
            "saved-loading",
            "Loading your saved stories..."
        );

        list.appendChild(loading);

        const articles = await Promise.all(
            saved.paths.map(fetchArticleDetails)
        );

        list.replaceChildren();

        articles.forEach(article => {
            list.appendChild(renderCard(article));
        });

        // Keep the count consistent with the unique saved URLs.
        count.textContent =
            articles.length +
            (articles.length === 1
                ? " Article Saved"
                : " Articles Saved");

        if (articles.length === 0) {
            list.hidden = true;
            emptyState.hidden = false;
        }
    }

    // --------------------------------------------------
    // INITIALIZE
    // --------------------------------------------------

    displayTodayDate();
    renderSavedArticles();

    // Refresh the reading list if another tab changes localStorage.
    window.addEventListener("storage", event => {
        if (!event.key || event.key.startsWith(STORAGE_PREFIX)) {
            renderSavedArticles();
        }
    });
});
