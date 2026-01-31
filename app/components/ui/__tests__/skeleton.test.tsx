import { render } from '@testing-library/react'
import { axe } from 'vitest-axe'

import { Skeleton } from '../skeleton'

test('基本的なスケルトンのa11yチェック', async () => {
  const { container } = render(<Skeleton />)
  expect(await axe(container)).toHaveNoViolations()
})

test('カードレイアウトのスケルトンのa11yチェック', async () => {
  const { container } = render(
    <div className="flex items-center space-x-4">
      <Skeleton className="size-12 rounded-full" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[200px]" />
      </div>
    </div>,
  )
  expect(await axe(container)).toHaveNoViolations()
})
