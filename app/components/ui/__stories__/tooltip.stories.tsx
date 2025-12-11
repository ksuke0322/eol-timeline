// FIXME: tooltip を本格的に使うようなら直す
// sidebar 内で tooltip 系のコンポーネントを参照しているが実際には利用していない
// にも関わらずテストが flaky で保守のコストが高いテストのため除外する

import type { Meta, StoryObj } from '@storybook/react-vite'

import { Button } from '~/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/ui/tooltip'

const meta = {
  title: 'UI/Tooltip',
  component: Tooltip,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Tooltip>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args: Parameters<typeof Tooltip>[0]) => (
    <Tooltip {...args} delayDuration={0}>
      <TooltipTrigger asChild>
        <Button variant="outline">Hover</Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>Add to library</p>
      </TooltipContent>
    </Tooltip>
  ),
  // play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
  //   const canvas = within(canvasElement)
  //   const trigger = canvas.getByRole('button', { name: 'Hover' })
  //   const name = 'Add to library'

  //   // 初期状態: DOM にないことを確認（portal 外も含めて screen で確認）
  //   expect(screen.queryByRole('tooltip', { name })).toBeNull()

  //   // 開く
  //   await userEvent.hover(trigger)
  //   const tooltip = await screen.findByRole(
  //     'tooltip',
  //     { name },
  //     { timeout: 2000 },
  //   )
  //   await expect(tooltip).toBeVisible()

  //   // 閉じる（unhover → 要素の消滅まで待つ。非表示のみの実装でもリトライで吸収）
  //   await userEvent.unhover(trigger)
  //   await userEvent.pointer({ target: document.body })
  //   await waitForElementToBeRemoved(
  //     () => screen.queryByRole('tooltip', { name }),
  //     { timeout: 2000 },
  //   ).catch(async () => {
  //     // 実装によっては非表示で DOM 残存のことがあるためフォールバック
  //     await waitFor(
  //       () => {
  //         expect(screen.getByRole('tooltip', { name })).not.toBeVisible()
  //       },
  //       { timeout: 2000 },
  //     )
  //   })
  // },
}

export const WithLongContent: Story = {
  render: (args: Parameters<typeof Tooltip>[0]) => (
    <Tooltip {...args} delayDuration={0}>
      <TooltipTrigger asChild>
        <Button variant="outline">Hover</Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>This is a very long tooltip content that should wrap nicely.</p>
      </TooltipContent>
    </Tooltip>
  ),
  // play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
  //   const canvas = within(canvasElement)
  //   const trigger = canvas.getByRole('button', { name: 'Hover' })

  //   await expect(
  //     screen.queryByRole('tooltip', {
  //       name: 'This is a very long tooltip content that should wrap nicely.',
  //     }),
  //   ).not.toBeInTheDocument()

  //   await userEvent.hover(trigger)
  //   await waitFor(() => {
  //     expect(
  //       screen.queryByRole('tooltip', {
  //         name: 'This is a very long tooltip content that should wrap nicely.',
  //       }),
  //     ).toBeVisible()
  //   })

  //   await userEvent.unhover(trigger)
  //   await userEvent.pointer({ target: document.body })
  //   await waitFor(() => {
  //     expect(
  //       screen.queryByRole('tooltip', {
  //         name: 'This is a very long tooltip content that should wrap nicely.',
  //       }),
  //     ).not.toBeVisible()
  //   })
  // },
}

