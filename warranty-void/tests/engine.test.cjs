const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const context = vm.createContext({});
vm.runInContext(fs.readFileSync(path.join(__dirname, "../engine.js"), "utf8"), context);
const E = vm.runInContext("WarrantyEngine", context);

function seededRng(seed = 42) {
  let value = seed;
  return () => {
    value = (value * 1664525 + 1013904223) >>> 0;
    return value / 4294967296;
  };
}

function solve(def) {
  let state = E.startJob(def);
  for (const id of def.faultIds) {
    const fault = E.findFault(def.appliance, id);
    assert.equal(E.readPart(def, state, fault.part, "probe").suspicious, true);
    const outcome = E.repair(def, state, fault.part, fault.fix);
    assert.equal(outcome.result.correct, true);
    state = outcome.state;
  }
  return E.testJob(def, state).passed;
}

test("every authored chapter is valid and solvable", () => {
  assert.equal(E.STORY.length, 6);
  for (const def of E.STORY) {
    assert.equal(E.validateCase(def), true);
    assert.equal(solve(def), true);
  }
});

test("hundreds of generated cases are valid and solvable", () => {
  const rng = seededRng();
  for (let n = 1; n <= 1000; n++) {
    const def = E.generateEndless(n, rng);
    assert.equal(E.validateCase(def), true);
    assert.equal(solve(def), true);
    assert.equal(def.faultIds.length, n >= 12 ? 3 : n >= 5 ? 2 : 1);
  }
});

test("wrong repairs do not secretly resolve a failure", () => {
  const def = E.STORY[0];
  const fault = E.findFault(def.appliance, def.faultIds[0]);
  const initial = E.startJob(def);
  const wrongTool = E.REPAIRS.find(r => r.id !== fault.fix).id;
  const attempt = E.repair(def, initial, fault.part, wrongTool);
  assert.equal(attempt.result.correct, false);
  assert.equal(attempt.state.mistakes, 1);
  assert.equal(E.testJob(def, attempt.state).passed, false);
  const correct = E.repair(def, attempt.state, fault.part, fault.fix);
  assert.equal(E.testJob(def, correct.state).passed, true);
});

test("healthy components read nominal", () => {
  const def = E.STORY[0];
  const state = E.startJob(def);
  const healthy = E.DEVICES[def.appliance].parts.find(
    part => !def.faultIds.some(id => E.findFault(def.appliance, id).part === part.id)
  );
  assert.equal(E.readPart(def, state, healthy.id, "probe").suspicious, false);
});

test("case validator rejects impossible jobs", () => {
  const base = E.STORY[0];
  assert.equal(E.validateCase({...base, faultIds: ["missing-fault"]}), false);
  assert.equal(E.validateCase({...base, faultIds: [base.faultIds[0], base.faultIds[0]]}), false);
});

test("all major ending combinations produce different results", () => {
  const outcomes = new Set();
  for (const records of ["save", "shred"]) {
    for (const verdict of ["listen", "reset"]) {
      const result = E.ending({records, verdict});
      assert.ok(result.title && result.text);
      outcomes.add(result.title);
    }
  }
  assert.equal(outcomes.size, 4);
});
