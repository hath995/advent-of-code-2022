import { assert } from 'console';
import fs from 'fs';

type Point = {x: number, y: number};
function parseInput(s: string): Point[][] {
    return s.split("\n").filter(x => x.length > 0).map(line => line.split(" -> ").map(pointString => {
        let [xs, ys] = pointString.split(",");
        return {
            x: parseInt(xs),
            y: parseInt(ys)
        }
    }))
}

const dataString = fs.readFileSync("./input.txt",{encoding:"utf8"});
const data = parseInput(dataString)

const exampleString = fs.readFileSync("./example.txt",{encoding:"utf8"});
const exampleData = parseInput(exampleString);

type mapUnits = "o" | "#";
type hashGrid = {
    [key: string]: mapUnits
}

function generateMap(data: Point[][]): hashGrid {
    let result: hashGrid = {};
    for(let group of data) {
        let lineStart = group[0];
        for(let i = 1; i < group.length; i++) {
            if(lineStart.x - group[i].x == 0) { //vertical
                let bottom = Math.min(lineStart.y, group[i].y)
                let top = Math.max(lineStart.y, group[i].y)
                for(let dy = bottom; dy <= top; dy++) {
                    result[pos({x: lineStart.x, y: dy})] = "#";
                }
            }else { //horizontal
                let left = Math.min(lineStart.x, group[i].x)
                let right = Math.max(lineStart.x, group[i].x)
                for(let dx = left; dx <= right; dx++) {
                    result[pos({x: dx, y: lineStart.y})] = "#";
                }
            } 
            lineStart = group[i];
        }
    }
    return result;
}
function pos({x,y}: Point): string {
    return `${x},${y}`;
}

function equal({x: x1, y: y1}: Point, {x: x2, y: y2}: Point) {
    return x1 === x2 && y1 === y2;
}

function sandfall(grid: hashGrid, {x, y}: Point): Point {
    if(!(pos({x,y: y+1}) in grid)) {
        return {x, y: y + 1};
    }else if (!(pos({x: x - 1, y: y + 1}) in grid)) {
        return {x: x - 1, y: y + 1};
    }else if (!(pos({x: x + 1, y: y + 1}) in grid)) {
        return {x: x + 1, y: y + 1};
    }
    return {x,y};
}

function printGrid(grid: hashGrid, startX: number, endX: number, startY: number, endY: number): string {
    let result = "";
    for(let y = startY; y <= endY; y++) {
        for(let x = startX; x <= endX; x++) {
            let point = pos({x, y});
            if(point in grid) {
                result += grid[point];
            }else{
                result += ".";
            }
        }
        result += "\n";
    }
    return result;
}

function part1(data: Point[][]): number {
    let grid = generateMap(data);
    let yMax = data.reduce((lmax, line) => Math.max(lmax, line.reduce((max, point) => Math.max(point.y, max), -Infinity)), -Infinity)
    console.log(yMax);
    let sandCount = 0;
    let sand: Point = {x: 500, y: 0};
    while(sand.y < yMax) {
        let next = sandfall(grid, sand);
        if(equal(sand, next)) { //settled
            grid[pos(next)] = "o";
            sand = {x: 500, y: 0};
            sandCount++;
            // console.log(printGrid(grid, 494, 503, 0, 9));
        }else{
            sand = next;
        }
    }
    // console.log(printGrid(grid, 480, 530, 0, 200));
    return sandCount;
}

function generateFloor(grid: hashGrid, y: number) {
    for(let x = 0; x < 1000; x++) {
        grid[pos({x,y})] = "#";
    }
}

function part2(data: Point[][]): number {
    let grid = generateMap(data);
    let yMax = data.reduce((lmax, line) => Math.max(lmax, line.reduce((max, point) => Math.max(point.y, max), -Infinity)), -Infinity)+2;
    generateFloor(grid, yMax);
    // console.log(yMax);
    let sandCount = 0;
    let sand: Point = {x: 500, y: 0};
    while(true) {
        let next = sandfall(grid, sand);
        if(equal(sand, next) && equal(next, {x: 500, y: 0})) { //settled
            sandCount++;
            grid[pos(next)] = "o";
            console.log(printGrid(grid, 460, 550, 0, yMax));
            break;
        } else if(equal(sand, next)) { //settled
            grid[pos(next)] = "o";
            sand = {x: 500, y: 0};
            sandCount++;
            // console.log(printGrid(grid, 494, 503, 0, 9));
        }else{
            sand = next;
        }
    }
    // console.log(printGrid(grid, 480, 530, 0, 200));
    return sandCount;
}
// let exampleResult = part1(exampleData);
// console.log(exampleResult);
// assert(exampleResult == 24, "amount of sand");

// let result = part1(data);
// console.log(result);

let exampleResult2 = part2(exampleData);
console.log(exampleResult2);
assert(exampleResult2 == 93, "amount of sand");
console.log(part2(data));