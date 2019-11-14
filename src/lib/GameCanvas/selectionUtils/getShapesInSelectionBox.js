function getShapesInSelectionBox(shapes, layerName, selectedData) {
  let minX = Math.min(selectedData.start.x, selectedData.end.x);
  let maxX = Math.max(selectedData.start.x, selectedData.end.x);
  let minY = Math.min(selectedData.start.y, selectedData.end.y);
  let maxY = Math.max(selectedData.start.y, selectedData.end.y);


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

    if (type === 'circle') {
      let centerX = shapeX;
      let centerY = shapeY;
      if (centerX >= minX && centerX <= maxX && centerY >= minY && centerY <= maxY) {
        hits.push({
          id,
          layerName
        });
      }
    } else if (type === 'rect' || type === 'image') {
      // what is considered the 'centerX' for a rect?
      let centerX = shapeX + width / 2;
      let centerY = shapeY + height / 2;

      if (centerX >= minX && centerX <= maxX && centerY >= minY && centerY <= maxY) {
        hits.push({
          id,
          layerName
        });
      }
    } else {
      // do nothing, no support for non circles or rects
    }
  });

  return hits;
}

export default getShapesInSelectionBox;