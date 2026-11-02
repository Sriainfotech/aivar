
(function(){
const IMG = {
  datego_jar:"/assets/aivar/aivar-marketing-005.webp", datego_pouch:"/assets/aivar/aivar-marketing-015.webp", makhana:"/assets/aivar/aivar-marketing-009.webp",
  makhana_range:"/assets/aivar/aivar-marketing-008.webp", makhana_chips:"/assets/aivar/aivar-marketing-011.webp", mango:"/assets/aivar/aivar-marketing-012.webp",
  millet_spread:"/assets/aivar/aivar-marketing-013.webp", hummus:"/assets/aivar/aivar-marketing-010.webp", millet_snacks:"/assets/aivar/aivar-marketing-014.webp",
  olive:"/assets/aivar/aivar-marketing-019.webp", dressing:"/assets/aivar/aivar-marketing-020.webp", vinegar:"/assets/aivar/aivar-marketing-021.webp", eat_smart:"/assets/aivar/aivar-marketing-007.webp"
};
/* ===== AIVAR illustrated art (palm oil packs, packaging scene) ===== */
const ART_DEFS = `<svg width="0" height="0" style="position:absolute" aria-hidden="true" focusable="false"><defs>
<linearGradient id="og" x1="0" x2="1"><stop offset="0" stop-color="#A85A02"/><stop offset=".22" stop-color="#E39A0C"/><stop offset=".42" stop-color="#FFD866"/><stop offset=".62" stop-color="#F0AE18"/><stop offset="1" stop-color="#8E4A02"/></linearGradient>
<linearGradient id="ogv" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFE7A1" stop-opacity=".55"/><stop offset=".25" stop-color="#FFE7A1" stop-opacity="0"/></linearGradient>
<linearGradient id="tinG" x1="0" x2="1"><stop offset="0" stop-color="#7C868D"/><stop offset=".18" stop-color="#C9D1D6"/><stop offset=".38" stop-color="#F4F7F8"/><stop offset=".6" stop-color="#B3BCC2"/><stop offset="1" stop-color="#6B747B"/></linearGradient>
<linearGradient id="capG" x1="0" x2="1"><stop offset="0" stop-color="#042A0B"/><stop offset=".45" stop-color="#1F8A36"/><stop offset=".7" stop-color="#0E5A20"/><stop offset="1" stop-color="#031F08"/></linearGradient>
<linearGradient id="lblG" x1="0" x2="1"><stop offset="0" stop-color="#062F10"/><stop offset=".45" stop-color="#0F5E22"/><stop offset="1" stop-color="#05280D"/></linearGradient>
<linearGradient id="hl" x1="0" x2="1"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".5" stop-color="#fff" stop-opacity=".7"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
<radialGradient id="fruit" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#FFC27A"/><stop offset=".35" stop-color="#F06A1E"/><stop offset=".75" stop-color="#9C1B0E"/><stop offset="1" stop-color="#3D0705"/></radialGradient>
<radialGradient id="bgOil" cx=".55" cy=".3" r=".85"><stop offset="0" stop-color="#2A7A33"/><stop offset=".45" stop-color="#0C3E17"/><stop offset="1" stop-color="#03160A"/></radialGradient>
<radialGradient id="glow" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#FFD866" stop-opacity=".45"/><stop offset="1" stop-color="#FFD866" stop-opacity="0"/></radialGradient>
<linearGradient id="plinth" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2E5A33"/><stop offset="1" stop-color="#0D2611"/></linearGradient>
<linearGradient id="packBg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#F1F6E9"/><stop offset="1" stop-color="#D7E6C6"/></linearGradient>
<linearGradient id="kraft" x1="0" x2="1"><stop offset="0" stop-color="#B98A4E"/><stop offset=".5" stop-color="#D9AE72"/><stop offset="1" stop-color="#A97A40"/></linearGradient>
<linearGradient id="pouchG" x1="0" x2="1"><stop offset="0" stop-color="#062F10"/><stop offset=".4" stop-color="#14702A"/><stop offset=".7" stop-color="#0B4D1B"/><stop offset="1" stop-color="#042209"/></linearGradient>
<linearGradient id="spreadG" x1="0" x2="1"><stop offset="0" stop-color="#4A1C08"/><stop offset=".45" stop-color="#8A3D14"/><stop offset="1" stop-color="#3A1405"/></linearGradient>
<linearGradient id="glassG" x1="0" x2="1"><stop offset="0" stop-color="#fff" stop-opacity=".25"/><stop offset=".3" stop-color="#fff" stop-opacity=".05"/><stop offset=".55" stop-color="#fff" stop-opacity=".35"/><stop offset="1" stop-color="#fff" stop-opacity=".08"/></linearGradient>
<linearGradient id="goldG" x1="0" x2="1"><stop offset="0" stop-color="#9C7A2C"/><stop offset=".5" stop-color="#F1D27A"/><stop offset="1" stop-color="#8E6B22"/></linearGradient>
<filter id="blur8" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="8"/></filter>
<filter id="blur3" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="3"/></filter>
</defs></svg>`;

const f1 = n => (+n).toFixed(1);
function MARK(x, y, h) { // AIVAR icon, height h, top-left x,y
  const s = h / 295;
  const B = [[170,9],[204,15],[337,254],[323,286],[231,286],[214,277],[112,106],[116,83]];
  const L = [[99,124],[112,124],[190,260],[177,286],[20,286],[10,271]];
  const p = a => a.map(([px,py]) => `${f1(x+px*s)},${f1(y+py*s)}`).join(" ");
  return `<polygon points="${p(B)}" fill="#2FA344"/><polygon points="${p(L)}" fill="#8CD80F"/>`;
}
function oilLabel(cx, cy, w, h, size, big) {
  const x = cx - w/2, y = cy - h/2;
  const fs = Math.min(h * (big ? .2 : .22), w*.16), iconH = fs * 1.05, textW = fs * 3.25, tot = iconH*1.15 + fs*.3 + textW;
  const ix = cx - tot/2, row = y + h*.18;
  return `<g>
  <rect x="${f1(x)}" y="${f1(y)}" width="${f1(w)}" height="${f1(h)}" rx="${f1(Math.min(12,h*.08))}" fill="url(#lblG)"/>
  <rect x="${f1(x)}" y="${f1(y+h*.06)}" width="${f1(w)}" height="${f1(Math.max(2,h*.025))}" fill="#8CD80F"/>
  <rect x="${f1(x)}" y="${f1(y+h*.92)}" width="${f1(w)}" height="${f1(Math.max(2,h*.025))}" fill="#C9A24A"/>
  ${MARK(ix, row, iconH)}
  <text x="${f1(ix+iconH*1.15+fs*.3)}" y="${f1(row+iconH*.86)}" font-family="Archivo,Arial Black,sans-serif" font-weight="900" font-size="${f1(fs)}" fill="#fff" letter-spacing="${f1(fs*.02)}">AIVAR</text>
  <text x="${f1(cx)}" y="${f1(y+h*.62)}" text-anchor="middle" font-family="Archivo,Arial,sans-serif" font-weight="800" font-size="${f1(Math.min(h*.13,w*.085))}" fill="#F7E7B0" letter-spacing="${f1(Math.min(h*.012,w*.006))}">REFINED PALM OIL</text>
  <text x="${f1(cx)}" y="${f1(y+h*.82)}" text-anchor="middle" font-family="Archivo,Arial,sans-serif" font-weight="800" font-size="${f1(Math.min(h*.14,w*.12))}" fill="#8CD80F">${size}</text>
</g>`;
}
function shadow(cx, bot, w) {
  return `<ellipse cx="${f1(cx)}" cy="${f1(bot)}" rx="${f1(w*.62)}" ry="${f1(w*.1+4)}" fill="#000" opacity=".45" filter="url(#blur8)"/>`;
}
function petBottle(cx, bot, w, h, size) {
  const top = bot - h, capH = Math.max(14, h*.075), neckH = h*.05, nw = w*.4, sh = h*.17;
  const b0 = top + capH + neckH, b1 = b0 + sh, r = Math.min(16, w*.18);
  const body = `M${f1(cx-nw/2)},${f1(b0)} C${f1(cx-nw/2)},${f1(b0+sh*.5)} ${f1(cx-w/2)},${f1(b0+sh*.45)} ${f1(cx-w/2)},${f1(b1)} L${f1(cx-w/2)},${f1(bot-r)} Q${f1(cx-w/2)},${f1(bot)} ${f1(cx-w/2+r)},${f1(bot)} L${f1(cx+w/2-r)},${f1(bot)} Q${f1(cx+w/2)},${f1(bot)} ${f1(cx+w/2)},${f1(bot-r)} L${f1(cx+w/2)},${f1(b1)} C${f1(cx+w/2)},${f1(b0+sh*.45)} ${f1(cx+nw/2)},${f1(b0+sh*.5)} ${f1(cx+nw/2)},${f1(b0)} Z`;
  let ridges = ""; for (let i = 1; i < 5; i++) ridges += `<line x1="${f1(cx-nw/2-2+i*(nw+4)/5)}" y1="${f1(top+2)}" x2="${f1(cx-nw/2-2+i*(nw+4)/5)}" y2="${f1(top+capH-2)}" stroke="#021A06" stroke-width="1.2" opacity=".6"/>`;
  const lh = (bot - b1) * .46, lcy = b1 + (bot - b1) * .5;
  return `<g>${shadow(cx, bot, w)}
  <path d="${body}" fill="url(#og)"/><path d="${body}" fill="url(#ogv)"/>
  <rect x="${f1(cx-nw/2)}" y="${f1(top+capH)}" width="${f1(nw)}" height="${f1(neckH+2)}" fill="url(#og)"/>
  <rect x="${f1(cx-nw/2-1)}" y="${f1(top+capH+neckH*.35)}" width="${f1(nw+2)}" height="${f1(Math.max(3,neckH*.3))}" rx="2" fill="#0E5A20"/>
  <rect x="${f1(cx-nw/2-3)}" y="${f1(top)}" width="${f1(nw+6)}" height="${f1(capH)}" rx="4" fill="url(#capG)"/>${ridges}
  ${oilLabel(cx, lcy, w-2, lh, size)}
  <rect x="${f1(cx-w*.36)}" y="${f1(b1-sh*.3)}" width="${f1(w*.12)}" height="${f1((bot-b1)*.95)}" rx="${f1(w*.06)}" fill="url(#hl)" opacity=".55"/>
  <rect x="${f1(cx+w*.28)}" y="${f1(b1)}" width="${f1(w*.05)}" height="${f1((bot-b1)*.85)}" rx="3" fill="#fff" opacity=".18"/>
</g>`;
}
function jar(cx, bot, w, h, size) {
  const top = bot - h, sh = h*.14, r = w*.08;
  const x0 = cx - w/2, x1 = cx + w/2, bt = top + sh;
  const body = `M${f1(x0)},${f1(bt+r)} Q${f1(x0)},${f1(bt)} ${f1(x0+r*1.5)},${f1(bt-sh*.15)} L${f1(cx-w*.18)},${f1(top+h*.06)} L${f1(x1-r*1.5)},${f1(bt-sh*.15)} Q${f1(x1)},${f1(bt)} ${f1(x1)},${f1(bt+r)} L${f1(x1)},${f1(bot-r)} Q${f1(x1)},${f1(bot)} ${f1(x1-r)},${f1(bot)} L${f1(x0+r)},${f1(bot)} Q${f1(x0)},${f1(bot)} ${f1(x0)},${f1(bot-r)} Z`;
  const hw = w*.07;
  return `<g>${shadow(cx, bot, w)}
  <path d="M${f1(cx+w*.02)},${f1(bt)} L${f1(cx+w*.02)},${f1(top+h*.04)} Q${f1(cx+w*.02)},${f1(top-h*.02)} ${f1(cx+w*.1)},${f1(top-h*.02)} L${f1(x1-w*.1)},${f1(top-h*.02)} Q${f1(x1-w*.02)},${f1(top-h*.02)} ${f1(x1-w*.03)},${f1(top+h*.06)} L${f1(x1-w*.05)},${f1(bt)}" fill="none" stroke="#C87A08" stroke-width="${f1(hw)}" stroke-linejoin="round" opacity=".95"/>
  <path d="${body}" fill="url(#og)"/><path d="${body}" fill="url(#ogv)"/>
  <rect x="${f1(cx-w*.36)}" y="${f1(top+h*.0)}" width="${f1(w*.22)}" height="${f1(h*.09)}" rx="4" fill="url(#capG)"/>
  <rect x="${f1(cx-w*.34)}" y="${f1(top+h*.09)}" width="${f1(w*.18)}" height="${f1(h*.03)}" fill="#0E5A20"/>
  ${oilLabel(cx, top+h*.62, w*.82, h*.42, size, true)}
  <rect x="${f1(x0+w*.07)}" y="${f1(bt+h*.04)}" width="${f1(w*.06)}" height="${f1(h*.68)}" rx="${f1(w*.03)}" fill="url(#hl)" opacity=".5"/>
</g>`;
}
function tin(cx, bot, w, h, size) {
  const top = bot - h, x0 = cx - w/2;
  return `<g>${shadow(cx, bot, w)}
  <rect x="${f1(x0)}" y="${f1(top+h*.06)}" width="${f1(w)}" height="${f1(h*.94)}" rx="6" fill="url(#tinG)"/>
  <rect x="${f1(x0-3)}" y="${f1(top+h*.04)}" width="${f1(w+6)}" height="${f1(h*.045)}" rx="4" fill="#5E676D"/>
  <rect x="${f1(x0-3)}" y="${f1(bot-h*.03)}" width="${f1(w+6)}" height="${f1(h*.03)}" rx="3" fill="#5E676D"/>
  <ellipse cx="${f1(cx-w*.26)}" cy="${f1(top+h*.04)}" rx="${f1(w*.1)}" ry="${f1(h*.03)}" fill="#3F474C"/>
  <rect x="${f1(cx-w*.33)}" y="${f1(top-h*.02)}" width="${f1(w*.14)}" height="${f1(h*.06)}" rx="4" fill="url(#capG)"/>
  <path d="M${f1(cx-w*.02)},${f1(top+h*.04)} Q${f1(cx+w*.18)},${f1(top-h*.07)} ${f1(cx+w*.38)},${f1(top+h*.04)}" fill="none" stroke="#4A5257" stroke-width="${f1(Math.max(3,w*.025))}" stroke-linecap="round"/>
  ${oilLabel(cx, top+h*.55, w, h*.58, size, true)}
  <rect x="${f1(x0+w*.12)}" y="${f1(top+h*.1)}" width="${f1(w*.06)}" height="${f1(h*.85)}" fill="#fff" opacity=".35"/>
</g>`;
}
function fruits(x, y, s) {
  const pts = [[0,0,22],[30,-8,20],[16,-30,19],[-24,-14,18],[48,12,17],[-6,20,16],[24,22,18]];
  return `<g>${pts.map(([dx,dy,r]) => `<circle cx="${f1(x+dx*s)}" cy="${f1(y+dy*s)}" r="${f1(r*s)}" fill="url(#fruit)"/><ellipse cx="${f1(x+dx*s-r*s*.3)}" cy="${f1(y+dy*s-r*s*.35)}" rx="${f1(r*s*.28)}" ry="${f1(r*s*.18)}" fill="#fff" opacity=".45"/>`).join("")}</g>`;
}
function frond(x, y, s, rot, flip) {
  let leaves = "";
  for (let i = 0; i < 9; i++) {
    const t = i/8, px = x + Math.cos(rot)*t*220*s, py = y + Math.sin(rot)*t*220*s, len = (70 - t*40)*s;
    [1,-1].forEach(d => { const a = rot + d*1.05*(flip||1); leaves += `<path d="M${f1(px)},${f1(py)} q${f1(Math.cos(a-.3*d)*len*.6)},${f1(Math.sin(a-.3*d)*len*.6)} ${f1(Math.cos(a)*len)},${f1(Math.sin(a)*len)}" stroke="#1F7A30" stroke-width="${f1(7*s)}" stroke-linecap="round" fill="none" opacity="${.75+t*.2}"/>`; });
  }
  return `<g><path d="M${f1(x)},${f1(y)} l${f1(Math.cos(rot)*220*s)},${f1(Math.sin(rot)*220*s)}" stroke="#2A8A3A" stroke-width="${f1(4*s)}" stroke-linecap="round"/>${leaves}</g>`;
}
function oilStageBg(W, H) {
  let rays = "";
  [[.62,.0,.95],[.8,.0,.45],[.45,.0,.3]].forEach(([a,b,o],i) => { rays += `<polygon points="${f1(W*a)},0 ${f1(W*(a+.12))},0 ${f1(W*(a-.25))},${H} ${f1(W*(a-.45))},${H}" fill="#FFF3C4" opacity="${(.05+i*.01).toFixed(2)}"/>`; });
  return `<rect width="${W}" height="${H}" fill="url(#bgOil)"/>${rays}
  <circle cx="${f1(W*.55)}" cy="${f1(H*.5)}" r="${f1(W*.36)}" fill="url(#glow)"/>
  ${frond(-20, H*.05, 1.1*W/600, .55)}${frond(W+20, H*.02, .95*W/600, 2.55, -1)}
  <ellipse cx="${f1(W/2)}" cy="${f1(H*.885)}" rx="${f1(W*.47)}" ry="${f1(H*.075)}" fill="url(#plinth)"/>
  <ellipse cx="${f1(W/2)}" cy="${f1(H*.87)}" rx="${f1(W*.47)}" ry="${f1(H*.06)}" fill="#3C6B40"/>
  <ellipse cx="${f1(W/2)}" cy="${f1(H*.87)}" rx="${f1(W*.44)}" ry="${f1(H*.045)}" fill="#4E8051" opacity=".6"/>`;
}
const PACK_DEF = {
  b500: {l:"500 ml", fn:petBottle, w:120, h:330},
  b1:   {l:"1 L", fn:petBottle, w:150, h:390},
  b2:   {l:"2 L", fn:petBottle, w:184, h:430},
  j5:   {l:"5 L", fn:jar, w:270, h:340},
  j15:  {l:"15 L", fn:jar, w:330, h:400},
  t15:  {l:"15 kg", fn:tin, w:300, h:390}
};
function OIL_PACK(k) {
  const d = PACK_DEF[k] || PACK_DEF.b1, W = 600, H = 600, bot = H*.87;
  return `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="AIVAR refined palm oil, ${d.l} pack">${oilStageBg(W,H)}
  ${d.fn(W/2+10, bot, d.w, d.h, d.l)}
  ${fruits(W*.14, bot-18, 1.2)}${fruits(W*.86, bot-10, .9)}
  <path d="M${W*.8},${H*.18} c-14,22 -22,34 -22,46 a22,22 0 0 0 44,0 c0,-12 -8,-24 -22,-46z" fill="#F5C030" opacity=".9"/><ellipse cx="${W*.8-7}" cy="${H*.18+44}" rx="5" ry="8" fill="#fff" opacity=".6"/>
</svg>`;
}
function OIL_LINEUP() {
  const W = 600, H = 600, bot = H*.87;
  return `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="AIVAR refined palm oil in bottles, jars and a tin">${oilStageBg(W,H)}
  ${tin(470, bot+4, 150, 200, "15 kg")}
  ${jar(330, bot+8, 128, 168, "5 L")}
  ${petBottle(214, bot+12, 66, 214, "1 L")}
  ${petBottle(128, bot+16, 52, 168, "500 ml")}
  ${fruits(56, bot+4, .8)}
</svg>`;
}
function PACK_SCENE() {
  const W = 1200, H = 420, fl = 360;
  const sh = (cx, w) => `<ellipse cx="${cx}" cy="${fl+4}" rx="${w*.55}" ry="12" fill="#2E4A24" opacity=".28" filter="url(#blur8)"/>`;
  const word = (x, y, fs, fill) => `<text x="${x}" y="${y}" text-anchor="middle" font-family="Archivo,Arial Black,sans-serif" font-weight="900" font-size="${fs}" fill="${fill}">AIVAR</text>`;
  let mk = ""; for (let i = 0; i < 9; i++) mk += `<circle cx="${165+(i%3)*22-22+(i>5?8:0)}" cy="${228+Math.floor(i/3)*20}" r="10" fill="#F4EAD3" stroke="#E2D2AE"/>`;
  return `<svg viewBox="0 0 ${W} ${H}" role="img" aria-label="AIVAR packaging range: pouch, jar, sachet, kraft carton, gift box and labels">
  <rect width="${W}" height="${H}" fill="url(#packBg)"/>
  <circle cx="980" cy="70" r="200" fill="#8CD80F" opacity=".18"/><circle cx="160" cy="420" r="160" fill="#0B4D1B" opacity=".06"/>
  <rect x="0" y="${fl}" width="${W}" height="${H-fl}" fill="#C9D9B6" opacity=".55"/>
  ${sh(165,150)}
  <path d="M95,110 L235,110 L245,360 Q245,366 238,366 L92,366 Q85,366 85,360 Z" fill="url(#pouchG)"/>
  <rect x="95" y="110" width="140" height="10" fill="#052B0C"/><path d="M95,132 H235" stroke="#8CD80F" stroke-width="2" stroke-dasharray="6 4"/>
  ${MARK(118,146,26)}${word(186,170,24,"#fff")}
  <ellipse cx="165" cy="248" rx="52" ry="48" fill="#E8F2DA" opacity=".25"/>${mk}
  <text x="165" y="330" text-anchor="middle" font-family="Archivo,sans-serif" font-weight="800" font-size="14" fill="#8CD80F">ROASTED MAKHANA</text>
  ${sh(370,140)}
  <rect x="312" y="150" width="116" height="34" rx="8" fill="url(#capG)"/>
  <path d="M302,192 Q302,184 312,184 L428,184 Q438,184 438,192 L440,352 Q440,366 426,366 L314,366 Q300,366 300,352 Z" fill="url(#spreadG)"/>
  <path d="M302,192 Q302,184 312,184 L428,184 Q438,184 438,192 L440,352 Q440,366 426,366 L314,366 Q300,366 300,352 Z" fill="url(#glassG)"/>
  <rect x="300" y="236" width="140" height="84" fill="#F6EFD9"/>${MARK(316,250,22)}${word(388,270,22,"#0B4D1B")}
  <text x="370" y="300" text-anchor="middle" font-family="Archivo,sans-serif" font-weight="800" font-size="15" fill="#6B2A12">DateGo</text>
  ${sh(530,90)}
  <path d="M495,200 L565,200 L578,340 L556,366 L504,366 L482,340 Z" fill="#7A3B1A"/><rect x="516" y="184" width="28" height="20" rx="4" fill="url(#capG)"/>
  <rect x="490" y="250" width="80" height="44" rx="6" fill="#F6EFD9"/>${word(530,278,16,"#0B4D1B")}
  ${sh(720,220)}
  <path d="M620,226 L720,186 L820,226 L820,350 L720,390 L620,350 Z" fill="url(#kraft)"/><path d="M620,226 L720,266 L820,226" fill="none" stroke="#8C6230" stroke-width="2"/><path d="M720,266 V390" stroke="#8C6230" stroke-width="2"/>
  <path d="M620,226 L720,266 L720,390 L620,350 Z" fill="#000" opacity=".08"/>
  <path d="M700,194 L740,210 L740,250 L700,234 Z" fill="#E9D3A6" opacity=".7"/>
  ${MARK(738,292,20)}${word(788,309,15,"#3D2A12")}
  <text x="785" y="330" text-anchor="middle" font-family="Archivo,sans-serif" font-weight="700" font-size="10" fill="#5B3D18">FOOD PACKAGING</text>
  ${sh(950,200)}
  <rect x="860" y="230" width="180" height="136" rx="6" fill="#0B4D1B"/><rect x="852" y="210" width="196" height="34" rx="6" fill="#0F5E22"/>
  <rect x="940" y="210" width="20" height="156" fill="url(#goldG)"/><rect x="852" y="222" width="196" height="12" fill="url(#goldG)"/>
  <path d="M950,210 C920,170 890,190 915,208 Z M950,210 C980,170 1010,190 985,208 Z" fill="url(#goldG)"/>
  <rect x="868" y="300" width="64" height="28" rx="4" fill="#F1D27A"/>${word(900,319,15,"#0B4D1B")}
  ${sh(1110,110)}
  <ellipse cx="1110" cy="260" rx="54" ry="18" fill="#E6EDDD"/><rect x="1056" y="260" width="108" height="96" fill="#fff"/><ellipse cx="1110" cy="356" rx="54" ry="18" fill="#F4F7EF"/>
  <ellipse cx="1110" cy="260" rx="54" ry="18" fill="#fff" stroke="#D5DEC9"/><ellipse cx="1110" cy="260" rx="16" ry="6" fill="#C9D9B6"/>
  <rect x="1060" y="282" width="100" height="40" fill="#8CD80F"/>${word(1110,309,18,"#0B4D1B")}
</svg>`;
}

const OIL_SVG = OIL_LINEUP();
const PRODUCTS = [
  {id:"datego-jar",cat:"dates",name:"DateGo natural date spread",desc:"Slow-cooked dates in a thick, spreadable jar. Good on toast, rotis, pancakes and in smoothies.",img:"datego_jar",tag:"Bestseller",flavours:["Classic","Cocoa","Cinnamon","Cardamom"],sizes:[{l:"200 g jar"},{l:"400 g jar"}]},
  {id:"datego-pouch",cat:"dates",name:"DateGo squeeze pouch",desc:"Single-serve date spread for lunchboxes, desks and travel. Tear and squeeze.",img:"datego_pouch",flavours:["Classic","Cocoa"],sizes:[{l:"Pack of 10 × 25 g"},{l:"Pack of 30 × 25 g"}]},
  {id:"makhana",cat:"makhana",name:"Roasted makhana",desc:"Fox nuts roasted, not fried, and tossed in bold Indian seasonings.",img:"makhana",tag:"5 flavours",flavours:["Salt & pepper","Peri peri","Cream & onion","Tangy tomato","Pudina"],sizes:[{l:"70 g pack"},{l:"Pack of 4 × 70 g"}]},
  {id:"makhana-box",cat:"makhana",name:"Makhana flavour box",desc:"All five makhana flavours in one box, for sharing or finding your favourite.",img:"makhana_range",flavours:null,sizes:[{l:"5 × 70 g box"}]},
  {id:"makhana-chips",cat:"chips",name:"Makhana chips",desc:"Thin, crisp chips pressed from makhana. Roasted, not fried.",img:"makhana_chips",tag:"New",flavours:["Classic salted","Masala","Sour cream & herbs"],sizes:[{l:"60 g pack"},{l:"Pack of 6 × 60 g"}]},
  {id:"palm-oil",cat:"oil",name:"Refined palm oil",desc:"Food-grade refined palm oil for home cooking, restaurants, caterers and food manufacturers.",svg:true,tag:"6 pack sizes",flavours:null,sizes:[{l:"500 ml bottle",k:"b500"},{l:"1 L bottle",k:"b1"},{l:"2 L bottle",k:"b2"},{l:"5 L jar",k:"j5"},{l:"15 L jar",k:"j15"},{l:"15 kg tin",k:"t15"}]},
  {id:"olive-oil",cat:"oil",name:"Extra virgin olive oil",desc:"For salads, dips and light cooking.",img:"olive",flavours:null,sizes:[{l:"250 ml bottle"}]},
  {id:"salad-dressing",cat:"oil",name:"Classic French salad dressing",desc:"Ready to pour over salads, bowls and wraps.",img:"dressing",flavours:null,sizes:[{l:"250 ml bottle"}]},
  {id:"balsamic",cat:"oil",name:"Balsamic vinegar",desc:"For dressings, glazes and marinades.",img:"vinegar",flavours:null,sizes:[{l:"250 ml bottle"}]},
  {id:"mango",cat:"more",name:"Mango spread",desc:"Ripe Indian mango in a smooth spread for breakfast and desserts.",img:"mango",flavours:null,sizes:[{l:"200 g jar"}]},
  {id:"millet-spread",cat:"more",name:"Millet spread",desc:"A breakfast spread built on Indian millets.",img:"millet_spread",flavours:null,sizes:[{l:"250 g jar"}]},
  {id:"hummus",cat:"more",name:"Hummus",desc:"Indian chickpeas, blended smooth. Dip, spread or wrap.",img:"hummus",flavours:null,sizes:[{l:"200 g jar"}]},
  {id:"millet-snacks",cat:"more",name:"Millet snacks",desc:"Crunchy snacks made from traditional grains.",img:"millet_snacks",flavours:null,sizes:[{l:"80 g pack"}]}
];
const CATS = [["all","All"],["dates","Date spreads"],["makhana","Makhana"],["chips","Makhana chips"],["oil","Oils & dressings"],["more","More from the pantry"]];
const BOXES = [{id:"classic",name:"Classic",items:3},{id:"festive",name:"Festive",items:5},{id:"grand",name:"Grand",items:7}];
const PICKS = ["DateGo Classic spread","DateGo Cocoa spread","Salt & pepper makhana","Peri peri makhana","Pudina makhana","Masala makhana chips","Classic makhana chips","Mango spread","Millet spread","Millet snacks"];
const PACKS = [
  {n:"Stand-up zipper pouches",d:"Resealable laminated pouches for snacks, makhana and dry fruit.",s:["50 g to 1 kg","Window or opaque","Custom print"],svg:'<path d="M18 8h28l4 50H14z" fill="#8CD80F"/><path d="M18 8h28" stroke="#0B4D1B" stroke-width="4"/><path d="M16 16h32" stroke="#0B4D1B" stroke-width="3" stroke-dasharray="4 3"/><rect x="24" y="28" width="16" height="16" rx="3" fill="#0B4D1B"/>'},
  {n:"Glass and PET jars",d:"Jars for spreads, dips, pickles and sauces, with matching caps.",s:["100 g to 1 kg","Tamper-evident caps","Labels available"],svg:'<rect x="16" y="6" width="32" height="10" rx="3" fill="#0B4D1B"/><rect x="12" y="16" width="40" height="42" rx="8" fill="#8CD80F"/><rect x="18" y="28" width="28" height="16" rx="3" fill="#0B4D1B"/>'},
  {n:"Squeeze and sachet packs",d:"Single-serve pouches for spreads, sauces and condiments.",s:["10 g to 50 g","Tear notch","Spout options"],svg:'<path d="M22 6h20l6 46-8 6H24l-8-6z" fill="#8CD80F"/><rect x="26" y="2" width="12" height="8" rx="2" fill="#0B4D1B"/><path d="M24 26h16" stroke="#0B4D1B" stroke-width="4" stroke-linecap="round"/>'},
  {n:"Kraft boxes and cartons",d:"Mono-cartons, meal boxes and shipper cartons for retail and delivery.",s:["Food-contact board","Window cut-outs","Bulk shipper sizes"],svg:'<path d="M8 22 32 12l24 10v28L32 60 8 50z" fill="#C79A5A"/><path d="M8 22l24 10 24-10M32 32v28" stroke="#0B4D1B" stroke-width="3" fill="none"/>'},
  {n:"Rigid gift boxes",d:"Premium boxes with inserts for hampers and festive gifting.",s:["Custom inserts","Foil and emboss","Magnetic lids"],svg:'<rect x="8" y="24" width="48" height="32" rx="4" fill="#0B4D1B"/><rect x="6" y="16" width="52" height="10" rx="3" fill="#8CD80F"/><path d="M32 16v40" stroke="#8CD80F" stroke-width="5"/><path d="M32 16c-8-12-18-6-12 0m12 0c8-12 18-6 12 0" stroke="#8CD80F" stroke-width="4" fill="none"/>'},
  {n:"Labels and sleeves",d:"Product labels, nutrition panels and branded sleeves, printed to your artwork.",s:["Rolls or sheets","Matte or gloss","Short runs"],svg:'<rect x="10" y="10" width="44" height="44" rx="10" fill="#8CD80F"/><path d="M20 26h24M20 34h16M20 42h20" stroke="#0B4D1B" stroke-width="4" stroke-linecap="round"/>'}
];
const ENQ_TYPES = ["Bulk or wholesale order","Institutional food supply","Corporate gifting","Food packaging supply","Food workforce","AIVAR Foundation partnership","Export or private label","Something else"];

const $ = (s,el=document)=>el.querySelector(s), $$=(s,el=document)=>[...el.querySelectorAll(s)];
const inr = n => "₹" + Math.round(n).toLocaleString("en-IN");
const esc = s => String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const store = { get(k,d){try{const v=localStorage.getItem(k);return v?JSON.parse(v):d}catch(e){return d}}, set(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}} };

/* ribbon */
const ribbonWords = ["Cocoa date spread","Peri peri makhana","Classic DateGo","Cream & onion makhana","Masala makhana chips","Cardamom date spread","Pudina makhana","Tangy tomato makhana","Cinnamon date spread","Sour cream makhana chips"];
const tri = '<svg viewBox="0 0 16 14" aria-hidden="true"><path d="M8 0 16 14H0Z" fill="#0B4D1B"/></svg>';
const half = ribbonWords.map(w=>`<span>${esc(w)}${tri}</span>`).join("");
const ribbonEl=$("#ribbon"); if(ribbonEl) ribbonEl.innerHTML = half + half;

/* menu */
const nav=$("#nav"), menuBtn=$("#menuBtn");
menuBtn.addEventListener("click",()=>{const o=nav.classList.toggle("open");menuBtn.setAttribute("aria-expanded",o);menuBtn.setAttribute("aria-label",o?"Close menu":"Open menu")});
$$("#nav a").forEach(a=>a.addEventListener("click",()=>{nav.classList.remove("open");menuBtn.setAttribute("aria-expanded","false")}));

/* theme */
const themeBtn=$("#themeToggle");
function currentDark(){const t=document.documentElement.dataset.theme;return t?t==="dark":matchMedia("(prefers-color-scheme: dark)").matches}
function setThemeLabel(){themeBtn.textContent=currentDark()?"Switch to light theme":"Switch to dark theme"}
const savedTheme=store.get("aivar-theme",null); if(savedTheme) document.documentElement.dataset.theme=savedTheme;
setThemeLabel();
themeBtn.addEventListener("click",()=>{const next=currentDark()?"light":"dark";document.documentElement.dataset.theme=next;store.set("aivar-theme",next);setThemeLabel()});

/* products */
const RM0=matchMedia("(prefers-reduced-motion: reduce)").matches;
const grid=$("#grid"), filters=$("#filters");
const state={}; PRODUCTS.forEach(p=>state[p.id]={f:p.flavours?p.flavours[0]:null,s:0});
function packKey(p){return p.sizes[state[p.id]?.s||0].k}
function media(p){return p.svg?OIL_SVG:`<img src="${IMG[p.img]}" alt="${esc(p.name)}" loading="lazy">`}
function priceHTML(p){const sz=p.sizes[state[p.id].s];return `<span class="poe">Price on enquiry</span><small>${esc(sz.l)}</small>`}
if(grid&&filters){
grid.innerHTML = PRODUCTS.map(p=>`
<article class="card" data-cat="${p.cat}" data-id="${p.id}">
  <div class="ph" data-qv role="button" tabindex="0" aria-label="Quick view ${esc(p.name)}">${media(p)}${p.tag?`<span class="tag">${esc(p.tag)}</span>`:""}<button class="wish" data-wish aria-label="Save ${esc(p.name)}" aria-pressed="false"><svg viewBox="0 0 24 24" stroke-linejoin="round"><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10Z"/></svg></button><span class="qv-hint">Quick view</span></div>
  <div class="body">
    <span class="cat-tag">${esc((CATS.find(c=>c[0]===p.cat)||[])[1]||"")}</span>
    <h3>${esc(p.name)}</h3>
    <p class="desc">${esc(p.desc)}</p>
    ${p.flavours?`<div><div class="opt-label">Flavour</div><div class="flavours" role="group" aria-label="Flavour">${p.flavours.map((f,i)=>`<button type="button" data-f="${esc(f)}" aria-pressed="${i===0}">${esc(f)}</button>`).join("")}</div></div>`:""}
    ${p.sizes.length>1?`<div><div class="opt-label">Size</div><div class="sizes" role="group" aria-label="Size">${p.sizes.map((s,i)=>`<button type="button" data-s="${i}" aria-pressed="${i===0}">${esc(s.l)}</button>`).join("")}</div></div>`:`<p class="opt-label single-size">Pack size: ${esc(p.sizes[0].l)}</p>`}
    <div class="buy"><div class="price" aria-live="polite">${priceHTML(p)}</div><button class="btn btn-primary btn-sm add">Add to enquiry</button></div>
  </div>
</article>`).join("");
grid.addEventListener("click",e=>{
  const card=e.target.closest(".card"); if(!card) return;
  const p=PRODUCTS.find(x=>x.id===card.dataset.id), st=state[p.id];
  if(e.target.closest("[data-wish]")){toggleWish(p.id,e.target.closest("[data-wish]"));return}
  if(e.target.closest("[data-qv]")){openQV(p.id);return}
  const fb=e.target.closest("[data-f]"), sb=e.target.closest("[data-s]");
  if(fb){st.f=fb.dataset.f;$$("[data-f]",card).forEach(b=>b.setAttribute("aria-pressed",b===fb));return}
  if(sb){st.s=+sb.dataset.s;$$("[data-s]",card).forEach(b=>b.setAttribute("aria-pressed",b===sb));const pr=$(".price",card);pr.innerHTML=priceHTML(p);pr.classList.remove("flash");void pr.offsetWidth;pr.classList.add("flash");updateAddLabel(card,p);if(p.svg){const ph=$(".ph",card);const old=$("svg",ph);if(old){old.outerHTML=OIL_PACK(p.sizes[st.s].k);const nv=$("svg",ph);if(!RM0)nv.animate([{opacity:0,transform:"scale(1.06)"},{opacity:1,transform:"none"}],{duration:450,easing:"ease-out"})}}return}
  if(e.target.closest(".add")){
    const sz=p.sizes[st.s];
    addToCart({key:`${p.id}|${st.f||""}|${sz.l}`,name:p.name,variant:[st.f,sz.l].filter(Boolean).join(", "),thumb:p.svg?"oil:"+sz.k:p.img},e.target.closest(".add"));
  }
});
filters.innerHTML = CATS.map(([k,l],i)=>`<button class="chip" data-cat="${k}" aria-pressed="${i===0}">${esc(l)}</button>`).join("");
}
function updateAddLabel(card,p){$(".add",card).textContent="Add to enquiry"}
let curCat="all";
function applyFilter(k){
  if(!grid||!filters)return;
  curCat=k;
  $$(".chip",filters).forEach(c=>c.setAttribute("aria-pressed",c.dataset.cat===k));
  const q=($("#shopSearch")?.value||"").trim().toLowerCase();
  let shown=0;
  $$(".card",grid).forEach(c=>{const p=PRODUCTS.find(x=>x.id===c.dataset.id);const catOk=k==="all"||(k==="saved"?wish.includes(p.id):c.dataset.cat===k);const qOk=!q||hay(p).includes(q);const show=catOk&&qOk;c.classList.toggle("hide",!show);if(show)shown++});
  let nr=$(".no-results",grid); if(!shown){if(!nr){nr=document.createElement("p");nr.className="no-results";grid.appendChild(nr)}nr.textContent=k==="saved"&&!q?"Nothing saved yet. Tap the heart on any product to keep it here.":"No products match. Try another flavour or clear the search.";nr.hidden=false}else if(nr)nr.hidden=true;
  if(!matchMedia("(prefers-reduced-motion: reduce)").matches){$$(".card:not(.hide)",grid).forEach((c,i)=>c.animate([{opacity:0,transform:"translateY(14px)"},{opacity:1,transform:"none"}],{duration:380,delay:i*45,easing:"cubic-bezier(.2,.8,.2,1)",fill:"backwards"}))}
}
if(grid&&filters)filters.addEventListener("click",e=>{const c=e.target.closest(".chip");if(c)applyFilter(c.dataset.cat)});
$$("[data-filter-link]").forEach(a=>a.addEventListener("click",()=>applyFilter(a.dataset.filterLink)));

/* cart */
let cart=store.get("aivar-enquiry",[]).filter(i=>i&&i.key); let step="cart";
const drawer=$("#drawer"), scrim=$("#scrim"), body=$("#drawerBody"), foot=$("#drawerFoot"), countEl=$("#cartCount"), cartBtn=$("#cartBtn");
function save(){store.set("aivar-enquiry",cart)}
function count(){return cart.reduce((n,i)=>n+i.qty,0)}

function thumbHTML(t){if(t==="oil")return OIL_SVG;if(t.startsWith("oil:"))return OIL_PACK(t.slice(4));if(t==="gift"){const im=$(".gift-photo img");return im?`<img src="${im.src}" alt="">`:`<span style="font-size:22px;display:flex;align-items:center;justify-content:center;width:100%;height:100%">🎁</span>`}if(t==="foundation"){const im=$(".found-photo img");return im?`<img src="${im.src}" alt="">`:`<span style="font-size:22px;display:flex;align-items:center;justify-content:center;width:100%;height:100%">🤝</span>`}return `<img src="${IMG[t]}" alt="">`}
function addToCart(item,fromEl){
  const ex=cart.find(i=>i.key===item.key);
  if(ex) ex.qty+= (item.qty||1); else cart.push({...item,qty:item.qty||1});
  save(); renderCart(); fly(fromEl); toast(`Added ${item.name} to your enquiry list`);
}
function fly(el){
  if(!el||matchMedia("(prefers-reduced-motion: reduce)").matches){bumpCart();return}
  const a=el.getBoundingClientRect(), b=cartBtn.getBoundingClientRect();
  const d=document.createElement("div");d.className="fly";document.body.appendChild(d);
  const x0=a.left+a.width/2-9,y0=a.top+a.height/2-9,x1=b.left+b.width/2-9,y1=b.top+b.height/2-9;
  d.style.left=x0+"px";d.style.top=y0+"px";
  const anim=d.animate([{transform:"translate(0,0) scale(1)"},{transform:`translate(${(x1-x0)/2}px,${Math.min(y1,y0)-y0-80}px) scale(1.3)`,offset:.5},{transform:`translate(${x1-x0}px,${y1-y0}px) scale(.4)`,opacity:.6}],{duration:700,easing:"cubic-bezier(.5,0,.3,1)"});
  anim.onfinish=()=>{d.remove();bumpCart()};
}
function bumpCart(){cartBtn.classList.remove("bump");void cartBtn.offsetWidth;cartBtn.classList.add("bump")}
let lastFocus=null;
function openCart(){lastFocus=document.activeElement;step="cart";renderCart();drawer.classList.add("open");scrim.classList.add("open");drawer.setAttribute("aria-hidden","false");document.body.style.overflow="hidden";setTimeout(()=>$("#closeCart").focus(),50)}
function closeCart(){drawer.classList.remove("open");scrim.classList.remove("open");drawer.setAttribute("aria-hidden","true");document.body.style.overflow="";if(lastFocus)lastFocus.focus()}
cartBtn.addEventListener("click",openCart);$("#closeCart").addEventListener("click",closeCart);scrim.addEventListener("click",closeCart);
document.addEventListener("keydown",e=>{if(e.key==="Escape"&&drawer.classList.contains("open"))closeCart()});
function renderCart(){
  countEl.textContent=count(); const mc=$("#mCartCount"); if(mc){mc.textContent=count();mc.dataset.n=count()}
  const t=$("#drawerTitle");
  if(step==="done") return;
  if(step==="checkout"){t.textContent="Your details";renderCheckout();return}
  t.textContent="Your enquiry list";
  if(!cart.length){
    body.innerHTML=`<div class="cart-empty"><svg viewBox="0 0 80 70" aria-hidden="true"><path d="M40 4 76 66H4Z" fill="none" stroke="currentColor" stroke-width="3" opacity=".35"/><path d="M28 66 46 34 64 66" fill="#8CD80F" opacity=".6"/></svg><p>Your enquiry list is empty. Add products, flavours and pack sizes, then send one enquiry for everything.</p><a class="btn btn-primary btn-sm" href="#shop" id="emptyShop">Browse products</a></div>`;
    foot.innerHTML="";$("#emptyShop").addEventListener("click",closeCart);return;
  }
  body.innerHTML = `<p class="enq-note">No payment now. Our team replies with pricing, availability and delivery options for everything on this list.</p>` + cart.map((i,ix)=>`<div class="item"><div class="im">${thumbHTML(i.thumb)}</div><div><b>${esc(i.name)}</b><small>${esc(i.variant||"")}</small></div><div class="r"><div class="stepper"><button data-dec="${ix}" aria-label="Decrease quantity of ${esc(i.name)}">−</button><span>${i.qty}</span><button data-inc="${ix}" aria-label="Increase quantity of ${esc(i.name)}">+</button></div><button class="rm" data-rm="${ix}">Remove</button></div></div>`).join("");
  foot.innerHTML=`<div class="row"><span>Products</span><span>${cart.length}</span></div><div class="row total"><span>Total quantity</span><span>${count()}</span></div><button class="btn btn-primary" id="footBtn">Continue</button><p class="fine">Quantities are a guide. You can change them with our team.</p>`;
  $("#footBtn").addEventListener("click",()=>{step="checkout";renderCart();body.scrollTop=0});
}
body.addEventListener("click",e=>{
  const t=e.target;
  if(t.dataset.inc!=null){const i=cart[+t.dataset.inc];i.qty+=i.thumb==="gift"?5:1;save();renderCart()}
  else if(t.dataset.dec!=null){const i=cart[+t.dataset.dec];i.qty-=i.thumb==="gift"?5:1;if(i.qty<(i.thumb==="gift"?25:1))cart.splice(+t.dataset.dec,1);save();renderCart()}
  else if(t.dataset.rm!=null){cart.splice(+t.dataset.rm,1);save();renderCart()}
  else if(t.id==="backToCart"){step="cart";renderCart()}
});
const intlPhone=v=>/^\+?[\d\s()-]{7,18}$/.test(v)&&v.replace(/\D/g,"").length>=7;
function renderCheckout(){
  body.innerHTML=`<button class="back" id="backToCart">Back to enquiry list</button>
  <form class="form" id="coForm" novalidate>
    ${field("coName","Full name","text","full",true,"Enter your name","name")}
    ${field("coOrg","Company or organisation (optional)","text","full",false,"","organization")}
    ${field("coPhone","Phone with country code","tel","",true,"Enter a valid phone number","tel")}
    ${field("coEmail","Email","email","",true,"Enter a valid email address","email")}
    ${field("coCountry","Country","text","",true,"Enter your country","country-name")}
    ${field("coCity","City","text","",true,"Enter your city","address-level2")}
    <div class="field full"><label for="coType">You are buying as</label><select id="coType">${["A household","A retailer or distributor","A restaurant, café or caterer","A company (corporate)","A school or college","A government department","An importer or exporter","A food manufacturer"].map(o=>`<option>${o}</option>`).join("")}</select></div>
    <div class="field full"><label for="coMsg">Anything else? (optional)</label><textarea id="coMsg" placeholder="Delivery timeline, frequency, private label, packaging needs"></textarea></div>
    <label class="full check"><input type="checkbox" id="coFound"> I'd also like to support AIVAR Foundation's meal programme</label>
  </form>`;
  foot.innerHTML=`<div class="row"><span>Products</span><span>${cart.length}</span></div><div class="row total"><span>Total quantity</span><span>${count()}</span></div><button class="btn btn-primary" id="footBtn">Send enquiry</button><p class="fine">We use your details only to reply to this enquiry.</p>`;
  $("#footBtn").addEventListener("click",sendEnquiry);
}
function recordEnquiry(ref,items,name){const list=store.get("aivar-enquiries",[]);list.push({ref,name,items:items.map(i=>({name:i.name,variant:i.variant,qty:i.qty})),status:"Received",at:new Date().toISOString()});store.set("aivar-enquiries",list.slice(-20))}
function sendEnquiry(){
  const f=$("#coForm"); if(!validate(f,{coPhone:intlPhone,coEmail:v=>/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)})) return;
  const id="ENQ-"+Date.now().toString(36).toUpperCase().slice(-6), name=$("#coName").value.trim().split(" ")[0];
  const n=cart.length, found=$("#coFound").checked;
  step="done";$("#drawerTitle").textContent="Enquiry sent";
  body.innerHTML=`<div class="confirm"><svg viewBox="0 0 72 72" aria-hidden="true"><circle cx="36" cy="36" r="34" fill="#8CD80F"/><path d="M22 37l10 10 19-21" fill="none" stroke="#0B4D1B" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/></svg><h3>Thank you, ${esc(name)}.</h3><p>Your enquiry for ${n} product${n>1?"s":""} is in. Reference ${id}.</p><p>Our team will contact you with pricing, availability and delivery options.</p>${found?"<p>We'll also share how you can support AIVAR Foundation.</p>":""}</div>`;
  foot.innerHTML=`<button class="btn btn-primary" id="doneBtn">Keep browsing</button>`;
  recordEnquiry(id,cart,$("#coName").value.trim());
  cart=[];save();countEl.textContent=0;const mc=$("#mCartCount");if(mc){mc.textContent=0;mc.dataset.n=0}
  $("#doneBtn").addEventListener("click",()=>{closeCart();step="cart"});
}

