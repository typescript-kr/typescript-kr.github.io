import * as fs from "fs";
import * as glob from "glob";
//------------------------------------------------------------------------------
// Commons
//------------------------------------------------------------------------------

type Listener<T extends string, D> = {
    [K in T]?: (data: D) => void
}

class Emitter <T extends string, D> {
    private listeners: Listener<T, D>[] = [];
    constructor(listeners: Listener<T, D>[]) {
        this.listeners = listeners;
    }
    emit(type: T, data: D) {
        this.listeners.forEach(listener => listener[type]?.(data));
    }
}

type Data = { filename: string, text: string, line: number, col?: number }

enum Node {
    Char = "Char",
    Line = "Line"
}

function print(filename: string, message: string) {
    console.log("\x1b[35m", `${filename}-` ,"\x1b[36m", `${message}`, "\x1b[0m");
}

type Report = { filename: string, message: string };
type Context = { reports: Report[] };

const context: Context = {
  reports: []
};


//------------------------------------------------------------------------------
// Rule Definitions
//------------------------------------------------------------------------------

/**
 * 출력될 수 없는 문자가 있는지 검사합니다.
 */
function checkNonPrintableChar(): Listener<Node, Data> {
    const NON_PRINTABLE_CHAR_CODES = [0x1B, 0x1C, 0x8];
    return {
        [Node.Char]({ filename, text: char, line, col = 0 }) {
            const charCode = char.charCodeAt(0);
            if (NON_PRINTABLE_CHAR_CODES.includes(char.charCodeAt(0))) {
                context.reports.push({
                  filename,
                  message: `출력할 수 없는 문자 ${charCode} 가 있습니다. (${line}:${col})`
                });
            }
        }
    }
}

//------------------------------------------------------------------------------
// Setup Rules
//------------------------------------------------------------------------------
const rules = [
    checkNonPrintableChar(),
];

//------------------------------------------------------------------------------
// Runner
//------------------------------------------------------------------------------
(function run([, , pattern], rules) {
    const filenames = glob.sync(pattern, { ignore: "**/node_modules/**" });
    const emitter = new Emitter<Node, Data>(rules);
    filenames.forEach(filename => {
        fs.readFile(`${process.cwd()}/${filename}`, "utf8", (err, file) => {
            if (err) {
                throw new Error(err.message);
            }
            const lines = file.split("\n");
            lines.forEach((text, line) => {
                emitter.emit(Node.Line, ({ filename, text, line }));
                [...text].forEach((char, col) => emitter.emit(Node.Char, ({filename, text: char, line, col })));
            });
        });
    });

    if (context.reports.length) {
      context.reports.forEach(({ filename, message }) => print(filename, message));
      process.exit(1);
    }
})(process.argv, rules);

