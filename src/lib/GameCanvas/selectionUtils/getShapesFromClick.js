import isPosInsideCircle from './isPosInsideCircle';


/**
 * Function used for getting all shapes hit from a single click (not from a selection box)
 */
function getShapesFromClick(shapes, x, y) {
  let hits = [];

  shapes.forEach((shape, id) => {
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
      hits.push(id);
    } else if (type === 'rect' || type === 'image') {
      if (x >= shapeX && x <= shapeX + width && y >= shapeY && y <= shapeY + height) {
        hits.push(id);
        // do nothing, no support for non circles
      }
    } else if (type !== 'circle') {

    }
  });

  return hits;
}

export default getShapesFromClick;