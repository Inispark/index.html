// =====================================================================
//  SCENES — swipe (1), brakes (3), night (4), cost (5)
// =====================================================================
const PH = { x: 500, y: 790, w: 500, h: 820 };
const phoneInner = () => rrectPts(PH.x - PH.w / 2 + 24, PH.y - PH.h / 2 + 70, PH.w - 48, PH.h - 140, 16, 6);

// ---- era 1: every swipe is a tiny gamble
const FEED = ['meh', 'meh', 'wow', 'meh', '?'];
function feedCard(kind, x, y, w, h, key) {
  const P = rrectPts(x - w / 2, y - h / 2, w, h, 14, 5);
  gfill(P, SK.sheet, { off: [4, 4], key: key + 'f' }); gline(P, { closed: true, w: 3.5, key: key + 'o', second: false });
  if (kind === 'meh') { graphiteScribble(x, y - 20, w * 0.55, h * 0.4, key + 'sc'); handLetter('meh', x, y + h * 0.36, 44, { col: SK.graph, key: key + 'l' }); }
  else if (kind === 'wow') {
    for (let i = 0; i < 10; i++) { const a = i / 10 * TAU + B * 0.1; gline([[x + Math.cos(a) * 70, y - 20 + Math.sin(a) * 70], [x + Math.cos(a) * 110, y - 20 + Math.sin(a) * 110]], { w: 4, key: key + 'r' + i, second: false }); }
    const S = loopPts(x, y - 20, 58, 58, 0.08); scribbleFill(S, SK.hilite, { key: key + 'sf', gap: 9, w: 3.6, base: 0.5 }); gline(S, { w: 4, key: key + 'so' });
    handLetter('WOW!', x, y + h * 0.36, 52, { face: 'marker', key: key + 'l' });
  } else handLetter('?', x, y, 140, { col: SK.graph, key: key + 'q' });
}
function sceneSwipe() {
  const cu = TIMELINE.cues;
  sketchPage({ grid: 'dots' });
  const swipes = [E0 + 0.55, E0 + 1.35, E0 + 2.05, E0 + 2.75];
  let off = 0; swipes.forEach((t) => { off += EZ.io(ev(t, 0.3)); });
  // the phone, its glowing screen, the feed scrolling inside it
  const body = rrectPts(PH.x - PH.w / 2, PH.y - PH.h / 2, PH.w, PH.h, 46, 6), inner = phoneInner();
  gfill(body, SK.lead, { off: [6, 6], key: 'phb', a: 0.92 });
  gfill(inner, '#fff6c8', { off: [0, 0], key: 'phs' }); scribbleFill(inner, SK.hilite, { key: 'phsc', gap: 13, w: 3.5, base: 0.35 });
  ctx.save(); gclip(inner);
  const cardH = 440, step = 520, top = PH.y - 30;
  FEED.forEach((k, i) => { const y = top + i * step - off * step; if (y > PH.y - 800 && y < PH.y + 800) feedCard(k, PH.x, y, PH.w - 110, cardH, 'card' + i); });
  ctx.restore();
  gline(body, { closed: true, w: 6, key: 'pho' }); gline(inner, { closed: true, w: 3, key: 'phi', second: false });
  gline([[PH.x - 40, PH.y - PH.h / 2 + 36], [PH.x + 40, PH.y - PH.h / 2 + 36]], { w: 5, key: 'spk', second: false });
  // the thumb: a doodled hand that flicks up on each swipe
  let k = 0; swipes.forEach((t) => { const u = ev(t - 0.05, 0.3); if (u > 0 && u < 1) k = Math.sin(Math.PI * u); });
  const hx = PH.x + 150, hy = PH.y + 330 - 220 * k;
  const thumb = [[hx - 40, hy + 260], [hx - 42, hy + 40], [hx - 30, hy - 10], [hx, hy - 24], [hx + 30, hy - 10], [hx + 42, hy + 40], [hx + 50, hy + 260]];
  gfill(thumb, SK.sheet, { off: [4, 4], key: 'thf' }); gline(thumb, { w: 5, key: 'th' });
  gline(arcPts(hx, hy + 10, 22, Math.PI * 1.15, Math.PI * 1.85, 6), { w: 2.8, key: 'nail', second: false });
  // the tally in the margin: meh, meh, WOW!, ?
  ['meh', 'meh', 'WOW!', '?'].forEach((w, i) => {
    const t = swipes[i] + 0.3; if (TT < t) return;
    handLetter(w, 150, 540 + i * 150, w === 'WOW!' ? 50 : 42, { face: w === 'WOW!' ? 'marker' : 'hand', col: w === 'WOW!' ? SK.ink : SK.graph, key: 'tally' + i, reveal: ev(t, 0.2) });
  });
  if (TT >= swipes[2] + 0.3) sparkle(150, 820, 70, ((B % 4) / 4), 'tsp');
  pageTag('swipe');
  pageCaption(['a tiny', 'gamble'], [[1, 'gamble']], { at: Math.max(0.6, cu.gamble - E0 - 0.4), y: 1370 });
}

