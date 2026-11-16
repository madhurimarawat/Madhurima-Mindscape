
/*
*********************************************************************************************
* File: blog-insights.js
* Description: Generates interactive charts for the Blog Insights dashboard.
* Date: 16 November, 2026
*********************************************************************************************
*/

document.addEventListener("DOMContentLoaded", function () {

    // Automatically display today's date
    const dateElement = document.getElementById("current-date");

    if (dateElement) {
        const today = new Date();

        dateElement.textContent = today.toLocaleDateString("en-US", {
            month: "long",
            day: "2-digit",
            year: "numeric"
        });
    }

    // Check whether Chart.js is loaded
    if (typeof Chart === "undefined") {
        console.error("Chart.js is not loaded!");
        return;
    }

    // Get chart data elements
    const categoryElement = document.getElementById("category-data");
    const monthlyElement = document.getElementById("monthly-data");

    // Get canvas elements
    const categoryCanvas = document.getElementById("categoryChart");
    const monthlyCanvas = document.getElementById("monthlyChart");

    if (!categoryElement || !monthlyElement || !categoryCanvas || !monthlyCanvas) {
        console.error("Blog Insights HTML elements are missing!");
        return;
    }

    // Parse Jekyll-generated JSON data
    let categoryData, monthlyData;

    try {
        categoryData = JSON.parse(categoryElement.textContent);
        monthlyData = JSON.parse(monthlyElement.textContent);
    } catch (error) {
        console.error("Unable to parse Blog Insights data:", error);
        return;
    }

    // Check whether posts are available
    if (categoryData.labels.length === 0 || monthlyData.labels.length === 0) {
        console.warn("No published posts found.");
        return;
    }

    // Chart instances
    let categoryChart;
    let monthlyChart;

    // Get current theme colours
    function getChartThemeColors() {

        const currentTheme = localStorage.getItem(
            "madhurima-mindscape-website-theme"
        );

        const isMysteriousNight = currentTheme === "mysterious-night";

        return {
            text: isMysteriousNight ? "#ffffff" : "#000000",

            grid: isMysteriousNight
                ? "rgba(255, 255, 255, 0.15)"
                : "rgba(0, 0, 0, 0.10)"
        };
    }

    // Common bold font settings
    const boldFont = {
        size: 12,
        weight: "bold"
    };

    // Update chart colours whenever the theme changes
    function updateChartTheme() {

        const colors = getChartThemeColors();

        if (categoryChart) {

            categoryChart.options.plugins.legend.labels.color = colors.text;
            categoryChart.options.plugins.legend.labels.font = boldFont;

            categoryChart.update();
        }

        if (monthlyChart) {

            monthlyChart.options.scales.x.ticks.color = colors.text;
            monthlyChart.options.scales.x.ticks.font = boldFont;

            monthlyChart.options.scales.y.ticks.color = colors.text;
            monthlyChart.options.scales.y.ticks.font = boldFont;

            monthlyChart.options.scales.x.grid.color = colors.grid;
            monthlyChart.options.scales.y.grid.color = colors.grid;

            monthlyChart.update();
        }
    }

    // Initial theme colours
    const initialColors = getChartThemeColors();

    // Create category distribution chart
    categoryChart = new Chart(categoryCanvas, {

        type: "doughnut",

        data: {
            labels: categoryData.labels,

            datasets: [{
                data: categoryData.values,
                borderWidth: 2,
                hoverOffset: 10
            }]
        },

        options: {
            responsive: true,
            maintainAspectRatio: false,

            plugins: {
                legend: {
                    position: "bottom",

                    labels: {
                        color: initialColors.text,
                        padding: 10,

                        font: boldFont
                    }
                }
            }
        }
    });

    // Create monthly publishing activity chart
    monthlyChart = new Chart(monthlyCanvas, {

        type: "bar",

        data: {
            labels: monthlyData.labels,

            datasets: [{
                label: "Published Articles",
                data: monthlyData.values,
                borderRadius: 7,
                borderWidth: 1
            }]
        },

        options: {
            responsive: true,
            maintainAspectRatio: false,

            plugins: {
                legend: {
                    display: false
                }
            },

            scales: {
                x: {
                    ticks: {
                        color: initialColors.text,
                        font: boldFont
                    },

                    grid: {
                        color: initialColors.grid
                    }
                },

                y: {
                    beginAtZero: true,

                    ticks: {
                        precision: 0,
                        color: initialColors.text,
                        font: boldFont
                    },

                    grid: {
                        color: initialColors.grid
                    }
                }
            }
        }
    });

    // Listen for theme changes in the current tab
    const themeObserver = new MutationObserver(function () {
        updateChartTheme();
    });

    themeObserver.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ["class", "data-theme"]
    });

    // Also observe body theme changes
    themeObserver.observe(document.body, {
        attributes: true,
        attributeFilter: ["class", "data-theme"]
    });

    // Listen for theme changes from another browser tab
    window.addEventListener("storage", function (event) {

        if (event.key === "madhurima-mindscape-website-theme") {
            updateChartTheme();
        }
    });

    // Listen for direct theme-switcher notifications
    window.addEventListener("websiteThemeChanged", updateChartTheme);

    console.log("Blog Insights charts initialized successfully!");

});
