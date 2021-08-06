# Roadmap
[ ] Provide some basic SCSS that can be imported\
[ ] Add a Game Grid to the common utilities\
[ ] Add hit detection against rotated rects/images (currently only leveled rects are supported)\
[ ] Create real objects for mouseMoveDataInterface to make the interface easier to document\
[ ] Add docs for the canvasAPI as a stand alone
---
#Changelog
### 06/08/2022
Release version **2.1.2**
- Fix(Regression) - Any shape that accepts strokeStyle will now also accepts color as an alias

### 02/08/2022
Release version **2.1.1**
- Update all dependencies to latest 

### 31/07/2021
Release version **2.1.0**
- Refactor(build): Remove JARB and rollup dependency
- Fix(General): Fix all implicit any issues with typescript
- Breaking(CanvasAPI): Change function name from drawFn to render when adding a generic shape (canvasAPI.addShape).  

### 31/07/2021
Release version **2.0.0**
- Change build to rollup (Starting migration away from jarb)

### 14/11/2019
Release version **0.4.0:**
- Added click detection against all layers
- Clicking on the Canvas will now return an array of objects with ID and layerName
- Added color param for addCircle()
- Fixed bugs related to click-hit not working

###29/10/2019
Release version **0.3.1:**
- Moved the RAF in Engine, now RAF will be queued first before an system runs, this will enable systems to cancel the frame
###29/10/2019
Release version **0.3.0:**
- Moved all layerName arguments into the objects for all functions (for functions that accept Objects)
- Added a writeBubble() text function
- Added click detection(for click and select box) against rect shapes (it was only circles)\
- Added tests for click detection against rect\
- onViewMapMove/click and onMinimapMove/click are now optional callbacks\
- Add hit detection against Images\
- Add configuration to disable selection box (options.enableSelectBox = false)\
- Added documentation to how writeBubble works\
- Updated docs that hit detection only works on 'initial' layer\

---
###24/10/2019
Release version **0.2.1**   
- Added the addArc() method which enables drawing arcs.
---
###22/10/2019
Release version **0.2.0**   
- Added an Engine class to encapsulate rAF loop (start, stop, addSystem).
---
###17/10/2019
Release version **0.1.2**   
- Added the ability to remove a layer (canvasAPI.removeLayer(name))
---
###03/10/2019 
Release version **0.1.1**   
- Added onMiniMapClick and onMiniMapView  
 ---
###03/10/2019 
Release version **0.1.0**   
- Added support for Layers.  
- To use layers:  
  - the canvas element must be positioned in a container element.   
  - The container element must be positioned absolute with a set height and width
  - The canvas elements must be positioned absolute (To enable layering) 
---

###02/10/2019 
Release version **0.0.9**   
- Updated JARB to 3.0.6  
- Updated Canvas to 2.6.0 and removed canvas prebuilt.  
- These changes now enable support for node 12.x
  
---
###15/02/2019###  
Release version **0.0.8**   
- Updated JARB to 2.0.0-beta.2

---
###09/01/2019
Release version **0.0.7**   
- Fix ObjectPool.generate(amount) to generate UP TO $amount of free objects
---
###06/01/2019  
- Updated jarb to 1.0.8
---
###27/12/2018
Release version **0.0.6**  
- Ensure React is not bundled in the dist file  
- Document all exported properties  
- Remove ALL TODOs and REFACTORS  
---

#Features
- Engine
- CanvasAPI that can be initialized with 2d ctx
- (React) Game Canvas (Both Main Map and Mini Map) with click detection on what shape was clicked
- ECS Entity
- Utility to loop over entities
- Object Pool utility to pre-create and manage instances of objects



### Usage - Engine

```javascript

import {Engine} from 'game-platform/dist';
let engine = new Engine();

engine.addSystem((systemArguments) => {
   // run any system you want, order specified by order of insertion  
});

engine.addSystem((systemArguments) => {
   // run any system you want, order specified by order of insertion  
});


let systemArguments = {
  // object that is passed to all systems
  // alternatively it can also be a function that returns the object
  // in case of a function, it's evaluated every frame, so keep it light!
}

engine.run(systemArguments); // runs in a loop
  
engine.stop(); // stops the loop completely
```

