import React from 'react';
import {render} from 'react-dom';
import 'index.scss';

import GameCanvas from 'lib/GameCanvas/GameCanvas';

/**
 *  TODO
 *  1. Document GameCanvas properly
 *  2. OnClick in mainView - Handle click detection against rects and circles
 *  3. Document we only support squares and circles
 *  4. Move handleMapMouseUp to be the same function, it's currently duplicated
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
    console.log('On View Map Mouse Move', args);
  }
  // onMiniMapClick : (...args) => {
  //   console.log('On Mini Map Click', args);
  // }
});

let mainMap = gameCanvas.generateMapCanvas((API) => {
  console.log('Main Map Done');
  API.addRect({
    id:'foo',
    x:50,
    y:50,
    width:100,
    height:100,
    strokeStyle: 'green',
    lineWidth:3
  });

  API.addRect({
    id:'bar',
    x:150,
    y:150,
    width:100,
    height:100,
    strokeStyle: 'red',
    lineWidth:3
  });

  API.draw();
});

let miniMap = gameCanvas.generateMiniMapCanvas((API) => {
  // setInterval(() => {
  //   API.draw();
  // }, 16);
});

render(<div>
  {mainMap}
  {miniMap}
</div>, document.getElementById('app'));


