const STORE_KEY = 'izvor';
const app = document.getElementById('app');
const nav = document.getElementById('nav');

const TABS = [
  { id: 'library', label: 'Library' },
  { id: 'shelf', label: 'Shelf' },
  { id: 'check', label: 'Check' },
  { id: 'ritual', label: 'For You' }
];

const BLOCKS = [
  { id: 'morning', label: 'Morning' },
  { id: 'day', label: 'Through The Day' },
  { id: 'evening', label: 'Evening' }
];

const MAX_PER_BLOCK = 5;

const blankState = () => ({ profile: null, done: {}, saved: [] });
const blankQuiz = () => ({ step: 0, a: {} });

let state = load();
let quiz = null;
let shelfFilter = 'basics';
let checkText = '';
let checkResult = null;

function load() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORE_KEY));
    return saved ? { ...blankState(), ...saved } : blankState();
  } catch {
    return blankState();
  }
}

function save() {
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify(state));
  } catch {
    // Private windows can block storage, the app still works for this visit
  }
}

function esc(text) {
  return String(text).replace(/[&<>"']/g, ch => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));
}

function dateKey(date = new Date()) {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
}

function daysAgo(count) {
  const date = new Date();
  date.setDate(date.getDate() - count);
  return date;
}

function toggle(list, value) {
  return list.includes(value) ? list.filter(item => item !== value) : [...list, value];
}

function sensitivities() {
  return state.profile?.sensitivities || [];
}

/* Library */

function noteHtml(item) {
  if (!item.note) return '';
  const source = item.src ? ` <a href="${esc(item.src)}" target="_blank" rel="noopener">Source</a>` : '';
  return `<p class="note"><span class="label">Good To Know</span>${esc(item.note)}${source}</p>`;
}

function pantryCard(item) {
  return `
    <article class="card ${item.group}">
      <div class="card-top">
        <span class="label">${esc(item.for)}</span>
        <span class="label">${EVIDENCE[item.ev]}</span>
      </div>
      <h3>${esc(item.name)}</h3>
      <p>${esc(item.use)}</p>
      <p class="watch">${esc(item.watch)}</p>
    </article>`;
}

function postcard(href, art, title, caption, extra = '') {
  return `
    <a class="postcard ${extra}" href="${href}">
      <div class="frame">${art}</div>
      <h3>${esc(title)}</h3>
      ${caption}
    </a>`;
}

// Paste the Stripe payment links here once they exist.
const MEMBER_LINKS = { lifetime: '' };

// Paid access: buyers land on ?access=ACCESS_KEY (the Stripe success link), which unlocks this browser.
const ACCESS_KEY = 'glow-7q4x';
function hasAccess() {
  try {
    const q = new URLSearchParams(location.search);
    if (q.get('access') === ACCESS_KEY) {
      localStorage.setItem('gs_access', '1');
      history.replaceState(null, '', location.pathname + location.hash);
    }
    return localStorage.getItem('gs_access') === '1';
  } catch (e) { return false; }
}
const UNLOCKED = hasAccess();

function renderLibrary() {
  app.innerHTML = `
    <section class="hero">
      <div class="hero-art">${heroArt()}</div>
      <div class="hero-text">
        <span class="label">Glow From Nature</span>
        <h1>Glowspring</h1>
      </div>
    </section>
    <section class="statement">
      <span class="label">Where It All Comes From</span>
      <h2>Looks and health come from two places, <em>inside</em> and <em>outside</em>.</h2>
      <p class="lede">Each one has its roots, the daily habits everything grows from, and its remedies, the products and homemade things you use.</p>
    </section>
    <section class="member" id="member">
      <span class="label">The Glow List</span>
      <h2>Every find, <em>forever.</em></h2>
      <p class="lede">Pay once and get everything, plus every update for life: my homemade masks and DIY recipes, the oils and remedies I use, the new clean products I test, the brands I would swap to, and what I would never buy again.</p>
      <ul class="member-perks"><li>My homemade face masks and DIY recipes</li><li>The oils and natural remedies I use, and how</li><li>My full list of researched products, with updates for life</li><li>My brand swaps, from drugstore to clean</li><li>Early access to new remedies and routines</li></ul>
      <div class="member-plans one">
        <a class="plan plan-best" href="${MEMBER_LINKS.lifetime || '#member'}" ${MEMBER_LINKS.lifetime ? 'target="_blank" rel="noopener"' : ''}><span class="plan-tag">Founding price</span><span class="plan-name">Lifetime access</span><span class="plan-price">$14<small> one time</small></span><span class="plan-cta">${MEMBER_LINKS.lifetime ? 'Get access' : 'Opening soon'}</span></a>
      </div>
      <p class="member-note">One payment. No subscription. Every future update included.</p>
      <div class="member-free"><p>Not ready yet? Join my newsletter for natural health tips, my cycle and everyday life.</p><a class="member-email" href="https://anja-health-exchange.kit.com/34cff0de6f" target="_blank" rel="noopener">Join my newsletter</a></div>
    </section>
    ${UNLOCKED ? `    <div class="doors">
      ${WORLDS.map(world => postcard(`#${world.id}`, ART[world.id](), world.name, `<p>${esc(world.line)}</p>`, 'door')).join('')}
    </div>
    <section class="glow">
      <p class="glow-radiant">NATURALLY RADIANT</p>
      <p class="script glow-quote">your health is your glow</p>
      <p class="glow-line">Become incredibly attractive through health.</p>
    </section>
    <input class="search" id="search" type="search" aria-label="Search the library" placeholder="Search rosehip, henna, debloat..." autocomplete="off">
    <div id="found"></div>
    <div id="home" class="column">
      <h2 class="pretty">healthy is the <span class="script">new</span> pretty</h2>
      <section class="section">
        <h2>Use It</h2>
        <a class="link-row" href="#check"><h3>Check A Product</h3><p>Paste any ingredient list and see each ingredient judged.</p></a>
        <a class="link-row" href="#ritual"><h3>Take The Quiz</h3><p>Answer three questions and get a daily routine, plus the sections and brands that fit you.</p></a>
        <a class="link-row" href="#shelf"><h3>My Favorites</h3><p>Everything I use and love, sorted from basics to face, hair, clothes and bedsheets.</p></a>
      </section>
      <section class="section origin">
        <div class="origin-art">${ART.source()}</div>
        <span class="label">Why Glowspring</span>
        <p>The name comes from <i>izvor</i>, the Croatian word for a spring of fresh water and also for a source. A spring begins deep inside the earth, where rain slowly finds its way through stone until it rises clean and clear, and every river, and in the end the sea itself, is fed by countless springs like it.</p>
        <p>Beauty works the same way. It begins with its roots, the water you drink, the food you eat, how you move and how you sleep. Then it grows with its remedies, what you take inside and the products you use on the outside, until it rises to the surface as glowing skin, shiny hair and the way you carry yourself.</p>
        <p>This is mine, everything I have researched on looking and feeling your best, gathered in one place.</p>
      </section>
    </div>` : ''}`;
}

function renderWorld(world) {
  const other = WORLDS.find(item => item.id !== world.id);
  app.innerHTML = `
    <a class="back" href="#library">Library</a>
    <span class="label">Where It Comes From</span>
    <h1>${esc(world.name)}</h1>
    <p class="lede">${esc(world.line)}</p>
    ${GROUPS.map(group => `
      <section class="section group">
        <h2>${esc(group.name)}</h2>
        <p class="lede sub">${esc(group.line)}</p>
        <div class="postcards count-${world[group.id].length}">
          ${world[group.id].map(id => {
            const spring = SPRINGS.find(item => item.id === id);
            return postcard(`#spring/${id}`, ART[id](), spring.name, `<span class="label">${esc(spring.tag)}</span>`);
          }).join('')}
        </div>
      </section>`).join('')}
    <a class="link-row section" href="#${other.id}"><span class="label">Next</span><h3>${esc(other.name)}</h3></a>`;
}

function searchIndex() {
  const entries = [];
  SPRINGS.forEach(spring => {
    spring.sections.forEach(section => {
      section.items.forEach(item => entries.push({
        title: item.t, where: `${spring.name}, ${section.title}`, href: `#spring/${spring.id}`
      }));
    });
    PANTRY.filter(item => spring.pantry.includes(item.group)).forEach(item => entries.push({
      title: item.name, where: `${spring.name}, The Pantry`, href: `#spring/${spring.id}`, extra: `${item.for} ${item.use}`
    }));
  });
  SHELF.forEach(entry => entries.push({
    title: entry.brand, where: 'The Shelf', href: '#shelf', extra: entry.note || '', group: entry.group
  }));
  return entries;
}

function runSearch(query) {
  const found = document.getElementById('found');
  const words = query.toLowerCase().split(/\s+/).filter(Boolean);
  document.getElementById('home').hidden = words.length > 0;
  if (!words.length) {
    found.innerHTML = '';
    return;
  }
  const hits = searchIndex()
    .filter(entry => {
      const text = `${entry.title} ${entry.where} ${entry.extra || ''}`.toLowerCase();
      return words.every(word => text.includes(word));
    })
    .slice(0, 30);
  found.innerHTML = hits.length
    ? hits.map(hit => `
        <a class="link-row" href="${hit.href}" ${hit.group ? `data-shelf-group="${hit.group}"` : ''}>
          <span class="label">${esc(hit.where)}</span>
          <p class="hit">${esc(hit.title)}</p>
        </a>`).join('')
    : '<p class="empty section">Nothing in the library matches that yet.</p>';
}

function renderSpring(id) {
  const spring = SPRINGS.find(item => item.id === id);
  if (!spring) return renderLibrary();
  const world = WORLDS.find(item => item.id === spring.world);
  const pantry = PANTRY.filter(item => spring.pantry.includes(item.group));
  const titles = [...spring.sections.map(section => section.title), ...(pantry.length ? ['The Pantry'] : [])];

  app.innerHTML = `
    <a class="back" href="#${world.id}">${esc(world.name)}</a>
    <header class="spring-head">
      <div class="frame">${ART[id]()}</div>
      <div>
        <span class="label">${esc(spring.tag)}</span>
        <h1>${esc(spring.name)}</h1>
      </div>
      <p class="lede">${esc(spring.intro)}</p>
    </header>
    ${titles.length > 1 ? `
      <div class="jump">
        ${titles.map((title, index) => `<button class="filter" data-jump="${index}">${esc(title)}</button>`).join('')}
      </div>` : ''}
    ${spring.sections.map(section => `
      <section class="section">
        <h2>${esc(section.title)}</h2>
        ${section.lede ? `<p class="lede sub">${esc(section.lede)}</p>` : ''}
        ${sectionBody(section)}
        ${section.link ? `<a class="pill ghost" href="${esc(section.link.href)}" target="_blank" rel="noopener">${esc(section.link.label)}</a>` : ''}
      </section>`).join('')}
    ${pantry.length ? `
      <section class="section">
        <h2>The Pantry</h2>
        <p class="lede sub">Each one shows how strong the proof is, so you always know what is well studied and what is simply a lovely tradition.</p>
        ${pantry.map(pantryCard).join('')}
      </section>` : ''}`;
}

function sectionBody(section) {
  if (section.kind === 'swatches') {
    return `<div class="swatches">${section.items.map(item => `
      <div class="swatch"><i style="background:${item.hex}"></i>${esc(item.t)}</div>`).join('')}</div>`;
  }
  const short = section.kind === 'list' && section.items.every(item => !item.note && item.t.length <= 34);
  if (short) return `<div class="tags">${section.items.map(item => `<span>${esc(item.t)}</span>`).join('')}</div>`;

  const tag = section.kind === 'steps' ? 'ol' : 'ul';
  return `<${tag} class="notes">${section.items.map(item => `
    <li><p>${esc(item.t)}</p>${noteHtml(item)}</li>`).join('')}</${tag}>`;
}

/* Shelf */

function brandHtml(entry, why = '') {
  return `
    <article class="brand">
      <h3>${esc(entry.brand)}</h3>
      ${why ? `<p class="brand-why">${esc(why)}</p>` : ''}
      ${entry.note ? `<p class="brand-note">${esc(entry.note)}</p>` : ''}
      ${entry.href ? `<a class="visit" href="${esc(entry.href)}" target="_blank" rel="noopener">Visit ${esc(entry.brand)}</a>` : ''}
    </article>`;
}

function renderShelf() {
  const entries = SHELF.filter(entry => entry.group === shelfFilter || (entry.also || []).includes(shelfFilter));

  app.innerHTML = `
    <span class="label">The Shelf</span>
    <h1>My tried-and-true favorites.</h1>
    <p class="lede">Everything I truly use and love, from the basics like food and sleep to face, hair, clothes and bedsheets. Some links are affiliate links, so I may earn a small commission at no extra cost to you.</p>
    <div class="filters">
      ${SHELF_GROUPS.map(group => `<button class="filter" data-shelf="${group.id}" aria-pressed="${shelfFilter === group.id}">${group.label}</button>`).join('')}
    </div>
    <div class="brands">${entries.map(entry => brandHtml(entry)).join('')}</div>`;
}

/* Check */

function renderCheck() {
  app.innerHTML = `
    <span class="label">Ingredient Checker</span>
    <h1>Every ingredient, judged honestly.</h1>
    <p class="lede">Copy the full list from the back of a product or from its store page, and we will go through it one ingredient at a time.</p>
    <details class="howi" open>
      <summary>How I judge every ingredient</summary>
      <div class="lights">
        <div class="light g"><i></i><h3>Green: Glow &amp; Okay</h3><p>What I would buy 98% of the time. Organic, plant-based and from nature, or gentle and well tolerated.</p></div>
        <div class="light y"><i></i><h3>Yellow: Rarely</h3><p>Only about 2% of the time, when there is no better option. Worth a second look, especially on sensitive skin.</p></div>
        <div class="light r"><i></i><h3>Red: Never</h3><p>I would never buy it. These are the ingredients I always leave out.</p></div>
      </div>
      <ul class="crit">
        <li>Organic and plant-based ingredients come first, like in the brands I use and trust.</li>
        <li>Animal ingredients are welcome when they are clean and regenerative, like grass-fed beef tallow from regenerative farms (Primally Pure uses it).</li>
        <li>A short list of real ingredients beats a long list of fillers.</li>
        <li>No synthetic fragrance, parabens, phthalates or harsh sulfates.</li>
        <li>I follow EU safety standards, which are stricter than the USA's.</li>
      </ul>
    </details>
    <div class="psearch">
      <label for="pq">Type a product name</label>
      <div class="psearch-row"><input id="pq" type="search" placeholder="For example: Weleda Skin Food" autocomplete="off"><button class="pill" data-find>Find It</button></div>
      <div id="pres"></div>
      <p class="hint">Big brands are easiest to find. If yours is not there, paste the ingredient list below.</p>
    </div>
    <textarea id="list" aria-label="Ingredient list" placeholder="Water, Aloe Barbadensis Leaf Juice, Glycerin...">${esc(checkText)}</textarea>
    <div class="actions">
      <button class="pill" data-run>Check Ingredients</button>
      <button class="pill ghost" data-sample>Try An Example</button>
    </div>
    <div id="result">${checkResult ? resultHtml(checkResult) : ''}</div>`;
}

function verdictTone(counts) {
  if (counts.skip >= 3) return 'stop';
  if (counts.skip > 0) return 'warn';
  if (counts.caution > 0) return '';
  return 'good';
}

function resultHtml(result) {
  if (!result.total) {
    return '<p class="empty section">We could not find any ingredients there. Try separating them with commas.</p>';
  }
  const order = ['pure', 'fine', 'caution', 'skip', 'unknown'].filter(tier => result.counts[tier]);
  return `
    <section class="verdict ${verdictTone(result.counts)}">
      <span class="label">${result.total} Ingredients</span>
      <h2>${esc(result.verdict.title)}</h2>
      <p>${esc(result.verdict.text)}</p>
      <div class="bar" role="img" aria-label="${order.map(t => `${result.counts[t]} ${TIERS[t].label}`).join(', ')}">
        ${order.map(tier => `<span class="t-${tier}" style="flex:${result.counts[tier]}"></span>`).join('')}
      </div>
      <div class="key">
        ${order.map(tier => `<span><i class="t-${tier}"></i>${result.counts[tier]} ${TIERS[tier].label}</span>`).join('')}
      </div>
    </section>
    <section class="section">
      <h2>One By One</h2>
      <p class="lede sub">Lists run from most to least, so whatever sits near the top matters most.</p>
      ${result.items.map(item => `
        <div class="row">
          <div class="row-head">
            <span class="row-name">${esc(item.raw)}</span>
            <span class="tag ${item.tier}">${TIERS[item.tier].label}</span>
          </div>
          <p>${esc(item.why)}</p>
          ${item.alert ? `<p class="alert">${esc(item.alert)}</p>` : ''}
        </div>`).join('')}
      <form class="save" data-save>
        <input id="save-name" aria-label="Product name" placeholder="Name this product" maxlength="60" required>
        <button class="pill">Save</button>
      </form>
    </section>`;
}

/* Product search uses Open Beauty Facts, a free public database. Only products with an ingredient list are shown. */
let productHits = [];
async function findProduct() {
  const q = document.getElementById('pq').value.trim();
  const box = document.getElementById('pres');
  if (!q) return;
  box.innerHTML = '<p class="hint">Looking it up…</p>';
  try {
    const url = 'https://world.openbeautyfacts.org/cgi/search.pl?search_simple=1&json=1&page_size=12&fields=product_name,brands,ingredients_text&search_terms=' + encodeURIComponent(q);
    const data = await (await fetch(url)).json();
    productHits = (data.products || []).filter(p => p.ingredients_text && p.product_name).slice(0, 6);
    box.innerHTML = productHits.length
      ? productHits.map((p, i) => `<button class="phit" data-pick="${i}"><b>${esc(p.brands || '')}</b> ${esc(p.product_name)}</button>`).join('')
      : '<p class="hint">I could not find that one yet. Paste its ingredient list below and I will check it.</p>';
  } catch (e) {
    box.innerHTML = '<p class="hint">The search is not answering right now. Paste the ingredient list below instead.</p>';
  }
}

function runCheck() {
  checkText = document.getElementById('list').value;
  checkResult = analyze(checkText, sensitivities());
  document.getElementById('result').innerHTML = resultHtml(checkResult);
}

/* Ritual */

/* Everyone's steps come first, then the ones matched to their skin, then one for each goal, then the rest while there is room. */
function stepsFor(block, profile) {
  const eligible = STEPS.filter(step => {
    if (step.when !== block) return false;
    if (step.skin && !step.skin.includes(profile.skin)) return false;
    return !step.goals || step.goals.some(goal => profile.goals.includes(goal));
  });

  const chosen = eligible.filter(step => !step.goals);
  const add = step => {
    if (step && chosen.length < MAX_PER_BLOCK && !chosen.includes(step)) chosen.push(step);
  };
  eligible.filter(step => step.skin).forEach(add);
  profile.goals.forEach(goal => add(eligible.find(s => s.goals?.includes(goal) && !chosen.includes(s))));
  eligible.forEach(add);

  return eligible.filter(step => chosen.includes(step));
}

function todaysSteps() {
  return BLOCKS.flatMap(block => stepsFor(block.id, state.profile));
}

function doneToday() {
  return state.done[dateKey()] || [];
}

function streak() {
  // Today only counts once something is done, so a new morning never breaks the streak
  let count = doneToday().length ? 1 : 0;
  for (let back = 1; state.done[dateKey(daysAgo(back))]?.length; back++) count++;
  return count;
}

/* The quiz: three sections, one question per screen, in the style of a beauty consultation. */
const QSECTIONS = [
  { title: 'Your Skin And Hair', img: 'https://images.pexels.com/photos/7795769/pexels-photo-7795769.jpeg?auto=compress&cs=tinysrgb&w=1000', find: ['Your skin type', 'What you would love to change', 'How your hair feels'] },
  { title: 'Your Glow Goals', img: 'https://images.pexels.com/photos/7797450/pexels-photo-7797450.jpeg?auto=compress&cs=tinysrgb&w=1000', find: ['What you want to feel and look like', 'How much time you have', 'Your makeup routine'] },
  { title: 'Your Body And Days', img: 'https://images.pexels.com/photos/7795817/pexels-photo-7795817.jpeg?auto=compress&cs=tinysrgb&w=1000', find: ['Your energy and sleep', 'Your digestion', 'Anything to avoid'] }
];
const QQ = [
  { id: 'skin', sec: 0, q: 'How does your skin usually feel?', why: 'So I can pick the right oil or cream for your evenings.', opts: [
    { v: 'dry', t: 'Dry', d: 'Tight after washing, sometimes flaky' },
    { v: 'oily', t: 'Oily', d: 'Shiny by midday, bigger pores' },
    { v: 'combination', t: 'Combination', d: 'Oily T-zone, drier cheeks' },
    { v: 'sensitive', t: 'Sensitive', d: 'Gets red or itchy easily' }] },
  { id: 'concerns', sec: 0, multi: true, q: 'What would you love to change about your skin?', why: 'Your answers decide which skin steps go into your ritual.', opts: [
    { v: 'breakouts', t: 'Breakouts', d: 'Spots and clogged pores' },
    { v: 'dull', t: 'Dullness', d: 'I want my glow back' },
    { v: 'redness', t: 'Redness', d: 'Flushing or irritation' },
    { v: 'spots', t: 'Dark spots', d: 'Marks that stay after spots or sun' },
    { v: 'lines', t: 'Fine lines', d: 'Softer, smoother skin' },
    { v: 'none', t: 'Nothing really', d: 'I am happy with my skin', solo: true }] },
  { id: 'hairq', sec: 0, multi: true, q: 'And your hair?', why: 'Hair grows from the inside too, so this shapes your food and scalp care.', opts: [
    { v: 'breakage', t: 'Breakage or thinning', d: 'More hair in the brush than I like' },
    { v: 'dryends', t: 'Dry ends', d: 'Rough, frizzy or split' },
    { v: 'oilyscalp', t: 'Oily scalp', d: 'I need to wash it often' },
    { v: 'growth', t: 'Slow growth', d: 'I want it longer and fuller' },
    { v: 'happy', t: 'I love my hair', d: 'Nothing to change', solo: true }] },
  { id: 'goals', sec: 1, multi: true, q: 'What would you love to feel and look like?', why: 'Your ritual is built around these, so pick everything that speaks to you.', opts: GOALS.map(g => ({ v: g.id, t: g.label, d: g.note })) },
  { id: 'time', sec: 1, q: 'How much time do you have for yourself each day?', why: 'A ritual only works if it fits your real life.', opts: [
    { v: 'short', t: 'About 5 minutes', d: 'Keep it quick and simple' },
    { v: 'mid', t: 'About 15 minutes', d: 'A little moment for me' },
    { v: 'long', t: '30 minutes or more', d: 'I love a slow ritual' }] },
  { id: 'makeupq', sec: 1, q: 'How do you wear makeup?', why: 'If you wear it, I will show you my clean swaps.', opts: [
    { v: 'none', t: 'I do not wear makeup', d: 'Bare skin is my look' },
    { v: 'little', t: 'A little every day', d: 'Mascara, blush, a tinted balm' },
    { v: 'full', t: 'Full glam sometimes', d: 'For going out and special days' }] },
  { id: 'energy', sec: 2, q: 'How is your energy most days?', why: 'Energy is the first sign of how your body is doing on the inside.', opts: [
    { v: 'steady', t: 'Steady all day', d: 'I feel good' },
    { v: 'dips', t: 'Afternoon dips', d: 'I need a coffee or a snack' },
    { v: 'low', t: 'Tired most of the day', d: 'I wake up already tired' }] },
  { id: 'sleepq', sec: 2, q: 'And your sleep?', why: 'Deep sleep is when your skin and body repair.', opts: [
    { v: 'good', t: 'I sleep well', d: 'I wake up rested' },
    { v: 'fall', t: 'It takes long to fall asleep', d: 'My mind keeps going' },
    { v: 'wake', t: 'I wake up tired', d: 'Even after a full night' }] },
  { id: 'gutq', sec: 2, q: 'How does your tummy feel after meals?', why: 'A happy gut shows on your skin.', opts: [
    { v: 'happy', t: 'Light and happy', d: 'No complaints' },
    { v: 'some', t: 'Bloated sometimes', d: 'After certain foods' },
    { v: 'often', t: 'Bloated often', d: 'Most days' }] },
  { id: 'sens', sec: 2, multi: true, q: 'Anything I should look out for?', why: 'The ingredient checker will flag these for you.', opts: [
    ...SENSITIVITIES.map(s => ({ v: s.id, t: s.label, d: '' })),
    { v: 'nothing', t: 'Nothing', d: 'I can use anything', solo: true }] }
];

function quizFlow() {
  const flow = [];
  QSECTIONS.forEach((sec, i) => {
    flow.push({ sec: i, intro: true });
    QQ.filter(q => q.sec === i).forEach(q => flow.push({ sec: i, q }));
  });
  return flow;
}

function renderQuiz() {
  const flow = quizFlow();
  const screen = flow[quiz.step];
  const segs = `<div class="qsegs">${QSECTIONS.map((sec, i) => {
    const items = flow.filter(f => f.sec === i);
    const done = flow.slice(0, quiz.step + 1).filter(f => f.sec === i).length;
    const pct = i < screen.sec ? 100 : i > screen.sec ? 0 : Math.round(done / items.length * 100);
    return `<div class="qseg"><span>${sec.title}</span><i><b style="width:${pct}%"></b></i></div>`;
  }).join('')}</div>`;
  const back = `<button class="qback" data-qback aria-label="Back">←</button>`;
  if (screen.intro) {
    const sec = QSECTIONS[screen.sec];
    app.innerHTML = `${segs}<section class="qintro">
      <div class="qintro-ph" style="background-image:url('${sec.img}')"></div>
      <div><span class="label">Part ${screen.sec + 1} Of 3</span><h1>${sec.title}</h1>
      <p>In this part I will find out:</p><ul>${sec.find.map(f => `<li>${f}</li>`).join('')}</ul>
      <button class="pill" data-qnext>Let's Go</button></div></section>${back}`;
    return;
  }
  const q = screen.q;
  const val = quiz.a[q.id] || (q.multi ? [] : null);
  const on = v => q.multi ? val.includes(v) : val === v;
  app.innerHTML = `${segs}<section class="qq">
    <h1>${q.q}</h1>
    ${q.multi ? '<p class="qsub">Choose all that fit.</p>' : ''}
    <details class="qwhy"><summary>Why I ask</summary><p>${q.why}</p></details>
    <div class="qcards">${q.opts.map(o => `<button class="qcard" data-qopt="${o.v}" aria-pressed="${on(o.v)}"><b>${o.t}</b>${o.d ? `<small>${o.d}</small>` : ''}</button>`).join('')}</div>
    ${q.multi ? `<div class="qfoot"><button class="pill" data-qnext ${val.length ? '' : 'disabled'}>Next</button></div>` : ''}
  </section>${back}`;
}

function quizPick(v) {
  const q = quizFlow()[quiz.step].q;
  if (q.multi) {
    const opt = q.opts.find(o => o.v === v);
    let cur = quiz.a[q.id] || [];
    if (opt.solo) cur = cur.includes(v) ? [] : [v];
    else cur = toggle(cur.filter(x => !q.opts.find(o => o.v === x).solo), v);
    quiz.a[q.id] = cur;
    renderQuiz();
  } else {
    quiz.a[q.id] = v;
    renderQuiz();
    setTimeout(quizNext, 280);
  }
}

function quizNext() {
  if (quiz.step < quizFlow().length - 1) { quiz.step++; render(); }
  else finishQuiz();
}

function renderRitualIntro() {
  app.innerHTML = `
    <section class="qstart">
      <span class="label">Your Glow Consultation</span>
      <h1>Made for <em>you.</em></h1>
      <p class="lede">Three short parts about your skin and hair, your glow goals and your days. Then I build your own morning, daytime and evening ritual.</p>
      <div class="actions"><button class="pill" data-start>Begin</button></div>
      <p class="hint">About 2 minutes · Saved only on your phone</p>
    </section>`;
}

/* Goals take turns choosing brands, each preferring brands made mainly for it, so no single goal crowds out the rest.
   Sensitivities and skin type filter brands out first. */
function picksFor(profile) {
  const springs = [...new Set(profile.goals.flatMap(goal => GOAL_SPRINGS[goal] || []))].slice(0, 6);
  const eligible = SHELF
    .filter(entry => !(entry.avoid || []).some(flag => profile.sensitivities.includes(flag)))
    .filter(entry => !entry.skinTypes || entry.skinTypes.includes(profile.skin))
    .map(entry => ({ entry, matched: (entry.goals || []).filter(goal => profile.goals.includes(goal)) }))
    .filter(pick => pick.matched.length);

  const queues = profile.goals.map(goal => eligible
    .filter(pick => pick.matched.includes(goal))
    .sort((a, b) => (b.entry.goals[0] === goal) - (a.entry.goals[0] === goal)));
  const brands = [];
  while (brands.length < 8 && queues.some(queue => queue.length)) {
    queues.forEach(queue => {
      while (queue.length && brands.includes(queue[0])) queue.shift();
      if (queue.length && brands.length < 8) brands.push(queue.shift());
    });
  }
  return { springs, brands };
}

function listWords(words) {
  return words.length > 1 ? `${words.slice(0, -1).join(', ')} and ${words[words.length - 1]}` : words[0];
}

function picksHtml(profile) {
  const { springs, brands } = picksFor(profile);
  const goalName = id => GOALS.find(goal => goal.id === id).label;
  return `
    <section class="section made">
      <span class="label">Made For You</span>
      <h2>Your picks</h2>
      <p class="lede sub">Chosen from my own research for your goals. Always read the ingredient list, or paste it into Check.</p>
      <h3 class="made-head">Start Here</h3>
      <div class="chips">${springs.map(id => `<a class="chip link" href="#spring/${id}">${esc(SPRINGS.find(spring => spring.id === id).name)}</a>`).join('')}</div>
      ${brands.length ? `
        <h3 class="made-head">Brands To Look At</h3>
        <div class="brands">${brands.map(pick => brandHtml(pick.entry, `For ${listWords(pick.matched.map(goalName))}`)).join('')}</div>` : ''}
    </section>`;
}

function renderRitual() {
  if (quiz) return renderQuiz();
  if (!state.profile) return renderRitualIntro();

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
  const dateLabel = new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  const done = doneToday();

  const week = Array.from({ length: 7 }, (_, index) => {
    const date = daysAgo(6 - index);
    return {
      count: (state.done[dateKey(date)] || []).length,
      label: date.toLocaleDateString('en-US', { weekday: 'narrow' })
    };
  });
  const peak = Math.max(...week.map(day => day.count), 1);
  const goalLabels = state.profile.goals.map(id => GOALS.find(goal => goal.id === id).label);
  const flagged = state.profile.sensitivities.map(id => SENSITIVITIES.find(item => item.id === id).label);
  const skinLabel = SKIN_TYPES.find(type => type.id === state.profile.skin).label;

  app.innerHTML = `
    <span class="label">${dateLabel}</span>
    <h1>${greeting}</h1>
    ${picksHtml(state.profile)}
    <section class="section">
      <h2>Today's Ritual</h2>
    </section>
    <p class="tally" id="tally"></p>
    <div class="meter"><span id="meter"></span></div>
    ${BLOCKS.map(block => `
      <section class="block">
        <span class="label">${block.label}</span>
        ${stepsFor(block.id, state.profile).map(step => `
          <div class="step ${done.includes(step.id) ? 'done' : ''}" data-step-row="${step.id}">
            <button class="tick" data-step="${step.id}" aria-pressed="${done.includes(step.id)}" aria-label="Mark ${esc(step.title)} as done">
              <svg viewBox="0 0 16 16" fill="none" stroke="#F6F0E4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 8.5l3.2 3L13 4.5"/></svg>
            </button>
            <div>
              <h3>${esc(step.title)}</h3>
              <p>${esc(step.how)}</p>
              <details><summary>Why This Helps</summary><p>${esc(step.why)}</p></details>
            </div>
          </div>`).join('')}
      </section>`).join('')}
    <div class="stats">
      <div class="stat"><span class="label">Day Streak</span><b>${streak()}</b></div>
      <div class="stat"><span class="label">This Week</span><b>${week.reduce((sum, day) => sum + day.count, 0)}</b></div>
    </div>
    <section class="section">
      <h2>The Last Seven Days</h2>
      <div class="week">
        ${week.map(day => `
          <div class="day"><i class="${day.count ? '' : 'none'}" style="height:${(day.count / peak) * 70}%"></i>${day.label}</div>`).join('')}
      </div>
    </section>
    <section class="section">
      <h2>Saved Products</h2>
      ${state.saved.length ? state.saved.map(item => `
        <div class="shelf-item">
          <button class="open" data-open="${item.id}">${esc(item.name)}<small>${esc(item.title)}</small></button>
          <button class="pill quiet" data-remove="${item.id}" aria-label="Remove ${esc(item.name)}">Remove</button>
        </div>`).join('') : '<p class="empty">Products you check and save will wait for you here.</p>'}
    </section>
    <section class="section">
      <h2>My Plan</h2>
      <div class="chips">
        ${[...goalLabels, `${skinLabel} Skin`, ...flagged].map(label => `<span class="chip">${esc(label)}</span>`).join('')}
      </div>
      <div class="actions">
        <button class="pill ghost" data-edit>Change My Plan</button>
        <button class="pill quiet" data-reset>Start Over</button>
      </div>
    </section>`;
  updateTally();
}

function updateTally() {
  const ids = todaysSteps().map(step => step.id);
  const count = doneToday().filter(id => ids.includes(id)).length;
  document.getElementById('tally').textContent = count === ids.length
    ? `All ${ids.length} done. Beautifully kept, see you tomorrow.`
    : `${count} of ${ids.length} done today`;
  document.getElementById('meter').style.width = `${(count / ids.length) * 100}%`;
}

function toggleStep(id) {
  const key = dateKey();
  state.done[key] = toggle(state.done[key] || [], id);
  save();
  const row = document.querySelector(`[data-step-row="${id}"]`);
  const isDone = state.done[key].includes(id);
  row.classList.toggle('done', isDone);
  row.querySelector('.tick').setAttribute('aria-pressed', isDone);
  updateTally();
}

/* Shell */

function currentRoute() {
  const [page, id] = location.hash.slice(1).split('/');
  return { page: page || 'library', id };
}

function render() {
  const { page, id } = currentRoute();
  const world = WORLDS.find(item => item.id === page);
  const tab = TABS.some(item => item.id === page) ? page : 'library';
  const isHome = tab === 'library' && page !== 'spring' && !world;

  app.className = isHome ? 'wide home' : world ? 'wide' : '';
  nav.hidden = page === 'ritual' && !!quiz;
  nav.innerHTML = TABS.map(item => `
    <a href="#${item.id}" ${item.id === tab ? 'aria-current="page"' : ''}>${item.label}</a>`).join('');

  if (!UNLOCKED) {
    nav.hidden = true;
    renderLibrary();
    app.insertAdjacentHTML('beforeend', `<p class="fine-print made-by"><a href="https://naturallywithanja.com/">Made by Anja at naturallywithanja.com</a></p>`);
    window.scrollTo(0, 0);
    return;
  }
  if (page === 'spring') renderSpring(id);
  else if (world) renderWorld(world);
  else ({ library: renderLibrary, shelf: renderShelf, check: renderCheck, ritual: renderRitual })[tab]();

  app.insertAdjacentHTML('beforeend', `<p class="fine-print" id="fine-print">Glowspring shares general wellness information and personal research, and it does not replace advice from your doctor or dermatologist. Words like "clean" and "non-toxic" have no legal definition, so our ingredient ratings are our own opinion, based on public safety reviews and EU and FDA standards. Patch test anything new, and check with your doctor if you are pregnant, nursing or taking medication.</p>
    <p class="fine-print made-by"><a href="https://naturallywithanja.com/">Made by Anja at naturallywithanja.com</a></p>`);
  window.scrollTo(0, 0);
}

function finishQuiz() {
  const A = quiz.a, goals = new Set(A.goals || []);
  if ((A.concerns || []).some(c => c !== 'none')) goals.add('skin');
  if ((A.hairq || []).some(h => h !== 'happy')) goals.add('hair');
  if (A.makeupq && A.makeupq !== 'none') goals.add('makeup');
  if (A.energy && A.energy !== 'steady') goals.add('energy');
  if (A.sleepq && A.sleepq !== 'good') goals.add('sleep');
  if (A.gutq && A.gutq !== 'happy') goals.add('gut');
  state.profile = { goals: [...goals], skin: A.skin, sensitivities: (A.sens || []).filter(s => s !== 'nothing'), answers: A };
  quiz = null;
  save();
  render();
}

app.addEventListener('click', event => {
  const link = event.target.closest('[data-shelf-group]');
  if (link) shelfFilter = link.dataset.shelfGroup;

  const el = event.target.closest('button');
  if (!el) return;
  const data = el.dataset;

  if ('jump' in data) {
    app.querySelectorAll('.section')[Number(data.jump)].scrollIntoView({ behavior: 'smooth', block: 'start' });
  } else if ('find' in data) {
    findProduct();
  } else if ('pick' in data) {
    const hit = productHits[Number(data.pick)];
    document.getElementById('list').value = hit.ingredients_text;
    document.getElementById('pres').innerHTML = `<p class="hint">Checking <b>${esc(hit.brands || '')} ${esc(hit.product_name || '')}</b>.</p>`;
    runCheck();
    document.getElementById('result').scrollIntoView({ behavior: 'smooth', block: 'start' });
  } else if ('start' in data) {
    quiz = blankQuiz();
    render();
  } else if ('qnext' in data) {
    quizNext();
  } else if ('qback' in data) {
    if (quiz.step > 0) quiz.step--; else quiz = null;
    render();
  } else if (data.qopt) {
    quizPick(data.qopt);
  } else if (data.step) {
    toggleStep(data.step);
  } else if ('run' in data) {
    runCheck();
  } else if ('sample' in data) {
    document.getElementById('list').value = SAMPLE_LIST;
    runCheck();
  } else if (data.shelf) {
    shelfFilter = data.shelf;
    render();
  } else if (data.open) {
    const item = state.saved.find(entry => entry.id === data.open);
    checkText = item.text;
    checkResult = analyze(item.text, sensitivities());
    location.hash = 'check';
  } else if (data.remove) {
    state.saved = state.saved.filter(entry => entry.id !== data.remove);
    save();
    render();
  } else if ('edit' in data) {
    quiz = { page: 1, ...state.profile };
    render();
  } else if ('reset' in data) {
    if (confirm('This clears your plan, progress and saved products from this device. Start over?')) {
      state = blankState();
      save();
      render();
    }
  }
});

app.addEventListener('input', event => {
  if (event.target.id === 'search') runSearch(event.target.value);
});

app.addEventListener('submit', event => {
  if (!event.target.matches('[data-save]')) return;
  event.preventDefault();
  const name = document.getElementById('save-name').value.trim();
  if (!name) return;
  state.saved.unshift({ id: String(Date.now()), name, text: checkText, title: checkResult.verdict.title });
  save();

  const form = event.target;
  form.outerHTML = state.profile
    ? '<p class="empty">Saved. You will find it on your Ritual page.</p>'
    : '<p class="empty">Saved on this device. Build your ritual to see your saved products.</p>';
});

window.addEventListener('hashchange', render);
render();

app.addEventListener('keydown', event => {
  if (event.target.id === 'pq' && event.key === 'Enter') findProduct();
});
