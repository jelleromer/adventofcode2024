import { curry, sum, zip } from '@es-toolkit/es-toolkit'
import { findAll, print } from './utils.ts'

function countDigits(x: number) {
    return Math.floor(Math.log10(x) + 1);
}

type numFunc = (a: number, b: number) => number
const plus: numFunc = (a, b) => a + b
const mult: numFunc = (a, b) => a * b
const concatnum: numFunc = (a, b) => 10 ** countDigits(b) * a + b

function generateCombinations1(length: number): numFunc[][] {
    if (length === 0) return [[]];
    const smallerCombinations = generateCombinations1(length - 1);
    return [
        ...smallerCombinations.map(xs => [...xs, plus]),
        ...smallerCombinations.map(xs => [...xs, mult]),
    ];
}

function generateCombinations2(length: number): numFunc[][] {
    if (length === 0) return [[]];
    const smallerCombinations = generateCombinations2(length - 1);
    return [
        ...smallerCombinations.map(xs => [...xs, plus]),
        ...smallerCombinations.map(xs => [...xs, mult]),
        ...smallerCombinations.map(xs => [...xs, concatnum]),
    ];
}

function oneLine(genFunc: (l: number) => numFunc[][], line: [number, number[]]) {
  const [total, parts] = line
  const res = genFunc(parts.length - 1)
    .map((op) => zip(op, parts.slice(1)))
    .map((operators) => {
      return operators.reduce((acc: number, a: [numFunc, number]) => {
        const [op, n] = a
        return op(acc, n)
      }, parts[0])
    })
    .filter((x) => x === total)
  return res[0] ?? 0
}

function solve(xs: [number, number[]][], genFunc: (l: number) => numFunc[][]) {
  return sum(xs.map(curry(oneLine)(genFunc)))
}

export function runDay() {
  const parsed = Deno.readTextFileSync('./txt/day7')
    .split('\n')
    .filter((x) => x !== '')
    .map(findAll(/\d+/g))
    .map((xs) => xs.map(Number))
    .map((xs) => [xs[0], xs.slice(1)] as [number, number[]])
  const one = solve(parsed, generateCombinations1)
  const two = solve(parsed, generateCombinations2)
  print(one, two)
}