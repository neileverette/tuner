const FAVICON_HOSTS = [
  'google.com/s2/favicons',
  'icons.duckduckgo.com/ip3',
  'faviconkit.com',
  'favicon.io',
]

export function isSafeArtworkUrl(url: string | null | undefined): boolean {
  if (!url) return false
  const trimmed = url.trim()
  if (!trimmed) return false

  const lower = trimmed.toLowerCase()
  if (lower.includes('favicon')) return false
  if (/\.ico(?:$|[?#])/.test(lower)) return false
  return !FAVICON_HOSTS.some(host => lower.includes(host))
}
