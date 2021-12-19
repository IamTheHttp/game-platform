import {IMouseClickInterface} from "./lib/interfaces";

const imgURL = require('./planet.png');

import *  as React from 'react';
import {render} from 'react-dom';
import './index.scss';
import Engine from "./lib/Engine/Engine";
import {Painter} from "./lib/PainterAPI/Painter";
import GameCanvas from "./lib/GameCanvas/GameCanvas";


let gameCanvas = new GameCanvas({
  // The mapHeight/width determine the size of the map,
  // while viewHeight/width determine the size visible on the screen.
  // these are not CSS attributes, but rather canvas html properties
  // The library uses viewHeight for the main view, and mapWidth for the minimap
  mapHeight: 4000, // in pixels
  mapWidth: 4000, // in pixels
  viewHeight: 400, // this is the what you actually see in the canvas
  viewWidth: 400, // this is the what you actually see in the canvas
  enableSelectBox: true,
  onMiniMapClick: () => {
  },
  onMiniMapMove: () => {
  },
  onViewMapClick: (mouseClickInfo) => {
    let mouseClickInfoInterface:IMouseClickInterface = {
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

interface Foo {
  a: number;
  b: Painter;
}

let apis: {
  main: Painter;
  mini: Painter
} = {
  main: null,
  mini: null
}
// these functions return React Element instances
// their callback provides a way to access the internal Canvas API
let mainMap = gameCanvas.generateMapCanvas((API, el) => {
  apis.main = API;
});

let miniMap = gameCanvas.generateMiniMapCanvas((API, el) => {
  apis.mini = API;
});

// Unfortunate, as we can only expose the APIs once the canvas ctx exists
// but we also can't have the canvas ctx until we render


// We render our new canvas react elements with React
render(
  <div>
    <h1>Main Map</h1>
    <div className='main-canvas-container'>
      {mainMap}
    </div>
    <h1>Mini Map - Click to move around the map</h1>
    {miniMap}
  </div>,
  document.getElementById('app'), () => {
    apis.main.addLayer('background');


    /** ================================
     ==========ADDING SHAPES===========
     ================================= */

    apis.main.drawRect({
      fillColor: null,
      layerName: "initial",
      lineWidth: 1,
      id: 'SomeRect', // Must be Unique, as a Map is used internally
      x: 10,
      y: 15,
      width: 20,
      height: 35,
      strokeStyle: 'blue'
    });

    apis.main.drawRect({
      fillColor: null, lineWidth: 1,
      id: 'SomeRectBackground', // Must be Unique, as a Map is used internally
      x: 10,
      y: 15,
      width: 20,
      height: 35,
      strokeStyle: 'blue',
      layerName: 'background'
    });

    apis.main.drawCircle({
      id: 'ExampleID',
      x: 50,
      y: 50,
      radius: 15,
      color: 'red'
    });

    apis.main.drawTextBubble({
      id: 'bubbleTextExampleID',
      text: 'It is dangerous to go alone! \ntake this!',
      backgroundColor: 'green',
      borderColor: 'orange',
      borderWidth: 3,
      fontColor: 'purple',
      x: 200,
      y: 200,
      height: 0, // the minimum value is the text value within!
      width: 0, // the minimum value is the text value within!
      fontSize: 16
    });

    apis.main.drawCircle({
      id: 'ExampleID222', // needs to be unique per layer?
      x: 0,
      y: 0,
      radius: 15,
      lineWidth: 50,
      color: 'black',
      fillColor: 'red',
      layerName: 'background'
    });

    apis.main.addShape({
      id: '0 to 45deg',
      render: (ctx: CanvasRenderingContext2D) => {
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
      render: (ctx) => {
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


    /** ================================
     ==========DEFINING IMAGE==========
     =================================*/

    let img = new Image;
    img.src = imgURL;
    img.onload = () => {
      apis.main.drawImage({
        id: 'my-image',
        image: img, // the image to display
        x: 100, y: 100, // pos for x,y..
        height: 100, width: 100,
        cropStartX: 0, cropStartY: 0, cropSizeX: img.width, cropSizeY: img.height,
        rotation: 0.2 // in radians
      });
    };

    // in a game, you usually render in a loop, the API supports it by having deterministic draws

    /** ================================
     ==========DEFINING ENGINE==========
     =================================*/
    let eng = new Engine();
    let direction = 0;

    eng.addSystem((systemArgs) => {
      direction = direction + 0.01;
      apis.main.drawAllShapesInLayer();
      apis.main.drawAllShapesInLayer('background');
      // apis.mini.draw();
    });
    eng.run({});
  });


// apis.main.draw('background');
// apis.main.remove('ExampleID222', 'background');


console.log(apis.main);