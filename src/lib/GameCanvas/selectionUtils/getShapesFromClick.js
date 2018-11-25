import isPosInsideCircle from './isPosInsideCircle';


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
    } else if (type !== 'circle') {
      console.log(`Unimplemented shape ${type} , CANNOT SELECT`); // TODO remove or implement this part
    }
  });

  return hits;
}

export default getShapesFromClick;