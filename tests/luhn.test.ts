import { isValidLuhn } from "../src/validators/luhn";

describe("isValidLuhn", () => {
  it("returns true for a known-valid Visa test number", () => {
    expect(isValidLuhn("4111111111111111")).toBe(true);
  });

  it("returns true for a known-valid Mastercard test number", () => {
    expect(isValidLuhn("5500000000000004")).toBe(true);
  });

  it("returns false for a number with a single digit altered", () => {
    // Last digit changed from 1 to 2, breaking the checksum.
    expect(isValidLuhn("4111111111111112")).toBe(false);
  });

  it("returns true for a single valid digit (0)", () => {
    expect(isValidLuhn("0")).toBe(true);
  });

  it("returns false for an all-zero-but-one number that breaks the checksum", () => {
    expect(isValidLuhn("1")).toBe(false);
  });
});
