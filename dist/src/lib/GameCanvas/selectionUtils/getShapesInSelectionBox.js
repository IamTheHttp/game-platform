function getShapesInSelectionBox(shapes, layerName, selectedData) {
    var minX = Math.min(selectedData.start.x, selectedData.end.x);
    var maxX = Math.max(selectedData.start.x, selectedData.end.x);
    var minY = Math.min(selectedData.start.y, selectedData.end.y);
    var maxY = Math.max(selectedData.start.y, selectedData.end.y);
    var hits = [];
    shapes.forEach(function (shape, id) {
        if (id === 'selectedBox') {
            return;
        }
        var shapeMetaData = shape.metaData || {};
        var shapeX = shapeMetaData.x;
        var shapeY = shapeMetaData.y;
        var radius = shapeMetaData.radius;
        var width = shapeMetaData.width;
        var height = shapeMetaData.height;
        var type = shapeMetaData.type;
        if (type === 'circle') {
            var centerX = shapeX;
            var centerY = shapeY;
            if (centerX >= minX && centerX <= maxX && centerY >= minY && centerY <= maxY) {
                hits.push({
                    id: id,
                    layerName: layerName
                });
            }
        }
        else if (type === 'rect' || type === 'image') {
            // what is considered the 'centerX' for a rect?
            var centerX = shapeX + width / 2;
            var centerY = shapeY + height / 2;
            if (centerX >= minX && centerX <= maxX && centerY >= minY && centerY <= maxY) {
                hits.push({
                    id: id,
                    layerName: layerName
                });
            }
        }
        else {
            // do nothing, no support for non circles or rects
        }
    });
    return hits;
}
export default getShapesInSelectionBox;
