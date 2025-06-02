# 🚀 Using Jekyll for Static Site Generation

## 🤔 What is Jekyll?

Jekyll is a **static site generator** that converts plain text files written in Markdown or HTML into a complete static website. It’s widely used for blogs, portfolios, and project sites, especially because it integrates seamlessly with GitHub Pages for free and easy hosting.

## 💡 Why Use Jekyll?

* ✍️ **Simple authoring:** Write content in Markdown or HTML without needing a backend server.
* ⚡ **Fast loading:** Static sites load quickly since they don’t depend on server-side processing.
* 🎨 **Highly customizable:** Templates, layouts, and front matter let users control design and URLs.
* 🌐 **GitHub Pages ready:** Automatically build and host sites for free on GitHub.
* 🧑‍🤝‍🧑 **Active community:** Many plugins, themes, and resources available.

## 🛠️ How to Install Jekyll

### Step 1: Install Ruby

Jekyll requires Ruby. The user must install Ruby appropriate for their OS:

* **Windows:** Download Ruby+Devkit from [rubyinstaller.org](https://rubyinstaller.org/)
* **macOS:** Ruby usually comes pre-installed. Optionally upgrade via Homebrew:

  ```bash
  brew install ruby
  ```
* **Linux:** Use your package manager, for example:

  ```bash
  sudo apt-get install ruby-full build-essential
  ```

### Step 2: Install Bundler and Jekyll Gems

In the terminal or command prompt, run:

```bash
gem install bundler jekyll
```

> *Note: On Windows, the terminal may need to be run as Administrator.*

### Step 3: Verify Installation

Verify Jekyll is installed correctly by running:

```bash
jekyll -v
```

The installed Jekyll version should be displayed.

---

## 📂 How to Use This Project with Jekyll

1. 🔗 **Clone the repository**:

   ```bash
   git clone https://github.com/madhurimarawat/Madhurima-Mindscape.git
   ```
2. 📁 **Navigate into the project folder**:

   ```bash
   cd Madhurima-Mindscape
   ```
3. 📝 **Ensure all files have proper front matter** — YAML metadata at the top of each page, defining permalinks, titles, etc.
4. 💻 **Run the local Jekyll server** to build and preview the site:

   ```bash
   jekyll serve
   ```
5. 🌐 **Open a browser and go to**:

   ```
   http://localhost:4000
   ```
6. 🔄 **Preview the site live** — changes to files auto-refresh the browser.

---

## ▶️ How to Test Jekyll Locally

* Open a terminal and navigate to your project folder.
* Run:

  ```bash
  jekyll serve
  ```
* Wait for the build to complete.
* Visit `http://localhost:4000` in a browser.
* Modify content or layout files and watch the live reload.

---

## ✅ Summary

Jekyll is a powerful tool for creating static websites that are fast, easy to maintain, and perfect for personal or project portfolios. By installing Ruby and Jekyll, cloning the project repository, and running the local server, anyone can preview and develop the site before publishing it live—especially on GitHub Pages.