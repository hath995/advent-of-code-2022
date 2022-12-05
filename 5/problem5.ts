
import { assert } from 'console';
import fs from 'fs';
type Instruction = {count: number, src: number, dest: number};
function parseInput(s: string) {
    let [stackstring, ins] = s.split("\n\n");
    let stacks: string[][] = [];
    let indexes: number[] = [];

    let ss = stackstring.split("\n");
    let stacknames: string = ss.pop()!;
    const indexer = /\d/g;
    let me: RegExpExecArray | null = null;
    while((me = indexer.exec(stacknames)) !== null) {
        stacks.push([]);
        indexes.push(me.index);
    }
    for(let i = ss.length-1; i >= 0; i--) {
        for(let k = 0; k < indexes.length; k++) {
            if(/[A-Z]/.test(ss[i][indexes[k]])) {
                stacks[k].push(ss[i][indexes[k]]);
            }
        }
    }
    
    const inssplitter = /move (\d+) from (\d+) to (\d+)/;
    let instructions: Instruction[] = ins.split("\n").filter(x => x.length != 0).map(inss => {
        let parts = inssplitter.exec(inss)!;
        return {
            count: parseInt(parts[1]),
            src: parseInt(parts[2])-1,
            dest: parseInt(parts[3])-1
        } 
    })

    return {stacks, instructions}; 
}

const dataString = fs.readFileSync("./input.txt",{encoding:"utf8"});
const data = parseInput(dataString)

const exampleString = fs.readFileSync("./example.txt",{encoding:"utf8"});
const exampleData = parseInput(exampleString);

console.log(exampleData);

function part1(data: {stacks: string[][], instructions: Instruction[]}): string {
    for(let instruction of data.instructions) {
        for(let i = 0; i < instruction.count; i++) {
            data.stacks[instruction.dest].push(data.stacks[instruction.src].pop()!);
        }
    }
    let result = "";
    for(let stack of data.stacks) {
        let top = stack.pop();
        if(top) {
            result += top;
        }
    }
    return result;
}
// console.log(part1(exampleData));
// console.log(part1(data));

function part2(data: {stacks: string[][], instructions: Instruction[]}): string {
    for(let instruction of data.instructions) {
        let tempstack = [];
        for(let i = 0; i < instruction.count; i++) {
            tempstack.push(data.stacks[instruction.src].pop()!);
        }
        while(tempstack.length > 0) {
            data.stacks[instruction.dest].push(tempstack.pop()!);
        }
    }
    let result = "";
    for(let stack of data.stacks) {
        let top = stack.pop();
        if(top) {
            result += top;
        }
    }
    return result;
}


console.log(part2(exampleData));
console.log(part2(data));