import { test, expect } from '@playwright/test'

const MOCK_PRODUCTS = ['alpha', 'beta', 'gamma']
const MOCK_ALPHA_DETAILS = [
  { cycle: '1.0', releaseDate: '2023-01-01', eol: '2024-01-01' },
]
const MOCK_BETA_DETAILS = [
  { cycle: '2.0', releaseDate: '2022-03-15', eol: '2023-03-15' },
]
const MOCK_GAMMA_DETAILS = [
  { cycle: '3.0', releaseDate: '2021-07-20', eol: '2022-07-20' },
]

test.describe('Sidebar Interactions', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('https://endoflife.date/api/all.json', async (route) => {
      await route.fulfill({ json: MOCK_PRODUCTS })
    })
    await page.route('https://endoflife.date/api/alpha.json', async (route) => {
      await route.fulfill({ json: MOCK_ALPHA_DETAILS })
    })
    await page.route('https://endoflife.date/api/beta.json', async (route) => {
      await route.fulfill({ json: MOCK_BETA_DETAILS })
    })
    await page.route('https://endoflife.date/api/gamma.json', async (route) => {
      await route.fulfill({ json: MOCK_GAMMA_DETAILS })
    })

    await page.goto('/')

    await page.waitForTimeout(2000)

    await expect(page.getByTestId('product-sidebar')).toBeVisible()
  })

  test('should filter product list based on search input', async ({ page }) => {
    await page
      .getByPlaceholder('Search products...')
      .waitFor({ state: 'visible', timeout: 30000 })
    await page.getByPlaceholder('Search products...').fill('alpha')
    await expect(page.getByText('alpha')).toBeVisible()
    await expect(page.getByText('beta')).not.toBeVisible()
    await expect(page.getByText('gamma')).not.toBeVisible()
  })

  test('should handle parent/child checkbox interactions', async ({ page }) => {
    // Check parent, expect child to be checked
    await page.locator(`label[for="alpha"]`).click()
    await expect(page.locator('[id="alpha-1.0"]')).toBeChecked()

    // Uncheck child, expect parent to be unchecked
    await page.locator(`label[for="alpha-1.0"]`).click()
    await expect(page.locator('[id="alpha"]')).not.toBeChecked()

    // Check child, expect parent to be checked
    await page.locator(`label[for="alpha-1.0"]`).click()
    await expect(page.locator('[id="alpha"]')).toBeChecked()
  })

  test('should move selected products to the top', async ({ page }) => {
    const productListFirst = page.getByTestId('sidebar-product')
    await expect(productListFirst.nth(0)).toContainText('alpha')
    await expect(productListFirst.nth(1)).toContainText('beta')
    await expect(productListFirst.nth(2)).toContainText('gamma')

    // Select gamma, expect it to move to the top
    await page.locator(`label[for="gamma-3.0"]`).click()

    const productListSecond = page.getByTestId('sidebar-product')
    await expect(productListSecond.nth(0)).toContainText('gamma')
    await expect(productListSecond.nth(1)).toContainText('alpha')
    await expect(productListSecond.nth(2)).toContainText('beta')

    // Deselect gamma, expect it to return to original position
    await page.locator(`label[for="gamma-3.0"]`).click()

    const productListThird = page.getByTestId('sidebar-product')
    await expect(productListThird.nth(0)).toContainText('alpha')
    await expect(productListThird.nth(1)).toContainText('beta')
    await expect(productListThird.nth(2)).toContainText('gamma')
  })
})
