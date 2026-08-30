import { render, within } from '@testing-library/react'
import { axe } from 'vitest-axe'

import GanttChart from '../ganttChart'

Object.defineProperty(SVGElement.prototype, 'getBBox', {
  configurable: true,
  value: () => ({ height: 0, width: 0, x: 0, y: 0 }),
})

Object.defineProperty(HTMLElement.prototype, 'scrollTo', {
  configurable: true,
  value: () => undefined,
})

test('空のタスクリストのa11yチェック', async () => {
  const { container } = render(<GanttChart tasks={[]} />)
  expect(
    container.querySelector('[data-testid="gantt-chart"]'),
  ).toHaveAttribute('role', 'figure')
  expect(await axe(container)).toHaveNoViolations()
})

test('タスクを持つガントチャートのa11yチェック', async () => {
  const tasks = [
    {
      id: 'Task 1',
      name: 'Task 1',
      start: '2023-01-01',
      end: '2023-01-10',
      progress: 50,
      productName: 'Product 1',
      eol_status: 0 as const,
    },
    {
      id: 'Task 2',
      name: 'Task 2',
      start: '2023-01-05',
      end: '2023-01-15',
      progress: 20,
      productName: 'Product 1',
      eol_status: 0 as const,
    },
  ]
  const { container } = render(<GanttChart tasks={tasks} />)
  expect(container.querySelectorAll('.bar-wrapper')).toHaveLength(2)
  expect(await axe(container)).toHaveNoViolations()
})

test('ホバーなしで各タスクの製品、version、日付、状態を取得できる', async () => {
  const tasks = [
    {
      id: 'React_18',
      name: 'React 18',
      start: '2023-01-01',
      end: '2023-01-10',
      productName: 'React',
      eol_status: 0 as const,
    },
    {
      id: 'Vue_3',
      name: 'Vue 3',
      start: '2023-02-01',
      end: '2023-02-10',
      productName: 'Vue',
      eol_status: 1 as const,
    },
    {
      id: 'Angular_16',
      name: 'Angular 16',
      start: '2023-03-01',
      end: '2023-03-10',
      productName: 'Angular',
      eol_status: 2 as const,
    },
  ]

  const { container } = render(<GanttChart tasks={tasks} />)
  const details = container.querySelector('[data-testid="gantt-task-details"]')

  expect(details).toBeInTheDocument()
  const table = within(details as HTMLElement).getByRole('table', {
    name: 'Gantt task details',
  })
  expect(table).toHaveTextContent('Product')
  expect(table).toHaveTextContent('Version')
  expect(table).toHaveTextContent('Start date')
  expect(table).toHaveTextContent('EOL date')
  expect(table).toHaveTextContent('Status')
  const rows = within(table).getAllByRole('row')
  expect(rows[1]).toHaveTextContent('React')
  expect(rows[1]).toHaveTextContent('18')
  expect(rows[1]).toHaveTextContent('2023-01-01')
  expect(rows[1]).toHaveTextContent('2023-01-10')
  expect(rows[1]).toHaveTextContent('EOL date available')
  expect(rows[2]).toHaveTextContent('Vue')
  expect(rows[2]).toHaveTextContent('3')
  expect(rows[2]).toHaveTextContent('2023-02-01')
  expect(rows[2]).toHaveTextContent('Not available')
  expect(rows[2]).toHaveTextContent('Supported (no EOL date)')
  expect(rows[3]).toHaveTextContent('Angular')
  expect(rows[3]).toHaveTextContent('16')
  expect(rows[3]).toHaveTextContent('2023-03-01')
  expect(rows[3]).toHaveTextContent('Not available')
  expect(rows[3]).toHaveTextContent('EOL (date unknown)')
  expect(await axe(container)).toHaveNoViolations()
})
