"""
============================================================
Project     : Madhurima Mindscape
File Name   : Extract_YML_Images_Link.py
Author      : Madhurima Rawat
Created On  : 25 November 2026

Description :
    Recursively scans _data for YAML files.

    Extracts:
        - image URL
        - permalink from YAML filename

    Removes duplicate image URLs, retaining the newest
    occurrence of each image.

    Sorts entries strictly by YAML date:
        NEWEST TO OLDEST

    Supports ISO 8601 dates and timezone offsets.

    Invalid or missing dates do not prevent extraction.
    Entries with invalid or missing dates appear last.

    Date is used only for sorting and excluded from JSON.

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
from datetime import datetime, date, time, timezone

import yaml

# ============================================================
# DIRECTORY CONFIGURATION
# ============================================================

BASE_DIR = Path(__file__).resolve().parent

DATA_DIR = BASE_DIR / "_data"

OUTPUT_FILE = DATA_DIR / "json" / "images_preview_links.json"


# ============================================================
# PARSE YAML DATE
# ============================================================


def parse_date(value):
    """
    Convert YAML date values into timezone-aware UTC datetimes.

    Supports:
        2026-11-10
        2026-11-10T15:15:00
        2026-11-10T15:15:00+05:30
        2026-11-10T09:45:00Z
    """

    if value is None or value == "":
        return None

    if isinstance(value, datetime):
        parsed = value

    elif isinstance(value, date):
        parsed = datetime.combine(value, time.min)

    else:
        date_string = str(value).strip()

        if not date_string:
            return None

        if date_string.endswith(("Z", "z")):
            date_string = date_string[:-1] + "+00:00"

        parsed = datetime.fromisoformat(date_string)

    # Treat timezone-naive dates as UTC

    if parsed.tzinfo is None:
        parsed = parsed.replace(tzinfo=timezone.utc)

    # Normalize all dates to UTC

    return parsed.astimezone(timezone.utc)


# ============================================================
# GENERATE PERMALINK
# ============================================================


def generate_permalink(file_path):

    return f"/{file_path.stem}"


# ============================================================
# EXTRACT IMAGES
# ============================================================


def extract_images():

    entries = []

    scanned_folders = set()
    discovered_files = []

    extracted_count = 0
    duplicate_count = 0
    skipped_count = 0
    error_count = 0
    invalid_date_count = 0

    if not DATA_DIR.is_dir():
        raise FileNotFoundError(f"Data directory not found: {DATA_DIR}")

    # --------------------------------------------------------
    # STEP 1: DISCOVER FOLDERS AND YAML FILES
    # --------------------------------------------------------

    for path in sorted(DATA_DIR.rglob("*")):

        if path.is_dir():

            scanned_folders.add(path)

        elif path.is_file() and path.suffix.lower() in {".yml", ".yaml"}:

            discovered_files.append(path)

    scanned_folders.add(DATA_DIR)

    # --------------------------------------------------------
    # STEP 2: READ YAML FILES
    # --------------------------------------------------------

    for file_path in sorted(discovered_files):

        try:

            with file_path.open("r", encoding="utf-8-sig") as file:

                data = yaml.safe_load(file)

            if not isinstance(data, dict):

                skipped_count += 1
                continue

            # Extract image URL

            image = data.get("image")

            if not isinstance(image, str) or not image.strip():

                skipped_count += 1
                continue

            image = image.strip()

            # ------------------------------------------------
            # STEP 3: EXTRACT AND PARSE YAML DATE
            # ------------------------------------------------

            date_value = data.get("date")

            try:

                parsed_date = parse_date(date_value)

                if parsed_date is None:
                    invalid_date_count += 1

            except (ValueError, TypeError, OverflowError):

                parsed_date = None
                invalid_date_count += 1

                print(f"[INVALID DATE] {file_path}: {date_value!r}")

            # ------------------------------------------------
            # STEP 4: STORE ENTRY
            # ------------------------------------------------

            entries.append(
                {
                    "image": image,
                    "permalink": generate_permalink(file_path),
                    "_date": parsed_date,
                }
            )

            extracted_count += 1

        except Exception as error:

            error_count += 1

            print(f"[ERROR] {file_path}: {error}")

    # --------------------------------------------------------
    # STEP 5: SORT BY ACTUAL DATETIME
    # NEWEST FIRST, MISSING DATES LAST
    # --------------------------------------------------------

    entries.sort(
        key=lambda item: (
            item["_date"] is not None,
            item["_date"] or datetime.min.replace(tzinfo=timezone.utc),
        ),
        reverse=True,
    )

    # Verify chronological order

    valid_dates = [item["_date"] for item in entries if item["_date"] is not None]

    if valid_dates != sorted(valid_dates, reverse=True):

        raise RuntimeError("Chronological sorting verification failed!")

    # --------------------------------------------------------
    # STEP 6: REMOVE DUPLICATE IMAGES
    # RETAIN NEWEST OCCURRENCE
    # --------------------------------------------------------

    seen_images = set()
    unique_entries = []

    for item in entries:

        if item["image"] in seen_images:

            duplicate_count += 1
            continue

        seen_images.add(item["image"])
        unique_entries.append(item)

    # --------------------------------------------------------
    # STEP 7: VERIFY ORDER AFTER DUPLICATE REMOVAL
    # --------------------------------------------------------

    unique_valid_dates = [
        item["_date"] for item in unique_entries if item["_date"] is not None
    ]

    if unique_valid_dates != sorted(unique_valid_dates, reverse=True):

        raise RuntimeError("Sorting changed after duplicate removal!")

    # --------------------------------------------------------
    # STEP 8: CREATE JSON
    # EXCLUDE DATE FIELD
    # --------------------------------------------------------

    result = [
        {"image": item["image"], "permalink": item["permalink"]}
        for item in unique_entries
    ]

    # --------------------------------------------------------
    # STEP 9: SAVE JSON
    # --------------------------------------------------------

    OUTPUT_FILE.parent.mkdir(parents=True, exist_ok=True)

    temp_file = OUTPUT_FILE.with_name(OUTPUT_FILE.name + ".tmp")

    try:

        with temp_file.open("w", encoding="utf-8") as file:

            json.dump(result, file, indent=4, ensure_ascii=False)

            file.write("\n")

        temp_file.replace(OUTPUT_FILE)

    except Exception:

        if temp_file.exists():
            temp_file.unlink()

        raise

    # --------------------------------------------------------
    # STEP 10: VERIFY SAVED JSON
    # --------------------------------------------------------

    with OUTPUT_FILE.open("r", encoding="utf-8") as file:

        saved_result = json.load(file)

    if saved_result != result:

        raise RuntimeError("Saved JSON content does not match expected output!")

    expected_order = [item["permalink"] for item in unique_entries]

    actual_order = [item["permalink"] for item in saved_result]

    if actual_order != expected_order:

        raise RuntimeError("Saved JSON order does not match sorted order!")

    # --------------------------------------------------------
    # STEP 11: FINAL SUMMARY
    # --------------------------------------------------------

    print("\n" + "=" * 55)
    print("MADHURIMA MINDSCAPE - EXTRACTION COMPLETED")
    print("=" * 55)

    print(f"Folders scanned       : {len(scanned_folders)}")
    print(f"YAML files discovered : {len(discovered_files)}")
    print(f"Images extracted      : {extracted_count}")
    print(f"Duplicate images      : {duplicate_count}")
    print(f"Invalid/missing dates : {invalid_date_count}")
    print(f"Skipped files         : {skipped_count}")
    print(f"Files with errors     : {error_count}")
    print(f"Unique images saved   : {len(saved_result)}")

    print("\nVerified output:")
    print(OUTPUT_FILE.resolve())

    print("\nSorting: NEWEST TO OLDEST")
    print("JSON verification: SUCCESS")

    print("=" * 55)


# ============================================================
# MAIN EXECUTION
# ============================================================

if __name__ == "__main__":

    extract_images()
