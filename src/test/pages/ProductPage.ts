import { Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { CustomWorld } from '../helper/Hooks/world';

export class ProductPage extends BasePage {
  constructor(page: Page, world: CustomWorld) {
    super(page, world);
  }

  /**
   * Search for product by name
   */
  async searchForProduct(productName: string): Promise<void> {
    const productNameLocator = `//h4//a[text()='${productName}']`;
    await this.waitForElementVisible(productNameLocator, 20000);
    await this.attachScreenshotWithLog(`Searching for product: ${productName}`);
    await this.click(productNameLocator);
  }
}
