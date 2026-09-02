import { describe, expect, it } from "vitest";
import { changeFontSize } from "./fontSize";

describe("font size controls", () => {
  it("decreases from the default size to small", () => {
    expect(changeFontSize("normal", "decrease")).toBe("small");
  });

  it("increases one step at a time", () => {
    expect(changeFontSize("small", "increase")).toBe("normal");
    expect(changeFontSize("normal", "increase")).toBe("large");
    expect(changeFontSize("large", "increase")).toBe("xlarge");
  });

  it("stops at the minimum and maximum sizes", () => {
    expect(changeFontSize("small", "decrease")).toBe("small");
    expect(changeFontSize("xlarge", "increase")).toBe("xlarge");
  });
});
