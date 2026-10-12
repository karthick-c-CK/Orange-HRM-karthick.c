/** Lightweight logger used to annotate test execution in console output. */
export const logger = {
  info(message: string): void {
    console.log(`[${new Date().toISOString()}] INFO  ${message}`);
  },
  warn(message: string): void {
    console.warn(`[${new Date().toISOString()}] WARN  ${message}`);
  },
};