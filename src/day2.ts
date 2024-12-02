import { curry, identity, range } from '@es-toolkit/es-toolkit'
import { findAll, print } from './utils.ts'

function windows<T>(xs: T[], size: number = 2): T[][] {
  if (size <= 0) {
    throw new Error('Window size must be positive')
  }
  if (size > xs.length) {
    return []
  }
  const result: T[][] = []
  for (let i = 0; i <= xs.length - size; i++) {
    result.push(xs.slice(i, i + size))
  }
  return result
}

function isSafe(xs: number[]): boolean {
  const diffs = windows(xs, 2).map(([x, y]) => y - x)
  return diffs.every((x) => x > 0 && x <= 3) ||
    diffs.every((x) => x < 0 && x >= -3)
}

function part1(reports: number[][]): number {
  return reports
    .map(isSafe)
    .filter(identity)
    .length
}

function removeAtIndex<T>(xs: T[], index: number): T[] {
  return xs.filter((_, i) => i !== index)
}

function part2(reports: number[][]): number {
  return part1(reports) + reports
    .filter((xs) => !isSafe(xs))
    .map((xs) =>
      range(xs.length)
        .map(curry(removeAtIndex)(xs))
        .some(isSafe)
    )
    .filter(identity)
    .length
}

export function runDay() {
  const parsed = Deno.readTextFileSync('./txt/day2')
    .split('\n')
    .filter((x) => x !== '')
    .map(findAll(/\d+/g))
    .map((xs) => xs.map(Number))
  const one = part1(parsed)
  const two = part2(parsed)
  print(one, two)
}
