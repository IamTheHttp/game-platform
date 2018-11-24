import React from 'react';
import {render} from 'react-dom';
import 'index.scss';

import GameCanvas from 'lib/GameCanvas/GameCanvas';

/**
 *  TODO
 *  1. Document GameCanvas properly
 *  2. OnClick in mainView - Handle click detection against rects
 *  3. Document we only support squares and circles
 *  4. Move handleMapMouseUp to be the same function, it's currently duplicated
 *  5. We need to draw the select box selection on the canvas itself
 *  6. Add a background layer as a third canvas
 *  7. Provide some basic SCSS that can be imported
 *  8. Remove ALL TODOs and REFACTORS
 *  9. Finalize tests
 *  10. Performance tests
 *  11. Do we want the grid as part of the GameCanvas?
 */


/**
 * Features
 * 1. Main Canvas and MiniMap canvas
 * 2. Auto draw of mini map square
 * 3. Auto draw of selection box
 * 4. Auto event binding for mouse move, mouse click on both canvases.
 * 5. Hit detection against circles in the Main Canvas(when clicking or tapping)
 *
 */

let gameCanvas = new GameCanvas({
  mapHeight: 4000,
  mapWidth : 4000,
  viewHeight : 400,
  viewWidth : 400,
  onViewMapClick : (...args) => {
    console.log('On View Map Click', args);
    // should we get all the elements that were clicked here?
    // I think we should, to be fair...
  },
  onViewMapMove : (...args) => {
    // in case you want to know about movement?
  }
  // onMiniMapClick : (...args) => {
  //   console.log('On Mini Map Click', args);
  // }
});

let apis = {};
let mainMap = gameCanvas.generateMapCanvas((API) => {
  apis.main = API;
});

let miniMap = gameCanvas.generateMiniMapCanvas((API) => {
  apis.mini = API;
});

render(<div>
  {mainMap}
  {miniMap}
</div>, document.getElementById('app'), () => {
  apis.main.addCircle({
    id: 'ROFL',
    x:50,
    y: 50,
    radius: 15,
    strokeStyle: 'red'
  });

  setInterval(() => {
    apis.main.draw();
    apis.mini.draw();
  }, 16);
});