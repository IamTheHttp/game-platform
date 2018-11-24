import Player from 'gameEngine/entities/Player';
import EarthLike from 'gameEngine/entities/planets/EarthLike';
import Fighter from 'gameEngine/entities/Ships/Fighter';
import {getFighters} from 'gameEngine/components/HasFighters';
import {
  PLAYER_1,
  PLAYER_2,
  NEUTRAL,
  CANVAS_X,
  CANVAS_Y,
  PLAYER_PLANET_GUTTER_DISTANCE,
  PLANETS_IN_MAP,
  PLANET_BUFFER,
  DEFAULT_FIGHTER_COUNT
} from 'gameEngine/constants';
import gameConfig from 'gameEngine/config';
import placeEntities from 'shared/placementUtil';

export function randFromRange(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

export function randFromArray(array) {
  return array[Math.floor(Math.random() * array.length)];
}

// we manually add planets at the end of the drawing, for the player positions
const MANUALLY_ADDED_PLANETS = 2;
export function generateMap(mapSize) {
  let planetsToGenerate = mapSize[PLANETS_IN_MAP] - MANUALLY_ADDED_PLANETS;
  let buffer = mapSize[PLANET_BUFFER];
  new Player(PLAYER_1);

  let count = 0;
  let planets = {};
  while (count < planetsToGenerate) {
    let planet = new EarthLike(null, null, NEUTRAL);
    planets[planet.id] = planet;
    while (getFighters(planet).length < gameConfig[DEFAULT_FIGHTER_COUNT]) {
      new Fighter(planet);
    }

    count++;
  }

  let area = {
    topLeftAreaX : 0,
    topLeftAreaY : 0,
    bottomRightAreaX : mapSize[CANVAS_X],
    bottomRightAreaY : mapSize[CANVAS_Y]
  };

  // TODO - Possible planet overlapping as we assign planet location manually
  let gutter = gameConfig[PLAYER_PLANET_GUTTER_DISTANCE];
  let p1 = new EarthLike(gutter, gutter, PLAYER_1);
  let p2 = new EarthLike(mapSize[CANVAS_X] - gutter, mapSize[CANVAS_Y] - gutter, PLAYER_2);
  planets[p1.id] = p1;
  planets[p2.id] = p2;
  placeEntities(planets, area, buffer);
}

/**
 * Runs the callback one out of X tries, this is a statistical function used in a loop
 */
export function oneOutOf(chance, cb) {
  // the -1 here is because the max range will only happen if Math.random outputs 1 - very unlikely
  if (randFromRange(0, chance) === chance - 1) {
    cb();
    return true;
  } else {  // chance === 5, this picks a number between 0 and 5.
    return false;
  }
}

export function loadImages(imagePaths, callback) {
  let imagesToLoad = imagePaths;
  let imagesLoaded = 0;

  function renderOnReady() {
    if (imagesLoaded === imagesToLoad.length) {
      callback();
    }
  }

  imagesToLoad.forEach((imagePath) => {
    let img = new Image();
    img.onload = () => {
      imagesLoaded++;
      renderOnReady();
    };
    img.src = imagePath;
  });
}

