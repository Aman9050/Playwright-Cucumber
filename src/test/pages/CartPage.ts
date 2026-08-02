import { Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { CustomWorld } from '../helper/Hooks/world';

import { expect } from '@playwright/test';

export class CartPage extends BasePage {
  // Locators
  private readonly PRODUCT_HEADING = '//h2';

  constructor(page: Page, world: CustomWorld) {
    super(page, world);
  }

  /**
   * Verify product is displayed in cart
   */
  async verifyProductInCart(productName: string): Promise<void> {
    await this.getLocator(this.PRODUCT_HEADING).waitFor({ state: 'visible', timeout: 10000 });
    await this.attachScreenshotWithLog(`Verifying product: ${productName} is displayed in cart`);
    await expect(this.getLocator(this.PRODUCT_HEADING)).toHaveText(productName);
  }
}
