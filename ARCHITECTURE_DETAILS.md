# Architecture & Technical Details

## 🏗️ System Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Test Execution Layer                      │
│  (npm test → run-tests.ts → cucumber-js)                    │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                   Feature Parser (Cucumber.js)               │
│  Reads .feature files → Maps to step definitions             │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                 Step Definition Layer                        │
│  (steps/*.ts) Implements Given/When/Then logic              │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│              Page Object Model (POM) Layer                   │
│  pages/*.ts - Encapsulates page logic & selectors            │
│  PageObjectManager - Central access point                    │
│  BasePage - Shared functionality                            │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│            Support & Utility Layer                          │
│  Hooks, Config, BrowserManager, TestData                   │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│              Playwright API (Browser Driver)                 │
│  Chrome / Firefox / Safari / WebKit                          │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                  Actual Web Application                      │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔄 Test Execution Flow (Detailed)

### 1. Test Initialization
```
npm run test:qa
  ↓
package.json: "cross-env ENV=qa npm test"
  ↓ Sets ENV environment variable
npm test
  ↓
scripts/run-tests.ts (TS Compiler via ts-node)
  ↓
spawn('npx', ['cucumber-js'])
```

### 2. Feature File Parsing
```
cucumber-js reads cucumber.json
  ↓
Loads feature files from: src/test/features/*.feature
  ↓
Parses Gherkin syntax (Given/When/Then)
  ↓
Matches steps with definitions in src/test/steps/*.ts
```

### 3. Step Execution Sequence
```
@Before Hook (Executed once per scenario)
  ├─ Initialize browser (BrowserManager)
  ├─ Create browser context
  ├─ Create new page
  └─ Initialize PageObjectManager

Step 1: Given user navigates...
  ├─ Access pageObjectManager via this.pageObjectManager
  ├─ Call page.navigateTo(url)
  └─ Store results in CustomWorld

Step 2: When user enters...
  ├─ Access CustomWorld data
  ├─ Call LoginPage.enterCredentials()
  └─ Update CustomWorld if needed

Step 3: Then user should see...
  ├─ Retrieve page from PageObjectManager
  ├─ Call assertion method
  └─ Fail test if assertion fails

@After Hook (Executed once per scenario)
  ├─ Capture screenshot on failure
  ├─ Close browser/context
  └─ Clean up resources
```

### 4. Reporting
```
Test execution completes
  ↓
Results written to allure-results/ folder
  ↓
run-tests.ts calls: npx allure generate allure-results --clean
  ↓
Generates allure-report/ HTML
  ↓
Auto-opens in browser (unless CI detected)
```

---

## 🔌 Dependency Injection & Context Sharing

### CustomWorld (Context Management)

CustomWorld acts as a shared context object:

```typescript
export class CustomWorld {
  public page!: Page;
  public browser!: Browser;
  public browserContext!: BrowserContext;
  public pageObjectManager!: PageObjectManager;
  
  // Custom data storage for scenarios
  public storeData: Map<string, any> = new Map();
}
```

**Usage in Steps:**
```typescript
When('user performs action', async function(this: CustomWorld) {
  // Access shared context
  const loginPage = this.pageObjectManager.getLoginPage();
  await loginPage.login('user', 'pass');
  
  // Store data for later verification
  this.storeData.set('username', 'user');
});

Then('verify login', async function(this: CustomWorld) {
  // Retrieve data from previous steps
  const storedUser = this.storeData.get('username');
  // Assert stored data matches actual state
});
```

---

## 📦 Page Object Model (POM) Implementation

### Class Hierarchy

```
BasePage (Abstract Base)
  ├── LoginPage
  ├── ProductPage
  └── CartPage
```

### BasePage Methods (Reusable)

```typescript
export class BasePage {
  // Navigation
  async navigateTo(url: string): Promise<void>
  
  // Wait Strategies (Handle timing issues)
  async waitForPageLoad(timeout?: number): Promise<void>
  async waitForNetworkIdle(timeout?: number): Promise<void>
  async waitForDOMContentLoaded(timeout?: number): Promise<void>
  
  // Locator-based operations
  async fillInput(selector: string, value: string): Promise<void>
  async click(selector: string): Promise<void>
  async getText(selector: string): Promise<string>
  
  // Element verification
  async isVisible(selector: string): Promise<boolean>
  async isEnabled(selector: string): Promise<boolean>
}
```

### Example Page Object

```typescript
export class LoginPage extends BasePage {
  // Private selectors (encapsulation)
  private usernameInput = '#username';
  private passwordInput = '#password';
  private loginButton = 'button[type="submit"]';
  private errorMessage = '.error-message';

  // Public methods
  async enterUsername(username: string): Promise<void> {
    await this.page.fill(this.usernameInput, username);
  }

  async enterPassword(password: string): Promise<void> {
    await this.page.fill(this.passwordInput, password);
  }

  async clickLogin(): Promise<void> {
    await this.click(this.loginButton);
    await this.waitForPageLoad();  // Use inherited method
  }

  async getErrorMessage(): Promise<string> {
    return this.getText(this.errorMessage);
  }

  // High-level action (combines multiple steps)
  async login(username: string, password: string): Promise<void> {
    await this.enterUsername(username);
    await this.enterPassword(password);
    await this.clickLogin();
  }
}
```

---

## 🎯 Manager Pattern (Centralized Component Access)

### PageObjectManager Purpose

Single point of access for all page objects:

```typescript
export class PageObjectManager {
  // Private pages instances (singleton per test)
  private loginPage!: LoginPage;
  private productPage!: ProductPage;
  private cartPage!: CartPage;

  constructor(page: Page, world: CustomWorld) {
    this.initializePages();
  }

  // Lazy initialization
  private initializePages(): void {
    this.loginPage = new LoginPage(page, world);
    this.productPage = new ProductPage(page, world);
    this.cartPage = new CartPage(page, world);
  }

  // Getter methods
  getLoginPage(): LoginPage { return this.loginPage; }
  getProductPage(): ProductPage { return this.productPage; }
  getCartPage(): CartPage { return this.cartPage; }
}
```

**Usage in Steps:**
```typescript
When('user searches for product', async function(this: CustomWorld) {
  // One point of access
  const productPage = this.pageObjectManager.getProductPage();
  await productPage.searchProduct('Samsung S21');
});
```

---

## 🔧 Configuration Management

### Environment Variables

```typescript
// In steps or pages, access environment
const env = process.env.ENV;  // 'qa' or 'sit'
const baseUrl = process.env.BASE_URL || 'https://default-url.com';
```

### Cucumber Configuration (cucumber.json)

```json
{
  "default": {
    "paths": ["src/test/features/"],      // Where to find features
    "require": ["src/test/steps/*.ts"],   // Step implementations
    "requireModule": ["ts-node/register"], // Use ts-node for TS files
    "format": [
      "progress",                         // Console output
      "allure-cucumberjs/reporter"       // Allure integration
    ],
    "parallel": 2                         // 2 scenarios at a time
  }
}
```

---

## 🌐 Playwright Configuration Deep Dive

### Key Settings

```typescript
{
  testDir: './tests',           // (Overridden by Cucumber)
  fullyParallel: true,          // Tests run in parallel
  forbidOnly: !!process.env.CI, // Fail if test.only left in code
  retries: process.env.CI ? 2 : 0,  // Retry failed tests in CI
  workers: process.env.CI ? 1 : undefined, // Sequential in CI
  
  use: {
    headless: false,            // Show browser window
    trace: 'on-first-retry',   // Record trace on failure
    screenshot: 'only-on-failure',
    video: 'retain-on-failure'
  },
  
  projects: [
    { name: 'chromium' },
    { name: 'firefox' },
    { name: 'webkit' }
  ]
}
```

---

## 🔁 Loop & Scenario Outline Examples

### Scenario Outline (Data-Driven Tests)

```gherkin
Scenario Outline: Login with different users
  When user logs in with "<username>" and "<password>"
  Then user should see "<result>"

Examples:
  | username | password | result |
  | user1    | pass1    | Success |
  | user2    | pass2    | Success |
  | user3    | wrongpass | Error |
```

**Execution:**
- Runs 3 times (once per example row)
- Variables replaced: <username>, <password>, <result>
- Each run is independent

---

## 🎣 Hooks (Setup & Teardown)

### Cucumber Hooks Lifecycle

```typescript
import { Before, After, BeforeStep, AfterStep } from '@cucumber/cucumber';
import { CustomWorld } from './world';

// Runs BEFORE each scenario
Before(async function(this: CustomWorld) {
  // Initialize browser
  this.browser = await chromium.launch();
  this.browserContext = await this.browser.newContext();
  this.page = await this.browserContext.newPage();
  
  // Initialize page objects
  this.pageObjectManager = new PageObjectManager(this.page, this);
});

// Runs AFTER each scenario
After(async function(this: CustomWorld, scenario) {
  // Cleanup
  await this.page?.close();
  await this.browserContext?.close();
  await this.browser?.close();
});

// Optional: Before each step
BeforeStep(async function(this: CustomWorld) {
  // Log step execution
  console.log('Executing step...');
});

// Optional: After each step
AfterStep(async function(this: CustomWorld) {
  // Take screenshot after each step
  await this.page?.screenshot();
});
```

---

## 📊 Reporting Architecture

### Allure Integration

```
Test Execution
  ↓
cucumber-js with allure-cucumberjs/reporter format
  ↓
Generates results in allure-results/ folder:
  ├── result.json (Step pass/fail details)
  ├── container.json (Feature/Scenario structure)
  └── attachment files (Screenshots, logs)
  ↓
run-tests.ts calls: npx allure generate
  ↓
Transforms allure-results/ into HTML report
  ↓
Output: allure-report/index.html
```

### Allure Report Contents

```
Summary
├─ Pass/Fail rates
├─ Timeline
└─ Execution statistics

Features
├─ Feature 1
│  ├─ Scenario 1
│  │  ├─ Step 1 (✓ PASSED) - 2.5s
│  │  ├─ Step 2 (✓ PASSED) - 1.2s
│  │  └─ Step 3 (✗ FAILED) - Error details & screenshot
│  └─ Scenario 2
└─ Feature 2

History
├─ Previous runs
└─ Trend analysis
```

---

## 🛡️ Error Handling & Logging

### Error Scenarios

```typescript
// Locator not found
try {
  await page.click('#nonexistent');
} catch (error) {
  // Playwright throws descriptive error
  console.error('Element not found:', error.message);
  // Screenshot captured in @After hook
}

// Timeout
await page.waitForSelector('#element', { timeout: 5000 });
// If element doesn't appear within 5s, test fails

// Assertion failure
if (actualValue !== expectedValue) {
  throw new Error(`Expected ${expectedValue}, got ${actualValue}`);
}
```

### Logging Best Practice

```typescript
When('user performs action', async function(this: CustomWorld) {
  console.log('Starting action...');
  
  try {
    await this.pageObjectManager.getLoginPage().login('user', 'pass');
    console.log('Login successful');
  } catch (error) {
    console.error('Login failed:', error.message);
    throw error;
  }
});
```

---

## 🔐 Security Considerations

### Best Practices

```typescript
// ❌ DON'T hardcode credentials
async login(username: string, password: string) {
  await this.page.fill('#user', 'admin');      // ❌ Bad
  await this.page.fill('#pass', 'password123'); // ❌ Bad
}

// ✅ DO use environment variables
async login() {
  const username = process.env.TEST_USER;
  const password = process.env.TEST_PASSWORD;
  await this.page.fill('#user', username);
  await this.page.fill('#pass', password);
}

// ✅ Or use test data files
import testData from '../testdata/credentials.json';
async login() {
  const { username, password } = testData.validUser;
  await this.page.fill('#user', username);
  await this.page.fill('#pass', password);
}
```

---

## 🚀 Performance Optimization

### Parallel Execution Strategy

```json
{
  "default": {
    "parallel": 2                          // Run 2 scenarios simultaneously
  }
}
```

**Benefits:**
- Faster overall execution
- Better resource utilization
- Identify timing-related issues

**Considerations:**
- Ensure tests are isolated
- Use unique data per scenario
- Don't share page instances

### Wait Strategy Optimization

```typescript
// ❌ Avoid arbitrary sleeps
await page.waitForTimeout(5000);

// ✅ Use specific waits
await page.waitForLoadState('domcontentloaded');
await page.waitForSelector('#specific-element');
```

---

## 📈 Scalability Patterns

### Multi-Environment Support

```bash
# QA environment
npm run test:qa

# SIT environment
npm run test:sit

# Custom environment setup
cross-env ENV=staging BASE_URL=https://staging.app npm test
```

### Reusable Test Data

```
src/test/testdata/
├── users/
│  ├── qa-users.json
│  └── sit-users.json
├── products/
│   ├── test-products.json
│   └── fixtures.json
└── config/
    ├── urls.json
    └── credentials.json
```

---

## 🔍 Debugging Techniques

### Enable Headed Mode

```typescript
// playwright.config.ts
use: {
  headless: false,  // Disable headless to see browser
}
```

### Trace Viewer

```typescript
use: {
  trace: 'on-first-retry',  // Generate on failure
}

// View trace:
npx playwright show-trace allure-results/trace.zip
```

### Screenshot Capture

```typescript
// Automatic on failure
// Manual capture:
await page.screenshot({ path: 'debug.png' });
```

### Debugging with inspect

```bash
# Interactive debugging
npx playwright codegen https://example.com
```

---

## 📚 Design Patterns Used

### 1. **Page Object Model (POM)**
Encapsulates page elements and interactions

### 2. **Singleton Pattern**
PageObjectManager ensures one instance per test

### 3. **Factory Pattern**
PageObjectManager creates page instances

### 4. **Context/World Pattern**
CustomWorld shares data between steps

### 5. **Hook Pattern (Cucumber)**
Setup/teardown via Before/After hooks

---

## 🎯 Testing Best Practices

### Pyramid Approach
```
        UI Tests (Cucumber)
       /                  \
    Integration Tests    API Tests
     /                          \
        Unit Tests
```

### DRY (Don't Repeat Yourself)
- Create shared methods in BasePage
- Reuse step definitions
- Use Scenario Outline for similar tests

### SOLID Principles
- **S**ingle Responsibility - Each class has one job
- **O**pen/Closed - Open for extension, closed for modification
- **L**iskov - Subclasses are substitutable (BasePage children)
- **I**nterface Segregation - Small, focused interfaces
- **D**ependency Inversion - Depend on abstractions

---

## 🔗 Component Interaction Diagram

```
┌──────────────────┐
│   Feature File   │
│   (.feature)     │
└────────┬─────────┘
         │ matched by
         ↓
┌──────────────────────────┐
│  Step Definition         │
│  (Given/When/Then)       │
└────────┬─────────────────┘
         │ uses/calls
         ↓
┌──────────────────────────────────┐
│  PageObjectManager               │
│  (Central Access Point)          │
└────────┬─────────────────────────┘
         │ provides
         ↓
┌────────────────────────────────────────┐
│  Page Objects                          │
│  (LoginPage, ProductPage, CartPage)    │
└────────┬─────────────────────────────┐
         │ extends                      │ extends
         ↓                              ↓
┌──────────────────┐           ┌─────────────┐
│   BasePage       │           │ Specialized │
│ (Common Methods) │           │  Methods    │
└──────────────────┘           └─────────────┘
         │                         │
         └───────┬─────────────────┘
                 │ uses
                 ↓
        ┌────────────────────┐
        │ Playwright API     │
        │ (Page, Locator)    │
        └────────────────────┘
                 │
                 ↓
        ┌────────────────────┐
        │  Web Browsers      │
        │  (Chrome, Firefox) │
        └────────────────────┘
```

---

**Last Updated:** July 2026  
**Framework Version:** 1.0.0
