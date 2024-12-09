const OpenAI = require('openai');

const openai = new OpenAI({
    apiKey: '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', // Replace with your API key
});

async function suggestSelectorFix(html, brokenSelector) {
    const messages = [
        {
            role: 'system',
            content: 'You are an expert in web scraping. Your task is to fix broken selectors based on the provided HTML.',
        },
        {
            role: 'user',
            content: `
            A scraper failed due to a broken selector. Here's the HTML:
            ${html}

            The broken selector is: "${brokenSelector}"
            Suggest a new working selector:
            `,
        },
    ];

    const response = await openai.chat.completions.create({
        model: 'gpt-4', // Use 'gpt-3.5-turbo' for a cheaper option
        messages,
        max_tokens: 100,
    });

    return response.choices[0].message.content.trim();
}

module.exports = { suggestSelectorFix };
