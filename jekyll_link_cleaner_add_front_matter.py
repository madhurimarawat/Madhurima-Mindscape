#!/usr/bin/env python3
"""
🛠️ HTML Modifier Script for Jekyll + GitHub Pages

This script performs the following:
1️⃣ Adds YAML front matter to HTML files for Jekyll (`permalink: /page-name`) only if missing
2️⃣ Injects a single <base href="{{ site.baseurl }}/"> tag after the <head> tag (except index.html)
3️⃣ Cleans up <a> links only inside the `.main-content > main.path` section in index.html:
    - Removes `.html` extensions
    - Removes `blogs/` prefixes
    - Removes any multi-level subpaths in URLs, keeping only the last segment
4️⃣ For all other files, cleans links globally (as before)
5️⃣ Skips the 'components/' directory

📦 Designed for a flat or semi-flat folder structure for a Jekyll-based site.
"""

import os
import re

root_dir = "./"  # Change if needed


import os


def add_front_matter(file_path, content):
    """Remove all <base> tags and insert one after the comment block or after <head>."""

    filename = os.path.basename(file_path)
    name, ext = os.path.splitext(filename)

    # If front matter exists, skip
    if content.startswith("---"):
        print(f"⏭️  Front matter exists, skipping add: {file_path}")
        return content

    # For index.html, add empty front matter
    if filename == "index.html":
        front_matter = "---\n---\n\n"
    else:
        permalink_name = "home" if name == "index" else name
        front_matter = (
            f"---\n"
            f"permalink: /{permalink_name}\n"
            f"---\n\n"
            f"<!-- Jekyll is a static site generator often used with GitHub Pages to build websites from markdown or HTML. -->\n"
            f"<!-- Front matter is the section at the top of a file (enclosed in `---`) that contains metadata like `title`, `layout`, or `permalink`, which Jekyll uses to process the page. -->\n"
            f"<!-- This comment means the file includes front matter to define a permalink, ensuring a custom or consistent URL for the page. -->\n"
            f"<!-- Front matter is written in YAML format and must be placed at the very beginning of the file. -->\n\n"
        )

    new_content = front_matter + content

    with open(file_path, "w", encoding="utf-8") as f:
        f.write(new_content)

    print(f"✅ Front matter added: {file_path}")
    return new_content


def fix_base_tag(file_path, content):
    """Remove all <base> tags and insert one after the comment block or after <head>."""
    filename = os.path.splitext(os.path.basename(file_path))[0]

    # Skip base tag modification for index.html
    if filename == "index":
        print(f"⏭️  Skipping base tag fix for index.html: {file_path}")
        return content

    # Remove all existing <base ...> tags
    content_no_base = re.sub(r"<base\s+[^>]*>", "", content, flags=re.IGNORECASE)

    # Regex to find comment block mentioning 'The <base> tag'
    comment_pattern = re.compile(
        r"(<!--\s*[\s\S]*?The\s*<base>\s*tag[\s\S]*?-->)", re.IGNORECASE
    )

    def insert_base_tag_after_comment(match):
        comment_block = match.group(1)
        return f'{comment_block}\n  <base href="{{{{ site.baseurl }}}}/">'

    # Try inserting after comment block
    content_fixed, count = comment_pattern.subn(
        insert_base_tag_after_comment, content_no_base, count=1
    )

    if count == 0:
        # Comment block not found, fallback to insert after <head>
        content_fixed = content_no_base.replace(
            "<head>", '<head>\n  <base href="{{ site.baseurl }}/">', 1
        )

    # Write the fixed content back
    with open(file_path, "w", encoding="utf-8") as f:
        f.write(content_fixed)

    print(f"✅ Base tag fixed: {file_path}")
    return content_fixed


def clean_links_in_section(html_section):
    """Clean <a href="..."> links inside a given HTML section string."""

    def replace_href(match):
        original_href = match.group(1)
        # Remove '.html' extension if present
        href = re.sub(r"\.html$", "", original_href)

        # Remove 'blogs/' or './blogs/' prefix if present
        href = re.sub(r"^(?:\.\/)?blogs/", "", href)

        # Keep only the last path segment
        last_segment = href.rstrip("/").split("/")[-1]

        # Return new href with Jekyll baseurl template
        return f'href="{{{{ site.baseurl }}}}/{last_segment}"'

    # Replace href attribute inside <a> tags
    html_section = re.sub(r'href="([^"]+)"', replace_href, html_section)

    return html_section


def clean_internal_links(file_path, content):
    """
    Clean internal links ONLY in index.html.

    For index.html: Only inside .main-content > main.path section.
    For others: do nothing.
    """
    filename = os.path.basename(file_path)

    if filename == "index.html":
        # Find the section: <div class="main-content"> <main class="path"> ... </main> </div>
        pattern = re.compile(
            r'(<div\s+class="main-content">\s*<main\s+class="path">)([\s\S]*?)(</main>\s*</div>)',
            re.IGNORECASE,
        )

        match = pattern.search(content)
        if match:
            before = match.group(1)
            section_html = match.group(2)
            after = match.group(3)

            cleaned_section = clean_links_in_section(section_html)
            new_content = (
                content[: match.start(2)] + cleaned_section + content[match.end(2) :]
            )

            with open(file_path, "w", encoding="utf-8") as f:
                f.write(new_content)

            print(f"🔗 Links cleaned in .main-content > main.path section: {file_path}")
        else:
            print(
                f"⚠️ .main-content > main.path section not found, skipping link cleaning: {file_path}"
            )
    else:
        # For all other files, skip link cleaning
        print(f"⏭️ Skipping link cleaning for: {file_path}")


def main():
    for subdir, _, files in os.walk(root_dir):
        if os.path.basename(subdir) == "components":
            print(f"🚫 Skipping directory: {subdir}")
            continue

        for file in files:
            if file.endswith(".html"):
                file_path = os.path.join(subdir, file)

                # Read file content
                with open(file_path, "r", encoding="utf-8") as f:
                    content = f.read()

                # Add front matter if missing, get updated content
                content = add_front_matter(file_path, content)

                # Fix base tags (always)
                content = fix_base_tag(file_path, content)

                # Clean internal links (with conditional logic)
                clean_internal_links(file_path, content)


if __name__ == "__main__":
    main()
