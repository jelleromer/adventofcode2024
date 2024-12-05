import { curry, drop, negate, sum } from '@es-toolkit/es-toolkit'
import { findAll, print } from './utils.ts'

function verifySequence(rules: Map<number, number[]>, xs: number[]): boolean {
  return bothSequenceFuncs(rules, xs)[0]
}

function getWrongNumber(rules: Map<number, number[]>, xs: number[]): [number, number[]] {
  return bothSequenceFuncs(rules, xs)[1]
}

function bothSequenceFuncs(
  rules: Map<number, number[]>,
  xs: number[],
): [boolean, [number, number[]]] {
  const len = xs.length
  for (let i = 0; i < len; i++) {
    const rule = rules.get(xs[i]) ?? []
    const remainingSequence = drop(xs, i + 1)
    const badLetters = remainingSequence
      .filter((x) => rule.includes(x))
    if (badLetters.length > 0) {
      return [false, [xs[i], badLetters]]
    }
  }
  return [true, [-1, []]]
}

function sortSequenceThatDoesntFuckingWork(rules: Map<number, number[]>, xs: number[]): number[] {
  xs.sort((x, y) => {
    const notAfterX = rules.get(x) ?? []
    const notAfterY = rules.get(y) ?? []
    if (notAfterX.includes[y]) {
      // x should be after y
      return -1
    }
    if (notAfterY.includes[x]) {
      // y should be before x
      return 1
    }
    return 0
  })
  if (!verifySequence(rules, xs)) print('kut')
  return xs
}

function sortSequence(rules: Map<number, number[]>, xs: number[]): number[] {
  const [num, wrongNums] = getWrongNumber(rules, xs)
  const wrong = wrongNums[0]
  const numI = xs.indexOf(num)
  const wrongI = xs.lastIndexOf(wrong)
  xs.splice(wrongI, 1)
  const newOrder = xs.slice(0, numI)
    .concat([wrong])
    .concat(xs.slice(numI))
  if (verifySequence(rules, newOrder)) {
    return newOrder
  } else {
    return sortSequence(rules, newOrder)
  }
}

function part1(rules: Map<number, number[]>, xss: number[][]): number {
  return sum(
    xss
      .filter(curry(verifySequence)(rules))
      .map((xs) => xs[Math.floor(xs.length / 2)]),
  )
}

function part2(rules: Map<number, number[]>, xss: number[][]): number {
  return sum(
    xss
      .filter(negate(curry(verifySequence)(rules)))
      .map(curry(sortSequence)(rules))
      .map((xs) => xs[Math.floor(xs.length / 2)]),
  )
}

export function runDay() {
  const [rawRules, rawPagesToProduce] = Deno.readTextFileSync('./txt/day5')
    .split('\n\n')

  // each key contains a list of values that can't be _after_ the key
  const rules = new Map()
  rawRules
    .split('\n')
    .map(findAll(/\d+/g))
    .map((xs) => xs.map(Number))
    .forEach(([value, key]) => {
      if (!rules.has(key)) {
        rules.set(key, [value])
      } else {
        rules.get(key).push(value)
      }
    })

  const pagesToProduce = rawPagesToProduce
    .split('\n')
    .filter((x) => x !== '')
    .map(findAll(/\d+/g))
    .map((xs) => xs.map(Number))

  const one = part1(rules, pagesToProduce)
  const two = part2(rules, pagesToProduce)
  print(one, two)
}
