import { describe, expect, test } from "@jest/globals";
import { smoke_test } from "../src/smoke";

describe("Smoke Test Block", () => {
    test("Smoke Test", () => {
        let result = smoke_test("Who knocks at the garden gate?");
        expect(result).toEqual("One who has eaten the fruit and tasted its mysteries.");
    });
})
