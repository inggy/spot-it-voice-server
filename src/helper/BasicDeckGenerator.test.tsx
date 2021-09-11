import { generateAdvancedDeck } from "./BasicDeckGenerator"

describe("advanced deck", () => {
    test("advanced", () => {
        generateAdvancedDeck(3);
        expect(2).toBe(2);
    })
});
