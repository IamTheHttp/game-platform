import Entity from "./lib/ECS/Entity";
declare module '*.png';
declare module '*.json';

declare global {
  interface Window { Entity: new(...args) => Entity }
}

