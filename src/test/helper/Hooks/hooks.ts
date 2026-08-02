// src/test/hooks/hooks.ts
import { After, Before, BeforeAll } from '@cucumber/cucumber';
import { CustomWorld } from './world';
import { loadTestData } from '../TestDatahelper/dataloader';
import { loadTestDataforcase } from '../TestDatahelper/dataloader';
import { writeAllureEnvironment } from '../ReportManager/ReportManager';
import { writeAllureExecutor } from '../ReportManager/ReportManager';
import { PageObjectManager } from '../../managers/PageObjectManager';

import { chromium } from 'playwright';
import * as  path from 'path';
import * as fs from 'fs';
import{launchBrowser} from'../BrowserManager/browser';
import { Report } from '../ReportManager/allurehelper';

let mydata:Record<string, any> ={};

BeforeAll( function () {
writeAllureEnvironment();
writeAllureExecutor();
 
  mydata=loadTestData();  

  // Any global setup can be done here
});
Before(async function (this: CustomWorld, scenario) {
  
   const scenarioName = scenario.pickle.name;
  const match = scenarioName.match(/^(\w+):/);
  const scenarioId = match ? match[1] : undefined; 
 

  this.data.scenarioId=scenarioId;
  this.log(`Starting scenario ID: ${scenarioId}`);
  this.testData=loadTestDataforcase( mydata,scenarioId);
 

  this.browser=await launchBrowser();
   

  //this.browser = await launchBrowser('firefox');
  this.context = await this.browser.newContext({permissions:[]
    })
  
   
  this.page = await this.context.newPage();
  
  
  // Initialize PageObjectManager
  this.pageObjectManager = new PageObjectManager(this.page, this);


});

After (async function (this: CustomWorld) {
  
 await  this.page.close();
   await this.context.close();


  await this.browser.close(); 
  
});
