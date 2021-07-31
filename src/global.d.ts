declare module '*.png';
declare module '*.json';

interface Window {
  Entity: new(...args: any) => any
  game: any; // TODO this should not be any
  API: any; // TODO this should not be any
  stressTest: () => void;
  cheats_won: boolean;
  ga: (eventName: string, a: any) => void; // TODO can this be improved?
}

interface Entity {
  entities: Record<any, number>
}