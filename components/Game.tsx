"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { SketchFilter, scenes } from "@/components/Scenes";
import {
  type Direction,
  type GameState,
  keyToDirection,
  move as applyMove,
  openExits,
  roomById,
  rooms,
  startState,
} from "@/lib/rooms";

interface ViewState {
  game: GameState;
  message: string;
  blocked: boolean;
}

const arrows: Record<Direction, string> = { north: "↑", west: "←", east: "→", south: "↓" };
// Same order as the prototype's buttons; the grid areas in CSS place them.
const dpadOrder: Direction[] = ["north", "west", "east", "south"];

// Swipe on the picture: the longer axis of the drag picks the direction.
const minSwipe = 30;

export default function Game() {
  const [state, setState] = useState<ViewState>({
    game: startState,
    message: "",
    blocked: false,
  });
  const swipeStart = useRef<{ x: number; y: number } | null>(null);

  const move = useCallback((dir: Direction) => {
    setState(({ game }) => {
      const result = applyMove(game, dir);
      return { game: result.state, message: result.message, blocked: !result.moved };
    });
  }, []);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const dir = keyToDirection[event.key];
      if (!dir) return;
      event.preventDefault();
      move(dir);
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [move]);

  const onTouchStart = (event: React.TouchEvent) => {
    const t = event.touches[0];
    swipeStart.current = { x: t.clientX, y: t.clientY };
  };

  const onTouchEnd = (event: React.TouchEvent) => {
    const start = swipeStart.current;
    if (!start) return;
    const t = event.changedTouches[0];
    const dx = t.clientX - start.x;
    const dy = t.clientY - start.y;
    swipeStart.current = null;
    if (Math.max(Math.abs(dx), Math.abs(dy)) < minSwipe) return;
    if (Math.abs(dx) > Math.abs(dy)) move(dx > 0 ? "east" : "west");
    else move(dy > 0 ? "south" : "north");
  };

  const { game, message, blocked } = state;
  const room = roomById(game.roomId);
  const exits = openExits(game);

  return (
    <main>
      <h1>The Lighthouse</h1>
      <h2 id="room-name">{room.name}</h2>

      <SketchFilter />

      <figure className="scene" id="scenes" onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
        {scenes[room.id]}
      </figure>

      <p id="room-description">{room.description}</p>
      <p className="exits">
        You can go: <strong id="exits">{exits.length ? exits.join(", ") : "none"}</strong>
      </p>
      <p id="message" className={blocked ? "message blocked" : "message"} aria-live="polite">
        {message}
      </p>

      {/* Blocked directions are dimmed but stay tappable so the player still hears why. */}
      <div className="dpad" id="dpad">
        {dpadOrder.map((dir) => (
          <button
            key={dir}
            type="button"
            data-dir={dir}
            aria-label={`Go ${dir}`}
            className={exits.includes(dir) ? undefined : "closed"}
            onClick={() => move(dir)}
          >
            {arrows[dir]}
          </button>
        ))}
      </div>

      <div id="map" aria-hidden="true">
        {rooms.map((r) => (
          <div key={r.id} className={r.id === room.id ? "here" : undefined}>
            {r.name}
          </div>
        ))}
      </div>

      <p className="hint">Tap the arrows or swipe the picture to move. Arrow keys work too.</p>
    </main>
  );
}
