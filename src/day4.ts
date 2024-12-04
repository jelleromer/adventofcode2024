import { findAll, print } from './utils.ts'

function part1(xs: string[]) {
  return xs
    .concat(transposeVertical(xs))
    .concat(getDiagonals(xs))
    .flatMap(findAll(/(?=XMAS|SAMX)/g))
    .length
}

function transposeVertical(xs: string[]) {
  const res = []
  for (let i = 0; i < xs.length; i++) {
    let newStr = ''
    for (let j = 0; j < xs[i].length; j++) {
      newStr += xs[j][i]
    }
    res.push(newStr)
  }
  return res
}

function getDiagonals(xs: string[]) {
  const res = []
  // for each row, go down right
  for (let i = 0; i < xs.length; i++) {
    let newStr = ''
    for (let j = 0; i + j < xs.length; j++) {
      newStr += xs[i + j][j]
    }
    res.push(newStr)
  }
  // for each column, go down right (skip first to avoid overlap with previous loop)
  for (let i = 1; i < xs[0].length; i++) {
    let newStr = ''
    for (let j = 0; i + j < xs.length; j++) {
      newStr += xs[j][i + j]
    }
    res.push(newStr)
  }
  // start in top-right, for each row, go down left
  for (let i = 0; i < xs.length; i++) {
    let newStr = ''
    const rightmostColumn = xs[0].length - 1
    for (let j = 0; i + j < xs.length; j++) {
      newStr += xs[i + j][rightmostColumn - j]
    }
    res.push(newStr)
  }
  // start in top-right, for each column, go down left (skip first to avoid overlap with previous loop)
  for (let i = xs.length - 2; i >= 0; i--) {
    let newStr = ''
    for (let j = 0; i - j >= 0; j++) {
      newStr += xs[j][i - j]
    }
    res.push(newStr)
  }
  return res
}

function isXmas(grid: string[], i: number, j: number): boolean {
  const topLeft = grid[i - 1][j - 1]
  const topRight = grid[i + 1][j - 1]
  const downLeft = grid[i - 1][j + 1]
  const downRight = grid[i + 1][j + 1]
  return (
    topLeft === topRight &&
    downLeft === downRight &&
    (topRight === 'S' && downRight === 'M' ||
      topRight === 'M' && downRight === 'S')
  ) ||
    (
      topLeft === downLeft &&
      topRight === downRight &&
      (topLeft === 'S' && topRight === 'M' ||
        topLeft === 'M' && topRight === 'S')
    )
}

function part2(xs: string[]) {
  let res = 0
  for (let i = 1; i < xs.length - 1; i++) {
    for (let j = 1; j < xs[0].length - 1; j++) {
      if (xs[i][j] == 'A' && isXmas(xs, i, j)) {
        res++
      }
    }
  }
  return res
}

export function runDay() {
  const inFile = Deno.readTextFileSync('./txt/day4')
  const parsed = inFile
    .split('\n')
    .filter((x) => x !== '')
  const one = part1(parsed)
  const two = part2(parsed)
  print(one, two)
}
