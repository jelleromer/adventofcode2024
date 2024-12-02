import { countBy, identity, range } from '@es-toolkit/es-toolkit'
import { findAll, print } from './utils.ts'

function windows<T>(arr: T[], size: number = 2): T[][] {
  if (size <= 0) {
    throw new Error('Window size must be positive')
  }
  if (size > arr.length) {
    return []
  }
  const result: T[][] = []
  for (let i = 0; i <= arr.length - size; i++) {
    result.push(arr.slice(i, i + size))
  }
  return result
}

function isSafe(xs: number[]): boolean {
  const diffs = windows(xs, 2).map(([x, y]) => y - x)
  if (diffs.some((x) => x === 0)) return false
  return (diffs.every((x) => x > 0 && x <= 3) || diffs.every((x) => x < 0 && x >= -3))
}

function part1(reports: number[][]): number {
  const ys = reports.map(isSafe)
  return countBy(ys, identity)[true]
}

function removeAtIndex<T>(arr: T[], index: number): T[] {
  return arr.filter((_, i) => i !== index)
}

function part2(reports: number[][]) {
  const unsafeReports = reports
    .filter((x) => !isSafe(x))
    .map((x) => {
      return range(x.length)
        .map((i) => removeAtIndex(x, i))
        .some(isSafe)
    })
  const additional = countBy(unsafeReports, identity)[true]
  return additional + part1(reports)
}

export function runDay() {
  const parsed = Deno.readTextFileSync('./txt/day2')
    .split('\n')
    .filter((x) => x !== '')
    .map(findAll(/\d+/g))
    .map((x) => x.map(Number) as number[])
  const one = part1(parsed)
  const two = part2(parsed)
  print(one, two)
}
