import { assert } from 'console';
import fs from 'fs';

type File = {kind: "file", size: number, name: string};
type Command = {kind: "cd", name: string} | {kind: "ls"};
type Content = {kind: "directory", name: string} | File;
type IO = Command | Content;
const isCD = /\$ cd ([/.a-z]+)/;
const isLS = /\$ ls/;
const isDirectory = /dir (\w+)/;
const isFile = /(\d+) ([a-z.]+)/;
function parseInput(s: string): IO[] {
    return s.split("\n").filter(x => x.length > 0).map((input): IO => {
        if(isCD.test(input)) {
            let cd = isCD.exec(input)!;
            return {
                kind: "cd",
                name: cd[1]
            }
        }else if(isLS.test(input)) {
            return {
                kind: "ls"
            }
        }else if(isDirectory.test(input)) {
            let dir = isDirectory.exec(input)!;
            return {
                kind: "directory",
                name: dir[1]
            }
        }else if(isFile.test(input)) {
            let file = isFile.exec(input)!;
            return {
                kind: "file",
                size: parseInt(file[1]),
                name: file[2]
            }
        }
        throw new Error("Encountered bad input: " + input);
    })
}

const dataString = fs.readFileSync("./input.txt",{encoding:"utf8"});
const data = parseInput(dataString)

const exampleString = fs.readFileSync("./example.txt",{encoding:"utf8"});
const exampleData = parseInput(exampleString);

//console.log(exampleData);

class Directory {
    kind: "Dir"
    size: number;
    constructor(public name: string, public parent: Directory | null, public contents: (File | Directory)[] = []) {
        this.kind = "Dir";
        this.size = 0;
    }

    setSizes() {
        for(let content of this.contents) {
            if(content.kind == "Dir") {
                content.setSizes();
            }
            this.size += content.size;
        }
    }

    filter(fn: (dir: Directory) => boolean): Directory[] {
        return this.contents.flatMap(x => {
            if(x.kind == "file") {
                return [];
            }else{
                return x.filter(fn);
            }
        }).concat(fn(this) ? [this] : [])
    }
}

function setupDirectories(data: IO[]): Directory {
    let Root = new Directory("/", null);
    let focus = Root;
    for(let io of data) {
        assert(focus !== undefined, "focus was undefined");
        switch(io.kind) {
            case "cd":
                if(io.name == "..") {
                    focus = focus.parent!;
                }else if(io.name == "/") {
                    focus = Root;
                }else {
                    let oldfocus = focus;
                    //@ts-ignore
                    focus = focus.contents.find(x => x.kind == "Dir" && x.name == io.name);
                    if(focus == undefined) {
                        console.log(io, oldfocus);
                        console.log(JSON.stringify(Root,(key, value) => key == "parent" ? undefined : value,2));
                        throw new Error("Focus was undefined");
                    }
                }
            break;
            case "ls":
            break;
            case "directory":
                focus.contents.push(new Directory(io.name, focus));
            break;
            case "file":
                focus.contents.push(io);
            break;
        }
    }
    Root.setSizes();
    return Root;
}

function part1(data: IO[]): number {
    let Root = setupDirectories(data); 
    return Root.filter(x => x.size <= 100_000).reduce((total, elem) => total + elem.size, 0);
}

const FS_MAX = 70000000;
const FS_MIN = 30000000;
function part2(data: IO[]): number {
    let Root = setupDirectories(data);
    let unused = FS_MAX - Root.size;
    let deletable = Root.filter(x => unused+x.size > FS_MIN);
    deletable.sort((a,b) => a.size - b.size);
    return deletable[0].size
}
let exampleResult = part1(exampleData);
console.log(exampleResult);

let result = part1(data);
console.log(result);

let exampleResult2 = part2(exampleData);
console.log(exampleResult2);

let result2 = part2(data);
console.log(result2);