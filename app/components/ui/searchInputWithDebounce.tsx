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

  const handleClear = () => {
    setSearchTerm('')
    onDebouncedChange('')
  }

  return (
    <div className="relative">
      <SidebarInput
        placeholder="Search products..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="pr-8" // クリアボタンのスペースを確保
        aria-label="Search products"
      />
      {searchTerm && (
        <button
          type="button"
          onClick={handleClear}
          className={`
            absolute top-1/2 right-2 -translate-y-1/2 rounded-sm
            text-muted-foreground transition-colors
            hover:text-foreground
            focus-visible:ring-2 focus-visible:ring-ring
            focus-visible:outline-none
          `}
          aria-label="Clear search"
        >
          &times;
        </button>
      )}
    </div>
  )
}
