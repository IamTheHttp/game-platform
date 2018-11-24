/**
 * given a grid, and an X/Y, get the block of that position,
 * returns false if grid does not exist
 * @param grid
 * @param x
 * @param y
 * @returns {boolean}
 */
function getGridBlockFromPos(grid, x, y) {
  let topLeftAreaY = grid[0][0].topLeftY;
  let topLeftAreaX = grid[0][0].topLeftX;

  // get the grid row/col for this X/Y pos..
  let distFromTop = y - topLeftAreaY;
  let distFromLeft = x - topLeftAreaX;

  let row = Math.floor(distFromTop / grid.squareY);
  let col = Math.floor(distFromLeft / grid.squareY);
  let gridExists = grid[row] && grid[row][col];
  return gridExists ? grid[row][col] : false;
}

export default getGridBlockFromPos;