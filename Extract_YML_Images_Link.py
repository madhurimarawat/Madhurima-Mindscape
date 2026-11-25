"""
============================================================
Project     : Madhurima Mindscape
File Name   : Extract_YML_Images_Link.py
Author      : Madhurima Rawat
Created On  : 25 November 2026

Description :
    Recursively scans the _data directory and its
    subdirectories to find YAML files (.yml and .yaml).

    Extracts:
        - image URL
        - permalink generated from the YAML filename

    The permalink contains only the YAML filename,
    excluding its parent directories and file extension.
    No trailing slash is added to the permalink.

    Removes duplicate image URLs before saving.

    Sorts unique extracted entries by date in descending
    order (newest first).

    The date field is used exclusively for sorting
    and is not included in the generated JSON.

Output:
    _data/json/images_preview_links.json

Requirements:
    pip install PyYAML

Usage:
    python Extract_YML_Images_Link.py
============================================================
"""

import json

from pathlib import Path
from datetime import datetime, date, timezone

import yaml

# Directory Configuration

DATA_DIR = Path("_data")
OUTPUT_FILE = Path("_data/json/images_preview_links.json")


# Parse YAML Date


def parse_date(value):
    """Convert YAML date values into sortable datetimes."""

    if not value:
        return datetime.min.replace(tzinfo=timezone.utc)

    if isinstance(value, datetime):
        parsed = value

    elif isinstance(value, date):
        parsed = datetime.combine(value, datetime.min.time())

    else:
        parsed = datetime.fromisoformat(str(value).replace("Z", "+00:00"))

    if parsed.tzinfo is None:
        parsed = parsed.replace(tzinfo=timezone.utc)

    return parsed.astimezone(timezone.utc)


# Generate Permalink from YAML Filename


def generate_permalink(file_path):
    """
    Generate a permalink using only the YAML filename.

    Parent directories and file extensions are excluded.
    No trailing slash is added.

    Example:
        _data/tech-insights/personality-behind-code.yml

    Result:
        /personality-behind-code
    """

    return f"/{file_path.stem}"


# Extract Images


def extract_images():
    """Extract unique image URLs and permalinks from YAML files."""

    entries = []
    seen_images = set()

    duplicate_count = 0

    for file_path in DATA_DIR.rglob("*"):

        # Process only YAML files

        if file_path.suffix.lower() not in {".yml", ".yaml"}:
            continue

        try:

            with file_path.open("r", encoding="utf-8") as file:
                data = yaml.safe_load(file)

            # Validate YAML Content

            if not isinstance(data, dict):
                continue

            image = data.get("image")
            date_value = data.get("date")

            # Skip Entries Without Valid Image URLs

            if not isinstance(image, str) or not image.strip():
                continue

            image = image.strip()

            # Skip Duplicate Images

            if image in seen_images:
                duplicate_count += 1
                print(f"Duplicate image skipped: {file_path}")
                continue

            # Mark Image as Seen

            seen_images.add(image)

            # Store Extracted Information

            entries.append(
                {
                    "image": image,
                    "permalink": generate_permalink(file_path),
                    "_date": parse_date(date_value),
                }
            )

        except Exception as error:

            print(f"Error reading {file_path}: {error}")

    # Sort by Date: Newest First

    entries.sort(key=lambda item: item["_date"], reverse=True)

    # Remove Date Before Generating JSON

    result = [
        {"image": item["image"], "permalink": item["permalink"]} for item in entries
    ]

    # Create Output Directory

    OUTPUT_FILE.parent.mkdir(parents=True, exist_ok=True)

    # Save JSON

    with OUTPUT_FILE.open("w", encoding="utf-8") as file:

        json.dump(result, file, indent=4, ensure_ascii=False)

    # Display Results

    print(f"Extracted unique images: {len(result)}")
    print(f"Duplicate images removed: {duplicate_count}")
    print(f"Saved to {OUTPUT_FILE}")


# Main Execution

if __name__ == "__main__":

    extract_images()
