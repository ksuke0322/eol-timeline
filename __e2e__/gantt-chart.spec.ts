import { test, expect, type Page } from '@playwright/test'

const MOCK_PRODUCTS = ['product-a', 'product-b']
// Product A: 開始が遅く、終了が早い
const MOCK_PRODUCT_A_DETAILS = [
  { cycle: '1.0', releaseDate: '2023-01-01', support: '2024-01-01' },
]
// Product B: 開始が早く、終了が遅い
const MOCK_PRODUCT_B_DETAILS = [
  { cycle: '2.0', releaseDate: '2022-01-01', support: '2025-01-01' },
]

// Helper function to open accordion for a product

test.describe('Gantt Chart Interactions', () => {
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
    await page.goto('/')

    await page.waitForResponse('https://endoflife.date/api/all.json')

    await page
      .getByPlaceholder('Search products...')
      .waitFor({ state: 'visible', timeout: 30000 })

    await expect(page.getByText('product-a')).toBeVisible()

    await Promise.all([
      page.waitForResponse('https://endoflife.date/api/product-a.json'),
      page
        .getByRole('button', { name: 'Toggle details for product-a' })
        .click(),
    ])

    await Promise.all([
      page.waitForResponse('https://endoflife.date/api/product-b.json'),
      page
        .getByRole('button', { name: 'Toggle details for product-b' })
        .click(),
    ])

    await page.locator(`label[for="product-a_1.0"]`).click()
    await page.locator(`label[for="product-b_2.0"]`).click()

    await page.waitForSelector('.bar-wrapper')
    await expect(page.locator('.bar-wrapper')).toHaveCount(2)
  })

  const getGanttBarLabels = async (page: Page) => {
    return await page.evaluate(() => {
      const labels = Array.from(document.querySelectorAll('.bar-label'))
      return labels.map((el) => el.textContent?.trim())
    })
  }

  test('should sort by tool order by default', async ({ page }) => {
    const labels = await getGanttBarLabels(page)
    expect(labels).toEqual(['product-a 1.0', 'product-b 2.0'])
  })

  test('should sort by release date', async ({ page }) => {
    await page.selectOption('#sort-order', 'release')
    const labels = await getGanttBarLabels(page)
    // Product B (2022) は Product A (2023) の前に来るべき
    expect(labels).toEqual(['product-b 2.0', 'product-a 1.0'])
  })

  test('should sort by EOL date', async ({ page }) => {
    await page.selectOption('#sort-order', 'eol')
    const labels = await getGanttBarLabels(page)
    // Product A (2024) は Product B (2025) の前に来るべき
    expect(labels).toEqual(['product-a 1.0', 'product-b 2.0'])
  })

  test('should revert to tool order sorting', async ({ page }) => {
    // First sort by EOL
    await page.selectOption('#sort-order', 'eol')
    let labels = await getGanttBarLabels(page)
    expect(labels).toEqual(['product-a 1.0', 'product-b 2.0'])

    // Then sort by Tool Order
    await page.selectOption('#sort-order', 'tool')
    labels = await getGanttBarLabels(page)
    expect(labels).toEqual(['product-a 1.0', 'product-b 2.0'])
  })
})
