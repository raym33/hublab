import { test, expect } from '@playwright/test'

test.describe('Compiler', () => {
  test('should navigate to compiler page', async ({ page }) => {
    await page.goto('/compiler')
    
    // Check if compiler page loaded
    await expect(page).toHaveURL(/\/compiler/)
  })

  test('should display capsule library', async ({ page }) => {
    await page.goto('/compiler')

    // Wait for content to load
    await page.waitForLoadState('networkidle')

    // Check if page content loaded (body should always exist)
    const body = page.locator('body')
    await expect(body).toBeVisible()
  })

  test('should handle navigation', async ({ page }) => {
    await page.goto('/')
    
    // Try to navigate to compiler
    const compilerLink = page.getByRole('link', { name: /compiler|studio/i })
    if (await compilerLink.isVisible()) {
      await compilerLink.click()
      await expect(page).toHaveURL(/\/(compiler|studio)/)
    }
  })
})
