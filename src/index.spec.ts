import prettier from "prettier";
import * as fs from "fs";
import * as path from "path";


describe('test plugin', () => {
  it("should format file", () => {
    const input = fs.readFileSync(path.resolve(__dirname, "../test/example.ts"), "utf-8")
    const expected = fs.readFileSync(path.resolve(__dirname, "../test/formatted.ts"), "utf-8")

    const actual = prettier.format(input, {
      filepath: path.resolve(__dirname, "../test/example.ts"),
      singleQuote: true,
      plugins: [path.resolve(__dirname, "")],
    });
    expect(actual).toEqual(expected)
  })
})