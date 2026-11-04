/* Postcard illustrations in one shared palette, in the grainy print style of Anja's saved cards.
   The #riso and #stipple filters that give the grain are defined in index.html. */

const P = {
  paper: '#FAF2E3', cream: '#F2E6D0', sand: '#D9BE94', peach: '#F2C9A4', mustard: '#DDAE45',
  coral: '#E6836E', orange: '#E68A3C', tangerine: '#F2AE5C', terra: '#C4673F', rust: '#94603C', orchid: '#CC95A2', wine: '#7C2E3E',
  olive: '#8C8C3E', sage: '#A9A866', moss: '#4E5527', deep: '#2E3118',
  blue: '#5F87A8', mist: '#9DB9C6', navy: '#2E4A63', lav: '#B9A9CF', ink: '#2B2A1C'
};

function leaf(x, y, len, angle, fill, rib = 'none', fat = 0.3) {
  const w = len * fat;
  return `<g transform="translate(${x} ${y}) rotate(${angle})">
    <path d="M0 0C${w} ${-len * 0.28} ${w} ${-len * 0.72} 0 ${-len}C${-w} ${-len * 0.72} ${-w} ${-len * 0.28} 0 0Z" fill="${fill}"/>
    ${rib === 'none' ? '' : `<path d="M0 ${-len * 0.06}V${-len * 0.9}" stroke="${rib}" stroke-width="1.4" fill="none"/>`}
  </g>`;
}

function sprig(x, y, len, angle, pairs, leafLen, fill, stem, rib = 'none', fat = 0.3) {
  const leaves = [];
  for (let i = 0; i < pairs; i++) {
    const at = -len * (0.2 + (0.7 * i) / pairs);
    const size = leafLen * (1 - (0.35 * i) / pairs);
    leaves.push(leaf(0, at, size, 52, fill, rib, fat), leaf(0, at - 4, size, -52, fill, rib, fat));
  }
  leaves.push(leaf(0, -len * 0.92, leafLen * 0.7, 0, fill, rib, fat));
  return `<g transform="translate(${x} ${y}) rotate(${angle})">
    <path d="M0 0C4 ${-len * 0.4} -3 ${-len * 0.7} 0 ${-len}" stroke="${stem}" stroke-width="2.6" stroke-linecap="round" fill="none"/>
    ${leaves.join('')}
  </g>`;
}

function citrus(cx, cy, r, rind = P.mustard, flesh = P.coral) {
  const n = 9;
  const wedges = [];
  for (let i = 0; i < n; i++) {
    const a1 = ((i + 0.1) / n) * Math.PI * 2;
    const a2 = ((i + 0.9) / n) * Math.PI * 2;
    const inner = r * 0.08;
    const outer = r * 0.8;
    const pt = (a, d) => `${(cx + Math.cos(a) * d).toFixed(1)} ${(cy + Math.sin(a) * d).toFixed(1)}`;
    wedges.push(`<path d="M${pt((a1 + a2) / 2, inner)}L${pt(a1, outer)}Q${pt((a1 + a2) / 2, outer * 1.08)} ${pt(a2, outer)}Z" fill="${flesh}" stroke="${flesh}" stroke-width="${r * 0.05}" stroke-linejoin="round"/>`);
  }
  return `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${rind}"/><circle cx="${cx}" cy="${cy}" r="${r * 0.9}" fill="${P.paper}"/>${wedges.join('')}`;
}

function petals(cx, cy, len, n, fill, fat = 0.38) {
  return Array.from({ length: n }, (_, i) => leaf(cx, cy, len, (360 / n) * i, fill, 'none', fat)).join('');
}

function rays(cx, cy, r1, r2, n, fill) {
  return Array.from({ length: n }, (_, i) => `<path transform="translate(${cx} ${cy}) rotate(${(360 / n) * i})" d="M-5 ${-r1}L0 ${-r2}L5 ${-r1}Z" fill="${fill}"/>`).join('');
}

