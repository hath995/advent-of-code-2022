import { assert } from 'console';
import fs from 'fs';
import FullSet from './fullset';

function parseInput(s: string): [string, string][] {
    return s.split("\n").filter(x => x.length > 0).map(rucksacks => [rucksacks.slice(0,rucksacks.length/2), rucksacks.slice(rucksacks.length/2)])
}

const dataString = fs.readFileSync("./input.txt",{encoding:"utf8"});
const data = parseInput(dataString)

const exampleString = fs.readFileSync("./example.txt",{encoding:"utf8"});
const exampleData = parseInput(exampleString);
console.log(exampleData);


function part1(input: [string, string][]): number {

    return input.reduce((score, rucksacks) => {
        let common: FullSet<string> = (new FullSet(...rucksacks[0].split(""))).intersect(new FullSet(...rucksacks[1].split("")))
        console.log(common);
        let priority = 0;
        for(let item of common) {
            if(item.charCodeAt(0) >= 97) {
                priority += item.charCodeAt(0) - 96;
            }else{
                priority += item.charCodeAt(0) - 64+26;
            }
        }
        return score + priority;
    },0)
}

function part2(input: [string, string][]): number {
    let result = 0;
    for(let i = 0; i < input.length; i += 3) {
        let sets = [];
        for(let k = 0; k < 3; k++) {
            sets.push(new FullSet(...(input[i+k][0]+input[i+k][1]).split("")));
        }
        let common = sets[0].intersect(sets[1]).intersect(sets[2]);
        let priority = 0;
        for(let item of common) {
            if(item.charCodeAt(0) >= 97) {
                priority += item.charCodeAt(0) - 96;
            }else{
                priority += item.charCodeAt(0) - 64+26;
            }
        }
        result += priority;
    }
    return result;
}
console.log(part1(exampleData));
console.log(part1(data));
console.log(part2(exampleData));
console.log(part2(data));