// ---- era 3: the brakes are still in pencil
const BIKE = { bx: 300, fx: 690, y: 1050, r: 120 };
function wheel(x, y, r, key, spin) {
  const P = loopPts(x, y, r, r, 0.05);
  gline(P, { w: 6, key: key + 'o' }); gline(loopPts(x, y, r - 12, r - 12, 0.04), { w: 2.4, key: key + 'i', second: false });
  for (let i = 0; i < 6; i++) { const a = i / 6 * Math.PI + spin; gline([[x - Math.cos(a) * (r - 14), y - Math.sin(a) * (r - 14)], [x + Math.cos(a) * (r - 14), y + Math.sin(a) * (r - 14)]], { w: 2, key: key + 's' + i, second: false, col: SK.graph }); }
  ctx.fillStyle = SK.ink; ctx.beginPath(); ctx.arc(x, y, 9, 0, TAU); ctx.fill();
}
function sceneBrakes() {
  const cu = TIMELINE.cues, { bx, fx, y, r } = BIKE, spin = -B * 0.5;
  sketchPage({ grid: 'dots' });
  // the road rushing past: dashes that step left on 2s
  gline([[40, y + r + 4], [1040, y + r + 4]], { w: 5, key: 'road' });
  for (let i = 0; i < 7; i++) { const x = mod(900 - (TT - E0) * 520 + i * 180, 1260) - 120; gpencil([[x, y + r + 40], [x + 70, y + r + 40]], { key: 'dash' + i, w: 3, a: 0.6, passes: 1 }); }
  for (let i = 0; i < 4; i++) gpencil([[90 - (B % 2) * 12, 830 + i * 60], [190 - (B % 2) * 12, 830 + i * 60]], { key: 'spd' + i, w: 3, a: 0.6, passes: 1 });
  wheel(bx, y, r, 'bw', spin); wheel(fx, y, r, 'fw', spin);
  // the frame (ink), the seat and the handlebar
  const seat = [bx + 130, y - 180], bar = [fx - 40, y - 230];
  gline([[bx, y], [bx + 150, y - 10], [fx, y]], { w: 6, key: 'fr1' });
  gline([[bx, y], [seat[0], seat[1] + 20], [bx + 150, y - 10]], { w: 6, key: 'fr2' });
  gline([[seat[0], seat[1] + 20], [bar[0] - 20, bar[1] + 40], [fx, y]], { w: 6, key: 'fr3' });
  gline([[seat[0] - 50, seat[1]], [seat[0] + 40, seat[1] - 6]], { w: 10, key: 'seat', second: false });
  gline([[bar[0] - 20, bar[1] + 40], [bar[0], bar[1]], [bar[0] + 70, bar[1] - 10]], { w: 6, key: 'bar' });
  // THE BRAKES: construction lines in pencil only, never inked — still being wired
  const lev = [[bar[0] + 60, bar[1] + 6], [bar[0] + 110, bar[1] + 50], [bar[0] + 90, bar[1] + 64]];
  ctx.save(); ctx.setLineDash([12, 10]);
  gpencil(lev, { key: 'lever', w: 3, a: 0.9, part: ev(E0 + 0.5, 0.5) });
  gpencil([[bar[0] + 100, bar[1] + 58], [fx + 30, y - 120], [fx + 20, y - r + 10]], { key: 'cable', w: 2.6, a: 0.8, part: ev(E0 + 0.8, 0.6) });
  gpencil(loopPts(fx + 10, y - r + 4, 30, 18, 0.1), { key: 'caliper', w: 2.6, a: 0.8, part: ev(E0 + 1.2, 0.4) });
  ctx.restore();
  // the pencil still drawing them
  if (TT < E0 + 4.6) { const tip = writeEnd(lev, ((TT - E0) * 0.6) % 1); pencilTool(tip[0], tip[1], -0.75 + 0.08 * Math.sin(B * 1.7), 0.9); }
  // Sam riding, leaning forward, a little worried
  doodleHero(bx + 140, y - 268, 96, { key: 'sam', mood: 'puzzled', look: [1, 0.2], arms: [-0.3, -0.25], rot: 0.12 });
  for (let i = 0; i < 2; i++) sweat(bx + 40 - i * 14, y - 360 + i * 10, ((TT * 1.2 + i * 0.5) % 1), 'sw' + i);
  // the label: prefrontal cortex = the brakes
  handLetter('prefrontal', 700, 620, 54, { key: 'pfc1', reveal: ev(cu.enough + 0.4, 0.35) });
  handLetter('cortex', 700, 680, 54, { key: 'pfc2', reveal: ev(cu.enough + 0.6, 0.3) });
  arrowPencil([[720, 710], [740, 760], [bar[0] + 100, bar[1] + 30]], ev(cu.enough + 0.8, 0.35));
  // the age ruler: wiring from childhood to ~25
  const RX0 = 180, RX1 = 860, RY = 500;
  gline([[RX0, RY], [RX1, RY]], { w: 4, key: 'rul', part: ev(E0 + 0.3, 0.4), second: false });
  [[RX0, '10'], [lerp(RX0, RX1, 0.5), '17'], [RX1, '25']].forEach(([x, s], i) => {
    gline([[x, RY - 14], [x, RY + 14]], { w: 3, key: 'tk' + i, second: false, part: ev(E0 + 0.4, 0.2) });
    handLetter(s, x, RY + 60, 42, { col: SK.graph, key: 'ag' + i, reveal: ev(E0 + 0.5 + i * 0.1, 0.2) });
  });
  const fill = lerp(0.05, 0.22, ev(E0 + 0.6, 2));
  ctx.save(); ctx.setLineDash([16, 10]); gpencil([[RX0, RY - 28], [lerp(RX0, RX1, fill), RY - 28]], { key: 'wire', w: 5, a: 0.9, passes: 1 }); ctx.restore();
  handLetter('wiring…', lerp(RX0, RX1, fill) + 20, RY - 40, 40, { align: 'left', col: SK.graph, key: 'wiring' });
  pageTag('the brakes');
  pageCaption(['still wiring', 'until ~25'], [[0, 'wiring']], { at: 1.0, y: 1390, size: 74 });
}

