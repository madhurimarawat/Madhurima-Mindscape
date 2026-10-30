
/*
*********************************************************************************************
* File: explore.js
* Author: Madhurima Rawat
* Date: October 30, 2026
* Description: Dynamically transforms the existing blog navigation structure into glossy
*              preview cards. Retrieves Open Graph metadata from individual blog pages,
*              including titles, descriptions, and preview images.
*
* Features:
*   - Automatically detects blog categories.
*   - Reads existing category headings and article links.
*   - Retrieves Open Graph metadata from linked pages.
*   - Generates responsive blog preview cards.
*   - Provides fallback content when metadata is unavailable.
*   - Generates a closing note and homepage navigation.
*
* Version: 1.0
*********************************************************************************************
*/

document.addEventListener("DOMContentLoaded", () => {

    const container = document.querySelector(".explore-container");

    if (!container) return;

    const sections = container.querySelectorAll(".explore-section");


    // ----------------------------------------------------------------
    // Helper: Get clean text from navigation link
    // ----------------------------------------------------------------

    function getLinkTitle(link) {

        const clone = link.cloneNode(true);

        // Remove icons before extracting text
        clone.querySelectorAll("i").forEach(icon => icon.remove());

        return clone.textContent.trim();

    }


    // ----------------------------------------------------------------
    // Helper: Retrieve Open Graph metadata
    // ----------------------------------------------------------------

    async function fetchMetadata(url) {

        try {

            const response = await fetch(url.href, {
                credentials: "same-origin"
            });

            if (!response.ok) {
                throw new Error(`HTTP Error: ${response.status}`);
            }

            const html = await response.text();

            const parser = new DOMParser();

            const page = parser.parseFromString(
                html,
                "text/html"
            );

            function getMeta(property) {

                return page.querySelector(
                    `meta[property="${property}"]`
                )?.getAttribute("content")?.trim() || "";

            }

            return {

                title: getMeta("og:title"),

                description: getMeta("og:description"),

                image: getMeta("og:image")

            };

        } catch (error) {

            console.warn(
                `Unable to retrieve metadata from ${url.href}:`,
                error
            );

            return null;

        }

    }


    // ----------------------------------------------------------------
    // Helper: Generate a blog card
    // ----------------------------------------------------------------

    function createBlogCard(link, categoryHeading) {

        const pageUrl = new URL(
            link.getAttribute("href"),
            document.baseURI
        );

        const fallbackTitle = getLinkTitle(link);

        const card = document.createElement("article");

        card.className = "explore-card";

        card.dataset.page = pageUrl.href;

        card.dataset.fallbackTitle = fallbackTitle;


        // Image container
        const imageContainer = document.createElement("div");

        imageContainer.className = "explore-card-image";


        // Card content
        const content = document.createElement("div");

        content.className = "explore-card-content";


        // Card title
        const title = document.createElement("h4");

        title.className = "explore-card-title";

        title.textContent = fallbackTitle;


        // Card description
        const description = document.createElement("p");

        description.className = "explore-card-description";

        description.textContent =
            `Explore ${fallbackTitle} in ${categoryHeading}.`;


        // Read More button
        const readButton = document.createElement("a");

        readButton.className = "explore-read-button";

        readButton.href = pageUrl.href;

        readButton.innerHTML =
            'Read More <i class="fas fa-arrow-right"></i>';


        // Assemble card
        content.appendChild(title);

        content.appendChild(description);

        content.appendChild(readButton);

        card.appendChild(imageContainer);

        card.appendChild(content);


        return {

            card,

            pageUrl,

            title,

            description,

            imageContainer,

            fallbackTitle

        };

    }


    // ----------------------------------------------------------------
    // Helper: Populate card using Open Graph metadata
    // ----------------------------------------------------------------

    async function populateCard(cardData, categoryHeading) {

        const metadata = await fetchMetadata(cardData.pageUrl);

        if (!metadata) return;

        const {
            title,
            description,
            image
        } = metadata;


        // Update title
        if (title) {

            cardData.title.textContent = title;

        }


        // Update description
        if (description) {

            cardData.description.textContent = description;

        }


        // Update preview image
        if (image) {

            const imageElement = document.createElement("img");

            imageElement.src = new URL(
                image,
                cardData.pageUrl
            ).href;

            imageElement.alt =
                title || cardData.fallbackTitle;

            imageElement.loading = "lazy";

            imageElement.decoding = "async";

            imageElement.addEventListener("error", () => {

                imageElement.remove();

            }, { once: true });

            cardData.imageContainer.appendChild(imageElement);

        }

    }


    // ----------------------------------------------------------------
    // Generate cards for each category
    // ----------------------------------------------------------------

    async function generateExploreCards() {

        const metadataTasks = [];

        sections.forEach(section => {

            const heading = section.querySelector("h2, h3");

            if (!heading) return;

            const categoryHeading = heading.textContent.trim();

            const links = Array.from(
                section.querySelectorAll("a.explore-item")
            );

            // Skip empty categories
            if (!links.length) return;


            // Create card grid
            const cardGrid = document.createElement("div");

            cardGrid.className = "explore-card-grid";


            // Change category heading to h3
            const newHeading = document.createElement("h3");

            newHeading.textContent = categoryHeading;

            newHeading.className = heading.className;

            heading.replaceWith(newHeading);


            // Generate cards from existing links
            links.forEach(link => {

                const cardData = createBlogCard(
                    link,
                    categoryHeading
                );

                cardGrid.appendChild(cardData.card);

                metadataTasks.push(
                    populateCard(cardData, categoryHeading)
                );

            });


            // Replace original navigation links
            section.replaceChildren(
                newHeading,
                cardGrid
            );

        });


        // Load all metadata concurrently
        await Promise.allSettled(metadataTasks);

    }


    // ----------------------------------------------------------------
    // Initialize Explore Page
    // ----------------------------------------------------------------

    generateExploreCards();

});
