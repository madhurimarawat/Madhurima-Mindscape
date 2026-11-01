
/*
*********************************************************************************************
* File: blog-insights.js
* Description: Generates interactive charts for the Blog Insights dashboard.
*********************************************************************************************
*/

document.addEventListener("DOMContentLoaded", function () {

    // Automatically display today's date
    const dateElement = document.getElementById("current-date");

    if (dateElement) {
        const today = new Date();

        dateElement.textContent = today.toLocaleDateString("en-GB", {
            weekday: "long",
            day: "numeric",
            month: "long",
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

    // Check whether all required HTML elements exist
    if (!categoryElement || !monthlyElement || !categoryCanvas || !monthlyCanvas) {
        console.error("Blog Insights HTML elements are missing!");
        return;
    }

    // Get the saved website theme from localStorage
    const currentTheme = localStorage.getItem(
        "madhurima-mindscape-website-theme"
    );

    // Set chart label colour based on the selected theme
    const graphTextColor = currentTheme === "mysterious-night"
        ? "#ffffff"
        : "#000000";

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
        console.warn("No published posts found. Check your _posts folder and front matter.");
        return;
    }

    // Create category distribution chart
    new Chart(categoryCanvas, {
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
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: "bottom",
                    labels: {
                        color: graphTextColor
                    }
                }
            }
        }
    });

    // Create monthly publishing activity chart
    new Chart(monthlyCanvas, {
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
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    display: false,
                    labels: {
                        color: graphTextColor
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: graphTextColor
                    }
                },
                y: {
                    beginAtZero: true,
                    ticks: {
                        precision: 0,
                        color: graphTextColor
                    }
                }
            }
        }
    });

    console.log("Blog Insights charts initialized successfully!");

});
