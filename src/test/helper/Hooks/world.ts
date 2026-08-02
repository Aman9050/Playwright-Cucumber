import { setWorldConstructor, IWorldOptions, World } from '@cucumber/cucumber';
import { Browser, BrowserContext, Page } from 'playwright';
import { Report } from '../ReportManager/allurehelper';
import { PageObjectManager } from '../../managers/PageObjectManager';

export class CustomWorld {
  browser!: Browser;
  context!: BrowserContext;
  page!: Page;
  pageObjectManager!: PageObjectManager;
   data:Record<string, any> = {};
  testData!: any;
  report!: Report

  attach: IWorldOptions['attach'];
  log: IWorldOptions['log'];
  parameters: IWorldOptions['parameters'];

  constructor(options: IWorldOptions) {
    this.attach = options.attach;
    this.log = options.log;
    this.parameters = options.parameters;
   this.report = new Report(this);
     
  }
 
}

setWorldConstructor(CustomWorld);

