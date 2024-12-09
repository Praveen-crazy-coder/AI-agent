import puppeteer from 'puppeteer';

class Mylife {
    Selectors = {
        DataElements: "#contact-information .card-body .info + .lable",
        Name: ".ad-seo-wrapper .hhfhhh display-6"
    }

    constructor() {}

    async scrape() {
        const listing = {};
        const browser = await puppeteer.launch({ headless: false });
        const page = await browser.newPage();
        await page.goto('https://www.arounddeal.com/p/john-smith/g9acmqxbdy', { waitUntil: 'domcontentloaded' });

        const name = await page.$eval(this.Selectors.Name, el => el.textContent.trim());
        const dataElements = await page.$$(this.Selectors.DataElements);

        const email = await dataElements[0].evaluate(el => el.textContent.trim());
        const address = await dataElements[2].evaluate(el => el.textContent.trim());

        listing.name = name;
        listing.email = email;
        listing.address = address;
        console.debug(JSON.stringify(listing))
        await browser.close()
        return listing;
    }
}

// Use ES Module export
export default Mylife;

// Example of usage
const mylife = new Mylife();
const listing = await mylife.scrape();
console.log(listing);
