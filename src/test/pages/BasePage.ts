import { Page, Locator } from '@playwright/test';
import { CustomWorld } from '../helper/Hooks/world';

export class BasePage {
   page: Page;
  world: CustomWorld;

  constructor(page: Page, world: CustomWorld) {
    this.page = page;
    this.world = world;
  }

  /**
   * Wait for page to load completely
   */
  async waitForPageLoad(timeout: number = 30000): Promise<void> {
    await this.page.waitForLoadState('load', { timeout });
  }

  // Wait for network to be idle
  async waitForNetworkIdle(timeout: number = 30000): Promise<void> {
    await this.page.waitForLoadState('networkidle', { timeout });
  } 

    //  Wait for DOM content to be loaded
  async waitForDOMContentLoaded(timeout: number = 30000): Promise<void> {
    await this.page.waitForLoadState('domcontentloaded', { timeout });
  }

    

  /**
   * Navigate to URL
   */
  async navigateTo(url: string): Promise<void> {
    await this.page.goto(url, { waitUntil: 'domcontentloaded' });
    // Wait for a small delay to ensure page is stable
    await this.page.waitForTimeout(2000);
  }

  /**
   * Get element locator
   */
  getLocator(selector: string): Locator {
    return this.page.locator(selector);
  }

  /**
   * Click on element
   */
  async click(selector: string): Promise<void> {
    const locator = this.getLocator(selector);
    await locator.waitFor({ state: 'visible', timeout: 20000 });
    await locator.scrollIntoViewIfNeeded();
    await locator.click();
  }

  /**
   * Fill text in input field
   */
  async fillText(selector: string, text: string): Promise<void> {
    await this.getLocator(selector).fill(text);
  }

  /**
   * Get text from element
   */
  async getText(selector: string): Promise<string> {
    return await this.getLocator(selector).textContent() || '';
  }

  /**
   * Wait for element to be visible
   */
  async waitForElementVisible(selector: string, timeout: number = 20000): Promise<void> {
    await this.getLocator(selector).waitFor({ state: 'visible', timeout });
  }

  /**
   * Check if element is visible
   */
  async isElementVisible(selector: string): Promise<boolean> {
    return await this.getLocator(selector).isVisible();
  }

  /**
   * Attach screenshot with log message
   */
  async attachScreenshotWithLog(message: string): Promise<void> {
    await this.world.report.attachScreenshotWithLog(message);
  }
  async attachLog(message: string): Promise<void> {
    await this.world.report.attachLog(message);
  }
}
