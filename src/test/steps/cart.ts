import { setDefaultTimeout, Then } from "@cucumber/cucumber";
import type { CustomWorld } from "../helper/Hooks/world";
setDefaultTimeout(60 * 1000 * 2)

Then('Verify {string} is displayed to the user on cart page', async function (this: CustomWorld, pname: string) {
   const cartPage = this.pageObjectManager.getCartPage();
   await cartPage.verifyProductInCart(pname);
});