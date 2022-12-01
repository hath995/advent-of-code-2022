import { assert } from 'console';
import fs from 'fs';

function parseInput(s: string): number[][] {
    return s.split("\n\n").filter(x => x.length !== 0).map(x => x.split("\n").map(x => parseInt(x)))
}

const dataString = fs.readFileSync("./input.txt",{encoding:"utf8"});
const data = parseInput(dataString)

const exampleString = fs.readFileSync("./example.txt",{encoding:"utf8"});
const exampleData = parseInput(exampleString);

function part1(data: number[][]): number {
    let totals = data.map(items => items.reduce((x,y) => x+y,0));
    return totals.reduce((best, current) => Math.max(best, current));
}

let exampleResult = part1(exampleData);
assert(exampleResult === 24000, "should equal the sum of the elf with the most calories")
console.log(exampleResult);

console.log(part1(data));

function part2(data: number[][]) {
    let totals = data.map(items => items.reduce((x,y) => x+y,0));
    totals.sort((a, b) => b - a);
    return totals[0] + totals[1] + totals[2];
}

let exampleResult2 = part2(exampleData);
assert(exampleResult2 === 45000, "should equal the sum of the top 3 elves");
console.log(exampleResult2);

console.log(part2(data));