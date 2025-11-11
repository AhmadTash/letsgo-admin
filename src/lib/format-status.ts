/**
 * Formats a status string from SCREAMING_SNAKE_CASE to Title Case
 * Example: "CUSTOMER_REJECTED_TO_PAY" -> "Customer Rejected To Pay"
 */
export function formatStatus(status: string | null | undefined): string {
  if (!status) return 'N/A';
  // Convert SCREAMING_SNAKE_CASE to Title Case
  return status
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

/**
 * Gets the Material-UI Chip color based on status
 */
export function getStatusColor(status: string | null | undefined): 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning' {
  if (!status) return 'default';
  const statusLower = status.toLowerCase();
  if (statusLower.includes('cancelled') || statusLower.includes('failed') || statusLower.includes('rejected')) return 'error';
  if (statusLower.includes('completed') || statusLower.includes('paid') || statusLower.includes('succeeded')) return 'success';
  if (statusLower.includes('pending') || statusLower.includes('offered')) return 'warning';
  if (statusLower.includes('accepted')) return 'info';
  return 'default';
}

/**
 * Gets the hex color for status dots in timeline
 */
export function getStatusDotColor(status: string | null | undefined): string {
  if (!status) return '#9e9e9e';
  const statusLower = status.toLowerCase();
  if (statusLower.includes('cancelled') || statusLower.includes('failed') || statusLower.includes('rejected')) return '#f44336';
  if (statusLower.includes('completed') || statusLower.includes('paid') || statusLower.includes('succeeded')) return '#4caf50';
  if (statusLower.includes('pending') || statusLower.includes('offered')) return '#ff9800';
  if (statusLower.includes('accepted')) return '#2196f3';
  return '#2196f3';
}

