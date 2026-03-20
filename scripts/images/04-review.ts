#!/usr/bin/env tsx
/**
 * STEP 4 — Interactive Review CLI
 *
 * Loops through every `approved` record and lets you decide:
 *   [a] Accept → keeps status as "approved" (ready for publish)
 *   [r] Reject → status = "rejected", prompts for reason
 *   [s] Skip   → leave as "approved", review later
 *   [q] Quit   → exit without saving further changes
 *
 * For each record, prints:
 *   - Tractor brand + model
 *   - Image dimensions, license, confidence score
 *   - Attribution
 *   - Source URL and CDN URL
 *
 * Usage:
 *   npx tsx scripts/images/04-review.ts
 *   npx tsx scripts/images/04-review.ts --auto-accept-confidence 0.8
 *     (auto-accept records with confidence ≥ 0.8, only show lower ones)
 */

import readline from 'readline';
import { findByStatus, updateRecord, registryStats } from '../../lib/imageRegistry';

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

const args = process.argv.slice(2);
const autoAcceptArg = args.findIndex((a) => a === '--auto-accept-confidence');
const AUTO_ACCEPT_THRESHOLD: number =
  autoAcceptArg !== -1 ? parseFloat(args[autoAcceptArg + 1]) || 0 : 0;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function prompt(rl: readline.Interface, question: string): Promise<string> {
  return new Promise((resolve) => rl.question(question, resolve));
}

const REJECTION_PRESETS: Record<string, string> = {
  '1': 'wrong_tractor',
  '2': 'watermark',
  '3': 'too_small',
  '4': 'poor_quality',
  '5': 'unrelated_image',
  '6': 'unknown_rights',
};

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  console.log('=== Step 4: Image Review ===\n');

  const stats = registryStats();
  console.log('Registry state:');
  for (const [k, v] of Object.entries(stats)) console.log(`  ${k.padEnd(12)}: ${v}`);
  console.log();

  if (AUTO_ACCEPT_THRESHOLD > 0) {
    // Auto-accept high-confidence records
    const approved = findByStatus('approved');
    let autoAccepted = 0;
    for (const r of approved) {
      if (r.confidence_score >= AUTO_ACCEPT_THRESHOLD) {
        // Already approved, nothing to change — just count
        autoAccepted++;
      }
    }
    console.log(
      `Auto-accept threshold: ${AUTO_ACCEPT_THRESHOLD} → ${autoAccepted} records will be auto-published`,
    );
    console.log('Records below threshold will be shown for manual review.\n');
  }

  const approved = findByStatus('approved').filter(
    (r) => r.confidence_score < AUTO_ACCEPT_THRESHOLD,
  );

  if (approved.length === 0) {
    if (AUTO_ACCEPT_THRESHOLD > 0) {
      console.log('All approved records are above the auto-accept threshold.');
    } else {
      console.log('No approved records to review. Run 03-optimize.ts first.');
    }
    console.log('\nNext step: npx tsx scripts/images/05-publish.ts');
    return;
  }

  console.log(`Records to review manually: ${approved.length}\n`);
  console.log('Commands: [a] accept  [r] reject  [s] skip  [q] quit\n');

  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  const stats2 = { accepted: 0, rejected: 0, skipped: 0 };

  for (let i = 0; i < approved.length; i++) {
    const record = approved[i];

    console.log('─'.repeat(60));
    console.log(`[${i + 1}/${approved.length}] ${record.tractor_id}`);
    console.log(`  License     : ${record.license_type} (${record.attribution_text.slice(0, 80)})`);
    console.log(`  Dimensions  : ${record.width} × ${record.height} px`);
    console.log(
      `  Confidence  : ${(record.confidence_score * 100).toFixed(0)}% | source: ${record.source_type}`,
    );
    console.log(`  CDN URL     : ${record.cdn_url ?? '(not yet set)'}`);
    console.log(`  Source URL  : ${record.source_url}`);
    console.log(`  Alt text    : ${record.alt_text}`);
    console.log();

    let answered = false;
    while (!answered) {
      const answer = (await prompt(rl, '  > [a/r/s/q]: ')).trim().toLowerCase();

      switch (answer) {
        case 'a':
          // Keep as "approved" — publish step will pick it up
          stats2.accepted++;
          answered = true;
          break;

        case 'r': {
          console.log('  Rejection presets:');
          for (const [k, v] of Object.entries(REJECTION_PRESETS)) {
            console.log(`    [${k}] ${v}`);
          }
          const reason = (
            await prompt(rl, '  Enter reason number or free text: ')
          ).trim();
          const finalReason = REJECTION_PRESETS[reason] ?? (reason || 'manual_rejection');
          updateRecord(record.id, {
            status: 'rejected',
            rejection_reason: finalReason,
            reviewed_at: new Date().toISOString(),
          });
          console.log(`  Rejected: ${finalReason}`);
          stats2.rejected++;
          answered = true;
          break;
        }

        case 's':
          stats2.skipped++;
          answered = true;
          break;

        case 'q':
          rl.close();
          printSummary(stats2);
          return;

        default:
          console.log('  Unknown command. Use a, r, s, or q.');
      }
    }
  }

  rl.close();
  printSummary(stats2);
  console.log('\nNext step: npx tsx scripts/images/05-publish.ts');
}

function printSummary(s: { accepted: number; rejected: number; skipped: number }) {
  console.log('\n=== Review Summary ===');
  console.log(`  Accepted : ${s.accepted}`);
  console.log(`  Rejected : ${s.rejected}`);
  console.log(`  Skipped  : ${s.skipped}`);
}

main().catch((e) => {
  console.error('Fatal:', e);
  process.exit(1);
});
