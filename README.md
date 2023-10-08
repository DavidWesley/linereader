# LineReader

A simple `LineReader` class, similar to Java's `readline()` method, written in Typescript (for Node) to read files line-by-line **asynchronously** and **quickly**.

## Install

```bash
# using npm
npm install @dwesley/linereader
```

## Usage

### Import

```ts
import { LineReader } from "@dwesley/linereader"
```

### Example

```ts
import { PathLike } from "node:fs"
import { EOL } from "node:os"

import { LineReader } from "@dwesley/linereader"

async function main() {
  /** could be any valid path to a readable file */
  const PATH: PathLike = "/dev/stdin"

  /** the variable value below can be any valid encoding available in the `BufferEncoding` type */
  const ENCODING: BufferEncoding = "utf8"

  /** `LineReader` instance from the file specified in `PATH` variable  */
  const lineReader = LineReader.create(PATH, ENCODING)

  const output = []
  while (lineReader.hasNextLine()) {
    const line = await lineReader.nextLine()
    output.push(line)
  }
  console.log(output.join(EOL))
}

main()
```

## API

### `LineReader.create(path: fs.PathLike, encoding: BufferEncoding = "utf8"): LineReaderInstance`

The options you can pass are:

| Name     | Type                                                                                                          | Default  | Description                                      |
| -------- | ------------------------------------------------------------------------------------------------------------- | -------- | ------------------------------------------------ |
| path     | `string \| Buffer \| URL`                                                                                     | none     | The path or location of your file **(required)** |
| encoding | `'ascii' \| 'utf8' \| 'utf-8' \| 'utf16le' \| 'ucs2' \| 'ucs-2' \| 'base64' \| 'latin1' \| 'binary' \| 'hex'` | `'utf8'` | Character encoding to use on `read()` operation  |

### Instance Methods

The methods of `LineReader` instance you can access are:

| Name        | ReturnType | Description                                                                                                      |
| ----------- | ---------- | ---------------------------------------------------------------------------------------------------------------- |
| hasNextLine | `boolean`  | A function that returns `true` if there is another line to read, or `false` if `close()` has already been called |
| nextLine    | `Promise`  | An async function that reads the next line from the file and returns it.                                         |
| close       | `void`     | A function that closes the LineReader and stops reading lines from the file.                                     |

#### `LineReaderInstance.nextLine<Output>(fn?: (value: string) => Output): Promise<Output | string | undefined>`

Asynchronously read next single line of current file stream.

Example:

```ts
const lineReader = LineReader.create("./file.txt", "utf-8")
const output = []
while (lineReader.hasNextLine()) {
  const line = await lineReader.nextLine()
  output.push(line)
}

console.log(output.join(" | "))
```

`./file.txt`

```txt
1111
2222
3333
4444
5555

7777
```

Output:

```
1111 | 2222 | 3333 | 4444 | 5555 | | 7777
```

Example with helpers:

```ts
/** Helper function that should format the current line */
const helper = (line: string = ""): number[] => {
  return line.split(",", 1e5).map((value) => Number.parseInt(value, 10))
}

const output = []
while (lineReader.hasNextLine()) {
  /**
   * Extended nextLine method for lineReader instance
   * This nextLine method uses `helper`function as proxy for return the line content
   * Its return type is inherited from helper's return type
   */
  const numbers = await lineReader.nextLine(helper)
  output.push(numbers.join("-"))
}
console.log(output.join(EOL))
```

`./using-helper.txt`

```txt
1,2,3
4
5,,7
```

Output:

```
1-2-3
4
5-NaN-7
```

#### `LineReaderInstance.close(): void`

Manually closes the LineReader by calling the `close` method.
This method will be called automatically on the last `nextLine` operation.

Example:

```ts
const lineReader = LineReader.create("./file.txt")

for (let i = 0; i < 2; i++) {
  const line = await lineReader.nextLine()
  else console.log(line)
}

if (lineReader.hasNextLine())
  lineReader.close()

console.log(await lineReader.nextLine()) // undefined
```

`./file.txt`

```txt
1
2
3
4
```

Output:

```
1
2
undefined
```

## Contribute

This is open for you to join if you can add value or benefit from this!

## License

Feel free to use this library under the conditions of the [MIT](./LICENSE) license.
