// Generate a  function launch the based on browser type
import { chromium, firefox, webkit, Browser } from 'playwright';
export const launchBrowser = async () => {


    const browserType = process.env.BROWSER || 'chrome';
    switch (browserType.toLowerCase()) {

        case 'chrome':
            return await chromium.launch({ headless: false });

            case'edge':
            return await chromium.launch({ headless: false ,channel:'msedge'});

        case 'firefox':
            return await firefox.launch({ headless: false,slowMo:50 });   

        case 'webkit':
            return await webkit.launch({ headless: false });        
        default:
            throw new Error(`Unsupported browser type: ${browserType}`);
    }   ;

};