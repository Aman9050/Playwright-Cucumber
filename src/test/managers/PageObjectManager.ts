import { Page } from '@playwright/test';
import { CustomWorld } from '../helper/Hooks/world';
import { LoginPage } from '../pages/LoginPage';
import { ProductPage } from '../pages/ProductPage';
import { CartPage } from '../pages/CartPage';

export class PageObjectManager {
  private loginPage!: LoginPage;
  private productPage!: ProductPage;
  private cartPage!: CartPage;
  private page: Page;
  private world: CustomWorld;

  constructor(page: Page, world: CustomWorld) {
    this.page = page;
    this.world = world;
    this.initializePages();
  }

  /**
   * Initialize all page objects
   */
  private initializePages(): void {
    this.loginPage = new LoginPage(this.page, this.world);
    this.productPage = new ProductPage(this.page, this.world);
    this.cartPage = new CartPage(this.page, this.world);
  }

  /**
   * Get LoginPage instance
   */
  getLoginPage(): LoginPage {
    return this.loginPage;
  }

  /**
   * Get ProductPage instance
   */
  getProductPage(): ProductPage {
    return this.productPage;
  }

  /**
   * Get CartPage instance
   */
  getCartPage(): CartPage {
    return this.cartPage;
  }
}
