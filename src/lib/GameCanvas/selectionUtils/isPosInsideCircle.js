/**
 * Utility function to detect if a point is inside a circle
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

export default isPosInsideCircle;