function star(x, y, r, fill) {
  return `<path d="M${x} ${y - r}Q${x} ${y} ${x + r} ${y}Q${x} ${y} ${x} ${y + r}Q${x} ${y} ${x - r} ${y}Q${x} ${y} ${x} ${y - r}Z" fill="${fill}"/>`;
}

const stipple = shapes => `<g filter="url(#stipple)">${shapes}</g>`;

function capsule(x, y, angle) {
  return `<g transform="translate(${x} ${y}) rotate(${angle})">
    <rect x="-22" y="-9" width="26" height="18" rx="9" fill="${P.paper}"/>
    <rect x="-4" y="-9" width="26" height="18" rx="9" fill="${P.mustard}"/>
    <rect x="-4" y="-9" width="8" height="18" fill="${P.mustard}"/>
  </g>`;
}

function wideCard(bg, label, shapes) {
  return `<svg viewBox="0 0 600 300" preserveAspectRatio="xMidYMid slice" role="img" aria-label="${label}">
    <rect width="600" height="300" fill="${bg}"/>
    <g filter="url(#riso)">${shapes}</g>
  </svg>`;
}

function card(bg, label, shapes) {
  return `<svg viewBox="0 0 300 380" preserveAspectRatio="xMidYMid slice" role="img" aria-label="${label}">
    <rect width="300" height="380" fill="${bg}"/>
    <g filter="url(#riso)">${shapes}</g>
  </svg>`;
}

