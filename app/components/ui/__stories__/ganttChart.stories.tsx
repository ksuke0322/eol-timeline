import { within, expect } from '@storybook/test'

import type { Meta, StoryObj } from '@storybook/react'
import type { GanttTask } from '~/lib/types'

import GanttChart from '~/components/ui/ganttChart'

const meta = {
  title: 'UI/GanttChart',
  component: GanttChart,
  parameters: {
    layout: 'fullscreen',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof GanttChart>

export default meta
type Story = StoryObj<typeof meta>

const tasks: GanttTask[] = [
  {
    id: 'react-18',
    name: 'v18',
    productName: 'React',
    start: '2022-03-29',
    end: '2025-03-29', // Fictional EOL
    progress: 100,
    custom_class: 'bar-react',
    color: '#61DAFB',
  },
  {
    id: 'react-17',
    name: 'v17',
    productName: 'React',
    start: '2020-10-20',
    end: '2023-10-20', // Fictional EOL
    progress: 100,
    dependencies: 'react-18',
    custom_class: 'bar-react',
    color: '#61DAFB',
  },
  {
    id: 'vue-3',
    name: 'v3',
    productName: 'Vue',
    start: '2020-09-18',
    end: '2024-03-18', // Fictional EOL
    progress: 100,
    custom_class: 'bar-vue',
    color: '#4FC08D',
  },
  {
    id: 'angular-17',
    name: 'v17',
    productName: 'Angular',
    start: '2023-11-08',
    end: '2025-05-08', // Fictional EOL
    progress: 50,
    custom_class: 'bar-angular',
    color: '#DD0031',
  },
]

export const Default: Story = {
  args: {
    tasks: tasks,
  },
  render: (args: Parameters<typeof GanttChart>[0]) => <GanttChart {...args} />,
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement)
    await expect(await canvas.findByRole('figure')).toBeInTheDocument()
  },
}

export const Empty: Story = {
  args: {
    tasks: [],
  },
  render: (args: Parameters<typeof GanttChart>[0]) => <GanttChart {...args} />,
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement)
    await expect(await canvas.findByRole('figure')).toBeInTheDocument()
  },
}

const manyTasks: GanttTask[] = Array.from({ length: 200 }, (_, i) => ({
  id: `task-${i}`,
  name: `Task ${i + 1}`,
  productName: `Product ${i % 10}`,
  start: `2024-${(i % 12) + 1}-01`,
  end: `2024-${(i % 12) + 1}-15`,
  progress: Math.floor(Math.random() * 100),
  color: `#${Math.floor(Math.random() * 16777215).toString(16)}`,
}))

export const WithManyTasks: Story = {
  args: {
    tasks: manyTasks,
  },
  render: (args: Parameters<typeof GanttChart>[0]) => <GanttChart {...args} />,
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement)
    await expect(await canvas.findByRole('figure')).toBeInTheDocument()
    await expect(canvas.getAllByText(/Task \d+/)).toHaveLength(200)
  },
}

const longNameTasks: GanttTask[] = [
  {
    id: 'long-name-1',
    name: 'This is a very very very long version name to test how the gantt chart handles text overflow and wrapping',
    productName:
      'Super Long Product Name That Might Break The UI Layout And Cause Problems',
    start: '2024-01-01',
    end: '2024-03-01',
    progress: 50,
    color: '#FF5733',
  },
  ...tasks.slice(0, 2),
]

export const WithLongTaskNames: Story = {
  args: {
    tasks: longNameTasks,
  },
  render: (args: Parameters<typeof GanttChart>[0]) => <GanttChart {...args} />,
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement)
    await expect(await canvas.findByRole('figure')).toBeInTheDocument()
    await expect(
      await canvas.findByText(
        'This is a very very very long version name to test how the gantt chart handles text overflow and wrapping',
      ),
    ).toBeInTheDocument()
  },
}

const overlappingTasks: GanttTask[] = [
  {
    id: 'task-a',
    name: 'Task A',
    productName: 'Project 1',
    start: '2024-01-01',
    end: '2024-03-01',
    progress: 100,
    color: '#3498DB',
  },
  {
    id: 'task-b',
    name: 'Task B',
    productName: 'Project 1',
    start: '2024-02-01',
    end: '2024-04-01',
    dependencies: 'task-a',
    progress: 50,
    color: '#3498DB',
  },
  {
    id: 'task-c',
    name: 'Task C',
    productName: 'Project 2',
    start: '2024-01-15',
    end: '2024-03-15',
    progress: 75,
    color: '#F1C40F',
  },
]

export const WithOverlappingDates: Story = {
  args: {
    tasks: overlappingTasks,
  },
  render: (args: Parameters<typeof GanttChart>[0]) => <GanttChart {...args} />,
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement)
    await expect(await canvas.findByRole('figure')).toBeInTheDocument()
    await expect(await canvas.findByText('Task A')).toBeInTheDocument()
    await expect(await canvas.findByText('Task B')).toBeInTheDocument()
    await expect(await canvas.findByText('Task C')).toBeInTheDocument()
  },
}