/* forms */
function field(id,label,type,cls,req,err,ac){return `<div class="field ${cls}"><label for="${id}">${label}</label><input id="${id}" type="${type}" ${ac?`autocomplete="${ac}"`:""} ${req?"required":""}><div class="err">${err}</div></div>`}
function validate(form,rules={}){
  let ok=true,first=null;
  $$(".field",form).forEach(fd=>{const inp=$("input,select,textarea",fd);const v=inp.value.trim();let bad=inp.required&&!v;if(!bad&&v&&rules[inp.id])bad=!rules[inp.id](v);fd.classList.toggle("invalid",bad);inp.setAttribute("aria-invalid",bad);if(bad){ok=false;first=first||inp}});
  if(first)first.focus(); return ok;
}
function enquiryFields(prefix){return `
  ${field(prefix+"Name","Your name","text","",true,"Enter your name","name")}
  ${field(prefix+"Org","Organisation","text","",false,"","organization")}
  ${field(prefix+"Phone","Phone with country code","tel","",true,"Enter a valid phone number","tel")}
  ${field(prefix+"Email","Work email","email","",true,"Enter a valid email address","email")}
  <div class="field full"><label for="${prefix}Type">What do you need?</label><select id="${prefix}Type" required>${ENQ_TYPES.map(t=>`<option>${t}</option>`).join("")}</select><div class="err">Choose an option</div></div>
  <div class="field full"><label for="${prefix}Msg">Details</label><textarea id="${prefix}Msg" required placeholder="Quantities, locations, timelines"></textarea><div class="err">Tell us a little about your requirement</div></div>
  <div class="full"><button class="btn btn-primary" type="submit">Send enquiry</button></div>`}
