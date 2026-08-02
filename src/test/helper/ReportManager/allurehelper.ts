import * as fs from 'fs';
import { Page } from '@playwright/test';
import { CustomWorld } from '../Hooks/world';

export class Report{
  world: CustomWorld;

  constructor(world: CustomWorld) {
    this.world = world;
  }
 

 
  async attachScreenshot() {
    
    const screenshotBuffer = await this.world.page.screenshot();
    this.world.attach(screenshotBuffer, 'image/png');
   

   


    

   
  }

  /**
   * Attach log message
   */
  async attachLog(message: string) {
    this.world.attach(message);
  
  }

  /**
   * Attach both screenshot and log
   */
  async attachScreenshotWithLog(message: string) {
     this.world.attach(message);
    const screenshotBuffer = await this.world.page.screenshot();
    this.world.attach(screenshotBuffer, 'image/png');
   
  }

  /**
   * Write environment info for Allure report
   */
  static writeEnvironmentInfo(envInfo: { [key: string]: string }) {
    const envFile = `allure-results/environment.properties`;
    const lines = Object.entries(envInfo).map(([k, v]) => `${k}=${v}`).join('\n');
    fs.writeFileSync(envFile, lines);
  }
}
