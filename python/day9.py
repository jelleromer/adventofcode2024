#!/bin/python
import re
from functools import reduce

def constructFS(diskMap: list[int]):
    writeFile = True
    fileIndex = 0
    res = []
    for n in diskMap:
        if writeFile:
            for _ in range(n):
                res.append(fileIndex)
            fileIndex += 1
            writeFile = False
        else:
            for _ in range(n):
                res.append(None)
            writeFile = True
    return res

def compressFS1(fs: list[int | None]):
    l = 0
    r = len(fs) - 1
    while l < r:
        while fs[l] is not None:
            l += 1
        while fs[r] is None:
            r -= 1
        fs[l] = fs[r]
        fs[r] = None
        l += 1
        r -= 1
    return fs

def func(a: int, b: tuple[int, int | None]):
    x, y = b
    if y is None:
        return a
    else:
        return a + x * y

def part1(diskMap):
    blocks = enumerate(compressFS1(constructFS(diskMap)))
    return reduce(func, blocks, 0)

def printFS(fs: list[int | None]):
    print(''.join(map(lambda x: '.' if x is None else str(x), fs)))

def printLoc(fs: list[int | None], i: int, name: str):
    xs = list(map(lambda x: '.' if x is None else str(x), fs))
    xs[i] = name
    print(''.join(xs))

# left is leftmost index of gap
def countGap(fs: list[int | None], left: int):
    i = 0
    length = len(fs)
    while fs[left + i] is None:
        i += 1
        # avoid oob index
        if left + i >= length:
            return i
    return i

# r is rightmost index of file
def countFileSize(fs: list[int | None], r: int):
    i = 0
    filename = fs[r]
    while fs[r - i] == filename:
        i += 1
    return i, filename

def getFittingGapIndex(fs, fileSize, r) -> int | None:
    i = 0
    gapSize = 0
    while i < r:
        while fs[i] is not None:
            i += 1
            if i >= r:
                return None
        gapSize = countGap(fs, i)
        if gapSize >= fileSize:
            return i
        i += gapSize
    return None

def compressFS2(fs: list[int | None]):
    r = len(fs) - 1
    while r > 1:
        while fs[r] is None:
            r -= 1
        fileSize, fileName = countFileSize(fs, r)
        r -= (fileSize - 1)
        l = getFittingGapIndex(fs, fileSize, r)
        if l is None:
            r -= 1
            continue
        for i in range(fileSize):
            fs[l + i] = fileName
            fs[r + i] = None
        r -= 1
    return fs

def part2(diskMap):
    blocks = enumerate(compressFS2(constructFS(diskMap)))
    return reduce(func, blocks, 0)

with open('../txt/day9', 'r') as f:
    diskMap = list(map(int, re.findall(r'\d', f.read())))
    one = part1(diskMap)
    two = part2(diskMap)
    print(one, two)
