import Gantt from 'frappe-gantt'
import 'frappe-gantt/dist/frappe-gantt.css'
import React, { useEffect, useId, useRef } from 'react'

import { type GanttTask } from '../../lib/types'

interface GanttChartProps {
  tasks: GanttTask[]
  'aria-label'?: string
}

const getTaskVersion = (task: GanttTask): string => {
  const idPrefix = `${task.productName}_`
  if (task.id.startsWith(idPrefix)) {
    return task.id.slice(idPrefix.length)
  }

  const namePrefix = `${task.productName} `
  if (task.name.startsWith(namePrefix)) {
    return task.name.slice(namePrefix.length).split(' | ')[0]
  }

  return task.id
}

const getTaskStatus = (task: GanttTask): string => {
  if (task.eol_status === 0) return 'EOL date available'
  if (task.eol_status === 1) return 'Supported (no EOL date)'
  return 'EOL (date unknown)'
}

const GanttChart: React.FC<GanttChartProps> = ({
  tasks,
  'aria-label': ariaLabel = '',
}) => {
  const ganttRef = useRef<HTMLDivElement>(null)
  const detailsHeadingId = useId()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ganttInstance = useRef<any>(null)

  useEffect(() => {
    if (!ganttRef.current) return

    // frappe-ganttは空のtask配列で「today」へのスクロール時に内部要素を
    // 参照できず例外になるため、空のチャートではインスタンスを作らない。
    if (tasks.length === 0) {
      if (ganttInstance.current) {
        ganttRef.current.replaceChildren()
        ganttInstance.current = null
      }
      return
    }

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
          const details =
            task.eol_status === 0
              ? `EOL date: ${task.end}`
              : task.eol_status === 1
                ? 'Supported (no EOL date)'
                : 'EOL (date unknown)'
          set_title(`${task.productName} ${task.id}`)
          set_details(details)
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
  }, [tasks])

  return (
    <div>
      <div
        ref={ganttRef}
        data-testid="gantt-chart"
        role="figure"
        aria-label={ariaLabel}
        aria-describedby={detailsHeadingId}
        className="min-h-20"
      />
      <section
        data-testid="gantt-task-details"
        aria-labelledby={detailsHeadingId}
        className="mt-4 overflow-x-auto"
      >
        <h2 id={detailsHeadingId} className="mb-2 text-lg font-semibold">
          Gantt task details
        </h2>
        {tasks.length === 0 ? (
          <p>No tasks available.</p>
        ) : (
          <table
            aria-label="Gantt task details"
            className="
              min-w-full border-collapse text-left text-sm
              [&_th]:text-left
            "
          >
            <thead>
              <tr>
                <th scope="col">Product</th>
                <th scope="col">Version</th>
                <th scope="col">Start date</th>
                <th scope="col">EOL date</th>
                <th scope="col">Status</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task) => (
                <tr key={task.id}>
                  <th scope="row">{task.productName}</th>
                  <td>{getTaskVersion(task)}</td>
                  <td>{task.start}</td>
                  <td>{task.eol_status === 0 ? task.end : 'Not available'}</td>
                  <td>{getTaskStatus(task)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  )
}

export default GanttChart
