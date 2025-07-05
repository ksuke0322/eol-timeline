import { useState, useEffect } from 'react'

import { SidebarInput } from '~/components/ui/sidebar'

interface SearchInputWithDebounceProps {
  onDebouncedChange: (value: string) => void
  initialValue?: string
  debounceTime?: number
}

export const SearchInputWithDebounce = ({
  onDebouncedChange,
  initialValue = '',
  debounceTime = 300,
}: SearchInputWithDebounceProps) => {
  const [searchTerm, setSearchTerm] = useState(initialValue)

  useEffect(() => {
    const timerId = setTimeout(() => {
      onDebouncedChange(searchTerm)
    }, debounceTime)

    return () => {
      clearTimeout(timerId)
    }
  }, [searchTerm, debounceTime, onDebouncedChange])

  return (
    <SidebarInput
      placeholder="Search products..."
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
    />
  )
}
