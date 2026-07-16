export function getRequiredEnv(
  name: string
): string {
  const value = process.env[name];

  if (!value) {
    throw new Error(`${name} est absent`);
  }

  return value;
}