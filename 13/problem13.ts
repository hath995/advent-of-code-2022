import { assert } from 'console';
import fs from 'fs';

type RecList = number | number[] | RecList[]
function parseInput(s: string): [RecList, RecList][] {
   return s.split("\n\n").map((pairString): [RecList, RecList] => pairString.split("\n").filter(x => x.length > 0).map(pair => JSON.parse(pair) as RecList) as [RecList, RecList]); 
}


const dataString = fs.readFileSync("./input.txt",{encoding:"utf8"});
const data = parseInput(dataString)

const exampleString = fs.readFileSync("./example.txt",{encoding:"utf8"});
const exampleData = parseInput(exampleString);

function compare(left: RecList, right: RecList): number {
    if(typeof left == "number" && typeof right == "number") {
        return left < right? -1 : left > right ? 1 : 0;
    }
    if(typeof left == "number" && Array.isArray(right)) {
        return compare([left], right);
    }

    if(typeof right == "number" && Array.isArray(left)) {
        return compare(left, [right]);
    }
    if(Array.isArray(left) && Array.isArray(right)) {
        for(let i = 0; i < left.length; i++) {
            let order = compare(left[i], right[i]);
            if(order !== 0) {
                return order;
            }
        }
        return left.length < right.length ? -1 : left.length > right.length ? 1 : 0;
    }
    return 0;
}

function part1(data: [RecList, RecList][]): number {
    let correct = 0;
    for(let i = 0; i < data.length; i++) {
        let [left, right] = data[i];
        if(compare(left,right) == -1) correct += i+1;
    }
    return correct;
}


let exampleResult = part1(exampleData);
console.log(exampleResult);
assert(exampleResult == 13, "correct pairs should be 13");

let result = part1(data);
console.log(result);

function findDivder(num: number): (x: RecList, index: number, ary: RecList[]) => boolean {
    return val => {
        return Array.isArray(val) && 
        val.length == 1 &&
        Array.isArray(val[0]) &&
        val[0].length == 1 &&
        val[0][0] == num
    }
}

function part2(data: [RecList, RecList][]): number {
    let packets = data.flat();
    packets.push([[2]],[[6]])
    packets.sort(compare);
    let dividerIndex = packets.findIndex(findDivder(2))+1; 
    let dividerIndex2 = packets.findIndex(findDivder(6))+1; 
    return dividerIndex * dividerIndex2
}

let exampleResult2 = part2(exampleData);
console.log(exampleResult2);
assert(exampleResult2 == 140);

console.log(part2(data));