// Generate a  function launch the based on browser type
import { chromium, firefox, webkit, Browser } from 'playwright';
export const launchBrowser = async () => {


    const browserType = process.env.BROWSER || 'chrome';
    const isCI = !!process.env.CI || !!process.env.GITHUB_ACTIONS;
    const launchOptions = { headless: isCI, args: ['--no-sandbox', '--disable-dev-shm-usage'] };

    switch (browserType.toLowerCase()) {
        case 'chrome':
            return await chromium.launch(launchOptions);

        case 'edge':
            return await chromium.launch({ ...launchOptions, channel: 'msedge' });

        case 'firefox':
            return await firefox.launch({ ...launchOptions, slowMo: isCI ? 0 : 50 });

        case 'webkit':
            return await webkit.launch(launchOptions);

        default:
            throw new Error(`Unsupported browser type: ${browserType}`);
    }   ;

};