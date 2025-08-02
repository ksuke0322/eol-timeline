import { render } from '@testing-library/react'
import { axe } from 'vitest-axe'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../accordion'

test('単一のアコーディオンアイテムのa11yチェック', async () => {
  const { container } = render(
    <Accordion type="single" collapsible>
      <AccordionItem value="item-1">
        <AccordionTrigger>Is it accessible?</AccordionTrigger>
        <AccordionContent>
          Yes. It adheres to the WAI-ARIA design pattern.
        </AccordionContent>
      </AccordionItem>
    </Accordion>,
  )
  expect(await axe(container)).toHaveNoViolations()
})

test('複数のアコーディオンアイテムのa11yチェック', async () => {
  const { container } = render(
    <Accordion type="multiple">
      <AccordionItem value="item-1">
        <AccordionTrigger>Item 1</AccordionTrigger>
        <AccordionContent>Content 1</AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>Item 2</AccordionTrigger>
        <AccordionContent>Content 2</AccordionContent>
      </AccordionItem>
    </Accordion>,
  )
  expect(await axe(container)).toHaveNoViolations()
})
