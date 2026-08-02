import * as fs from 'fs';
import * as path from 'path';
import { runtimeConfig } from '../Conifg/config';


export function writeAllureEnvironment() {
  console.log("aman");
  const resultsDir = path.resolve('allure-results');

  if (!fs.existsSync(resultsDir)) {
    fs.mkdirSync(resultsDir);
  }

  const content = `
Environment=${runtimeConfig.env}
Browser=${runtimeConfig.browser}
Project=${runtimeConfig.project}
BaseURL=${runtimeConfig.baseUrl}
`.trim();

  fs.writeFileSync(
    path.join(resultsDir, 'environment.properties'),
    content
  );
}


export function writeAllureExecutor() {
  const resultsDir = path.resolve('allure-results');

  const executor = {
    
    
    name: runtimeConfig.reporter,
  type: 'local',
  reportName: `${runtimeConfig.project} Report`,
  buildName: `${runtimeConfig.env} Run`,
  buildOrder: Date.now().toString(),
  reporter: runtimeConfig.reporter
  };

  fs.writeFileSync(
    path.join(resultsDir, 'executor.json'),
    JSON.stringify(executor, null, 2)
  );
}