const enqRules=p=>({[p+"Phone"]:v=>/^\+?[\d\s()-]{7,18}$/.test(v),[p+"Email"]:v=>/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)});
function doneHTML(name,type){return `<h3>Enquiry sent.</h3><p>Thanks, ${esc(name)}. Our ${esc(type.toLowerCase())} team will be in touch soon.</p>`}
const cf=$("#contactForm");
if(cf){
cf.innerHTML=enquiryFields("c");
cf.addEventListener("submit",e=>{e.preventDefault();if(!validate(cf,enqRules("c")))return;const d=$("#contactDone");d.innerHTML=doneHTML($("#cName").value.trim().split(" ")[0],$("#cType").value)+`<button class="btn btn-ghost btn-sm" style="margin-top:16px" id="cAgain">Send another enquiry</button>`;cf.style.display="none";d.classList.add("show");$("#cAgain").addEventListener("click",()=>{cf.reset();cf.style.display="";d.classList.remove("show")})});
}

const dlg=$("#enquiry"), ef=$("#enqForm"), ed=$("#enqDone"); ef.innerHTML=enquiryFields("e");
function openEnquiry(type,detail){
  ef.reset();ef.style.display="";ed.classList.remove("show");$$(".field",ef).forEach(f=>f.classList.remove("invalid"));
  const t=ENQ_TYPES.includes(type)?type:"Something else"; $("#eType").value=t;
  $("#enqTitle").textContent=t==="Something else"?"Send an enquiry":t;
  $("#enqSub").textContent="Share a few details and the right team will get back to you.";
  if(detail)$("#eMsg").value=detail+"\n";
  if(dlg.showModal)dlg.showModal();else dlg.setAttribute("open","");
}
$("#enqClose").addEventListener("click",()=>dlg.close());
dlg.addEventListener("click",e=>{if(e.target===dlg)dlg.close()});
ef.addEventListener("submit",e=>{e.preventDefault();if(!validate(ef,enqRules("e")))return;ed.innerHTML=doneHTML($("#eName").value.trim().split(" ")[0],$("#eType").value)+`<button class="btn btn-primary btn-sm" style="margin-top:16px" id="eDone">Close</button>`;ef.style.display="none";ed.classList.add("show");$("#eDone").addEventListener("click",()=>dlg.close())});
document.addEventListener("click",e=>{const b=e.target.closest("[data-enquire]");if(!b)return;const sec=b.dataset.sector;openEnquiry(b.dataset.enquire,b.dataset.detail||(sec?`Sector: ${sec}`:""))});

