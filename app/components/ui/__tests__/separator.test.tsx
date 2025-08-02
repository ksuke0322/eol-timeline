import { render } from '@testing-library/react'
import { axe } from 'vitest-axe'

import { Separator } from '../separator'

test('a11y check', async () => {
  const { container } = render(<Separator />)
  expect(await axe(container)).toHaveNoViolations()
})
