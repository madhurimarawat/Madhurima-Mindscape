
/*
*********************************************************************************************
* File: translate.js
* Description: Provides a custom searchable language selector and remembers the visitor's
*              selected translation language across page visits using localStorage.
*
  Date: November 24, 2026
*********************************************************************************************
*/


/**
 * ==========================================================
 * TRANSLATE.JS - CUSTOM SEARCHABLE LANGUAGE SELECTOR
 * ==========================================================
 *
 * Translation service: client.edge
 * Original language: English
 *
 * Features:
 * - Custom dropdown (no native browser popup)
 * - Search languages by English or native name
 * - English + native language display names
 * - Alphabetically sorted languages (A-Z)
 * - Six visible options with scrolling
 * - 15px gap above the options list
 * - Preserves original translate.js language IDs
 * - Uses translate.js language switching
 * - Saves selected language using localStorage
 * - Automatically restores language after page refresh
 *
 * ==========================================================
 */

document.addEventListener('DOMContentLoaded', function () {


    // ========================================================
    // 1. LANGUAGE PREFERENCE STORAGE
    // ========================================================

    const LANGUAGE_STORAGE_KEY = 'preferredLanguage';

    // Retrieve previously selected language
    function getSavedLanguage() {

        try {

            return localStorage.getItem(LANGUAGE_STORAGE_KEY);

        } catch (error) {

            return null;

        }

    }


    // Save selected language
    function savePreferredLanguage(languageId) {

        try {

            localStorage.setItem(
                LANGUAGE_STORAGE_KEY,
                languageId
            );

        } catch (error) {

            // Translation continues even if storage is unavailable

        }

    }


    // Track automatic language restoration
    let savedLanguageRestored = false;


    // ========================================================
    // 2. TRANSLATION INITIALIZATION
    // ========================================================

    // Set original website language
    translate.language.setLocal('english');

    // Configure translation service
    translate.service.use('client.edge');

    // IMPORTANT:
    // Do not call clearCacheLanguage() here.
    // We want to preserve the visitor's saved language preference.

    // Configure language selector container
    translate.selectLanguageTag.documentId = 'translate-container';

    translate.selectLanguageTag.show = true;

    // Ignore language selector during translation
    translate.ignore.id.push('translate-container');

    // Start translation listener
    translate.listener.start();


    // ========================================================
    // 3. CUSTOM LANGUAGE NAMES
    // ========================================================

    const languageNames = {

        afrikaans: 'Afrikaans (Afrikaans)',
        albanian: 'Albanian (Shqip)',
        amharic: 'Amharic (አማርኛ)',
        arabic: 'Arabic (العربية)',
        armenian: 'Armenian (Հայերեն)',
        azerbaijani: 'Azerbaijani (Azərbaycan dili)',

        bengali: 'Bengali (বাংলা)',
        bosnian: 'Bosnian (Bosanski)',
        bulgarian: 'Bulgarian (Български)',
        burmese: 'Burmese (မြန်မာဘာသာ)',

        catalan: 'Catalan (Català)',
        chinese_simplified: 'Chinese (Simplified) (简体中文)',
        chinese_traditional: 'Chinese (Traditional) (繁體中文)',
        croatian: 'Croatian (Hrvatski)',
        czech: 'Czech (Čeština)',

        danish: 'Danish (Dansk)',
        dutch: 'Dutch (Nederlands)',

        english: 'English',
        estonian: 'Estonian (Eesti)',

        filipino: 'Filipino (Wikang Filipino)',
        finnish: 'Finnish (Suomi)',
        french: 'French (Français)',

        deutsch: 'German (Deutsch)',
        greek: 'Greek (Ελληνικά)',
        gujarati: 'Gujarati (ગુજરાતી)',

        haitian_creole: 'Haitian Creole (Kreyòl ayisyen)',
        hebrew: 'Hebrew (עברית)',
        hindi: 'Hindi (हिन्दी)',
        hungarian: 'Hungarian (Magyar)',

        icelandic: 'Icelandic (Íslenska)',
        inuktitut: 'Inuktitut (ᐃᓄᒃᑎᑐᑦ)',
        indonesian: 'Indonesian (Bahasa Indonesia)',
        irish: 'Irish (Gaeilge)',
        italian: 'Italian (Italiano)',

        japanese: 'Japanese (日本語)',

        kannada: 'Kannada (ಕನ್ನಡ)',
        khmer: 'Khmer (ភាសាខ្មែរ)',
        korean: 'Korean (한국어)',
        kurdish: 'Kurdish (Kurdî)',

        lao: 'Lao (ພາສາລາວ)',
        latvian: 'Latvian (Latviešu)',
        lithuanian: 'Lithuanian (Lietuvių)',

        malagasy: 'Malagasy (Malagasy)',
        malay: 'Malay (Bahasa Melayu)',
        malayalam: 'Malayalam (മലയാളം)',
        maltese: 'Maltese (Malti)',
        maori: 'Maori (Te Reo Māori)',
        marathi: 'Marathi (मराठी)',

        nepali: 'Nepali (नेपाली)',
        norwegian: 'Norwegian (Norsk)',

        oriya: 'Odia (ଓଡ଼ିଆ)',

        pashto: 'Pashto (پښتو)',
        persian: 'Persian (فارسی)',
        polish: 'Polish (Polski)',
        portuguese: 'Portuguese (Português)',
        punjabi: 'Punjabi (ਪੰਜਾਬੀ)',

        romanian: 'Romanian (Română)',
        russian: 'Russian (Русский)',

        samoan: 'Samoan (Gagana Samoa)',
        slovak: 'Slovak (Slovenčina)',
        slovene: 'Slovenian (Slovenščina)',
        spanish: 'Spanish (Español)',
        swahili: 'Swahili (Kiswahili)',
        swedish: 'Swedish (Svenska)',

        tamil: 'Tamil (தமிழ்)',
        telugu: 'Telugu (తెలుగు)',
        thai: 'Thai (ภาษาไทย)',
        tongan: 'Tongan (Lea faka-Tonga)',
        turkish: 'Turkish (Türkçe)',

        ukrainian: 'Ukrainian (Українська)',
        urdu: 'Urdu (اردو)',

        vietnamese: 'Vietnamese (Tiếng Việt)',

        welsh: 'Welsh (Cymraeg)'

    };


    // ========================================================
    // 4. BUILD CUSTOM LANGUAGE DROPDOWN
    // ========================================================

    translate.selectLanguageTag.customUI = function (languageList) {

        const container = document.getElementById(
            translate.selectLanguageTag.documentId
        );

        if (!container) return;


        container.innerHTML = '';


        // ======================================================
        // GET SAVED LANGUAGE PREFERENCE
        // ======================================================

        const savedLanguage = getSavedLanguage();

        // Check whether saved language exists in available languages
        const hasSavedLanguage = savedLanguage &&
            languageList.some(function (lang) {

                return lang.id === savedLanguage;

            });


        // Get current language from translate.js
        const libraryCurrentLanguage =
            translate.to && translate.to.length > 0
                ? translate.to
                : translate.language.getLocal();


        // Saved preference takes priority over current library language
        const currentLanguage = hasSavedLanguage
            ? savedLanguage
            : libraryCurrentLanguage;


        // ======================================================
        // SORT LANGUAGES ALPHABETICALLY
        // ======================================================

        const sortedLanguages = [...languageList].sort(function (a, b) {

            const nameA =
                languageNames[a.id] ||
                a.name.replace(/Name$/, '').trim();

            const nameB =
                languageNames[b.id] ||
                b.name.replace(/Name$/, '').trim();

            return nameA.localeCompare(nameB, 'en', {
                sensitivity: 'base'
            });

        });


        // ======================================================
        // CREATE DROPDOWN ELEMENTS
        // ======================================================

        const dropdown = document.createElement('div');

        dropdown.className = 'custom-language-dropdown';


        // Visible selector button
        const trigger = document.createElement('button');

        trigger.type = 'button';

        trigger.className = 'language-dropdown-trigger';

        trigger.setAttribute('aria-haspopup', 'listbox');

        trigger.setAttribute('aria-expanded', 'false');


        // Dropdown panel
        const panel = document.createElement('div');

        panel.className = 'language-dropdown-panel';


        // Search input
        const searchInput = document.createElement('input');

        searchInput.type = 'search';

        searchInput.className = 'language-search-input';

        searchInput.placeholder = 'Search a language...';

        searchInput.setAttribute('aria-label', 'Search languages');

        searchInput.autocomplete = 'off';


        // Scrollable options list
        const optionsList = document.createElement('div');

        optionsList.className = 'language-dropdown-options';

        optionsList.setAttribute('role', 'listbox');


        // No-results message
        const noResults = document.createElement('div');

        noResults.className = 'language-no-results';

        noResults.textContent = 'No languages found.';

        noResults.hidden = true;


        // ======================================================
        // CREATE HIDDEN NATIVE SELECT FOR TRANSLATE.JS
        // ======================================================

        const select = document.createElement('select');

        select.id =
            translate.selectLanguageTag.documentId + 'SelectLanguage';

        select.className =
            translate.selectLanguageTag.documentId + 'SelectLanguage';

        select.setAttribute('aria-hidden', 'true');

        select.tabIndex = -1;


        // ======================================================
        // STORE LANGUAGE OPTIONS FOR SEARCH
        // ======================================================

        const languageItems = [];


        // ======================================================
        // ADD LANGUAGES
        // ======================================================

        sortedLanguages.forEach(function (lang) {

            const displayName =
                languageNames[lang.id] ||
                lang.name.replace(/Name$/, '').trim();


            // Add option to hidden native select
            const option = document.createElement('option');

            option.value = lang.id;

            option.textContent = displayName;

            if (currentLanguage === lang.id) {

                option.selected = true;

            }

            select.appendChild(option);


            // Create visible language button
            const item = document.createElement('button');

            item.type = 'button';

            item.className = 'language-dropdown-option';

            item.textContent = displayName;

            item.setAttribute('role', 'option');

            item.setAttribute(
                'aria-selected',
                String(currentLanguage === lang.id)
            );

            item.dataset.language = lang.id;


            if (currentLanguage === lang.id) {

                item.classList.add('selected');

            }


            // Searchable text: English name, native name and language ID
            languageItems.push({

                element: item,

                searchText: (
                    displayName + ' ' + lang.id
                ).toLowerCase()

            });


            // ==================================================
            // HANDLE LANGUAGE SELECTION
            // ==================================================

            item.addEventListener('click', function () {


                // Set language on hidden native select
                select.value = lang.id;


                // Save visitor's language preference
                savePreferredLanguage(lang.id);


                // Trigger translate.js language change handler
                select.dispatchEvent(
                    new Event('change', { bubbles: true })
                );


                // Update visible selector text
                trigger.textContent = displayName;


                // Update selected styling
                optionsList.querySelectorAll('.language-dropdown-option')
                    .forEach(function (button) {

                        const isSelected =
                            button.dataset.language === lang.id;

                        button.classList.toggle(
                            'selected',
                            isSelected
                        );

                        button.setAttribute(
                            'aria-selected',
                            String(isSelected)
                        );

                    });


                // Close dropdown and reset search
                dropdown.classList.remove('is-open');

                trigger.setAttribute('aria-expanded', 'false');

                searchInput.value = '';

                filterLanguages('');


            });


            optionsList.appendChild(item);

        });


        // ======================================================
        // INITIAL SELECTED LANGUAGE
        // ======================================================

        const selectedLanguage = sortedLanguages.find(function (lang) {

            return lang.id === currentLanguage;

        });


        trigger.textContent = selectedLanguage
            ? (
                languageNames[selectedLanguage.id] ||
                selectedLanguage.name.replace(/Name$/, '').trim()
            )
            : 'Select Language';


        // ======================================================
        // SEARCH FILTER
        // ======================================================

        function filterLanguages(query) {

            const searchTerm = query.trim().toLowerCase();

            let visibleCount = 0;


            languageItems.forEach(function (language) {

                const matches =
                    language.searchText.includes(searchTerm);

                language.element.hidden = !matches;

                if (matches) {

                    visibleCount++;

                }

            });


            noResults.hidden = visibleCount !== 0;

        }


        // Search as the user types
        searchInput.addEventListener('input', function () {

            filterLanguages(searchInput.value);

        });


        // ======================================================
        // PREVENT CLICKS INSIDE PANEL FROM BUBBLING
        // ======================================================

        panel.addEventListener('click', function (event) {

            event.stopPropagation();

        });


        // ======================================================
        // OPEN / CLOSE DROPDOWN
        // ======================================================

        trigger.addEventListener('click', function (event) {

            event.stopPropagation();

            const isOpen = dropdown.classList.toggle('is-open');

            trigger.setAttribute(
                'aria-expanded',
                String(isOpen)
            );


            if (isOpen) {

                searchInput.value = '';

                filterLanguages('');

                searchInput.focus();

            }

        });


        // ======================================================
        // LANGUAGE SWITCHING
        // ======================================================

        select.addEventListener('change', function (event) {

            translate.selectLanguageTag.selectOnChange(event);

        });


        // ======================================================
        // ADD ELEMENTS TO PAGE
        // ======================================================

        panel.appendChild(searchInput);

        panel.appendChild(optionsList);

        panel.appendChild(noResults);

        dropdown.appendChild(trigger);

        dropdown.appendChild(panel);

        dropdown.appendChild(select);

        container.appendChild(dropdown);


        // ======================================================
        // RESTORE SAVED LANGUAGE AUTOMATICALLY
        // ======================================================

        if (
            hasSavedLanguage &&
            !savedLanguageRestored
        ) {

            // Mark restoration as handled
            savedLanguageRestored = true;


            // Set saved language on hidden select
            select.value = savedLanguage;


            // Apply saved language using translate.js
            // This uses the same handler as manual selection
            select.dispatchEvent(
                new Event('change', { bubbles: true })
            );


        }


        // ======================================================
        // REMOVE INVALID SAVED LANGUAGE
        // ======================================================

        if (
            savedLanguage &&
            !hasSavedLanguage
        ) {

            try {

                localStorage.removeItem(LANGUAGE_STORAGE_KEY);

            } catch (error) {

                // Continue without storage

            }

        }


        // ======================================================
        // CONSOLE OUTPUT
        // ======================================================

        /**
        console.log(
            'Total Available Languages:',
            sortedLanguages.length
        );

        console.table(
            sortedLanguages.map(function (lang) {

                return {

                    Language_Name:
                        languageNames[lang.id] ||
                        lang.name.replace(/Name$/, '').trim(),

                    Language_Code: lang.id

                };

            })
        );
        **/


    };


    // ========================================================
    // 5. INITIALIZE TRANSLATION
    // ========================================================

    translate.execute();


    // ========================================================
    // 6. FLOATING LANGUAGE BUTTON
    // ========================================================

    const button = document.getElementById('language-toggle');

    const container = document.getElementById('translate-container');


    if (button && container) {

        button.addEventListener('click', function () {

            container.classList.toggle('active');


            // Close dropdown when hiding language panel
            const dropdown = container.querySelector(
                '.custom-language-dropdown'
            );


            if (dropdown) {

                dropdown.classList.remove('is-open');


                const trigger = dropdown.querySelector(
                    '.language-dropdown-trigger'
                );


                if (trigger) {

                    trigger.setAttribute(
                        'aria-expanded',
                        'false'
                    );

                }

            }

        });

    }


    // ========================================================
    // 7. CLOSE DROPDOWN WHEN CLICKING OUTSIDE
    // ========================================================

    document.addEventListener('click', function (event) {

        const dropdown = document.querySelector(
            '.custom-language-dropdown'
        );


        if (dropdown && !dropdown.contains(event.target)) {

            dropdown.classList.remove('is-open');


            const trigger = dropdown.querySelector(
                '.language-dropdown-trigger'
            );


            if (trigger) {

                trigger.setAttribute(
                    'aria-expanded',
                    'false'
                );

            }

        }

    });


});
