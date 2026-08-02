# Quick Reference Guide

## ⚡ Essential Commands

### Installation
```bash
npm install                                    # Install all dependencies
npx playwright install --with-deps            # Install Playwright browsers
```

### Run Tests
```bash
npm test                                      # Run all tests
npm run test:qa                              # Run tests on QA environment
npm run test:sit                             # Run tests on SIT environment
npm run clean                                # Clean reports & results
npm run clean && npm test                    # Clean then run tests
```

### View Reports
```bash
npx allure open allure-report                # Open Allure test report
```

---

## 📁 Quick File Locator

| Need | File/Folder |
|------|------------|
| Add test scenarios | `src/test/features/*.feature` |
| Implement test steps | `src/test/steps/*.ts` |
| Page locators & actions | `src/test/pages/*.ts` |
| Common page methods | `src/test/pages/BasePage.ts` |
| Manage all pages | `src/test/managers/PageObjectManager.ts` |
| Test data | `src/test/testdata/` |
| Browser setup | `src/test/helper/BrowserManager/browser.ts` |
| Cucumber config | `cucumber.json` |
| Playwright config | `playwright.config.ts` |

---

## 🏗️ Architecture Overview

```
Feature Files (.feature)
         ↓
Step Definitions (steps/*.ts)
         ↓
Page Objects (pages/*.ts)
         ↓
Playwright API
         ↓
Browser Automation
         ↓
Test Reports (Allure & Playwright)
```

---

## 📊 Report Locations

| Report | Path |
|--------|------|
| Allure HTML | `allure-report/index.html` |
| Playwright HTML | `playwright-report/index.html` |
| Raw Results | `allure-results/` |

---

## 🔑 Key Classes & Their Purpose

| Class | Purpose |
|-------|---------|
| `BasePage` | Base methods (navigation, waits, selectors) |
| `LoginPage` | Login-specific actions and locators |
| `ProductPage` | Product search and selection |
| `CartPage` | Cart operations |
| `PageObjectManager` | Initializes and provides access to all pages |
| `CustomWorld` | Shares context between steps |

---

## ✅ Example Test Workflow

**1. Write Feature:**
```gherkin
Feature: Login
  Scenario: User logs in and searches for product
    Given user navigates to application
    When user logs in with valid credentials
    Then user should see product search page
```

**2. Create Step:**
```typescript
When('user logs in with valid credentials', async function(this: CustomWorld) {
  await pageObjectManager.getLoginPage().login('user', 'pass');
});
```

**3. Create Page Object:**
```typescript
export class LoginPage extends BasePage {
  async login(username: string, password: string) {
    // Implementation
  }
}
```

**4. Run:**
```bash
npm test
```

---

## 🚀 Environment Variables

| Variable | Usage |
|----------|-------|
| `ENV` | Set to `qa` or `sit` (used in npm scripts) |
| `CI` | Auto-detected in Jenkins/GitHub Actions |
| `GITHUB_ACTIONS` | GitHub Actions detection |

---

## 🔧 Debugging Tips

- **Enable headed mode:** Set `headless: false` in `playwright.config.ts`
- **View step traces:** Check `playwright-report/` for trace files
- **Screenshots on failure:** Automatically captured and attached to Allure report
- **Verbose logging:** Add console logs in step definitions and page objects

---

## 📦 Dependencies Summary

| Package | Use |
|---------|-----|
| `@playwright/test` | Browser automation |
| `@cucumber/cucumber` | BDD test framework |
| `typescript` | Type safety |
| `ts-node` | Run TypeScript directly |
| `allure-cucumberjs` | Report integration |
| `cross-env` | Cross-platform env vars |

---

**For detailed documentation, see:** [RUN_SHEET.md](RUN_SHEET.md)
