/**
 * File: index.js
 * Author: Madhurima Rawat
 * Date: October 31, 2026
 *
 * Description:
 * Controls dynamic interactions on Madhurima Mindscape.
 *
 * Features:
 * - Theme selection and persistence.
 * - Dynamic background gradients.
 * - Bootstrap carousel visibility.
 * - Desktop and mobile dropdown functionality.
 * - Jekyll-based reusable HTML components.
 *
 * Version: 1.1
 */

// ==================================================
// THEME MANAGEMENT
// ==================================================

/**
 * Applies the selected theme by updating the body class,
 * background gradient, and carousel visibility.
 *
 * @param {string} themeName
 * @param {string|null} color1
 * @param {string|null} color2
 */

function applyTheme(themeName, color1 = null, color2 = null) {

    const body = document.body;

    // Remove previously applied theme classes.
    body.className = body.className
        .split(' ')
        .filter(cls => !cls.startsWith('theme-'))
        .join(' ');

    // Load theme stylesheet only once.
    if (!document.getElementById('theme-css')) {

        const link = document.createElement('link');

        link.rel = 'stylesheet';
        link.id = 'theme-css';
        link.href = 'css/themes.css';

        document.head.appendChild(link);
    }

    // Reference to Bootstrap carousel.
    const carousel = document.getElementById(
        'carouselExampleIndicators'
    );

    if (themeName !== 'default') {

        body.classList.add(`theme-${themeName}`);

        const backgroundGradients = {

            "sunset-vibes": ["#ff7e5f", "#feb47b"],
            "ocean-breeze": ["#2bc0e4", "#eaecc6"],
            "lavender-dream": ["#c2a6ff", "#d6c1ff"],
            "mysterious-night": ["#1a1a1a", "#333333"]

        };

        let [startColor, endColor] =
            backgroundGradients[themeName] || ["white", "white"];

        // Apply custom colors if supplied.
        if (color1 && color2) {

            startColor = color1;
            endColor = color2;

        }

        body.style.background =
            `linear-gradient(to right, ${startColor}, ${endColor})`;

        // Themes that display the carousel.
        const themesWithSlider = [
            'sunset-vibes',
            'default'
        ];

        if (carousel) {

            carousel.style.display =
                themesWithSlider.includes(themeName) ? '' : 'none';

        }

    } else {

        body.style.background =
            'linear-gradient(to right, #fdd835, #f8a5b1)';

        if (carousel) {
            carousel.style.display = '';
        }

    }

    // Save selected theme.
    try {

        localStorage.setItem(
            'madhurima-mindscape-website-theme',
            themeName
        );

        console.log("Theme saved:", themeName);

    } catch (error) {

        console.warn(
            "localStorage is unavailable:",
            error
        );

    }

}


// ==================================================
// DROPDOWN MANAGEMENT
// ==================================================

function showDropdown() {

    const dropdownContent =
        document.querySelector('.dropdown-content');

    if (dropdownContent) {

        dropdownContent.style.display = 'block';

    }

}


function hideDropdown() {

    const dropdownContent =
        document.querySelector('.dropdown-content');

    if (dropdownContent) {

        dropdownContent.style.display = 'none';

    }

}


// ==================================================
// SETUP DESKTOP AND MOBILE DROPDOWN
// ==================================================

function setupDropdown() {

    const dropdown =
        document.querySelector('.dropdown');

    const dropdownContent =
        document.querySelector('.dropdown-content');

    // Stop if dropdown elements are unavailable.
    if (!dropdown || !dropdownContent) {

        return;

    }

    // Prevent duplicate event listeners.
    if (dropdown.dataset.initialized === 'true') {

        return;

    }

    dropdown.dataset.initialized = 'true';


    // ----------------------------------------------
    // DESKTOP: MOUSE HOVER
    // ----------------------------------------------

    dropdown.addEventListener('mouseenter', () => {

        if (window.innerWidth > 768) {

            showDropdown();

        }

    });


    dropdown.addEventListener('mouseleave', () => {

        if (window.innerWidth > 768) {

            hideDropdown();

        }

    });


    dropdownContent.addEventListener('mouseenter', () => {

        if (window.innerWidth > 768) {

            showDropdown();

        }

    });


    dropdownContent.addEventListener('mouseleave', () => {

        if (window.innerWidth > 768) {

            hideDropdown();

        }

    });


    // ----------------------------------------------
    // MOBILE: TAP TO TOGGLE
    // ----------------------------------------------

    dropdown.addEventListener('click', function (event) {

        if (window.innerWidth <= 768) {

            event.preventDefault();
            event.stopPropagation();

            const isVisible =
                dropdownContent.style.display === 'block';

            dropdownContent.style.display =
                isVisible ? 'none' : 'block';

        }

    });


    // ----------------------------------------------
    // MOBILE: THEME SELECTION
    // ----------------------------------------------

    const links =
        dropdownContent.querySelectorAll('a');

    links.forEach(link => {

        link.addEventListener('click', function (event) {

            if (window.innerWidth <= 768) {

                const onclickAttr =
                    this.getAttribute('onclick');

                // Allow normal navigation for ordinary links.
                if (onclickAttr) {

                    event.preventDefault();
                    event.stopPropagation();

                    // Theme functions are globally accessible.
                    const themeMatch = onclickAttr.match(
                        /applyTheme\s*\(\s*['"]([^'"]+)['"]/
                    );

                    if (themeMatch) {

                        applyTheme(themeMatch[1]);

                    }

                }

            }

        });

    });


    // ----------------------------------------------
    // MOBILE: CLOSE WHEN TAPPING OUTSIDE
    // ----------------------------------------------

    document.addEventListener('click', function (event) {

        if (
            window.innerWidth <= 768 &&
            !dropdown.contains(event.target)
        ) {

            hideDropdown();

        }

    });

}


// ==================================================
// INITIALIZE WEBSITE
// ==================================================

document.addEventListener('DOMContentLoaded', function () {

    console.log("Madhurima Mindscape initialized.");

    // ----------------------------------------------
    // RESTORE SAVED THEME
    // ----------------------------------------------

    try {

        const savedTheme = localStorage.getItem(
            'madhurima-mindscape-website-theme'
        );

        console.log("Loaded saved theme:", savedTheme);

        applyTheme(savedTheme || 'default');

    } catch (error) {

        console.warn(
            "Error loading saved theme:",
            error
        );

        applyTheme('default');

    }


    // ----------------------------------------------
    // INITIALIZE NAVBAR DROPDOWN
    // ----------------------------------------------

    // Header is already inserted by Jekyll.
    setupDropdown();

});