export function formatMessageTime(date: Date | string) {
  const value = typeof date === 'string' ? new Date(date) : date
  return value.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

export function formatDateTime(date: Date | string) {
  const value = typeof date === 'string' ? new Date(date) : date
  return value.toLocaleString()
}
