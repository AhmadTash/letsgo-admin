/**
 * Formats a dispatching algorithm string from SCREAMING_SNAKE_CASE to Title Case
 * Example: "SAME_SCHOOL" -> "Same School"
 */
export function formatDispatchingAlgo(algo: string | null | undefined): string {
  if (!algo) return 'N/A';
  // Convert SCREAMING_SNAKE_CASE to Title Case
  return algo
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(' ');
}

