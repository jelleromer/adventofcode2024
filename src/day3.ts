import { sum, zipWith } from '@es-toolkit/es-toolkit'
import { findAll, print } from './utils.ts'

function part1(xs: [number, number][]): number {
  return sum(zipWith(xs, ([x, y]) => x * y))
}

function part2(xs: ([number, number] | boolean)[]): number {
  let active = true
  let res = 0
  for (const x of xs) {
    if (typeof x == 'boolean') {
      active = x
    } else if (active) {
      res += x[0] * x[1]
    }
  }
  return res
}

export function runDay() {
  const inFile = Deno.readTextFileSync('./txt/day3')
  const parsed1 = inFile
    .split('\n')
    .filter((x) => x !== '')
    .map(findAll(/mul\(\d+\,\d+\)/g))
    .flatMap((xs) =>
      xs.map(findAll(/\d+/g))
        .map((x) => x.map(Number) as [number, number])
    )
  const parsed2 = inFile
    .split('\n')
    .filter((x) => x !== '')
    .map(findAll(/mul\(\d+\,\d+\)|don't\(\)|do\(\)/g))
    .flatMap((ss) =>
      ss.map((s) => {
        if (s.startsWith('don')) {
          return false
        } else if (s.startsWith('do')) {
          return true
        } else {
          return findAll(/\d+/g)(s).map(Number) as [number, number]
        }
      })
    )
  const one = part1(parsed1)
  const two = part2(parsed2)
  print(one, two)
}
