import { test, expect } from '@playwright/test'

const MOCK_PRODUCTS = ['product-a', 'product-b']
const MOCK_PRODUCT_A_DETAILS = [
  { cycle: '1.0', releaseDate: '2023-01-01', support: '2024-01-01' },
]
const MOCK_PRODUCT_B_DETAILS = [
  { cycle: '2.0', releaseDate: '2022-03-15', support: '2023-03-15' },
]

test.describe('Data Persistence', () => {
  test.beforeEach(async ({ page }) => {
    await page.route('https://endoflife.date/api/all.json', async (route) => {
      await route.fulfill({ json: MOCK_PRODUCTS })
    })
    await page.route(
      'https://endoflife.date/api/product-a.json',
      async (route) => {
        await route.fulfill({ json: MOCK_PRODUCT_A_DETAILS })
      },
    )
    await page.route(
      'https://endoflife.date/api/product-b.json',
      async (route) => {
        await route.fulfill({ json: MOCK_PRODUCT_B_DETAILS })
      },
    )
  })

  test('should retain selected products after reload', async ({ page }) => {
    await page.goto('/')

    await page.waitForResponse('https://endoflife.date/api/all.json')

    await expect(page.getByTestId('product-sidebar')).toBeVisible()
    await expect(page.getByTestId('gantt-chart')).toBeVisible()

    await Promise.all([
      page.waitForResponse('https://endoflife.date/api/product-a.json'),
      page
        .getByRole('button', { name: 'Toggle details for product-a' })
        .click(),
    ])

    // Select a product
    await page.locator(`label[for="product-a_1.0"]`).click()
    await page.waitForSelector('.bar-wrapper', {
      state: 'visible',
      timeout: 30000,
    })
    await expect(page.locator('[id="product-a_1.0"]')).toBeChecked()
    await expect(page.locator('.bar-wrapper')).toHaveCount(1)

    // Reload the page
    await page.reload()

    // Wait for the page to be fully loaded after reload
    await expect(page.locator('[id="product-a_1.0"]')).toBeVisible()

    // Verify the selection is maintained
    await expect(page.locator('[id="product-a_1.0"]')).toBeChecked()
    await expect(page.locator('.bar-wrapper')).toHaveCount(1)
    await expect(page.getByText('product-a 1.0')).toBeVisible()
  })
})
