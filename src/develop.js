import React from 'react';
import {render} from 'react-dom';
import 'index.scss';

import GameCanvas from 'lib/GameCanvas/GameCanvas';


let gameCanvas = new GameCanvas({
  // The mapHeight/width determine the size of the map,
  // while viewHeight/width determine the size visible on the screen.
  // these are not CSS attributes, but rather canvas html properties
  // The library uses viewHeight for the main view, and mapWidth for the minimap
  mapHeight: 4000, // in pixels
  mapWidth : 4000, // in pixels
  viewHeight : 400, // this is the what you actually see in the canvas
  viewWidth : 400, // this is the what you actually see in the canvas
  onViewMapClick : (...args) => {
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
          x:10,
          y:0
        },
        end: {
          x:110,
          y:75
        },
        height: 75,
        width: 100
      }
    };
  },
  onViewMapMove : (mouseMoveData) => {
    let mouseMoveDataInterface = {
      dbClick: true, // BOOL, true or false
      isMouseDown: true, // BOOL, true or false
      // Information about the currently selected area (when you select an area with your mouse)
      // if mouse is not held down(no selection), these numbers will be set to 0
      selectedBox: {
        start: {
          x:10,
          y:0
        },
        end: {
          x:110,
          y:75
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

// Unfortunate, as we can only expose the APIs once the canvas context exists
// but we also can't have the canvas context until we render


// We render our new canvas react elements with React
render(<div>
  <h1>Main Map</h1>
  {mainMap}
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
    x:50,
    y: 50,
    radius: 15,
    strokeStyle: 'red'
  });

  let img = new Image;
  img.src = 'https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png';
  img.onload = () => {
    apis.main.addImage({
      id : 'my-image',
      image:img, // the image to display
      x: 100, y: 100, // pos for x,y..
      height: 100, width: 100,
      cropStartX:0, cropStartY:0, cropSizeX:img.width, cropSizeY:img.height,
      rotation : 0.2 // in radians
    });
  };

  // in a game, you usually render in a loop, the API supports it by having deterministic draws
  setInterval(() => {
    // Once we have all our shapes in place, we use the internal CanvasAPI to draw them
    // Internally this deletes the entire canvas, and re-renders all the shapes.
    apis.main.draw();
    apis.mini.draw();
  }, 16);
});









