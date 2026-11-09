/**
 * File: blockquotes.js
 * Author: Madhurima Rawat
 * Date: November 06, 2026
 *
 * Description:
 * Automatically adds quotation marks to blockquotes
 * across Madhurima Mindscape.
 *
 * Features:
 * - Adds missing opening and closing quotation marks.
 * - Detects existing quotation marks.
 * - Prevents duplicate quotation marks.
 * - Moves misplaced closing quotation marks after punctuation.
 * - Preserves existing HTML formatting and elements.
 * - Avoids unwanted whitespace around quotation marks.
 *
 * Version: 2.1
 */

function formatBlockquotes() {

    document.querySelectorAll("blockquote").forEach(blockquote => {

        const walker = document.createTreeWalker(
            blockquote,
            NodeFilter.SHOW_TEXT
        );

        const textNodes = [];

        while (walker.nextNode()) {
            if (walker.currentNode.textContent.trim()) {
                textNodes.push(walker.currentNode);
            }
        }

        if (!textNodes.length) return;

        const openingQuotes = ["“", '"', "‘"];
        const closingQuotes = ["”", '"', "’"];
        const punctuation = [".", "!", "?", ",", ";", ":", "…"];

        // Find the first and last meaningful characters.
        function getCharacters() {
            const characters = [];

            textNodes.forEach(node => {
                for (let i = 0; i < node.textContent.length; i++) {
                    if (!/\s/.test(node.textContent[i])) {
                        characters.push({
                            node: node,
                            position: i,
                            character: node.textContent[i]
                        });
                    }
                }
            });

            return characters;
        }

        let characters = getCharacters();

        if (!characters.length) return;

        // Add opening quotation mark if missing.
        const first = characters[0];

        if (!openingQuotes.includes(first.character)) {
            first.node.insertData(first.position, "“");
        }

        // Refresh character positions after insertion.
        characters = getCharacters();

        const last = characters[characters.length - 1];
        const previous = characters[characters.length - 2];

        // Check whether the closing quote is already correctly placed.
        if (closingQuotes.includes(last.character)) {
            return;
        }

        // Move a misplaced closing quote after the punctuation.
        if (
            punctuation.includes(last.character) &&
            previous &&
            closingQuotes.includes(previous.character)
        ) {
            previous.node.deleteData(previous.position, 1);
        }

        // Refresh positions after removing a misplaced quote.
        characters = getCharacters();

        const finalCharacter = characters[characters.length - 1];

        // Add the closing quotation mark after the final character.
        finalCharacter.node.insertData(
            finalCharacter.position + 1,
            "”"
        );

    });

}

// Run after the HTML has loaded.
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", formatBlockquotes);
} else {
    formatBlockquotes();
}