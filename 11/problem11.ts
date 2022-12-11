import { assert } from 'console';
import fs from 'fs';

type Operation = {kind: "const", op: "+" | "*", val: number} | {kind: "variable", op: "+" | "*"};
type Monkey = {
    items: number[],
    operation: Operation,
    test: number,
    targets: {
        true: number,
        false: number
    }
}

function parseInput(s: string): Monkey[] {
    return s.split("\n\n").map((monkeyString): Monkey => {
        let monkeyDetails = monkeyString.split("\n");
        let items: number[] = monkeyDetails[1].split(":")[1].split(",").map(itmeString => parseInt(itmeString));
        let operationDetails = /new = old (\*|\+) (old|\d+)/.exec(monkeyDetails[2])!;
        let operation: Operation = operationDetails[2] === "old" ? {kind: "variable", op: operationDetails[1] as "+"|"*"} : {kind: "const", op: operationDetails[1] as "+"|"*", val: parseInt(operationDetails[2])};
        let test = parseInt(/divisible by (\d+)/.exec(monkeyDetails[3])![1]);
        let targets = {
            true: parseInt(/throw to monkey (\d+)/.exec(monkeyDetails[4])![1]),
            false: parseInt(/throw to monkey (\d+)/.exec(monkeyDetails[5])![1])
        }
        return {
            items,
            operation,
            test,
            targets
        }
    })
}

const dataString = fs.readFileSync("./input.txt",{encoding:"utf8"});
const data = parseInput(dataString)

const exampleString = fs.readFileSync("./example.txt",{encoding:"utf8"});
const exampleData = parseInput(exampleString);

function evalOp(operation: Operation, x: number): number {
  switch (operation.kind) {
    case "variable":
      switch (operation.op) {
        case "*":
          return x * x;
        case "+":
          return x + x;
      }
    case "const":
      switch (operation.op) {
        case "*":
          return x * operation.val;
        case "+":
          return x + operation.val;
      }
  }
}

function printMonkeys(monkeys: Monkey[]) {
    for(let i =0; i < monkeys.length; i++) {
        console.log(`Monkey ${i}: ${monkeys[i].items}`);
    }
}

function part1(monkeys: Monkey[]): number {
    let monkeyActivity: number[] = new Array(monkeys.length);
    monkeyActivity.fill(0);
    // for(let round = 0; round < 20; round++) {
    for(let round = 0; round < 20; round++) {
        for(let i = 0; i < monkeys.length; i++) {
            for(let item of monkeys[i].items) {
                let worry = Math.floor(evalOp(monkeys[i].operation, item)/3);
                let target: "true" | "false" = (worry % monkeys[i].test == 0).toString() as "true" | "false";
                monkeys[monkeys[i].targets[target]].items.push(worry);
                monkeyActivity[i]++;
            }
            monkeys[i].items = [];
        }
        // console.log(`Round ${round+1}: `);
        // printMonkeys(monkeys);
    }
    monkeyActivity.sort((a,b) => a - b);
    // console.log(monkeyActivity);
    return monkeyActivity.pop()! * monkeyActivity.pop()!;
}

// let exampleMonkeyBusiness = part1(exampleData);
// console.log(exampleMonkeyBusiness)
// assert(exampleMonkeyBusiness === 10605, "should match sample");

// console.log(part1(data));

function part2(monkeys: Monkey[]): number {
    let monkeyActivity: number[] = new Array(monkeys.length);
    monkeyActivity.fill(0);
    let monkeyProduct = monkeys.reduce((acc, monkey) => acc * monkey.test, 1);
    for(let round = 0; round < 10_000; round++) {
        for(let i = 0; i < monkeys.length; i++) {
            for(let item of monkeys[i].items) {
                let worry = evalOp(monkeys[i].operation, item)%monkeyProduct;
                let target: "true" | "false" = (worry % monkeys[i].test == 0).toString() as "true" | "false";
                monkeys[monkeys[i].targets[target]].items.push(worry);
                monkeyActivity[i]++;
            }
            monkeys[i].items = [];
        }
        // console.log(`Round ${round+1}: `);
        // printMonkeys(monkeys);
    }
    monkeyActivity.sort((a,b) => a - b);
    // console.log("MonkeyA", monkeyActivity);
    return monkeyActivity.pop()! * monkeyActivity.pop()!;
}
let seriousMonkeyBusiness = part2(exampleData);
assert(seriousMonkeyBusiness === 2713310158, "serious business")

console.log(part2(data));