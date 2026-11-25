
/*
============================================================
Project     : Madhurima Mindscape
File Name   : picture-gallery.js
Author      : Madhurima Rawat
Created On  : 25 November 2026

Description :
    Dynamically generates the Picture Gallery using
    image URLs and permalinks from embedded JSON data.

    Each image is wrapped inside a clickable anchor
    linking directly to its corresponding blog post.

    Features:
    - Reads image URLs from embedded JSON
    - Reads blog permalinks from embedded JSON
    - Creates clickable image thumbnails
    - Appends the website base URL to every permalink
    - Opens corresponding blog posts on image click
    - Removes broken image URLs
    - Handles invalid JSON data
    - Displays an empty gallery message when necessary

Dependencies :
    HTML : Images_Gallery.html
    CSS  : css/picture-gallery.css
    JSON : _data/json/images_preview_links.json

Usage :
    Include this file after the embedded galleryData
    JSON element in Images_Gallery.html.
============================================================
*/


document.addEventListener("DOMContentLoaded", function () {


    // Main Elements

    const gallery = document.getElementById("gallery");

    const message = document.getElementById("message");

    const galleryDataElement =
        document.getElementById("galleryData");


    // Validate Required Elements

    if (
        !gallery ||
        !message ||
        !galleryDataElement
    ) {

        console.error(
            "Images Gallery: Required HTML elements are missing."
        );

        return;

    }


    // Website Base URL

    const SITE_BASE_URL =
        "https://madhurimarawat.github.io/Madhurima-Mindscape/";


    // Generate Complete Blog URL

    function getBlogUrl(permalink) {

        if (
            typeof permalink !== "string" ||
            !permalink.trim()
        ) {

            return null;

        }


        // Preserve Absolute URLs

        if (/^https?:\/\//i.test(permalink)) {

            return permalink;

        }


        // Append Permalink to Website Base URL

        return (
            SITE_BASE_URL.replace(/\/+$/, "") +
            "/" +
            permalink.replace(/^\/+/, "")
        );

    }


    // Create Gallery Image

    function createGalleryImage(item, index) {

        // Generate Blog URL

        const blogUrl = getBlogUrl(item.permalink);


        // Skip Entries Without a Valid Permalink

        if (!blogUrl) {

            console.warn(
                `Gallery Image ${index + 1}: Missing permalink.`
            );

            return null;

        }


        // Image Link

        const link = document.createElement("a");

        link.className = "gallery-item";

        link.href = blogUrl;

        link.setAttribute(
            "aria-label",
            `Open blog post ${index + 1}`
        );


        // Image Element

        const img = document.createElement("img");

        img.src = item.image;

        img.alt = `Gallery image ${index + 1}`;

        img.loading = "lazy";


        // Broken Image Handling

        img.onerror = function () {

            link.remove();

            console.warn(
                `Gallery Image ${index + 1}: Unable to load image.`
            );

            checkEmptyGallery();

        };


        // Add Image Inside Clickable Link

        link.appendChild(img);


        return link;

    }


    // Check Whether Gallery Is Empty

    function checkEmptyGallery() {

        if (gallery.children.length === 0) {

            message.textContent = "No images available.";

        } else {

            message.textContent = "";

        }

    }


    // Load Gallery from Embedded JSON

    function loadGallery() {

        try {

            // Read Embedded JSON

            const images = JSON.parse(
                galleryDataElement.textContent
            );


            // Validate JSON Data

            if (!Array.isArray(images)) {

                throw new Error(
                    "Invalid gallery data. Expected an array."
                );

            }


            // Clear Existing Content

            gallery.replaceChildren();

            message.textContent = "";


            // Handle Empty Gallery

            if (images.length === 0) {

                checkEmptyGallery();

                return;

            }


            // Generate Image Links

            images.forEach(function (item, index) {

                if (
                    !item ||
                    typeof item.image !== "string" ||
                    !item.image.trim()
                ) {

                    return;

                }


                const imageLink = createGalleryImage(
                    item,
                    index
                );


                if (imageLink) {

                    gallery.appendChild(imageLink);

                }

            });


            // Check Gallery Content

            checkEmptyGallery();


        } catch (error) {

            console.error(
                "Images Gallery Error:",
                error
            );

            message.textContent =
                "Unable to load gallery images.";

        }

    }


    // Initialize Gallery

    loadGallery();

});