/* supply tabs */
const tabs=$$('[role="tab"]');
function selectTab(t){tabs.forEach(x=>{const on=x===t;x.setAttribute("aria-selected",on);x.tabIndex=on?0:-1;$("#"+x.getAttribute("aria-controls")).hidden=!on})}
tabs.forEach((t,i)=>{t.addEventListener("click",()=>selectTab(t));t.addEventListener("keydown",e=>{let n=null;if(e.key==="ArrowRight")n=tabs[(i+1)%tabs.length];if(e.key==="ArrowLeft")n=tabs[(i-1+tabs.length)%tabs.length];if(n){n.focus();selectTab(n)}})});

/* gifting builder */
const boxesEl=$("#boxes"), picksEl=$("#picks"); let box=BOXES[1];
if(boxesEl){
boxesEl.innerHTML=BOXES.map(b=>`<label><input type="radio" name="box" value="${b.id}" ${b.id===box.id?"checked":""}><b>${b.name}</b><span>${b.items} items</span></label>`).join("");
picksEl.innerHTML=PICKS.map((p,i)=>`<label><input type="checkbox" value="${esc(p)}" ${i<5?"checked":""}>${esc(p)}</label>`).join("");
const gQty=$("#gQty");
function picked(){return $$("input:checked",picksEl).map(i=>i.value)}
function syncPicks(){
  const sel=picked(); if(sel.length>box.items){$$("input:checked",picksEl).slice(box.items).forEach(i=>i.checked=false)}
  const n=picked().length; $$("input",picksEl).forEach(i=>i.disabled=!i.checked&&n>=box.items);
  const sl=$("#slots"); if(sl){const sel2=picked();const prev=sl.dataset.sig||"";sl.style.setProperty("--n",box.items);sl.innerHTML=Array.from({length:box.items},(_,i)=>sel2[i]?`<div class="slot full" style="${prev.split("|")[i]===sel2[i]?"animation:none":""}">${esc(sel2[i])}</div>`:`<div class="slot"></div>`).join("");sl.dataset.sig=sel2.join("|")}
  $("#pickCount").textContent=n<box.items?`${n} of ${box.items} chosen. Pick ${box.items-n} more.`:`${n} of ${box.items} chosen.`;
}
function gCalc(){
  let q=Math.max(25,parseInt(gQty.value)||25);
  const tot=$("#gTotal");tot.textContent=`${q} × ${box.name} box`;tot.classList.remove("flash");void tot.offsetWidth;tot.classList.add("flash");
  $("#gPer").textContent=`${box.items} items per box${$("#exLogo").checked?", logo sleeve":""}${$("#exNote").checked?", greeting card":""}${$("#exShip").checked?", shipped to individual addresses":""}. Pricing comes with your quote.`;
}
boxesEl.addEventListener("change",e=>{box=BOXES.find(b=>b.id===e.target.value);syncPicks();gCalc()});
picksEl.addEventListener("change",()=>{syncPicks()});
$$("#exLogo,#exNote,#exShip").forEach(x=>x.addEventListener("change",gCalc));
gQty.addEventListener("change",()=>{gQty.value=Math.max(25,parseInt(gQty.value)||25);gCalc()});
$("#gMinus").addEventListener("click",()=>{gQty.value=Math.max(25,(parseInt(gQty.value)||25)-5);gCalc()});
$("#gPlus").addEventListener("click",()=>{gQty.value=(parseInt(gQty.value)||25)+5;gCalc()});
function giftSummary(){const ex=[$("#exLogo").checked&&"logo sleeve",$("#exNote").checked&&"greeting card",$("#exShip").checked&&"individual shipping"].filter(Boolean);return `${box.name} box: ${picked().join(", ")}${ex.length?"; with "+ex.join(", "):""}`}
$("#gAdd").addEventListener("click",e=>{
  if(picked().length<box.items){toast(`Choose ${box.items-picked().length} more item${box.items-picked().length>1?"s":""} for the ${box.name} box`);$("input:not(:checked):not(:disabled)",picksEl)?.focus();return}
  const q=Math.max(25,parseInt(gQty.value)||25);
  addToCart({key:"gift|"+Date.now(),name:`${box.name} gift box`,variant:giftSummary(),thumb:"gift",qty:q},e.currentTarget);
});
$("#gQuote").addEventListener("click",()=>openEnquiry("Corporate gifting",`${giftSummary()}. Quantity: ${Math.max(25,parseInt(gQty.value)||25)} boxes.`));
syncPicks();gCalc();
}

