import { countBy, identity, sum, unzip, zipWith } from '@es-toolkit/es-toolkit'
import { findAll, print } from './utils.ts'

function part1(pairs: [number, number][]): number {
  const [xs, ys] = unzip(pairs)
    .map((x) => x.toSorted())
  return sum(zipWith(xs, ys, (a, b) => Math.abs(b - a)))
}

function part2(pairs: [number, number][]) {
  const [xs, ys] = unzip(pairs)
  const counts = countBy(ys, identity)
  return sum(xs.map((x) => x * (counts[x] ?? 0)))
}

export function runDay() {
  const parsed = Deno.readTextFileSync('./txt/day1')
    .split('\n')
    .filter((x) => x !== '')
    .map(findAll(/\d+/g))
    .map((x) => x.map(Number) as [number, number])
  const one = part1(parsed)
  const two = part2(parsed)
  print(one, two)
}
