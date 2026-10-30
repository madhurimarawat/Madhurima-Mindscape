/**
 * File: js/post-actions.js
 * Author: Madhurima Rawat
 * Date: October 28, 2026
 * Description:
 * Reusable post actions for Madhurima Mindscape.
 * Supports commenting through mailto, saving posts,
 * browser bookmark instructions, sharing links,
 * temporary status messages, and GitHub Pages/local development.
 */

function initializePostActions(container) {
    const actions = container.querySelector("#post-actions");

    if (!actions) {
        console.error("Post Actions: #post-actions was not found.");
        return;
    }

    // Identify the current article.
    const postId =
        window.location.pathname.replace(/\/+$/, "") || "/";

    const postTitle =
        actions.dataset.postTitle ||
        document.title ||
        "Madhurima Mindscape article";

    const postUrl = window.location.href.split("#")[0];

    // Component elements.
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

    // Blog email address.
    const BLOG_EMAIL = "rawatmadhurima4@gmail.com";

    // Keep saved posts separate for each blog component.
    const rawBlogName = container.classList[0] || "default";

    const blogName = rawBlogName
        .trim()
        .toLowerCase()
        .replace(/[^a-z0-9_-]/g, "-");

    const savedKey = "mindscape-saved-posts-" + blogName;

    // --------------------------------------------------
    // TEMPORARY STATUS MESSAGES
    // --------------------------------------------------

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

    // --------------------------------------------------
    // BROWSER BOOKMARK INSTRUCTIONS
    // --------------------------------------------------

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

    // --------------------------------------------------
    // SAVE AND UNSAVE POSTS
    // --------------------------------------------------

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

        saveButton.setAttribute(
            "aria-pressed",
            String(isSaved)
        );

        saveButton.innerHTML = isSaved
            ? '<i class="fas fa-bookmark" aria-hidden="true"></i>' +
            "<span>Saved</span>"
            : '<i class="far fa-bookmark" aria-hidden="true"></i>' +
            "<span>Save</span>";
    }

    // Update the button without displaying instructions on page load.
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

                updateSaveButton();

                if (index === -1) {
                    // Saved successfully in this website.
                    showStatus(
                        "Article saved in this Website Saved Articles.",
                        4000
                    );

                    // Then show browser bookmark instructions.
                    statusTimeout = setTimeout(() => {
                        promptBrowserBookmark();
                    }, 1200);
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

    // --------------------------------------------------
    // OPEN AND CLOSE THE COMMENT PANEL
    // --------------------------------------------------

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

    // --------------------------------------------------
    // CUSTOM COMMENT FIELD
    // --------------------------------------------------

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

    // --------------------------------------------------
    // SEND COMMENT USING MAILTO
    // --------------------------------------------------

    if (commentForm) {
        commentForm.noValidate = true;

        commentForm.addEventListener("submit", function (event) {
            event.preventDefault();

            console.log("Post Actions: Send Mail button clicked.");

            if (
                !BLOG_EMAIL ||
                BLOG_EMAIL === "your-email@example.com"
            ) {
                showStatus("Please configure your blog email address.");
                console.error("BLOG_EMAIL is not configured.");
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

            try {
                const mailLink = document.createElement("a");

                mailLink.href = mailtoUrl;
                mailLink.style.display = "none";

                document.body.appendChild(mailLink);
                mailLink.click();
                mailLink.remove();

                showStatus(
                    "Opening your email app. Please send the email there."
                );
            } catch (error) {
                console.error("Could not open the email app:", error);

                showStatus(
                    "Could not open your email app. Check your browser's mail settings."
                );

                const fallbackLink = document.createElement("a");

                fallbackLink.href = mailtoUrl;
                fallbackLink.textContent =
                    "Click here to open your email";

                fallbackLink.style.display = "block";
                fallbackLink.style.textAlign = "center";
                fallbackLink.style.marginTop = "10px";
                fallbackLink.className = "mailto-fallback";

                const existingFallback =
                    container.querySelector(".mailto-fallback");

                if (existingFallback) {
                    existingFallback.remove();
                }

                status?.insertAdjacentElement(
                    "afterend",
                    fallbackLink
                );
            }
        });
    } else {
        console.error(
            "Post Actions: #post-comment-form was not found."
        );
    }

    // --------------------------------------------------
    // SHARE THE ARTICLE
    // --------------------------------------------------

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
// REGISTER THE REUSABLE CUSTOM ELEMENT
// ==================================================

if (!customElements.get("post-actions")) {
    customElements.define(
        "post-actions",
        class extends HTMLElement {
            async connectedCallback() {
                if (
                    this.dataset.loaded === "true" ||
                    this.dataset.loaded === "loading"
                ) {
                    return;
                }

                this.dataset.loaded = "loading";

                try {
                    const pathParts = window.location.pathname
                        .split("/")
                        .filter(Boolean);

                    const projectName = "Madhurima-Mindscape";

                    const hasProjectPrefix =
                        pathParts[0] === projectName;

                    const basePath = hasProjectPrefix
                        ? "/" + projectName
                        : "";

                    const componentPath =
                        basePath + "/components/post-actions.html";

                    const response = await fetch(componentPath);

                    if (!response.ok) {
                        throw new Error(
                            "Could not load " + componentPath +
                            " (HTTP " + response.status + ")"
                        );
                    }

                    const html = await response.text();

                    this.innerHTML = html;

                    initializePostActions(this);

                    this.dataset.loaded = "true";
                } catch (error) {
                    this.dataset.loaded = "false";

                    console.error(
                        "Post Actions loading error:",
                        error
                    );
                }
            }
        }
    );
}