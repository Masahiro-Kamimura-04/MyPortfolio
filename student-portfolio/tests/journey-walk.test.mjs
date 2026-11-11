import { test } from "node:test";
import assert from "node:assert/strict";
import { getWalkFrame } from "../lib/journey-walk.ts";

const targets = [{x:40,y:200},{x:80,y:600},{x:50,y:1000},{x:90,y:1400}];

test("one landing per information, left and right alternating", () => {
  for (let index = 0; index < targets.length; index++) {
    const start = index ? targets[index - 1].y : 50;
    const mid = getWalkFrame((start + targets[index].y) / 2, targets);
    assert.equal(mid.movingIndex, index);
    assert.equal(mid.landed, index);
    assert.equal(mid.progress, .5);
    assert.equal(mid.lift, 1);
    const landed = getWalkFrame(targets[index].y, targets);
    assert.equal(landed.landed, index + 1);
    assert.equal(landed.movingIndex, -1);
  }
});

test("a foot advances from its previous same-side footprint", () => {
  const third = getWalkFrame(800, targets);
  assert.equal(third.x, 45);
  assert.equal(third.y, 600);
  const fourth = getWalkFrame(1200, targets);
  assert.equal(fourth.x, 85);
  assert.equal(fourth.y, 1000);
});

test("reverse scroll retraces positions; jumps and reduced motion settle cleanly", () => {
  const before = getWalkFrame(800, targets);
  assert.equal(getWalkFrame(3000, targets).movingIndex, -1);
  assert.deepEqual(getWalkFrame(800, targets), before);
  assert.equal(getWalkFrame(-500, targets).landed, 0);
  assert.equal(getWalkFrame(-500, targets).movingIndex, -1);
  assert.equal(getWalkFrame(Infinity, targets).landed, targets.length);
  assert.equal(getWalkFrame(Infinity, targets).movingIndex, -1);
  assert.equal(getWalkFrame(100, []).movingIndex, -1);
});
