import fs from "node:fs"
import readline from "node:readline"

export class LineReader {
  /**
   * Creates a readline interface for reading a file.
   *
   * @param {fs.PathLike} path - The path of the file to read.
   * @param {BufferEncoding} [encoding=utf8] - The encoding of the file. Defaults to "utf8".
   * @return {readline.Interface} The readline interface for reading the file.
   */
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

  /**
   * Creates a LineReader object for reading lines from a file.
   *
   * @param {fs.PathLike} path - The path of the file to read.
   * @param {BufferEncoding} encoding - The encoding to use when reading the file. Default is "utf8".
   * @return {Object} An object with methods for reading lines from the file.
   *   - `hasNextLine`: A function that returns `true` if there is another line to read, `false` otherwise.
   *   - `nextLine`: An async function that reads the next line from the file and returns it.
   *   - `close`: A function that closes the LineReader and stops reading lines from the file.
   */
  static create(path: fs.PathLike, encoding: BufferEncoding = "utf8") {
    let EOF = false
    const RLI = LineReader.createReadLineInterface(path, encoding)

    async function nextLine<Output>(fn?: (value: string) => Output): Promise<Output | string | undefined> {
      if (EOF) return undefined
      const line = await RLI[Symbol.asyncIterator]().next()
      const value = line.value as string

      return typeof fn === "function" ? fn(value) : value
    }

    RLI.once("close", () => { EOF = true })

    return {
      hasNextLine: () => !EOF,
      nextLine: nextLine,
      /** Manually closes the LineReader by calling the `close` method */
      close: () => RLI.close()
    }
  }
}