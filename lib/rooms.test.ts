import { test } from "node:test";
import assert from "node:assert/strict";
import { keyToDirection, move, startState } from "./rooms.ts";

const up = keyToDirection.ArrowUp;

test("at the start, pressing up from the Rocks is blocked by the locked Lamp Room door", () => {
  assert.equal(startState.roomId, "rocks");

  const result = move(startState, up);

  assert.equal(result.state.roomId, "rocks");
  assert.equal(result.message, "The lamp room door is locked.");
});

test("after visiting the Keeper's Kitchen, pressing up from the Rocks enters the Lamp Room", () => {
  const inKitchen = move(startState, "west").state;
  assert.equal(inKitchen.roomId, "kitchen");
  const backOnRocks = move(inKitchen, "east").state;
  assert.equal(backOnRocks.roomId, "rocks");

  const result = move(backOnRocks, up);

  assert.equal(result.state.roomId, "lamp");
});
