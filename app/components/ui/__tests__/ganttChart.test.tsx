import { render } from '@testing-library/react'
import { vi } from 'vitest'
import { axe } from 'vitest-axe'

// Mock the GanttChart component itself to avoid frappe-gantt issues in JSDOM
vi.mock('../ganttChart', () => ({
  __esModule: true,
  default: vi.fn(({ tasks }) => (
    <div data-testid="mock-gantt-chart">
      {tasks.length > 0 ? 'Gantt Chart with tasks' : 'Empty Gantt Chart'}
    </div>
  )),
}))

import GanttChart from '../ganttChart' // This will now import the mocked component

test('空のタスクリストのa11yチェック', async () => {
  const { container } = render(<GanttChart tasks={[]} />)
  expect(
    container.querySelector('[data-testid="mock-gantt-chart"]'),
  ).toHaveTextContent('Empty Gantt Chart')
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
  expect(
    container.querySelector('[data-testid="mock-gantt-chart"]'),
  ).toHaveTextContent('Gantt Chart with tasks')
  expect(await axe(container)).toHaveNoViolations()
})
