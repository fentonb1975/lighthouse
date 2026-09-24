"use client";

import dynamic from "next/dynamic";
import { useEffect, useState } from "react";
import { type RobotState, keyToDirection, spin, startState, views } from "@/lib/robot";

// three.js needs a browser, so the 3D view only loads on the client.
const Robot3D = dynamic(() => import("@/components/Robot3D"), {
  ssr: false,
  loading: () => <div className="stage" />,
});

const labels: Record<string, string> = {
  front: "A 3D robot facing you, with amber eyes and a red light on its chest",
  right: "The robot's right side, with a dial on its head and a battery pack on its back",
  back: "The robot's back, with a battery pack and vents on its head",
  left: "The robot's left side, with a dial on its head and its amber eye at the front",
};

interface ViewState {
  robot: RobotState;
  message: string;
  blocked: boolean;
  // +1 per spin right, -1 per spin left, so the model always turns the short way.
  quarterTurns: number;
  jumps: number;
  pressUps: number;
}

export default function Game() {
  const [state, setState] = useState<ViewState>({
    robot: startState,
    message: "",
    blocked: false,
    quarterTurns: 0,
    jumps: 0,
    pressUps: 0,
  });

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const dir = keyToDirection[event.key];
      if (!dir) return;
      event.preventDefault();
      setState((prev) => {
        const result = spin(prev.robot, dir);
        if (result.jumped) {
          return { ...prev, message: result.message, blocked: false, jumps: prev.jumps + 1 };
        }
        if (result.pressUp) {
          return { ...prev, message: result.message, blocked: false, pressUps: prev.pressUps + 1 };
        }
        if (!result.turned) return { ...prev, message: result.message, blocked: true };
        return {
          ...prev,
          robot: result.state,
          message: result.message,
          blocked: false,
          quarterTurns: prev.quarterTurns + (dir === "right" ? 1 : -1),
        };
      });
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  const { robot, message, blocked, quarterTurns, jumps, pressUps } = state;
  const view = views[robot.view];

  return (
    <main>
      <h1>The Robot</h1>
      <h2 id="room-name">{view.name}</h2>

      <figure className="scene" id="scenes">
        <Robot3D quarterTurns={quarterTurns} jumps={jumps} pressUps={pressUps} label={labels[view.id]} />
      </figure>

      <p id="room-description">{view.description}</p>
      <p id="message" className={blocked ? "message blocked" : "message"} aria-live="polite">
        {message}
      </p>

      <p className="hint">Use the ← and → arrow keys to spin the robot, ↑ to make it jump, and ↓ for a press-up.</p>
    </main>
  );
}