/* packaging */
const packGrid=$("#packGrid");
if(packGrid)packGrid.innerHTML=PACKS.map(p=>`<div class="pack"><svg viewBox="0 0 64 64" aria-hidden="true">${p.svg}</svg><h3>${esc(p.n)}</h3><p>${esc(p.d)}</p><div class="specs">${p.s.map(s=>`<span>${esc(s)}</span>`).join("")}</div></div>`).join("");


/* ===== v3 features ===== */
const RM = matchMedia("(prefers-reduced-motion: reduce)").matches;
/* preloader */
(function(){const pl=$("#preloader");const go=()=>{if(document.documentElement.classList.contains("ready"))return;document.documentElement.classList.add("ready");pl.classList.add("done");setTimeout(()=>pl.remove(),700)};if(RM){go();return}setTimeout(go,1100);})();
/* scroll progress + to top */
const prog=$("#progress"), totop=$("#totop");
let ticking=false;
addEventListener("scroll",()=>{if(ticking)return;ticking=true;requestAnimationFrame(()=>{const h=document.documentElement.scrollHeight-innerHeight;prog.style.transform=`scaleX(${h>0?scrollY/h:0})`;totop.classList.toggle("show",scrollY>900);ticking=false})},{passive:true});
totop.addEventListener("click",()=>scrollTo({top:0,behavior:RM?"auto":"smooth"}));
/* hero parallax */
const heroV=$(".hero-visual");
if(heroV&&!RM&&matchMedia("(pointer:fine)").matches){$(".hero").addEventListener("pointermove",e=>{const r=heroV.getBoundingClientRect();const x=(e.clientX-(r.left+r.width/2))/r.width, y=(e.clientY-(r.top+r.height/2))/r.height;$$(".pt").forEach(p=>{p.style.setProperty("--mx",x.toFixed(3));p.style.setProperty("--my",y.toFixed(3))})});}
/* spotlight */
if($("#spot")){
const SPOT=["datego-jar","palm-oil","makhana","makhana-chips","olive-oil","datego-pouch","mango"];let si=0;
function renderSpot(){const p=PRODUCTS.find(x=>x.id===SPOT[si]);const s=$("#spot");s.classList.remove("swap");void s.offsetWidth;s.classList.add("swap");$("#spotImg").innerHTML=p.svg?OIL_PACK("b1"):`<img src="${IMG[p.img]}" alt="">`;$("#spotName").textContent=p.name;const sz=p.sizes[0];$("#spotPrice").textContent="Price on enquiry";$("#spotTag").textContent=p.tag||"In the pantry";$("#spot").dataset.id=p.id}
renderSpot(); if(!RM)setInterval(()=>{if(document.hidden)return;si=(si+1)%SPOT.length;renderSpot()},4200);
$("#spotAdd").addEventListener("click",e=>{const p=PRODUCTS.find(x=>x.id===$("#spot").dataset.id);const sz=p.sizes[0];addToCart({key:`${p.id}|${p.flavours?p.flavours[0]:""}|${sz.l}`,name:p.name,variant:[p.flavours?p.flavours[0]:null,sz.l].filter(Boolean).join(", "),thumb:p.svg?"oil:"+sz.k:p.img},e.currentTarget)});
$("#spot").addEventListener("click",e=>{if(!e.target.closest("#spotAdd"))openQV($("#spot").dataset.id)});
}

/* showcase */
let moved=false;
const track=$("#track");
if(track){
const slides=$$(".slide",track), dots=$("#dots");
dots.innerHTML=slides.map(()=>"<i></i>").join("");
function slideStep(dir){const w=slides[0].getBoundingClientRect().width+18;track.scrollBy({left:dir*w,behavior:RM?"auto":"smooth"})}
$("#prevS").addEventListener("click",()=>slideStep(-1));$("#nextS").addEventListener("click",()=>slideStep(1));
track.addEventListener("scroll",()=>{const c=track.scrollLeft;let best=0,bd=1e9;slides.forEach((s,i)=>{const d=Math.abs(s.offsetLeft-track.offsetLeft-c-parseFloat(getComputedStyle(track).paddingLeft)+0);if(d<bd){bd=d;best=i}});$$("i",dots).forEach((d,i)=>d.classList.toggle("on",i===best))},{passive:true});
$$("i",dots)[0].classList.add("on");
let dragX=null,startL=0;
track.addEventListener("pointerdown",e=>{if(e.pointerType!=="mouse"||e.target.closest("button"))return;dragX=e.clientX;startL=track.scrollLeft;moved=false;track.classList.add("drag");track.setPointerCapture(e.pointerId)});
track.addEventListener("pointermove",e=>{if(dragX==null)return;const dx=e.clientX-dragX;if(Math.abs(dx)>4)moved=true;track.scrollLeft=startL-dx});
const endDrag=()=>{if(dragX==null)return;dragX=null;track.classList.remove("drag")};
track.addEventListener("pointerup",endDrag);track.addEventListener("pointercancel",endDrag);
let auto=null;function startAuto(){if(RM||auto)return;auto=setInterval(()=>{if(document.hidden)return;if(track.scrollLeft+track.clientWidth>=track.scrollWidth-10)track.scrollTo({left:0,behavior:"smooth"});else slideStep(1)},4500)}
function stopAuto(){clearInterval(auto);auto=null}
track.addEventListener("pointerenter",stopAuto);track.addEventListener("pointerleave",startAuto);track.addEventListener("focusin",stopAuto);
new IntersectionObserver(es=>es.forEach(en=>en.isIntersecting?startAuto():stopAuto()),{threshold:.3}).observe(track);
}
document.addEventListener("click",e=>{const b=e.target.closest("[data-open]");if(b){if(moved){moved=false;return}openQV(b.dataset.open)}});

/* wishlist */
let wish=store.get("aivar-wish",[]);
function syncWish(){if(grid)$$(".card",grid).forEach(c=>{const b=$("[data-wish]",c);b.setAttribute("aria-pressed",wish.includes(c.dataset.id))});[$("#wishCount"),$("#mWishCount")].forEach(d=>{if(d){d.textContent=wish.length;d.dataset.n=wish.length}});if(filters){const sc=$('.chip[data-cat="saved"]',filters);if(sc)sc.textContent=`Saved (${wish.length})`}}
function toggleWish(id,btn){const i=wish.indexOf(id);if(i>-1)wish.splice(i,1);else wish.push(id);store.set("aivar-wish",wish);syncWish();if(btn){btn.classList.remove("pop");void btn.offsetWidth;btn.classList.add("pop")}const p=PRODUCTS.find(x=>x.id===id);toast(i>-1?`Removed ${p.name} from saved`:`Saved ${p.name}`);if(curCat==="saved")applyFilter("saved")}
if(filters)filters.insertAdjacentHTML("beforeend",`<button class="chip" data-cat="saved" aria-pressed="false">Saved (0)</button>`);
function showSaved(){location.hash="#shop";$("#shop").scrollIntoView({behavior:RM?"auto":"smooth"});applyFilter("saved")}
$("#wishBtn").addEventListener("click",showSaved);$("#mWish").addEventListener("click",showSaved);
$("#mCart").addEventListener("click",openCart);
syncWish();

/* inline search */
function hay(p){return [p.name,p.desc,(p.flavours||[]).join(" "),p.cat,p.sizes.map(s=>s.l).join(" ")].join(" ").toLowerCase()}
$("#shopSearch")?.addEventListener("input",()=>applyFilter(curCat));

/* card tilt */
if(grid){
if(!RM&&matchMedia("(pointer:fine)").matches){grid.addEventListener("pointermove",e=>{const c=e.target.closest(".card");if(!c)return;const r=c.getBoundingClientRect();const x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;c.style.transform=`perspective(900px) rotateX(${(-y*5).toFixed(2)}deg) rotateY(${(x*6).toFixed(2)}deg) translateY(-4px)`});grid.addEventListener("pointerout",e=>{const c=e.target.closest(".card");if(c&&!c.contains(e.relatedTarget))c.style.transform=""})}
grid.addEventListener("keydown",e=>{const ph=e.target.closest("[data-qv]");if(ph&&(e.key==="Enter"||e.key===" ")&&e.target===ph){e.preventDefault();openQV(ph.closest(".card").dataset.id)}});
}

