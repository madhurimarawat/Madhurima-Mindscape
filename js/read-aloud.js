
/**
 * File: js/read-aloud.js
 * Author: Madhurima Rawat
 * Date: November 24, 2026
 * Description:
 * Reusable multilingual Read Aloud functionality.
 * Supports voice retries, remembered successful voices, English fallback,
 * translated instructions, word highlighting, automatic scrolling,
 * pause/resume, and reading time.
 */

(function () {
    "use strict";

    // ==================================================
    // CONFIGURATION
    // ==================================================

    const LANGUAGE_STORAGE_KEY = "preferredLanguage";
    const SCROLL_GRACE_PERIOD = 20000;
    const LANGUAGE_CHECK_INTERVAL = 500;
    const VOICE_RETRY_DELAY = 300;
    const VOICE_TIMEOUT = 12000;

    const FALLBACK_MESSAGE =
        "Read Aloud is not working in your selected language. " +
        "The article will now be read in English.";

    const speechLanguages = {
        afrikaans: "af-ZA",
        albanian: "sq-AL",
        amharic: "am-ET",
        arabic: "ar-SA",
        armenian: "hy-AM",
        azerbaijani: "az-AZ",
        bengali: "bn-IN",
        bosnian: "bs-BA",
        bulgarian: "bg-BG",
        burmese: "my-MM",
        catalan: "ca-ES",
        chinese_simplified: "zh-CN",
        chinese_traditional: "zh-TW",
        croatian: "hr-HR",
        czech: "cs-CZ",
        danish: "da-DK",
        dutch: "nl-NL",
        english: "en-IN",
        estonian: "et-EE",
        filipino: "fil-PH",
        finnish: "fi-FI",
        french: "fr-FR",
        deutsch: "de-DE",
        greek: "el-GR",
        gujarati: "gu-IN",
        haitian_creole: "ht-HT",
        hebrew: "he-IL",
        hindi: "hi-IN",
        hungarian: "hu-HU",
        icelandic: "is-IS",
        inuktitut: "iu-CA",
        indonesian: "id-ID",
        irish: "ga-IE",
        italian: "it-IT",
        japanese: "ja-JP",
        kannada: "kn-IN",
        khmer: "km-KH",
        korean: "ko-KR",
        kurdish: "ku-TR",
        lao: "lo-LA",
        latvian: "lv-LV",
        lithuanian: "lt-LT",
        malagasy: "mg-MG",
        malay: "ms-MY",
        malayalam: "ml-IN",
        maltese: "mt-MT",
        maori: "mi-NZ",
        marathi: "mr-IN",
        nepali: "ne-NP",
        norwegian: "nb-NO",
        oriya: "or-IN",
        pashto: "ps-AF",
        persian: "fa-IR",
        polish: "pl-PL",
        portuguese: "pt-PT",
        punjabi: "pa-IN",
        romanian: "ro-RO",
        russian: "ru-RU",
        samoan: "sm-WS",
        slovak: "sk-SK",
        slovene: "sl-SI",
        spanish: "es-ES",
        swahili: "sw-KE",
        swedish: "sv-SE",
        tamil: "ta-IN",
        telugu: "te-IN",
        thai: "th-TH",
        tongan: "to-TO",
        turkish: "tr-TR",
        ukrainian: "uk-UA",
        urdu: "ur-PK",
        vietnamese: "vi-VN",
        welsh: "cy-GB"
    };

    const spokenInstructions = {
        english:
            "Press the highlighted word to stop reading, or press the button above to pause or resume.",

        hindi:
            "पढ़ना बंद करने के लिए हाइलाइट किए गए शब्द को दबाएँ, या पढ़ने को रोकने अथवा फिर से शुरू करने के लिए ऊपर दिए गए बटन को दबाएँ।",

        marathi:
            "वाचन थांबवण्यासाठी हायलाइट केलेल्या शब्दावर दाबा, किंवा थांबवण्यासाठी अथवा पुन्हा सुरू करण्यासाठी वरील बटण दाबा।",

        bengali:
            "পড়া বন্ধ করতে হাইলাইট করা শব্দে চাপ দিন, অথবা বিরতি দিতে বা আবার শুরু করতে উপরের বোতামটি চাপ দিন।",

        gujarati:
            "વાંચવાનું બંધ કરવા માટે હાઇલાઇટ કરેલા શબ્દને દબાવો, અથવા થોભાવવા કે ફરી શરૂ કરવા ઉપરનું બટન દબાવો.",

        tamil:
            "வாசிப்பதை நிறுத்த, முன்னிலைப்படுத்தப்பட்ட சொல்லை அழுத்தவும். இடைநிறுத்த அல்லது மீண்டும் தொடங்க மேலே உள்ள பொத்தானை அழுத்தவும்.",

        telugu:
            "చదవడం ఆపడానికి హైలైట్ చేసిన పదాన్ని నొక్కండి. పాజ్ చేయడానికి లేదా మళ్లీ ప్రారంభించడానికి పైన ఉన్న బటన్‌ను నొక్కండి.",

        kannada:
            "ಓದುವುದನ್ನು ನಿಲ್ಲಿಸಲು ಹೈಲೈಟ್ ಮಾಡಿದ ಪದವನ್ನು ಒತ್ತಿರಿ. ವಿರಾಮಗೊಳಿಸಲು ಅಥವಾ ಮತ್ತೆ ಪ್ರಾರಂಭಿಸಲು ಮೇಲಿನ ಬಟನ್ ಒತ್ತಿರಿ.",

        malayalam:
            "വായന നിർത്താൻ ഹൈലൈറ്റ് ചെയ്ത വാക്കിൽ അമർത്തുക. താൽക്കാലികമായി നിർത്താനോ വീണ്ടും ആരംഭിക്കാനോ മുകളിലെ ബട്ടൺ അമർത്തുക.",

        punjabi:
            "ਪੜ੍ਹਨਾ ਬੰਦ ਕਰਨ ਲਈ ਹਾਈਲਾਈਟ ਕੀਤੇ ਸ਼ਬਦ ਨੂੰ ਦਬਾਓ, ਜਾਂ ਰੋਕਣ ਅਤੇ ਦੁਬਾਰਾ ਸ਼ੁਰੂ ਕਰਨ ਲਈ ਉੱਪਰ ਦਿੱਤਾ ਬਟਨ ਦਬਾਓ।",

        urdu:
            "پڑھنا بند کرنے کے لیے نمایاں کیے گئے لفظ کو دبائیں، یا روکنے اور دوبارہ شروع کرنے کے لیے اوپر دیا گیا بٹن دبائیں۔",

        arabic:
            "اضغط على الكلمة المميزة لإيقاف القراءة، أو اضغط على الزر أعلاه للإيقاف المؤقت أو الاستئناف.",

        french:
            "Appuyez sur le mot surligné pour arrêter la lecture, ou sur le bouton ci-dessus pour mettre en pause ou reprendre.",

        deutsch:
            "Tippen Sie auf das hervorgehobene Wort, um das Vorlesen zu beenden, oder auf die Schaltfläche oben, um es anzuhalten oder fortzusetzen.",

        spanish:
            "Pulsa la palabra resaltada para detener la lectura, o pulsa el botón de arriba para pausar o reanudar.",

        italian:
            "Tocca la parola evidenziata per interrompere la lettura, oppure il pulsante in alto per mettere in pausa o riprendere.",

        portuguese:
            "Toque na palavra destacada para parar a leitura, ou no botão acima para pausar ou retomar.",

        dutch:
            "Tik op het gemarkeerde woord om het voorlezen te stoppen, of op de knop hierboven om te pauzeren of te hervatten.",

        russian:
            "Нажмите на выделенное слово, чтобы остановить чтение, или на кнопку выше, чтобы приостановить или возобновить его.",

        japanese:
            "読み上げを停止するにはハイライトされた単語を押してください。一時停止または再開するには上のボタンを押してください。",

        chinese_simplified:
            "点击高亮显示的文字即可停止朗读，点击上方按钮即可暂停或继续。",

        chinese_traditional:
            "點選反白的文字即可停止朗讀，點選上方按鈕即可暫停或繼續。",

        korean:
            "읽기를 중지하려면 강조 표시된 단어를 누르세요. 일시 중지하거나 다시 시작하려면 위의 버튼을 누르세요.",

        indonesian:
            "Ketuk kata yang disorot untuk menghentikan pembacaan, atau tekan tombol di atas untuk menjeda atau melanjutkan.",

        filipino:
            "Pindutin ang naka-highlight na salita upang ihinto ang pagbabasa, o pindutin ang button sa itaas upang i-pause o ipagpatuloy ito.",

        swahili:
            "Bonyeza neno lililoangaziwa ili kusimamisha usomaji, au bonyeza kitufe kilicho juu ili kusitisha au kuendelea.",

        turkish:
            "Okumayı durdurmak için vurgulanan kelimeye, duraklatmak veya devam etmek için yukarıdaki düğmeye basın.",

        vietnamese:
            "Nhấn vào từ được tô sáng để dừng đọc, hoặc nhấn nút phía trên để tạm dừng hoặc tiếp tục.",

        thai:
            "แตะคำที่ไฮไลต์เพื่อหยุดอ่าน หรือแตะปุ่มด้านบนเพื่อหยุดชั่วคราวหรืออ่านต่อ",

        polish:
            "Naciśnij podświetlone słowo, aby zatrzymać czytanie, lub przycisk powyżej, aby wstrzymać lub wznowić.",

        romanian:
            "Apasă pe cuvântul evidențiat pentru a opri citirea sau pe butonul de mai sus pentru a întrerupe ori relua.",

        greek:
            "Πατήστε την επισημασμένη λέξη για να σταματήσετε την ανάγνωση ή το παραπάνω κουμπί για παύση ή συνέχιση.",

        ukrainian:
            "Натисніть виділене слово, щоб зупинити читання, або кнопку вище, щоб призупинити чи відновити його."
    };

    // ==================================================
    // DEBUGGING
    // ==================================================

    function debug(message, data) {
        console.log(
            "%c[READ ALOUD] " + message,
            "color: #b8860b; font-weight: bold;",
            data === undefined ? "" : data
        );
    }

    // ==================================================
    // LANGUAGE HELPERS
    // ==================================================

    function getLanguageId() {
        try {
            const id = localStorage.getItem(LANGUAGE_STORAGE_KEY);
            return speechLanguages[id] ? id : "english";
        } catch (error) {
            debug("Could not read selected language:", error);
            return "english";
        }
    }

    function getLanguageCode(languageId) {
        return speechLanguages[languageId] || "en-IN";
    }

    // Preferred voice is supplied by the active component.
    // This function does not depend on the component's local synth variable.
    function getVoiceCandidates(languageCode, preferredVoice) {
        const voices = window.speechSynthesis.getVoices();
        const target = languageCode.toLowerCase();
        const prefix = target.split("-")[0];

        const exact = voices.filter(voice =>
            voice.lang.toLowerCase() === target
        );

        const matching = exact.length
            ? exact
            : voices.filter(voice =>
                voice.lang.toLowerCase().split("-")[0] === prefix
            );

        if (preferredVoice && matching.includes(preferredVoice)) {
            return [
                preferredVoice,
                ...matching.filter(voice => voice !== preferredVoice)
            ];
        }

        const natural = matching.filter(voice =>
            /natural/i.test(voice.name)
        );

        const others = matching.filter(voice =>
            !/natural/i.test(voice.name)
        );

        return [...natural, ...others];
    }

    // ==================================================
    // COMPONENT INITIALIZATION
    // ==================================================

    function initializeReadAloud(container) {
        const button = container.querySelector("#read-aloud-btn");

        if (!button || button.dataset.readAloudInitialized === "true") {
            return;
        }

        if (
            !("speechSynthesis" in window) ||
            !("SpeechSynthesisUtterance" in window)
        ) {
            button.disabled = true;
            const label = button.querySelector("span");
            if (label) label.textContent = "Read Aloud Unavailable";
            return;
        }

        button.dataset.readAloudInitialized = "true";

        const synth = window.speechSynthesis;

        let queue = [];
        let index = 0;

        let reading = false;
        let paused = false;
        let usingEnglishFallback = false;
        let switchingLanguage = false;

        let session = 0;
        let selectedLanguageId = "english";
        let currentUtterance = null;

        // A voice is remembered only after it completes an utterance.
        // The next text node will try this voice first.
        const successfulVoices = new Map();

        let languageTimer = null;
        let scrollTimer = null;
        let autoScrollTimer = null;
        let retryTimer = null;
        let fallbackTimer = null;

        let currentRange = null;
        let currentBlock = null;
        let lastScrolledBlock = null;

        let autoScrolling = false;
        let manualScrollUntil = 0;

        // ==================================================
        // STATUS MESSAGE
        // ==================================================

        let statusTimeout = null;
        let fadeTimeout = null;
        let statusElement = null;
        let statusVersion = 0;

        function getStatusElement() {
            if (statusElement && statusElement.isConnected) {
                return statusElement;
            }

            statusElement = document.getElementById("post-action-status");

            if (!statusElement) {
                statusElement = document.createElement("div");
                statusElement.id = "post-action-status";
                statusElement.className = "post-action-status";

                statusElement.setAttribute("role", "status");
                statusElement.setAttribute("aria-live", "polite");

                // Ask translation scripts to leave this changing status alone.
                statusElement.setAttribute("translate", "no");
                statusElement.setAttribute("data-no-translate", "true");
                statusElement.classList.add("notranslate");

                const parent = button.parentElement || container;
                parent.insertAdjacentElement("afterend", statusElement);
            }

            statusElement.classList.add("post-action-status", "notranslate");
            statusElement.setAttribute("translate", "no");
            statusElement.setAttribute("data-no-translate", "true");
            statusElement.classList.remove("status-fading");

            return statusElement;
        }

        function cancelStatusTimers() {
            clearTimeout(statusTimeout);
            clearTimeout(fadeTimeout);

            statusTimeout = null;
            fadeTimeout = null;
        }

        function showStatus(message, persistent = false) {
            cancelStatusTimers();

            const version = ++statusVersion;
            const status = getStatusElement();

            status.classList.remove("status-fading");
            status.textContent = String(message);

            if (persistent) return;

            statusTimeout = setTimeout(() => {
                if (version !== statusVersion || !status.isConnected) return;

                status.classList.add("status-fading");

                fadeTimeout = setTimeout(() => {
                    if (version !== statusVersion) return;

                    if (status.parentNode) {
                        status.parentNode.removeChild(status);
                    }

                    if (statusElement === status) {
                        statusElement = null;
                    }

                    statusTimeout = null;
                    fadeTimeout = null;
                }, 900);
            }, 5000);
        }

        function clearStatus() {
            cancelStatusTimers();
            statusVersion++;

            document.querySelectorAll(
                "#post-action-status, .post-action-status"
            ).forEach(element => element.remove());

            statusElement = null;
        }

        // ==================================================
        // BUTTON
        // ==================================================

        function updateButton(state) {
            const states = {
                idle: ["fas fa-volume-up", "Read Aloud", "false"],
                reading: ["fas fa-pause", "Pause", "true"],
                paused: ["fas fa-play", "Resume", "true"]
            };

            const [icon, label, pressed] = states[state];

            button.innerHTML =
                `<i class="${icon}" aria-hidden="true"></i><span>${label}</span>`;

            button.setAttribute("aria-pressed", pressed);
        }

        // ==================================================
        // HIGHLIGHT
        // ==================================================

        function clearHighlight() {
            if (window.CSS && CSS.highlights) {
                CSS.highlights.delete("read-aloud-highlight");
            }

            container.querySelectorAll(".read-aloud-active")
                .forEach(element =>
                    element.classList.remove("read-aloud-active")
                );

            currentRange = null;
            currentBlock = null;
        }

        function highlightWord(node, charIndex) {
            if (!node || !node.isConnected) return;

            const text = node.textContent || "";
            if (!text || charIndex >= text.length) return;

            let start = charIndex;
            let end = charIndex;

            while (start > 0 && !/\s/.test(text[start - 1])) start--;
            while (end < text.length && !/\s/.test(text[end])) end++;

            if (start === end) return;

            const range = document.createRange();
            range.setStart(node, start);
            range.setEnd(node, end);

            clearHighlight();

            currentRange = range;
            currentBlock = node.parentElement?.closest(
                "p, li, h1, h2, h3, h4, blockquote"
            ) || node.parentElement;

            if (window.CSS && CSS.highlights && window.Highlight) {
                CSS.highlights.set(
                    "read-aloud-highlight",
                    new Highlight(range)
                );
            } else {
                currentBlock?.classList.add("read-aloud-active");
            }

            scrollToBlock();
        }

        // ==================================================
        // SCROLLING
        // ==================================================

        function scrollToBlock() {
            if (!reading || paused || !currentBlock) return;
            if (Date.now() < manualScrollUntil) return;
            if (currentBlock === lastScrolledBlock) return;

            lastScrolledBlock = currentBlock;
            autoScrolling = true;

            currentBlock.scrollIntoView({
                behavior: "smooth",
                block: "center"
            });

            clearTimeout(autoScrollTimer);

            autoScrollTimer = setTimeout(() => {
                autoScrolling = false;
            }, 1200);
        }

        function registerManualScroll() {
            if (!reading || paused || autoScrolling) return;

            manualScrollUntil = Date.now() + SCROLL_GRACE_PERIOD;
            clearTimeout(scrollTimer);

            scrollTimer = setTimeout(() => {
                if (!reading || paused) return;
                lastScrolledBlock = null;
                scrollToBlock();
            }, SCROLL_GRACE_PERIOD);
        }

        window.addEventListener("scroll", () => {
            if (!autoScrolling) registerManualScroll();
        }, { passive: true });

        window.addEventListener("wheel", registerManualScroll, {
            passive: true
        });

        window.addEventListener("touchmove", registerManualScroll, {
            passive: true
        });

        // ==================================================
        // COLLECT ARTICLE TEXT
        // ==================================================

        function collectSpeechNodes() {
            const article = container.querySelector("main")
                || document.querySelector("main");

            if (!article) return [];

            const walker = document.createTreeWalker(
                article,
                NodeFilter.SHOW_TEXT,
                {
                    acceptNode(node) {
                        if (!node.textContent.trim()) {
                            return NodeFilter.FILTER_REJECT;
                        }

                        const excluded = node.parentElement?.closest(
                            "script, style, noscript, button, nav, footer, " +
                            "header, textarea, input, select, " +
                            "#post-actions, #read-aloud-btn, " +
                            "post-actions, .reading-info, .post-actions, " +
                            "#post-action-status, #read-aloud-status, " +
                            ".post-action-status, .notranslate, " +
                            "[translate='no'], [data-no-translate]"
                        );

                        return excluded
                            ? NodeFilter.FILTER_REJECT
                            : NodeFilter.FILTER_ACCEPT;
                    }
                }
            );

            const nodes = [];
            while (walker.nextNode()) {
                nodes.push(walker.currentNode);
            }

            debug("Collected article text nodes:", nodes.length);
            return nodes;
        }

        // ==================================================
        // STOP
        // ==================================================

        function stopReading() {
            // Invalidate callbacks before cancelling speech.
            session++;

            reading = false;
            paused = false;
            switchingLanguage = false;

            clearTimeout(retryTimer);
            clearTimeout(fallbackTimer);
            retryTimer = null;
            fallbackTimer = null;

            synth.cancel();
            currentUtterance = null;

            clearInterval(languageTimer);
            languageTimer = null;

            clearTimeout(scrollTimer);
            clearTimeout(autoScrollTimer);

            queue = [];
            index = 0;

            lastScrolledBlock = null;
            manualScrollUntil = 0;
            autoScrolling = false;

            clearHighlight();
            clearStatus();
            updateButton("idle");

            debug("Reading stopped.");
        }

        // ==================================================
        // UTTERANCE CREATION
        // ==================================================

        function createUtterance(text, languageId, voice) {
            const code = getLanguageCode(languageId);
            const utterance = new SpeechSynthesisUtterance(text);

            utterance.rate = 1;
            utterance.pitch = 1;
            utterance.volume = 1;

            if (voice) {
                utterance.voice = voice;
                utterance.lang = voice.lang;
            } else {
                utterance.lang = code;
            }

            return utterance;
        }

        function isActive(token) {
            return reading && token === session;
        }

        function getVoiceName(voice) {
            return voice ? voice.name : "Browser default voice";
        }

        // ==================================================
        // ENGLISH FALLBACK
        // ==================================================

        function switchToEnglishFallback(token) {
            if (!isActive(token) || usingEnglishFallback) return;

            usingEnglishFallback = true;
            switchingLanguage = true;

            debug("All selected-language voices failed. Starting English fallback.");

            showStatus(FALLBACK_MESSAGE, false);

            session++;
            const fallbackToken = session;

            clearTimeout(retryTimer);
            synth.cancel();
            currentUtterance = null;
            clearHighlight();

            fallbackTimer = setTimeout(() => {
                fallbackTimer = null;

                if (!isActive(fallbackToken)) return;

                switchingLanguage = false;
                speakFallbackMessage(fallbackToken);
            }, 700);
        }

        function speakFallbackMessage(token) {
            if (!isActive(token)) return;

            speak(
                FALLBACK_MESSAGE,
                "english",
                token,
                () => {
                    if (!isActive(token)) return;

                    debug("English fallback message spoken.");
                    speakCurrentArticle(token);
                },
                true,
                () => {
                    if (!isActive(token)) return;

                    showStatus(
                        FALLBACK_MESSAGE +
                        " Your browser's speech service is currently unavailable.",
                        false
                    );

                    debug("All English fallback voices failed.");
                    stopReading();
                }
            );
        }

        // ==================================================
        // SPEECH FAILURE
        // ==================================================

        function handleSpeechFailure(event, languageId, token) {
            if (!isActive(token)) return;

            debug("All voice attempts failed:", {
                error: event.error,
                selectedLanguage: languageId,
                attemptedLanguage: getLanguageCode(languageId)
            });

            if (
                languageId !== "english" &&
                !usingEnglishFallback
            ) {
                switchToEnglishFallback(token);
                return;
            }

            showStatus(
                "Read Aloud could not continue because your browser's speech service failed.",
                false
            );

            stopReading();
        }

        // ==================================================
        // SPEAK ONE UTTERANCE WITH VOICE RETRIES
        // ==================================================

        function speak(
            text,
            languageId,
            token,
            onComplete,
            isInstruction,
            onAllVoicesFailed
        ) {
            if (!isActive(token) || paused) return;

            if (!text || !text.trim()) {
                onComplete?.();
                return;
            }

            const code = getLanguageCode(languageId);

            // IMPORTANT:
            // Try the last voice that COMPLETED successfully first.
            const preferredVoice = successfulVoices.get(code.toLowerCase());

            const candidates = getVoiceCandidates(
                code,
                preferredVoice
            );

            let voiceIndex = 0;
            let finished = false;

            debug("Voice selection for this text:", {
                language: languageId,
                languageCode: code,
                rememberedVoice: preferredVoice
                    ? preferredVoice.name
                    : "No successful voice remembered",
                candidateCount: candidates.length
            });

            function tryNextVoice() {
                if (!isActive(token) || paused || finished) return;

                if (voiceIndex >= candidates.length) {
                    finished = true;

                    showStatus(
                        `All available voices failed for ${code}.`,
                        false
                    );

                    if (typeof onAllVoicesFailed === "function") {
                        onAllVoicesFailed();
                    } else {
                        handleSpeechFailure(
                            { error: "all-voices-failed" },
                            languageId,
                            token
                        );
                    }

                    return;
                }

                const voice = candidates[voiceIndex];
                const attemptNumber = voiceIndex + 1;
                voiceIndex++;

                const voiceName = getVoiceName(voice);

                debug("Trying speech voice:", {
                    language: languageId,
                    voice: voiceName,
                    attempt: attemptNumber,
                    total: candidates.length
                });

                showStatus(
                    `Trying voice ${attemptNumber}/${candidates.length}: ${voiceName}`,
                    true
                );

                const utterance = createUtterance(
                    text,
                    languageId,
                    voice
                );

                currentUtterance = utterance;

                let settled = false;
                let started = false;
                let attemptTimer = null;

                function clearAttemptTimer() {
                    clearTimeout(attemptTimer);
                    attemptTimer = null;
                }

                function failThisVoice(error) {
                    if (settled) return;

                    settled = true;
                    clearAttemptTimer();

                    if (!isActive(token)) return;

                    debug("Voice failed; trying next voice:", {
                        voice: voiceName,
                        error: error
                    });

                    currentUtterance = null;

                    showStatus(
                        `${voiceName} failed. Trying the next voice...`,
                        true
                    );

                    clearTimeout(retryTimer);

                    retryTimer = setTimeout(() => {
                        retryTimer = null;

                        if (!isActive(token) || paused || finished) return;

                        tryNextVoice();
                    }, VOICE_RETRY_DELAY);
                }

                utterance.onstart = () => {
                    if (settled || !isActive(token)) return;

                    started = true;
                    clearAttemptTimer();

                    debug("Speech started successfully:", voiceName);

                    showStatus(
                        `Reading with voice: ${voiceName}`,
                        false
                    );
                };

                utterance.onboundary = event => {
                    if (!isActive(token) || paused) return;

                    if (event.name === "word" && !isInstruction) {
                        const node = queue[index];

                        if (node) {
                            highlightWord(node, event.charIndex);
                        }
                    }
                };

                utterance.onend = () => {
                    if (settled) return;

                    settled = true;
                    clearAttemptTimer();

                    if (!isActive(token)) return;

                    finished = true;
                    currentUtterance = null;

                    // Cache ONLY after the complete utterance finishes.
                    // A voice that starts and then errors is not remembered.
                    if (voice) {
                        successfulVoices.set(code.toLowerCase(), voice);
                    }

                    debug("Speech completed:", voiceName);

                    clearStatus();

                    if (typeof onComplete === "function") {
                        onComplete();
                    }
                };

                utterance.onerror = event => {
                    if (settled) return;

                    clearAttemptTimer();

                    if (!isActive(token)) {
                        settled = true;
                        return;
                    }

                    if (
                        event.error === "canceled" ||
                        event.error === "interrupted"
                    ) {
                        settled = true;

                        debug("Speech was cancelled or interrupted:", {
                            voice: voiceName,
                            error: event.error
                        });

                        return;
                    }

                    failThisVoice(event.error || "unknown-error");
                };

                // If the browser never starts a voice, move to the next one.
                attemptTimer = setTimeout(() => {
                    if (settled || started) return;

                    settled = true;
                    clearAttemptTimer();

                    if (!isActive(token)) return;

                    debug("Voice timed out before starting:", voiceName);

                    currentUtterance = null;

                    // Cancel the stuck utterance before trying another voice.
                    synth.cancel();

                    showStatus(
                        `${voiceName} timed out. Trying the next voice...`,
                        true
                    );

                    clearTimeout(retryTimer);

                    retryTimer = setTimeout(() => {
                        retryTimer = null;

                        if (!isActive(token) || paused || finished) return;

                        tryNextVoice();
                    }, VOICE_RETRY_DELAY);
                }, VOICE_TIMEOUT);

                try {
                    synth.speak(utterance);
                } catch (error) {
                    debug("Could not queue voice:", {
                        voice: voiceName,
                        error: error
                    });

                    failThisVoice("synthesis-failed");
                }
            }

            if (!candidates.length) {
                debug("No matching installed voices:", code);

                // Let the browser choose its default voice when no matching
                // installed voice is exposed by getVoices().
                const defaultUtterance = createUtterance(text, languageId, null);
                currentUtterance = defaultUtterance;

                let defaultSettled = false;

                defaultUtterance.onstart = () => {
                    if (!isActive(token)) return;

                    showStatus("Reading with browser default voice.", false);
                };

                defaultUtterance.onboundary = event => {
                    if (!isActive(token) || paused || isInstruction) return;

                    const node = queue[index];

                    if (node && event.name === "word") {
                        highlightWord(node, event.charIndex);
                    }
                };

                defaultUtterance.onend = () => {
                    if (defaultSettled || !isActive(token)) return;

                    defaultSettled = true;
                    currentUtterance = null;
                    clearStatus();
                    onComplete?.();
                };

                defaultUtterance.onerror = event => {
                    if (defaultSettled || !isActive(token)) return;

                    defaultSettled = true;

                    if (
                        typeof onAllVoicesFailed === "function"
                    ) {
                        onAllVoicesFailed();
                    } else {
                        handleSpeechFailure(event, languageId, token);
                    }
                };

                try {
                    synth.speak(defaultUtterance);
                } catch (error) {
                    if (typeof onAllVoicesFailed === "function") {
                        onAllVoicesFailed();
                    } else {
                        handleSpeechFailure(
                            { error: "default-voice-failed" },
                            languageId,
                            token
                        );
                    }
                }

                return;
            }

            tryNextVoice();
        }

        // ==================================================
        // ARTICLE READING
        // ==================================================

        function speakCurrentArticle(token) {
            if (!isActive(token) || paused) return;

            if (index >= queue.length) {
                stopReading();
                showStatus("Finished reading this article!", false);
                debug("Finished reading article.");
                return;
            }

            const node = queue[index];

            if (!node || !node.isConnected) {
                // Do not restart from the beginning if the translation
                // script has replaced an already-read text node.
                const oldIndex = index;
                const refreshedQueue = collectSpeechNodes();

                if (!refreshedQueue.length) {
                    stopReading();
                    showStatus("Finished reading this article!", false);
                    return;
                }

                queue = refreshedQueue;

                // Keep the current position as far as possible.
                index = Math.min(oldIndex, queue.length - 1);

                if (index < 0) index = 0;

                const refreshedNode = queue[index];

                if (!refreshedNode) {
                    stopReading();
                    return;
                }
            }

            const currentNode = queue[index];

            if (!currentNode || !currentNode.isConnected) {
                index++;
                speakCurrentArticle(token);
                return;
            }

            const text = currentNode.textContent.trim();

            if (!text) {
                index++;
                speakCurrentArticle(token);
                return;
            }

            const languageId = usingEnglishFallback
                ? "english"
                : selectedLanguageId;

            speak(
                text,
                languageId,
                token,
                () => {
                    if (!isActive(token)) return;

                    index++;
                    speakCurrentArticle(token);
                }
            );
        }

        // ==================================================
        // INSTRUCTIONS
        // ==================================================

        function speakInstruction(token) {
            if (!isActive(token) || paused) return;

            const instruction = spokenInstructions[selectedLanguageId]
                || spokenInstructions.english;

            speak(
                instruction,
                selectedLanguageId,
                token,
                () => {
                    if (!isActive(token)) return;
                    speakCurrentArticle(token);
                },
                true
            );
        }

        // ==================================================
        // LANGUAGE CHANGES
        // ==================================================

        function handleLanguageChange() {
            if (!reading) return;

            const newLanguage = getLanguageId();

            if (newLanguage === selectedLanguageId) return;

            debug("Language changed:", {
                previous: selectedLanguageId,
                selected: newLanguage
            });

            selectedLanguageId = newLanguage;
            usingEnglishFallback = false;

            const wasPaused = paused;

            session++;
            const token = session;

            clearTimeout(retryTimer);
            retryTimer = null;

            synth.cancel();
            currentUtterance = null;

            clearHighlight();

            switchingLanguage = true;

            setTimeout(() => {
                if (!isActive(token)) return;

                queue = collectSpeechNodes();
                index = Math.min(index, Math.max(0, queue.length - 1));

                switchingLanguage = false;

                if (wasPaused) {
                    paused = true;
                    updateButton("paused");
                    debug("Language changed while paused.");
                    return;
                }

                paused = false;
                updateButton("reading");

                speakInstruction(token);
            }, 500);
        }

        function startLanguageWatcher() {
            clearInterval(languageTimer);

            languageTimer = setInterval(
                handleLanguageChange,
                LANGUAGE_CHECK_INTERVAL
            );
        }

        window.addEventListener("storage", event => {
            if (event.key === LANGUAGE_STORAGE_KEY) {
                handleLanguageChange();
            }
        });

        window.addEventListener("languageChanged", handleLanguageChange);

        window.addEventListener(
            "preferredLanguageChanged",
            handleLanguageChange
        );

        document.addEventListener("languageChanged", handleLanguageChange);

        // ==================================================
        // START READING
        // ==================================================

        function startReading() {
            // Invalidate old callbacks before cancelling old speech.
            session++;
            const token = session;

            synth.cancel();

            clearTimeout(retryTimer);
            clearTimeout(fallbackTimer);

            retryTimer = null;
            fallbackTimer = null;

            selectedLanguageId = getLanguageId();

            usingEnglishFallback = false;
            switchingLanguage = false;

            queue = collectSpeechNodes();

            if (!queue.length) {
                debug("No article text found.");
                showStatus("No article text was found to read.", false);
                return;
            }

            index = 0;
            reading = true;
            paused = false;

            manualScrollUntil = 0;
            lastScrolledBlock = null;

            clearHighlight();
            clearStatus();

            updateButton("reading");
            startLanguageWatcher();

            const candidates = getVoiceCandidates(
                getLanguageCode(selectedLanguageId),
                successfulVoices.get(
                    getLanguageCode(selectedLanguageId).toLowerCase()
                )
            );

            debug("Reading started:", {
                language: selectedLanguageId,
                speechCode: getLanguageCode(selectedLanguageId),
                voicesAvailable: synth.getVoices().length,
                matchingVoices: candidates.map(getVoiceName)
            });

            speakInstruction(token);
        }

        // ==================================================
        // PAUSE AND RESUME
        // ==================================================

        function pauseReading() {
            if (!reading || paused) return;

            paused = true;
            synth.pause();

            clearTimeout(scrollTimer);
            clearTimeout(autoScrollTimer);

            autoScrolling = false;
            updateButton("paused");

            debug("Reading paused.");
        }

        function resumeReading() {
            if (!reading || !paused) return;

            paused = false;
            updateButton("reading");

            if (switchingLanguage) {
                return;
            }

            // Resume the existing utterance if it is paused.
            if (synth.paused) {
                synth.resume();
                debug("Reading resumed.");
                return;
            }

            // A retry may have been waiting when Pause was pressed.
            // Continue the current article position rather than replaying
            // the instruction or the previous text node.
            if (!synth.speaking && !synth.pending) {
                const token = session;

                clearTimeout(retryTimer);
                retryTimer = null;

                if (index < queue.length) {
                    speakCurrentArticle(token);
                } else {
                    stopReading();
                }

                return;
            }

            synth.resume();
            debug("Reading resumed.");
        }

        button.addEventListener("click", () => {
            if (!reading) {
                startReading();
            } else if (paused) {
                resumeReading();
            } else {
                pauseReading();
            }
        });

        // ==================================================
        // CLICK HIGHLIGHTED WORD TO STOP
        // ==================================================

        function getCaretAtPoint(x, y) {
            if (document.caretRangeFromPoint) {
                return document.caretRangeFromPoint(x, y);
            }

            if (document.caretPositionFromPoint) {
                const position = document.caretPositionFromPoint(x, y);

                if (position) {
                    const range = document.createRange();
                    range.setStart(position.offsetNode, position.offset);
                    range.collapse(true);
                    return range;
                }
            }

            return null;
        }

        document.addEventListener("click", event => {
            if (!reading || !currentRange) return;

            if (event.target.closest("#read-aloud-btn")) return;

            const caret = getCaretAtPoint(
                event.clientX,
                event.clientY
            );

            if (!caret) return;

            try {
                if (currentRange.isPointInRange(
                    caret.startContainer,
                    caret.startOffset
                )) {
                    stopReading();
                }
            } catch (error) {
                debug("Could not check highlighted word:", error);
            }
        });

        // ==================================================
        // VOICES
        // ==================================================

        synth.addEventListener("voiceschanged", () => {
            debug(
                "Available speech voices:",
                synth.getVoices().map(voice => ({
                    name: voice.name,
                    language: voice.lang
                }))
            );
        });

        // ==================================================
        // PAGE EXIT
        // ==================================================

        window.addEventListener("pagehide", stopReading);

        updateButton("idle");

        debug("Read Aloud initialized.");
    }

    // ==================================================
    // INITIALIZE COMPONENTS
    // ==================================================

    function initializeAll() {
        document.querySelectorAll("post-actions").forEach(
            initializeReadAloud
        );
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", initializeAll);
    } else {
        initializeAll();
    }

    const observer = new MutationObserver(() => {
        initializeAll();
    });

    if (document.documentElement) {
        observer.observe(document.documentElement, {
            childList: true,
            subtree: true
        });
    }

    // ==================================================
    // READING TIME
    // ==================================================

    function calculateReadingTime() {
        const element = document.getElementById("reading-time");
        const article = document.querySelector("main");

        if (!article || !element) return;

        const text = article.innerText || article.textContent || "";
        const words = text.trim().split(/\s+/).filter(Boolean).length;

        const minutes = Math.max(1, Math.ceil(words / 200));

        element.textContent = `${minutes} min read`;
    }

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", calculateReadingTime);
    } else {
        calculateReadingTime();
    }

})();
