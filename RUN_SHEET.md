# Playwright-Cucumber Test Automation Framework - RUN SHEET

## 📋 Project Overview

This is a **BDD (Behavior-Driven Development) Test Automation Framework** built with:
- **Playwright** for browser automation
- **Cucumber** for Gherkin-based test scenarios
- **TypeScript** for type-safe code
- **Allure Reports** for detailed test reporting

The framework is designed to test web applications with reusable components, maintainable code structure, and comprehensive reporting capabilities.

---

## 🏗️ Project Structure

```
Playwright-Cucumber/
├── src/test/                          # Main test source code
│   ├── features/                      # Gherkin feature files (.feature)
│   │   └── login.feature             # Example: Login and product search scenarios
│   ├── steps/                         # Step definition files (Cucumber steps)
│   │   ├── loginstep.ts              # Login-related step definitions
│   │   ├── cart.ts                   # Cart-related step definitions
│   │   └── product.ts                # Product-related step definitions
│   ├── pages/                         # Page Object Model (POM) classes
│   │   ├── BasePage.ts               # Base class with common page methods
│   │   ├── LoginPage.ts              # Login page object & locators
│   │   ├── ProductPage.ts            # Product page object & locators
│   │   └── CartPage.ts               # Cart page object & locators
│   ├── managers/                      # Manager classes
│   │   └── PageObjectManager.ts      # Central manager to initialize all pages
│   └── helper/                        # Helper utilities & configurations
│       ├── BrowserManager/            # Browser initialization & setup
│       │   └── browser.ts            # Browser instance creation
│       ├── Hooks/                     # Cucumber hooks & custom world
│       │   └── world.ts              # CustomWorld for context sharing
│       ├── Conifg/                   # Configuration files
│       ├── ReportManager/            # Report generation utilities
│       └── TestDatahelper/           # Test data management
├── testdata/                          # Test data and fixtures
├── scripts/                           # Utility scripts
│   └── run-tests.ts                  # Main test runner script
├── cucumber.json                      # Cucumber configuration
├── playwright.config.ts               # Playwright configuration
├── tsconfig.json                      # TypeScript configuration
├── package.json                       # NPM dependencies & scripts
├── Jenkinsfile                        # Jenkins CI/CD pipeline
├── allure-report/                     # Generated Allure test reports
├── allure-results/                    # Raw Allure test data
└── playwright-report/                 # Playwright HTML reports
```

---

## 🛠️ Technology Stack

| Component | Version | Purpose |
|-----------|---------|---------|
| **Playwright** | ^1.58.0 | Browser automation & test execution |
| **Cucumber.js** | ^12.6.0 | BDD test framework |
| **TypeScript** | Latest | Type-safe scripting language |
| **Allure Reports** | ^2.36.0 | Test reporting & analytics |
| **ts-node** | ^10.9.2 | TypeScript execution without compilation |
| **rimraf** | ^6.1.2 | Cross-platform file deletion utility |
| **cross-env** | ^10.1.0 | Environment variable management |

---

## 📦 Installation & Setup

### Prerequisites
- **Node.js** (v16 or higher) and **npm**
- **Git** (for cloning the repository)

### Step 1: Install Dependencies
```bash
npm install
# or for CI/CD environments
npm ci
```

### Step 2: Install Playwright Browsers
```bash
npx playwright install --with-deps
```

### Step 3: Configure Environment Variables (Optional)
Create a `.env` file in the root directory:
```
ENVIRONMENT=qa
BASE_URL=https://your-app-url.com
```

### Step 4: Verify Installation
```bash
npm test
```

---

## ▶️ How to Run Tests

### Run All Tests
```bash
npm test
```

### Run Tests Against QA Environment
```bash
npm run test:qa
```

### Run Tests Against SIT Environment
```bash
npm run test:sit
```

### Run with Clean Report
```bash
npm run clean && npm test
```

### Run Specific Cucumber Scenario (Advanced)
```bash
npx cucumber-js --name "validate product is added to cart"
```

---

## 📊 Test Execution Flow

```
npm run test:qa
    ↓
scripts/run-tests.ts (Runner Script)
    ↓
cucumber-js (Feature Files → Step Definitions)
    ↓
Playwright (Browser Automation)
    ↓
Allure Report Generation
    ↓
Report Opens Automatically (Local) or Archives (CI)
```

---

## 📁 Module Descriptions

### **1. Features Directory** (`src/test/features/`)
**Purpose:** Gherkin test scenarios written in human-readable format

**Files:**
- `login.feature` - Login and product search test scenarios

