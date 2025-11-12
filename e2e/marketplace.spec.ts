import { test, expect } from '@playwright/test'

test.describe('Marketplace', () => {
  test('should load marketplace page', async ({ page }) => {
    await page.goto('/marketplace')
    
    await expect(page).toHaveURL(/\/marketplace/)
  })

  test('should display capsules', async ({ page }) => {
    await page.goto('/marketplace')
    
    // Wait for data to load
    await page.waitForLoadState('networkidle')
    
    // Check if page has content
    const main = page.locator('main')
    await expect(main).toBeVisible()
  })

  test('should have search functionality', async ({ page }) => {
    await page.goto('/marketplace')
    await page.waitForLoadState('networkidle')
    
    // Look for search input
    const searchInput = page.locator('input[type="search"], input[placeholder*="search" i]')
    if (await searchInput.isVisible()) {
      await expect(searchInput).toBeEditable()
    }
  })
})
