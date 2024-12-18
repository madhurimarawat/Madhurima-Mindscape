/**
 * File: index.js
 * Author: Madhurima Rawat
 * Date: December 18, 2024
 * Description: This JavaScript file is responsible for dynamic interactions on the homepage of 
 *              the "Madhurima Mindscape" blog. It includes functions for changing the page background 
 *              to a gradient using selected colors and loading external content such as the navbar from 
 *              a separate HTML file.
 * Version: 1.0
 * GitHub Repository: https://github.com/madhurimarawat/Madhurima-Mindscape
 * Issues/Bugs: For any issues or bugs, please visit the GitHub repository issues section.
 */

/**
 * Updates the page background to a gradient using two selected colors.
 * @param {string} color1 - The first color in the gradient.
 * @param {string} color2 - The second color in the gradient.
 */
function changeBackground(color1, color2) {
    document.body.style.background = `linear-gradient(to right, ${color1}, ${color2})`; // Apply gradient background
}

// Wait for the DOM to fully load
document.addEventListener('DOMContentLoaded', function () {
    // Fetch the navbar.html file and inject its contents into the 'header-container' div
    fetch('header.html')
        .then(response => response.text()) // Get the content of the file as text
        .then(data => {
            document.getElementById('header-container').innerHTML = data; // Inject the navbar content into the container
        })
        .catch(error => {
            console.error('Error loading the navbar:', error); // Log an error if the fetch fails
        });
});

// Declare a variable to hold the timeout ID
let dropdownTimeout;

// Function to show the dropdown
function showDropdown() {
    clearTimeout(dropdownTimeout); // Clear any existing timeout to ensure it doesn't hide too early
    const dropdownContent = document.querySelector('.dropdown-content');
    dropdownContent.style.display = 'block'; // Show the dropdown
    dropdownContent.style.opacity = '1'; // Make sure the opacity is fully visible
}

// Function to hide the dropdown after a short delay
function hideDropdown() {
    dropdownTimeout = setTimeout(() => {
        const dropdownContent = document.querySelector('.dropdown-content');
        dropdownContent.style.opacity = '0'; // Fade out
        dropdownContent.style.display = 'none'; // Hide the dropdown
    }, 300); // Adjust this value (in milliseconds) for the desired delay before hiding
}

// Wait for the DOM to fully load before adding event listeners
document.addEventListener('DOMContentLoaded', function () {
    const dropdown = document.querySelector('.dropdown');
    const dropdownContent = document.querySelector('.dropdown-content');

    // Show the dropdown when the user hovers over the dropdown container
    dropdown.addEventListener('mouseenter', function () {
        showDropdown();
    });

    // Show the dropdown when hovering over the dropdown content itself
    dropdownContent.addEventListener('mouseenter', function () {
        showDropdown();
    });

    // Hide the dropdown when the user leaves both the dropdown container and the dropdown content
    dropdown.addEventListener('mouseleave', function () {
        // Only hide the dropdown if the mouse is not inside the dropdown content
        if (!dropdownContent.matches(':hover')) {
            hideDropdown();
        }
    });

    // Hide the dropdown when the user leaves the dropdown content
    dropdownContent.addEventListener('mouseleave', function () {
        // Only hide the dropdown if the mouse is not inside the dropdown container
        if (!dropdown.matches(':hover')) {
            hideDropdown();
        }
    });
});

