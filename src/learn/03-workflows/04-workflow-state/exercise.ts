/**
 * ============================================================
 *  MODULE 19: Workflow State
 * ============================================================
 *
 *  THEORY
 *  ------
 *  Step input/output flows SEQUENTIALLY: step2 gets step1's output.
 *  But what if ALL steps need access to a shared counter? Or config?
 *
 *  Workflow STATE is a shared store that any step can read and update.
 *
 *  STATE vs INPUT/OUTPUT:
 *    input/output: Data flows step-to-step (sequential)
 *    state:        Shared across ALL steps (global scratchpad)
 *
 *  DEFINING STATE:
 *    1. Define stateSchema on the WORKFLOW (master schema)
 *    2. Define stateSchema on each STEP (subset it needs)
 *    3. Access via `state` in execute, update via `setState`
 *
 *    const step = createStep({
 *      stateSchema: z.object({ counter: z.number() }),
 *      execute: async ({ inputData, state, setState }) => {
 *        console.log(state.counter);           // read
 *        await setState({ counter: state.counter + 1 }); // write
 *        return { ... };                       // output (separate from state)
 *      },
 *    });
 *
 *    const workflow = createWorkflow({
 *      stateSchema: z.object({ counter: z.number() }),
 *    }).then(step).commit();
 *
 *  INITIAL STATE:
 *    Pass when starting a run:
 *      run.start({
 *        inputData: { ... },
 *        initialState: { counter: 0 },
 *      })
 *
 *  STATE PERSISTENCE:
 *    State survives suspend/resume cycles!
 *    If step1 sets counter=5, then suspends, after resume
 *    the counter is still 5.
 *
 *  STATE IN NESTED WORKFLOWS:
 *    Parent state propagates to child workflows.
 *    If parent sets state before calling child, the child
 *    sees the updated state.
 *
 *  EXERCISE
 *  --------
 *  Build a workflow that tracks progress using shared state.
 * ============================================================
 */

import { createWorkflow, createStep } from '@mastra/core/workflows';
import { z } from 'zod';

// ─── TODO 1: Create steps that use shared state ─────────────
// Step 1: Process an item and add it to the state's processedItems
// Step 2: Read from state and use it in the output

const processStep = createStep({
  id: 'process',
  inputSchema: z.object({ item: z.string() }),
  outputSchema: z.object({ item: z.string() }),
  stateSchema: z.object({
    processedItems: z.array(z.string()),
    count: z.number(),
  }),
  execute: async ({ inputData, state, setState }) => {
    // TODO: Add inputData.item to processedItems in state
    // TODO: Increment count
    // TODO: Return the item
    return { item: inputData.item };
  },
});

const summaryStep = createStep({
  id: 'summary',
  inputSchema: z.object({ item: z.string() }),
  outputSchema: z.object({ summary: z.string() }),
  stateSchema: z.object({
    processedItems: z.array(z.string()),
    count: z.number(),
  }),
  execute: async ({ inputData, state }) => {
    // TODO: Use state.processedItems and state.count in the summary
    return {
      summary: `Processed ${state.count} items: ${state.processedItems.join(', ')}`,
    };
  },
});

// ─── TODO 2: Create the workflow with stateSchema ───────────
// The workflow stateSchema is the MASTER schema containing
// all possible state values.

export const stateWorkflow = undefined as any; // ← replace
// createWorkflow({
//   id: 'state-workflow',
//   inputSchema: z.object({ item: z.string() }),
//   outputSchema: z.object({ summary: z.string() }),
//   stateSchema: z.object({
//     processedItems: z.array(z.string()),
//     count: z.number(),
//   }),
// })
//   .then(processStep)
//   .then(summaryStep)
//   .commit();

// ─── TODO 3: Run with initialState ──────────────────────────
export async function testState() {
  console.log('--- Workflow State ---');
  // TODO: Create run
  // TODO: Start with initialState: { processedItems: [], count: 0 }
  // TODO: Print result and verify state was updated
  console.log('TODO: implement');
}

// ─── TODO 4: State persistence across suspend/resume ────────
// State survives suspend! If step1 sets counter=5 then suspends,
// after resume the counter is still 5.
//
//   const step = createStep({
//     stateSchema: z.object({ count: z.number() }),
//     resumeSchema: z.object({ proceed: z.boolean() }),
//     execute: async ({ state, setState, suspend, resumeData }) => {
//       if (!resumeData) {
//         await setState({ count: state.count + 1 });
//         await suspend({});
//         return {};
//       }
//       // After resume: state.count is still the updated value!
//       return {};
//     },
//   });

// ─── TODO 5: State in nested workflows ──────────────────────
// Parent state propagates to child workflows:
//
//   // Parent sets state
//   parentStep: setState({ sharedValue: 'from-parent' })
//
//   // Child reads it
//   childStep: console.log(state.sharedValue) // 'from-parent'
//
// Both parent and child must declare the relevant state fields
// in their stateSchema.

export async function runTest() {
  await testState();
}
