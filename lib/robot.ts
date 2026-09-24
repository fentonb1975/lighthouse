// Robot views and spin rules. Plain data and functions, no browser needed.

export type Direction = "up" | "down" | "left" | "right";

export interface View {
  // Matches the key in components/Robot.tsx's views.
  id: string;
  name: string;
  description: string;
}

// In turntable order: spinning right steps forward through this list and wraps around.
export const views: View[] = [
  {
    id: "front",
    name: "Front",
    description:
      "A round-shouldered robot looks straight at you with two glowing amber eyes. A little red light blinks steadily in the middle of its chest panel.",
  },
  {
    id: "right",
    name: "Right Side",
    description:
      "From the side, the robot's boxy head has a brass dial where an ear should be. A battery pack juts from its back, and one arm hangs patiently at its hip.",
  },
  {
    id: "back",
    name: "Back",
    description:
      "The back of the robot is all business, with a battery pack held on by four stout screws. Thin vents on the back of its head give off a faint, warm hum.",
  },
  {
    id: "left",
    name: "Left Side",
    description:
      "The robot's left side mirrors its right, down to the dial on its head. Its amber eye peeks out at the front edge, still watching where it's facing.",
  },
];

export const keyToDirection: Record<string, Direction> = {
  ArrowUp: "up",
  ArrowDown: "down",
  ArrowLeft: "left",
  ArrowRight: "right",
};

export interface RobotState {
  // Index into views.
  view: number;
}

export interface SpinResult {
  state: RobotState;
  turned: boolean;
  jumped: boolean;
  pressUp: boolean;
  message: string;
}

export const startState: RobotState = { view: 0 };

export function spin(state: RobotState, dir: Direction): SpinResult {
  if (dir === "up") {
    return { state, turned: false, jumped: true, pressUp: false, message: "The robot jumps!" };
  }
  if (dir === "down") {
    return { state, turned: false, jumped: false, pressUp: true, message: "The robot does a press-up!" };
  }
  const step = dir === "right" ? 1 : -1;
  const view = (state.view + step + views.length) % views.length;
  return {
    state: { view },
    turned: true,
    jumped: false,
    pressUp: false,
    message: `You spin the robot ${dir}.`,
  };
}
