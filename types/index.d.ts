import Entity from 'lib/ECS/Entity';
import entityLoop from 'lib/ECS/util/entityLoop';
import ObjectPool from 'lib/ObjectPool/ObjectPool';
import GameCanvas from 'lib/GameCanvas/GameCanvas';
import Engine from 'lib/Engine/Engine';
declare const _default: {
    Entity: typeof Entity;
    entityLoop: (entities: any, fn: any) => any[];
    ObjectPool: typeof ObjectPool;
    GameCanvas: typeof GameCanvas;
    Engine: typeof Engine;
};
export default _default;
export { Entity, entityLoop, ObjectPool, GameCanvas, Engine };
