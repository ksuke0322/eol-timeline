declare module 'frappe-gantt' {
  interface Options {
    upper_header_height?: number
    column_width?: number
    bar_height?: number
    bar_corner_radius?: number
    arrow_curve?: number
    padding?: number
    language?: string
    infinite_padding?: boolean
    view_mode?: 'Quarter Day' | 'Half Day' | 'Day' | 'Week' | 'Month' | 'Year'
    view_mode_select?: boolean
    scroll_to?: 'today' | 'start' | 'end'
    on_click?: (task: import('../../app/lib/types').GanttTask) => void
    popup?: (options: {
      task: import('../../app/lib/types').GanttTask
      chart: Gantt // Changed from any to Gantt
      get_title: () => HTMLElement
      set_title: (title: string) => void
      get_subtitle: () => HTMLElement
      set_subtitle: (subtitle: string) => void
      get_details: () => HTMLElement
      set_details: (details: string) => void
      add_action: (
        html:
          | string
          | ((task: import('../../app/lib/types').GanttTask) => string),
        func: (
          task: import('../../app/lib/types').GanttTask,
          chart: Gantt,
          event: MouseEvent,
        ) => void,
      ) => void // Changed from any to Gantt
    }) => string | false | void
  }

  class Gantt {
    constructor(
      wrapper: HTMLElement | string,
      tasks: import('../../app/lib/types').GanttTask[],
      options?: Options,
    )
    refresh(tasks: import('../../app/lib/types').GanttTask[]): void
    change_view_mode(
      mode: 'Quarter Day' | 'Half Day' | 'Day' | 'Week' | 'Month' | 'Year',
    ): void
  }

  export default Gantt
}
