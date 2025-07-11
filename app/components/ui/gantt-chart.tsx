import Gantt from 'frappe-gantt'
import 'frappe-gantt/dist/frappe-gantt.css'
import React, { useEffect, useRef } from 'react'

import { type GanttTask } from '../../lib/types'

interface GanttChartProps {
  tasks: GanttTask[]
}

const GanttChart: React.FC<GanttChartProps> = ({ tasks }) => {
  const ganttRef = useRef<HTMLDivElement>(null)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const ganttInstance = useRef<any>(null)

  useEffect(() => {
    if (ganttRef.current) {
      if (ganttInstance.current) {
        ganttInstance.current.refresh(tasks)
      } else {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ganttInstance.current = new Gantt(ganttRef.current, tasks as any, {
          upper_header_height: 50,
          column_width: 60,
          bar_height: 20,
          bar_corner_radius: 3,
          arrow_curve: 5,
          padding: 18,
          language: 'ja',
          infinite_padding: false,
          view_mode: 'Month',
          view_mode_select: true,
          scroll_to: 'today',
          popup: function ({ task, set_title, set_subtitle, set_details }) {
            const eolDate = typeof task.end === 'string' ? task.end : 'N/A'
            set_title(`${task.productName} ${task.id}`)
            set_subtitle(`Release Date: ${task.start}`)
            set_details(`EOL Date: ${eolDate}`)
          },
        })
      }
    }
  }, [tasks])

  return <div ref={ganttRef} />
}

export default GanttChart
