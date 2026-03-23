/**
 * ============================================================
 *  MODULE 22: Human-in-the-Loop
 * ============================================================
 *
 *  THEORY
 *  ------
 *  Building on suspend/resume, HITL adds human decision-making
 *  to workflows. The pattern:
 *
 *    1. Workflow suspends with a message for the human
 *    2. UI shows the message + approve/reject buttons
 *    3. Human decides → resume or bail
 *
 *  ── Providing user feedback ──
 *  When suspended, access the payload from result.steps:
 *
 *    if (result.status === 'suspended') {
 *      const stepId = result.suspended[0];
 *      const payload = result.steps[stepId].suspendPayload;
 *      // Show payload.reason to the user in your UI
 *    }
 *
 *  ── bail() — graceful rejection ──
 *  Stop the workflow WITHOUT an error. The workflow ends with
 *  status: 'success', and all logic after bail() is skipped.
 *
 *    execute: async ({ resumeData, suspend, bail }) => {
 *      if (resumeData?.approved === false) {
 *        return bail({ reason: 'User rejected the request.' });
 *      }
 *      if (!resumeData?.approved) {
 *        return await suspend({ reason: 'Approval needed.' });
 *      }
 *      return { result: 'Done!' };
 *    }
 *
 *  bail() vs throw:
 *    bail()      → status: 'success', output is the bail payload
 *    throw Error → status: 'failed', error captured
 *
 *  ── Multi-turn HITL ──
 *  Multiple steps can each require human input. Resume each
 *  step individually in sequence:
 *
 *    step1: suspend → resume('step-1', { approved: true })
 *    step2: suspend → resume('step-2', { confirmed: true })
 *
 *  Each step has its own resumeSchema and suspendSchema.
 *
 *  EXERCISE
 *  --------
 *  Build a workflow with human approval and rejection handling.
 * ============================================================
 */

import { createWorkflow, createStep } from '@mastra/core/workflows';
import { z } from 'zod';

// ─── TODO 1: Create a HITL approval step ────────────────────
// This step:
//   - If not approved yet → suspend with reason
//   - If approved === false → bail (graceful rejection)
//   - If approved === true → continue

const approvalStep = undefined as any; // ← replace
// createStep({
//   id: 'human-approval',
//   inputSchema: z.object({ action: z.string(), target: z.string() }),
//   outputSchema: z.object({ result: z.string() }),
//   resumeSchema: z.object({ approved: z.boolean() }),
//   suspendSchema: z.object({ reason: z.string() }),
//   execute: async ({ inputData, resumeData, suspend, bail }) => {
//     const { approved } = resumeData ?? {};
//
//     if (approved === false) {
//       return bail({ result: `Rejected: ${inputData.action} on ${inputData.target}` });
//     }
//
//     if (!approved) {
//       return await suspend({
//         reason: `Please approve: ${inputData.action} on ${inputData.target}`,
//       });
//     }
//
//     return { result: `Executed: ${inputData.action} on ${inputData.target}` };
//   },
// })

// ─── TODO 2: Create the workflow ────────────────────────────
export const hitlWorkflow = undefined as any; // ← replace

// ─── TODO 3: Test approval flow ─────────────────────────────
export async function testApproval() {
  console.log('--- Approval Flow ---');
  // TODO: Start workflow with { action: 'delete', target: 'database-prod' }
  // TODO: Check suspended status
  // TODO: Read suspendPayload for user feedback
  // TODO: Resume with { approved: true }
  // TODO: Print final result
  console.log('TODO: implement');
}

// ─── TODO 4: Test rejection flow ────────────────────────────
export async function testRejection() {
  console.log('--- Rejection Flow (bail) ---');
  // TODO: Start workflow → suspends
  // TODO: Resume with { approved: false }
  // TODO: Result should be 'success' with bail payload
  console.log('TODO: implement');
}

// ─── TODO 5: Multi-turn HITL ────────────────────────────────
// Build a 2-step workflow where both steps need approval:
//
// Step 1: "Confirm sending email to user@example.com?"
// Step 2: "Confirm deleting the draft after sending?"
//
// const sendStep = createStep({
//   id: 'send-email',
//   resumeSchema: z.object({ approved: z.boolean() }),
//   suspendSchema: z.object({ reason: z.string() }),
//   execute: async ({ inputData, resumeData, suspend }) => {
//     if (!resumeData?.approved) {
//       return await suspend({ reason: 'Confirm email send?' });
//     }
//     return { message: `Sent to ${inputData.email}` };
//   },
// });
//
// const deleteStep = createStep({
//   id: 'delete-draft',
//   resumeSchema: z.object({ confirmed: z.boolean() }),
//   suspendSchema: z.object({ reason: z.string() }),
//   execute: async ({ inputData, resumeData, suspend }) => {
//     if (!resumeData?.confirmed) {
//       return await suspend({ reason: 'Delete the draft?' });
//     }
//     return { result: `${inputData.message} - Draft deleted` };
//   },
// });
//
// Resume each step separately:
//   await run.resume({ step: 'send-email', resumeData: { approved: true } })
//   // workflow suspends again at delete-draft
//   await run.resume({ step: 'delete-draft', resumeData: { confirmed: true } })

// ─── TODO 6: Resume from external triggers ──────────────────
// Resume can be called from anywhere:
//   - HTTP endpoint (user clicks "Approve" in a web app)
//   - Webhook callback (Stripe, GitHub, etc.)
//   - Timer (auto-approve after 24 hours)
//   - Event handler (message from Slack bot)
//
//   // Example: auto-approve at midnight
//   const midnight = new Date();
//   midnight.setUTCHours(24, 0, 0, 0);
//   setTimeout(async () => {
//     await run.resume({ step: 'approval', resumeData: { approved: true } });
//   }, midnight.getTime() - Date.now());

export async function runTest() {
  console.log('=== Approval ===\n');
  await testApproval();
  console.log('\n=== Rejection ===\n');
  await testRejection();
}