/* quick view */
const qv=$("#qv"), qvIn=$("#qvInner");
const PAIRS={"olive-oil":["balsamic","salad-dressing"],"salad-dressing":["olive-oil","hummus"],"balsamic":["olive-oil","salad-dressing"],"datego-jar":["makhana","mango"],"datego-pouch":["datego-jar","makhana-chips"],"makhana":["makhana-chips","datego-pouch"],"makhana-box":["makhana","datego-jar"],"makhana-chips":["makhana","hummus"],"palm-oil":["olive-oil","makhana-chips"],"mango":["datego-jar","millet-spread"],"millet-spread":["datego-jar","mango"],"hummus":["makhana-chips","millet-snacks"],"millet-snacks":["hummus","makhana"]};
function openQV(id){
  const p=PRODUCTS.find(x=>x.id===id); if(!p)return; const st=state[p.id];
  const pairs=(PAIRS[id]||[]).map(pid=>PRODUCTS.find(x=>x.id===pid)).filter(Boolean);
  const vis=()=>p.svg?OIL_PACK(p.sizes[st.s].k):`<img src="${IMG[p.img]}" alt="${esc(p.name)}">`;
  qvIn.innerHTML=`<div class="qv-img" id="qvImg">${vis()}</div>
  <div class="qv-body"><button class="icon-btn qv-close" id="qvClose" aria-label="Close"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M6 6l12 12M18 6 6 18"/></svg></button>
  <h2 id="qvName">${esc(p.name)}</h2><p class="desc">${esc(p.desc)}</p>
  ${p.flavours?`<div><div class="opt-label">Flavour</div><div class="flavours" id="qvF">${p.flavours.map(f=>`<button type="button" data-f="${esc(f)}" aria-pressed="${f===st.f}">${esc(f)}</button>`).join("")}</div></div>`:""}
  <div><div class="opt-label">Pack size</div><div class="sizes" id="qvS">${p.sizes.map((s,i)=>`<button type="button" data-s="${i}" aria-pressed="${i===st.s}">${esc(s.l)}</button>`).join("")}</div></div>
  <p class="poe-line">Price and availability on enquiry</p>
  <label class="qv-sub"><input type="checkbox" id="qvSub"> I need this regularly</label>
  <div class="qv-row"><div class="stepper"><button type="button" id="qvMinus" aria-label="Decrease quantity">−</button><input id="qvQty" type="number" min="1" value="1" aria-label="Quantity"><button type="button" id="qvPlus" aria-label="Increase quantity">+</button></div><button class="btn btn-primary" id="qvAdd">Add to enquiry</button><button class="wish" style="position:static" id="qvWish" aria-label="Save ${esc(p.name)}" aria-pressed="${wish.includes(p.id)}"><svg viewBox="0 0 24 24" stroke-linejoin="round"><path d="M12 20s-7-4.4-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.6-7 10-7 10Z"/></svg></button></div>
  ${pairs.length?`<div><div class="opt-label">Goes well with</div><div class="pairs">${pairs.map(x=>`<button type="button" data-pair="${x.id}">${x.svg?OIL_PACK("b1"):`<img src="${IMG[x.img]}" alt="">`}${esc(x.name)}</button>`).join("")}</div></div>`:""}
  </div>`;
  qvIn.onclick=e=>{const f=e.target.closest("#qvF [data-f]"),s=e.target.closest("#qvS [data-s]");
    if(f){st.f=f.dataset.f;$$("#qvF [data-f]").forEach(b=>b.setAttribute("aria-pressed",b===f));syncCard(p)}
    if(s){st.s=+s.dataset.s;$$("#qvS [data-s]").forEach(b=>b.setAttribute("aria-pressed",b===s));syncCard(p);if(p.svg){$("#qvImg").innerHTML=vis();if(!RM)$("#qvImg svg").animate([{opacity:0,transform:"scale(1.05)"},{opacity:1,transform:"none"}],{duration:420,easing:"ease-out"})}}
    const pr=e.target.closest("[data-pair]");if(pr){openQV(pr.dataset.pair)}};
  const qi=$("#qvQty");$("#qvMinus").onclick=()=>qi.value=Math.max(1,(+qi.value||1)-1);$("#qvPlus").onclick=()=>qi.value=(+qi.value||1)+1;
  $("#qvWish").onclick=e=>{toggleWish(p.id,e.currentTarget);e.currentTarget.setAttribute("aria-pressed",wish.includes(p.id))};
  $("#qvClose").onclick=()=>qv.close();
  $("#qvAdd").onclick=e=>{const sz=p.sizes[st.s];const sub=$("#qvSub").checked;const q=Math.max(1,+qi.value||1);addToCart({key:`${p.id}|${st.f||""}|${sz.l}|${sub?"r":""}`,name:p.name,variant:[st.f,sz.l,sub?"Regular supply":null].filter(Boolean).join(", "),thumb:p.svg?"oil:"+sz.k:p.img,qty:q},e.currentTarget);setTimeout(()=>qv.open&&qv.close(),650)};
  if(!qv.open){qv.showModal?qv.showModal():qv.setAttribute("open","")}
  qvIn.scrollTop=0;
}
function syncCard(p){const card=$(`.card[data-id="${p.id}"]`);if(!card)return;const st=state[p.id];if(p.svg){const sv=$(".ph svg",card);if(sv)sv.outerHTML=OIL_PACK(p.sizes[st.s].k)}$$("[data-f]",card).forEach(b=>b.setAttribute("aria-pressed",b.dataset.f===st.f));$$("[data-s]",card).forEach(b=>b.setAttribute("aria-pressed",+b.dataset.s===st.s));$(".price",card).innerHTML=priceHTML(p);updateAddLabel(card,p)}
qv.addEventListener("click",e=>{if(e.target===qv)qv.close()});

/* global search */
const sDlg=$("#search"), sIn=$("#sInput"), sRes=$("#sResults");
const SECTIONS=[["IVA on WhatsApp","Shop, track enquiries, feedback, complaints","#whatsapp"],["Palm oil packs","500 ml bottles to 15 kg tins","#palm-oil"],["Institutional food supply","Corporate, education and government","#supply"],["Corporate gifting","Build a branded gift box","#gifting"],["Food packaging","Pouches, jars, boxes and labels","#packaging"],["Food workforce","Chefs, packing and service staff","#workforce"],["AIVAR Foundation","Help feed people who go without","#foundation"],["Export and private label","For buyers outside India","#global"],["Recipes","Ways to enjoy the pantry","#recipes"],["FAQ","Questions, answered","#faq"],["Contact","Send an enquiry","#contact"]];
let sIdx=0;
function renderSearch(){const q=sIn.value.trim().toLowerCase();const ps=PRODUCTS.filter(p=>!q||hay(p).includes(q));const ss=SECTIONS.filter(s=>!q||(s[0]+" "+s[1]).toLowerCase().includes(q));
  if(!ps.length&&!ss.length){sRes.innerHTML=`<p class="s-empty">No results for “${esc(sIn.value)}”. Try “makhana”, “cocoa” or “gifting”.</p>`;return}
  sRes.innerHTML=(ps.length?`<div class="grp">Products</div>`+ps.map(p=>`<button class="s-item" data-sp="${p.id}"><span class="si">${p.svg?OIL_SVG:`<img src="${IMG[p.img]}" alt="">`}</span><span><b>${esc(p.name)}</b><small>${esc(p.flavours?p.flavours.slice(0,3).join(", "):p.sizes[0].l)}</small></span></button>`).join(""):"")+(ss.length?`<div class="grp">Services and pages</div>`+ss.map(s=>`<button class="s-item" data-ss="${s[2]}"><span class="si">${tri}</span><span><b>${esc(s[0])}</b><small>${esc(s[1])}</small></span></button>`).join(""):"");
  sIdx=0;hl()}
function hl(){const it=$$(".s-item",sRes);it.forEach((x,i)=>x.classList.toggle("active",i===sIdx));it[sIdx]?.scrollIntoView({block:"nearest"})}
function openSearch(){sIn.value="";renderSearch();sDlg.showModal?sDlg.showModal():sDlg.setAttribute("open","");setTimeout(()=>sIn.focus(),30)}
$("#searchBtn").addEventListener("click",openSearch);$("#mSearch").addEventListener("click",openSearch);
sIn.addEventListener("input",renderSearch);
sIn.addEventListener("keydown",e=>{const it=$$(".s-item",sRes);if(e.key==="ArrowDown"){e.preventDefault();sIdx=Math.min(it.length-1,sIdx+1);hl()}if(e.key==="ArrowUp"){e.preventDefault();sIdx=Math.max(0,sIdx-1);hl()}if(e.key==="Enter"){e.preventDefault();it[sIdx]?.click()}});
sRes.addEventListener("click",e=>{const p=e.target.closest("[data-sp]"),s=e.target.closest("[data-ss]");if(p){sDlg.close();openQV(p.dataset.sp)}if(s){sDlg.close();$(s.dataset.ss).scrollIntoView({behavior:RM?"auto":"smooth"})}});
sDlg.addEventListener("click",e=>{if(e.target===sDlg)sDlg.close()});
document.addEventListener("keydown",e=>{if((e.key==="/"&&!/input|textarea|select/i.test(document.activeElement.tagName))||(e.key.toLowerCase()==="k"&&(e.metaKey||e.ctrlKey))){if(!sDlg.open){e.preventDefault();openSearch()}}});

/* recipes */
document.addEventListener("click",e=>{const b=e.target.closest("[data-recipe]");if(!b)return;const [id,f]=b.dataset.recipe.split("|");const p=PRODUCTS.find(x=>x.id===id);const sz=p.sizes[0];addToCart({key:`${p.id}|${f}|${sz.l}`,name:p.name,variant:`${f}, ${sz.l}`,thumb:p.img},b)});

/* newsletter */
$("#news").addEventListener("submit",e=>{e.preventDefault();const v=$("#newsEmail").value.trim();const ok=/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);$("#newsOk").style.color=ok?"#8CD80F":"#FF8A80";$("#newsOk").textContent=ok?"Subscribed. New flavours and offers will come to your inbox.":"Enter a valid email address.";if(ok)e.target.reset()});

/* heading split reveal */
$$("h2.split").forEach(h=>{const words=h.textContent.trim().split(/\s+/);h.setAttribute("aria-label",h.textContent.trim());h.innerHTML=words.map((w,i)=>`<span class="w" aria-hidden="true"><span style="--i:${i}">${esc(w)}</span></span>`).join(" ")});
if("IntersectionObserver" in window){const ho=new IntersectionObserver(es=>es.forEach(en=>{if(en.isIntersecting){en.target.classList.add("in");ho.unobserve(en.target)}}),{threshold:.4});$$("h2.split").forEach(h=>ho.observe(h))}else $$("h2.split").forEach(h=>h.classList.add("in"));

/* globe */
(function(){const cv=$("#globe");if(!cv)return;const ctx=cv.getContext("2d");const W=cv.width,R=W*0.4,C=W/2;
  const pts=[];const N=1400;for(let i=0;i<N;i++){const y=1-2*(i+.5)/N, r=Math.sqrt(1-y*y), th=Math.PI*(3-Math.sqrt(5))*i;pts.push([Math.cos(th)*r,y,Math.sin(th)*r])}
  const ll=(la,lo)=>{la*=Math.PI/180;lo*=Math.PI/180;return [Math.cos(la)*Math.sin(lo),Math.sin(la),Math.cos(la)*Math.cos(lo)]};
  const home=ll(21,78);const dests=[ll(25,55),ll(51,0),ll(40,-74),ll(1,104),ll(-34,151),ll(-1,37),ll(52,13),ll(35,139)];
  let rot=78*Math.PI/180, t0=performance.now(), vis=true;
  new IntersectionObserver(es=>vis=es[0].isIntersecting).observe(cv);
  function proj(p,a){const x=p[0]*Math.cos(a)-p[2]*Math.sin(a), z=p[0]*Math.sin(a)+p[2]*Math.cos(a), y=p[1], tilt=.35;const y2=y*Math.cos(tilt)-z*Math.sin(tilt), z2=y*Math.sin(tilt)+z*Math.cos(tilt);return [C+x*R,C-y2*R,z2]}
  function slerp(a,b,t){const d=Math.acos(Math.min(1,a[0]*b[0]+a[1]*b[1]+a[2]*b[2]));const s=Math.sin(d);const k1=Math.sin((1-t)*d)/s,k2=Math.sin(t*d)/s;const lift=1+Math.sin(Math.PI*t)*.22;return [(a[0]*k1+b[0]*k2)*lift,(a[1]*k1+b[1]*k2)*lift,(a[2]*k1+b[2]*k2)*lift]}
  function draw(now){
    if(vis||RM){const el=(now-t0)/1000;rot=78*Math.PI/180+(RM?0:Math.sin(el*.18)*.75);ctx.clearRect(0,0,W,W);
      const g=ctx.createRadialGradient(C-R*.3,C-R*.3,R*.1,C,C,R);g.addColorStop(0,"rgba(140,216,15,.10)");g.addColorStop(1,"rgba(140,216,15,.02)");ctx.fillStyle=g;ctx.beginPath();ctx.arc(C,C,R,0,7);ctx.fill();
      ctx.strokeStyle="rgba(140,216,15,.25)";ctx.lineWidth=2;ctx.beginPath();ctx.arc(C,C,R,0,7);ctx.stroke();
      for(const p of pts){const [x,y,z]=proj(p,rot);if(z<0){ctx.fillStyle=`rgba(238,245,232,${.06})`;ctx.fillRect(x-1.5,y-1.5,3,3)}else{ctx.fillStyle=`rgba(238,245,232,${.18+z*.5})`;ctx.beginPath();ctx.arc(x,y,2.2+z*1.6,0,7);ctx.fill()}}
      dests.forEach((d,i)=>{const ph=((el*.22+i/dests.length)%1);ctx.lineWidth=3;ctx.lineCap="round";let prev=null;const steps=40;for(let s=0;s<=steps;s++){const tt=s/steps;if(tt>ph*1.4)break;const q=proj(slerp(home,d,Math.min(tt,1)),rot);if(prev){const a=Math.max(0,1-(ph*1.4-tt)*2.2);ctx.strokeStyle=`rgba(140,216,15,${(q[2]>-.1?a:a*.2).toFixed(3)})`;ctx.beginPath();ctx.moveTo(prev[0],prev[1]);ctx.lineTo(q[0],q[1]);ctx.stroke()}prev=q}
        const e=proj(d,rot);if(e[2]>0){ctx.fillStyle="rgba(140,216,15,.9)";ctx.beginPath();ctx.arc(e[0],e[1],6,0,7);ctx.fill()}});
      const h=proj(home,rot);if(h[2]>0){const pulse=(el%1.6)/1.6;ctx.strokeStyle=`rgba(140,216,15,${1-pulse})`;ctx.lineWidth=3;ctx.beginPath();ctx.arc(h[0],h[1],10+pulse*34,0,7);ctx.stroke();ctx.fillStyle="#8CD80F";ctx.beginPath();ctx.arc(h[0],h[1],11,0,7);ctx.fill();ctx.fillStyle="#071F0D";ctx.beginPath();ctx.arc(h[0],h[1],4,0,7);ctx.fill()}
    }
    if(!RM)requestAnimationFrame(draw)}
  requestAnimationFrame(draw)})();