// ---- era 4: night — screen light holds melatonin back
const MOON4 = { x: 760, y: 560, r: 102 };
function sceneNight() {
  const cu = TIMELINE.cues;
  sketchPage({ grid: 'dots', tint: NIGHT, tintA: 0.58 });
  // the window and the moon
  const WP = rrectPts(MOON4.x - 150, MOON4.y - 150, 300, 300, 8);
  gfill(WP, '#1c2436', { off: [0, 0], key: 'nw' });
  const MP = loopPts(MOON4.x, MOON4.y, MOON4.r, MOON4.r, 0.06);
  gfill(MP, '#f3eedb', { off: [0, 0], key: 'nmf' }); gline(MP, { w: 4, key: 'nm', col: SK.ink, second: false });
  [[MOON4.x - 110, MOON4.y - 100], [MOON4.x + 110, MOON4.y + 90], [MOON4.x - 90, MOON4.y + 110]].forEach(([x, y], i) => doodleStar(x, y, 12 + 4 * ((B + i) % 3 === 0), 'nst' + i, { w: 2.4, col: '#f3eedb' }));
  gline(sketchBox(MOON4.x - 150, MOON4.y - 150, 300, 300, 8, 0.03), { w: 5, key: 'nwf' });
  // the bed, Sam under the blanket, the tablet held up over the face
  const bed = [[110, 1180], [110, 1010], [900, 1010], [900, 1180]];
  gfill(bed, SK.wood, { key: 'bedf', a: 0.9 }); gline(bed, { closed: true, w: 5, key: 'bed' });
  gline([[110, 1180], [110, 1250]], { w: 6, key: 'leg1', second: false }); gline([[900, 1180], [900, 1250]], { w: 6, key: 'leg2', second: false });
  const pillow = loopPts(250, 990, 120, 40, 0.05); gfill(pillow, SK.sheet, { key: 'pilf' }); gline(pillow, { w: 4, key: 'pil' });
  doodleHero(290, 920, 100, { key: 'sam', mood: 'wow', look: [1, -0.7], arms: [null, 1.0] });
  const blanket = [[300, 1000], [380, 960], [880, 950], [900, 1060], [320, 1080]];
  gfill(blanket, '#cfd6e6', { key: 'blf' }); ctx.save(); gclip(blanket); ghatch(290, 940, 910, 1090, { ang: 0.8, gap: 14, col: SK.graph, w: 2, a: 0.4, key: 'blh' }); ctx.restore();
  gline(blanket, { closed: true, w: 5, key: 'bl' });
  const tx = 450, ty = 790;
  glowCone([tx - 20, ty + 20], [300, 900], 110, 0.85, 'ncone');
  tablet(tx, ty, 190, 130, 0.5, 1, 'ntab');
  // the body clock: "still day?" in the glow
  if (TT < cu.sensitive - 0.3) handLetter('"still day?"', 740, 840, 52, { col: '#f3eedb', key: 'sd', reveal: ev(E0 + 1.2, 0.4), rot: -0.06 });
  // melatonin: a queue of z's held behind a gate the screen light keeps shut
  const gx = 200, gy = 1350 - 0;
  handLetter('melatonin', 150, 480, 52, { align: 'left', key: 'mel', reveal: ev(cu.melatonin - 0.1, 0.35) });
  gline([[130, 500], [130, 690]], { w: 5, key: 'gate1', second: false }); gline([[380, 500], [380, 690]], { w: 5, key: 'gate2', second: false });
  for (let i = 0; i < 3; i++) gline([[130, 530 + i * 60], [380, 530 + i * 60]], { w: 4, key: 'gb' + i, second: false, col: SK.hilite });
  for (let i = 0; i < 4; i++) {
    if (TT < cu.melatonin + i * 0.12) continue;
    const bob = 8 * Math.sin(B * 1.3 + i);
    handLetter('z', 170 + i * 58, 640 + bob - (i % 2) * 30, 58 - i * 4, { face: 'marker', col: '#f3eedb', key: 'z' + i });
  }
  handLetter('waits…', 255, 760, 44, { col: '#f3eedb', key: 'wt', reveal: ev(cu.melatonin + 0.6, 0.3) });
  // the margin note: kids' eyes are extra sensitive
  if (TT > cu.sensitive - 0.3) {
    const ex = 760, ey = 830, u = ev(cu.sensitive - 0.3, 0.3);
    const eye = [...arcPts(ex, ey + 40, 80, Math.PI * 1.2, Math.PI * 1.8, 10), ...arcPts(ex, ey - 40, 80, Math.PI * 0.2, Math.PI * 0.8, 10)];
    gfill(eye, SK.sheet, { off: [0, 0], key: 'eyef' }); gline(eye, { closed: true, w: 4, key: 'eye', part: u });
    ctx.fillStyle = SK.ink; ctx.beginPath(); ctx.arc(ex, ey, 22, 0, TAU); ctx.fill();
    handLetter('kids: extra', ex, ey + 80, 40, { col: '#f3eedb', key: 'ks1', reveal: ev(cu.sensitive, 0.3) });
    handLetter('sensitive', ex, ey + 124, 40, { col: '#f3eedb', key: 'ks2', reveal: ev(cu.sensitive + 0.15, 0.3) });
  }
  pageTag('night');
  pageCaption(['melatonin', 'waits'], [[0, 'melatonin']], { at: Math.max(0.8, cu.melatonin - E0 - 0.2), y: 1380 });
}

