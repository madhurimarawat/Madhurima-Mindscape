# Madhurima Mindscape - Project Documentation

**Technical documentation for the architecture, technologies, features, and development workflow of Madhurima Mindscape.**

## Introduction

Madhurima Mindscape is a Jekyll-powered personal blogging platform built to publish and organize articles across personal reflections, technology, project experiences, poetry, and creative photography.

The website combines Jekyll's static site generation capabilities with reusable Liquid templates, structured YAML data, responsive frontend design, and JavaScript-powered interactive features.

This documentation provides a technical overview of the project, covering its technology stack, key functionalities, Jekyll architecture, directory structure, content management workflow, local development setup, and instructions for adding new blog posts.

## Documentation Overview

This document serves as a technical reference for understanding how Madhurima Mindscape is structured, how its components work together, and how the website can be maintained and extended.

It covers:

- **Technology Stack:** Tools, languages, frameworks, and browser APIs used.
- **Features and Functionalities:** Implementation of the website's interactive and content-management features.
- **Jekyll Architecture:** Layouts, includes, structured data, and content organization.
- **Project Structure:** Organization of directories, files, stylesheets, and scripts.
- **Website Workflow:** How Jekyll processes content and generates the website.
- **Local Development:** Prerequisites, installation, and running the website locally.
- **Content Management:** Steps for creating and publishing new blog posts.
- **Contribution Guidelines:** How to suggest improvements and contribute to the project.

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

Madhurima Mindscape is more than a traditional blogging website. It is a space for documenting experiences, sharing technical knowledge, exploring creative interests, and continuously learning.

The platform is built using Jekyll, a static site generator that transforms structured content, reusable layouts, and templates into a complete static website.

The migration to Jekyll introduced a more organized and maintainable architecture, separating blog content, metadata, reusable components, layouts, stylesheets, and JavaScript functionality.

The website brings together:

- Personal storytelling and reflections.
- Technical articles and tutorials.
- Project development experiences.
- Poetry and creative writing.
- Photography and visual storytelling.
- Interactive blog-reading functionality.
- Article discovery and bookmarking tools.
- Blog analytics and reusable content templates.

## Technology Stack

The project combines static site generation, frontend technologies, structured data, and browser-native APIs.

| Technology | Purpose |
|---|---|
| **Jekyll** | Static site generation and blog management |
| **Ruby** | Jekyll runtime and dependency environment |
| **Liquid** | Dynamic templates, layouts, loops, conditions, and data rendering |
| **HTML5** | Website structure and content |
| **CSS3** | Styling, responsive layouts, and visual design |
| **JavaScript** | Interactive components and client-side functionality |
| **YAML** | Website configuration, structured metadata, and SEO data |
| **Font Awesome** | Icons used in the navigation and blog hero sections |
| **LocalStorage** | Persistent storage of saved articles in the browser |
| **Web Share API** | Native content-sharing functionality where supported |
| **Clipboard API** | Copying blog links |
| **Web Speech API** | Browser-based read-aloud functionality |
| **XML** | RSS feed generation |
| **Git & GitHub** | Version control and repository management |
| **GitHub Pages** | Website hosting and deployment |

### Development and Browser Technologies

The website also makes use of browser-native capabilities to improve the reading experience without requiring a dedicated backend for every interaction.

Examples include:

- Browser storage for saved articles.
- Native and fallback sharing mechanisms.
- Clipboard-based link sharing.
- Speech synthesis for reading blog content aloud.
- Responsive CSS and theme-aware styling.

---

## Features and Functionalities

### 1. Responsive Website Design

- Responsive interface designed for desktop, tablet, and mobile devices.
- Flexible layouts and content presentation.
- Theme-aware visual elements.
- Consistent styling across different website sections.

### 2. Multiple Website Themes

- Theme customization for different visual preferences.
- Dynamic color changes across website elements.
- Theme-aware headings, icons, and hero sections.
- Consistent styling of interactive components.

### 3. Interactive Icon-Based Hero Section

- Displays Font Awesome icons associated with individual blog posts.
- Provides direct navigation to corresponding articles.
- Includes an interactive slider/carousel experience.
- Updates icon colors according to the active website theme and heading colors.
- Helps visitors discover blog content visually.

### 4. Reusable Blog Templates

- Shared Jekyll layout for individual blog posts.
- Consistent structure and styling across articles.
- Reusable post-action components.
- Structured categories, tags, and metadata.
- Centralized presentation logic for easier maintenance.

### 5. Interactive Blog Post Actions

Every blog post includes a reusable set of reading and engagement tools.

**Save Articles**
- Save and unsave individual blog posts.
- Store saved article information using browser LocalStorage.
- Retain saved articles across browser sessions.
- Access bookmarked content through the Saved Articles page.

**Comment on Articles**
- Interactive comment form.
- Predefined comment options.
- Support for custom comments.
- Email-based comment submission.

