
/*
*********************************************************************************************
* File: blog-insights.js
* Description: Interactive editorial charts for Madhurima Mindscape Blog Insights.
* Features: Category distribution, publishing timeline and dynamic theme support.
* Date: 27 November, 2026
*********************************************************************************************
*/

document.addEventListener("DOMContentLoaded", function () {

    // ==================================================
    // CURRENT DATE
    // ==================================================

    const dateElement = document.getElementById("current-date");

    if (dateElement) {

        const today = new Date();

        dateElement.textContent = today.toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric"
        });

    }


    // ==================================================
    // CHECK CHART.JS
    // ==================================================

    if (typeof Chart === "undefined") {

        console.error("Chart.js is not loaded!");
        return;

    }


    // ==================================================
    // GET CHART ELEMENTS
    // ==================================================

    const categoryElement = document.getElementById("category-data");
    const monthlyElement = document.getElementById("monthly-data");

    const categoryCanvas = document.getElementById("categoryChart");
    const monthlyCanvas = document.getElementById("monthlyChart");

    if (!categoryElement || !monthlyElement) {

        console.error("Blog Insights chart data is missing!");
        return;

    }


    // ==================================================
    // PARSE CHART DATA
    // ==================================================

    let categoryData;
    let monthlyData;

    try {

        categoryData = JSON.parse(categoryElement.textContent);
        monthlyData = JSON.parse(monthlyElement.textContent);

    } catch (error) {

        console.error("Unable to parse Blog Insights data:", error);
        return;

    }


    // ==================================================
    // CHART INSTANCES
    // ==================================================

    let categoryChart = null;
    let monthlyChart = null;


    // ==================================================
    // CATEGORY CHART COLORS
    // ==================================================

    const categoryColors = [
        "#d94b91",
        "#9b7bd8",
        "#65a8bc",
        "#e6a46c",
        "#86a98d",
        "#d58b9d",
        "#8d91c9",
        "#c49b72",
        "#78a8a1",
        "#bc83bd"
    ];


    // ==================================================
    // THEME MANAGEMENT
    // ==================================================

    const THEME_STORAGE_KEY =
        "madhurima-mindscape-website-theme";


    /*
     * Get the active website theme.
     */
    function getActiveTheme() {

        try {

            return localStorage.getItem(THEME_STORAGE_KEY) || "default";

        } catch (error) {

            return "default";

        }

    }


    /*
     * Get the actual CSS variables from BODY.
     *
     * Important:
     * Your theme classes are applied to BODY,
     * so we must read the computed styles from BODY.
     */
    function getChartThemeColors() {

        const bodyStyles = getComputedStyle(document.body);

        const headingColor = bodyStyles
            .getPropertyValue("--h2-color")
            .trim();

        const textColor = bodyStyles
            .getPropertyValue("--text-color")
            .trim();

        const theme = getActiveTheme();

        // Fallback colors matching your theme definitions.
        const themeFallbacks = {

            "default": {
                heading: "#db4583",
                text: "black"
            },

            "sunset-vibes": {
                heading: "whitesmoke",
                text: "black"
            },

            "ocean-breeze": {
                heading: "#4b82a7",
                text: "black"
            },

            "lavender-dream": {
                heading: "#954ba7",
                text: "black"
            },

            "mysterious-night": {
                heading: "bisque",
                text: "whitesmoke"
            }

        };

        const fallback = themeFallbacks[theme] ||
            themeFallbacks.default;

        return {

            heading: headingColor || fallback.heading,

            text: textColor || fallback.text,

            grid: theme === "mysterious-night"
                ? "rgba(255, 255, 255, 0.16)"
                : "rgba(0, 0, 0, 0.10)"

        };

    }


    /*
     * Convert any browser-supported CSS color into RGBA.
     * This is used to create the monthly chart area fill.
     */
    function getTransparentColor(color, opacity) {

        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");

        context.fillStyle = color;

        const normalizedColor = context.fillStyle;

        const match = normalizedColor.match(
            /^#([0-9a-f]{3,8})$/i
        );

        if (match) {

            let hex = match[1];

            if (hex.length === 3 || hex.length === 4) {

                hex = hex.split("")
                    .map(character => character + character)
                    .join("");

            }

            const red = parseInt(hex.substring(0, 2), 16);
            const green = parseInt(hex.substring(2, 4), 16);
            const blue = parseInt(hex.substring(4, 6), 16);

            return `rgba(${red}, ${green}, ${blue}, ${opacity})`;

        }

        const rgbMatch = normalizedColor.match(
            /^rgba?\(\s*([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)/
        );

        if (rgbMatch) {

            return `rgba(${rgbMatch[1]}, ${rgbMatch[2]}, ${rgbMatch[3]}, ${opacity})`;

        }

        return color;

    }


    // ==================================================
    // CHART TYPOGRAPHY
    // ==================================================

    const chartFont = {

        family: "Arial, sans-serif",

        size: 12,

        weight: "bold"

    };


    function getTickOptions(color) {

        return {

            color: color,

            font: chartFont

        };

    }


    // ==================================================
    // INITIAL THEME COLORS
    // ==================================================

    const initialColors = getChartThemeColors();


    // ==================================================
    // CATEGORY DISTRIBUTION CHART
    // ==================================================

    if (
        categoryCanvas &&
        categoryData.labels.length > 0
    ) {

        categoryChart = new Chart(categoryCanvas, {

            type: "bar",

            data: {

                labels: categoryData.labels,

                datasets: [{

                    label: "Published Articles",

                    data: categoryData.values,

                    backgroundColor: categoryData.labels.map(
                        (_, index) =>
                            categoryColors[index % categoryColors.length]
                    ),

                    borderRadius: 7,

                    borderSkipped: false,

                    barThickness: 19,

                    maxBarThickness: 24

                }]

            },

            options: {

                indexAxis: "y",

                responsive: true,

                maintainAspectRatio: false,

                interaction: {

                    intersect: false,

                    mode: "nearest"

                },

                plugins: {

                    legend: {

                        display: false

                    },

                    tooltip: {

                        backgroundColor: "#28232d",

                        titleColor: "#ffffff",

                        bodyColor: "#ffffff",

                        titleFont: chartFont,

                        bodyFont: chartFont,

                        padding: 12,

                        cornerRadius: 8,

                        callbacks: {

                            label: function (context) {

                                const count = context.parsed.x;

                                return " " + count +
                                    (count === 1
                                        ? " article"
                                        : " articles");

                            }

                        }

                    }

                },

                scales: {

                    x: {

                        beginAtZero: true,

                        ticks: {

                            precision: 0,

                            font: chartFont,

                            color: initialColors.text

                        },

                        grid: {

                            color: initialColors.grid,

                            drawBorder: false

                        }

                    },

                    y: {

                        ticks: {

                            font: chartFont,

                            color: initialColors.text

                        },

                        grid: {

                            display: false

                        }

                    }

                }

            }

        });

    }


    // ==================================================
    // MONTHLY PUBLISHING JOURNEY CHART
    // ==================================================

    if (
        monthlyCanvas &&
        monthlyData.labels.length > 0
    ) {

        // Convert YYYY-MM into readable month labels.

        const readableMonths = monthlyData.labels.map(
            function (month) {

                const parts = month.split("-");

                return new Date(
                    Number(parts[0]),
                    Number(parts[1]) - 1,
                    1
                ).toLocaleDateString("en-US", {

                    month: "short",

                    year: "numeric"

                });

            }
        );


        monthlyChart = new Chart(monthlyCanvas, {

            type: "line",

            data: {

                labels: readableMonths,

                datasets: [{

                    label: "Published Articles",

                    data: monthlyData.values,

                    // Active theme heading color.
                    borderColor: initialColors.heading,

                    // Transparent version of active theme color.
                    backgroundColor: getTransparentColor(
                        initialColors.heading,
                        0.15
                    ),

                    borderWidth: 3,

                    fill: true,

                    tension: 0.35,

                    pointRadius: 5,

                    pointHoverRadius: 8,

                    pointBackgroundColor: initialColors.heading,

                    pointBorderColor: "#ffffff",

                    pointBorderWidth: 2

                }]

            },

            options: {

                responsive: true,

                maintainAspectRatio: false,

                interaction: {

                    intersect: false,

                    mode: "index"

                },

                plugins: {

                    legend: {

                        display: false

                    },

                    tooltip: {

                        backgroundColor: "#28232d",

                        titleColor: "#ffffff",

                        bodyColor: "#ffffff",

                        titleFont: chartFont,

                        bodyFont: chartFont,

                        padding: 12,

                        cornerRadius: 8,

                        callbacks: {

                            label: function (context) {

                                const count = context.parsed.y;

                                return " " + count +
                                    (count === 1
                                        ? " published article"
                                        : " published articles");

                            }

                        }

                    }

                },

                scales: {

                    x: {

                        ticks: {

                            font: chartFont,

                            color: initialColors.text,

                            maxRotation: 45,

                            minRotation: 0

                        },

                        grid: {

                            display: false

                        }

                    },

                    y: {

                        beginAtZero: true,

                        ticks: {

                            precision: 0,

                            font: chartFont,

                            color: initialColors.text

                        },

                        grid: {

                            color: initialColors.grid,

                            drawBorder: false

                        }

                    }

                }

            }

        });

    }


    // ==================================================
    // UPDATE CHARTS WHEN THEME CHANGES
    // ==================================================

    function updateChartTheme() {

        const colors = getChartThemeColors();


        // ----------------------------------------------
        // CATEGORY CHART
        // ----------------------------------------------

        if (categoryChart) {

            categoryChart.options.scales.x.ticks =
                getTickOptions(colors.text);

            categoryChart.options.scales.y.ticks =
                getTickOptions(colors.text);

            categoryChart.options.scales.x.grid.color =
                colors.grid;

            categoryChart.options.scales.y.grid.color =
                colors.grid;

            categoryChart.update();

        }


        // ----------------------------------------------
        // MONTHLY CHART
        // ----------------------------------------------

        if (monthlyChart) {

            monthlyChart.options.scales.x.ticks =
                getTickOptions(colors.text);

            monthlyChart.options.scales.y.ticks =
                getTickOptions(colors.text);

            monthlyChart.options.scales.x.grid.color =
                colors.grid;

            monthlyChart.options.scales.y.grid.color =
                colors.grid;


            // Update line color from --h2-color.

            monthlyChart.data.datasets[0].borderColor =
                colors.heading;


            // Update chart area fill.

            monthlyChart.data.datasets[0].backgroundColor =
                getTransparentColor(colors.heading, 0.15);


            // Update data point colors.

            monthlyChart.data.datasets[0].pointBackgroundColor =
                colors.heading;


            monthlyChart.update();

        }

    }


    // ==================================================
    // APPLY INITIAL THEME
    // ==================================================

    updateChartTheme();


    // ==================================================
    // OBSERVE WEBSITE THEME CHANGES
    // ==================================================

    const themeObserver = new MutationObserver(function () {

        updateChartTheme();

    });


    // Theme classes are applied to BODY.

    themeObserver.observe(document.body, {

        attributes: true,

        attributeFilter: [

            "class",

            "style",

            "data-theme"

        ]

    });


    // Also observe root-level theme changes.

    themeObserver.observe(document.documentElement, {

        attributes: true,

        attributeFilter: [

            "class",

            "style",

            "data-theme"

        ]

    });


    // ==================================================
    // LISTEN FOR LOCAL STORAGE THEME CHANGES
    // ==================================================

    window.addEventListener("storage", function (event) {

        if (event.key === THEME_STORAGE_KEY) {

            updateChartTheme();

        }

    });


    // ==================================================
    // LISTEN FOR CUSTOM THEME EVENTS
    // ==================================================

    window.addEventListener(
        "websiteThemeChanged",
        updateChartTheme
    );


    // ==================================================
    // INITIALIZATION COMPLETE
    // ==================================================

    console.log(
        "Madhurima Mindscape Blog Insights initialized successfully!"
    );

    console.log(
        "Active theme:",
        getActiveTheme()
    );

    console.log(
        "Active chart heading color:",
        getChartThemeColors().heading
    );

});
