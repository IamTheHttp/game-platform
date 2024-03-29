import isPosInsideCircle from './isPosInsideCircle';
import {IHit, IShapes} from '../../interfaces';

/**
 * Function used for getting all shapes hit from a single click (not from a selection box)
 */
function getShapesFromClick(shapes: IShapes, layerName: string, x: number, y: number) {
  let hits: IHit[] = [];

  shapes.forEach((shape, id: string) => {
    if (id === 'selectedBox') {
      return;
    }
    let shapeMetaData = shape.metaData || {};
    let shapeX = shapeMetaData.x;
    let shapeY = shapeMetaData.y;
    let radius = shapeMetaData.radius;
    let width = shapeMetaData.width;
    let height = shapeMetaData.height;
    let type = shapeMetaData.type;

    if (type === 'circle' && isPosInsideCircle(x, y, shapeX, shapeY, radius)) {
      hits.push({
        id,
        layerName
      });
    } else if (type === 'rect' || type === 'image') {
      if (x >= shapeX && x <= shapeX + width && y >= shapeY && y <= shapeY + height) {
        hits.push({
          id,
          layerName
        });
        // do nothing, no support for non circles
      }
    } else if (type !== 'circle') {
    }
  });

  return hits;
}

export default getShapesFromClick;
