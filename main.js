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
        siteHtml = "<div class=\"card-body\" style=\"padding:1rem 1.3rem 0.2rem 1.3rem\"><div class=\"ad-info-text d-flex\"><div class=\"icon flex-shrink-0\"><i class=\"uil uil-envelope\"></i></div><div class=\"flex-grow-1 d-flex flex-wrap ms-4\" style=\"width:75%\"><div style=\"max-width:100%\"><div class=\"info\">Personal Email</div><div class=\"lable w-100\">j*****@worldnet.att.net</div></div><button class=\"btn btn-primary btn-xs custom-word-break align-self-center\">Get Email Address</button></div></div><div class=\"ad-info-text d-flex\"><div class=\"icon flex-shrink-0\"><i class=\"uil uil-phone\"></i></div><div class=\"flex-grow-1 d-flex flex-wrap ms-4\" style=\"width:75%\"><div style=\"max-width:100%\"><div class=\"info\">Direct Phone</div><div class=\"lable w-100\">+1 71********</div></div><button class=\"btn btn-primary btn-xs custom-word-break align-self-center\">Get Phone Number</button></div></div><div class=\"ad-info-text d-flex\"><div class=\"icon flex-shrink-0\"><i class=\"uil uil-location-point\"></i></div><div class=\"flex-grow-1 d-flex flex-wrap ms-4\" style=\"width:75%\"><div style=\"max-width:100%\"><div class=\"info\">Location</div><div class=\"lable w-100\">Alexandria, Louisiana, United States</div></div></div></div><div class=\"ad-info-text d-flex\"><div class=\"icon flex-shrink-0\"><i class=\"uil uil-linkedin\"></i></div><div class=\"flex-grow-1 d-flex flex-wrap ms-4\" style=\"width:75%\"><div style=\"max-width:100%\"><div class=\"info\">Linkedin</div><div class=\"lable w-100\"><a href=\"https://www.linkedin.com/in/john-smith-58b9552a/\" class=\"hover link-primary fs-14\" target=\"_blank\" rel=\"noreferrer\">https://www.linkedin.com/in/john-smith-58b9552a/</a></div></div></div></div></div>"

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
