import { Given,setDefaultTimeout } from "@cucumber/cucumber";
import { CustomWorld } from "../helper/Hooks/world";
import { BasePage } from "../pages/BasePage";
import { Page } from "@playwright/test";
setDefaultTimeout(60 * 1000 * 2);
Given('user navigates into an application', async function (this: CustomWorld) {
   const loginPage = this.pageObjectManager.getLoginPage();
   this.log("Navigating to application URL");
   await loginPage.navigateTo('https://www.demoblaze.com/index.html');
   
});

Given('user  click on login', async function (this: CustomWorld) {
   this.log("Inside login step");
   const loginPage = this.pageObjectManager.getLoginPage();
   await loginPage.clickLoginLink();
});

Given('the user enter the username', async function (this: CustomWorld) {
   const loginPage = this.pageObjectManager.getLoginPage();
   const username = this.testData.username;
   await loginPage.enterUsername(username);
   this.data.username = username;
});

Given('the user enter the password', async function (this: CustomWorld) {
   const loginPage = this.pageObjectManager.getLoginPage();
   await loginPage.enterPassword(this.testData.password, this.data.username);
});

Given('the user click on login button', async function (this: CustomWorld) {
   const loginPage = this.pageObjectManager.getLoginPage();
   await loginPage.clickLoginButton();
});

      