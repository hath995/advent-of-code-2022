import { assert } from 'console';
import fs from 'fs';

type Range = {lower: number, upper: number};
function parseInput(data: string): [Range, Range][] {
    return data.split("\n").filter(s => s.length > 0).map((pairs): [Range, Range] => pairs.split(",").map((pair): Range => {
        let [left,right] = pair.split("-");
        return {lower: parseInt(left), upper: parseInt(right)};
    } ) as [Range, Range]);
}

const dataString = fs.readFileSync("./input.txt",{encoding:"utf8"});
const data = parseInput(dataString)

const exampleString = fs.readFileSync("./example.txt",{encoding:"utf8"});
const exampleData = parseInput(exampleString);

console.log(exampleData);

function contains(range1: Range, range2: Range): boolean {
    return range1.lower <= range2.lower && range1.upper >= range2.upper
}

function overlaps(range1: Range, range2: Range): boolean {
    return range1.lower <= range2.lower && range1.upper >= range2.lower;
}

function part1(data: [Range, Range][]): number {
    return data.reduce((count, rangePair) => {
        if(contains(rangePair[0], rangePair[1]) || contains(rangePair[1], rangePair[0])) {
            return count + 1;
        }
        return count;
    }, 0);
}

function part2(data: [Range, Range][]): number {
    return data.reduce((count, rangePair) => {
        if(overlaps(rangePair[0], rangePair[1]) || overlaps(rangePair[1], rangePair[0])) {
            return count + 1;
        }
        return count;
    }, 0);
}

let exampleResult = part1(exampleData);
console.log("example result: ", exampleResult);
assert(exampleResult == 2)

let part1Result = part1(data);
console.log("part1 result: ", part1Result);

let exampleResult2 = part2(exampleData);
console.log("example result part2: ", exampleResult2);
assert(exampleResult2 == 4);

let part2Result = part2(data);
console.log("part2 result: ", part2Result);