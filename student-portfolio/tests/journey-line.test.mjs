import { test } from "node:test";
import assert from "node:assert/strict";
import { createRoutePath, getLineFrame } from "../lib/journey-line.ts";

const near = (actual, expected) => assert.ok(Math.abs(actual - expected) < .005, `${actual} != ${expected}`);
const straight = distance => ({x:20,y:distance});

test("a growing line clamps before the start and after the end", () => {
  assert.deepEqual(getLineFrame(-100,400,straight),{x:20,y:0,progress:0});
  assert.deepEqual(getLineFrame(Infinity,400,straight),{x:20,y:400,progress:1});
  near(getLineFrame(200,400,straight).progress,.5);
  assert.deepEqual(getLineFrame(200,0,straight),{x:20,y:0,progress:0});
});

test("the light follows curve geometry instead of assuming equal height and length", () => {
  const curved = distance => ({x:50+30*Math.sin(distance/400*Math.PI*2),y:400*(distance/400)**2});
  const atRecord = getLineFrame(100,400,curved);
  near(atRecord.progress,.5);
  near(atRecord.y,100);
  near(atRecord.x,50);
  for(const y of [50,100,200,350]) near(getLineFrame(y,400,curved).y,y);
});

test("reverse scrolling retraces the line; the hero also supports an upward path", () => {
  const before = getLineFrame(150,400,straight);
  getLineFrame(350,400,straight);
  assert.deepEqual(getLineFrame(150,400,straight),before);
  const upward = distance => ({x:distance/2,y:400-distance});
  near(getLineFrame(300,400,upward).progress,.25);
  near(getLineFrame(300,400,upward).x,50);
  assert.equal(getLineFrame(500,400,upward).progress,0);
  assert.equal(getLineFrame(-100,400,upward).progress,1);
});

test("coordinates are read from DOMPoint-like accessors, including endpoints", () => {
  class Point { constructor(value){this.value=value;} get x(){return 25;} get y(){return this.value;} }
  const pointAt = distance => new Point(distance);
  assert.equal(getLineFrame(0,400,pointAt).x,25);
  assert.equal(getLineFrame(Infinity,400,pointAt).y,400);
  near(getLineFrame(200,400,pointAt).y,200);
});

test("the route connects milestone centers with smooth cubic segments", () => {
  assert.equal(createRoutePath([]),"");
  assert.equal(createRoutePath([{x:10,y:0},{x:30,y:100}]),"M 10 0 C 10 50, 30 50, 30 100");
});
