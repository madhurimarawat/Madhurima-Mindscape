/*
*********************************************************************************************
* File: automatic-toc-top-button.js
* Description: Automatically generates a Table of Contents for individual blog posts
*              and manages the floating Back to Top button.
* 
  Date: November 13, 2026
*********************************************************************************************
*/

document.addEventListener("DOMContentLoaded", function () {


    /* =========================================
       AUTOMATIC TABLE OF CONTENTS
    ========================================= */

    const toc = document.getElementById("blog-toc");
    const tocList = document.getElementById("blog-toc-list");

    if (toc && tocList) {

        // Select H3 headings only from the actual blog article sections.
        const headings = document.querySelectorAll("main section h3");

        // Clear previously generated TOC entries.
        tocList.innerHTML = "";

        // Generate URL-friendly IDs for headings.
        function createSlug(text) {
            return text
                .toLowerCase()
                .trim()
                .replace(/[^\w\s-]/g, "")
                .replace(/\s+/g, "-")
                .replace(/-+/g, "-")
                .replace(/^-|-$/g, "");
        }

        // Keep track of IDs already used on the page.
        const usedIds = new Set(
            Array.from(document.querySelectorAll("[id]"))
                .map(element => element.id)
        );

        // Generate one TOC entry for each article heading.
        headings.forEach((heading, index) => {

            // Assign a unique ID only if the heading does not already have one.
            if (!heading.id) {

                const baseSlug =
                    createSlug(heading.textContent) || `section - ${index + 1} `;

                let slug = baseSlug;
                let counter = 2;

                // Avoid duplicate IDs.
                while (usedIds.has(slug)) {
                    slug = `${baseSlug} -${counter} `;
                    counter++;
                }

                heading.id = slug;
                usedIds.add(slug);
            }

            // Create a container and clickable link for each heading.
            const tocItem = document.createElement("div");
            tocItem.className = "blog-toc-item";

            const link = document.createElement("a");

            // Link directly to the corresponding heading.
            link.href = `${window.location.pathname} #${heading.id} `;

            // Preserve the original heading text, including its numbering.
            link.textContent = heading.textContent.trim();

            // Scroll to the heading with extra space above it.
            link.addEventListener("click", function (event) {

                event.preventDefault();

                const headingPosition =
                    heading.getBoundingClientRect().top + window.scrollY;

                // Adjust this value to control the space above the heading.
                const extraSpace = 185;

                // Update the URL fragment without triggering default navigation.
                history.pushState(null, "", link.href);

                // Smoothly scroll to the heading with the desired spacing.
                window.scrollTo({

                    top: Math.max(0, headingPosition - extraSpace),

                    behavior: window.matchMedia(
                        "(prefers-reduced-motion: reduce)"
                    ).matches ? "auto" : "smooth"

                });

            });

            tocItem.appendChild(link);
            tocList.appendChild(tocItem);

        });

        // Insert the TOC immediately after the first article section.
        const firstSection = document.querySelector("main > section");

        if (headings.length > 0 && firstSection) {

            firstSection.insertAdjacentElement("afterend", toc);

        } else {

            // Remove the TOC if no article headings are available.
            toc.remove();

        }

    }


    /* =========================================
       BACK TO TOP BUTTON
    ========================================= */

    const backToTop = document.getElementById("back-to-top");

    if (backToTop) {

        // Show the button after the reader scrolls down.
        window.addEventListener("scroll", function () {

            if (window.scrollY > 350) {

                backToTop.classList.add("visible");

            } else {

                backToTop.classList.remove("visible");

            }

        }, { passive: true });


        // Return to the top when the button is clicked.
        backToTop.addEventListener("click", function () {

            window.scrollTo({

                top: 0,

                // Respect the user's reduced-motion preference.
                behavior: window.matchMedia(
                    "(prefers-reduced-motion: reduce)"
                ).matches ? "auto" : "smooth"

            });

        });

    }

});