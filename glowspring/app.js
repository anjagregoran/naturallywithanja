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
const QUIZ_PAGES = 3;

const blankState = () => ({ profile: null, done: {}, saved: [] });
const blankQuiz = () => ({ page: 1, goals: [], skin: null, sensitivities: [] });

let state = load();
let quiz = null;
let shelfFilter = 'makeup';
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

function renderLibrary() {
  app.innerHTML = `
    <section class="hero">
      <div class="hero-art">${heroArt()}</div>
      <div class="hero-text">
        <span class="label">Glow From Nature</span>
        <h1>Glowspring</h1>
        <p class="script hero-script">healthy is the new pretty</p>
      </div>
    </section>
    <section class="statement">
      <span class="label">Where It All Comes From</span>
      <h2>Looks and health come from two places, <em>inside</em> and <em>outside</em>.</h2>
      <p class="lede">Each one has its roots, the daily habits everything grows from, and its remedies, the products and homemade things you use.</p>
    </section>
    <div class="doors">
      ${WORLDS.map(world => postcard(`#${world.id}`, ART[world.id](), world.name, `<p>${esc(world.line)}</p>`, 'door')).join('')}
    </div>
    <section class="glow">
      <p class="script glow-quote">your health is your glow</p>
      <p class="glow-line">Become incredibly attractive through health.</p>
    </section>
    <input class="search" id="search" type="search" aria-label="Search the library" placeholder="Search rosehip, henna, debloat..." autocomplete="off">
    <div id="found"></div>
    <div id="home" class="column">
      <section class="section">
        <h2>Use It</h2>
        <a class="link-row" href="#check"><h3>Check A Product</h3><p>Paste any ingredient list and see each ingredient judged.</p></a>
        <a class="link-row" href="#ritual"><h3>Take The Quiz</h3><p>Answer three questions and get a daily routine, plus the sections and brands that fit you.</p></a>
        <a class="link-row" href="#shelf"><h3>Browse The Shelf</h3><p>Every brand I have researched or wished for.</p></a>
      </section>
      <section class="section origin">
        <div class="origin-art">${ART.source()}</div>
        <span class="label">Why Glowspring</span>
        <p>The name comes from <i>izvor</i>, the Croatian word for a spring of fresh water and also for a source. A spring begins deep inside the earth, where rain slowly finds its way through stone until it rises clean and clear, and every river, and in the end the sea itself, is fed by countless springs like it.</p>
        <p>Beauty works the same way. It begins with its roots, the water you drink, the food you eat, how you move and how you sleep. Then it grows with its remedies, what you take inside and the products you use on the outside, until it rises to the surface as glowing skin, shiny hair and the way you carry yourself.</p>
        <p>This is mine, everything I have researched on looking and feeling your best, gathered in one place.</p>
      </section>
    </div>`;
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
  const entries = SHELF.filter(entry => entry.group === shelfFilter);

  app.innerHTML = `
    <span class="label">The Shelf</span>
    <h1>What I would reach for.</h1>
    <p class="lede">The brands from my notes and my own wishlist. Please read each ingredient list yourself, or paste it into Check.</p>
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

function renderQuiz() {
  const { page } = quiz;
  const label = `Step ${page} Of ${QUIZ_PAGES}`;
  const foot = (disabled, next = 'Continue') => `
    <div class="onboard-foot">
      <button class="pill quiet" data-back>Back</button>
      <button class="pill" data-next ${disabled ? 'disabled' : ''}>${next}</button>
    </div>`;

  if (page === 1) {
    app.innerHTML = `
      <span class="label">${label}</span>
      <h1>What would you love to work on?</h1>
      <p class="lede">Choose as many as you like, and your ritual will be built around them.</p>
      <div class="choices">
        ${GOALS.map(goal => `
          <button class="choice" data-goal="${goal.id}" aria-pressed="${quiz.goals.includes(goal.id)}">
            ${goal.label}<small>${goal.note}</small>
          </button>`).join('')}
      </div>
      ${foot(!quiz.goals.length)}`;
  } else if (page === 2) {
    app.innerHTML = `
      <span class="label">${label}</span>
      <h1>How does your skin usually feel?</h1>
      <p class="lede">This helps us choose the right oil or cream for your evenings.</p>
      <div class="choices">
        ${SKIN_TYPES.map(type => `
          <button class="choice" data-skin="${type.id}" aria-pressed="${quiz.skin === type.id}">${type.label}</button>`).join('')}
      </div>
      ${foot(!quiz.skin)}`;
  } else {
    app.innerHTML = `
      <span class="label">${label}</span>
      <h1>Anything we should look out for?</h1>
      <p class="lede">The ingredient checker will flag these for you. You can leave them all blank.</p>
      <div class="choices">
        ${SENSITIVITIES.map(item => `
          <button class="choice" data-sensitivity="${item.id}" aria-pressed="${quiz.sensitivities.includes(item.id)}">${item.label}</button>`).join('')}
      </div>
      ${foot(false, 'See My Ritual')}`;
  }
}

function renderRitualIntro() {
  app.innerHTML = `
    <span class="label">The Quiz</span>
    <h1>Made for you.</h1>
    <p class="lede">Answer three quick questions about your goals and your skin. We will build a simple morning, daytime and evening ritual you can tick off each day, and pick the sections and brands that fit you.</p>
    <div class="actions"><button class="pill" data-start>Start The Quiz</button></div>`;
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

  if (page === 'spring') renderSpring(id);
  else if (world) renderWorld(world);
  else ({ library: renderLibrary, shelf: renderShelf, check: renderCheck, ritual: renderRitual })[tab]();

  app.insertAdjacentHTML('beforeend', `<p class="fine-print" id="fine-print">Glowspring shares general wellness information and personal research, and it does not replace advice from your doctor or dermatologist. Words like "clean" and "non-toxic" have no legal definition, so our ingredient ratings are our own opinion, based on public safety reviews and EU and FDA standards. Patch test anything new, and check with your doctor if you are pregnant, nursing or taking medication.</p>
    <p class="fine-print made-by"><a href="https://naturallywithanja.com/">Made by Anja at naturallywithanja.com</a></p>`);
  window.scrollTo(0, 0);
}

function finishQuiz() {
  state.profile = { goals: quiz.goals, skin: quiz.skin, sensitivities: quiz.sensitivities };
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
  } else if ('start' in data) {
    quiz = blankQuiz();
    render();
  } else if ('next' in data) {
    if (quiz.page < QUIZ_PAGES) {
      quiz.page++;
      render();
    } else {
      finishQuiz();
    }
  } else if ('back' in data) {
    quiz.page--;
    if (!quiz.page) quiz = null;
    render();
  } else if (data.goal) {
    quiz.goals = toggle(quiz.goals, data.goal);
    renderQuiz();
  } else if (data.skin) {
    quiz.skin = data.skin;
    renderQuiz();
  } else if (data.sensitivity) {
    quiz.sensitivities = toggle(quiz.sensitivities, data.sensitivity);
    renderQuiz();
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
