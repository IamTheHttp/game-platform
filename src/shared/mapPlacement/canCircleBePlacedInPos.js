import getBlocksFromPos from 'shared/mapPlacement/getBlocksFromPos';
import isBlockRangeOccupied from 'shared/mapPlacement/isBlockRangeOccupied';

/**
 * Checks if a circle can be placed in the grid in a specific coordinate.
 * function is SAFE - checks if position is not out of bounds and is not occupied
 * @param x
 * @param y
 * @param radius
 * @param grid
 * @returns {boolean}
 */
function canCircleBePlacedInPos(x, y, radius, grid) {
  let {startGridBlock, endGridBlock} = getBlocksFromPos(x, y, radius, grid);

  // if we're out of bounds,
  if (!endGridBlock || !startGridBlock) {
    return false;
  }

  return !isBlockRangeOccupied(startGridBlock, endGridBlock, grid);
}
export default canCircleBePlacedInPos;