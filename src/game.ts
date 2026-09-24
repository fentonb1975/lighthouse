type Direction = "north" | "south" | "east" | "west";

interface Room {
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
const rooms: Room[] = [
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
      south: "The gallery rail stops you. It's a long drop to the rocks.",
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
      // Up from the Rocks is the Lamp Room gallery, which can't be reached from outside.
      north: "The tower wall is sheer. You can't climb up to the lamp from here.",
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

const keyToDirection: Record<string, Direction> = {
  ArrowUp: "north",
  ArrowDown: "south",
  ArrowLeft: "west",
  ArrowRight: "east",
};

const directionOrder: Direction[] = ["north", "south", "east", "west"];

function roomAt(row: number, col: number): Room | undefined {
  return rooms.find((r) => r.row === row && r.col === col);
}

// A move is open only if the target square exists and the current room has no wall that way.
function neighbour(room: Room, dir: Direction): Room | undefined {
  if (room.walls[dir]) return undefined;
  const [dr, dc] = offsets[dir];
  return roomAt(room.row + dr, room.col + dc);
}

function byId<T extends HTMLElement>(id: string): T {
  const el = document.getElementById(id);
  if (!el) throw new Error(`Missing element #${id}`);
  return el as T;
}

const nameEl = byId("room-name");
const descEl = byId("room-description");
const exitsEl = byId("exits");
const messageEl = byId("message");
const mapEl = byId("map");
const scenesEl = byId("scenes");

let current: Room = roomAt(1, 1)!;

function render(): void {
  nameEl.textContent = current.name;
  descEl.textContent = current.description;

  for (const scene of Array.from(scenesEl.children)) {
    scene.toggleAttribute("hidden", (scene as SVGElement).dataset.room !== current.id);
  }

  const exits = directionOrder.filter((d) => neighbour(current, d));
  exitsEl.textContent = exits.length ? exits.join(", ") : "none";

  for (const cell of Array.from(mapEl.children) as HTMLElement[]) {
    const here =
      Number(cell.dataset.row) === current.row && Number(cell.dataset.col) === current.col;
    cell.classList.toggle("here", here);
  }
}

function move(dir: Direction): void {
  const next = neighbour(current, dir);
  if (next) {
    current = next;
    messageEl.textContent = `You go ${dir}.`;
    messageEl.className = "message";
  } else {
    messageEl.textContent = current.walls[dir] || `You can't go ${dir}.`;
    messageEl.className = "message blocked";
  }
  render();
}

document.addEventListener("keydown", (event) => {
  const dir = keyToDirection[event.key];
  if (!dir) return;
  event.preventDefault();
  move(dir);
});

render();
