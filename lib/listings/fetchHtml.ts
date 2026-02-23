/**
 * HTML fetch for listings scraping. Used only when LISTINGS_SCRAPE_ENABLED=true.
 * - User-Agent: tractorscompare-bot/1.0
 * - Timeout: 7 seconds
 * - Accept-Language: en
 * TODO: Respect robots.txt conceptually (check before fetching).
 */

const FETCH_TIMEOUT_MS = 7000;
const USER_AGENT = 'tractorscompare-bot/1.0';

export async function fetchHtml(url: string): Promise<string> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

  try {
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': USER_AGENT,
        'Accept-Language': 'en',
        Accept: 'text/html,application/xhtml+xml',
      },
    });
    clearTimeout(timeout);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.text();
  } catch (e) {
    clearTimeout(timeout);
    throw e;
  }
}
