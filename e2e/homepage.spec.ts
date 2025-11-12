import { test, expect } from '@playwright/test'

test.describe('Homepage', () => {
  test('should load the homepage', async ({ page }) => {
    await page.goto('/')
    
    // Check if page loaded
    await expect(page).toHaveTitle(/HubLab/i)
  })

  test('should have main navigation', async ({ page }) => {
    await page.goto('/')
    
    // Check for common navigation elements
    const nav = page.locator('nav')
    await expect(nav).toBeVisible()
  })

  test('should be responsive', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('/')
    await expect(page).toHaveTitle(/HubLab/i)
    
    // Test desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 })
    await expect(page).toHaveTitle(/HubLab/i)
  })
})
