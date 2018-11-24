function getShapesInSelectionBox(shapes, selectedData) {
  let minX = Math.min(selectedData.start.x, selectedData.end.x);
  let maxX = Math.max(selectedData.start.x, selectedData.end.x);
  let minY = Math.min(selectedData.start.y, selectedData.end.y);
  let maxY = Math.max(selectedData.start.y, selectedData.end.y);


  let hits = [];
  shapes.forEach((shape, id) => {
    let shapeMetaData = shape.metaData;
    let shapeX      = shapeMetaData.x;
    let shapeY      = shapeMetaData.y;
    let type   = shapeMetaData.type;

    if (type === 'circle') {
      let centerX = shapeX;
      let centerY = shapeY;
      if (centerX >= minX && centerX <= maxX && centerY >= minY && centerY <= maxY) {
        hits.push(id);
      }
    } else {
      console.log(`Unimplemented shape ${type} , CANNOT SELECT`); // TODO remove or implement this part
    }
  });

  return hits;
}

export default getShapesInSelectionBox;