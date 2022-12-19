import { assert } from 'console';
import fs from 'fs';

type Price = [ore: number, clay: number, obsidian: number, geode: number];
type Material = "ore" | "clay" | "obsidian" | "geode"; 
type Blueprint = {
    material: Material,
    cost: Price
}
const materialIndex: {[key: string]: keyof Price} = {
    "ore": 0,
    "clay": 1,
    "obsidian": 2,
    "geode": 3
}
const parser = /Each (\w+) robot costs (\d+) (ore|clay|obsidian)( and (\d+) (ore|clay|obsidian))?\./g
function parseInput(s: string): Blueprint[][] {
    return s.trim().split("\n").map(line => {
        let bps: Blueprint[] = [];
        let priceParsed: RegExpExecArray | null = null;
        while((priceParsed = parser.exec(line)) !== null) {
            let material = priceParsed[1] as Material;
            let cost: Price = [0,0,0,0];
            // @ts-ignore
            cost[materialIndex[priceParsed[3]]] = parseInt(priceParsed[2]);
            if(priceParsed[4]) {
                // @ts-ignore
                cost[materialIndex[priceParsed[6]]] = parseInt(priceParsed[5]);
            }
            let bp = {
                material,
                cost 
            }

            bps.push(bp);
        }

        return bps;
    })
}

const dataString = fs.readFileSync("./input.txt",{encoding:"utf8"});
const data = parseInput(dataString)

const exampleString = fs.readFileSync("./example.txt",{encoding:"utf8"});
const exampleData = parseInput(exampleString);
console.log(JSON.stringify(exampleData, null, 2))

function canAfford(bp: Blueprint, material: Price): boolean {
    return bp.cost.every((cost, index) => material[index] >= cost);
}

function subtract([ro, rc, rob, rge]: Price, [o, c, ob, ge]: Price): Price {
    return [o - ro, c - rc, ob - rob, ge - rge];
}


function add([ro, rc, rob, rge]: Price, [o, c, ob, ge]: Price): Price {
    return [o + ro, c + rc, ob + rob, ge + rge];
}

function *collectResourcs(bp: Blueprint[], robots: Price, materials: Price, time: number): IterableIterator<Price> {
    if(time == 0) {
        yield materials;
        return;
    }

    let mm = add(materials, robots);
    if(canAfford(bp[3], materials)) {
        let nrobots: Price = [...robots];
        nrobots[3]+=1;
        yield * collectResourcs(bp, nrobots, subtract(bp[3].cost, mm), time - 1)
    }else{
        let couldBuy = false;
        for(let i = 0; i < 3; i++) {
            if(canAfford(bp[i], mm)) {
                couldBuy = true;
                let nrobots: Price = [...robots];
                nrobots[i]+=1;
                yield * collectResourcs(bp, nrobots, subtract(bp[i].cost, mm), time-1);
            }
        }
        if(!couldBuy) {
            yield * collectResourcs(bp, robots, mm, time - 1);
        }
    }

}

function part1(data: Blueprint[][]): number {

    let things = data.map(blueprint => Array.from(collectResourcs(blueprint,[1,0,0,0],[0,0,0,0], 24)).sort((a,b) => a[3]-b[3]).pop() );
    console.log(things)
    return 0
}

let exampleResult = part1(exampleData);
console.log(exampleResult);
assert(exampleResult == 33, "example");