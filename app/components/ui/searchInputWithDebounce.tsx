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
      />
      {searchTerm && (
        <button
          type="button"
          onClick={handleClear}
          className={`
            absolute top-1/2 right-2 -translate-y-1/2 text-gray-500
            hover:text-gray-700
            focus:outline-none
          `}
          aria-label="Clear search"
        >
          &times;
        </button>
      )}
    </div>
  )
}
