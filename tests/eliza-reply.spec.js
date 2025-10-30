import { test, expect } from '@playwright/test';

test.describe('Eliza AI Response Test', () => {
    test.beforeEach(async ({ page }) => {
        // Navigate to the app (uses baseURL: http://localhost:3000)
        await page.goto('/');
    });

    test('should send a message in Eliza mode and receive a bot reply', async ({ page }) => {
        // Type the user's first message (bot starts silent, waits for this)
        await page.fill('#messageBox', 'hello');

        // Submit the form
        await page.click('#sendBtn');

        // Wait for the user message to appear (confirms first message sent)
        await expect(page.locator('chat-window p.User').first()).toContainText('hello');

        // Wait for the bot reply to appear (verifies response to first user message)
        await page.waitForSelector('chat-window p.Bot', { timeout: 3000 });
        await expect(page.locator('chat-window p.Bot').first()).toBeVisible();
    });
});