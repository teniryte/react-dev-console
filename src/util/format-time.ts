export function formatTime(ms: number): string {
  if (ms < 1000) {
    return `${ms} ms`;
  }

  const seconds = Math.floor(ms / 1000);
  const milliseconds = ms % 1000;

  return `${seconds}.${milliseconds} s`;
}
