const createLookupObject = require("../db/seeds/utils");

describe("createLookupObject", () => {
  test("returns an empty object when passed an empty array", () => {
    expect(createLookupObject([], "", "")).toEqual({});
  });
  test("returns an object with a single-key value pair when passed an array containing a single object", () => {
    const input = [{ name: "Nomi", age: "30" }];
    const output = { Nomi: "30" };
    expect(createLookupObject(input, "name", "age")).toEqual(output);
  });
  test("returns an object with multiple key-value pairs when passed an array containing multiple objects", () => {
    const input = [
      { name: "Nomi", age: "29" },
      { name: "Harry", age: "34" },
      { name: "Jenn", age: "35" },
    ];
    const output = { Nomi: "29", Harry: "34", Jenn: "35" };
    expect(createLookupObject(input, "name", "age")).toEqual(output);
  });
});
