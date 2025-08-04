import { test, expect } from '@playwright/test'

const MOCK_PRODUCTS = ['product-a', 'product-b']
const MOCK_PRODUCT_A_DETAILS = [
  { cycle: '1.0', releaseDate: '2023-01-01', eol: '2024-01-01' },
  { cycle: '1.1', releaseDate: '2023-06-01', eol: '2024-06-01' },
]
const MOCK_PRODUCT_B_DETAILS = [
  { cycle: '2.0', releaseDate: '2022-03-15', eol: '2023-03-15' },
]

test.describe('Initial Display and Basic Operations', () => {
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
    await page.waitForResponse('https://endoflife.date/api/product-a.json')
    await page.waitForResponse('https://endoflife.date/api/product-b.json')

    await expect(page.getByTestId('product-sidebar')).toBeVisible()
    await expect(page.getByTestId('gantt-chart')).toBeVisible()
  })

  test('should display sidebar and gantt chart', async ({ page }) => {
    await expect(page.getByTestId('product-sidebar')).toBeVisible()
    await expect(page.getByTestId('gantt-chart')).toBeVisible()
  })

  test('should display product list in sidebar', async ({ page }) => {
    await expect(page.getByText('product-a')).toBeVisible()
    await expect(page.getByText('product-b')).toBeVisible()
  })

  test('should reflect product selection in gantt chart', async ({ page }) => {
    await page.locator(`label[for="product-a-1.0"]`).click()
    await page.waitForSelector('.bar-wrapper', {
      state: 'visible',
      timeout: 30000,
    })
    await expect(page.locator('.bar-wrapper')).toHaveCount(1)
    await expect(page.getByText('product-a 1.0')).toBeVisible()

    await page.locator(`label[for="product-b-2.0"]`).click()
    await page.waitForSelector('.bar-wrapper', {
      state: 'visible',
      timeout: 30000,
    })
    await expect(page.locator('.bar-wrapper')).toHaveCount(2)
    await expect(page.getByText('product-b 2.0')).toBeVisible()
  })

  test('should remove product from gantt chart on deselection', async ({
    page,
  }) => {
    await page.locator(`label[for="product-a-1.0"]`).click()
    await page.locator(`label[for="product-b-2.0"]`).click()
    await page.waitForSelector('.bar-wrapper', {
      state: 'visible',
      timeout: 30000,
    })
    await expect(page.locator('.bar-wrapper')).toHaveCount(2)

    await page.locator(`label[for="product-a-1.0"]`).click()
    await page.waitForSelector('.bar-wrapper', {
      state: 'visible',
      timeout: 30000,
    })
    await expect(page.locator('.bar-wrapper')).toHaveCount(1, {
      timeout: 15000,
    })
    await expect(page.getByText('product-a 1.0')).not.toBeVisible()
  })
})
