import Gantt from 'frappe-gantt'
import 'frappe-gantt/dist/frappe-gantt.css'
import React, { useEffect, useRef } from 'react'

import { type GanttTask } from '../../lib/types'

interface GanttChartProps {
  tasks: GanttTask[]
  'aria-label'?: string
}

const GanttChart: React.FC<GanttChartProps> = ({
  tasks,
  'aria-label': ariaLabel = '',
}) => {
  const ganttRef = useRef<HTMLDivElement>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ganttInstance = useRef<any>(null)
  const [viewMode, setViewMode] = React.useState<string>('Year')

  useEffect(() => {
    if (ganttRef.current) {
      const ganttOptions = {
        upper_header_height: 50,
        column_width: 60,
        bar_height: 20,
        bar_corner_radius: 3,
        arrow_curve: 5,
        padding: 18,
        language: 'ja',
        infinite_padding: false,
        view_mode: 'Year',
        view_mode_select: true,
        view_modes: [
          Gantt.VIEW_MODE.WEEK,
          Gantt.VIEW_MODE.MONTH,
          Gantt.VIEW_MODE.YEAR,
        ],
        scroll_to: 'today',
        auto_move_label: true,
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        popup: ({ task, set_title, set_details }) => {
          const eolDate = typeof task.end === 'string' ? task.end : 'N/A'
          set_title(`${task.productName} ${task.id}`)
          set_details(`EOL date: ${eolDate}`)
        },
        popup_on: 'hover',
        readonly: true,
        on_view_change: (viewMode: Gantt.ViewModeObject) => {
          setViewMode(viewMode.name)
        },
      }
      if (ganttInstance.current) {
        ganttInstance.current.setup_tasks(tasks)
        ganttInstance.current.setup_options({
          ...ganttOptions,
          column_width: viewMode === 'Month' ? 35 : 60,
          view_mode: viewMode,
        })
        ganttInstance.current.change_view_mode()
      } else {
        // frappe/gantt の型定義が不十分で自前型定義を用意する必要がある、それをするくらいなら型の恩恵を無視して実装する
        // https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/types/frappe-gantt
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        ganttInstance.current = new Gantt(ganttRef.current, tasks, ganttOptions)
      }

      /* FIXME: frapp/gantt から公式でスタイル上書き機能が提供されるまでの一時的な処理 */
      // アクセシビリティ対応のため aria-label を追加
      const viewModeSelect = document.getElementsByClassName('viewmode-select')
      if (ganttInstance.current && viewModeSelect.length > 0) {
        viewModeSelect[0].setAttribute('aria-label', 'View mode select')
        viewModeSelect[0].setAttribute('id', 'viewmode-select')
      }
    }
  }, [tasks, viewMode])

  return (
    <div
      ref={ganttRef}
      data-testid="gantt-chart"
      role="figure"
      aria-label={ariaLabel}
    />
  )
}

export default GanttChart
