// import Mylife from './example_scraper.js'; // Import the scraper class
const { updateSelectors } = require('./updateSelectors');
const { raisePullRequest } = require('./pr-creation');
const puppeteer = require('puppeteer');

(async () => {
    const filePath = './example_scraper.js'; // Path to your scraper file
    const branchName = 'update-selectors';
    const commitMessage = 'Update selectors for scraper';
    const repoOwner = 'praveen-crazy-coder';
    const repoName = 'AI-agent';

    // Step 1: Scrape data (this is independent of the update selectors part)
    // const mylife = new Mylife();
    // const listing = await mylife.scrape();
    // console.log(listing); // You can view the data you scraped

    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    try {
        // Step 2: Scrape HTML from the site (this is needed for the selector update)
        await page.goto('https://www.arounddeal.com/p/john-smith/g9acmqxbdy', { waitUntil: 'domcontentloaded' });
        let siteHtml = await page.content();
        siteHtml = "<div class=\"ad-seo-wrapper\">\n" +
            "    <div class=\"ad-avatar\">\n" +
            "        <img alt=\"seo-people\" src=\"/_next/image?url=%2Fimg%2Fpages%2Fseo-avatar.png&w=256&q=75\">\n" +
            "    </div>\n" +
            "    <div>\n" +
            "        <h1 class=\"display-6 mb-0\">John Smith</h1>\n" +
            "        <p class=\"mb-0\">Territory Business Manager at \n" +
            "            <a class=\"hover link-primary\" target=\"_blank\" href=\"/c/cnh-industrial/h1cckdnibo\">CNH Industrial</a>\n" +
            "        </p>\n" +
            "        <button class=\"btn btn-primary btn-xs custom-word-break align-self-center mt-3\">View Contact Info for Free</button>\n" +
            "    </div>\n" +
            "</div>\n" +
            "\n" +
            "<div class=\"card-body\" style=\"padding:1rem 1.3rem 0.2rem 1.3rem\">\n" +
            "    <div class=\"ad-info-text d-flex\">\n" +
            "        <div class=\"icon flex-shrink-0\"><i class=\"uil uil-envelope\"></i></div>\n" +
            "        <div class=\"flex-grow-1 d-flex flex-wrap ms-4\" style=\"width:75%\">\n" +
            "            <div style=\"max-width:100%\">\n" +
            "                <div class=\"info\">Personal Email</div>\n" +
            "                <div class=\"lable w-100\">j*****@worldnet.att.net</div>\n" +
            "            </div>\n" +
            "        </div>\n" +
            "    </div>\n" +
            "    <div class=\"ad-info-text d-flex\">\n" +
            "        <div class=\"icon flex-shrink-0\"><i class=\"uil uil-phone\"></i></div>\n" +
            "        <div class=\"flex-grow-1 d-flex flex-wrap ms-4\" style=\"width:75%\">\n" +
            "            <div style=\"max-width:100%\">\n" +
            "                <div class=\"info\">Direct Phone</div>\n" +
            "                <div class=\"lable w-100\">+1 71********</div>\n" +
            "            </div>\n" +
            "        </div>\n" +
            "    </div>\n" +
            "    <div class=\"ad-info-text d-flex\">\n" +
            "        <div class=\"icon flex-shrink-0\"><i class=\"uil uil-location-point\"></i></div>\n" +
            "        <div class=\"flex-grow-1 d-flex flex-wrap ms-4\" style=\"width:75%\">\n" +
            "            <div style=\"max-width:100%\">\n" +
            "                <div class=\"info\">Location</div>\n" +
            "                <div class=\"lable w-100\">Alexandria, Louisiana, United States</div>\n" +
            "            </div>\n" +
            "        </div>\n" +
            "    </div>\n" +
            "    <div class=\"ad-info-text d-flex\">\n" +
            "        <div class=\"icon flex-shrink-0\"><i class=\"uil uil-linkedin\"></i></div>\n" +
            "        <div class=\"flex-grow-1 d-flex flex-wrap ms-4\" style=\"width:75%\">\n" +
            "            <div style=\"max-width:100%\">\n" +
            "                <div class=\"info\">Linkedin</div>\n" +
            "                <div class=\"lable w-100\">\n" +
            "                    <a href=\"https://www.linkedin.com/in/john-smith-58b9552a/\" class=\"hover link-primary fs-14\" target=\"_blank\" rel=\"noreferrer\">https://www.linkedin.com/in/john-smith-58b9552a/</a>\n" +
            "                </div>\n" +
            "            </div>\n" +
            "        </div>\n" +
            "    </div>\n" +
            "</div>\n"

        // Step 3: Update the selectors in the scraper file (done outside the scraper)
        await updateSelectors(filePath, siteHtml);

        // Step 4: Raise a pull request with the updated file
        await raisePullRequest(repoOwner, repoName, branchName, filePath, commitMessage);
    } catch (error) {
        console.error('Failed:', error);
    } finally {
        await browser.close();
    }
})();
