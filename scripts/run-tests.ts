import { spawn } from 'child_process';

function run(cmd: string, args: string[] = []): Promise<number> {
  return new Promise((resolve, reject) => {
    const p = spawn(cmd, args, { stdio: 'inherit', shell: true });
    p.on('error', (err) => reject(err));
    p.on('close', (code) => resolve(code ?? 0));
  });
}

(async () => {
  try {
    // Run tests (inherits ENV variables like ENV=qa when invoked via npm scripts)
    const testExit = await run('npx', ['cucumber-js']);

    // Always try to generate the Allure report (don't let this step fail the process)
    try {
      await run('npx', ['allure', 'generate', 'allure-results', '--clean']);
    } catch (err) {
      console.error('Allure generation failed:', err);
    }

    // Open the report locally (skip in CI environments)
    const isCI = !!process.env.CI || !!process.env.GITHUB_ACTIONS;
    if (!isCI) {
      try {
        await run('npx', ['allure', 'open', 'allure-report']);
      } catch (err) {
        console.error('Allure open failed:', err);
      }
    } else {
      console.log('CI detected - skipping `allure open`');
    }

    // Exit with the original test exit code so callers know if tests failed
    process.exit(testExit);
  } catch (err) {
    console.error('Runner failed:', err);
    process.exit(1);
  }
})();
