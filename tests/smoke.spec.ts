import { test, expect } from '@playwright/test';

const BASE_URL = process.env.BASE_URL || 'https://vocahelper.netlify.app';

test.describe('Settings / Cloud Sync visibility', () => {
  test('opens Settings via hash and shows Cloud Sync card', async ({ page }) => {
    page.on('console', msg => console.log('[console]', msg.type(), msg.text()));
    await page.goto(BASE_URL + '#settings', { waitUntil: 'domcontentloaded' });

    // Tabs should activate Settings
    const settingsSection = page.locator('#tab-settings');
    await expect(settingsSection).toBeVisible({ timeout: 5000 });

    // The Cloud Sync card title should exist
    await expect(page.getByRole('heading', { name: 'Cloud Sync (Supabase)' })).toBeVisible();

    // Settings button should navigate to Settings when clicked
    const settingsBtn = page.locator('#openSettingsBtn');
    await expect(settingsBtn).toBeVisible();
    await settingsBtn.click();
    await expect(settingsSection).toBeVisible();
  });
});

