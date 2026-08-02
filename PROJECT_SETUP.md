# Project Setup Guide for New Team Members

## 👋 Welcome!

This guide will help you get the Playwright-Cucumber test automation framework up and running on your machine.

---

## 📋 Prerequisites

Before starting, ensure you have:

- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **npm** (usually comes with Node.js)
- **Git** - [Download](https://git-scm.com/)
- **VS Code** (Recommended) - [Download](https://code.visualstudio.com/)

### Verify Installation

Open terminal/PowerShell and run:

```bash
node --version     # Should show v16.0.0 or higher
npm --version      # Should show 8.0.0 or higher
git --version      # Should show 2.x.x or higher
```

---

## 🚀 Step-by-Step Setup

### Step 1: Clone the Repository

```bash
git clone <repository-url>
cd Playwright-Cucumber
```

### Step 2: Install NPM Dependencies

```bash
npm install
```

This will install all packages listed in `package.json`:
- Playwright
- Cucumber
- TypeScript
- Allure Reports
- And other utilities

### Step 3: Install Playwright Browsers

```bash
npx playwright install --with-deps
```

This downloads browser binaries (Chromium, Firefox, WebKit). The `--with-deps` flag also installs system dependencies needed.

### Step 4: Verify Installation

```bash
npm test
```

If you see test execution starting and a report opening, **congratulations!** Your setup is successful.

---

## 🔍 Understanding the Project Structure

```
src/test/
├── features/       ← Write your test scenarios here (.feature files)
├── steps/          ← Implement step definitions here
├── pages/          ← Page objects and selectors live here
├── managers/       ← Page initialization manager
└── helper/         ← Utilities, configs, hooks
```

**Key Principle:** This project uses the **Page Object Model (POM)** pattern for maintainability.

---

## 📝 Writing Your First Test

### 1. Create a Feature File

Create file: `src/test/features/sample.feature`

```gherkin
Feature: Sample Test

  Scenario: My first test
    Given I navigate to the website
    When I perform an action
    Then I verify the result
```

### 2. Create Step Definitions

Create file: `src/test/steps/sample.ts`

```typescript
import { Given, When, Then } from '@cucumber/cucumber';
import { CustomWorld } from '../helper/Hooks/world';

Given('I navigate to the website', async function(this: CustomWorld) {
  // Implementation here
  // this.page - access Playwright page
  // this.pageObjectManager - access page objects
});

When('I perform an action', async function(this: CustomWorld) {
  // Implementation
});

Then('I verify the result', async function(this: CustomWorld) {
  // Assertions here
});
```

### 3. Create a Page Object (if needed)

Create file: `src/test/pages/SamplePage.ts`

```typescript
import { Page } from '@playwright/test';
import { BasePage } from './BasePage';
import { CustomWorld } from '../helper/Hooks/world';

export class SamplePage extends BasePage {
  constructor(page: Page, world: CustomWorld) {
    super(page, world);
  }

  // Define your selectors
  private someElement = 'button:has-text("Click Me")';

  // Define your actions
  async clickSomeElement(): Promise<void> {
    await this.page.click(this.someElement);
  }
}
```

### 4. Register Page in PageObjectManager

Edit: `src/test/managers/PageObjectManager.ts`

```typescript
private samplePage!: SamplePage;

private initializePages(): void {
  // ... existing pages ...
  this.samplePage = new SamplePage(this.page, this.world);
}

getSamplePage(): SamplePage {
  return this.samplePage;
}
```

### 5. Run Your Test

```bash
npm test
```

---

## 🛠️ Common Tasks

### Run Tests in Specific Environment

```bash
npm run test:qa      # Run against QA
npm run test:sit     # Run against SIT
```

### Run Specific Test Scenarios

```bash
npx cucumber-js --name "My first test"
```

### Clean Up Old Reports

```bash
npm run clean
```

### View Test Report

After tests complete:

```bash
npx allure open allure-report
```

Or open the file: `allure-report/index.html` in a browser

---

## 📚 Key Concepts Explained

### Gherkin Format (.feature files)
Human-readable test scenarios using Given-When-Then pattern:

```gherkin
Given  - Precondition (setup)
When   - Action (what you do)
Then   - Expected result (assertion)
And    - Continue from previous
```

### Page Object Model
Encapsulates page-specific code:
- **Locators/Selectors** - Where to find elements
- **Actions** - What the page can do
- **Assertions** - Expected behavior

**Benefit:** Tests stay clean, locators stay organized

### Step Definitions
Bridge between Gherkin scenarios and code:
- One step definition per Gherkin step
- Access to Playwright API
- Reusable across multiple scenarios

### CustomWorld
Shares data between steps and manages context:
- `this.page` - Playwright page instance
- `this.browser` - Browser instance
- `this.pageObjectManager` - Access to all pages

---

## 🐛 Troubleshooting

### Q: Tests won't start / "Cannot find module" error
**A:** Run `npm install` and `npx playwright install --with-deps` again

### Q: Allure report won't open
**A:** Check if `allure` is installed:
```bash
npx allure --version
```

If it fails, try:
```bash
npm install --save-dev allure-commandline
```

### Q: Browser automation failing / Elements not found
**A:** 
1. Check your selectors are correct
2. Add explicit waits in page objects
3. Enable headed mode to see browser:
   - Set `headless: false` in `playwright.config.ts`

### Q: TypeScript compilation errors
**A:**
1. Verify `tsconfig.json` is present
2. Run `npm install` again
3. Restart VS Code if using it

### Q: Tests pass locally but fail in CI (Jenkins)
**A:**
1. Check if different environment (qa/sit)
2. Verify URLs are correct for the environment
3. Check network connectivity from Jenkins agent
4. Review CI logs for more details

---

## 🎯 Best Practices

### ✅ DO:
- ✅ Use Page Objects for all page interactions
- ✅ Use descriptive step names
- ✅ Keep steps focused (one action per step)
- ✅ Use BasePage methods (waitForPageLoad, navigateTo, etc.)
- ✅ Add comments for complex logic
- ✅ Use meaningful test data

### ❌ DON'T:
- ❌ Add business logic in step definitions
- ❌ Use hardcoded URLs/credentials
- ❌ Skip waits (can cause flakiness)
- ❌ Use generic step names
- ❌ Sleep() instead of proper waits
- ❌ Mix multiple pages in one step

---

## 📖 Useful Resources

- [Cucumber Documentation](https://cucumber.io/docs/cucumber/)
- [Playwright Docs](https://playwright.dev/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Allure Report Docs](https://docs.qameta.io/allure/)

---

## 💡 Tips for Success

1. **Start simple** - Write basic scenarios first
2. **Follow existing patterns** - Check `login.feature` and `loginstep.ts` for examples
3. **Test locally first** - Before committing to Git
4. **Read error messages carefully** - They usually tell you what's wrong
5. **Ask questions** - Team is here to help!

---

## 🎓 Next Steps

1. Read [RUN_SHEET.md](RUN_SHEET.md) for detailed documentation
2. Review [QUICK_REFERENCE.md](QUICK_REFERENCE.md) for common commands
3. Explore existing tests in `src/test/features/`
4. Write your first simple test!
5. Run `npm test` and review the Allure report

---

## ✅ Checklist: Ready to Go?

- [ ] Node.js and npm installed
- [ ] Repository cloned
- [ ] `npm install` completed
- [ ] `npx playwright install --with-deps` completed
- [ ] First test run successful (`npm test`)
- [ ] Allure report opened and viewed
- [ ] Read through this guide
- [ ] Explored the project structure
- [ ] Reviewed an existing test scenario

**Congratulations! You're ready to write tests!** 🎉

---

**Questions?** Refer to:
- [RUN_SHEET.md](RUN_SHEET.md) - Detailed documentation
- [QUICK_REFERENCE.md](QUICK_REFERENCE.md) - Command quick reference
- Existing tests in `src/test/features/` - See working examples

---

**Last Updated:** July 2026