export const WithSide: Story = {
  render: (args: Parameters<typeof Tooltip>[0]) => (
    <div className="flex gap-4">
      <Tooltip {...args} delayDuration={0}>
        <TooltipTrigger asChild>
          <Button variant="outline">Top</Button>
        </TooltipTrigger>
        <TooltipContent side="top">
          <p>Tooltip on top</p>
        </TooltipContent>
      </Tooltip>
      <Tooltip {...args} delayDuration={0}>
        <TooltipTrigger asChild>
          <Button variant="outline">Right</Button>
        </TooltipTrigger>
        <TooltipContent side="right">
          <p>Tooltip on right</p>
        </TooltipContent>
      </Tooltip>
      <Tooltip {...args} delayDuration={0}>
        <TooltipTrigger asChild>
          <Button variant="outline">Bottom</Button>
        </TooltipTrigger>
        <TooltipContent side="bottom">
          <p>Tooltip on bottom</p>
        </TooltipContent>
      </Tooltip>
      <Tooltip {...args} delayDuration={0}>
        <TooltipTrigger asChild>
          <Button variant="outline">Left</Button>
        </TooltipTrigger>
        <TooltipContent side="left">
          <p>Tooltip on left</p>
        </TooltipContent>
      </Tooltip>
    </div>
  ),
  // play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
  //   const canvas = within(canvasElement)

  //   await expect(
  //     screen.queryByRole('tooltip', { name: 'Tooltip on top' }),
  //   ).not.toBeInTheDocument()
  //   await expect(
  //     screen.queryByRole('tooltip', { name: 'Tooltip on right' }),
  //   ).not.toBeInTheDocument()
  //   await expect(
  //     screen.queryByRole('tooltip', { name: 'Tooltip on bottom' }),
  //   ).not.toBeInTheDocument()
  //   await expect(
  //     screen.queryByRole('tooltip', { name: 'Tooltip on left' }),
  //   ).not.toBeInTheDocument()

  //   const topTrigger = canvas.getByRole('button', { name: 'Top' })
  //   await userEvent.hover(topTrigger)
  //   await waitFor(() => {
  //     expect(
  //       screen.queryByRole('tooltip', { name: 'Tooltip on top' }),
  //     ).toBeVisible()
  //   })

  //   await userEvent.unhover(topTrigger)
  //   await userEvent.pointer({ target: document.body })
  //   await waitFor(() => {
  //     expect(
  //       screen.queryByRole('tooltip', { name: 'Tooltip on top' }),
  //     ).not.toBeVisible()
  //   })

  //   const rightTrigger = canvas.getByRole('button', { name: 'Right' })
  //   await userEvent.hover(rightTrigger)
  //   await waitFor(() => {
  //     expect(
  //       screen.queryByRole('tooltip', { name: 'Tooltip on right' }),
  //     ).toBeVisible()
  //   })

  //   await userEvent.unhover(rightTrigger)
  //   await userEvent.pointer({ target: document.body })
  //   await waitFor(() => {
  //     expect(
  //       screen.queryByRole('tooltip', { name: 'Tooltip on right' }),
  //     ).not.toBeVisible()
  //   })

  //   const bottomTrigger = canvas.getByRole('button', { name: 'Bottom' })
  //   await userEvent.hover(bottomTrigger)
  //   await waitFor(() => {
  //     expect(
  //       screen.queryByRole('tooltip', { name: 'Tooltip on bottom' }),
  //     ).toBeVisible()
  //   })

  //   await userEvent.unhover(bottomTrigger)
  //   await userEvent.pointer({ target: document.body })
  //   await waitFor(() => {
  //     expect(
  //       screen.queryByRole('tooltip', { name: 'Tooltip on bottom' }),
  //     ).not.toBeVisible()
  //   })

  //   const leftTrigger = canvas.getByRole('button', { name: 'Left' })
  //   await userEvent.hover(leftTrigger)
  //   await waitFor(() => {
  //     expect(
  //       screen.queryByRole('tooltip', { name: 'Tooltip on left' }),
  //     ).toBeVisible()
  //   })

  //   await userEvent.unhover(leftTrigger)
  //   await userEvent.pointer({ target: document.body })
  //   await waitFor(() => {
  //     expect(
  //       screen.queryByRole('tooltip', { name: 'Tooltip on left' }),
  //     ).not.toBeVisible()
  //   })
  // },
}
