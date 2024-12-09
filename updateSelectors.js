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

    // Manually format the updated selectors as JavaScript with unquoted keys
    let updatedSelectorsString = 'Selectors = {\n';
    for (const [key, value] of Object.entries(updatedSelectors)) {
        updatedSelectorsString += `    ${key}: "${value}",\n`;
    }
    updatedSelectorsString = updatedSelectorsString.trimEnd().slice(0, -1);  // Remove the last comma
    updatedSelectorsString += '\n};';

    // Replace the old Selectors object in the file content
    const updatedContent = fileContent.replace(selectorRegex, updatedSelectorsString);
    fs.writeFileSync(filePath, updatedContent, 'utf-8');
    console.log('Selectors updated successfully.');
}

module.exports = { updateSelectors };
