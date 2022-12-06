import { assert } from 'console';
import fs from 'fs';

function parseInput(s: string): string[] {
    return s.split("\n").filter(x => x.length > 0);
}

const dataString = fs.readFileSync("./input.txt",{encoding:"utf8"});
const data = parseInput(dataString)

const exampleString = fs.readFileSync("./example.txt",{encoding:"utf8"});
const exampleData = parseInput(exampleString);

const WindowSize = 14;
function part1(data: string[]): number[] {
    return data.map(signal => {
        let window: string[] = [];
        let found = -1;
        for(let i = 0; i < signal.length; i++) {
            if(i < WindowSize) {
                window.push(signal[i]);
            }else if((new Set(window)).size == WindowSize ){
                found = i;
                break;
            }else{
                window.shift()
                window.push(signal[i]);
            }
        }
        return found;
    })
}

console.log(part1(exampleData));
console.log(part1(data));