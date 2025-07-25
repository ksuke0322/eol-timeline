import type { Meta, StoryObj } from '@storybook/react-vite'
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
  render: (args) => <GanttChart {...args} />,
}

export const Empty: Story = {
  args: {
    tasks: [],
  },
  render: (args) => <GanttChart {...args} />,
}
