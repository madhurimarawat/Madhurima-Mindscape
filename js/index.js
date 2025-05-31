/**
 * File: index.js
 * Author: Madhurima Rawat
 * Date: May 31, 2025
 * Description: This JavaScript file controls dynamic interactions on the homepage of 
 *              the "Madhurima Mindscape" blog. It includes functions to apply background 
 *              gradients based on selected themes or custom colors, manage the visibility 
 *              of the Bootstrap carousel (slider), and dynamically load external HTML 
 *              components such as the navbar and footer. The logic now shows the slider 
 *              only for specific themes instead of hiding it for some.
 * Version: 1.1
 * GitHub Repository: https://github.com/madhurimarawat/Madhurima-Mindscape
 * Issues/Bugs: For any issues or bugs, please visit the GitHub repository issues section.
 */

/**
 * Applies the selected theme by updating the body class, background gradient,
 * and carousel visibility. Also saves the selected theme in localStorage.
 *
 * @param {string} themeName - Name of the theme (e.g., "sunset-vibes" or "default")
 * @param {string|null} color1 - Optional override for gradient start color
 * @param {string|null} color2 - Optional override for gradient end color
 */
function applyTheme(themeName, color1 = null, color2 = null) {
    const body = document.body;

    // ✅ Remove all previously applied theme classes (prefix: "theme-")
    body.className = body.className
        .split(' ')
        .filter(cls => !cls.startsWith('theme-'))
        .join(' ');

    // ✅ Ensure the theme stylesheet is added only once
    if (!document.getElementById('theme-css')) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.id = 'theme-css';
        link.href = 'css/themes.css';
        document.head.appendChild(link);
    }

    // 🎠 Reference to the Bootstrap carousel
    const carousel = document.getElementById('carouselExampleIndicators');

    if (themeName !== 'default') {
        // ✅ Add the selected theme class
        body.classList.add(`theme-${themeName}`);

        // 🎨 Predefined theme gradients
        const backgroundGradients = {
            "sunset-vibes": ["#ff7e5f", "#feb47b"],
            "ocean-breeze": ["#2bc0e4", "#eaecc6"],
            "lavender-dream": ["#c2a6ff", "#d6c1ff"],
            "autumn-leaves": ["#ff9a8b", "#ffb8b2"],
            "mysterious-night": ["#1a1a1a", "#333333"],
            "tropical-paradise": ["#00b4db", "#0083b0"]
        };

        // 🎨 Use either passed custom colors or predefined theme gradient
        let [startColor, endColor] = backgroundGradients[themeName] || ["white", "white"];
        if (color1 && color2) {
            startColor = color1;
            endColor = color2;
        }

        // ✅ Apply background gradient
        body.style.background = `linear-gradient(to right, ${startColor}, ${endColor})`;

        // ✅ Show slider only for specific themes
        const themesWithSlider = ['sunset-vibes', 'default']; // Add the themes where the slider should appear
        if (carousel) {
            carousel.style.display = themesWithSlider.includes(themeName) ? '' : 'none';
        }

    } else {
        // 🌐 Default fallback: no theme class, no background
        body.style.background = '';
        if (carousel) carousel.style.display = '';
    }

    // 💾 Save the selected theme to localStorage
    console.log("Trying to save theme:", themeName); // DEBUG LINE
    try {
        localStorage.setItem('selectedTheme', themeName);
        console.log("✅ Theme saved to localStorage:", themeName); // DEBUG LINE
    } catch (e) {
        console.warn("⚠️ localStorage is not available or quota exceeded:", e);
    }

}

/**
 * On DOM content loaded, load the saved theme from localStorage (if any)
 * and apply it to the page. If no saved theme is found, apply the default theme.
 *
 * This ensures the user's theme preference persists across page reloads.
 */
document.addEventListener('DOMContentLoaded', () => {
    try {
        // Retrieve the saved theme name from localStorage
        const savedTheme = localStorage.getItem('selectedTheme');
        console.log("🧾 Loaded theme from localStorage:", savedTheme); // Debug: show loaded theme

        // Apply the saved theme; if none found, apply 'default' theme
        applyTheme(savedTheme || 'default');
    } catch (e) {
        // Handle errors if localStorage is unavailable or throws errors (e.g. private mode)
        console.warn("⚠️ localStorage getItem error:", e);
    }
});


// Wait for the DOM to fully load
document.addEventListener('DOMContentLoaded', function () {
    // Load header
    fetch('components/header.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('header-container').innerHTML = data;
            setupDropdown(); // Optional: setup dropdown if header includes it
        })
        .catch(error => {
            console.error('Error loading the header:', error);
        });

    // Load footer
    fetch('components/footer.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('footer-container').innerHTML = data;
        })
        .catch(error => {
            console.error('Error loading the footer:', error);
        });
});

/**
 * Ensures dropdown interactions are properly set up after the navbar is loaded.
 */
function setupDropdown() {
    const dropdown = document.querySelector('.dropdown');
    const dropdownContent = document.querySelector('.dropdown-content');

    if (dropdown && dropdownContent) {
        // Show the dropdown when hovering over the dropdown container
        dropdown.addEventListener('mouseenter', showDropdown);
        dropdownContent.addEventListener('mouseenter', showDropdown);

        // Hide the dropdown when the user leaves both the dropdown container and dropdown content
        dropdown.addEventListener('mouseleave', function () {
            if (!dropdownContent.matches(':hover')) hideDropdown();
        });

        dropdownContent.addEventListener('mouseleave', function () {
            if (!dropdown.matches(':hover')) hideDropdown();
        });
    } else {
        console.error("Dropdown elements not found. Ensure header.html contains the necessary elements.");
    }
}