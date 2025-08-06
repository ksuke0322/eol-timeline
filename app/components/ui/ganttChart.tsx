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

  useEffect(() => {
    if (ganttRef.current) {
      if (ganttInstance.current) {
        ganttInstance.current.refresh(tasks)
      } else {
        // frappe/gantt の型定義が不十分で自前型定義を用意する必要がある、それをするくらいなら型の恩恵を無視して実装する
        // https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/types/frappe-gantt
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        ganttInstance.current = new Gantt(ganttRef.current, tasks, {
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
            set_details(`EOL日: ${eolDate}`)
          },
          popup_on: 'hover',
        })
      }
    }
  }, [tasks])

  useEffect(() => {
    /* FIXME: frapp/gantt から公式でスタイル上書き機能が提供されるまでの一時的な処理 */
    const viewModeSelect = document.getElementsByClassName('viewmode-select')
    if (ganttInstance.current && viewModeSelect.length > 0) {
      viewModeSelect[0].setAttribute('aria-label', 'View mode select')
      viewModeSelect[0].setAttribute('id', 'viewmode-select')
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ganttInstance.current])

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