**Example:**
```gherkin
Feature: Login

Background:
  Given user navigates into an application
  And user click on login

Scenario Outline: <Testcaseid>: validate product is added to cart
  And the user enter the username
  And the user enter the password
  And the user click on login button
  Then user should be login successfully
  And user search for Product "<Product>"
  Then Verify "<Product>" is displayed on cart page

Examples:
  | Product | Testcaseid |
  | Samsung galaxy s6 | TC001 |
  | Nokia lumia 1520 | TC002 |
```

---

### **2. Steps Directory** (`src/test/steps/`)
**Purpose:** Implements the step definitions from feature files

**Files:**
| File | Responsibility |
|------|-----------------|
| `loginstep.ts` | Handles login scenarios (Given/When/Then) |
| `product.ts` | Handles product search & verification |
| `cart.ts` | Handles cart operations |

**Key Responsibilities:**
- Parse Gherkin statements
- Call page object methods
- Assert expected behavior
- Handle test data

**Example Pattern:**
```typescript
import { Given, When, Then } from '@cucumber/cucumber';
import { CustomWorld } from '../helper/Hooks/world';

Given('user navigates into an application', async function(this: CustomWorld) {
  // Implementation
});

When('user clicks login', async function(this: CustomWorld) {
  // Implementation
});

Then('user should be logged in successfully', async function(this: CustomWorld) {
  // Assertion
});
```

---

### **3. Pages Directory** (`src/test/pages/`)
**Purpose:** Page Object Model (POM) - encapsulates page-specific locators and methods

**Files:**
| File | Responsibility |
|------|-----------------|
| `BasePage.ts` | Base class with reusable methods (navigation, waits, etc.) |
| `LoginPage.ts` | Login page locators & login methods |
| `ProductPage.ts` | Product page locators & search methods |
| `CartPage.ts` | Cart page locators & cart operations |

**Key Features:**
- Locator definitions
- Common wait strategies
- Page-specific actions
- Assertion helpers

**Example:**
```typescript
export class BasePage {
  constructor(page: Page, world: CustomWorld) {
    this.page = page;
    this.world = world;
  }

  async navigateTo(url: string): Promise<void> {
    await this.page.goto(url);
    await this.page.waitForLoadState('domcontentloaded');
  }

  async waitForPageLoad(timeout: number = 30000): Promise<void> {
    await this.page.waitForLoadState('load', { timeout });
  }
}
```

---

### **4. Managers Directory** (`src/test/managers/`)
**Purpose:** Centralized initialization and management of all page objects

**Files:**
- `PageObjectManager.ts` - Factory pattern to create and manage all page instances

**Responsibilities:**
- Initialize all page objects
- Provide getter methods for pages
- Ensure single instance per test

**Example:**
```typescript
export class PageObjectManager {
  private loginPage!: LoginPage;
  private productPage!: ProductPage;
  private cartPage!: CartPage;

  constructor(page: Page, world: CustomWorld) {
    this.initializePages();
  }

  getLoginPage(): LoginPage {
    return this.loginPage;
  }

  getProductPage(): ProductPage {
    return this.productPage;
  }

  getCartPage(): CartPage {
    return this.cartPage;
  }
}
```

---

### **5. Helper Directory** (`src/test/helper/`)
**Purpose:** Utility and support modules for test execution

#### **BrowserManager/** 
- `browser.ts` - Initializes and manages Playwright browser instances
- Handles browser launch options, context creation

#### **Hooks/**
- `world.ts` - Custom World object that shares context between steps
- Stores page, browser, world-specific data
- Lifecycle hooks (Before, After, BeforeStep, AfterStep)

#### **Config/**
- Configuration management (base URLs, credentials, environment-specific settings)

#### **ReportManager/**
- Allure report generation and configuration
- Screenshots and artifact attachment

#### **TestDatahelper/**
- Test data providers and fixtures
- Data-driven test support

---

### **6. Test Data Directory** (`src/test/testdata/`)
**Purpose:** Stores test data, fixtures, and static test values

**Contents:**
- User credentials
- Test URLs
- Sample product data
- Expected values for assertions

---

### **7. Scripts Directory** (`scripts/`)
**Purpose:** Utility scripts for test execution and reporting

#### **run-tests.ts**
Main test orchestration script with these responsibilities:

**Steps:**
1. Execute Cucumber tests via `cucumber-js`
2. Generate Allure report from results
3. Open Allure report locally (non-CI environments)
4. Exit with appropriate status code

