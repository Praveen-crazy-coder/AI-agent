const fs = require('fs');
const { suggestSelectorFix } = require('./ai-agent'); // AI function to suggest selectors

async function updateSelectors(filePath, siteHtml) {
    const fileContent = fs.readFileSync(filePath, 'utf-8');

    // Extract `Selectors` object using regex
    const selectorRegex = /Selectors\s*=\s*(\{[^}]*\})/;
    const match = selectorRegex.exec(fileContent);

    if (!match) {
        throw new Error('Selectors object not found in file.');
    }

    const selectors = eval(`(${match[1]})`); // Convert to an object
    const updatedSelectors = {};

    for (const [key, selector] of Object.entries(selectors)) {
        try {
            const newSelector = await suggestSelectorFix(siteHtml, selector);
            updatedSelectors[key] = newSelector;
        } catch (error) {
            console.error(`Failed to update selector for ${key}:`, error.message);
            updatedSelectors[key] = selector; // Keep the old one if AI fails
        }
    }

    // Replace the old Selectors object in the file content
    const updatedContent = fileContent.replace(selectorRegex, `Selectors = ${JSON.stringify(updatedSelectors, null, 4)};`);
    fs.writeFileSync(filePath, updatedContent, 'utf-8');
    console.log('Selectors updated successfully.');
}

module.exports = { updateSelectors };