// ---- era 5: the cost, then the tablet goes face-down and its glow lifts off
const SAM5 = [380, 960, 120], DESK = 1120, TAB5 = [690, 1060];
const GLOW = { x: 540, y: 600, r: 92 };
function glowAt() {   // the glow disc: sits on the screen, then lifts to GLOW after the tablet flips
  const u = EZ.io(ev(TIMELINE.cues.facedown + 0.25, (T6 - 0.6) - (TIMELINE.cues.facedown + 0.25)));
  return [lerp(TAB5[0], GLOW.x, u), lerp(TAB5[1] - 30, GLOW.y, u), lerp(60, GLOW.r, u), u];
}
function sceneCost() {
  const cu = TIMELINE.cues, flip = ev(cu.facedown, 0.25), down = flip >= 1;
  sketchPage({ grid: 'dots', tint: '#8a8578', tintA: 0.12 });
  gline([[80, DESK], [1000, DESK]], { w: 6, key: 'desk' }); gline([[140, DESK], [140, DESK + 200]], { w: 5, key: 'dl1', second: false }); gline([[920, DESK], [920, DESK + 200]], { w: 5, key: 'dl2', second: false });
  // scattered focus: graphite tangles over Sam's head
  [[230, 640, 150], [420, 560, 120], [610, 700, 110]].forEach(([x, y, s], i) => { if (TT > E0 + 0.3 + i * 0.25) graphiteScribble(x, y, s, s * 0.7, 'tang' + i); });
  handLetter('?', 520, 470, 80, { col: SK.graph, key: 'q1' }); handLetter('!?', 160, 520, 64, { col: SK.graph, key: 'q2' });
  // Sam: slumped, heavy lids, a yawn
  const [sx, sy, sr] = SAM5;
  doodleHero(sx, sy, sr, { key: 'sam', mood: down ? 'calm' : 'calm', look: [0.9, 0.5], sy: 0.92, sx: 1.05, rot: -0.1, arms: [-1.2, down ? -0.1 : -0.4] });
  for (const s of [-1, 1]) gline([[sx + s * sr * 0.3 - 12, sy - 6], [sx + s * sr * 0.3 + 20, sy - 10]], { w: 5, key: 'lid' + s, second: false });
  if (!down) for (let i = 0; i < 3; i++) handLetter('z', sx + 120 + i * 30, sy - 140 - i * 40 - 10 * ((TT * 2) % 1), 40 + i * 8, { col: SK.graph, key: 'zz' + i });
  // the tablet: brightest just before it goes face-down
  const [tx, ty] = TAB5;
  if (!down) {
    const pool = loopPts(tx, ty - 40, 260, 170, 0.05);
    ctx.save(); ctx.globalAlpha = 0.28; scribbleFill(pool, SK.hilite, { key: 'pool5', gap: 18, w: 3, base: 0.4 }); ctx.restore();
    tablet(tx, ty - 10 * flip, 220, 150 * (1 - 0.8 * flip), 0, 1, 'tab5');
  } else tablet(tx, DESK - 16, 220, 28, 0, 0, 'tab5d', { faceDown: true });
  // the glow lifts off the face-down tablet: the bridge object
  if (down) {
    const [gx, gy, gr] = glowAt(), GP = loopPts(gx, gy, gr, gr, 0.06);
    scribbleFill(GP, SK.hilite, { key: 'glow', gap: 11, w: 4.2, base: 0.45 }); gline(GP, { w: 5, key: 'glowo' });
  }
  pageTag('the cost');
  pageCaption(['less sleep', 'scattered focus'], [[1, 'scattered']], { at: 0.4, y: 1380, size: 76 });
}
