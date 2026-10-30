/**
 * File: index.js
 * Author: Madhurima Rawat
 * Date: October 30, 2026
 * Description: This JavaScript file controls dynamic interactions on the homepage of 
 *              the "Madhurima Mindscape" blog. It includes functions to apply background 
 *              gradients based on selected themes or custom colors, manage the visibility 
 *              of the Bootstrap carousel (slider), and dynamically load external HTML 
 *              components such as the navbar and footer. The logic now shows the slider 
 *              only for specific themes instead of hiding it for some.
 * Version: 1.0
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
        body.classList.add(`theme-${themeName}`);

        const backgroundGradients = {
            "sunset-vibes": ["#ff7e5f", "#feb47b"],
            "ocean-breeze": ["#2bc0e4", "#eaecc6"],
            "lavender-dream": ["#c2a6ff", "#d6c1ff"],
            "mysterious-night": ["#1a1a1a", "#333333"],
        };

        let [startColor, endColor] = backgroundGradients[themeName] || ["white", "white"];
        if (color1 && color2) {
            startColor = color1;
            endColor = color2;
        }

        body.style.background = `linear-gradient(to right, ${startColor}, ${endColor})`;

        const themesWithSlider = ['sunset-vibes', 'default'];
        if (carousel) {
            carousel.style.display = themesWithSlider.includes(themeName) ? '' : 'none';
        }

    } else {
        body.style.background = 'linear-gradient(to right, #fdd835, #f8a5b1)';
        if (carousel) carousel.style.display = '';
    }

    // ✅ Save the theme (single consistent key)
    try {
        localStorage.setItem('madhurima-mindscape-website-theme', themeName);
        console.log("💾 Theme saved:", themeName);
    } catch (e) {
        console.warn("⚠️ localStorage is not available or quota exceeded:", e);
    }
}

// ✅ Apply theme on first load from saved preference
document.addEventListener("DOMContentLoaded", () => {
    try {
        const savedTheme = localStorage.getItem('madhurima-mindscape-website-theme');
        console.log("🧾 Loaded saved theme:", savedTheme);
        applyTheme(savedTheme || 'default');
    } catch (e) {
        console.warn("⚠️ Error loading theme from localStorage:", e);
        applyTheme('default');
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

    // Load hero section
    fetch('components/icon-hero-section.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('hero-container').innerHTML = data;
        })
        .catch(error => {
            console.error('Error loading the hero:', error);
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


function showDropdown() {
    // 🔍 Find dropdown content element
    const dropdownContent = document.querySelector('.dropdown-content');
    if (dropdownContent) {
        // 👀 Show the dropdown by setting display to block
        dropdownContent.style.display = 'block';
    }
}

function hideDropdown() {
    // 🔍 Find dropdown content element
    const dropdownContent = document.querySelector('.dropdown-content');
    if (dropdownContent) {
        // 🙈 Hide the dropdown by setting display to none
        dropdownContent.style.display = 'none';
    }
}

function setupDropdown() {
    // 🔍 Select dropdown container and its content
    const dropdown = document.querySelector('.dropdown');
    const dropdownContent = document.querySelector('.dropdown-content');

    // 🚫 If dropdown or content is missing, do nothing
    if (!dropdown || !dropdownContent) {
        return;
    }

    // 💻 Desktop: Show dropdown when mouse enters dropdown area
    dropdown.addEventListener('mouseenter', () => {
        if (window.innerWidth > 768) showDropdown();
    });

    // 💻 Desktop: Hide dropdown when mouse leaves dropdown area
    dropdown.addEventListener('mouseleave', () => {
        if (window.innerWidth > 768) hideDropdown();
    });

    // 💻 Desktop: Keep dropdown visible when mouse is over the content itself
    dropdownContent.addEventListener('mouseenter', () => {
        if (window.innerWidth > 768) showDropdown();
    });

    // 💻 Desktop: Hide dropdown when mouse leaves content area
    dropdownContent.addEventListener('mouseleave', () => {
        if (window.innerWidth > 768) hideDropdown();
    });

    // 📱 Mobile: Toggle dropdown visibility on tap/click on dropdown
    dropdown.addEventListener('click', function (e) {
        if (window.innerWidth <= 768) {
            e.preventDefault(); // 🚫 Prevent link from redirecting
            e.stopPropagation(); // ✋ Stop event from bubbling up and closing dropdown
            const isVisible = dropdownContent.style.display === 'block';
            // 🔄 Toggle dropdown display
            dropdownContent.style.display = isVisible ? 'none' : 'block';
        }
    });

    // 📱 Mobile: Handle clicks on links inside dropdown to prevent page reload
    const links = dropdownContent.querySelectorAll('a');
    links.forEach(link => {
        link.addEventListener('click', function (e) {
            if (window.innerWidth <= 768) {
                e.preventDefault(); // 🚫 Prevent default navigation
                e.stopPropagation(); // ✋ Keep dropdown open by stopping event propagation
                const onclickAttr = this.getAttribute('onclick');
                if (onclickAttr) {
                    // ⚡ Run the inline onclick code manually (e.g., theme switch)
                    eval(onclickAttr);
                }
                // ➡️ Do not hide dropdown after link click — keep it visible
            }
        });
    });

    // 📱 Mobile: Clicking outside dropdown hides it
    document.addEventListener('click', function (e) {
        if (window.innerWidth <= 768 && !dropdown.contains(e.target)) {
            hideDropdown(); // 🙈 Hide dropdown when user taps outside
        }
    });
}

// 🚀 Initialize dropdown functionality when DOM is fully loaded
document.addEventListener('DOMContentLoaded', setupDropdown);