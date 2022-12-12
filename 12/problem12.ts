import { assert } from 'console';
import fs from 'fs';
import Heap from "./heap";

function parseInput(s: string): string[][] {
    return s.split("\n").filter(x => x.length > 0).map(xs => xs.split(""))
}


const dataString = fs.readFileSync("./input.txt",{encoding:"utf8"});
const data = parseInput(dataString)

const exampleString = fs.readFileSync("./example.txt",{encoding:"utf8"});
const exampleData = parseInput(exampleString);

class Node {
	distance: number;
	predecessor?: Node;
    readonly weight: number;
	constructor(public x: number, public y: number, readonly height: number) {
		this.distance = Infinity;
        this.weight = 1;
	}
}

function relax(v: Node,u: Node, Q: Heap<Node>) {
	// console.log(`${v.x}, ${v.y}`, v.distance, u.distance + v.risk)
	if(v.distance > u.distance + v.weight) {
		v.distance = u.distance + v.weight;
		v.predecessor = u;
		Q.alterKey(u.distance + v.weight, v);
	}
}

function Dijkstra(graph: Map<Node, Node[]>, start: Node) {
	start.distance = 0;
	let Q = new Heap<Node>(Array.from(graph.keys()), (a,b) => a.distance < b.distance, (a,k)=>a);
	while(!Q.empty()) {
		let u = Q.extractTop()!;
		// console.log("BEFORE", Q.data);
		for(let vertex of graph.get(u) || []) {
			// console.log(vertex, u)
			if(Q.has(vertex)) {
				relax(vertex, u, Q);
			} 
		}
	}
}

function reconstruct(goal: Node) {
	let path = [goal];
	let current = goal;
	while(current.predecessor) {
		path.push(current.predecessor);
		current = current.predecessor;
	}
	path.reverse();
	for(let spot of path) {
		console.log(`[${spot.x},${spot.y}: ${spot.distance}, ${spot.height}]`)
	}
}

function findPos(data: string[][], target: string): [y: number, x: number] | undefined {
    for(let y = 0; y < data.length; y++) {
        for(let x = 0; x < data[y].length; x++) {
            if(data[y][x] == target) return [y,x];
        }
    }
}

function toAdjacenyList(data: string[][]): {graph: Map<Node, Node[]>, start: Node, goal: Node, heightMap: Node[][]} {
    let adjList = new Map<Node, Node[]>();
    let heightMap: Node[][] = data.map((row, y) => row.map((heightString, x): Node => {
        let height: number = heightString == "S" ? 1 : heightString == "E" ? 26 : heightString.charCodeAt(0) - 96;
        let node = new Node(x,y,height);
        return node;
    }));
    let startPos = findPos(data,"S")!;
    let goalPos = findPos(data, "E")!;
    const directions = [[1,0],[0,1],[0,-1],[-1,0]];

    for(let y = 0; y < heightMap.length; y++) {
		for(let x = 0; x < heightMap[y].length; x++) {
            let current = heightMap[y][x];
			let neighbors: Node[] = [];
			for(let dir of directions) {
				if(heightMap[y+dir[0]] && heightMap[y+dir[0]][x+dir[1]]) {
                    let neighbor = heightMap[y+dir[0]][x+dir[1]];
                    if(!(neighbor.height - current.height > 1) ) {
                        neighbors.push(neighbor);
                    }
				}
			}
			adjList.set(current, neighbors);
		}
	}
    return {
        graph: adjList,
        start: heightMap[startPos[0]][startPos[1]],
        goal: heightMap[goalPos[0]][goalPos[1]],
        heightMap
    }
}

function part1(data: string[][]) {
    let {graph, start, goal, heightMap} = toAdjacenyList(data);
    Dijkstra(graph, start);
    return goal.distance;
}

// let exampleResult = part1(exampleData);
// console.log(exampleResult);
// assert(exampleResult == 31, "distance should be 31");

// let result = part1(data);
// console.log(result);
function setStart(data: string[][], pos: [number, number]): string[][] {
    return data.map((row, y) => y === pos[0] ? row.map((char, x) => x === pos[1] ? "S" : char) : row)
}
function part2(data: string[][]): number {
    let startPos = findPos(data, "S")!;
    data[startPos[0]][startPos[1]] = "a";
    let as: [number, number][] = data.flatMap((row, y) => row.flatMap((height, x): [number, number][] => height === "a" ? [[y,x]]: []));
    let distances = as.map(pos => part1(setStart(data, pos)));
    distances.sort((a,b) => a - b);
    return distances[0];
}

// let exampleResult2 = part2(exampleData);
// console.log(exampleResult2)
// assert(exampleResult2 == 29, "min distance is 29");

let result2 = part2(data);
console.log(result2);