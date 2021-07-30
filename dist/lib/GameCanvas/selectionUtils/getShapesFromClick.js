import isPosInsideCircle from './isPosInsideCircle';
/**
 * Function used for getting all shapes hit from a single click (not from a selection box)
 */
function getShapesFromClick(shapes, layerName, x, y) {
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
        if (type === 'circle' && isPosInsideCircle(x, y, shapeX, shapeY, radius)) {
            hits.push({
                id: id,
                layerName: layerName
            });
        }
        else if (type === 'rect' || type === 'image') {
            if (x >= shapeX && x <= shapeX + width && y >= shapeY && y <= shapeY + height) {
                hits.push({
                    id: id,
                    layerName: layerName
                });
                // do nothing, no support for non circles
            }
        }
        else if (type !== 'circle') {
        }
    });
    return hits;
}
export default getShapesFromClick;
