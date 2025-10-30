import { test, expect } from '@playwright/test';

test.describe('DeepSeek Mode Toggle Test', () => {
    test.beforeEach(async ({ page }) => {
        // Clear localStorage to force fresh prompt (ensures key entry per test)
        await page.evaluate(() => {
            try {
                localStorage.clear();
            } catch (e) {
                // Ignore if access denied (e.g., pre-load state)
            }
        });

        // Navigate to the app (uses baseURL: http://localhost:3000)
        await page.goto('/', { waitUntil: 'networkidle' });
    });

    test('should toggle to DeepSeek mode, send a message, and receive a bot reply', async ({ page }) => {
        // Handle API key prompt (auto-enter dummy key; saved to localStorage for session)
        page.on('dialog', (dialog) => dialog.accept('sk-test-key'));

        // Toggle to DeepSeek mode
        await page.selectOption('#aiMode', 'deepseek');
        await expect(page.locator('#aiMode')).toHaveValue('deepseek');

        // Type and submit a message
        await page.fill('#messageBox', 'What is AI?');
        await page.click('#sendBtn');

        // Wait for user message
        await expect(page.locator('chat-window p.User').first()).toContainText('What is AI?');

        // Wait for bot reply (longer timeout for API; fallback if no key works)
        await page.waitForSelector('chat-window p.Bot', { timeout: 10000 });
        await expect(page.locator('chat-window p.Bot').first()).toBeVisible();
    });
});