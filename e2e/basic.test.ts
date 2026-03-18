import { expect, test } from '@playwright/test'

test('renders LiveCursors component', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('h1')).toHaveText('Playground')
  // LiveCursors component is mounted
  await expect(page.locator('[data-live-cursors]')).toBeAttached()
})

test('WebSocket endpoint responds', async ({ request }) => {
  const response = await request.get('/_live-cursors-ws')
  // WS endpoint returns 426 Upgrade Required for non-WS requests
  expect([101, 200, 426]).toContain(response.status())
})

test('avatar endpoint returns SVG', async ({ request }) => {
  const response = await request.get('/_live-cursors-avatar/test-seed?gender=male&emotion=5&clothing=blue')
  expect(response.status()).toBe(200)
  expect(response.headers()['content-type']).toContain('image/svg+xml')
  const body = await response.text()
  expect(body).toContain('<svg')
})
