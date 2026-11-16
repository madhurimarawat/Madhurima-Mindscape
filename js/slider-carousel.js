
/*
*********************************************************************************************
* File: slider-carousel.js
* Author: Madhurima Rawat
* Description: Dynamically synchronizes all Special Features carousel slide heights
*              with the rendered height of the icon hero section.
*              Handles page loading, viewport resizing, and dynamic content changes
*              to maintain consistent and responsive carousel layouts.
* Dependencies: Bootstrap 5.3.9
* Version: 2.0
* Date: 16 November, 2026
*********************************************************************************************
*/

document.addEventListener("DOMContentLoaded", function () {

    "use strict";

    try {

        // Get the hero section and carousel
        const heroSection = document.querySelector(".icon-hero-section");
        const carousel = document.querySelector("#specialFeaturesCarousel");

        // Validate required elements
        if (!heroSection || !carousel) {
            console.warn("[Special Carousel] Required elements not found.");
            return;
        }

        // Get all carousel slides
        const carouselSlides = carousel.querySelectorAll(".carousel-item");

        if (!carouselSlides.length) {
            console.warn("[Special Carousel] No carousel slides found.");
            return;
        }

        let resizeTimeout;

        // Synchronize carousel slide heights with the hero section
        function matchCarouselHeight() {

            try {

                const heroHeight = heroSection.getBoundingClientRect().height;

                // Prevent invalid or zero-height assignments
                if (!Number.isFinite(heroHeight) || heroHeight <= 0) {
                    return;
                }

                // Apply the measured height to every carousel slide
                carouselSlides.forEach(function (slide) {
                    slide.style.height = heroHeight + "px";
                });

            } catch (error) {

                console.error(
                    "[Special Carousel] Height synchronization failed:",
                    error
                );

            }
        }

        // Set initial carousel slide heights
        matchCarouselHeight();

        // Recalculate after all page resources have loaded
        window.addEventListener("load", matchCarouselHeight);

        // Recalculate when the viewport is resized
        window.addEventListener("resize", function () {

            clearTimeout(resizeTimeout);

            resizeTimeout = setTimeout(matchCarouselHeight, 150);

        });

        // Observe dynamic changes to the hero section dimensions
        if ("ResizeObserver" in window) {

            const heroResizeObserver = new ResizeObserver(function () {
                matchCarouselHeight();
            });

            heroResizeObserver.observe(heroSection);

        }

        console.log("[Special Carousel] Initialized successfully.");

    } catch (error) {

        console.error(
            "[Special Carousel] Initialization failed:",
            error
        );

    }

});
