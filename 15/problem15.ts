import { assert } from 'console';
import fs from 'fs';

const inputFormat = /Sensor at x=([-0-9]+), y=([-0-9]+): closest beacon is at x=([-0-9]+), y=([-0-9]+)/;
type Point = {x: number, y: number};
type Input = {sensor: Point, beacon: Point, radius: number};
function parseInput(s: string): Input[] {
    return s.split("\n").filter(x => x.length > 0).map((line): Input => {
        let input = inputFormat.exec(line)!;
        let sensor = {
          x: parseInt(input[1]),
          y: parseInt(input[2]),
        };
        let beacon = {
          x: parseInt(input[3]),
          y: parseInt(input[4]),
        }; 
        return {
            sensor,
            beacon,
            radius: dist(sensor, beacon)
        }
    })
}

const dataString = fs.readFileSync("./input.txt",{encoding:"utf8"});
const data = parseInput(dataString)

const exampleString = fs.readFileSync("./example.txt",{encoding:"utf8"});
const exampleData = parseInput(exampleString);

function dist({x: x1, y: y1}: Point, {x: x2, y: y2}: Point): number {
    return Math.abs(x1 - x2) + Math.abs(y1 - y2);
}

function pos({x,y}: Point): string {
    return `${x},${y}`;
}

function plus({x,y}: Point, dx: number, dy: number): Point {
    return {x: x + dx, y: y + dy};
}
function printGrid(grid: Map<string, Point>, beacons: Set<string>, sensors: Set<string>, startX: number, endX: number, startY: number, endY: number): string {
    let result = "";
    for(let y = startY; y <= endY; y++) {
        for(let x = startX; x <= endX; x++) {
            let point = pos({x, y});
            if(grid.has(point) && !beacons.has(point) && !sensors.has(point)) {
                result += "#";
            }else if(beacons.has(point)) {
                result += "B"
            } else if(sensors.has(point)) {
                result += "S"
            }else{
                result += ".";
            }
        }
        result += "\n";
    }
    return result;
}

function part1(data: Input[], row: number): number {
    let covered: Map<string, Point> = new Map();
    let filled: Map<string, Point> = new Map();
    let beacons: Set<string> = new Set()
    let sensors: Set<string> = new Set()
    for(let {sensor, beacon} of data) {
        let radius = dist(sensor, beacon);
        beacons.add(pos(beacon));
        sensors.add(pos(sensor));
        filled.set(pos(beacon), beacon);
        filled.set(pos(sensor), sensor);
        for(let dx=0; dx <= radius; dx++) {
            // let points = [{x: sensor.x + dx, y: row}, {x: sensor.x - dx, y: row}];

            // for(let point of points) {
            //     if(dist(sensor, point) <= radius) {
            //         covered.set(pos(point), point);
            //     }
            // }
            for(let dy=0; dy <= radius; dy++) {
                let points = [
                    plus(sensor, dx, dy), 
                    plus(sensor, -dx, dy), 
                    plus(sensor, dx, -dy), 
                    plus(sensor, -dx, -dy) 
                ]
                for(let point of points) {
                    if(dist(sensor, point) <= radius) {
                        covered.set(pos(point), point);
                    }
                }
            }
        }
    }
     console.log(printGrid(covered, beacons, sensors, -2, 25, -2, 22));
    let count = 0;
    for(let [position, point] of covered.entries()) {
        if(point.y == row && !filled.has(position)) {
            count++;
        }
    }
    return count;
}

function tuning({x,y} : Point): number {
    return x * 4000000 + y;
}

// let exampleResult = part1(exampleData, 10);
// console.log(exampleResult);
// assert(exampleResult == 26, "");

function inBound({x,y}: Point, bound: number) {
    return 0 <= x && x <= bound && 0 <= y && y <= bound;
} 
// let result = part1(data, 2_000_000);
// console.log(result);
function part2Wrong(data: Input[], bound: number): number {
    let covered: Map<string, Point> = new Map();
    let filled: Map<string, Point> = new Map();
    let beacons: Set<string> = new Set()
    let sensors: Set<string> = new Set()

    
    for(let {sensor, beacon} of data) {
        console.log("Distance = ", dist(sensor, beacon));
    }
    //for(let {sensor, beacon} of data) {
        //let radius = dist(sensor, beacon);
        //beacons.add(pos(beacon));
        //sensors.add(pos(sensor));
        //filled.set(pos(beacon), beacon);
        //filled.set(pos(sensor), sensor);
        //for(let dx=0; dx <= radius; dx++) {
            //for(let dy=0; dy <= radius; dy++) {
                //let points = [
                    //plus(sensor, dx, dy), 
                    //plus(sensor, -dx, dy), 
                    //plus(sensor, dx, -dy), 
                    //plus(sensor, -dx, -dy) 
                //]
                //for(let point of points) {
                    //if(dist(sensor, point) <= radius && inBound(point, bound)) {
                        //covered.set(pos(point), point);
                    //}
                //}
            //}
        //}
    //}
    // console.log(printGrid(covered, beacons, sensors, 0, 20, 0, 20));
    let freq = 0;
/*    loop: for(let x = 0; x <= bound; x++) {*/
        /*for(let y = 0; y <= bound; y++) {*/
            /*if(!covered.has(pos({x,y}))) {*/
                /*freq = tuning({x,y});*/
                /*break loop;*/
            /*}*/
        /*}*/
/*    }*/
    return freq;
}

function part2(data: Input[], bound: number): number {
    let sensors = data.map(input => input.sensor);
    return tuning(data.reduce((prev, input): Point => {
        let {x, y} = input.sensor;
        let radius = dist(input.sensor, input.beacon);
        let incPositions = [{x, y: y-(radius+1)}, {x: x-(radius-1), y}];
        let decPositions = [{x, y: y+(radius+1)}, {x: x-(radius-1), y}];
        for(let i = 0; i < radius + 2; i++) {
            
            for(let pos of incPositions) {
                if(inBound(pos, bound)) {
                    if(data.every((input) => {
                        return dist(pos, input.sensor) > input.radius;
                    })) {
                        return pos;
                    }
                }
            }

            for(let pos of decPositions) {
                if(inBound(pos, bound)) {
                    if(data.every((input, index) => {
                        return dist(pos, input.sensor) > input.radius;
                    })) {
                        return pos;
                    }
                }
            }
            incPositions = incPositions.map(({x,y}) => ({x: x+1, y: y+1}));
            decPositions = decPositions.map(({x,y}) => ({x: x-1, y: y-1}));
        }

        return prev;
    }, {x: 0, y: 0}))
}

// let exampleResult2 = part2(exampleData, 20);
// console.log(exampleResult2);
// assert(exampleResult2 == 140);

console.log(part2(data, 4000000));
