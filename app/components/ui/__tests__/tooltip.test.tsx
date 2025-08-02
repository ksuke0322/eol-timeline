import { render } from '@testing-library/react'
import { axe } from 'vitest-axe'

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../tooltip'

test('基本的なツールチップのa11yチェック', async () => {
  const { container } = render(
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>Hover</TooltipTrigger>
        <TooltipContent>
          <p>Add to library</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>,
  )
  expect(await axe(container)).toHaveNoViolations()
})

test('長いコンテンツを持つツールチップのa11yチェック', async () => {
  const { container } = render(
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>Hover</TooltipTrigger>
        <TooltipContent>
          <p>This is a very long tooltip content that should wrap nicely.</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>,
  )
  expect(await axe(container)).toHaveNoViolations()
})

test('上側に表示されるツールチップのa11yチェック', async () => {
  const { container } = render(
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>Top</TooltipTrigger>
        <TooltipContent side="top">
          <p>Tooltip on top</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>,
  )
  expect(await axe(container)).toHaveNoViolations()
})

test('右側に表示されるツールチップのa11yチェック', async () => {
  const { container } = render(
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>Right</TooltipTrigger>
        <TooltipContent side="right">
          <p>Tooltip on right</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>,
  )
  expect(await axe(container)).toHaveNoViolations()
})

test('下側に表示されるツールチップのa11yチェック', async () => {
  const { container } = render(
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>Bottom</TooltipTrigger>
        <TooltipContent side="bottom">
          <p>Tooltip on bottom</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>,
  )
  expect(await axe(container)).toHaveNoViolations()
})

test('左側に表示されるツールチップのa11yチェック', async () => {
  const { container } = render(
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>Left</TooltipTrigger>
        <TooltipContent side="left">
          <p>Tooltip on left</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>,
  )
  expect(await axe(container)).toHaveNoViolations()
})
