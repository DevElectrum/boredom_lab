const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const engineSource = fs.readFileSync(path.join(__dirname, "../engine.js"), "utf8");
const gameSource = fs.readFileSync(path.join(__dirname, "../game.js"), "utf8");
const benchSource = fs.readFileSync(path.join(__dirname, "../bench-art.js"), "utf8");

function boot(existing = new Map()) {
  const nodes = {"#app": {innerHTML: ""}, "#nav": {innerHTML: ""}};
  const listeners = {};
  const sandbox = {
    window: {confirm: () => true},
    localStorage: {
      getItem: key => existing.get(key) ?? null,
      setItem: (key, value) => existing.set(key, value)
    },
    document: {
      querySelector: selector => nodes[selector],
      addEventListener: (name, callback) => listeners[name] = callback
    }
  };
  const ctx = vm.createContext(sandbox);
  vm.runInContext(engineSource, ctx);
  vm.runInContext(benchSource, ctx);
  vm.runInContext(gameSource, ctx);
  return {
    ctx,
    nodes,
    storage: existing,
    engine: vm.runInContext("WarrantyEngine", ctx),
    click(action, extra = {}) {
      assert.ok(listeners.click);
      listeners.click({target: {closest: () => ({dataset: {action, ...extra}})}});
    },
    progress() {
      return JSON.parse(existing.get("boredom-lab-warranty-void-v1"));
    }
  };
}

function repairCurrent(t) {
  const progress = t.progress(),slot = progress[progress.active];
  assert.ok(slot.def && slot.job);
  for (const id of slot.def.faultIds) {
    const f = t.engine.findFault(slot.def.appliance, id);
    t.click("select", {part: f.part});
    t.click("probe");
    t.click("fix", {fix: f.fix});
  }
  t.click("test");
}

test("menu loads and a job can be completed by clicking controls", () => {
  const t = boot();
  assert.match(t.nodes["#app"].innerHTML, /Story Mode/);
  t.click("story");
  assert.match(t.nodes["#app"].innerHTML, /Disassembly bench/);
  t.click("select", {part: "lever"});
  t.click("probe");
  assert.match(t.nodes["#app"].innerHTML, /STATE LOCKED/);
  t.click("fix", {fix: "reset"});
  t.click("test");
  assert.match(t.nodes["#app"].innerHTML, /It's alive/);
  t.click("next");
  assert.equal(t.progress().story.index, 1);
});

test("story branches through all six chapters to an ending", () => {
  const t = boot();
  t.click("story");
  for (let i = 0; i < 6; i++) {
    repairCurrent(t);
    const def = t.engine.STORY[i];
    if (def.decision) {
      t.click("choose", {value: def.decision.key === "records" ? "save" : "listen"});
    } else t.click("next");
  }
  assert.equal(t.progress().storyDone, true);
  assert.match(t.nodes["#app"].innerHTML, /THE UNION OF SMALL APPLIANCES/);
});

test("endless jobs advance and both modes retain separate progress", () => {
  const storage = new Map(),t = boot(storage);
  t.click("story");
  t.click("menu");
  t.click("endless");
  repairCurrent(t);
  t.click("next");
  assert.equal(t.progress().endless.completed, 1);
  assert.equal(t.progress().endless.round, 2);
  const resumed = boot(storage);
  resumed.click("story");
  assert.equal(resumed.progress().story.index, 0);
  resumed.click("menu");
  resumed.click("endless");
  assert.equal(resumed.progress().endless.round, 2);
  assert.match(resumed.nodes["#app"].innerHTML, /WORK ORDER 002/);
});

test("wrong repair leaves the job open and surfaces feedback", () => {
  const t = boot();
  t.click("story");
  t.click("select", {part: "lever"});
  t.click("fix", {fix: "replace"});
  assert.match(t.nodes["#app"].innerHTML, /REPAIR INEFFECTIVE/);
  t.click("test");
  assert.match(t.nodes["#app"].innerHTML, /TEST FAILED/);
  assert.equal(t.progress().story.phase, "work");
});
