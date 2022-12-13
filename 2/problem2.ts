import { assert } from 'console';

import fs from 'fs';

type OpHand = "A" | "B" | "C";
type MyHand = "X" | "Y" | "Z"
function parseInput(s: string): [OpHand, MyHand][] {
    return s.split("\n").filter(x => x.length !== 0).map((x): [OpHand, MyHand] => x.split(" ") as [OpHand, MyHand])
}

const dataString = fs.readFileSync("./input.txt",{encoding:"utf8"});
const data = parseInput(dataString)

const exampleString = fs.readFileSync("./example.txt",{encoding:"utf8"});
const exampleData = parseInput(exampleString);

const opHand: {[key in OpHand]: Hands} = {
    "A": "rock",
    "B": "paper",
    "C": "scissors"
}

const myHand: {[key in MyHand]: Hands} = {
    "X": "rock",
    "Y": "paper",
    "Z": "scissors"
}

class Relation<A,B> {
    constructor(public elements: Set<[A,B]>, public isEqual: (left: [A, B], right: [A, B]) => boolean = (left, right) => left[0] == right[0] && left[1] == right[1]) {
    }

    has(element: [A,B]): boolean {
        for(let elem of this.elements) {
            if(this.isEqual(element, elem)) {
                return true;
            }
        }
        return false;
    }

    beginsWith(part: A): [A,B] | undefined {
        for(let elem of this.elements) {
            if(part == elem[0]) {
                return elem;
            }
        }
    }

    endsWith(part: B): [A,B] | undefined {
        for(let elem of this.elements) {
            if(part == elem[1]) {
                return elem;
            }
        }
    }
}

const shapeScore: {[key in Hands]: number} = {
    "rock": 1,
    "paper": 2,
    "scissors": 3
}

type Hands = "rock" | "paper" | "scissors";
var HandSet = new Set<Hands>(["rock","paper","scissors"]);
var RPS = new Relation(new Set<[Hands, Hands]>([["rock","paper"], ["paper", "scissors"], ["scissors","rock"]]));

function part1(data: [OpHand, MyHand][]): number {

    return data.reduce((total, round, index, arry) => {
        let score:number = shapeScore[myHand[round[1]]];
        if (RPS.has([opHand[round[0]], myHand[round[1]]])) {
            return score + 6 + total;
        } else if (RPS.has([myHand[round[1]], opHand[round[0]]])) {
            return score + total;
        } else {
            return score + 3 + total;
        }
    }, 0);
}

assert(part1(exampleData) == 15);
console.log(part1(exampleData))

console.log("data part1", part1(data));

function toResult(hand: OpHand, r: MyResult): Hands {
    if(r === "Y") { //tie
        return opHand[hand];
    }else if(r === "X") { //loss
        return RPS.endsWith(opHand[hand])![0];
    }else { //win
        return RPS.beginsWith(opHand[hand])![1];
    }
}

type MyResult = "X" | "Y" | "Z"
let resultScore: {[key in MyResult]: number} = {
    "X": 0,
    "Y": 3,
    "Z": 6
}
function part2(data: [OpHand, MyResult][]): number {
    return data.reduce((total, round) => {
        let choice = toResult(round[0], round[1])
        let score = shapeScore[choice];
        return total + score + resultScore[round[1]];
    }, 0);
}

assert(part2(exampleData) == 12);
console.log("part 2", part2(data));