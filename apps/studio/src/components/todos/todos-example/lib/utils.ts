export function formatSubscriptionUpdate(type: string, timestamp: number) {
  return `${type} at ${new Date(timestamp).toLocaleTimeString()}`
}
