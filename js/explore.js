/*
*********************************************************************************************
* File: explore.js
* Author: Madhurima Rawat
* Date: November 09, 2026
* Description: Dynamically transforms the blog navigation structure from index.html into
*              glossy preview cards on the Explore the Blog page.
*
* Features:
*   - Fetches blog categories and article links directly from index.html.
*   - Automatically detects existing blog categories.
*   - Retrieves Open Graph metadata from individual blog pages.
*   - Generates responsive blog preview cards.
*   - Displays article titles, descriptions, and preview images.
*   - Provides fallback content when metadata is unavailable.
*   - Automatically reflects changes made to index.html.
*
* Version: 2.0
*********************************************************************************************
*/

document.addEventListener("DOMContentLoaded", () => {

    const container = document.querySelector(".explore-container");

    if (!container) return;


    // ----------------------------------------------------------------
    // Helper: Determine Homepage URL
    // ----------------------------------------------------------------

    function getHomepageUrl() {

        const currentPath = window.location.pathname;

        // Remove the Explore page permalink while preserving the Jekyll baseurl.
        const basePath = currentPath.replace(
            /\/explore-the-blog\/?$/,
            "/"
        );

        return new URL(basePath || "/", window.location.origin);

    }


    // ----------------------------------------------------------------
    // Helper: Get Clean Text from Navigation Link
    // ----------------------------------------------------------------

    function getLinkTitle(link) {

        const clone = link.cloneNode(true);

        // Remove icons before extracting text.
        clone.querySelectorAll("i").forEach(icon => icon.remove());

        return clone.textContent.trim();

    }


    // ----------------------------------------------------------------
    // Helper: Retrieve Open Graph Metadata
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
    // Helper: Generate a Blog Card
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


        // Image container.
        const imageContainer = document.createElement("div");

        imageContainer.className = "explore-card-image";


        // Card content.
        const content = document.createElement("div");

        content.className = "explore-card-content";


        // Card title.
        const title = document.createElement("h4");

        title.className = "explore-card-title";

        title.textContent = fallbackTitle;


        // Card description.
        const description = document.createElement("p");

        description.className = "explore-card-description";

        description.textContent =
            `Explore ${fallbackTitle} in ${categoryHeading}.`;


        // Read More button.
        const readButton = document.createElement("a");

        readButton.className = "explore-read-button";

        readButton.href = pageUrl.href;

        readButton.innerHTML =
            'Read More <i class="fas fa-arrow-right"></i>';


        // Assemble card.
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
    // Helper: Populate Card Using Open Graph Metadata
    // ----------------------------------------------------------------

    async function populateCard(cardData) {

        const metadata = await fetchMetadata(cardData.pageUrl);

        if (!metadata) return;

        const {
            title,
            description,
            image
        } = metadata;


        // Update title.
        if (title) {

            cardData.title.textContent = title
                .replace(/\s*\|\s*Madhurima Rawat\s*$/i, "")
                .trim();

        }


        // Update description.
        if (description) {

            cardData.description.textContent = description;

        }


        // Update preview image.
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
    // Generate Cards From Homepage Navigation
    // ----------------------------------------------------------------

    async function generateExploreCards() {

        try {

            const homepageUrl = getHomepageUrl();

            console.log(
                "Explore Page: Fetching blog directory from:",
                homepageUrl.href
            );


            // Fetch homepage.
            const response = await fetch(homepageUrl.href, {
                credentials: "same-origin"
            });

            if (!response.ok) {

                throw new Error(
                    `Unable to load homepage. HTTP Error: ${response.status}`
                );

            }


            // Parse homepage HTML.
            const html = await response.text();

            const parser = new DOMParser();

            const homepage = parser.parseFromString(
                html,
                "text/html"
            );


            // Retrieve existing homepage categories.
            const sections = homepage.querySelectorAll(
                ".path-container .path-section"
            );

            if (!sections.length) {

                throw new Error(
                    "No .path-section elements were found in index.html."
                );

            }


            const metadataTasks = [];

            const generatedSections = [];


            // --------------------------------------------------------
            // Generate Explore Sections
            // --------------------------------------------------------

            sections.forEach(section => {

                const heading = section.querySelector("h2, h3");

                if (!heading) return;

                const categoryHeading = heading.textContent.trim();

                const links = Array.from(
                    section.querySelectorAll("a.path-item")
                );


                // Skip categories without article links.
                if (!links.length) return;


                // Create category section.
                const exploreSection = document.createElement("div");

                exploreSection.className = "explore-section";


                // Create category heading.
                const newHeading = document.createElement("h3");

                newHeading.textContent = categoryHeading;

                newHeading.className = heading.className;


                // Create card grid.
                const cardGrid = document.createElement("div");

                cardGrid.className = "explore-card-grid";


                // Generate cards from homepage links.
                links.forEach(link => {

                    const href = link.getAttribute("href");

                    if (!href) return;


                    // Ignore external links.
                    const pageUrl = new URL(
                        href,
                        homepageUrl.href
                    );

                    if (pageUrl.origin !== window.location.origin) {
                        return;
                    }


                    const cardData = createBlogCard(
                        link,
                        categoryHeading
                    );


                    // Add card to category grid.
                    cardGrid.appendChild(cardData.card);


                    // Retrieve article metadata.
                    metadataTasks.push(
                        populateCard(cardData)
                    );

                });


                // Assemble category.
                exploreSection.appendChild(newHeading);

                exploreSection.appendChild(cardGrid);


                generatedSections.push(exploreSection);

            });


            // --------------------------------------------------------
            // Display Generated Categories
            // --------------------------------------------------------

            if (!generatedSections.length) {

                throw new Error(
                    "No valid blog categories or article links were found."
                );

            }


            container.replaceChildren(...generatedSections);


            // --------------------------------------------------------
            // Load All Article Metadata Concurrently
            // --------------------------------------------------------

            await Promise.allSettled(metadataTasks);


            console.log(
                `Explore Page: Successfully generated ${generatedSections.length} categories.`
            );


        } catch (error) {

            console.error(
                "Explore Page: Unable to generate blog cards:",
                error
            );


            // Display a helpful fallback message.
            const message = document.createElement("p");

            message.className = "explore-error";

            message.textContent =
                "Unable to load the blog directory. Please refresh the page or try again later.";


            container.replaceChildren(message);

        }

    }


    // ----------------------------------------------------------------
    // Initialize Explore Page
    // ----------------------------------------------------------------

    generateExploreCards();

});