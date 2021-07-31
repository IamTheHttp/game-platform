var imgURL = require('./planet.png');
import * as React from 'react';
import { render } from 'react-dom';
import './index.scss';
import Engine from "./lib/Engine/Engine";
import GameCanvas from "./lib/GameCanvas/GameCanvas";
var gameCanvas = new GameCanvas({
    // The mapHeight/width determine the size of the map,
    // while viewHeight/width determine the size visible on the screen.
    // these are not CSS attributes, but rather canvas html properties
    // The library uses viewHeight for the main view, and mapWidth for the minimap
    mapHeight: 4000,
    mapWidth: 4000,
    viewHeight: 400,
    viewWidth: 400,
    enableSelectBox: true,
    onMiniMapClick: function () {
    },
    onMiniMapMove: function () {
    },
    onViewMapClick: function (mouseClickInfo) {
        var mouseClickInfoInterface = {
            // The library only detects hits against circles, it ignores all other shapes
            // you can implement your own click detection system
            hits: [],
            dbClick: true,
            isMouseDown: true,
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
    onViewMapMove: function (mouseMoveData) {
        var mouseMoveDataInterface = {
            dbClick: true,
            isMouseDown: true,
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
var apis = {
    main: null,
    mini: null
};
// these functions return React Element instances
// their callback provides a way to access the internal Canvas API
var mainMap = gameCanvas.generateMapCanvas(function (API, el) {
    apis.main = API;
});
var miniMap = gameCanvas.generateMiniMapCanvas(function (API, el) {
    apis.mini = API;
});
// Unfortunate, as we can only expose the APIs once the canvas ctx exists
// but we also can't have the canvas ctx until we render
// We render our new canvas react elements with React
render(React.createElement("div", null,
    React.createElement("h1", null, "Main Map"),
    React.createElement("div", { className: 'main-canvas-container' }, mainMap),
    React.createElement("h1", null, "Mini Map - Click to move around the map"),
    miniMap), document.getElementById('app'), function () {
    apis.main.addLayer('background');
    /** ================================
     ==========ADDING SHAPES===========
     ================================= */
    apis.main.addRect({
        fillColor: null,
        layerName: "initial",
        lineWidth: 1,
        id: 'SomeRect',
        x: 10,
        y: 15,
        width: 20,
        height: 35,
        strokeStyle: 'blue'
    });
    apis.main.addRect({
        fillColor: null, lineWidth: 1,
        id: 'SomeRectBackground',
        x: 10,
        y: 15,
        width: 20,
        height: 35,
        strokeStyle: 'blue',
        layerName: 'background'
    });
    apis.main.addCircle({
        id: 'ExampleID',
        x: 50,
        y: 50,
        radius: 15,
        color: 'red'
    });
    apis.main.writeBubble({
        id: 'bubbleTextExampleID',
        text: 'It is dangerous to go alone! \ntake this!',
        backgroundColor: 'green',
        borderColor: 'orange',
        borderWidth: 3,
        fontColor: 'purple',
        x: 200,
        y: 200,
        height: 0,
        width: 0,
        fontSize: 16
    });
    apis.main.addCircle({
        id: 'ExampleID222',
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
        render: function (ctx) {
            ctx.strokeStyle = 'green';
            ctx.lineWidth = 1;
            var radius = 100;
            var x = 100;
            var y = 100;
            ctx.beginPath();
            ctx.arc(x, y, radius, Math.PI * 0.0, Math.PI * 0.5);
            ctx.stroke();
            ctx.closePath();
        }
    });
    apis.main.addShape({
        id: '0 to 180',
        render: function (ctx) {
            ctx.strokeStyle = 'black';
            ctx.lineWidth = 1;
            var radius = 90;
            var x = 100;
            var y = 100;
            ctx.beginPath();
            ctx.arc(x, y, radius, Math.PI * 0.5, Math.PI);
            ctx.stroke();
            ctx.closePath();
        }
    });
    /** ================================
     ==========DEFINING IMAGE==========
     =================================*/
    var img = new Image;
    img.src = imgURL;
    img.onload = function () {
        apis.main.addImage({
            id: 'my-image',
            image: img,
            x: 100, y: 100,
            height: 100, width: 100,
            cropStartX: 0, cropStartY: 0, cropSizeX: img.width, cropSizeY: img.height,
            rotation: 0.2 // in radians
        });
    };
    // in a game, you usually render in a loop, the API supports it by having deterministic draws
    /** ================================
     ==========DEFINING ENGINE==========
     =================================*/
    var eng = new Engine();
    var direction = 0;
    eng.addSystem(function (systemArgs) {
        direction = direction + 0.01;
        apis.main.draw();
        apis.main.draw('background');
        // apis.mini.draw();
    });
    eng.run({});
});
// apis.main.draw('background');
// apis.main.remove('ExampleID222', 'background');
console.log(apis.main);
