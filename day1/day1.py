#!/bin/python
import re
from collections import Counter

def unzip(xs):
    return zip(*xs)

def part1(pairs):
    return sum(map(lambda x: abs(x[1] - x[0]), zip(*map(sorted, unzip(pairs)))))

def part2(pairs):
    xs, ys = unzip(pairs)
    counts = Counter(ys)
    return sum(x * (0 if x not in counts else counts.get(x)) for x in xs)

with open('input', 'r') as f:
    lines = f.read().splitlines()
    pairs = [tuple(map(int, re.findall(r'\d+', x))) for x in lines]
    part1 = part1(pairs)
    part2 = part2(pairs)
    print(part1, part2)