**Code Flow:**
```typescript
// Execute tests
const testExit = await run('npx', ['cucumber-js']);

// Generate report
await run('npx', ['allure', 'generate', 'allure-results', '--clean']);

// Open report (unless CI detected)
if (!isCI) {
  await run('npx', ['allure', 'open', 'allure-report']);
}

// Exit with test status
process.exit(testExit);
```

---

## 🔧 Configuration Files

### **cucumber.json**
Cucumber configuration for test discovery and execution

```json
{
  "default": {
    "formatOptions": {
      "snippetInterface": "async-await"
    },
    "paths": ["src/test/features/"],
    "dryRun": false,
    "require": [
      "src/test/steps/*.ts",
      "src/test/helper/**/*.ts"
    ],
    "format": ["progress", "allure-cucumberjs/reporter"],
    "parallel": 2,
    "publishQuiet": true,
    "requireModule": ["ts-node/register"]
  }
}
```

**Key Settings:**
- `paths` - Where feature files are located
- `require` - Step definitions and helpers to load
- `parallel` - Run 2 scenarios in parallel
- `format` - Output format (progress + Allure)

---

### **playwright.config.ts**
Playwright browser and test configuration

```typescript
{
  testDir: './tests',
  fullyParallel: true,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  use: {
    headless: false,
    trace: 'on-first-retry'
  },
  projects: [
    { name: 'chromium', use: devices['Desktop Chrome'] },
    { name: 'firefox', use: devices['Desktop Firefox'] },
    { name: 'webkit', use: devices['Desktop Safari'] }
  ]
}
```

---

### **package.json Scripts**
Custom npm commands for running tests:

```json
{
  "scripts": {
    "clean": "npx rimraf allure-results allure-report videos",
    "test": "ts-node scripts/run-tests.ts",
    "test:qa": "cross-env ENV=qa npm test",
    "test:sit": "cross-env ENV=sit npm test"
  }
}
```

---

## 🔄 CI/CD Pipeline (Jenkins)

### **Jenkinsfile Overview**
Automated testing pipeline configuration for Jenkins

**Pipeline Stages:**

1. **Checkout** - Clone repository
2. **Install** - Install dependencies & Playwright
3. **Run Tests** - Execute tests based on environment parameter
4. **Post Actions** - Generate and archive reports

**Features:**
- Docker container execution (Playwright image)
- Parameterized environments (qa, sit)
- Automatic retry on failures (CI only)
- Report archiving
- Allure integration

**Command:**
```bash
npm run test:${ENV}  # ENV = qa or sit
```

**Output Artifacts:**
- `allure-report/` - Finalized HTML report
- `allure-results/` - Raw Allure data
- `playwright-report/` - Playwright HTML report

---

## 📊 Reports & Execution Artifacts

### **Allure Reports** (`allure-report/`)
Provides:
- Test execution summary (pass/fail/skip rates)
- Timeline of test execution
- Detailed step information
- Screenshots on failure
- Duration analytics
- History tracking

**View Report:**
```bash
npx allure open allure-report
```

### **Playwright Reports** (`playwright-report/`)
Provides:
- Browser-specific results
- Video recordings (if enabled)
- Trace files for debugging

---

## 🚀 Quick Start Checklist

- [ ] Install Node.js & npm
- [ ] Clone repository
- [ ] Run `npm install`
- [ ] Run `npx playwright install --with-deps`
- [ ] Configure `.env` if needed
- [ ] Run `npm test` to verify setup
- [ ] Check generated `allure-report/index.html`

---

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| Tests timeout | Increase `timeout` in step definitions or page methods |
| Browser not launching | Run `npx playwright install --with-deps` again |
| Allure report not generating | Check `allure-results/` folder has files |
| Cross-env not found (Windows) | Use `npm install cross-env --save-dev` |
| TypeScript compilation errors | Run `npm install` and verify `tsconfig.json` |

---

## 📞 Contact & Support

For issues, feature requests, or contributions:
1. Check existing test scenarios in `features/`
2. Review step implementations in `steps/`
3. Ensure page objects are updated in `pages/`
4. Run full test suite before committing

---

## 📝 Adding New Tests

### Step 1: Create Feature File
Create `.feature` file in `src/test/features/`

### Step 2: Define Steps
Add step implementations in `src/test/steps/`

### Step 3: Create Page Objects
Create page class in `src/test/pages/` extending `BasePage`

### Step 4: Register in Manager
Add to `PageObjectManager.ts` getter methods

### Step 5: Run Tests
```bash
npm test
```

---

**Last Updated:** July 2026  
**Framework Version:** 1.0.0  
**Maintainers:** QA Team
