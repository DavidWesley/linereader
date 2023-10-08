import fs from "node:fs"
import readline from "node:readline"

export class LineReader {
  static createReadLineInterface(path: fs.PathLike, encoding: BufferEncoding = "utf8"): readline.Interface {
    return readline.createInterface({
      input: fs.createReadStream(path, {
        encoding: encoding,
        flags: "r",
        emitClose: true,
        autoClose: true
      }),
      crlfDelay: Infinity,
      terminal: false
    })
  }

  static create(path: fs.PathLike, encoding: BufferEncoding = "utf8") {
    let EOF = false
    const RLI = LineReader.createReadLineInterface(path, encoding)

    const nextLine = async <Output>(fn?: (value: string) => Output): Promise<Output | string | undefined> => {
      if (EOF) return undefined
      const line = await RLI[Symbol.asyncIterator]().next()
      const value = line.value as string

      return typeof fn === "function" ? fn(value) : value
    }

    RLI.once("close", () => { EOF = true })

    return {
      hasNextLine: () => !EOF,
      nextLine: nextLine,
      close: () => RLI.close()
    }
  }
}