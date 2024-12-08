#!/bin/python
from collections import defaultdict
from functools import reduce
from itertools import combinations
from operator import concat
import math

def printGrid(grid):
    print('\n'.join([''.join(s) for s in grid]))

def printNodes(grid, res):
    antinodes = [list('.' * len(row)) for row in grid]
    for x, y in res:
        antinodes[x][y] = '#'
    printGrid(antinodes)

def oob(grid: list[str], i: int, j: int) -> bool:
    return i < 0 \
        or i >= len(grid) \
        or j < 0 \
        or j >= len(grid[0])

def subtract(p1: tuple[int, int], p2: tuple[int, int]):
    return (p1[0] - p2[0], p1[1] - p2[1])

def add(p1: tuple[int, int], p2: tuple[int, int]):
    return (p1[0] + p2[0], p1[1] + p2[1])

def getAntinodes1(p1: tuple[int, int], p2: tuple[int, int]):
    res = []
    distance = subtract(p2, p1)
    x = subtract(p1, distance)
    y = add(p2, distance)
    if not oob(grid, *x):
        res.append(x)
    if not oob(grid, *y):
        res.append(y)
    return res

def flatten(xs):
    return list(reduce(concat, xs))

def part1(grid, antennas):
    res = set()
    for a in antennas.keys():
        pairs = combinations(antennas[a], 2)
        res.update(flatten(getAntinodes1(*p) for p in pairs))
    return len(res)

def getAntinodes2(p1: tuple[int, int], p2: tuple[int, int]):
    res = []
    distance = subtract(p2, p1)
    x, y = distance
    step = tuple(int(n / math.gcd(x, y)) for n in distance)
    p = p1
    while True:
        p = add(p, step)
        if oob(grid, p[0], p[1]):
            break
        res.append(p)
    while True:
        p = subtract(p, step)
        if oob(grid, p[0], p[1]):
            break
        res.append(p)
    return res

def part2(grid, antennas):
    res = set()
    for a in antennas.keys():
        pairs = combinations(antennas[a], 2)
        for nodes in [getAntinodes2(*p) for p in pairs]:
            res.update(nodes)
    return len(res)

with open('../txt/day8', 'r') as f:
    grid = f.read().splitlines()
    antennas = defaultdict(list)
    for i, _ in enumerate(grid):
        for j, letter in enumerate(grid[i]):
            if letter.isalnum():
                antennas[letter].append((i, j))
    one = part1(grid, antennas)
    two = part2(grid, antennas)
    print(one, two)
