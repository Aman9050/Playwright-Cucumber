import * as path from 'path';
import  * as fs from 'fs';
import { CustomWorld }  from '../Hooks/world';
import { log } from 'console';


  
 export function loadTestData(): Record<string, any> {
  
  const env = process.env.ENV || 'qa';
 
const filePath = path.resolve(
    `src/test/testdata/${env.toLowerCase()}/testdata.json`
  );

  if (!fs.existsSync(filePath)) {
    throw new Error(`Test data file not found for environment`);
  }

  const rawData = fs.readFileSync(filePath, 'utf-8');
  if(!rawData){
    throw new Error(`Test data file is empty for environment`);
 }
 console.log("Test data loaded successfully for environment");
 return JSON.parse(rawData);

}
 export function loadTestDataforcase( Record: Record<string, any>,scenarioId:any): Record<string, any> {
  
  if(scenarioId && Record[scenarioId]){
    console.log(`Loaded test data for scenario ID: ${scenarioId}`);
    console.log(Record[scenarioId]);
    return Record[scenarioId];
  }
  
 
  throw new Error(`Test data not found for scenario ID: ${scenarioId}`);

}
 
 
  

