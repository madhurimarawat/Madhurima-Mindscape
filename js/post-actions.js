
/**
 * File: js/post-actions.js
 * Author: Madhurima Rawat
 * Date: November 24, 2026
 * Description:
 * Reusable post actions for Madhurima Mindscape.
 * Supports saving, commenting, sharing, browser bookmarks,
 * multilingual read aloud, English speech fallback,
 * word highlighting, automatic scrolling, and reading time.
 */

function initializePostActions(container) {
    const actions = container.querySelector("#post-actions");

    if (!actions) {
        console.error("Post Actions: #post-actions was not found.");
        return;
    }

    // ==================================================
    // ARTICLE INFORMATION
    // ==================================================

    const postId = window.location.pathname.replace(/\/+$/, "") || "/";
    const postTitle =
        actions.dataset.postTitle ||
        document.title ||
        "Madhurima Mindscape article";
    const postUrl = window.location.href.split("#")[0];

    // ==================================================
    // COMPONENT ELEMENTS
    // ==================================================

    const status = container.querySelector("#post-action-status");
    const saveButton = container.querySelector("#save-post-btn");
    const commentToggle = container.querySelector("#comment-toggle");
    const commentPanel = container.querySelector("#comment-panel");
    const commentForm = container.querySelector("#post-comment-form");
    const commentSelect = container.querySelector("#comment-template");

    const customCommentContainer =
        container.querySelector("#custom-comment-container");
    const customCommentInput =
        container.querySelector("#custom-comment");

    const nameInput = container.querySelector("#comment-name");
    const shareButton = container.querySelector("#share-post-btn");

    const BLOG_EMAIL = "rawatmadhurima4@gmail.com";

    // ==================================================
    // BLOG-SPECIFIC STORAGE
    // ==================================================

    const rawBlogName = container.classList[0] || "default";

    const blogName = rawBlogName
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9_-]/g, "-");

    const savedKey = "mindscape-saved-posts-" + blogName;
    const savedDateKey = "mindscape-saved-post-dates-" + blogName;

    // ==================================================
    // STATUS MESSAGES
    // ==================================================

    let statusTimeout;
    let fadeTimeout;

    function showStatus(message, duration = 8000) {
        if (!status) {
            console.info("Post Actions:", message);
            return;
        }

        clearTimeout(statusTimeout);
        clearTimeout(fadeTimeout);

        status.textContent = message;
        status.classList.remove("fade-out");
        status.style.display = "block";
        status.style.opacity = "1";

        statusTimeout = setTimeout(() => {
            status.classList.add("fade-out");

            fadeTimeout = setTimeout(() => {
                status.textContent = "";
                status.classList.remove("fade-out");
                status.style.display = "";
                status.style.opacity = "";
            }, 800);
        }, duration);
    }

    // ==================================================
    // BROWSER BOOKMARK INSTRUCTIONS
    // ==================================================

    function promptBrowserBookmark() {
        const isMobile = /Android|iPhone|iPad|iPod/i.test(
            navigator.userAgent
        );

        const isMac = /Mac|iPhone|iPad|iPod/i.test(
            navigator.platform
        );

        let message;

        if (isMobile) {
            message =
                "To add this article to browser bookmarks, " +
                "open your browser menu (⋮ on Chrome) and tap " +
                "'Bookmark' or the bookmark icon. " +
                "This article is saved in this site's Saved Articles too.";
        } else if (isMac) {
            message =
                "To bookmark this article in your browser, " +
                "press Command (⌘) + D. Your article is also " +
                "saved in this site's Saved Articles.";
        } else {
            message =
                "To bookmark this article in your browser, " +
                "press Ctrl + D. Your article is also " +
                "saved in this site's Saved Articles.";
        }

        showStatus(message, 12000);
    }

    // ==================================================
    // SAVE AND UNSAVE POSTS
    // ==================================================

    function readSavedPosts() {
        try {
            const stored = JSON.parse(
                localStorage.getItem(savedKey) || "[]"
            );

            return Array.isArray(stored) ? stored : [];
        } catch (error) {
            console.error("Could not read saved posts:", error);
            return [];
        }
    }

    let savedPosts = readSavedPosts();

    function updateSaveButton() {
        if (!saveButton) return;

        const isSaved = savedPosts.includes(postId);

        saveButton.classList.toggle("is-saved", isSaved);
        saveButton.setAttribute("aria-pressed", String(isSaved));

        saveButton.innerHTML = isSaved
            ? '<i class="fas fa-bookmark" aria-hidden="true"></i><span>Saved</span>'
            : '<i class="far fa-bookmark" aria-hidden="true"></i><span>Save</span>';
    }

    updateSaveButton();

    if (saveButton) {
        saveButton.addEventListener("click", function () {
            const previousPosts = [...savedPosts];
            const index = savedPosts.indexOf(postId);

            if (index === -1) {
                savedPosts.push(postId);
            } else {
                savedPosts.splice(index, 1);
            }

            try {
                localStorage.setItem(
                    savedKey,
                    JSON.stringify(savedPosts)
                );

                let savedDates = {};

                try {
                    const storedDates = JSON.parse(
                        localStorage.getItem(savedDateKey) || "{}"
                    );

                    if (
                        storedDates &&
                        typeof storedDates === "object" &&
                        !Array.isArray(storedDates)
                    ) {
                        savedDates = storedDates;
                    }
                } catch (error) {
                    console.error("Could not read saved dates:", error);
                }

                if (index === -1) {
                    savedDates[postId] = new Date().toISOString();
                } else {
                    delete savedDates[postId];
                }

                localStorage.setItem(
                    savedDateKey,
                    JSON.stringify(savedDates)
                );

                updateSaveButton();

                if (index === -1) {
                    showStatus(
                        "Article saved in this Website Saved Articles.",
                        4000
                    );

                    statusTimeout = setTimeout(
                        promptBrowserBookmark,
                        1200
                    );
                } else {
                    showStatus(
                        "Article removed from Saved Articles."
                    );
                }
            } catch (error) {
                savedPosts = previousPosts;
                updateSaveButton();

                showStatus(
                    "Unable to save this article. Check your browser's storage settings."
                );

                console.error("Could not save article:", error);
            }
        });
    }

    // ==================================================
    // COMMENT PANEL
    // ==================================================

    if (commentToggle && commentPanel) {
        commentToggle.addEventListener("click", function () {
            const isExpanded =
                commentToggle.getAttribute("aria-expanded") === "true";

            commentToggle.setAttribute(
                "aria-expanded",
                String(!isExpanded)
            );

            commentPanel.hidden = isExpanded;
        });
    }

    // ==================================================
    // CUSTOM COMMENT FIELD
    // ==================================================

    function updateCustomCommentField() {
        if (!commentSelect || !customCommentContainer) return;

        const isOther = commentSelect.value === "other";

        customCommentContainer.hidden = !isOther;

        if (customCommentInput) {
            customCommentInput.required = isOther;

            if (!isOther) {
                customCommentInput.value = "";
            }
        }
    }

    if (commentSelect) {
        commentSelect.addEventListener(
            "change",
            updateCustomCommentField
        );

        updateCustomCommentField();
    }

    // ==================================================
    // SEND COMMENT USING MAILTO
    // ==================================================

    if (commentForm) {
        commentForm.noValidate = true;

        commentForm.addEventListener("submit", function (event) {
            event.preventDefault();

            if (!BLOG_EMAIL) {
                showStatus("Please configure your blog email address.");
                return;
            }

            if (!commentSelect || !commentSelect.value) {
                showStatus("Please select a comment first.");
                commentSelect?.focus();
                return;
            }

            let selectedComment = commentSelect.value;

            if (selectedComment === "other") {
                selectedComment = customCommentInput
                    ? customCommentInput.value.trim()
                    : "";

                if (!selectedComment) {
                    showStatus("Please write your comment first.");
                    customCommentInput?.focus();
                    return;
                }
            }

            const visitorName =
                nameInput && nameInput.value.trim()
                    ? nameInput.value.trim()
                    : "Anonymous";

            const subject = "Comment on " + postTitle;

            const body = [
                "Hello Madhurima,",
                "",
                "I would like to share a comment about your blog post.",
                "",
                "Blog post: " + postTitle,
                "Post URL: " + postUrl,
                "Name: " + visitorName,
                "",
                "Comment:",
                selectedComment,
                "",
                "Sent from Madhurima Mindscape."
            ].join("\n");

            const mailtoUrl =
                "mailto:" + BLOG_EMAIL +
                "?subject=" + encodeURIComponent(subject) +
                "&body=" + encodeURIComponent(body);

            const mailLink = document.createElement("a");
            mailLink.href = mailtoUrl;
            mailLink.style.display = "none";

            document.body.appendChild(mailLink);
            mailLink.click();
            mailLink.remove();

            showStatus(
                "Opening your email app. Please send the email there."
            );
        });
    }

    // ==================================================
    // SHARE THE ARTICLE
    // ==================================================

    if (shareButton) {
        shareButton.addEventListener("click", async function () {
            const shareData = {
                title: postTitle,
                text: "Read this article on Madhurima Mindscape",
                url: postUrl
            };

            try {
                if (navigator.share) {
                    await navigator.share(shareData);
                    showStatus("Share action completed.");
                } else if (
                    navigator.clipboard &&
                    window.isSecureContext
                ) {
                    await navigator.clipboard.writeText(postUrl);
                    showStatus("Article link copied!");
                } else {
                    window.prompt(
                        "Copy this article link:",
                        postUrl
                    );
                }
            } catch (error) {
                if (error.name !== "AbortError") {
                    showStatus(
                        "Unable to share automatically. Copy the page URL from your browser."
                    );

                    console.error("Could not share article:", error);
                }
            }
        });
    }
}

// ==================================================
// REGISTER REUSABLE CUSTOM ELEMENT
// ==================================================

if (!customElements.get("post-actions")) {
    customElements.define(
        "post-actions",
        class extends HTMLElement {
            connectedCallback() {
                if (this.dataset.initialized === "true") {
                    return;
                }

                const actions =
                    this.querySelector("#post-actions");

                if (!actions) {
                    console.error(
                        "Post Actions: Jekyll-included #post-actions markup was not found inside <post-actions>."
                    );

                    return;
                }

                initializePostActions(this);
                this.dataset.initialized = "true";
            }
        }
    );
}

// ==================================================
// READING TIME CALCULATION
// ==================================================

document.addEventListener("DOMContentLoaded", function () {
    const readingTimeElement =
        document.getElementById("reading-time");

    const article = document.querySelector("main");

    if (!article || !readingTimeElement) return;

    const text = article.innerText || article.textContent;

    const words = text.trim()
        .split(/\s+/)
        .filter(Boolean)
        .length;

    const readingMinutes = Math.max(
        1,
        Math.ceil(words / 200)
    );

    readingTimeElement.textContent =
        `${readingMinutes} min read`;
});
