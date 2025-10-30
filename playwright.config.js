// playwright.config.js
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
    testDir: './tests',  // Folder for test files (we'll create this)
    fullyParallel: true,
    forbidOnly: !!process.env.CI,
    retries: process.env.CI ? 2 : 0,
    workers: process.env.CI ? 1 : undefined,
    reporter: 'html',  // Generates html-report/ after runs
    use: {
        baseURL: 'http://localhost:3000',  // We'll serve your app here
        trace: 'on-first-retry',
    },
    projects: [
        {
            name: 'chromium',
            use: { ...devices['Desktop Chrome'] },
        },
        // Add more: { name: 'firefox', use: { ...devices['Desktop Firefox'] } }
    ],
});