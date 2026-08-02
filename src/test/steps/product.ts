import { Then ,setDefaultTimeout} from "@cucumber/cucumber";
import { CustomWorld } from "../helper/Hooks/world";
setDefaultTimeout(60 * 1000 * 2)
Then('user search for Product {string}', async function (this: CustomWorld, pr: string) {
   const productPage = this.pageObjectManager.getProductPage();
   await productPage.searchForProduct(pr);
});

Then('user should be login sucessfully', async function (this: CustomWorld) {
   const loginPage = this.pageObjectManager.getLoginPage();
   await loginPage.verifyLoginSuccess(this.data.username);
});

