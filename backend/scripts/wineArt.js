/**
 * Generates premium SVG bottle art per wine (returned as a data URI).
 * Each bottle is tinted by wine type and personalized with the
 * wine's name and winery on a gold label — no external assets needed.
 */

const TYPE_COLORS = {
  Red: { liquid: '#3d0d1a', liquid2: '#6b1029', glow: '#a4133c' },
  White: { liquid: '#5d4a1e', liquid2: '#c9a84c', glow: '#e3c567' },
  'Rosé': { liquid: '#6d2434', liquid2: '#d4697f', glow: '#f0a2b0' },
  Sparkling: { liquid: '#4a3b12', liquid2: '#d4b95e', glow: '#f0dc94' },
  Dessert: { liquid: '#5e3a10', liquid2: '#d99a3d', glow: '#f3c169' },
  Fortified: { liquid: '#3a0f14', liquid2: '#7d2233', glow: '#b8455c' },
};

const esc = (s) =>
  String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

function truncate(str, n) {
  str = String(str);
  return str.length > n ? str.slice(0, n - 1).trimEnd() + '…' : str;
}

function wrapLabel(text, maxChars, maxLines) {
  const words = String(text).split(/\s+/);
  const lines = [];
  let line = '';
  for (const w of words) {
    if ((line + ' ' + w).trim().length > maxChars && line) {
      lines.push(line.trim());
      line = w;
      if (lines.length === maxLines - 1) break;
    } else {
      line = (line + ' ' + w).trim();
    }
  }
  if (line && lines.length < maxLines) lines.push(line);
  return lines;
}

function bottleSvg({ name, winery, type, vintage }) {
  const c = TYPE_COLORS[type] || TYPE_COLORS.Red;
  const year = vintage || '';
  const nameLines = wrapLabel(truncate(name, 60), 20, 3);
  const wineryLine = truncate(winery, 30).toUpperCase();

  const nameTspans = nameLines
    .map(
      (l, i) =>
        `<tspan x="100" dy="${i === 0 ? 0 : 17}">${esc(l)}</tspan>`
    )
    .join('');

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="400" viewBox="0 0 200 400">
  <defs>
    <linearGradient id="glass" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="${c.liquid}"/>
      <stop offset="0.22" stop-color="${c.liquid2}"/>
      <stop offset="0.55" stop-color="${c.liquid}"/>
      <stop offset="0.8" stop-color="${c.liquid2}"/>
      <stop offset="1" stop-color="${c.liquid}"/>
    </linearGradient>
    <linearGradient id="foil" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#3a2a4d"/>
      <stop offset="0.5" stop-color="#171021"/>
      <stop offset="1" stop-color="#3a2a4d"/>
    </linearGradient>
    <linearGradient id="label" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#faf6ee"/>
      <stop offset="1" stop-color="#ece2cf"/>
    </linearGradient>
    <linearGradient id="gold" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#b98a2e"/>
      <stop offset="0.5" stop-color="#e9c46a"/>
      <stop offset="1" stop-color="#b98a2e"/>
    </linearGradient>
    <radialGradient id="glow" cx="0.5" cy="0.35" r="0.75">
      <stop offset="0" stop-color="${c.glow}" stop-opacity="0.28"/>
      <stop offset="1" stop-color="${c.glow}" stop-opacity="0"/>
    </radialGradient>
  </defs>

  <rect width="200" height="400" fill="none"/>

  <!-- ambient glow behind the bottle -->
  <ellipse cx="100" cy="190" rx="95" ry="180" fill="url(#glow)"/>

  <!-- bottle body -->
  <path d="M85 96 L85 30 C85 20 87 12 92 12 L108 12 C113 12 115 20 115 30 L115 96
           C115 106 118 112 126 120 C138 132 143 148 143 172 L143 356 C143 374 134 386 100 386
           C66 386 57 374 57 356 L57 172 C57 148 62 132 74 120 C82 112 85 106 85 96 Z"
        fill="url(#glass)"/>

  <!-- capsule / foil -->
  <path d="M84 8 L116 8 L116 62 L84 62 Z" fill="url(#foil)"/>
  <rect x="84" y="8" width="32" height="4" rx="2" fill="#c9a24b"/>
  <rect x="84" y="54" width="32" height="2" fill="url(#gold)" opacity="0.8"/>

  <!-- shoulder highlight -->
  <path d="M74 122 C64 134 60 150 60 170 L60 200 C66 176 72 150 86 128 Z" fill="#ffffff" opacity="0.07"/>
  <rect x="120" y="150" width="7" height="200" rx="3.5" fill="#ffffff" opacity="0.05"/>

  <!-- label -->
  <rect x="63" y="196" width="74" height="132" rx="4" fill="url(#label)"/>
  <rect x="63" y="196" width="74" height="132" rx="4" fill="none" stroke="url(#gold)" stroke-width="1.4"/>

  <text x="100" y="216" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif"
        font-size="9" letter-spacing="2.2" fill="#7a5c1e">${esc(wineryLine)}</text>
  <rect x="86" y="224" width="28" height="1" fill="url(#gold)"/>

  <text x="100" y="248" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif"
        font-size="14" fill="#2c1420" font-style="italic">
    <tspan>${nameTspans}</tspan>
  </text>

  <text x="100" y="308" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif"
        font-size="10" letter-spacing="1.5" fill="#8a6d3b">${esc(type.toUpperCase())}</text>

  <text x="100" y="322" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif"
        font-size="9" letter-spacing="2" fill="#9a8a6a">${year ? esc(String(year)) : ''}</text>

  <!-- reflection -->
  <path d="M84 10 L88 10 L88 60 L84 60 Z" fill="#ffffff" opacity="0.12"/>
</svg>`;

  return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
}

module.exports = { bottleSvg };
