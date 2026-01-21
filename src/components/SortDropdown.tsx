import type { SortOption } from '../types'
import { SORT_OPTIONS } from '../types'

interface SortDropdownProps {
  value: SortOption
  onChange: (value: SortOption) => void
}

function SortDropdown({ value, onChange }: SortDropdownProps) {
  return (
    <div className="sort-dropdown">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as SortOption)}
        aria-label="Sort stations by"
      >
        {SORT_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <span className="material-symbols-outlined sort-icon">unfold_more</span>
    </div>
  )
}

export default SortDropdown
