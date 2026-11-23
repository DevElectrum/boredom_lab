# Please Hold
> **Status:** Concept / design notes. No implementation yet.

## Premise
You work the customer-service desk at **Questionable Solutions Inc.**, a company that has somehow become responsible for problems nobody else will touch. A refrigerator complains about being opened too often. A printer requests leave. The Moon wants to file a privacy complaint.

The absurdity is in the *cases*; the gameplay should still require decisions. This is a light, funny desk game, not just a random joke dispenser.

## Core loop
1. **Take a call.** Read or listen to the caller's complaint and relevant details.
2. **Investigate.** Consult customer records, company policy, prior tickets, and any clues the caller provides.
3. **Decide.** Resolve, transfer, escalate, or hang up. Some cases have more than one defensible answer.
4. **Receive consequences.** See the outcome, update the records, and sometimes hear from the same caller again.

A typical case should be brief enough to play during a break. Repeated play should feel like handling increasingly peculiar *situations*, not rereading random dialogue.

## Two modes

### Story Mode
A finite, handcrafted campaign with a beginning, development, and ending.

- Learn the tools and rules through early calls.
- Encounter recurring callers, departments, and coworkers.
- Experience policy changes and complications that build on earlier decisions.
- Choices affect later cases, relationships, and available outcomes.
- Branching situations and **multiple endings**, with meaningful rather than purely cosmetic differences.

**Possible story hook (proposal, not locked):** The company keeps changing its policies because something is profoundly wrong with its internal operations. You can follow instructions, protect callers, or investigate why the complaints connect.

### Endless Mode
An immediately available mode with no final day or required campaign completion.

- Generate cases from **compatible** combinations of caller, problem, evidence, policy, and resolution options.
- Mix ordinary support work with rare absurd complications.
- Introduce policies and departments gradually so complexity rises without becoming an unreadable mess.
- Reuse persistent callers, previous ticket outcomes, and occasional follow-up calls within a run.
- Let players stop and resume without punishment; record useful stats or personal bests.

**Important:** Endless Mode must have internally consistent cases and understandable consequences. A random sentence generator is not a game.

## Systems to share between modes
- Caller / case model: identity, complaint, facts, contradictions, urgency.
- Inspectable records and policies.
- Call actions and resolution validation.
- Ticket history and consequence flags.
- Dialogue presentation and simple sound/UI feedback.

Story Mode selects authored cases and branch events. Endless Mode assembles valid cases from content and rules using the *same* case-handling mechanics.

## One possible starter case
**Caller:** A refrigerator reports that its owner keeps opening the door without taking anything.

**Evidence:** The account shows an unusually high number of openings; the fridge's cooling system is fine.

**Choices:** Give usage advice, file a service request, transfer to appliance relations, or dismiss the complaint.

**Consequence idea:** If mishandled, the refrigerator may call back, possibly with a formal grievance.

This example is tone-setting, **not** a finalized story branch.

## First playable slice
- One functional phone/desk interface.
- A handful of handcrafted calls with identifiable facts.
- A small policy book or ticket database to inspect.
- Multiple choices with different visible outcomes.
- One recurring caller or follow-up.
- A very small Endless Mode prototype using safe combinations of known case parts.

We should confirm the core interaction is enjoyable before adding lots of jokes, elaborate branching, voice acting, or complex automation.

## Tone and guardrails
- Ridiculous and occasionally deadpan; the player shouldn't be required to be cruel to succeed.
- The decision matters more than the punchline.
- A short session should be satisfying; no mandatory grind.
- Browser-first if feasible, with mouse and touch controls.
- Avoid depending on an LLM or a paid API for basic replayability.

## Possible crossover
A customer-service call can create a repair ticket that appears in **[Warranty Void](warranty-void.md)**. A botched repair can later cause a new call. These are **optional future crossovers**; both games must work independently.

## Open design questions
- How strict should the scoring/penalties be?
- Mostly written dialogue, or short voiced lines later?
- How much continuity should persist between Endless Mode sessions?
- Should the story be more workplace satire, mystery, or pure absurd comedy?
