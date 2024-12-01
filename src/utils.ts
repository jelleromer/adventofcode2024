export function print(...args: unknown[]) {
  console.log(...args)
}

export const findAll = (regex: RegExp) => (s: string): string[] => {
  return [...s.matchAll(regex)].map((m) => m[0])
}
