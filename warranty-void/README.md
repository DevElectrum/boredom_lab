# Warranty Void

**Playable prototype · browser game · no install required**

You are the newest appliance technician at Questionable Solutions Inc. The machines are broken, their complaints are extremely specific, and the repair department has no idea what it's doing.

## Start playing

Open `warranty-void/index.html` in a browser, or visit the GitHub Pages version once publishing has been enabled for this repository.

The game is plain HTML, CSS and JavaScript. It uses no frameworks, builds, account login, paid APIs, or network calls to run. Fonts fall back to system fonts offline. Progress is saved locally in your browser, separately for both modes.

## How a job works

1. Read the **work order** to see the customer's complaint.
2. Tap any **component** on the machine.
3. Choose **Inspect** for visual evidence or **Probe** for diagnostic readings.
4. Compare the findings with the **Technician's cheat sheet**.
5. Try **Reconnect**, **Calibrate**, **Reset**, or **Replace**.
6. Press **Run Appliance Test**. A successful test clears the job. If it fails, keep investigating.

You can experiment without a timer or hard fail state. Wrong repairs count against neatness, but never make a case unsolvable.

## Game modes

### Story Mode
Six authored jobs, four appliance types, returning customers and corporate weirdness. The campaign ends with a decision shaped by an earlier choice, producing **four possible endings**. Play again to see the other outcomes.

### Endless Mode
New work orders continue for as long as you like. Cases combine four appliances, distinct fault patterns, customer names and dispatch notes. From job five onward, some machines have two faults; from job twelve, three. Cases are generated from valid fault definitions, not random nonsense without solutions. Endless Mode is unlocked immediately.

Switching modes through the workshop menu preserves an unfinished job in each mode.

## Technician's cheat sheet

| Probe finding | Repair |
| --- | --- |
| Intermittent link / missing connection | Reconnect |
| Drift / offset | Calibrate |
| State locked | Reset |
| Open circuit / irrecoverably damaged | Replace |

## Files

- `index.html`: browser entry point
- `styles.css`: responsive workbench UI
- `engine.js`: shared case data, diagnostics, repairs, test rules, story content and endless generator
- `game.js`: UI, mode switching, decisions, audio toggle, local save/resume
- `tests/engine.test.cjs`: Node's built-in unit tests for solvable jobs, wrong repairs, and branching endings

To run checks from the repo root:

```sh
node --check warranty-void/engine.js
node --check warranty-void/game.js
node --test warranty-void/tests/engine.test.cjs
```

## Current limits and next ideas

This is the **first playable slice**, not a finished commercial game. Machines use four abstract interactive nodes rather than freeform 3D disassembly, and case generation uses known fault patterns rather than arbitrary electrical circuits. The campaign is deliberately short. Next improvements should follow actual playtesting: better investigation, visual repair feedback, richer recurring customers and more intricate but still fair cases.

The [design document](../docs/warranty-void.md) contains longer-term goals, including a possible crossover with *Please Hold*.

**Rule zero:** the absurdity belongs in the fiction, not in unfair puzzle logic.
