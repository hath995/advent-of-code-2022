import { assert } from 'console';
import fs from 'fs';

type Point = [x: number, y: number, z: number];
function parseInput(s: string): Point[] {
    return s.trim().split("\n").map(line => {
        let [x,y,z] = line.split(",").map(ns => parseInt(ns));
        return [x,y,z];
    })
}

const dataString = fs.readFileSync("./input.txt",{encoding:"utf8"});
const data = parseInput(dataString)

const exampleString = fs.readFileSync("./example.txt",{encoding:"utf8"});
const exampleData = parseInput(exampleString);

const smallString = fs.readFileSync("./smallexample.txt",{encoding:"utf8"});
const smallData = parseInput(smallString);
console.log(smallData, exampleData)

const offsets: Point[] = [[0,0,1],[0,0,-1],[1,0,0],[-1,0,0],[0,1,0],[0,-1,0]];

function pos([x,y,z]: Point): string {
    return `${x},${y},${z}`;
}

function add([x1,y1,z1]: Point, [x2,y2,z2]: Point): Point {
    return [x1+x2, y1+y2, z1+z2];
}

function part1(data: Point[]): number {
    let pointset = new Set<string>();
    for(let point of data) {
        pointset.add(pos(point));
    }

    return data.reduce((area, point) => {
        return area + offsets.reduce((sum, offset) => sum + (pointset.has(pos(add(point, offset))) ? 0 : 1), 0)
    }, 0)
}

let smallResult = part1(smallData);
console.log(smallResult);
assert(smallResult == 10, "small example");

let exampleResult = part1(exampleData);
console.log(exampleResult);
assert(exampleResult == 64, "larger example");

console.log(part1(data));

function part2(data: Point[]): number {

}


let exampleResult2 = part2(exampleData);
console.log(exampleResult2);
assert(exampleResult2 == 58, "example minus internal volume");