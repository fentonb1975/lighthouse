// Rooms and movement rules, ported from prototype/src/game.ts.

export type Direction = "north" | "south" | "east" | "west";

export interface Room {
  // Matches the data-room attribute on this room's illustration.
  id: string;
  name: string;
  description: string;
  row: number;
  col: number;
  // Reason shown when the player tries to leave the grid in that direction.
  walls: Record<Direction, string>;
}

// 2×2 grid: row 0 is the top, col 0 is the left.
export const rooms: Room[] = [
  {
    id: "stair",
    name: "Spiral Stair",
    description:
      "Iron steps coil upward around a cold stone column, worn smooth by a century of boots. A narrow slit window lets in a thin blade of grey sea light.",
    row: 0,
    col: 0,
    walls: {
      north: "The stair ends at a bolted hatch you can't open.",
      west: "Solid stone wall. The tower is thick here.",
      south: "",
      east: "",
    },
  },
  {
    id: "lamp",
    name: "Lamp Room",
    description:
      "A great glass lens fills the room, throwing slow circles of gold across the walls. Beyond the windows the dark sea stretches to the horizon.",
    row: 0,
    col: 1,
    walls: {
      north: "Only glass and sky above. There's nowhere higher to go.",
      east: "The windows are sealed against the wind.",
      // Down from the Lamp Room is the same door back to the Rocks.
      south: "",
      west: "",
    },
  },
  {
    id: "kitchen",
    name: "Keeper's Kitchen",
    description:
      "A kettle sits on a squat black stove that still gives off a little warmth. A logbook lies open on the table beside a half-eaten heel of bread.",
    row: 1,
    col: 0,
    walls: {
      south: "The cellar door is locked tight.",
      west: "A heavy dresser full of plates blocks the wall.",
      north: "",
      east: "",
    },
  },
  {
    id: "rocks",
    name: "Rocks",
    description:
      "Waves crash against black, slippery rocks at the foot of the lighthouse. A weathered door stands in the tower wall to the west.",
    row: 1,
    col: 1,
    walls: {
      south: "The sea is too rough to wade into.",
      east: "Only open water that way.",
      // Up from the Rocks is the Lamp Room door, which is always open.
      north: "",
      west: "",
    },
  },
];

const offsets: Record<Direction, [number, number]> = {
  north: [-1, 0],
  south: [1, 0],
  east: [0, 1],
  west: [0, -1],
};

export const keyToDirection: Record<string, Direction> = {
  ArrowUp: "north",
  ArrowDown: "south",
  ArrowLeft: "west",
  ArrowRight: "east",
};

export const directionOrder: Direction[] = ["north", "south", "east", "west"];

export function roomAt(row: number, col: number): Room | undefined {
  return rooms.find((r) => r.row === row && r.col === col);
}

// A move is open only if the target square exists and the current room has no wall that way.
export function neighbour(room: Room, dir: Direction): Room | undefined {
  if (room.walls[dir]) return undefined;
  const [dr, dc] = offsets[dir];
  return roomAt(room.row + dr, room.col + dc);
}

// Everything the rules need to know about a game in progress. Plain data, no browser needed.
export interface GameState {
  roomId: string;
  // Rooms the player has been in, including the current one.
  visited: string[];
}

export interface MoveResult {
  state: GameState;
  moved: boolean;
  message: string;
}

export const startState: GameState = { roomId: "rocks", visited: ["rocks"] };

export function roomById(id: string): Room {
  const room = rooms.find((r) => r.id === id);
  if (!room) throw new Error(`Unknown room: ${id}`);
  return room;
}

export function move(state: GameState, dir: Direction): MoveResult {
  const room = roomById(state.roomId);
  const next = neighbour(room, dir);
  if (!next) {
    return { state, moved: false, message: room.walls[dir] || `You can't go ${dir}.` };
  }
  const visited = state.visited.includes(next.id) ? state.visited : [...state.visited, next.id];
  return { state: { roomId: next.id, visited }, moved: true, message: `You go ${dir}.` };
}

// Directions the player can currently move in.
export function openExits(state: GameState): Direction[] {
  return directionOrder.filter((d) => move(state, d).moved);
}
