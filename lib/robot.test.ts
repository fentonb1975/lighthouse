import { test } from "node:test";
import assert from "node:assert/strict";
import { type RobotState, keyToDirection, spin, startState, views } from "./robot.ts";

const viewName = (state: RobotState) => views[state.view].name;

test("the robot starts facing front", () => {
  assert.equal(viewName(startState), "Front");
});

test("pressing right spins through right side, back and left side, then wraps to front", () => {
  const right = keyToDirection.ArrowRight;
  const seen: string[] = [];
  let state = startState;
  for (let i = 0; i < 4; i++) {
    const result = spin(state, right);
    assert.equal(result.turned, true);
    state = result.state;
    seen.push(viewName(state));
  }
  assert.deepEqual(seen, ["Right Side", "Back", "Left Side", "Front"]);
});

test("pressing left from the front wraps round to the left side", () => {
  const result = spin(startState, keyToDirection.ArrowLeft);
  assert.equal(viewName(result.state), "Left Side");
  assert.equal(result.message, "You spin the robot left.");
});

test("pressing up makes the robot jump without turning", () => {
  const result = spin(startState, keyToDirection.ArrowUp);
  assert.equal(result.jumped, true);
  assert.equal(result.turned, false);
  assert.equal(viewName(result.state), "Front");
  assert.equal(result.message, "The robot jumps!");
});

test("pressing down makes the robot do a press-up without turning or jumping", () => {
  const result = spin(startState, keyToDirection.ArrowDown);
  assert.equal(result.pressUp, true);
  assert.equal(result.jumped, false);
  assert.equal(result.turned, false);
  assert.equal(viewName(result.state), "Front");
  assert.equal(result.message, "The robot does a press-up!");
});
