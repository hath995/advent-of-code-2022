import { assert } from 'console';
import fs from 'fs';

const dataString = fs.readFileSync("./input.txt",{encoding:"utf8"});
const data = parseInput(dataString)

const exampleString = fs.readFileSync("./example.txt",{encoding:"utf8"});
const exampleData = parseInput(exampleString);

const bigexampleString = fs.readFileSync("./bigexample.txt",{encoding:"utf8"});
const bigexampleData = parseInput(bigexampleString);

type direction = "U" | "D" | "L" | "R";
type Step = {
    direction: direction,
    count: number
}
function parseInput(s: string): Step[] {
    return s.split("\n").filter(x => x.length).map((x): Step => {
        let [direction, count] = x.split(" ") as [direction, string];
        return {
            direction,
            count: parseInt(count)
        }
    })
}
type Position = [x: number, y: number];
function left(pos: Position): Position {
    return [pos[0]-1, pos[1]];
}

function right(pos: Position): Position {
    return [pos[0]+1, pos[1]];
}

function up(pos: Position): Position {
    return [pos[0], pos[1]+1];
}

function down(pos: Position): Position {
    return [pos[0], pos[1]-1];
}

function pos([x,y]: Position): string {
    return `${x},${y}`;
}

function dist([x1, y1]: Position, [x2, y2]: Position): number {
    return Math.sqrt(Math.pow(x1-x2, 2)+Math.pow(y1-y2,2))
}

function stepHead(pos: Position, direction:direction): Position {
    switch(direction) {
        case "D":
            return down(pos);
        case "U":
            return up(pos);
        case "R":
            return right(pos);
        case "L":
            return left(pos);
    }
}

function stepTail(tail: Position, head: Position): Position {
    let result = tail;
    if(head[0] - tail[0] < 0) {
        result = left(tail);
    }else if(head[0] - tail[0] > 0) {
        result = right(tail);
    }

    if(head[1] - tail[1] < 0) {
        result = down(result);
    }else if(head[1] - tail[1] > 0) {
        result = up(result);
    }
    return result;
}

function part1(data: Step[]): number {
    let head: Position = [0,0];
    let tail: Position = [0,0];
    let tailPositions: Set<string> = new Set([pos(tail)]);
    for(let step of data) {
        for(let i = 0; i < step.count; i++) {
            head = stepHead(head, step.direction);
            if(dist(head, tail) >= 2) {
                tail = stepTail(tail, head);
                tailPositions.add(pos(tail));
            }
        } 
    }

    return tailPositions.size;
}

function part2(data: Step[]): number {
    let knots: Position[] = new Array(10);
    knots.fill([0, 0]);
    let tailPositions: Set<string> = new Set([pos([0,0])]);

    for (let step of data) {
        for (let i = 0; i < step.count; i++) {
            knots[0] = stepHead(knots[0], step.direction);
            for (let k = 1; k < 10; k++) {
                if (dist(knots[k - 1], knots[k]) >= 2) {
                    knots[k] = stepTail(knots[k], knots[k - 1]);
                }
            }
            tailPositions.add(pos(knots[9]));
        }
    }
    return tailPositions.size;
}

console.log(part1(exampleData));
console.log(part1(data));

console.log(part2(exampleData));
console.log(part2(bigexampleData));
console.log(part2(data));

