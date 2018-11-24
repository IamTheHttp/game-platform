/**
 * Private utility function to detect if a point is inside a circle
 * @param x
 * @param y
 * @param centerX
 * @param centerY
 * @param radius
 * @return {boolean}
 */
function isPosInsideCircle(x, y, centerX, centerY, radius) {
  return Math.pow((x - centerX), 2) + Math.pow((y - centerY), 2) < Math.pow(radius, 2);
}


/**
 * Function used for getting all shapes hit from a single click (not from a selection box)
 */
function getShapesFromClick(shapes, x, y) {
  let hits = [];

  shapes.forEach((shape, id) => {
    let shapeMetaData = shape.metaData;
    let shapeX      = shapeMetaData.x;
    let shapeY      = shapeMetaData.y;
    let radius = shapeMetaData.radius;
    let type   = shapeMetaData.type;

    if (type === 'circle' && isPosInsideCircle(x, y, shapeX, shapeY, radius)) {
      hits.push(id);
    } else {
      console.log('UNKNOWN SHAPE, CANNOT SELECT'); // TODO remove or implement this part
    }
  });

  return hits;
}



export default getShapesFromClick;