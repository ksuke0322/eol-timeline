import { render } from '@testing-library/react'
import { axe } from 'vitest-axe'

import { Button } from '../button'

test('a11y check', async () => {
  const { container } = render(<Button />)
  expect(await axe(container)).toHaveNoViolations()
})
