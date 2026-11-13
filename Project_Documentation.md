# Madhurima Mindscape - Project Documentation

**Technical documentation covering the architecture, technologies, features, and development workflow of Madhurima Mindscape.**

## Introduction

Madhurima Mindscape is a Jekyll-powered personal blogging platform for publishing and organizing articles on personal reflections, technology, project experiences, poetry, and creative photography.

The website uses Jekyll's static site generation capabilities along with reusable Liquid templates, structured YAML data, responsive frontend design, and JavaScript for interactive features.

This document explains the technologies used in the project, its main features, Jekyll architecture, directory structure, and website generation process. It also covers local development, content management, and the steps involved in adding new blog posts.

## Documentation Overview

This document is intended as a technical reference for anyone who wants to understand, maintain, or extend Madhurima Mindscape.

It covers:

- **Technology Stack:** Languages, frameworks, tools, and browser APIs used in the project.
- **Features and Functionalities:** How the website's interactive and content-related features work.
- **Jekyll Architecture:** The role of layouts, includes, structured data, and content files.
- **Project Structure:** How directories, files, stylesheets, and scripts are organized.
- **Website Workflow:** How Jekyll processes the source files and generates the website.
- **Local Development:** Required tools, installation, and instructions for running the website locally.
- **Content Management:** How to create and publish new blog posts.
- **Contribution Guidelines:** Steps for suggesting changes and contributing to the project.

---

## Table of Contents

