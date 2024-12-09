const OpenAI = require('openai');

const openai = new OpenAI({
    apiKey: process.env.OPEN_AI, // Replace with your API key
});

async function suggestSelectorFix(html, brokenSelector) {
    const messages = [
        {
            role: 'system',
            content: 'You are an expert in web scraping and CSS selectors. Your task is to fix broken selectors based on the provided HTML.',
        },
        {
            role: 'user',
            content: `
A scraper failed due to a broken selector. Here's the HTML:
${html}

The broken selector is: "${brokenSelector}"

Instructions:
1. Analyze the provided HTML to understand the correct structure.
2. Suggest a valid, working CSS selector to match the intended elements.
3. The response should contain ONLY the corrected selector.
4. Do NOT include invalid, incomplete, or malformed selectors. Ensure the selector strictly adheres to CSS standards.
5. If no valid selector can be inferred, return "INVALID".
        `,
        },
    ];

    try {
        const response = await openai.chat.completions.create({
            model: 'gpt-4',
            messages,
            max_tokens: 100,
        });

        // Extract the selector
        let selector = response.choices?.[0]?.message?.content?.trim();

        if (!selector) {
            throw new Error("No valid response received from the AI.");
        }

        // Sanitize and validate the selector
        selector = selector.replace(/\blable\b/g, 'label').trim();
        // Remove unwanted quotes or extra spaces
        selector = selector.replace(/^"|"$/g, "").trim();
        validateSelector(selector); // Custom validation logic

        return selector;
    } catch (error) {
        console.error("Error while suggesting selector fix:", error);
        throw new Error("Failed to generate a valid selector. Please review the input and try again.");
    }
}

function validateSelector(selector) {
    // Check for valid CSS selector structure
    const isValid =
        /^[.#a-zA-Z[\]]/.test(selector) && // Starts with valid CSS character
        /^[a-zA-Z0-9 .#:[\]>*~+()=-]*$/.test(selector); // Contains valid CSS characters

    if (!isValid) {
        console.error(`Invalid selector format detected: "${selector}"`);
        throw new Error(`Invalid selector format: "${selector}"`);
    }
}
module.exports = { suggestSelectorFix };
