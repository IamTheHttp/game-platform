/**
 * Generates a grid for the map.
 *
 * @param area (topLeftAreaX, topLeftAreaY, bottomRightAreaX, bottomRightAreaY)
 * @param squaresInLine
 * @returns {Array} (A grid is array of rows with arrays of cols, with some extra attributes :
 * squareY, squareX, xLen, yLen
 */
function createGrid(area, squaresInLine) {
  let {topLeftAreaX, topLeftAreaY, bottomRightAreaX, bottomRightAreaY} = area;
  let grid = [];

  let xLen = bottomRightAreaX - topLeftAreaX; // 1920
  let yLen = bottomRightAreaY - topLeftAreaY; // 1080

  let squareLength = Math.floor(xLen / squaresInLine); // 1920 / 192 = 10

  let row = 0;
  let remainingY = yLen;

  while (remainingY >= squareLength) {
    grid[row] = [];
    let col = 0;
    let remainingX = xLen;

    while (remainingX >= squareLength) {
      remainingX -= squareLength;
      grid[row][col] = {
        topLeftX : topLeftAreaX + squareLength * col,
        topLeftY : topLeftAreaY + squareLength * row,
        row,
        col,
        occupied : false
      };
      col++;
    }
    row++;
    remainingY -= squareLength;
  }

  grid.squareX = squareLength;
  grid.squareY = squareLength;
  grid.xLen = xLen;
  grid.yLen = yLen;

  return grid;
}

export default createGrid;