### Usage - Game Canvas
```javascript

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
  selectedBoxColor: 'blue', // the color for the current selection box of the user
  enableSelectBox: true, // defaults to true, can be set to false to disable the click->drag select box
  onViewMapClick : (...args) => {
    let clickDataInterface = {
      // The library only detects hits against circles, rects and images, it ignores all other shapes
      // rects and images are calculated without orientation (rotation)
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
  {mainMap}
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
  
  
  apis.main.writeBubble({
    id: 'bubbleTextExampleID',
    text: 'It is dangerous to go alone! \ntake this!',
    backgroundColor: 'green',
    borderColor:'orange',
    borderWidth: 3,
    fontColor: 'purple',
    x: 200,
    y: 200,
    height:0, // the minimum value is the text value within
    width:0, // the minimum value is the text value within
    fontSize: 16
  });

  // in a game, you usually render in a loop, the API supports it by having deterministic draws
  setInterval(() => {
    // Once we have all our shapes in place, we use the internal CanvasAPI to draw them
    // Internally this deletes the entire canvas, and re-renders all the shapes.
    apis.main.draw();
    apis.mini.draw();
  }, 16);
});
```

### Usage - ECS
```javascript
  import Entity from 'lib/ECS/Entity';
  it('Creates a new entity', () => {
    let e = new Entity();
    expect(e.id).not.toBeUndefined();
    expect(e.components).toEqual({});
  });

  it('Adds and removes components', () => {
    let e = new Entity();
    let comp = {name:'test', foo:'bar'};
    e.addComponent(comp);
    expect(e.components.test).toBe(comp);
    e.removeComponent(comp);
    expect(e.components.test).toBeUndefined();
  });

  it('Tests the hasComponent method', () => {
    let e = new Entity();
    let comp1 = {name:'test1', foo:'bar'};
    e.addComponent(comp1);
    let comp2 = {name:'test2', foo:'bar'};
    e.addComponent(comp2);

    expect(e.hasComponents('test1')).toBe(true);
    expect(e.hasComponents(['test1'])).toBe(true);
    expect(e.hasComponents(['test1', 'test2'])).toBe(true);
    expect(e.hasComponents(['anotherComp'])).toBe(false);
    expect(e.hasComponents('anotherComp')).toBe(false);
    expect(e.hasComponents()).toBe(true);
  });

  it('Entity can destroy itself', () => {
    let e = new Entity();
    let comp1 = {name:'test1', foo:'bar'};

    e.addComponent(comp1);
    // always returns a collection
    expect(Entity.getByComps(['test1'])[0]).toBe(e);

    e.destroy();
    expect(Entity.entities[e.id]).toBeUndefined();

    let resp = Entity.getByComps(['test1']);
    expect(resp.length).toBe(0);
  });
```

### Usage - The EntityLoop
```javascript
  import entityLoop from 'lib/ECS/util/entityLoop';
  import Entity from 'lib/ECS/Entity';

  it ('Loops on Entity arrays', () => {
    let foo = new Entity();

    foo.addComponent({
      name : 'lol'
    });

    let runs = 0;
    let ents = entityLoop(Entity.getByComps('lol'), (ent) => {
      runs++;
      expect(ent).not.toBeUndefined();
      return true;
    });

    expect(ents.length).toBe(1);
    expect(runs).toBe(1);
  });
```


### Usage - The Object Pool
```javascript
  import ObjectPool from 'lib/ObjectPool/ObjectPool';

  // Define what type of pool you'd like to make
  beforeEach(() => {
    class Foo {
      constructor() {
        this.isAlive = true;
      }
    }
    // if you try to acquire an object when the pool is empty, this will create more instances on the fly
    let incrementWhenEmpty = 100;
    pool = new ObjectPool(Foo, incrementWhenEmpty);
  });

  it('Acquires an object instance', () => {
    pool.generate(100);
    let obj = pool.acquire();
    expect(obj.isAlive).toBe(true);
    expect(pool.stats.free).toBe(99);
  });

  // the pool exposes the following stats
  pool.stats = {
      free: 0,
      used: 0,
      total: 0
    };
```