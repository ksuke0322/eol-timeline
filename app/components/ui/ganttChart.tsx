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
        const getDecade = (d: Date) => {
          const year = d.getFullYear()
          return year - (year % 10) + ''
        }
        // frappe/gantt の型定義が不十分で自前型定義を用意する必要がある、それをするくらいなら型の恩恵を無視して実装する
        // https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/types/frappe-gantt
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        ganttInstance.current = new Gantt(ganttRef.current, tasks, {
          upper_header_height: 50,
          bar_height: 20,
          bar_corner_radius: 3,
          arrow_curve: 5,
          padding: 18,
          lines: 'horizontal',
          // 休日のハイライトを無効化
          holidays: [],
          infinite_padding: false,
          view_mode: 'Year',
          view_mode_select: true,
          view_modes: [
            {
              name: 'Month',
              padding: '2m',
              step: '1m',
              column_width: 30,
              date_format: 'YYYY-MM',
              lower_text: (d) => d.getMonth() + 1,
              upper_text: (d, ld) =>
                !ld || d.getFullYear() !== ld.getFullYear()
                  ? d.getFullYear()
                  : '',
              thick_line: (d) => d.getMonth() % 3 === 0,
              snap_at: '7d',
            },
            {
              // 四半期表示
              name: 'Quarter',
              // 全体の余白は年単位で俯瞰しやすく
              padding: '1y',
              // 3か月単位で1列
              step: '3m',
              column_width: 40,
              date_format: 'YYYY-MM',
              lower_text: (d) => `Q${Math.floor(d.getMonth() / 3) + 1}`,
              upper_text: (d, ld) =>
                !ld || d.getFullYear() !== ld.getFullYear()
                  ? d.getFullYear()
                  : '',
              snap_at: '15d',
              thick_line: (d) => d.getMonth() % 12 === 0, // 年境界を太線にしたい場合
            },
            {
              name: 'Year',
              padding: '2y',
              step: '1y',
              column_width: 60,
              date_format: 'YYYY',
              upper_text: (d, ld) =>
                !ld || getDecade(d) !== getDecade(ld) ? getDecade(d) : '',
              lower_text: 'YYYY',
              snap_at: '30d',
            },
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
        })
      }

      /* FIXME: frapp/gantt から公式でスタイル上書き機能が提供されるまでの一時的な処理 */
      // アクセシビリティ対応のため aria-label を追加
      const viewModeSelect = document.getElementsByClassName('viewmode-select')
      if (ganttInstance.current && viewModeSelect.length > 0) {
        viewModeSelect[0].setAttribute('aria-label', 'View mode select')
        viewModeSelect[0].setAttribute('id', 'viewmode-select')
      }
    }
  }, [tasks])

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
