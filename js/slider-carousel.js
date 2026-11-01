/*
*********************************************************************************************
* File: slider-carousel.js
* Author: Madhurima Rawat
* Date: November 1, 2026
* Description: Dynamically adjusts the height of all Special Features carousel slides
*              to match the rendered height of the icon hero section.
*              Recalculates slide heights when the browser window is resized
*              to maintain consistent and responsive carousel layouts.
* Version: 1.0
*********************************************************************************************
*/

// Wait until the DOM is fully loaded
document.addEventListener("DOMContentLoaded", function () {

    // Get the hero section and carousel slides
    const heroSection = document.querySelector(".icon-hero-section");
    const carouselSlides = document.querySelectorAll(
        "#specialFeaturesCarousel .carousel-item"
    );

    // Stop execution if the required elements are missing
    if (!heroSection || !carouselSlides.length) return;

    // Match every carousel slide to the hero section height
    function matchCarouselHeight() {

        // Get the actual rendered height of the hero section
        const heroHeight = heroSection.getBoundingClientRect().height;

        // Apply the same height to every carousel slide
        carouselSlides.forEach(function (slide) {
            slide.style.height = heroHeight + "px";
        });
    }

    // Set the initial slide heights
    matchCarouselHeight();

    // Recalculate heights when the screen is resized
    window.addEventListener("resize", matchCarouselHeight);

});
