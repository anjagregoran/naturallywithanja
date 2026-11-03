/* Reads a pasted ingredient list and judges every ingredient against data.js. */

const TIER_ORDER = ['pure', 'fine', 'caution', 'skip'];

function cleanName(text) {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

function splitList(text) {
  const body = text
    .replace(/\b(inactive |active )?ingredients?\s*:/gi, ',')
    .replace(/\bmay contain\b\s*:?/gi, ',')
    .replace(/\+\/-/g, ',')
    .replace(/\(and\)/gi, ',')
    .replace(/[\n\r•·;|]/g, ',');

  // Commas inside brackets belong to one ingredient
  const parts = [];
  let depth = 0;
  let current = '';
  for (const ch of body) {
    if (ch === '(' || ch === '[') depth++;
    if (ch === ')' || ch === ']') depth = Math.max(0, depth - 1);
    if (ch === ',' && depth === 0) {
      parts.push(current);
      current = '';
    } else {
      current += ch;
    }
  }
  parts.push(current);

  const seen = new Set();
  return parts
    .map(part => part
      .replace(/\d+(\.\d+)?\s*%/g, '')
      .replace(/[*†‡^]+/g, '')
      .replace(/\s+/g, ' ')
      .replace(/^[\s.:-]+|[\s.:-]+$/g, ''))
    .filter(part => {
      const key = cleanName(part);
      if (!key || seen.has(key)) return false;
      seen.add(key);
      return true;
    });
}

// Longest aliases first, so "benzyl alcohol" wins over a shorter match
const ALIASES = INGREDIENTS
  .flatMap(item => item.a.map(alias => ({ alias: cleanName(alias), item })))
  .sort((a, b) => b.alias.length - a.alias.length);

const EXACT = new Map(INGREDIENTS.flatMap(item => (item.e || []).map(alias => [alias, item])));

function lookup(raw) {
  const name = cleanName(raw);
  const padded = ` ${name} `;

  const early = PATTERNS.find(p => !p.late && p.r.test(name));
  if (early) return { name: early.n, tier: early.t, why: early.w, flags: [] };

  if (EXACT.has(name)) {
    const item = EXACT.get(name);
    return { name: item.n, tier: item.t, why: item.w, flags: item.f || [] };
  }

  const hit = ALIASES.find(({ alias }) => padded.includes(` ${alias} `));
  if (hit) return { name: hit.item.n, tier: hit.item.t, why: hit.item.w, flags: hit.item.f || [] };

  const late = PATTERNS.find(p => p.late && p.r.test(name));
  if (late) return { name: late.n, tier: late.t, why: late.w, flags: [] };

  if (PLANT_HINT.test(name)) {
    return {
      name: 'Plant-Derived',
      tier: 'unknown',
      why: 'This looks like a plant ingredient, though we have not reviewed this one yet.',
      flags: []
    };
  }
  return { name: 'Not Reviewed', tier: 'unknown', why: 'We have not reviewed this one yet, so we would rather not guess.', flags: [] };
}

const FLAG_NOTES = {
  fragrance: 'Flagged for your fragrance sensitivity.',
  nut: 'Flagged for your tree nut allergy.',
  pregnancy: 'Flagged because you are pregnant or nursing, so check with your doctor.'
};

function analyze(text, sensitivities = []) {
  const items = splitList(text).map((raw, index) => {
    const found = lookup(raw);
    const alerts = found.flags.filter(flag => sensitivities.includes(flag));
    return {
      raw,
      position: index + 1,
      name: found.name,
      tier: alerts.length ? 'skip' : found.tier,
      why: found.why,
      alert: alerts.length ? FLAG_NOTES[alerts[0]] : ''
    };
  });

  const counts = { pure: 0, fine: 0, caution: 0, skip: 0, unknown: 0 };
  items.forEach(item => counts[item.tier]++);

  return { items, counts, total: items.length, verdict: verdictFor(items, counts) };
}

function verdictFor(items, counts) {
  if (!items.length) return null;

  const nearTop = items.slice(0, 5).filter(item => item.tier === 'skip' || item.tier === 'caution');
  const topNote = nearTop.length
    ? ` ${nearTop[0].raw} sits near the top of the list, which usually means there is more of it.`
    : '';
  const unknownNote = counts.unknown
    ? ` We have not reviewed ${counts.unknown === 1 ? 'one ingredient' : `${counts.unknown} ingredients`} yet, so ${counts.unknown === 1 ? 'it is' : 'they are'} left out of this verdict.`
    : '';

  if (counts.skip >= 3) {
    return { title: 'We Would Pass', text: `${counts.skip} ingredients are ones we would leave out, and there are gentler choices out there.${topNote}${unknownNote}` };
  }
  if (counts.skip > 0) {
    return { title: 'A Few To Reconsider', text: `Most of this list is fine, though ${counts.skip === 1 ? 'one ingredient is' : 'two ingredients are'} worth a closer look before you buy.${topNote}${unknownNote}` };
  }
  if (counts.caution > 0) {
    return { title: 'Mostly Good', text: `Nothing here is on our skip list, and ${counts.caution === 1 ? 'one ingredient deserves' : `${counts.caution} ingredients deserve`} a second look if your skin reacts easily.${topNote}${unknownNote}` };
  }
  if (counts.pure + counts.fine === 0) {
    return { title: 'Not Enough To Judge', text: `We could not recognize enough of this list to give a fair verdict.${unknownNote}` };
  }
  return { title: 'A Beautiful List', text: `Everything we recognize here looks gentle and well chosen.${unknownNote}` };
}