/* ===== v4 features ===== */
const artDefsEl=$("#artDefs");
if(artDefsEl)artDefsEl.outerHTML=ART_DEFS;
const packSceneEl=$("#packScene");
if(packSceneEl)packSceneEl.innerHTML=PACK_SCENE();
/* palm oil stage */
const PALM_INFO={b500:["Trial packs and small households","Compact PET bottle with a green screw cap."],b1:["Everyday home cooking","The standard kitchen bottle."],b2:["Larger families","More oil, fewer refills."],j5:["Cafés, cloud kitchens and small restaurants","Handled jar for daily commercial use."],j15:["Caterers, hostels and canteens","High-volume jar with a carry handle."],t15:["Food manufacturers and bulk kitchens","Sealed metal tin for storage and transport."]};
const palmPacksEl=$("#palmPacks");
if(palmPacksEl){
const palmP=PRODUCTS.find(x=>x.id==="palm-oil"); let palmK="b1";
palmPacksEl.innerHTML=palmP.sizes.map(s=>`<button role="radio" aria-checked="${s.k===palmK}" data-k="${s.k}"><b>${esc(s.l.replace(" bottle","").replace(" jar","").replace(" tin",""))}</b><span>${esc(s.l.includes("bottle")?"Bottle":s.l.includes("jar")?"Jar":"Tin")}</span></button>`).join("");
function renderPalm(anim){const st=$("#palmStage");st.innerHTML=OIL_PACK(palmK);if(anim&&!RM){st.classList.remove("swap");void st.offsetWidth;st.classList.add("swap")}const s=palmP.sizes.find(x=>x.k===palmK);const [best,desc]=PALM_INFO[palmK];$("#packInfo").innerHTML=`<b>${esc(s.l)}</b>. ${esc(desc)} Best for ${esc(best.toLowerCase())}.`;$$("#palmPacks button").forEach(b=>b.setAttribute("aria-checked",b.dataset.k===palmK))}
palmPacksEl.addEventListener("click",e=>{const b=e.target.closest("[data-k]");if(!b)return;palmK=b.dataset.k;renderPalm(true)});
palmPacksEl.addEventListener("keydown",e=>{if(!["ArrowRight","ArrowLeft","ArrowDown","ArrowUp"].includes(e.key))return;e.preventDefault();const ks=palmP.sizes.map(s=>s.k);let i=ks.indexOf(palmK)+((e.key==="ArrowRight"||e.key==="ArrowDown")?1:-1);i=(i+ks.length)%ks.length;palmK=ks[i];renderPalm(true);$(`#palmPacks [data-k="${palmK}"]`).focus()});
$("#palmAdd").addEventListener("click",e=>{const s=palmP.sizes.find(x=>x.k===palmK);addToCart({key:`palm-oil||${s.l}`,name:palmP.name,variant:s.l,thumb:"oil:"+s.k},e.currentTarget)});
renderPalm(false);
/* palm stage subtle tilt */
if(!RM&&matchMedia("(pointer:fine)").matches){const ps=$("#palmStage");ps.addEventListener("pointermove",e=>{const r=ps.getBoundingClientRect();const x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;ps.style.transform=`perspective(1000px) rotateX(${(-y*4).toFixed(2)}deg) rotateY(${(x*5).toFixed(2)}deg)`});ps.addEventListener("pointerleave",()=>ps.style.transform="");ps.style.transition="transform .4s cubic-bezier(.2,.8,.2,1)"}
}

/* Ask AIVAR concierge (uses the viewer's Claude via the sample capability; hidden when unavailable) */
(async function(){
  if(!window.claude||!claude.use)return;
  let sample=null; try{sample=await claude.use("sample")}catch(e){sample=null}
  if(!sample)return;
  const box=$("#concierge"), fab=$("#cFab"), panel=$("#cPanel"), log=$("#cLog"), form=$("#cForm"), input=$("#cIn");
  box.hidden=false;
  const CATALOG=PRODUCTS.map(p=>({id:p.id,name:p.name,about:p.desc,flavours:p.flavours||[],packs:p.sizes.map(s=>s.l)}));
  const SERVICES=["Institutional food supply for corporate, education and government","Corporate food gifting with custom gift boxes (min 25 boxes)","Food packaging supply: pouches, jars, sachets, cartons, gift boxes, labels","Food workforce: chefs, kitchen, packing, service and delivery staff","Export and private label for buyers outside India","AIVAR Foundation: meals for children and families facing hunger"];
  const RULES=`You are the product guide on the AIVAR website. AIVAR is an Indian food company. Supply opens soon, so nothing can be bought online yet; visitors add products to an enquiry list and AIVAR's team replies with prices. Prices are not published: never state or guess a price, delivery time, certification, nutrition value or health claim. Recommend only items from this catalog and these services. If asked something outside AIVAR's products and services, say briefly that you can only help with AIVAR.
CATALOG: ${JSON.stringify(CATALOG)}
SERVICES: ${JSON.stringify(SERVICES)}
Answer the visitor's latest message. Reply ONLY with JSON: {"reply": "friendly answer, max 70 words, plain text", "products": ["up to 3 catalog ids to suggest"], "enquiry": "one of ${ENQ_TYPES.join(" | ")} or null when a service enquiry fits better than products"}`;
  let turns=[], busy=false, ctl=null;
  const open=o=>{panel.hidden=!o;fab.setAttribute("aria-expanded",o);if(o)setTimeout(()=>input.focus(),50)};
  fab.addEventListener("click",()=>open(panel.hidden));$("#cClose").addEventListener("click",()=>open(false));
  const add=(cls,html)=>{const d=document.createElement("div");d.className=cls;d.innerHTML=html;log.appendChild(d);log.scrollTop=log.scrollHeight;return d};
  async function ask(q){
    if(busy||!q.trim())return; busy=true; $("#cSugg")?.remove();
    add("c-msg me",esc(q)); input.value="";
    const think=add("c-msg bot",'<span class="typing" aria-label="Thinking"><i></i><i></i><i></i></span>');
    turns.push({role:"user",content:q}); if(turns.length>8)turns=turns.slice(-8);
    ctl=new AbortController();
    try{
      const msgs=[{role:"user",content:RULES+"\n\nVisitor: "+turns[0].content},...turns.slice(1)];
      if(msgs.length>1&&msgs[0].role==="user"&&turns[0].role!=="user")msgs.shift();
      const out=await sample.json(msgs.length===1?msgs[0].content:msgs,{modelTier:"quick",cache:false,signal:ctl.signal});
      const reply=String(out&&out.reply||"Here are some ideas from the AIVAR range.");
      think.innerHTML=esc(reply);
      turns.push({role:"assistant",content:JSON.stringify(out)});
      const ids=(Array.isArray(out&&out.products)?out.products:[]).filter(id=>PRODUCTS.some(p=>p.id===id)).slice(0,3);
      if(ids.length){const rec=add("c-recs",ids.map(id=>{const p=PRODUCTS.find(x=>x.id===id);return `<div class="c-rec"><span class="ri">${p.svg?OIL_PACK("b1"):`<img src="${IMG[p.img]}" alt="">`}</span><b>${esc(p.name)}</b><button data-cadd="${p.id}">Add</button></div>`}).join(""));}
      if(out&&out.enquiry&&ENQ_TYPES.includes(out.enquiry)){add("c-recs",`<button class="btn btn-ghost btn-sm" data-cenq="${esc(out.enquiry)}">Send a ${esc(out.enquiry.toLowerCase())} enquiry</button>`)}
    }catch(e){
      const code=e&&e.code;
      think.className="c-msg err";
      think.textContent=code==="not_granted"?"Ask AIVAR needs your permission to use Claude. You can still browse and send an enquiry.":code==="rate_limited"?"Lots of questions right now. Please try again in a minute.":code==="cancelled"?"Stopped.":"I couldn't answer that just now. Please try again.";
      turns.pop();
      if(code==="not_granted"){input.disabled=true;$("#cSend").disabled=true}
    }finally{busy=false}
  }
  form.addEventListener("submit",e=>{e.preventDefault();ask(input.value)});
  log.addEventListener("click",e=>{const s=e.target.closest(".c-sugg button");if(s){ask(s.textContent);return}
    const a=e.target.closest("[data-cadd]");if(a){const p=PRODUCTS.find(x=>x.id===a.dataset.cadd);const sz=p.sizes[0];addToCart({key:`${p.id}|${p.flavours?p.flavours[0]:""}|${sz.l}`,name:p.name,variant:[p.flavours?p.flavours[0]:null,sz.l].filter(Boolean).join(", "),thumb:p.svg?"oil:"+sz.k:p.img},a);a.textContent="Added";a.disabled=true;return}
    const q=e.target.closest("[data-cenq]");if(q){openEnquiry(q.dataset.cenq,"")}});
  document.addEventListener("keydown",e=>{if(e.key==="Escape"&&!panel.hidden)open(false)});
})();

