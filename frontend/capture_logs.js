const { chromium } = require('playwright');

(async () => {
    try {
        const browser = await chromium.launch();
        const page = await browser.newPage();

        page.on('console', msg => console.log('BROWSER_LOG:', msg.type(), msg.text()));
        page.on('pageerror', err => console.log('BROWSER_ERROR:', err.message));

        await page.goto('http://localhost:5173', { waitUntil: 'networkidle', timeout: 10000 });

        // Let it sit for a second to catch any delayed errors
        await page.waitForTimeout(2000);

        await browser.close();
    } catch (e) {
        console.error("SCRIPT_ERROR:", e.message);
    }
})();
