import { assert } from 'console';
import fs, { cp } from 'fs';


type Instructions  = {kind: "noop"} | {kind: "addx", x: number};
const noop = /noop/;
const addx = /addx ([-0-9]+)/;
function parseInput(s: string): Instructions[] {
    return s.split("\n").filter(x => x.length > 0).map(ins => {
        if(noop.test(ins)) {
            return {
                kind: "noop"
            }
        }else{
            let add = addx.exec(ins)!;
            return {
                kind: "addx",
                x: parseInt(add[1])
            }
        }
    })
}

const dataString = fs.readFileSync("./input.txt",{encoding:"utf8"});
const data = parseInput(dataString)

const exampleString = fs.readFileSync("./example.txt",{encoding:"utf8"});
const exampleData = parseInput(exampleString);

function scan<From, To>(arry: From[], reducerFn: (accum: To, current: From, index: number, arry: From[]) => To, initial: To): To[] {
    let accum = initial;
    return arry.map((current, index, arry) => {
        accum = reducerFn(accum, current, index, arry);
        return accum;
    })
}

type Cpu = {clock: number, X: number};

function executeInstructions(data: Instructions[]): Cpu[] {
    let cpu: Cpu = {
        clock: 1,
        X: 1
    }
    return [cpu].concat(scan(data, ({X, clock}: Cpu, current): Cpu => {
        switch(current.kind) {
            case "noop":
                return {
                    clock: clock + 1,
                    X
                }
            case "addx":
                return {
                    clock: clock + 2,
                    X: X + current.x
                }
        }
    }, cpu));

}

function part1(data: Instructions[]): number {
    let steps = executeInstructions(data);
    let result = 0;
    let index = 0;
    for(let cycles = 20; cycles <= 220; cycles += 40) {
        let cpu = steps[index];
        for(let i = index; i < steps.length; i++) {
            if(steps[i].clock > cycles || cpu.clock == cycles) {
                break;
            }
            cpu = steps[i];
            index = i;
        }
        result += cycles * cpu.X;
    }
    // console.log(steps);
    return result;
}

let exampleResult = part1(exampleData)
assert(exampleResult == 13140, "should be the sum of the cycles");
console.log(exampleResult);

console.log(part1(data));
const SCREEN_HEIGHT = 6;
const SCREEN_WIDTH = 40;
function part2(ins: Instructions[]): string {
    let cpuSteps = executeInstructions(ins);
    let cycle = 1;
    let result = "";
    let cpu = cpuSteps[0];
    let cpuIndex = 0;
    for(let line = 0; line < SCREEN_HEIGHT; line++) {
        for(let i = 0; i < SCREEN_WIDTH; i++) {
            if(i >= cpu.X-1 && i <= cpu.X+1) {
                result += "#";
            }else{
                result += ".";
            }
            cycle++;
            if(cycle >= cpuSteps[cpuIndex+1].clock) {
                cpuIndex++;
                cpu = cpuSteps[cpuIndex];
            }
        }
        result += "\n";
    }
    return result;
}

let exampleRender = part2(exampleData);
console.log(exampleRender);
let exampleAnswer = `##..##..##..##..##..##..##..##..##..##..
###...###...###...###...###...###...###.
####....####....####....####....####....
#####.....#####.....#####.....#####.....
######......######......######......####
#######.......#######.......#######.....
`;
assert(exampleAnswer === exampleRender, "should render the same");
console.log(part2(data));