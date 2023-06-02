### 19/12/2021
Release version **3.0.0**
- Refactor(CanvasAPI): Rename to Painter (new Painter())
- Feature(Painter): Added event hooks into CanvasAPI allowing it to receive an initial canvas  

### 02/08/2021
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

### 29/10/2019
Release version **0.3.1:**
- Moved the RAF in Engine, now RAF will be queued first before an system runs, this will enable systems to cancel the frame
### 29/10/2019
Release version **0.3.0:**
- Moved all layerName arguments into the objects for all functions (for functions that accept Objects)
- Added a drawTextBubble() text function
- Added click detection(for click and select box) against rect shapes (it was only circles)\
- Added tests for click detection against rect\
- onViewMapMove/click and onMinimapMove/click are now optional callbacks\
- Add hit detection against Images\
- Add configuration to disable selection box (options.enableSelectBox = false)\
- Added documentation to how writeBubble works\
- Updated docs that hit detection only works on 'initial' layer\

---
### 24/10/2019
Release version **0.2.1**   
- Added the addArc() method which enables drawing arcs.
---
### 22/10/2019
Release version **0.2.0**   
- Added an Engine class to encapsulate rAF loop (start, stop, addSystem).
---
### 17/10/2019
Release version **0.1.2**   
- Added the ability to remove a layer (canvasAPI.removeLayer(name))
---
### 03/10/2019 
Release version **0.1.1**   
- Added onMiniMapClick and onMiniMapView  
 ---
### 03/10/2019 
Release version **0.1.0**   
- Added support for Layers.  
- To use layers:  
  - the canvas element must be positioned in a container element.   
  - The container element must be positioned absolute with a set height and width
  - The canvas elements must be positioned absolute (To enable layering) 
---

### 02/10/2019 
Release version **0.0.9**   
- Updated JARB to 3.0.6  
- Updated Canvas to 2.6.0 and removed canvas prebuilt.  
- These changes now enable support for node 12.x
  
---
### 15/02/2019###  
Release version **0.0.8**   
- Updated JARB to 2.0.0-beta.2

---
### 09/01/2019
Release version **0.0.7**   
- Fix ObjectPool.generate(amount) to generate UP TO $amount of free objects
---
### 06/01/2019  
- Updated jarb to 1.0.8
---
### 27/12/2018
Release version **0.0.6**  
- Ensure React is not bundled in the dist file  
- Document all exported properties  
- Remove ALL TODOs and REFACTORS  
---
