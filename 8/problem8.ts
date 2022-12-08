import { assert, dir } from 'console';
import fs from 'fs';

const dataString = fs.readFileSync("./input.txt",{encoding:"utf8"});
const data = parseInput(dataString)

const exampleString = fs.readFileSync("./example.txt",{encoding:"utf8"});
const exampleData = parseInput(exampleString);


const verticalString = fs.readFileSync("./vertical.txt",{encoding:"utf8"});
const verticalTest = parseInput(verticalString);

const horizontalString = fs.readFileSync("./horizontal.txt",{encoding:"utf8"});
const horizontalTest = parseInput(horizontalString);


function parseInput(data: string): number[][] {
    let lines =  data.split("\n");
    lines.pop() //remove empty row
    return lines.map(line => line.split("").map(x => parseInt(x)));
}

function incrementPosition(pos: [number, number], dir: {x: number, y: number}): [number, number] {
    return [pos[0] + dir.y, pos[1] + dir.x];
}

function calculateVisibility(data: number[][], direction: {x: number, y: number, start: number}): boolean[][] {
    const rows = data.length;
    const columns = data[0].length;
    let visibility: boolean[][] = [];
    for(let i = 0; i < rows; i++) {
        let row = new Array(columns);
        row.fill(false);
        visibility.push(row);
    }
    // console.log(data);
    // console.log(visibility);
    // console.log(direction);
    if(direction.x === 0) { //move columnwise
        for(let i = 0; i < columns; i++) {
            let position: [number, number] = [direction.start, i];
            let treeHeight = data[position[0]][position[1]];
            visibility[position[0]][position[1]] = true;
            position = incrementPosition(position, direction);
            for(let k = 1; k < rows; k++) {
                // console.log(position);
                let nextTree = data[position[0]][position[1]];
                if(nextTree > treeHeight) {
                    visibility[position[0]][position[1]] = true;
                    treeHeight = nextTree;
                } 
                position = incrementPosition(position, direction);
            }
        }
    }else{ //move row-wise
        for(let i = 0; i < rows; i++) {
            let position: [number, number] = [i, direction.start];
            let treeHeight = data[position[0]][position[1]];
            visibility[position[0]][position[1]] = true;
            position = incrementPosition(position, direction);
            for(let k = 1; k < columns; k++) {
                let nextTree = data[position[0]][position[1]];
                if(nextTree > treeHeight) {
                    visibility[position[0]][position[1]] = true;
                    treeHeight = nextTree;
                } 
                position = incrementPosition(position, direction);
            }
        }
    }

    return visibility;
} 

function printMap(data: boolean[][]): string {
    return data.reduce((acc, row) => acc + row.reduce((acc, curr) => acc + (curr ? "T" : "F"), "")+"\n", "");
}

// declare let visibilityMap: (x: number[][]) => boolean[][];
function visibilityMap(data: number[][]): boolean[][] {
    const rows = data.length;
    const columns = data[0].length;
    let visibility: boolean[][] = [];
    for(let i = 0; i < rows; i++) {
        let row = new Array(columns);
        row.fill(false);
        visibility.push(row);
    }

    let directionVisibility: boolean[][][] = [];
    directionVisibility.push(calculateVisibility(data, {x: 1, y: 0, start: 0}))
    directionVisibility.push(calculateVisibility(data, {x: -1,y: 0, start: columns-1}))
    directionVisibility.push(calculateVisibility(data, {x: 0, y: 1, start: 0}))
    directionVisibility.push(calculateVisibility(data, {x: 0, y: -1,start: rows-1}))
    // console.log((directionVisibility[0]))
    // console.log(printMap(directionVisibility[0]))
    // console.log(printMap(directionVisibility[1]))
    // console.log(printMap(directionVisibility[2]))
    // console.log(printMap(directionVisibility[3]))

    visibility.forEach((row, y) => row.forEach((value, x) => {
        visibility[y][x] = directionVisibility.reduce<boolean>((visible, direction) => {
            return visible || direction[y][x];
        }, false);
    }))
    return visibility;
}

function part1(data: number[][]): number {
    let visible = visibilityMap(data);
    return visible.reduce((lineTotal,row) => lineTotal + row.reduce((total, tree) => total + (tree ? 1 : 0),0), 0)
}

// part1(verticalTest);
// part1(horizontalTest);
// console.log(part1(exampleData));
// console.log(part1(data));
function isValid(data: number[][], pos: [number, number]): boolean {
    return pos[0] >= 0 && pos[0] < data.length && pos[1] >= 0 && pos[1] < data[0].length;
}
function part2(data: number[][]): number {
    let directions = [
      { x: 1, y: 0 },
      { x: -1, y: 0 },
      { x: 0, y: 1 },
      { x: 0, y: -1 },
    ];

    let viewingScore: number[][] = data.map((row, y) => row.map((tree, x) => {
        let views = [0,0,0,0];
        for(let i = 0; i < directions.length; i++) {
            let pos: [number, number] = incrementPosition([y,x], directions[i]);
            while(isValid(data, pos) && data[pos[0]][pos[1]] < tree) {
                views[i]++;
                pos = incrementPosition(pos, directions[i]);
            }
            if(isValid(data, pos)) {
                views[i]++;
            }
        }
        // console.log(views);
        return views.reduce((x,y) => x * y,1);
    }))
    // console.log(viewingScore);

    return viewingScore.reduce((rowMax, row) => Math.max(rowMax, row.reduce((acc, curr) => Math.max(acc, curr),-Infinity)), -Infinity);
}

// console.log(part2(exampleData));
console.log(part2(data));