**Share Articles**
- Share blog posts through the native Web Share API where supported.
- Copy article URLs using the Clipboard API.
- Provide fallback sharing options when native sharing is unavailable.
- Display status messages to communicate the result of user actions.

### 6. Reading Time Estimation

- Displays estimated reading time for individual blog posts.
- Integrated into the reusable post-actions component.
- Helps readers understand the approximate time required to read an article.

### 7. Read Aloud Functionality

- Provides a read-aloud option for blog posts.
- Uses browser speech synthesis capabilities.
- Makes written content more accessible and convenient to consume.

### 8. Explore the Blog

A dedicated content-discovery page that presents blog articles in an organized and visually appealing format.

- Displays blog preview images.
- Shows article titles and descriptions.
- Provides links to individual blog posts.
- Helps readers browse available content in one place.

### 9. Saved Articles

A dedicated page for managing bookmarked blog posts.

- Displays previously saved articles.
- Retrieves saved information from LocalStorage.
- Supports removing saved articles.
- Provides convenient access to bookmarked content.

### 10. Blog Insights Dashboard

A dedicated dashboard that presents information about the blog collection.

- Retrieves article information from structured Jekyll data.
- Displays blog categories and tags.
- Uses article permalinks to associate metadata with individual posts.
- Organizes content information for easier exploration.
- Supports a centralized overview of blog content.

### 11. Blog Template Library

A dedicated collection of reusable blog templates.

- Organizes templates separately from published blog articles.
- Includes structured tags and categories.
- Maintains additional template values and metadata.
- Provides reusable starting points for creating future content.

### 12. Custom 404 Error Page

- Dedicated 404 page for unavailable or incorrect URLs.
- Custom responsive design.
- Provides a more consistent experience when visitors encounter missing pages.

---

## Blog Categories

The blog contains articles across different topics and creative interests.

| Category | Description |
|---|---|
| **Introduction** | Personal introduction, background, and an overview of the blog |
| **Personal Insights** | Reflections, personal experiences, and practical wisdom |
| **Tech Insights** | Technology, GitHub, data, tools, and technical learnings |
| **Project Diaries** | Development experiences and behind-the-scenes project documentation |
| **Creative Clicks** | Photography and visual creativity |
| **Poem Perspectives** | Poetry, literary interpretations, and creative perspectives |

Each article is organized under its corresponding category within Jekyll's `_posts` directory.

---

## Blog Reading Experience

The website focuses on making individual articles easier to navigate, explore, and consume.

The reusable blog layout provides a consistent reading experience across articles, while the post-actions component adds interactive functionality.

The reading experience includes:

- Consistent blog layouts.
- Estimated reading time.
- Read-aloud functionality.
- Comment submission.
- Article bookmarking.
- Link sharing.
- Structured article metadata.

These features are integrated into the individual blog posts through reusable Jekyll includes rather than maintaining separate implementations for every article.

---

## Blog Discovery and Management Tools

In addition to published articles, Madhurima Mindscape includes dedicated tools for exploring and managing blog content.

| Tool | Functionality |
|---|---|
| **Explore the Blog** | Browse articles through preview images, titles, and descriptions |
| **Saved Articles** | View and manage bookmarked blog posts |
| **Blog Insights** | Explore article categories, tags, and associated metadata |
| **Blog Templates** | Access reusable content templates with structured metadata |

These tools are maintained separately from published blog articles in the `blog-tools` directory.

---

## SEO and Website Optimization

Search engine optimization and content discoverability are important parts of the website architecture.

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

This separates SEO-related information from the actual article content and makes metadata easier to maintain.

### RSS Feed

The website provides an RSS feed to help readers follow published content.

An RSS feed link is also included in the website footer.

### Sitemap

A sitemap is included to help search engines discover the website's pages and published articles.

---

## Jekyll Architecture

The website was migrated to Jekyll to establish a modular and maintainable architecture.

The migration introduced a clear separation of responsibilities.

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

All published articles are maintained inside Jekyll's `_posts` directory.

Articles are organized into category-based subdirectories, making the content easier to navigate and maintain.

Jekyll-compatible filenames and front matter are used for article identification and metadata.

### 2. Structured Data with `_data`

The `_data` directory contains YAML files used to maintain structured website and article information.

It includes:

- Category-wise SEO metadata.
- Blog insights data.
- Blog template information.
- Saved articles page data.
- Homepage configuration data.
- Custom 404 page data.

Each published article has a corresponding YAML metadata file organized using the same category and filename convention.

### 3. Reusable Layouts with `_layouts`

The `_layouts` directory contains shared page layouts.

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

Reusable interface elements shared across the website:

- `header.html` – Website navigation header.
- `footer.html` – Footer with navigation and social links.
- `icon-hero-section.html` – Icon-based hero section.
- `post-actions.html` – Reusable article actions.
- `slider-carousel.html` – Interactive slider and carousel component.