/* ===== v5: IVA WhatsApp preview ===== */
const WA_NUMBER = ""; // AIVAR WhatsApp number with country code, digits only (e.g. "9198XXXXXXXX"). Empty = on-page preview only.
(function(){
  const chat=$("#phChat"), sheet=$("#phSheet"), form=$("#phForm"), input=$("#phIn"), stat=$("#phStatus");
  if(!chat)return;
  if(WA_NUMBER){$("#waCta").href=`https://wa.me/${WA_NUMBER}?text=${encodeURIComponent("Hi IVA")}`;$("#waCta").target="_blank";$("#waCta").rel="noopener";$("#waCtaLabel").textContent="Chat with IVA on WhatsApp";$("#ivaNote").textContent="Opens WhatsApp. You can also try IVA in the phone here."}
  else $("#waCta").addEventListener("click",e=>{e.preventDefault();$("#ivaPhone").scrollIntoView({behavior:RM?"auto":"smooth",block:"center"});setTimeout(()=>input.focus({preventScroll:true}),500)});
  const clock=()=>{const d=new Date();return d.toLocaleTimeString([],{hour:"numeric",minute:"2-digit"})};
  $("#phClock").textContent=clock();
  const S={step:null,pending:null,form:{}};
  const CATS2=[["dates","Date spreads","DateGo jars and pouches"],["makhana","Makhana","Roasted in bold flavours"],["chips","Makhana chips","Thin, crisp, roasted"],["oil","Oils & dressings","Palm oil, olive oil and more"],["more","More from the pantry","Mango, millet, hummus"]];
  const scroll=()=>{chat.scrollTop=chat.scrollHeight};
  function bubble(cls,html){const d=document.createElement("div");d.className="bub "+cls;d.innerHTML=html+`<time>${clock()}</time>`;chat.appendChild(d);scroll();return d}
  function btns(list){const d=document.createElement("div");d.className="wa-btns";d.innerHTML=list.map(b=>`<button type="button" data-id="${esc(b.id)}" data-t="${esc(b.title)}">${b.icon||""}${esc(b.title)}</button>`).join("");chat.appendChild(d);scroll();return d}
  function listBtn(label,title,rows){const d=btns([{id:"__sheet",title:label,icon:"☰ "}]);d.querySelector("button").addEventListener("click",ev=>{ev.stopPropagation();openSheet(title,rows)});return d}
  function cards(ps){const d=document.createElement("div");d.className="wa-cards";d.innerHTML=ps.map(p=>`<div class="wcard"><span class="wi">${p.svg?OIL_PACK("b1"):`<img src="${IMG[p.img]}" alt="">`}</span><b>${esc(p.name)}</b><small>${p.sizes.length>1?p.sizes.length+" packs":esc(p.sizes[0].l)}, price on enquiry</small><button type="button" data-id="prod:${p.id}" data-t="${esc(p.name)}">Choose</button></div>`).join("");chat.appendChild(d);scroll();return d}
  function openSheet(title,rows){$("#shTitle").textContent=title;$("#shRows").innerHTML=rows.map(r=>`<button type="button" data-id="${esc(r.id)}" data-t="${esc(r.title)}"><b>${esc(r.title)}</b>${r.desc?`<small>${esc(r.desc)}</small>`:""}</button>`).join("");sheet.hidden=false}
  $("#shClose").addEventListener("click",()=>sheet.hidden=true);
  let typingEl=null;
  function bot(fn){stat.textContent="typing…";typingEl=document.createElement("div");typingEl.className="typing-b";typingEl.innerHTML='<span class="typing"><i></i><i></i><i></i></span>';chat.appendChild(typingEl);scroll();
    setTimeout(()=>{typingEl.remove();stat.textContent="online";fn()},RM?0:550)}
  const lines=()=>cart.map((i,n)=>`${n+1}. ${i.name}${i.variant?`, ${i.variant}`:""} × ${i.qty}`).join("\n");

  function menu(){S.step=null;bubble("bot",`👋 <b>Hi!</b>\nI'm <b>IVA</b>, AIVAR's shopping assistant. Supply opens soon: add products to your enquiry list and our team replies with prices.\nHow can I help you today?`);
    btns([{id:"menu:shop",title:"Shop products",icon:"🛒 "},{id:"menu:track",title:"Track my enquiry",icon:"📦 "},{id:"menu:feedback",title:"Share feedback",icon:"⭐ "},{id:"menu:complaint",title:"Raise a complaint",icon:"🎧 "}])}
  function shop(){S.step=null;bubble("bot","What are you looking for?");listBtn("Choose category","Categories",CATS2.map(([id,t,d])=>({id:"cat:"+id,title:t,desc:d})))}
  function product(p){S.pending={p,f:p.flavours?null:null,s:null};
    if(p.flavours&&p.flavours.length>1){bubble("bot",`Which flavour of <b>${esc(p.name)}</b>?`);listBtn("Choose flavour","Flavours",p.flavours.map((f,i)=>({id:"flav:"+i,title:f})));return}
    packs(p)}
  function packs(p){if(p.sizes.length===1){S.pending.s=0;return qty(p)}bubble("bot",`Which pack size of <b>${esc(p.name)}</b>?`);
    if(p.svg){cards1=null}listBtn("Choose pack","Pack sizes",p.sizes.map((s,i)=>({id:"pack:"+i,title:s.l})))}
  let cards1=null;
  function qty(p){const s=p.sizes[S.pending.s];bubble("bot",`How many <b>${esc(s.l)}</b>${S.pending.f?` (${esc(S.pending.f)})`:""}?`);btns([{id:"qty:1",title:"1"},{id:"qty:10",title:"10"},{id:"qty:other",title:"Other amount"}])}
  function add(n,el){const {p,f,s}=S.pending;const sz=p.sizes[s];addToCart({key:`${p.id}|${f||""}|${sz.l}`,name:p.name,variant:[f,sz.l].filter(Boolean).join(", "),thumb:p.svg?"oil:"+sz.k:p.img,qty:n},el);
    S.pending=null;S.step=null;bubble("bot",`✅ <b>Added to your enquiry list!</b>\n${esc(p.name)}${f?", "+esc(f):""}, ${esc(sz.l)} × ${n}`);btns([{id:"menu:shop",title:"Keep shopping"},{id:"list:view",title:"View enquiry list"},{id:"list:send",title:"Send enquiry"}])}
  function viewList(){S.step=null;if(!cart.length){bubble("bot","Your enquiry list is empty.");btns([{id:"menu:shop",title:"Shop products"}]);return}
    bubble("bot",`📝 <b>Your enquiry list</b>\n\n${esc(lines())}\n\nNo payment now. Our team replies with pricing.`);btns([{id:"list:send",title:"Send enquiry"},{id:"menu:shop",title:"Keep shopping"}])}
  function startSend(){if(!cart.length)return viewList();S.form={};S.step="name";bubble("bot","Great! What name should we use for this enquiry?")}
  function submit(){const ref="ENQ-"+Date.now().toString(36).toUpperCase().slice(-6);recordEnquiry(ref,cart,S.form.name);const n=cart.length;cart=[];save();renderCart();S.step=null;
    bubble("bot",`🎉 <b>Enquiry sent!</b>\nReference: <b>${ref}</b>\nStatus: Received\n\n${n} product${n>1?"s":""}. Our team will contact you with pricing, availability and delivery options.`);btns([{id:"menu:track",title:"Track enquiry"},{id:"menu:home",title:"Main menu"}])}
  function track(){S.step="ref";const mine=store.get("aivar-enquiries",[]).slice(-5).reverse();
    if(mine.length){bubble("bot","Choose one of your recent enquiries, or type a reference like ENQ-ABC123.");listBtn("My enquiries","Recent enquiries",mine.map(e=>({id:"track:"+e.ref,title:e.ref,desc:`${e.status}, ${new Date(e.at).toDateString()}`})))}
    else bubble("bot","Please type your enquiry reference. It looks like ENQ-ABC123.")}
  function status(ref){S.step=null;const e=store.get("aivar-enquiries",[]).find(x=>x.ref.toUpperCase()===ref.toUpperCase());
    if(!e){bubble("bot",`I couldn't find <b>${esc(ref.toUpperCase())}</b>. Please check the reference and try again.`);btns([{id:"menu:track",title:"Try again"},{id:"menu:home",title:"Main menu"}]);return}
    bubble("bot",`📦 <b>${e.ref}</b>\nStatus: <b>${e.status}</b>\nSent: ${new Date(e.at).toDateString()}\n${e.items.length} product(s). Our team will contact you with pricing and availability.`);btns([{id:"menu:home",title:"Main menu"}])}
  function feedback(){S.step=null;bubble("bot","How would you rate your experience with AIVAR?");listBtn("Rate us","Your rating",[5,4,3,2,1].map(n=>({id:"fb:"+n,title:"⭐".repeat(n),desc:["","Poor","Fair","Good","Very good","Excellent"][n]})))}
  function complaint(){S.step=null;bubble("bot","Sorry something went wrong. What is it about?");listBtn("Choose topic","Topic",["Product quality","Delivery","Enquiry response","Packaging","Something else"].map((t,i)=>({id:"cmp:"+t,title:t})))}

  function route(id,el){const [k,a]=id.split(/:(.*)/s);
    if(k==="menu"){if(a==="shop")return shop();if(a==="track")return track();if(a==="feedback")return feedback();if(a==="complaint")return complaint();return menu()}
    if(k==="cat"){const ps=PRODUCTS.filter(p=>p.cat===a);bubble("bot",`Here are our <b>${esc(CATS2.find(c=>c[0]===a)[1])}</b> products for you 😊`);cards(ps);return}
    if(k==="prod"){const p=PRODUCTS.find(x=>x.id===a);if(p)product(p);return}
    if(k==="flav"&&S.pending){S.pending.f=S.pending.p.flavours[+a];return packs(S.pending.p)}
    if(k==="pack"&&S.pending){S.pending.s=+a;return qty(S.pending.p)}
    if(k==="qty"&&S.pending){if(a==="other"){S.step="qty";bubble("bot","Type the quantity you need, for example 250.");return}return add(+a,el)}
    if(k==="list"){if(a==="send")return startSend();return viewList()}
    if(k==="buyer"){S.form.buyer=a;S.step="confirm";bubble("bot",`Please confirm:\n\n${esc(lines())}\n\nName: ${esc(S.form.name)}\nLocation: ${esc(S.form.city)}\nBuying as: ${esc(a)}`);btns([{id:"send:yes",title:"Confirm & send"},{id:"list:view",title:"Edit list"}]);return}
    if(k==="send"&&S.step==="confirm")return submit();
    if(k==="track")return status(a);
    if(k==="fb"){S.form={rating:+a};S.step="fbc";bubble("bot",`Thank you for the ${"⭐".repeat(+a)} rating! Anything to add? Type it, or tap Skip.`);btns([{id:"fbc:skip",title:"Skip"}]);return}
    if(k==="fbc"){saveFb("");return}
    if(k==="cmp"){S.form={topic:a};S.step="cmp";bubble("bot",`Please describe the problem with <b>${esc(a.toLowerCase())}</b>.`);return}
    menu()}
  function saveFb(c){const l=store.get("aivar-feedback",[]);l.push({rating:S.form.rating,comment:c,at:new Date().toISOString()});store.set("aivar-feedback",l.slice(-20));S.step=null;S.form={};bubble("bot","Thanks! Your feedback helps us improve. 💚");btns([{id:"menu:home",title:"Main menu"}])}
  function text(t){const q=t.trim();if(!q)return;
    if(/^(hi|hii+|hello|hey|namaste|menu|start)\b/i.test(q)&&!["name","city","fbc","cmp"].includes(S.step))return menu();
    switch(S.step){
      case "qty":{const n=parseInt(q.replace(/\D/g,""),10);if(!n||n<1){bubble("bot","Please type a number, for example 25.");return}return add(n,null)}
      case "name": if(q.length<2){bubble("bot","Please type your name.");return}S.form.name=q;S.step="city";bubble("bot",`Thanks, ${esc(q)}. Which city and country? (e.g. Hyderabad, India)`);return;
      case "city": S.form.city=q;S.step="buyer";bubble("bot","Who are you buying for?");listBtn("Choose one","Buying as",["Household","Retailer / distributor","Restaurant / caterer","Company (corporate)","School / college","Government","Importer / exporter","Food manufacturer"].map(b=>({id:"buyer:"+b,title:b})));return;
      case "ref":{const m=q.match(/ENQ-[A-Z0-9]{4,10}/i);if(!m){bubble("bot","That doesn't look like a reference. It looks like ENQ-ABC123.");return}return status(m[0])}
      case "fbc": return saveFb(q.slice(0,500));
      case "cmp":{const ref="CMP-"+Date.now().toString(36).toUpperCase().slice(-6);const l=store.get("aivar-complaints",[]);l.push({ref,topic:S.form.topic,details:q.slice(0,1000),at:new Date().toISOString()});store.set("aivar-complaints",l.slice(-20));S.step=null;bubble("bot",`We're sorry about this. Your complaint is logged.\nTicket: <b>${ref}</b>\nOur support team will contact you.`);btns([{id:"menu:home",title:"Main menu"}]);return}
    }
    const m=q.match(/ENQ-[A-Z0-9]{4,10}/i);if(m)return status(m[0]);
    if(/track|status|where/i.test(q))return track();
    if(/complain|problem|issue|damaged/i.test(q))return complaint();
    if(/feedback|review|rating/i.test(q))return feedback();
    if(/price|cost|how much|rate/i.test(q)){bubble("bot","Prices are shared on enquiry while supply opens. Add products to your list and send one enquiry; our team replies with pricing for your quantities.");btns([{id:"menu:shop",title:"Shop products"}]);return}
    if(/list|cart|basket/i.test(q))return viewList();
    const hits=PRODUCTS.filter(p=>hay(p).split(/\s+/).some(w=>w.length>3&&q.toLowerCase().includes(w)));
    if(hits.length){bubble("bot","Here's what I found 😊");cards(hits.slice(0,6));return}
    if(/shop|buy|order|product/i.test(q))return shop();
    bubble("bot","Sorry, I didn't get that. You can shop products, track an enquiry or share feedback.");btns([{id:"menu:shop",title:"Shop products"},{id:"menu:home",title:"Main menu"}])}

  chat.addEventListener("click",e=>{const b=e.target.closest("button[data-id]");if(!b||b.dataset.id==="__sheet")return;const grp=b.closest(".wa-btns");if(grp)grp.querySelectorAll("button").forEach(x=>x.disabled=true);
    bubble("me",esc(b.dataset.t));bot(()=>route(b.dataset.id,b))});
  $("#shRows").addEventListener("click",e=>{const b=e.target.closest("button[data-id]");if(!b)return;sheet.hidden=true;bubble("me",esc(b.dataset.t));bot(()=>route(b.dataset.id,b))});
  form.addEventListener("submit",e=>{e.preventDefault();const q=input.value;if(!q.trim())return;input.value="";bubble("me",esc(q));bot(()=>text(q))});
  // Start the conversation when the phone comes into view
  let started=false;const go=()=>{if(started)return;started=true;bubble("me","Hi");bot(menu)};
  if("IntersectionObserver" in window)new IntersectionObserver((es,o)=>{if(es[0].isIntersecting){go();o.disconnect()}},{threshold:.35}).observe($("#ivaPhone"));else go();
})();

let tt; function toast(m){const t=$("#toast");t.textContent=m;t.classList.add("show");clearTimeout(tt);tt=setTimeout(()=>t.classList.remove("show"),2400)}

/* image reveal */
if("IntersectionObserver" in window){const io=new IntersectionObserver(es=>es.forEach(en=>{if(en.isIntersecting){en.target.classList.add("in");io.unobserve(en.target)}}),{threshold:.2});$$(".reveal").forEach(r=>io.observe(r))}else{$$(".reveal").forEach(r=>r.classList.add("in"))}

renderCart();
})();
