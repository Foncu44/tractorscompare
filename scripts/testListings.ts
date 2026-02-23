/**
 * Test script for listings API.
 * Run: LISTINGS_SCRAPE_ENABLED=true npx tsx scripts/testListings.ts
 *
 * Tests queries: "Fendt 822 Vario", "John Deere 850"
 */

import { getListings } from '../lib/listings';

const TEST_QUERIES = ['Fendt 822 Vario', 'John Deere 850'];

async function main() {
  console.log('LISTINGS_SCRAPE_ENABLED:', process.env.LISTINGS_SCRAPE_ENABLED);
  console.log('---\n');

  for (const query of TEST_QUERIES) {
    console.log(`Query: "${query}"`);
    try {
      const parts = query.split(/\s+/).filter(Boolean);
      const model = parts.length > 1 ? parts.pop()! : query;
      const brand = parts.length ? parts.join(' ') : query;
      const items = await getListings(query, brand, model);
      console.log(`  Found ${items.length} listings:`);
      for (const item of items) {
        console.log(`    - ${item.marketplaceName}: ${item.title.slice(0, 60)}...`);
        console.log(`      URL: ${item.listingUrl}`);
        if (item.priceText) console.log(`      Price: ${item.priceText}`);
        if (item.locationText) console.log(`      Location: ${item.locationText}`);
      }
      console.log('');
    } catch (e) {
      console.error(`  Error:`, e);
      console.log('');
    }
  }
}

main();
