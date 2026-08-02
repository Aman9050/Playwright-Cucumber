import { Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { CustomWorld } from '../helper/Hooks/world';
import { expect } from '@playwright/test';

export class LoginPage extends BasePage {
  // Locators
  private readonly LOGIN_LINK = "//li//a[text()='Log in']";
  private readonly LOGIN_USERNAME_INPUT = "//input[@id='loginusername']";
  private readonly LOGIN_PASSWORD_INPUT = "//input[@id='loginpassword']";
  private readonly LOGIN_MODAL = '#logInModal';
  private readonly LOGIN_BUTTON = "//button[contains(text(),'Log in')]";
  private readonly WELCOME_USER = '#nameofuser';

  constructor(page: Page, world: CustomWorld) {
    super(page, world);
  }

  /**
   * Click on login link
   */
  async clickLoginLink(): Promise<void> {
    await this.click(this.LOGIN_LINK);
    await this.attachScreenshotWithLog('Clicked on login link');
  }

  /**
   * Enter username
   */
  async enterUsername(username: string): Promise<void> {
    await this.fillText(this.LOGIN_USERNAME_INPUT, username);
    console.log(`Filling username: ${username}`);
    await this.attachScreenshotWithLog(`Entered username: ${username}`);
  }

  /**
   * Enter password
   */
  async enterPassword(password: string, username: string): Promise<void> {
    await this.fillText(this.LOGIN_PASSWORD_INPUT, password);
    console.log(`Filling password: ${password}`);
    await this.attachScreenshotWithLog(`Entered password for user ${username}`);
  }

  /**
   * Click login button
   */
  async clickLoginButton(): Promise<void> {
    console.log('Inside login button step');
    const modal = this.getLocator(this.LOGIN_MODAL);
    const loginBtn = modal.getByRole('button', { name: 'Log in' });
    console.log(await loginBtn.count());
    await loginBtn.click();
  }

  /**
   * Verify login success
   */
  async verifyLoginSuccess(username: string): Promise<void> {
    console.log('Verifying login success');
    await this.waitForElementVisible(this.WELCOME_USER, 10000);
    await expect(this.getLocator(this.WELCOME_USER)).toHaveText(`Welcome ${username}`);
    console.log(`User logged in as: ${username}`);
  }
}
