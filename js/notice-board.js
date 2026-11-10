/**
 * File: js/notice-board.js
 * Author: Madhurima Rawat
 * Date: November 10, 2026
 * Description:
 * Dynamically generates and manages the Notice Board section for Madhurima
 * Mindscape. Retrieves notice data from the embedded JSON data element,
 * validates and filters notice entries, sorts notice groups by date in
 * descending order, and displays categorized Blogs and Features updates.
 * Creates individual notice cards with icons, titles, descriptions, and
 * optional navigation links. Automatically fetches and displays the latest
 * notice date in the main date heading. Highlights the latest notice group
 * and manages Notice Board visibility based on available valid notices.
 * Includes error handling for invalid JSON data.
 */

document.addEventListener("DOMContentLoaded", function () {

    // Main elements
    const noticeBoard = document.getElementById("noticeBoard");
    const noticeDataElement = document.getElementById("noticeData");
    const noticeHistory = document.getElementById("noticeHistory");
    const dateElement = document.querySelector(".date-class");

    if (!noticeBoard || !noticeDataElement || !noticeHistory) {
        return;
    }


    // Format date as November 09, 2026
    function formatDate(dateString) {

        const date = new Date(dateString + "T00:00:00");

        if (Number.isNaN(date.getTime())) {
            return dateString;
        }

        return new Intl.DateTimeFormat("en-US", {
            month: "long",
            day: "2-digit",
            year: "numeric"
        }).format(date);
    }


    // Update main heading with the latest valid notice date
    function updateLatestNoticeDate(notices) {

        if (!dateElement || !Array.isArray(notices)) {
            return;
        }

        const latestNotice = notices
            .filter(function (entry) {

                if (!entry || typeof entry.date !== "string") {
                    return false;
                }

                // Validate date
                const date = new Date(entry.date + "T00:00:00");

                if (Number.isNaN(date.getTime())) {
                    return false;
                }

                // Only include entries containing actual notices
                const hasBlogs =
                    Array.isArray(entry.blogs) &&
                    entry.blogs.some(item =>
                        item && (item.title || item.text)
                    );

                const hasFeatures =
                    Array.isArray(entry.features) &&
                    entry.features.some(item =>
                        item && (item.title || item.text)
                    );

                return hasBlogs || hasFeatures;
            })
            .sort(function (a, b) {

                return new Date(b.date + "T00:00:00") -
                    new Date(a.date + "T00:00:00");

            })[0];

        if (!latestNotice) {
            dateElement.textContent = "";
            return;
        }

        dateElement.textContent = formatDate(latestNotice.date);
    }


    // Create an individual notice
    function createNotice(item, iconClass) {

        const article = document.createElement("article");
        article.className = "notice-item";


        // Notice heading with icon
        const heading = document.createElement("h4");
        heading.className = "notice-title";

        const icon = document.createElement("i");
        icon.className = item.icon || iconClass;
        icon.setAttribute("aria-hidden", "true");

        const title = document.createElement("span");
        title.textContent = item.title || "Update";

        heading.appendChild(icon);
        heading.appendChild(title);

        article.appendChild(heading);


        // Notice description
        if (item.text) {

            const description = document.createElement("p");
            description.className = "notice-text";
            description.textContent = item.text;

            article.appendChild(description);
        }


        // Optional link
        if (
            typeof item.url === "string" &&
            item.url.trim() !== ""
        ) {

            const link = document.createElement("a");
            link.className = "notice-link";

            const baseUrl = noticeBoard.dataset.baseurl || "";

            link.href = baseUrl + "/" + item.url.replace(/^\/+/, "");

            link.textContent = "Read more";

            article.appendChild(link);
        }

        return article;
    }


    // Create Blogs or Features section
    function createSection(title, items, iconClass) {

        if (!Array.isArray(items) || items.length === 0) {
            return null;
        }

        const section = document.createElement("section");
        section.className = "notice-section";


        // Section heading
        const heading = document.createElement("h3");
        heading.className = "notice-heading";

        const sectionIcon = document.createElement("i");
        sectionIcon.className = iconClass;
        sectionIcon.setAttribute("aria-hidden", "true");

        const headingText = document.createElement("span");
        headingText.textContent = title;

        heading.appendChild(sectionIcon);
        heading.appendChild(headingText);

        section.appendChild(heading);


        // Notice list
        const list = document.createElement("div");
        list.className = "notice-list";

        items.forEach(function (item) {

            if (!item || (!item.title && !item.text)) {
                return;
            }

            list.appendChild(
                createNotice(item, iconClass)
            );
        });


        if (list.children.length === 0) {
            return null;
        }

        section.appendChild(list);

        return section;
    }


    // Create date group
    function createDateGroup(entry, isLatest) {

        const group = document.createElement("div");
        group.className = "notice-date-group";


        // Previous dates appear outside their cards
        if (!isLatest) {

            const dateHeading = document.createElement("h3");
            dateHeading.className = "notice-group-date";
            dateHeading.textContent = formatDate(entry.date);

            group.appendChild(dateHeading);
        }


        // Individual date card
        const card = document.createElement("div");
        card.className = "notice-card";

        const cardContent = document.createElement("div");
        cardContent.className = "notice-card-content";


        // Blogs
        const blogs = createSection(
            "Blogs",
            entry.blogs,
            "fas fa-spa"
        );

        if (blogs) {
            cardContent.appendChild(blogs);
        }


        // Features
        const features = createSection(
            "Features",
            entry.features,
            "fas fa-star"
        );

        if (features) {
            cardContent.appendChild(features);
        }


        card.appendChild(cardContent);
        group.appendChild(card);

        return group;
    }


    // Load and display notice history
    try {

        const data = JSON.parse(noticeDataElement.textContent);


        // Validate notice data
        if (!data || !Array.isArray(data.notices)) {
            noticeBoard.hidden = true;

            if (dateElement) {
                dateElement.textContent = "";
            }

            return;
        }


        // Keep only valid date groups containing notices
        const validNotices = data.notices.filter(function (entry) {

            if (!entry || typeof entry.date !== "string") {
                return false;
            }

            const date = new Date(entry.date + "T00:00:00");

            if (Number.isNaN(date.getTime())) {
                return false;
            }

            const hasBlogs =
                Array.isArray(entry.blogs) &&
                entry.blogs.some(item =>
                    item && (item.title || item.text)
                );

            const hasFeatures =
                Array.isArray(entry.features) &&
                entry.features.some(item =>
                    item && (item.title || item.text)
                );

            return hasBlogs || hasFeatures;
        });


        // Sort newest date first
        validNotices.sort(function (a, b) {

            return new Date(b.date + "T00:00:00") -
                new Date(a.date + "T00:00:00");

        });


        // Update main date from the latest valid notice
        updateLatestNoticeDate(validNotices);


        // Clear previous notice history
        noticeHistory.replaceChildren();


        // Render notice groups
        validNotices.forEach(function (entry, index) {

            const isLatest = index === 0;

            const group = createDateGroup(entry, isLatest);

            noticeHistory.appendChild(group);

        });


        // Show board only if notices exist
        noticeBoard.hidden = noticeHistory.children.length === 0;


    } catch (error) {

        console.error("Notice Board Error:", error);

        noticeBoard.hidden = true;

    }

});
