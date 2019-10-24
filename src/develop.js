import React from 'react';
import {render} from 'react-dom';
import './index.scss';

import GameCanvas from 'lib/GameCanvas/GameCanvas';
import Engine from 'lib/Engine/Engine';


let gameCanvas = new GameCanvas({
  // The mapHeight/width determine the size of the map,
  // while viewHeight/width determine the size visible on the screen.
  // these are not CSS attributes, but rather canvas html properties
  // The library uses viewHeight for the main view, and mapWidth for the minimap
  mapHeight: 4000, // in pixels
  mapWidth: 4000, // in pixels
  viewHeight: 400, // this is the what you actually see in the canvas
  viewWidth: 400, // this is the what you actually see in the canvas
  onMiniMapClick: () => {
  },
  onMiniMapMove: () => {
  },
  onViewMapClick: (...args) => {
    let mouseMoveDataInterface = {
      // The library only detects hits against circles, it ignores all other shapes
      // you can implement your own click detection system
      hits: [], // array of shape IDs that were clicked on
      dbClick: true, // BOOL, true or false
      isMouseDown: true, // BOOL, true or false
      // Information about the currently selected area (when you select an area with your mouse)
      // if mouse is not held down(no selection), these numbers will be set to 0
      selectedBox: {
        start: {
          x: 10,
          y: 0
        },
        end: {
          x: 110,
          y: 75
        },
        height: 75,
        width: 100
      }
    };
  },
  onViewMapMove: (mouseMoveData) => {
    let mouseMoveDataInterface = {
      dbClick: true, // BOOL, true or false
      isMouseDown: true, // BOOL, true or false
      // Information about the currently selected area (when you select an area with your mouse)
      // if mouse is not held down(no selection), these numbers will be set to 0
      selectedBox: {
        start: {
          x: 10,
          y: 0
        },
        end: {
          x: 110,
          y: 75
        },
        height: 75,
        width: 100
      }
    };
  }
});

let apis = {};
// these functions return React Element instances
// their callback provides a way to access the internal Canvas API
let mainMap = gameCanvas.generateMapCanvas((API) => {
  apis.main = API;
});

let miniMap = gameCanvas.generateMiniMapCanvas((API) => {
  apis.mini = API;
});

// Unfortunate, as we can only expose the APIs once the canvas ctx exists
// but we also can't have the canvas ctx until we render


// We render our new canvas react elements with React
render(<div>
  <h1>Main Map</h1>
  <div className='main-canvas-container'>
    {mainMap}
  </div>
  <h1>Mini Map - Click to move around the map</h1>
  {miniMap}
</div>, document.getElementById('app'), () => {
  apis.main.addRect({
    id: 'SomeRect', // Must be Unique, as a Map is used internally
    x: 10,
    y: 15,
    width: 20,
    height: 35,
    strokeStyle: 'blue'
  });

  apis.main.addCircle({
    id: 'ExampleID',
    x: 50,
    y: 50,
    radius: 15,
    strokeStyle: 'red'
  });

  let img = new Image;
  img.src = 'https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png';
  img.onload = () => {
    apis.main.addImage({
      id: 'my-image',
      image: img, // the image to display
      x: 100, y: 100, // pos for x,y..
      height: 100, width: 100,
      cropStartX: 0, cropStartY: 0, cropSizeX: img.width, cropSizeY: img.height,
      rotation: 0.2 // in radians
    });
  };

  // in a game, you usually render in a loop, the API supports it by having deterministic draws

  let eng = new Engine();
  let direction = 0;

  eng.addSystem(() => {
    direction = direction + 0.01;
    apis.main.addArc({
      direction,
      size: 0.75,
      x: 100,
      y: 100,
      radius: 100
    });

    apis.main.draw();
    apis.mini.draw();
  });

  // implements request animation frame internally
  eng.run({});
});

// all elements are absolute positioned.
apis.main.addLayer('background');

apis.main.addCircle({
  id: 'ExampleID222', // needs to be unique per layer?
  x: 0,
  y: 0,
  radius: 15,
  strokeStyle: 'red'
}, 'background');

apis.main.draw('background');
apis.main.remove('ExampleID222', 'background');


apis.main.addShape({
  id: '0 to 45deg',
  drawFn: (ctx) => {
    ctx.strokeStyle = 'green';
    ctx.lineWidth = 1;

    let radius = 100;
    let x = 100;
    let y = 100;
    ctx.beginPath();
    ctx.arc(x, y, radius, Math.PI * 0.0, Math.PI * 0.5);
    ctx.stroke();
    ctx.closePath();
  }
});

apis.main.addShape({
  id: '0 to 180',
  drawFn: (ctx) => {
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 1;

    let radius = 90;
    let x = 100;
    let y = 100;
    ctx.beginPath();
    ctx.arc(x, y, radius, Math.PI * 0.5, Math.PI);
    ctx.stroke();
    ctx.closePath();
  }
});


console.log(apis.main);