- [About the Project](#about-the-project)
- [Technology Stack](#technology-stack)
- [Features and Functionalities](#features-and-functionalities)
- [Blog Categories](#blog-categories)
- [Blog Reading Experience](#blog-reading-experience)
- [Blog Discovery and Management Tools](#blog-discovery-and-management-tools)
- [SEO and Website Optimization](#seo-and-website-optimization)
- [Jekyll Architecture](#jekyll-architecture)
- [Project Directory Structure](#project-directory-structure)
- [How the Website Works](#how-the-website-works)
- [Getting Started](#getting-started)
- [Running Locally](#running-locally)
- [Adding a New Blog Post](#adding-a-new-blog-post)
- [Contributing](#contributing)
- [Connect With Me](#connect-with-me)

---

## About the Project

Madhurima Mindscape is a personal space for documenting experiences, sharing technical knowledge, exploring creative interests, and learning through writing.

The website is built with Jekyll, a static site generator that converts content, data files, and reusable templates into a complete static website.

Moving the project to Jekyll helped organize its code and content more clearly. Blog posts, metadata, reusable components, layouts, stylesheets, and JavaScript functionality are maintained separately.

The website includes:

- Personal stories and reflections.
- Technical articles and tutorials.
- Project development experiences.
- Poetry and creative writing.
- Photography and visual content.
- Interactive features for reading and engaging with articles.
- Tools for discovering and bookmarking posts.
- Blog insights and reusable content templates.

## Technology Stack

Madhurima Mindscape uses Jekyll for static site generation and frontend technologies for its design and interactive features.

| Technology | Purpose |
|---|---|
| **Jekyll** | Static site generation and blog management |
| **Ruby** | Jekyll runtime and dependency environment |
| **Liquid** | Templates, loops, conditions, and data rendering |
| **HTML5** | Website structure and content |
| **CSS3** | Styling, responsive layouts, and visual design |
| **JavaScript** | Interactive components and client-side functionality |
| **YAML** | Website configuration, structured metadata, and SEO data |
| **Font Awesome** | Icons used in navigation and blog sections |
| **LocalStorage** | Storing saved articles in the browser |
| **Web Share API** | Native content sharing where supported |
| **Clipboard API** | Copying blog links |
| **Web Speech API** | Browser-based read-aloud functionality |
| **XML** | RSS feed generation |
| **Git & GitHub** | Version control and repository management |
| **GitHub Pages** | Website hosting and deployment |

### Development and Browser Technologies

Several browser-native APIs are used to provide interactive features without requiring a dedicated backend for each one.

These include:

- LocalStorage for saving articles in the browser.
- Web Share API for native sharing on supported devices and browsers.
- Clipboard API for copying article links.
- Speech synthesis for reading blog content aloud.
- CSS media queries and theme-aware styles for responsive presentation.

---

## Features and Functionalities

### 1. Responsive Website Design

- Adapts the interface to desktop, tablet, and mobile screen sizes.
- Uses flexible layouts to present content across different devices.
- Adjusts visual elements according to the active theme.
- Maintains consistent styling across website sections.

### 2. Multiple Website Themes

- Offers multiple themes to suit different visual preferences.
- Updates colors across website elements when the theme changes.
- Applies theme-aware styling to headings, icons, and hero sections.
- Keeps interactive components consistent with the selected theme.

### 3. Interactive Icon-Based Hero Section

- Displays Font Awesome icons linked to individual blog posts.
- Allows visitors to open the corresponding articles directly.
- Includes an interactive slider/carousel.
- Changes icon colors according to the active website theme and heading colors.
- Provides another way to browse and discover articles.

### 4. Reusable Blog Templates

- Uses a shared Jekyll layout for individual blog posts.
- Maintains a consistent structure and appearance across articles.
- Includes reusable components for post actions.
- Supports structured categories, tags, and metadata.
- Keeps common presentation logic in shared files rather than repeating it in every post.

### 5. Interactive Blog Post Actions

Each blog post uses a shared set of components for bookmarking, commenting, and sharing.

**Save Articles**

- Save and unsave individual blog posts.
- Store saved article information using browser LocalStorage.
- Keep saved articles available across browser sessions.
- View bookmarked posts on the Saved Articles page.

**Comment on Articles**

- Provides an interactive comment form.
- Offers predefined comment options.
- Allows visitors to enter custom comments.
- Supports email-based comment submission.

**Share Articles**

- Uses the native Web Share API where supported.
- Allows article URLs to be copied through the Clipboard API.
- Provides fallback sharing options when native sharing is unavailable.
- Displays status messages to indicate the result of an action.

### 6. Reading Time Estimation

- Shows an estimated reading time for individual blog posts.
- Displays the estimate through the reusable post-actions component.
- Gives readers an idea of how long an article may take to read.

### 7. Read Aloud Functionality

- Provides an option to listen to blog posts.
- Uses the browser's speech synthesis capabilities.
- Offers an alternative way to consume written content.

### 8. Explore the Blog

The Explore the Blog page provides a central place to browse published articles.

- Displays article preview images.
- Shows titles and descriptions.
- Links directly to individual blog posts.
- Organizes articles so visitors can browse available content more easily.

### 9. Saved Articles

The Saved Articles page brings together posts bookmarked by the reader.

- Displays previously saved articles.
- Retrieves saved information from LocalStorage.
- Allows readers to remove saved articles.
- Provides direct access to bookmarked content.
- - Sorted from new to old based on date saved.

### 10. Blog Insights Dashboard

The Blog Insights Dashboard presents an overview of the blog's content and metadata.

- Retrieves article information from structured Jekyll data.
- Displays blog categories and tags.
- Uses article permalinks to associate metadata with individual posts.
- Organizes content information for browsing and reference.
- Provides a central overview of the published blog collection.

### 11. Blog Template

The Blog Template page provides a reusable structure for creating future blog posts.

- Offers a predefined layout for drafting new articles.
- Includes structured sections, tags, and categories.
- Maintains template-specific values and metadata.
- Provides a consistent starting point for creating blog content.

### 12. Notice Board

The Notice Board provides a centralized space for viewing the latest updates across Madhurima Mindscape, including newly published blog articles and recently introduced website features.

- Displays the latest published blog articles and their descriptions.
- Highlights newly introduced website features and enhancements.
- Organizes updates chronologically by date, with the newest updates appearing first.
- Separates blog publications from feature announcements for easy navigation.
- Includes relevant icons, titles, descriptions, and links to access each update.
- Maintains a history of previous announcements, allowing visitors to explore past updates.
- Automatically displays available updates using dynamically generated notice cards.

### 13. Custom 404 Error Page

- Displays a dedicated page when a requested URL cannot be found.
- Uses a responsive design.
- Provides navigation back to the website and keeps the error page consistent with the rest of the site.

### 14. Automatic Table of Contents (TOC) and Floating Back to Top Button

- Automatically generates a Table of Contents (TOC) from blog post headings.
- Displays a glossy TOC card with curved corners, attractive styling, and hover effects.
- Provides smooth navigation to the corresponding sections when TOC links are clicked.
- Uses a responsive layout for desktop, tablet, and mobile devices.
- Includes keyboard-focus and accessibility enhancements for TOC navigation links.
- Displays a floating Back to Top button fixed in the bottom-right corner of the screen.
- Keeps the Back to Top button in a consistent position while scrolling.
- Provides smooth scrolling to the top of the page when clicked.
- Supports accessible reduced-motion preferences.

---

## Blog Categories

Articles on Madhurima Mindscape are organized into the following categories:

| Category | Description |
|---|---|
| **Introduction** | Personal introduction, background, and an overview of the blog |
| **Personal Insights** | Reflections, personal experiences, and practical wisdom |
| **Tech Insights** | Technology, GitHub, data, tools, and technical learnings |
| **Project Diaries** | Development experiences and behind-the-scenes project documentation |
| **Creative Clicks** | Photography and visual creativity |
| **Poem Perspectives** | Poetry, literary interpretations, and creative perspectives |

Each article is stored in its corresponding category directory inside Jekyll's `_posts` directory.

---

## Blog Reading Experience

The individual blog layout provides a consistent structure for reading articles. Shared post-action components add features that readers can use while viewing a post.

These include:

- Estimated reading time.
- Read-aloud functionality.
- Comment submission.
- Article bookmarking.
- Link sharing.
- Structured article metadata.

The features are integrated into blog posts through reusable Jekyll includes, so their implementation does not need to be repeated for every article.

---

## Blog Discovery and Management Tools

Alongside published articles, the project includes separate pages for browsing and managing blog content.

| Tool | Functionality |
|---|---|
| **Explore the Blog** | Browse articles through preview images, titles, and descriptions |
| **Saved Articles** | View and manage bookmarked blog posts |
| **Blog Insights** | Explore article categories, tags, and associated metadata |
| **Blog Templates** | Access reusable content templates with structured metadata |

These tools are maintained separately from published articles in the `blog-tools` directory.

---

## SEO and Website Optimization

The project includes several features that help organize page metadata and make content easier for search engines to discover.

### SEO Features

- Individual YAML metadata files for blog posts.
- Structured article metadata.
- Category and tag information.
- Permalink-based association between articles and their metadata.
- XML sitemap.
- RSS feed for content updates.
- `robots.txt` for search engine crawling guidance.
- Custom 404 error page.

### Structured SEO Data

Each blog post has a corresponding YAML file inside `_data`, organized by category.

Keeping SEO metadata separate from article content makes it easier to update and maintain without changing the actual post files.

### RSS Feed

The website provides an RSS feed so readers can follow newly published content.

A link to the feed is also available in the website footer.

### Sitemap

The project includes a sitemap to help search engines discover website pages and published articles.

---

## Jekyll Architecture

Jekyll provides the structure used to manage content and generate the website. The project separates articles, data, layouts, reusable components, and frontend assets into different directories.

| Directory | Responsibility |
|---|---|
| `_posts` | Published blog articles organized by category |
| `_data` | Structured YAML metadata and website data |
| `_layouts` | Reusable page layouts |
| `_includes` | Reusable HTML components and section imports |
| `blog-tools` | Standalone blog tools and utilities |
| `css` | Stylesheets for individual sections and components |
| `js` | JavaScript functionality and interactions |
| `images` | Blog illustrations, photographs, and website assets |
| `website_snapshots` | Screenshots and animated website previews |

### 1. Content Management with `_posts`

All published articles are stored inside Jekyll's `_posts` directory.

Articles are grouped into category-based subdirectories. Each post follows Jekyll's filename convention and uses front matter to define its layout, title, date, categories, tags, and other metadata.

### 2. Structured Data with `_data`

The `_data` directory contains YAML files used to store structured website and article information.

It includes:

- Category-wise SEO metadata.
- Blog insights data.
- Blog template information.
- Saved Articles page data.
- Homepage configuration data.
- Custom 404 page data.

Each published article has a corresponding YAML metadata file, organized using the same category and filename convention.

### 3. Reusable Layouts with `_layouts`

The `_layouts` directory contains the page layouts used across the website.

| Layout | Purpose |
|---|---|
| `blog.html` | Common layout for individual blog posts |
| `explore-the-blog.html` | Layout for the Explore the Blog page |
| `blog-insights.html` | Layout for the Blog Insights dashboard |
| `index.html` | Homepage layout |
| `404.html` | Custom error page layout |

### 4. Reusable Components with `_includes`

The `_includes` directory is divided into `components` and `imports`.

**Components**

These files contain interface elements that are reused across the website:

- `header.html` – Website navigation header.
- `footer.html` – Footer with navigation and social links.
- `icon-hero-section.html` – Icon-based hero section.
- `post-actions.html` – Reusable article actions.
- `slider-carousel.html` – Interactive slider and carousel component.

**Imports**

These files contain the HTML sections used to build individual pages:

- `404.html`
- `blog-insights.html`
- `blog.html`
- `explore-the-blog.html`
- `index.html`
- `saved-articles.html`

### 5. Separate Blog Tools

The `blog-tools` directory contains standalone utilities that are maintained separately from published articles.

It currently contains:

- Saved Articles.
- Blog Insights.
- Blog Template.

This keeps `_posts` focused on published blog content.

### 6. Modular Frontend Assets

The CSS and JavaScript files are grouped by website section and functionality.

**CSS**

- `404.css`
- `blog-insights.css`
- `contents.css`
- `explore.css`
- `icon-hero-section.css`
- `index.css`
- `post-actions.css`
- `saved-articles.css`
- `slider-carousel.css`
- `themes.css`

**JavaScript**

- `blog-insights.js`
- `explore.js`
- `index.js`
- `post-actions.js`
- `saved-articles.js`
- `slider-carousel.js`

Keeping these assets in separate files makes it easier to locate and update the code for a particular feature.

---

## Project Directory Structure

The following tree shows how the main directories and files in Madhurima Mindscape are organized.

```text
Madhurima-Mindscape/
│
├── _data/
│   ├── 404/
│   │   └── 404.yml
│   │
│   ├── creative-clicks/
│   │   └── floral-photography.yml
│   │
│   ├── introduction/
│   │   ├── about-me.yml
│   │   ├── explore-the-blog.yml
│   │   └── introduction.yml
│   │
│   ├── personal-insights/
│   │   ├── 2024-reflections.yml
│   │   ├── 2025-reflections.yml
│   │   └── practical-wisdom.yml
│   │
│   ├── poem-perspectives/
│   │   └── the-solitary-reaper.yml
│   │
│   ├── project-diaries/
│   │   └── library-management.yml
│   │
│   ├── tech-insights/
│   │   ├── data-stories.yml
│   │   ├── github-anniversary-month.yml
│   │   └── github-helpful-tips.yml
│   │
│   ├── blog-insights.yml
│   ├── blog-template.yml
│   ├── index.yml
│   └── saved-articles.yml
│
├── _includes/
│   ├── components/
│   │   ├── footer.html
│   │   ├── header.html
│   │   ├── icon-hero-section.html
│   │   ├── post-actions.html
│   │   └── slider-carousel.html
│   │
│   └── imports/
│       ├── 404.html
│       ├── blog-insights.html
│       ├── blog.html
│       ├── explore-the-blog.html
│       ├── index.html
│       └── saved-articles.html
│
├── _layouts/
│   ├── 404.html
│   ├── blog-insights.html
│   ├── blog.html
│   ├── explore-the-blog.html
│   └── index.html
│
├── _posts/
│   ├── creative-clicks/
│   │   └── 2024-12-18-floral-photography.html
│   │
│   ├── introduction/
│   │   ├── 2024-12-18-about-me.html
│   │   ├── 2024-12-19-introduction.html
│   │   └── 2026-10-30-explore-the-blog.html
│   │
│   ├── personal-insights/
│   │   ├── 2024-12-18-practical-wisdom.html
│   │   ├── 2024-12-31-2024-reflections.html
│   │   └── 2025-12-31-2025-reflections.html
│   │
│   ├── poem-perspectives/
│   │   ├── poems/
│   │   │   └── NCERT-Class-9-English-Poetry-Textbook-Unit-8-The-Solitary-Reaper.pdf
│   │   └── 2024-12-18-the-solitary-reaper.html
│   │
│   ├── project-diaries/
│   │   └── 2024-12-17-library-management.html
│   │
│   └── tech-insights/
│       ├── 2024-12-19-data-stories.html
│       ├── 2026-05-12-github-anniversary-month.html
│       └── 2026-10-24-github-helpful-tips.html
│
├── blog-tools/
│   ├── 2026-10-29-saved-articles.html
│   ├── 2026-11-01-blog-insights.html
│   └── 2026-11-01-blog-template.html
│
├── css/
│   ├── 404.css
│   ├── blog-insights.css
│   ├── contents.css
│   ├── explore.css
│   ├── icon-hero-section.css
│   ├── index.css
│   ├── post-actions.css
│   ├── saved-articles.css
│   ├── slider-carousel.css
│   └── themes.css
│
├── images/
│   ├── data-stories/
│   │   ├── Big_Data_Illustration.png
│   │   └── Big_Data_Illustration.webp
│   │
│   ├── github-anniversary-month/
│   │   ├── github-first-commit.png
│   │   └── logo_image.png
│   │
│   ├── the-solitary-reaper/
│   │   ├── Illustration_1.webp
│   │   └── Illustration_2.webp
│   │
│   └── Logo.png
│
├── js/
│   ├── blog-insights.js
│   ├── explore.js
│   ├── index.js
│   ├── post-actions.js
│   ├── saved-articles.js
│   └── slider-carousel.js
│
├── website_snapshots/
│   ├── website_1.png
│   ├── website_2.png
│   ├── website_3.png
│   ├── website_4.png
│   ├── website_5.png
│   ├── website_6.png
│   ├── website_7.png
│   ├── website_8.png
│   ├── Website_Themes.gif
│   └── Website_Working.gif
│
├── 404.html
├── _config.yml
├── Gemfile
├── Gemfile.lock
├── index.html
├── jekyll-localhost-setup.md
├── jekyll-localhost-setup.pdf
├── jekyll_link_cleaner_add_front_matter.py
├── LICENSE
├── localhost-setup.md
├── localhost-setup.pdf
├── README.md
└── robots.txt
```

---

## How the Website Works

Madhurima Mindscape uses Jekyll to process blog content, structured data, and reusable templates before generating the static website.

The general workflow is:

1. Blog articles are stored inside `_posts`.
2. Corresponding metadata is maintained in `_data` using YAML files.
3. Jekyll processes the content and data through Liquid templates.
4. Layouts and includes define the structure of the generated pages.
5. CSS and JavaScript handle the website's styling and interactive features.
6. Jekyll generates the static website inside the `_site` directory.
7. The generated website is deployed through GitHub Pages.

### Architecture Overview

```text
       Blog Articles
          (_posts)
              |
              v
       Structured Data
          (_data)
              |
              v
        Jekyll + Liquid
              |
        +-----+-----+
        |           |
        v           v
     Layouts     Includes
   (_layouts)  (_includes)
        |           |
        +-----+-----+
              |
              v
        Generated HTML
              |
        +-----+-----+
        |           |
        v           v
       CSS       JavaScript
        |           |
        +-----+-----+
              |
              v
        Complete Website
              |
              v
         GitHub Pages
```

---

## Getting Started

To run Madhurima Mindscape locally, make sure the following tools are installed:

- Git
- Ruby
- RubyGems
- Bundler
- Jekyll

### Prerequisites

Check that Ruby, RubyGems, and Bundler are available:

```bash
ruby --version
gem --version
bundle --version
```

### Clone the Repository

Clone the project from GitHub:

```bash
git clone https://github.com/madhurimarawat/Madhurima-Mindscape.git
```

Move into the project directory:

```bash
cd Madhurima-Mindscape
```

### Install Dependencies

Install the Ruby gems required by the project:

```bash
bundle install
```

---

## Running Locally

Start the Jekyll development server with:

```bash
bundle exec jekyll serve
```

Open the following address in your browser:

```text
http://127.0.0.1:4000/Madhurima-Mindscape/
```

Jekyll rebuilds the website when supported source files are changed.

To generate the website without starting the development server, run:

```bash
bundle exec jekyll build
```

The generated website files will be available in:

```text
_site/
```

### Local Development Documentation

For more detailed setup instructions, refer to:

- [Jekyll Localhost Setup (Markdown)](jekyll-localhost-setup.md)

---

## Adding a New Blog Post

New articles are added to Jekyll's `_posts` directory and organized under the appropriate category.

### Step 1: Create a Blog Post

Create a new HTML file inside the relevant category directory.

For example:

```text
_posts/
└── tech-insights/
    └── 2026-11-05-my-new-article.html
```

### Step 2: Add Front Matter

Add Jekyll front matter at the beginning of the file.

```yaml
---
layout: blog
title: "My New Article"
date: 2026-11-05
categories:
  - tech-insights
tags:
  - technology
  - learning
permalink: /my-new-article
seo: /tech-insight/my-new-article
---
```

### Step 3: Add Article Content

Write the article using HTML and the content structure supported by the existing blog layout.

### Step 4: Add Corresponding SEO Data

Create a matching YAML file in the corresponding category directory inside `_data`.

For example:

```text
_data/
└── tech-insights/
    └── my-new-article.yml
```

Follow the metadata structure used by the existing blog entries.

### Step 5: Update Content Discovery Data

After adding the article and its metadata, update the following three files so the new post appears in the relevant sections of the website.

**1. `_includes/components/icon-hero-section.html`**

Add a new icon entry inside the `icon-hero-grid` container. Follow the existing `icon-hero-item` structure and use an appropriate Font Awesome icon.

Example:

```html
<a target="_blank" rel="noopener noreferrer" href="{{ site.baseurl }}/article-url" class="icon-hero-item"
   aria-label="Article Title" title="Article Title">
    <i class="fas fa-icon-name"></i>
</a>
```

2. `index.html`

Add a new `path-item` link under the corresponding category in the homepage's blog discovery section.

For example, if the new article belongs to Tech Insights, add its link under the existing Tech Insights section in `index.html`.

3. `explore-the-blog.html`

Automatically fetches and displays blog categories and article links from `index.html`, requiring no manual updates.

### Step 6: Test Locally

Start the local development server:

```bash
bundle exec jekyll serve
```

Check that the new article appears in the correct sections. Also verify its metadata, navigation links, and interactive post actions before deploying the changes.

---

## Contributing

Suggestions, bug reports, and improvements are welcome!

If you would like to contribute:

1. Fork the repository.
2. Create a new feature branch.
3. Make your changes.
4. Test the changes locally.
5. Submit a pull request.

You can also report issues or share ideas through:

- [GitHub Issues](https://github.com/madhurimarawat/Madhurima-Mindscape/issues)
- [Pull Requests](https://github.com/madhurimarawat/Madhurima-Mindscape/pulls)
- [GitHub Discussions](https://github.com/madhurimarawat/Madhurima-Mindscape/discussions)

If you find the project useful or interesting, consider giving the repository a ⭐!

---

## Connect With Me

Thank you for taking the time to explore Madhurima Mindscape!

I enjoy learning, building projects, sharing experiences, and connecting with others who have similar interests.

Feel free to reach out:

<p align="center">
  <a href="https://www.linkedin.com/in/madhurima-rawat/">
    <img src="https://img.shields.io/badge/LinkedIn-Madhurima%20Rawat-blue?style=for-the-badge&logo=linkedin" alt="LinkedIn">
  </a>

  <a href="https://github.com/madhurimarawat">
    <img src="https://img.shields.io/badge/GitHub-Madhurima%20Rawat-black?style=for-the-badge&logo=github" alt="GitHub">
  </a>

  <a href="mailto:rawatmadhurima4@gmail.com">
    <img src="https://img.shields.io/badge/Email-Contact%20Me-red?style=for-the-badge&logo=gmail" alt="Email">
  </a>
</p>
