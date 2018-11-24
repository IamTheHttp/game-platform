import entityPlacer from 'shared/mapPlacement/entityPlacer';
import createGrid from 'shared/mapPlacement/grid';

const PX_PER_SQUARE = 10;
let placeEntities = (entities, area, buffer) => {
  let {topLeftAreaX, topLeftAreaY, bottomRightAreaX, bottomRightAreaY} = area;

  let squaresInLine = Math.floor((bottomRightAreaX - topLeftAreaX) / PX_PER_SQUARE);
  let grid = createGrid(area, squaresInLine); // squares in line

  entityPlacer(entities, grid, buffer);
  return grid;
};


export default placeEntities;