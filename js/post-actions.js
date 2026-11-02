/**
 * File: js/post-actions.js
 * Author: Madhurima Rawat
 * Date: November 01, 2026
 * Description:
 * Reusable post actions for Madhurima Mindscape.
 * Supports commenting through mailto, saving posts,
 * browser bookmark instructions, sharing links,
 * temporary status messages, and Jekyll includes.
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
                    showStatus(
                        "Article saved in this Website Saved Articles.",
                        4000
                    );

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



    // --------------------------------------------------
    // READ ALOUD WITH WORD HIGHLIGHTING
    // --------------------------------------------------

    const readAloudButton = container.querySelector("#read-aloud-btn");

    if (readAloudButton && "speechSynthesis" in window) {

        // --------------------------------------------------
        // VARIABLES
        // --------------------------------------------------

        let speechIndex = 0;
        let speechQueue = [];

        let isReading = false;
        let isPaused = false;

        let currentWordRange = null;
        let currentBlock = null;
        let lastScrolledBlock = null;

        let scrollTimer = null;
        let autoScrollResetTimer = null;
        let autoScrolling = false;

        let manualScrollUntil = 0;
        let lastReminderTime = 0;

        const synth = window.speechSynthesis;

        const REMINDER_INTERVAL = 2 * 60 * 1000;
        const SCROLL_GRACE_PERIOD = 20000;

        const instruction =
            "Press the highlighted word to stop reading, or press the button at the top to pause or resume.";

        // --------------------------------------------------
        // DEBUG
        // --------------------------------------------------

        function debug(message, data = "") {

            console.log(
                "%c[READ ALOUD] " + message,
                "color: #b8860b; font-weight: bold;",
                data
            );
        }

        // --------------------------------------------------
        // VOICE SELECTION
        // --------------------------------------------------

        function getIndianVoice() {

            const voices = synth.getVoices();

            const indianVoices = voices.filter(voice =>
                voice.lang.toLowerCase() === "en-in"
            );

            const femaleVoice = indianVoices.find(voice =>
                /female|woman|priya|neerja|heera|aditi|raveena/i.test(
                    voice.name
                )
            );

            const selectedVoice =
                femaleVoice || indianVoices[0] || null;

            if (selectedVoice) {
                debug("Selected voice:", selectedVoice.name);
            } else {
                debug("No Indian English voice found. Using browser default.");
            }

            return selectedVoice;
        }

        function createUtterance(text) {

            const utterance = new SpeechSynthesisUtterance(text);

            utterance.lang = "en-IN";
            utterance.rate = 1;
            utterance.pitch = 1;

            const voice = getIndianVoice();

            if (voice) {
                utterance.voice = voice;
            }

            return utterance;
        }

        // --------------------------------------------------
        // BUTTON STATES
        // --------------------------------------------------

        function updateReadButton(state) {

            const states = {

                idle: {
                    icon: "fas fa-volume-up",
                    label: "Read Aloud",
                    pressed: "false"
                },

                reading: {
                    icon: "fas fa-pause",
                    label: "Pause",
                    pressed: "true"
                },

                paused: {
                    icon: "fas fa-play",
                    label: "Resume",
                    pressed: "true"
                }
            };

            const current = states[state];

            readAloudButton.innerHTML =
                `<i class="${current.icon}" aria-hidden="true"></i>
                 <span>${current.label}</span>`;

            readAloudButton.setAttribute(
                "aria-pressed",
                current.pressed
            );
        }

        // --------------------------------------------------
        // CLEAR HIGHLIGHTING
        // --------------------------------------------------

        function clearHighlight() {

            if (window.CSS && CSS.highlights) {
                CSS.highlights.delete("read-aloud-highlight");
            }

            document.querySelectorAll(".read-aloud-active")
                .forEach(element => {
                    element.classList.remove("read-aloud-active");
                });

            currentWordRange = null;
            currentBlock = null;
        }

        // --------------------------------------------------
        // AUTOMATIC SCROLLING
        // --------------------------------------------------

        function scrollToCurrentBlock() {

            if (!isReading || isPaused || !currentBlock) return;

            if (Date.now() < manualScrollUntil) return;

            if (currentBlock === lastScrolledBlock) return;

            lastScrolledBlock = currentBlock;

            clearTimeout(autoScrollResetTimer);

            autoScrolling = true;

            debug("Automatically following reading position.");

            currentBlock.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });

            autoScrollResetTimer = setTimeout(function () {
                autoScrolling = false;
            }, 1200);
        }

        // --------------------------------------------------
        // MANUAL SCROLLING
        // --------------------------------------------------

        function registerManualScroll() {

            if (!isReading || isPaused || autoScrolling) return;

            manualScrollUntil = Date.now() + SCROLL_GRACE_PERIOD;

            clearTimeout(scrollTimer);

            debug(
                "Manual scrolling detected. Automatic scrolling paused for 20 seconds."
            );

            scrollTimer = setTimeout(function () {

                if (!isReading || isPaused || !currentBlock) return;

                debug("20-second scrolling grace period ended.");

                lastScrolledBlock = null;

                scrollToCurrentBlock();

            }, SCROLL_GRACE_PERIOD);
        }

        window.addEventListener("scroll", function () {

            if (autoScrolling) return;

            registerManualScroll();

        }, { passive: true });

        window.addEventListener("wheel", function () {
            registerManualScroll();
        }, { passive: true });

        window.addEventListener("touchmove", function () {
            registerManualScroll();
        }, { passive: true });

        window.addEventListener("keydown", function (event) {

            const scrollKeys = [
                "ArrowUp",
                "ArrowDown",
                "PageUp",
                "PageDown",
                "Home",
                "End",
                " "
            ];

            if (scrollKeys.includes(event.key)) {
                registerManualScroll();
            }

        });

        // --------------------------------------------------
        // HIGHLIGHT CURRENT SPOKEN WORD
        // --------------------------------------------------

        function highlightWord(node, charIndex) {

            const text = node.textContent;

            if (!text || charIndex >= text.length) return;

            let start = charIndex;
            let end = charIndex;

            while (start > 0 && !/\s/.test(text[start - 1])) {
                start--;
            }

            while (end < text.length && !/\s/.test(text[end])) {
                end++;
            }

            if (start === end) return;

            const range = document.createRange();

            range.setStart(node, start);
            range.setEnd(node, end);

            clearHighlight();

            currentWordRange = range;

            currentBlock = node.parentElement?.closest(
                "p, li, h1, h2, h3, h4, blockquote"
            ) || node.parentElement;

            if (window.CSS && CSS.highlights && window.Highlight) {

                CSS.highlights.set(
                    "read-aloud-highlight",
                    new Highlight(range)
                );

            } else {

                currentBlock?.classList.add("read-aloud-active");
            }

            scrollToCurrentBlock();
        }

        // --------------------------------------------------
        // CLICK HIGHLIGHTED WORD TO STOP
        // --------------------------------------------------

        function getCaretAtPoint(x, y) {

            if (document.caretRangeFromPoint) {
                return document.caretRangeFromPoint(x, y);
            }

            if (document.caretPositionFromPoint) {

                const position =
                    document.caretPositionFromPoint(x, y);

                if (position) {

                    const range = document.createRange();

                    range.setStart(
                        position.offsetNode,
                        position.offset
                    );

                    range.collapse(true);

                    return range;
                }
            }

            return null;
        }

        document.addEventListener("click", function (event) {

            if (!isReading || !currentWordRange) return;

            if (event.target.closest("#read-aloud-btn")) return;

            const clickedPosition = getCaretAtPoint(
                event.clientX,
                event.clientY
            );

            if (!clickedPosition) return;

            const node = clickedPosition.startContainer;
            const offset = clickedPosition.startOffset;

            if (currentWordRange.isPointInRange(node, offset)) {

                debug("Highlighted word clicked. Stopping.");

                stopReading();

                showStatus("Reading stopped.");
            }
        });

        // --------------------------------------------------
        // COLLECT ARTICLE TEXT
        // --------------------------------------------------

        function collectSpeechNodes() {

            const article = document.querySelector("main");

            if (!article) return [];

            const walker = document.createTreeWalker(
                article,
                NodeFilter.SHOW_TEXT,
                {
                    acceptNode(node) {

                        if (!node.textContent.trim()) {
                            return NodeFilter.FILTER_REJECT;
                        }

                        const excluded = node.parentElement?.closest(
                            "script, style, noscript, button, nav, footer, " +
                            "header, textarea, input, select, " +
                            "#post-actions, post-actions, .reading-info"
                        );

                        return excluded
                            ? NodeFilter.FILTER_REJECT
                            : NodeFilter.FILTER_ACCEPT;
                    }
                }
            );

            const nodes = [];

            while (walker.nextNode()) {
                nodes.push(walker.currentNode);
            }

            debug("Article text nodes collected:", nodes.length);

            return nodes;
        }

        // --------------------------------------------------
        // STOP READING
        // --------------------------------------------------

        function stopReading() {

            debug("Stopping reading.");

            isReading = false;
            isPaused = false;

            synth.cancel();

            clearTimeout(scrollTimer);
            clearTimeout(autoScrollResetTimer);

            speechIndex = 0;
            speechQueue = [];

            lastReminderTime = 0;
            lastScrolledBlock = null;
            manualScrollUntil = 0;

            autoScrolling = false;

            clearHighlight();

            updateReadButton("idle");

            debug("Reading completely stopped.");
        }

        // --------------------------------------------------
        // READ NEXT ARTICLE SECTION
        // --------------------------------------------------

        function speakNext() {

            if (!isReading || isPaused) return;

            if (speechIndex >= speechQueue.length) {

                stopReading();

                showStatus("Finished reading this article!");

                return;
            }

            const now = Date.now();

            if (now - lastReminderTime >= REMINDER_INTERVAL) {

                lastReminderTime = now;

                debug("Repeating reading instructions.");

                const reminder = createUtterance(instruction);

                reminder.onend = function () {

                    if (isReading && !isPaused) {
                        speakNext();
                    }
                };

                reminder.onerror = function (event) {

                    debug("Reminder speech error:", event.error);

                    if (isReading && !isPaused) {
                        speakNext();
                    }
                };

                synth.speak(reminder);

                return;
            }

            const node = speechQueue[speechIndex];

            const utterance = createUtterance(node.textContent);

            utterance.onboundary = function (event) {

                if (event.name === "word") {
                    highlightWord(node, event.charIndex);
                }
            };

            utterance.onend = function () {

                if (!isReading || isPaused) return;

                speechIndex++;

                speakNext();
            };

            utterance.onerror = function (event) {

                if (
                    event.error === "canceled" ||
                    event.error === "interrupted"
                ) {
                    return;
                }

                debug("Speech error:", event.error);

                stopReading();

                showStatus("Unable to continue reading this article.");
            };

            synth.speak(utterance);
        }

        // --------------------------------------------------
        // START READING WITH INSTRUCTIONS
        // --------------------------------------------------

        function startReading() {

            speechQueue = collectSpeechNodes();

            if (!speechQueue.length) {

                showStatus("No readable article content was found.");

                return;
            }

            speechIndex = 0;

            isReading = true;
            isPaused = false;

            lastReminderTime = Date.now();

            manualScrollUntil = 0;
            lastScrolledBlock = null;

            updateReadButton("reading");

            debug("Reading started.");

            const instructionUtterance = createUtterance(instruction);

            instructionUtterance.onend = function () {

                if (!isReading || isPaused) return;

                speakNext();
            };

            instructionUtterance.onerror = function (event) {

                debug("Instruction speech error:", event.error);

                if (isReading && !isPaused) {
                    speakNext();
                }
            };

            synth.speak(instructionUtterance);
        }

        // --------------------------------------------------
        // PLAY / PAUSE / RESUME
        // --------------------------------------------------

        readAloudButton.addEventListener("click", function () {

            if (!isReading) {

                startReading();

            } else if (isPaused) {

                isPaused = false;

                synth.resume();

                updateReadButton("reading");

                debug("Reading resumed.");

            } else {

                isPaused = true;

                synth.pause();

                clearTimeout(scrollTimer);
                clearTimeout(autoScrollResetTimer);

                autoScrolling = false;

                updateReadButton("paused");

                debug("Reading paused.");
            }
        });

        // --------------------------------------------------
        // STOP WHEN LEAVING THE PAGE
        // --------------------------------------------------

        window.addEventListener("pagehide", stopReading);

        debug("Read Aloud feature initialized.");

    } else if (readAloudButton) {

        readAloudButton.disabled = true;

        const label = readAloudButton.querySelector("span");

        if (label) {
            label.textContent = "Read Aloud Unavailable";
        }
    }

}

// ==================================================
// REGISTER THE REUSABLE CUSTOM ELEMENT
// ==================================================
//
// Jekyll inserts components/post-actions.html directly
// inside <post-actions> using the Liquid include.
//
// Do NOT fetch the component again with JavaScript.

if (!customElements.get("post-actions")) {
    customElements.define(
        "post-actions",
        class extends HTMLElement {
            connectedCallback() {
                // Prevent duplicate initialization.
                if (this.dataset.initialized === "true") {
                    return;
                }

                // Check for the HTML inserted by Jekyll.
                const actions = this.querySelector("#post-actions");

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

// Wait until the DOM is fully loaded
document.addEventListener("DOMContentLoaded", function () {

    // Get the reading time element and article content
    const readingTimeElement = document.getElementById("reading-time");
    const article = document.querySelector("main");

    // Stop execution if required elements are missing
    if (!article || !readingTimeElement) return;

    // Extract the article text
    const text = article.innerText || article.textContent;

    // Count the total number of words
    const words = text.trim().split(/\s+/).filter(Boolean).length;

    // Estimate reading time at 200 words per minute
    const readingMinutes = Math.max(1, Math.ceil(words / 200));

    // Display the estimated reading time
    readingTimeElement.textContent = `${readingMinutes} min read`;

});