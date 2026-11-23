# Warranty Void
> **Status:** Concept / design notes. No implementation yet.

## Premise
You work at the repair bench of **Questionable Solutions Inc.**, servicing appliances with surprisingly human problems and machines that were clearly designed by committees.

A toaster refuses to toast because it likes bread too much. A refrigerator orders groceries for a washing machine. A vacuum cleaner becomes possessive of the floor.

The goal is a **hands-on diagnostic and repair game**, not merely selecting funny answers from a list.

## Core loop
1. **Receive a job.** Read the customer's complaint, warranty terms, and any repair history.
2. **Inspect.** Open the appliance, examine components, and run diagnostic checks.
3. **Diagnose.** Identify the actual fault, which may differ from the customer's explanation.
4. **Repair.** Remove, replace, reconnect, adjust, or rewire appropriate parts.
5. **Test and release.** Run the machine, decide whether to return it, and handle the result.

Keep the actions tactile, readable, and quick to learn. A satisfying repair should come from observing what changed, not clicking the one obviously labeled correct part.

## Two modes

### Story Mode
A finite, authored campaign built around memorable machines, customers, and a developing storyline.

- Start with simple, teachable faults.
- Introduce new components and diagnostic tools gradually.
- Bring back customers and appliances affected by earlier repairs.
- Make choices such as quick fixes versus thorough fixes matter later.
- Use handcrafted twists, branching consequences, and **multiple endings**.

**Possible story hook (proposal, not locked):** Repairs reveal that the company's appliance designs share a bizarre defect or hidden purpose. Your treatment of customers and your willingness to investigate determine how the story resolves.

### Endless Mode
An immediately available repair shop that keeps producing playable work orders.

- Assemble repair jobs from compatible appliance types, component layouts, faults, and customer quirks.
- Mix straightforward faults with occasional compound failures and unusual behaviors.
- Increase complexity through meaningful combinations and new tools, not just bigger numbers.
- Let repaired appliances return with follow-up issues during a run.
- Track shop performance, repair time, repeat failures, and optional personal records.
- Allow short sessions with easy stopping and resuming.

**Important:** Generated faults must have discoverable evidence and achievable solutions. Random broken parts hidden with no diagnostic logic would be frustrating, not replayable.

## Systems to share between modes
- Appliance definitions with components, connections, and observable behavior.
- A consistent fault/effect model.
- Inspection and diagnostic tools.
- Interactions: open, remove, replace, reconnect, adjust, test.
- Repair validation, test results, and case-history flags.

Story Mode provides authored machines and events. Endless Mode composes valid jobs from the *same* repair mechanics.

## One possible starter job
**Customer report:** A toaster refuses to toast bread.

**Inspection:** Power works, heating element works, but a control component is blocking the cycle.

**Possible remedies:** Reset the controller, replace it, or apply a questionable workaround.

**Consequence idea:** The workaround passes a basic test but the customer may return with a different complaint.

This is an illustrative concept, not a finalized repair schematic. Actual machines need rules the player can learn and verify.

## First playable slice
- One appliance on a visible workbench.
- A small set of inspectable components.
- At least two faults with different symptoms.
- A few tools and meaningful repair actions.
- A test button that shows whether the fault was actually fixed.
- A handful of handcrafted jobs plus a minimal Endless Mode job generator.

Build depth into **one fun repair** before adding dozens of appliances.

## Tone and guardrails
- Absurd machines, but coherent diagnosis.
- A wrong repair can be funny without making progress feel arbitrary.
- Repairs should be approachable, not real-world electrical-engineering homework.
- Designed for browser play, ideally usable with mouse and touch.
- Don't require advanced physics simulation or an AI service to make it enjoyable.

## Possible crossover
Support tickets from **[Please Hold](please-hold.md)** might become work orders here; a careless repair might generate a future support call. This shared universe is **optional**, not a dependency between games.

## Open design questions
- Abstract component puzzles or more free-form disassembly?
- How detailed should wiring and diagnostic tools become?
- Is there a shop budget / parts inventory, or would that create unwanted stress?
- How many symptoms should a single appliance be able to express?