**Imports**

Section-level HTML files used to organize page content:

- `404.html`
- `blog-insights.html`
- `blog.html`
- `explore-the-blog.html`
- `index.html`
- `saved-articles.html`

### 5. Separate Blog Tools

The `blog-tools` directory maintains standalone blog utilities independently of published articles.

It currently contains:

- Saved Articles.
- Blog Insights.
- Blog Template.

This separation keeps the `_posts` directory focused on actual published content.

### 6. Modular Frontend Assets

CSS and JavaScript files are organized separately according to their respective website sections and functionality.

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

This organization makes individual features easier to maintain, update, and extend.

---

## Project Directory Structure

The following structure represents the current organization of Madhurima Mindscape.

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

Madhurima Mindscape uses Jekyll's static site generation workflow.

The general content-generation process is:

1. Blog articles are maintained inside `_posts`.
2. Corresponding metadata is maintained in `_data` using YAML files.
3. Jekyll uses Liquid templates to process structured content and data.
4. Reusable layouts and includes provide a consistent website structure.
5. CSS and JavaScript provide styling and interactive functionality.
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

To run Madhurima Mindscape locally, you need the following installed:

- Git
- Ruby
- RubyGems
- Bundler
- Jekyll

### Prerequisites

Verify the installations:

```bash
ruby --version
gem --version
bundle --version
```

### Clone the Repository

```bash
git clone https://github.com/madhurimarawat/Madhurima-Mindscape.git
```

Navigate to the project directory:

```bash
cd Madhurima-Mindscape
```

### Install Dependencies

Install the required Ruby gems:

```bash
bundle install
```

---

## Running Locally

Start the Jekyll development server:

```bash
bundle exec jekyll serve
```

Open the following URL in your browser:

```text
http://127.0.0.1:4000/Madhurima-Mindscape/
```

Jekyll automatically rebuilds the website when supported source files are modified.

To build the website without starting the server:

```bash
bundle exec jekyll build
```

The generated website will be available inside:

```text
_site/
```

### Local Development Documentation

For additional setup instructions, refer to:

- [Jekyll Localhost Setup (Markdown)](jekyll-localhost-setup.md)

---

## Adding a New Blog Post

The website uses Jekyll's `_posts` directory to organize published articles.

### Step 1: Create a Blog Post

Create a new HTML file inside the appropriate category directory.

For example:

```text
_posts/
└── tech-insights/
    └── 2026-11-05-my-new-article.html
```

### Step 2: Add Front Matter

Include Jekyll front matter at the beginning of the article.

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

Write your article using HTML and the supported content structure of the existing blog layout.

### Step 4: Add Corresponding SEO Data

Create a matching YAML file inside the corresponding `_data` category directory.

For example:

```text
_data/
└── tech-insights/
    └── my-new-article.yml
```

Maintain the existing metadata schema used by the other blog entries.

### Step 5: Update Content Discovery Data

After creating a new blog post, update the relevant sections in the following three files so the article appears in the appropriate places across the website:

1\. `_includes/components/icon-hero-header.html`

Add a new icon entry inside the `icon-hero-grid` container, following the existing `icon-hero-item` class and structure.

```
<a target="_blank" rel="noopener noreferrer" href="{{ site.baseurl }}/article-url" class="icon-hero-item"
    aria-label="Article Title" title="Article Title">
    <i class="fas fa-icon-name"></i>
</a>
```

2\. `explore-the-blog.html`\
Add a new `explore-item` link under the appropriate category section, using the article URL, a relevant Font Awesome icon, and the article title.

3\. `index.html`\
Add a new `path-item` link under the corresponding category in the homepage's blog discovery section.

Example: For a new article under Tech Insights, add its link inside the existing Tech Insights section in both `explore-the-blog.html` and `index.html`.

This keeps the homepage, icon hero section, and Explore the Blog page updated whenever a new article is published.

### Step 6: Test Locally

Run:

```bash
bundle exec jekyll serve
```

Verify the article, its metadata, navigation links, and interactive post actions before deploying.

---

## Contributing

Suggestions, improvements, and contributions are always welcome!

If you have an idea or find an issue:

1. Fork this repository.
2. Create a new feature branch.
3. Make your changes.
4. Test your changes locally.
5. Submit a pull request.

You can also participate through:

- [GitHub Issues](https://github.com/madhurimarawat/Madhurima-Mindscape/issues)
- [Pull Requests](https://github.com/madhurimarawat/Madhurima-Mindscape/pulls)
- [GitHub Discussions](https://github.com/madhurimarawat/Madhurima-Mindscape/discussions)

If you find this project interesting or useful, consider giving the repository a ⭐!

---

## Connect With Me

Thank you for exploring Madhurima Mindscape!

I enjoy learning, building projects, sharing experiences, and connecting with people who have similar interests.

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
