import { render } from '@testing-library/react'
import { axe } from 'vitest-axe'

import { Checkbox } from '../checkbox'

test('基本的なチェックボックスのa11yチェック', async () => {
  const { container } = render(<Checkbox aria-label="Basic Checkbox" />)
  expect(await axe(container)).toHaveNoViolations()
})

test('チェック済みのチェックボックスのa11yチェック', async () => {
  const { container } = render(
    <Checkbox checked aria-label="Checked Checkbox" />,
  )
  expect(await axe(container)).toHaveNoViolations()
})

test('無効化されたチェックボックスのa11yチェック', async () => {
  const { container } = render(
    <Checkbox disabled aria-label="Disabled Checkbox" />,
  )
  expect(await axe(container)).toHaveNoViolations()
})
