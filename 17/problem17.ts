import { equal } from 'assert';
import { assert } from 'console';
import fs from 'fs';

type direction = "<" | ">"
function parseInput(s: string): direction[] {
    return s.trim().split("") as direction[];
}

const dataString = fs.readFileSync("./input.txt",{encoding:"utf8"});
const data = parseInput(dataString)

const exampleString = fs.readFileSync("./example.txt",{encoding:"utf8"});
const exampleData = parseInput(exampleString);

/*
The tall, vertical chamber is exactly seven units wide. Each rock appears so that its left edge is two units away from the left wall and its bottom edge is three units above the highest rock in the room (or the floor, if there isn't one).
*/
type Point = {x: number, y: number}
type PointOffset = {dx: number, dy: number};
type Shape = {height: number, width: number, filled: PointOffset[], underside: PointOffset[]}
const shapes = [
`####`,
`.#.
###
.#.`,
`..#
..#
###`,
`#
#
#
#`,
`##
##`
].map((shape): Shape => {
    let lines = shape.split("\n");
    let height = lines.length;
    let width = lines[0].length;
    let filled: PointOffset[] = [];
    let underside: PointOffset[] = [];
    for(let y = 0; y < height; y++) {
        for(let x = 0; x < width; x++) {
            if(lines[y][x] == "#") {
                filled.push({dx:x, dy: -y});
                if(y+1 >= height || lines[y+1][x] == ".") {
                    underside.push({dx: x, dy: -y-1});
                }
            }
        }
    }

    return {
        height,
        width,
        filled,
        underside
    }
});

function add({x,y}: Point, {dx, dy}: PointOffset): Point {
    return {x: x + dx, y: y + dy}
}
function pos({x, y}: Point): string {
    return `${x},${y}`
}

class Piece
{
    constructor(public shape: Shape, public x: number, public y: number) {

    }

    moveLeft(grid: Set<string>) {
        if(this.shape.filled.some(offset => grid.has(pos(add({x: this.x-1, y: this.y}, offset))))) return;
        if(this.x > 0) {
            this.x--
        }
    }

    moveRight(grid: Set<string>) {
        if(this.shape.filled.some(offset => grid.has(pos(add({x: this.x+1, y: this.y}, offset))))) return;
        if(this.x+this.shape.width < 7) {
            this.x++
        }
    }

    moveDown(grid: Set<string>): boolean {
        if(this.y-1-this.shape.height < 0) return false;
        if(this.shape.underside.some(offset => grid.has(pos(add({x: this.x, y: this.y}, offset))))) return false;
        if(this.y-this.shape.height > 0) this.y--;
        return true;
    }

    isLanded(grid: Set<string>): boolean {
        return this.y - this.shape.height == 0 || this.shape.underside.some(offset => grid.has(pos(add({x: this.x, y: this.y}, offset))));
    }

    settle(grid: Set<string>, max: number): number {
        let offsetMax = this.y; 
        for(let offset of this.shape.filled) {
            let point = add(this, offset)
            offsetMax = Math.max(offsetMax, point.y);
            grid.add(pos(point));
        }
        return Math.max(max, offsetMax+1)
    }

    isFilled({x,y}: Point): boolean {
        let dx = x - this.x ;
        let dy = y - this.y;
        return this.shape.filled.some((offset) => dx == offset.dx && dy == offset.dy);
    }

}

function printGrid(grid: Set<string>, fallingRock: Piece | null, ystart=1, yend=40) {
    let result = "";
    for(let y=yend; y >= ystart; y--) {
        result += "|";
        for(let x = 0; x < 7; x++) {
            if(fallingRock && fallingRock.isFilled({x,y})) {
                result += "@";
            }else if(grid.has(pos({x,y}))) {
                result += "#"
            }else{
                result += "."
            }
        }
        result += "|\n";
    }
    // result += "_________"
    return result;
}

function part1(input: direction[], rocks: number): number {
    let max = 1;
    let grid = new Set<string>();
    let shapeIndex = 0;
    let inputIndex = 0;
    for(let i = 0; i < rocks; i++) {
        let rock = new Piece(shapes[shapeIndex],2,max+2+shapes[shapeIndex].height);
        let oldindex=inputIndex;
        while(true) {
            switch(input[inputIndex]) {
                case "<":
                    rock.moveLeft(grid);
                    break;
                case ">":
                    rock.moveRight(grid);
                    break;
            }
            oldindex = inputIndex
            inputIndex = (inputIndex+1) % input.length;
            if(!rock.moveDown(grid)) {
                break;
            }
        }
        max = rock.settle(grid, max);
        shapeIndex = (shapeIndex + 1) % shapes.length;
    }

    return max-1;
}

const arrayEqual = <T>(left: T[], right: T[]) => left.length == right.length && left.every((x,i) => x == right[i]);
function part2(input: direction[], rocks: number): number {
    let max = 1;
    let grid = new Set<string>();
    let piecemap: boolean[][] = new Array(shapes.length * 7);
    for(let i = 0; i< piecemap.length; i++) {
        piecemap[i] = new Array(input.length);
        piecemap[i].fill(false);
    }
    // console.log(JSON.stringify(shapes, null, 2));
    let heights: number[] = [];
    let shapeIndex = 0;
    let inputIndex = 0;
    let firstX = -1;
    for(var i = 0; i < rocks; i++) {
        let rock = new Piece(shapes[shapeIndex],2,max+2+shapes[shapeIndex].height);
        let oldindex=inputIndex;
        while(true) {
            switch(input[inputIndex]) {
                case "<":
                    rock.moveLeft(grid);
                    break;
                case ">":
                    rock.moveRight(grid);
                    break;
            }
            oldindex = inputIndex
            inputIndex = (inputIndex+1) % input.length;
            if(!rock.moveDown(grid)) {
                break;
            }
        }
        max = rock.settle(grid, max);
        // if(firstX > 0 && piecemap[firstX][oldindex]) {
        //     console.log("REPEAT", i, shapeIndex, rock.x, oldindex);
        //     console.log(heights);
        //     break;
        // }

        // let diffs = heights.map((x, index, arry) => index == 0 ? x : x - arry[index-1])
        // if(diffs.length > 0 && arrayEqual(diffs.slice(0, Math.floor(diffs.length/2)), diffs.slice(Math.floor(diffs.length/2)))) {
        //     console.log(heights.slice(0, Math.floor(diffs.length/2)))
        //     break;
        // }
        if(i > 400) {
            console.log(printGrid(grid, null, 0, 400));
            break;
        }
        heights.push(max-1);
        if(i == 0) firstX = rock.x;
        piecemap[shapeIndex*5+rock.x][oldindex] = true;
        shapeIndex = (shapeIndex + 1) % shapes.length;
    }
    // console.log(i);
    return rocks/i;

}


const rocks = 1_000_000_000_000
// let exampleResult = part1(exampleData, 2022);
// console.log(exampleResult);
// assert(exampleResult == 3068, "")
// console.log(part1(data, 2022));

let exampleResult2 = part2(exampleData, rocks);
console.log(exampleResult2);
// assert(exampleResult2 == 1514285714288, "part2 example");