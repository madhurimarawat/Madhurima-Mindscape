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
 *
 * Functions:
 * - changeBackground: Updates the page's background to a gradient based on two selected colors.
 *
 * Dependencies:
 * - header.html: Contains the structure and content for the navigation bar, which is dynamically loaded.
 *
 * Comments:
 * - The changeBackground function is used to dynamically alter the page's background gradient.
 * - On page load, the script fetches the content of the navbar from the `header.html` file and 
 *   injects it into the 'header-container' div to display the navigation bar.
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

    // Show the dropdown when the user hovers over the dropdown container
    dropdown.addEventListener('mouseenter', showDropdown);

    // Hide the dropdown after the hover ends
    dropdown.addEventListener('mouseleave', hideDropdown);
});

