import { useState, type ReactNode } from 'react'
import type { Channel } from '../types/channel'

interface StationPickerProps {
  channels: Channel[]
  selectedIndex: number
  onSelectChannel: (index: number) => void
  onClose: () => void
}

// Highlight search matches
function highlightMatch(text: string, search: string): ReactNode {
  if (!search.trim()) return text
  const regex = new RegExp(`(${search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi')
  const parts = text.split(regex)
  return parts.map((part, i) =>
    regex.test(part) ? <mark key={i} className="search-highlight">{part}</mark> : part
  )
}

// Get source label from channel ID
function getSourceLabel(id: string): string | null {
  if (id.startsWith('somafm:')) return 'SomaFM'
  if (id.startsWith('rp:')) return 'Radio Paradise'
  return null
}

function StationPicker({
  channels,
  selectedIndex,
  onSelectChannel,
  onClose
}: StationPickerProps) {
  const [search, setSearch] = useState('')
  const [sourceFilter, setSourceFilter] = useState<'all' | 'somafm' | 'radioparadise'>('all')

  const filteredChannels = channels
    .map((channel, index) => ({ channel, index }))
    .filter(({ channel }) => {
      // Source filter
      if (sourceFilter === 'somafm' && !channel.id.startsWith('somafm:')) return false
      if (sourceFilter === 'radioparadise' && !channel.id.startsWith('rp:')) return false
      // Text search filter
      if (search === '') return true
      return (
        channel.title.toLowerCase().includes(search.toLowerCase()) ||
        channel.description.toLowerCase().includes(search.toLowerCase()) ||
        channel.genre.toLowerCase().includes(search.toLowerCase())
      )
    })

  return (
    <div className="station-picker-overlay" onClick={onClose}>
      <div className="station-picker" onClick={(e) => e.stopPropagation()}>
        <div className="station-picker-header">
          <div className="station-picker-search">
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
            </svg>
            <input
              type="text"
              placeholder="Search stations..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              autoFocus
            />
          </div>
          <button className="station-picker-close" onClick={onClose}>
            <svg viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" />
            </svg>
          </button>
        </div>
        <div className="station-picker-filters">
          <button
            className={`filter-chip ${sourceFilter === 'all' ? 'active' : ''}`}
            onClick={() => setSourceFilter('all')}
          >
            All
          </button>
          <button
            className={`filter-chip filter-somafm ${sourceFilter === 'somafm' ? 'active' : ''}`}
            onClick={() => setSourceFilter('somafm')}
          >
            SomaFM
          </button>
          <button
            className={`filter-chip filter-rp ${sourceFilter === 'radioparadise' ? 'active' : ''}`}
            onClick={() => setSourceFilter('radioparadise')}
          >
            Radio Paradise
          </button>
        </div>
        <div className="station-picker-list">
          {filteredChannels.length === 0 ? (
            <div className="station-picker-empty">
              No matching stations
            </div>
          ) : (
            filteredChannels.map(({ channel, index }) => (
              <div
                key={channel.id}
                className={`station-item ${index === selectedIndex ? 'selected' : ''}`}
                onClick={() => onSelectChannel(index)}
              >
                <div className="station-item-left">
                  <div className="station-item-header">
                    <span className="station-item-name">{highlightMatch(channel.title, search)}</span>
                    {getSourceLabel(channel.id) && (
                      <span className={`station-item-source ${channel.id.startsWith('rp:') ? 'source-rp' : 'source-somafm'}`}>
                        {getSourceLabel(channel.id)}
                      </span>
                    )}
                  </div>
                  <span className="station-item-meta">{highlightMatch(channel.description, search)}</span>
                  {channel.genre && <span className="station-item-genre">{highlightMatch(channel.genre, search)}</span>}
                </div>
                {channel.listeners != null && channel.listeners > 0 && (
                  <div className="station-item-right">
                    <span className="station-item-listeners-label">Listeners</span>
                    <span className="station-item-listeners">{channel.listeners.toLocaleString()}</span>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default StationPicker