const ART = {
  source: () => `<img class="photo-art" src="https://images.pexels.com/photos/11485121/pexels-photo-11485121.jpeg?auto=compress&cs=tinysrgb&w=1400" alt="An amber dropper bottle on a marble tray with yellow wildflowers" style="width:100%;height:100%;object-fit:cover;display:block">`,

  routine: () => card(P.mustard, 'Folded washcloths with a gua sha stone', `
    <ellipse cx="150" cy="320" rx="104" ry="10" fill="${P.rust}" opacity=".6"/>
    <rect x="56" y="250" width="188" height="66" rx="16" fill="${P.paper}"/>
    <rect x="56" y="270" width="188" height="9" fill="${P.coral}"/>
    ${stipple(`<rect x="196" y="250" width="48" height="66" rx="16" fill="${P.sand}"/>`)}
    <rect x="78" y="196" width="144" height="58" rx="14" fill="${P.peach}"/>
    <rect x="78" y="214" width="144" height="8" fill="${P.paper}"/>
    ${stipple(`<rect x="186" y="196" width="36" height="58" rx="14" fill="${P.terra}"/>`)}
    <g transform="rotate(-12 150 150)">
      <path d="M104 132Q128 106 150 128Q172 106 196 132C222 162 200 192 150 196C100 192 78 162 104 132Z" fill="${P.sage}"/>
      ${stipple(`<path d="M150 196C200 192 222 162 196 132C204 164 186 186 150 196Z" fill="${P.moss}"/>`)}
    </g>
    ${sprig(242, 196, 70, 24, 3, 22, P.moss, P.moss, 'none', 0.3)}
  `),

  water: () => card(P.sand, 'A drop of clear water with ripples', `
    <ellipse cx="150" cy="324" rx="112" ry="16" fill="none" stroke="${P.blue}" stroke-width="4"/>
    <ellipse cx="150" cy="324" rx="66" ry="9" fill="none" stroke="${P.blue}" stroke-width="4"/>
    <path d="M150 52C150 52 72 160 72 228A78 78 0 0 0 228 228C228 160 150 52 150 52Z" fill="${P.mist}"/>
    ${stipple(`<path d="M150 52C150 52 228 160 228 228A78 78 0 0 1 168 304C204 256 200 150 150 52Z" fill="${P.blue}"/>`)}
    <path d="M112 196C104 222 108 250 126 268" stroke="${P.paper}" stroke-width="9" stroke-linecap="round" fill="none"/>
  `),

  teas: () => card(P.sage, 'A cup of herbal tea on a saucer', `
    <path d="M128 168C116 146 140 132 128 104M162 168C150 146 174 132 162 104" stroke="${P.paper}" stroke-width="4" stroke-linecap="round" fill="none"/>
    <ellipse cx="150" cy="300" rx="112" ry="20" fill="${P.paper}"/>
    ${stipple(`<ellipse cx="150" cy="306" rx="112" ry="14" fill="${P.sand}"/>`)}
    <circle cx="226" cy="226" r="22" fill="none" stroke="${P.paper}" stroke-width="11"/>
    <path d="M76 194H224C224 256 192 298 150 298C108 298 76 256 76 194Z" fill="${P.paper}"/>
    ${stipple(`<path d="M190 194H224C224 256 192 298 150 298C182 270 192 236 190 194Z" fill="${P.sand}"/>`)}
    <ellipse cx="150" cy="196" rx="74" ry="13" fill="${P.rust}"/>
    ${leaf(52, 308, 46, -70, P.moss, P.olive, 0.34)}${leaf(60, 316, 38, -40, P.olive, P.moss, 0.34)}
  `),

  supplements: () => card(P.lav, 'An amber supplement jar with capsules', `
    <ellipse cx="146" cy="318" rx="84" ry="10" fill="${P.navy}" opacity=".35"/>
    <rect x="92" y="96" width="108" height="40" rx="8" fill="${P.ink}"/>
    <path d="M86 140H206Q222 140 222 160V296Q222 314 204 314H88Q70 314 70 296V160Q70 140 86 140Z" fill="${P.rust}"/>
    ${stipple(`<path d="M180 140H206Q222 140 222 160V296Q222 314 204 314H178Q196 230 180 140Z" fill="${P.ink}"/>`)}
    <rect x="70" y="190" width="152" height="76" fill="${P.cream}"/>
    ${sprig(146, 256, 52, 90, 3, 15, P.moss, P.moss)}
    ${capsule(232, 322, -24)}${capsule(254, 296, 40)}${capsule(44, 330, 18)}
  `),

  masks: () => card(P.mist, 'A bowl of honey with a wooden dipper and oats', `
    <ellipse cx="150" cy="330" rx="88" ry="10" fill="${P.blue}"/>
    <g transform="rotate(-34 214 138)">
      <rect x="208" y="20" width="12" height="150" rx="6" fill="${P.rust}"/>
      ${[0, 1, 2, 3].map(i => `<ellipse cx="214" cy="${178 + i * 13}" rx="${22 - i * 2}" ry="7" fill="${P.rust}"/>`).join('')}
    </g>
    <ellipse cx="150" cy="190" rx="112" ry="36" fill="${P.sand}"/>
    <ellipse cx="150" cy="196" rx="98" ry="27" fill="${P.mustard}"/>
    ${stipple(`<ellipse cx="170" cy="202" rx="70" ry="18" fill="${P.terra}"/>`)}
    <path d="M38 194C44 280 96 324 150 324C204 324 256 280 262 194C226 230 74 230 38 194Z" fill="${P.paper}"/>
    <path d="M214 214C214 232 222 236 222 246C222 256 208 256 208 246C208 236 214 232 214 214Z" fill="${P.mustard}"/>
    ${stipple(`<path d="M188 320C228 308 258 266 262 194C252 204 236 210 216 216C218 256 208 296 188 320Z" fill="${P.sand}"/>`)}
    ${[[62, 352, 20], [86, 360, -30], [232, 356, 50], [250, 346, 10], [210, 364, -10]].map(([x, y, a]) => `<ellipse cx="${x}" cy="${y}" rx="8" ry="4.5" transform="rotate(${a} ${x} ${y})" fill="${P.cream}"/>`).join('')}
  `),

  inside: () => card(P.moss, 'A halved orange showing its segments', `
    ${leaf(150, 92, 74, -38, P.olive, P.moss, 0.32)}${leaf(150, 92, 66, 30, P.sage, P.moss, 0.32)}
    ${citrus(150, 212, 118, P.orange, P.tangerine)}
    ${stipple(`<path d="M150 94a118 118 0 0 1 0 236a100 118 0 0 0 0-236Z" fill="${P.terra}"/>`)}
  `),

  outside: () => card(P.blue, 'A whole orange with its leaves', `
    <ellipse cx="150" cy="340" rx="96" ry="12" fill="${P.navy}"/>
    <circle cx="150" cy="212" r="118" fill="${P.orange}"/>
    ${stipple(`<path d="M150 94a118 118 0 0 1 0 236a100 118 0 0 0 0-236Z" fill="${P.terra}"/>`)}
    ${[[96, 160], [124, 132], [88, 214], [112, 252], [150, 286], [196, 270], [214, 196], [176, 156], [136, 196], [168, 232], [232, 236], [120, 296]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="2.6" fill="${P.terra}"/>`).join('')}
    <ellipse cx="110" cy="156" rx="34" ry="20" transform="rotate(-38 110 156)" fill="${P.paper}" opacity=".5"/>
    <circle cx="150" cy="98" r="9" fill="${P.moss}"/>
    ${leaf(150, 96, 78, -40, P.moss, P.olive, 0.32)}${leaf(150, 96, 68, 34, P.olive, P.moss, 0.32)}
  `),

  food: () => card(P.olive, 'A bowl of fruit and greens', `
    <ellipse cx="150" cy="330" rx="84" ry="10" fill="${P.moss}"/>
    <ellipse cx="150" cy="182" rx="112" ry="38" fill="${P.sand}"/>
    ${leaf(66, 188, 72, -30, P.moss, P.olive, 0.34)}${leaf(232, 188, 76, 26, P.moss, P.olive, 0.34)}
    ${leaf(150, 176, 78, 6, P.deep, P.olive, 0.34)}${leaf(120, 182, 70, -14, P.moss, P.olive, 0.34)}
    ${citrus(186, 148, 38)}
    <circle cx="112" cy="156" r="27" fill="${P.terra}"/>${stipple(`<circle cx="118" cy="162" r="21" fill="${P.wine}"/>`)}
    <circle cx="150" cy="176" r="16" fill="${P.wine}"/><circle cx="82" cy="182" r="13" fill="${P.wine}"/>
    <circle cx="230" cy="180" r="14" fill="${P.deep}"/><circle cx="208" cy="192" r="11" fill="${P.wine}"/>
    <path d="M36 186C42 276 96 322 150 322C204 322 258 276 264 186C228 222 72 222 36 186Z" fill="${P.paper}"/>
    ${stipple(`<path d="M186 318C226 306 258 262 264 186C254 196 236 203 214 208C216 250 206 292 186 318Z" fill="${P.sand}"/>`)}
  `),

  drink: () => card(P.mustard, 'A glass of green drink with a lemon slice', `
    <ellipse cx="150" cy="330" rx="66" ry="9" fill="${P.rust}"/>
    ${sprig(128, 150, 96, -8, 3, 34, P.moss, P.moss, P.olive, 0.34)}
    <path d="M92 104H208L194 324Q192 332 184 332H116Q108 332 106 324Z" fill="${P.paper}"/>
    <path d="M95 142H205L193 318Q192 324 186 324H114Q108 324 107 318Z" fill="${P.olive}"/>
    ${stipple(`<path d="M168 142H205L193 318Q192 324 186 324H160Z" fill="${P.moss}"/>`)}
    <circle cx="136" cy="176" r="6" fill="${P.sage}"/><circle cx="128" cy="220" r="4" fill="${P.sage}"/><circle cx="150" cy="248" r="5" fill="${P.sage}"/>
    ${citrus(208, 112, 44, P.terra, P.mustard)}
  `),

  movement: () => card(P.coral, 'A winding path over hills toward the sun', `
    <circle cx="204" cy="112" r="50" fill="${P.paper}"/>
    <path d="M0 214C60 174 120 196 176 206S272 176 300 190V380H0Z" fill="${P.sage}"/>
    <path d="M0 268C70 232 150 236 300 262V380H0Z" fill="${P.olive}"/>
    <path d="M0 322C90 288 210 302 300 330V380H0Z" fill="${P.moss}"/>
    <path d="M168 205C188 216 176 232 132 244C70 262 76 286 150 300C232 316 222 348 142 382H210C286 346 290 310 204 288C146 274 152 262 192 250C224 238 214 216 182 203Z" fill="${P.cream}"/>
    ${leaf(58, 276, 104, 0, P.deep, 'none', 0.15)}${leaf(86, 262, 76, 0, P.deep, 'none', 0.16)}${leaf(250, 262, 86, 0, P.deep, 'none', 0.15)}
    ${stipple(`<path d="M0 322C90 288 210 302 300 330V380H0Z" fill="${P.deep}"/>`)}
  `),

  rest: () => card(P.navy, 'A crescent moon over still water', `
    <circle cx="160" cy="118" r="60" fill="${P.paper}"/><circle cx="184" cy="104" r="55" fill="${P.navy}"/>
    ${star(62, 72, 11, P.peach)}${star(248, 62, 8, P.peach)}${star(236, 158, 10, P.paper)}${star(44, 164, 7, P.peach)}${star(112, 42, 6, P.paper)}
    <rect y="246" width="300" height="134" fill="${P.blue}"/>
    ${stipple(`<rect y="306" width="300" height="74" fill="${P.navy}"/>`)}
    <path d="M112 266H178M96 288H164M118 310H158" stroke="${P.paper}" stroke-width="4" stroke-linecap="round"/>
    ${sprig(36, 382, 170, 5, 4, 46, P.deep, P.deep)}${sprig(270, 386, 130, -6, 3, 40, P.deep, P.deep)}
  `),

  skincare: () => card(P.peach, 'An amber dropper bottle with leaves', `
    ${sprig(92, 300, 210, -18, 4, 56, P.olive, P.moss, P.moss, 0.32)}
    <ellipse cx="160" cy="335" rx="76" ry="9" fill="${P.sand}"/>
    <path d="M136 74Q136 48 158 48Q180 48 180 74V112H136Z" fill="${P.wine}"/>
    <rect x="128" y="108" width="60" height="34" rx="5" fill="${P.ink}"/>
    <path d="M136 142H180V162Q180 170 190 174Q218 186 218 216V316Q218 334 200 334H116Q98 334 98 316V216Q98 186 126 174Q136 170 136 162Z" fill="${P.rust}"/>
    ${stipple(`<path d="M176 172Q218 186 218 216V316Q218 334 200 334H172Q186 260 176 172Z" fill="${P.ink}"/>`)}
    <rect x="98" y="226" width="120" height="72" fill="${P.cream}"/>
    ${sprig(158, 288, 54, 90, 3, 15, P.moss, P.moss)}
  `),

  makeup: () => card(P.orchid, 'A powder compact, lipstick and brush', `
    <g transform="rotate(32 92 170)">
      <rect x="80" y="170" width="24" height="170" rx="11" fill="${P.rust}"/>
      <rect x="78" y="136" width="28" height="42" fill="${P.sand}"/>
      <path d="M78 136C70 96 82 66 92 54C102 66 114 96 106 136Z" fill="${P.peach}"/>
    </g>
    <rect x="202" y="246" width="56" height="86" rx="4" fill="${P.ink}"/>
    <rect x="208" y="196" width="44" height="54" fill="${P.mustard}"/>
    ${stipple(`<rect x="232" y="196" width="20" height="54" fill="${P.rust}"/>`)}
    <path d="M214 196V132Q214 120 226 112L246 100V196Z" fill="${P.wine}"/>
    <circle cx="118" cy="262" r="74" fill="${P.mustard}"/>
    <circle cx="118" cy="262" r="60" fill="${P.peach}"/>
    ${stipple(`<circle cx="118" cy="262" r="60" fill="${P.terra}"/>`)}
    <path d="M78 262Q118 228 158 262Q118 296 78 262Z" fill="${P.paper}" opacity=".5"/>
  `),

  hair: () => card(P.sage, 'A wooden comb and a sprig of rosemary', `
    <g transform="rotate(-24 150 210)">
      ${Array.from({ length: 16 }, (_, i) => `<rect x="${48 + i * 13.2}" y="206" width="7.4" height="${i % 8 === 7 ? 66 : 74}" rx="3.6" fill="${P.rust}"/>`).join('')}
      <path d="M40 212V176Q40 150 70 150H230Q260 150 260 176V212Z" fill="${P.rust}"/>
      ${stipple(`<path d="M40 212V192H260V212Z" fill="${P.ink}"/>`)}
    </g>
    ${sprig(66, 150, 150, 58, 7, 40, P.deep, P.moss, 'none', 0.12)}
  `),

  appearance: () => card(P.blue, 'A round mirror on a stand with a sprig', `
    <path d="M150 288V334" stroke="${P.sand}" stroke-width="12"/>
    <path d="M92 344Q150 318 208 344Z" fill="${P.sand}"/>
    <ellipse cx="150" cy="168" rx="94" ry="128" fill="${P.sand}"/>
    <ellipse cx="150" cy="168" rx="80" ry="113" fill="${P.peach}"/>
    ${stipple(`<ellipse cx="150" cy="168" rx="80" ry="113" fill="${P.coral}"/>`)}
    <path d="M96 118L150 66L168 76L88 170Q84 142 96 118ZM96 214L186 86L200 102L112 246Q102 232 96 214Z" fill="${P.paper}" opacity=".62"/>
    ${sprig(218, 344, 120, 18, 3, 40, P.deep, P.deep, 'none', 0.3)}
  `),

  scent: () => card(P.lav, 'A terracotta perfume vase with scent rising', `
    <path d="M150 88C128 72 170 58 150 36M116 92C98 76 136 60 118 44M184 92C166 76 204 60 186 44" stroke="${P.paper}" stroke-width="4" stroke-linecap="round" fill="none"/>
    <ellipse cx="150" cy="340" rx="76" ry="9" fill="${P.rust}" opacity=".55"/>
    <path d="M104 150C74 150 66 194 98 214M196 150C226 150 234 194 202 214" stroke="${P.terra}" stroke-width="11" fill="none" stroke-linecap="round"/>
    <path d="M108 104H192V120Q192 128 182 130Q176 142 186 158C232 196 226 280 186 322Q180 334 150 334Q120 334 114 322C74 280 68 196 114 158Q124 142 118 130Q108 128 108 120Z" fill="${P.coral}"/>
    ${stipple(`<path d="M172 136Q176 142 186 158C232 196 226 280 186 322Q180 334 158 334C204 270 200 196 172 136Z" fill="${P.terra}"/>`)}
    ${sprig(106, 252, 96, 88, 4, 26, P.moss, P.moss, 'none', 0.28)}
  `)
};

function heroArt() {
  return `<img class="photo-art" src="https://images.pexels.com/photos/7796161/pexels-photo-7796161.jpeg?auto=compress&cs=tinysrgb&w=2000" alt="Natural skincare on a wooden tray with amber bottles, a dry brush and dried pampas grass" style="width:100%;height:100%;object-fit:cover;object-position:center 50%;display:block">`;
}
