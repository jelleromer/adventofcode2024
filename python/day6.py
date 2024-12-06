#!/bin/python
from enum import Enum

class Dir(Enum):
    Up = (-1, 0)
    Down = (1, 0)
    Left = (0, -1)
    Right = (0, 1)

def turn(d: Dir):
    match d:
        case Dir.Up:
            return Dir.Right
        case Dir.Right:
            return Dir.Down
        case Dir.Down:
            return Dir.Left
        case Dir.Left:
            return Dir.Up

def oob(grid: list[str], i: int, j: int) -> bool:
    return i < 0 \
        or i >= len(grid) \
        or j < 0 \
        or j >= len(grid[0])

def bonk(grid: list[str], i: int, j: int):
    return grid[i][j] == '#'

def move(i: int, j: int, direc):
    dy, dx = direc.value
    return (i + dy, j + dx)

def part1(g: list[str]):
    startI, startJ = [(i, line.index('^')) for i, line in enumerate(g) if '^' in line][0]
    direction = Dir.Up

    i, j = startI, startJ
    visited = set([(i, j)])
    visitedDir = set([(i, j, direction)])

    while True:
        i2, j2 = move(i, j, direction)
        if (i2, j2, direction) in visitedDir:
            return -1
        if oob(g, i2, j2):
            break
        if bonk(g, i2, j2):
            direction = turn(direction)
        else:
            i, j = i2, j2
            visited.add((i, j))
            visitedDir.add((i, j, direction))
    return len(visited)

def setCharAtIndex(ch, s, i):
    return s[:i] + ch + s[i + 1:]

def setListAtIndex(ch, s, i):
    return s[:i] + [ch] + s[i + 1:]

def part2(g: list[str]):
    res = 0
    for i in range(len(g)):
        for j, x in enumerate(g[i]):
            if x == '.':
                newG = setListAtIndex(
                    setCharAtIndex('#', g[i], j),
                    g,
                    i)
                if part1(newG) == -1:
                    res += 1
    return res

with open('../txt/day6', 'r') as f:
    g = f.read().splitlines()
    one = part1(g)
    two = part2(g)
    print(one, two)
