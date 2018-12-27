### Roadmap
[ ] OnClick in mainView - Handle click detection against rects
[ ] Add a background layer as a third canvas
[ ] Provide some basic SCSS that can be imported
[ ] Add a Game Grid to the common utilities
[ ] Add configuration to disable click detection
[ ] Add configuration to disable selection box


###Changelog
[V] Ensure React is not bundled in the dist file
[V] Document all exported properties
[V] Remove ALL TODOs and REFACTORS

27/12/2018

### Features
#### Game Canvas (Both Main Map and Mini Map) with click detection on what shape was clicked
#### ECS Entity
#### Utility to loop over entities
#### Object Pool utility to pre-create most requires instances

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