import getGridBlockFromPos from 'shared/mapPlacement/getGridBlockFromPos';

/**
 * Given an X, Y and radius, we get he start and end block
 * functio is UNSAFE, startGridBlock and endGridBlock can be false if out of bounds
 * @param x
 * @param y
 * @param radius
 * @param grid
 * @returns {{startGridBlock: *, endGridBlock: *}}
 */
function getBlocksFromPos(x, y, radius, grid) {
  let topLeftX =  x - radius;
  let topLeftY =  y - radius;

  let bottomRightX =  x + radius;
  let bottomRightY =  y + radius;

  let startGridBlock = getGridBlockFromPos(grid, topLeftX, topLeftY);
  let endGridBlock = getGridBlockFromPos(grid, bottomRightX, bottomRightY);

  return {startGridBlock, endGridBlock};
}

export default getBlocksFromPos;