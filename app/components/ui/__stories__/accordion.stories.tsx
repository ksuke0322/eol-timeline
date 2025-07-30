import { within, expect, userEvent } from '@storybook/test'

import type { Meta, StoryObj } from '@storybook/react'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '~/components/ui/accordion'

const meta = {
  title: 'UI/Accordion',
  component: Accordion,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Accordion>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    type: 'single',
    collapsible: true,
  },
  render: (args: Parameters<typeof Accordion>[0]) => (
    <Accordion className="w-[300px]" {...args}>
      <AccordionItem value="item-1">
        <AccordionTrigger>Is it accessible?</AccordionTrigger>
        <AccordionContent>
          Yes. It adheres to the WAI-ARIA design pattern.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>Is it styled?</AccordionTrigger>
        <AccordionContent>
          Yes. It comes with default styles that matches the other
          components&apos; aesthetic.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger>Is it animated?</AccordionTrigger>
        <AccordionContent>
          Yes. It&apos;s animated by default, but you can disable it if you
          prefer.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
}

export const MultipleOpen: Story = {
  args: {
    type: 'multiple',
  },
  render: (args: Parameters<typeof Accordion>[0]) => (
    <Accordion className="w-[300px]" {...args}>
      <AccordionItem value="item-1">
        <AccordionTrigger>Is it accessible?</AccordionTrigger>
        <AccordionContent>
          Yes. It adheres to the WAI-ARIA design pattern.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>Is it styled?</AccordionTrigger>
        <AccordionContent>
          Yes. It comes with default styles that matches the other
          components&apos; aesthetic.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger>Is it animated?</AccordionTrigger>
        <AccordionContent>
          Yes. It&apos;s animated by default, but you can disable it if you
          prefer.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement)
    const trigger1 = canvas.getByRole('button', { name: 'Is it accessible?' })
    const trigger2 = canvas.getByRole('button', { name: 'Is it styled?' })

    await userEvent.click(trigger1)
    await userEvent.click(trigger2)

    await expect(
      canvas.getByText('Yes. It adheres to the WAI-ARIA design pattern.'),
    ).toBeVisible()
    await expect(
      canvas.getByText(
        "Yes. It comes with default styles that matches the other components' aesthetic.",
      ),
    ).toBeVisible()
  },
}

export const WithLongContent: Story = {
  args: {
    type: 'single',
    collapsible: true,
  },
  render: (args: Parameters<typeof Accordion>[0]) => (
    <Accordion className="w-[300px]" {...args}>
      <AccordionItem value="item-1">
        <AccordionTrigger>
          This is a very long trigger text to see how the component handles
          overflow and wrapping.
        </AccordionTrigger>
        <AccordionContent>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
          culpa qui officia deserunt mollit anim id est laborum.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>Short Trigger</AccordionTrigger>
        <AccordionContent>Short content.</AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
}

export const WithManyItems: Story = {
  args: {
    type: 'multiple',
  },
  render: (args: Parameters<typeof Accordion>[0]) => (
    <Accordion className="w-[300px]" {...args}>
      {Array.from({ length: 20 }, (_, i) => (
        <AccordionItem key={i} value={`item-${i + 1}`}>
          <AccordionTrigger>{`Item ${i + 1}`}</AccordionTrigger>
          <AccordionContent>{`Content for item ${i + 1}`}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  ),
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement)
    const trigger1 = canvas.getByRole('button', { name: 'Item 1' })
    const trigger5 = canvas.getByRole('button', { name: 'Item 5' })

    await userEvent.click(trigger1)
    await userEvent.click(trigger5)

    await expect(canvas.getByText('Content for item 1')).toBeVisible()
    await expect(canvas.getByText('Content for item 5')).toBeVisible()
  },
}

export const WithNoContent: Story = {
  args: {
    type: 'single',
    collapsible: true,
  },
  render: (args: Parameters<typeof Accordion>[0]) => (
    <Accordion className="w-[300px]" {...args}>
      <AccordionItem value="item-1">
        <AccordionTrigger>Trigger with no content</AccordionTrigger>
        <AccordionContent />
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>Another item</AccordionTrigger>
        <AccordionContent>This one has content.</AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement)
    const trigger = canvas.getByRole('button', {
      name: 'Trigger with no content',
    })

    await userEvent.click(trigger)

    const content = canvas.getByRole('region', {
      name: 'Trigger with no content',
    })
    await expect(content).toBeVisible()
    await expect(content.innerHTML).toBe('<div class="pt-0 pb-4"></div>')
  },
}
