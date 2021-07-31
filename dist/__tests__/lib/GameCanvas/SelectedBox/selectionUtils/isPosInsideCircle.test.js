import isPosInsideCircle from "../../../../../src/lib/GameCanvas/selectionUtils/isPosInsideCircle";
describe('is a position inside a circle tests', function () {
    it('works', function () {
        expect(isPosInsideCircle(10, 10, 5, 5, 6)).toBe(false);
        expect(isPosInsideCircle(5, 10, 5, 5, 6)).toBe(true);
        expect(isPosInsideCircle(10, 5, 5, 5, 6)).toBe(true);
        expect(isPosInsideCircle(10, 10, 5, 5, 100)).toBe(true);
        expect(isPosInsideCircle(1, 1, 0, 0, 1)).toBe(false);
        expect(isPosInsideCircle(1, 0, 0, 0, 1)).toBe(false); // paremeter is not inside, so false
        expect(isPosInsideCircle(0, 0, 0, 0, 1)).toBe(true);
    });
});
