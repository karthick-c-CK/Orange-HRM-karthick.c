import { randomInt } from 'crypto';

const PREFIX_PATTERN = /^[A-Za-z0-9]{1,5}$/;

/**
 * Generates a unique-per-run Employee ID, e.g. "QA48213".
 * The shared demo site persists data, so each run needs a fresh identifier.
 */
export function generateEmployeeId(prefix: string): string {
  if (!PREFIX_PATTERN.test(prefix)) {
    throw new Error(
      `Invalid employee ID prefix "${prefix}". Use 1 to 5 alphanumeric characters.`,
    );
  }

  const suffix = randomInt(10_000, 100_000).toString();
  return `${prefix}${suffix}`;
}