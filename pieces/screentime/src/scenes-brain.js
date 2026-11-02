// =====================================================================
//  SCENES — the brain (era 2) and the morning (era 6)
// =====================================================================
const BRAIN = { x: 470, y: 720, s: 1.1 };
const BRAIN_REL = [[250, 40], [292, -30], [282, -112], [232, -182], [142, -232], [30, -252], [-82, -242], [-182, -202], [-262, -132], [-302, -42], [-292, 50], [-242, 110],
  [-200, 142], [-140, 170], [-80, 160], [-52, 122], [0, 112], [80, 122], [160, 102], [222, 80]];
const brainPts = (x = BRAIN.x, y = BRAIN.y, s = BRAIN.s) => BRAIN_REL.map(([a, b]) => [x + a * s, y + b * s]);
const FRONTAL = () => [BRAIN.x + 185 * BRAIN.s, BRAIN.y - 95 * BRAIN.s, 92 * BRAIN.s];   // the front of the brain (x, y, r)
const REWARD = () => [BRAIN.x + 55 * BRAIN.s, BRAIN.y + 30 * BRAIN.s];
// sulci: graphite folds, fixed by key, boiling only in tremor
function brainFolds(P, key, a = 0.7) {
  const { x, y, s } = BRAIN;
  ctx.save(); gclip(P);
  const R = RNG(key);
  for (let i = 0; i < 9; i++) {
    const y0 = y - 210 * s + i * 42 * s, Q = [];
    for (let k = 0; k <= 10; k++) Q.push([x - 300 * s + k * 60 * s, y0 + Math.sin(k * 1.3 + i) * 18 * s + R.r(-6, 6)]);
    gpencil(Q, { key: key + i, w: 2.6, a, passes: 1, amp: 2 });
  }
  ctx.restore();
  gline([[x - 30 * s, y + 40 * s], [x + 60 * s, y + 10 * s], [x + 140 * s, y - 5 * s], [x + 215 * s, y - 20 * s]], { w: 4, key: key + 'lat', second: false });   // the lateral fissure
}
function brainDraw(key, o = {}) {
  const P = brainPts(), { x, y, s } = BRAIN;
  // the stem and the little cerebellum hatch
  const stem = [[x - 40 * s, y + 120 * s], [x - 30 * s, y + 250 * s], [x + 15 * s, y + 250 * s], [x + 12 * s, y + 116 * s]];
  gfill(stem, SK.sheet, { off: [3, 3], key: key + 'stf' }); gline(stem, { w: 4.5, key: key + 'st' });
  gfill(P, o.fill ?? '#f6e3dc', { off: [6, 5], key: key + 'f' });
  brainFolds(P, key + 'fold', o.foldA ?? 0.6);
  ctx.save(); gclip(P); ghatch(x - 230 * s, y + 90 * s, x - 40 * s, y + 175 * s, { ang: -0.9, gap: 8, col: SK.graph, w: 2, a: 0.5, key: key + 'cbh' }); ctx.restore();
  gline(P, { closed: true, w: 6, key: key + 'o', part: o.part ?? 1 });
  return P;
}
function dopaChart(t0, key) {
  // a hand-drawn graph: dopamine spikes on "maybe…?" and barely moves on "got it"
  const X0 = 170, X1 = 840, Y0 = 1225, Y1 = 1040;
  gline([[X0, Y1 - 20], [X0, Y0], [X1, Y0]], { w: 4, key: key + 'ax', part: ev(t0, 0.4), second: false });
  handLetter('dopamine', X0 + 10, Y1 - 40, 40, { align: 'left', col: SK.graph, key: key + 'yl', reveal: ev(t0 + 0.2, 0.4) });
  const curve = [];
  for (let i = 0; i <= 60; i++) {
    const u = i / 60, x = lerp(X0 + 10, X1 - 10, u);
    const v = 0.12 + 0.88 * Math.exp(-((u - 0.36) ** 2) / 0.006) + 0.18 * Math.exp(-((u - 0.78) ** 2) / 0.004);
    curve.push([x, Y0 - 12 - v * (Y0 - Y1 - 30)]);
  }
  const draw = ev(t0 + 0.5, TIMELINE.cues.prize - t0 - 0.2);
  gline(curve, { w: 5.5, key: key + 'cv', part: draw, step: 5 });
  if (draw > 0.38) {
    const pk = curve[22];
    sparkle(pk[0], pk[1] - 10, 34, ((B % 4) / 4), key + 'pk');
    handLetter('maybe…?', pk[0] + 30, pk[1] + 6, 52, { align: 'left', key: key + 'mb', reveal: ev(TIMELINE.cues.chase - 0.6, 0.35) });
  }
  if (draw > 0.82) {
    const g = curve[47];
    handLetter('got it', g[0] - 10, g[1] - 26, 44, { align: 'left', col: SK.graph, key: key + 'gi', reveal: ev(TIMELINE.cues.prize - 0.2, 0.3) });
  }
}
// ---- era 2: dopamine fires for the chase
function sceneDopa() {
  const cu = TIMELINE.cues;
  sketchPage({ grid: 'dots' });
  brainDraw('br', { part: ev(E0 + 0.1, 0.6) });
  // the reward centre: pulses yellow each time a "maybe" arrives (the screen's glow, acting inside)
  const [rx, ry] = REWARD();
  const pulse = Math.max(0, Math.sin(TAU * (TT - E0) / 0.75)) * ev(E0 + 0.7, 0.3);
  const RP = loopPts(rx, ry, 40 + 10 * pulse, 34 + 9 * pulse, 0.08);
  scribbleFill(RP, SK.hilite, { key: 'rew', gap: 9, w: 3.6, base: 0.3 + 0.5 * pulse, part: ev(E0 + 0.7, 0.4) });
  gline(RP, { w: 4, key: 'rewo', part: ev(E0 + 0.7, 0.3) });
  for (let i = 0; i < 7; i++) {   // dopamine sparks drifting up out of it
    const ph = ((TT - E0) * 0.9 + i / 7) % 1, a = -Math.PI / 2 + (i - 3) * 0.35;
    if (TT < E0 + 0.9) break;
    const d = 50 + 170 * ph, px = rx + Math.cos(a) * d, py = ry + Math.sin(a) * d;
    ctx.save(); ctx.globalAlpha = 1 - ph; ctx.fillStyle = SK.hilite; ctx.beginPath(); ctx.arc(px, py, 11 - 5 * ph, 0, TAU); ctx.fill(); ctx.restore();
    gline(loopPts(px, py, 11 - 5 * ph, 11 - 5 * ph, 0.1), { w: 2, key: 'dsp' + i, second: false, a: 1 - ph });
  }
  // labels: "reward", "want more!"
  arrowPencil([[150, 470], [260, 560], [rx - 50, ry - 10]], ev(E0 + 1.0, 0.4));
  handLetter('reward', 140, 440, 50, { col: SK.ink, key: 'rwl', reveal: ev(E0 + 1.1, 0.3) });
  handLetter('want more!', 760, 400, 58, { face: 'marker', key: 'wm', rot: -0.05, reveal: ev(VW('dopa', 'want') - 0.1, 0.35) });
  arrowPencil([[700, 430], [640, 520], [rx + 30, ry - 60]], ev(VW('dopa', 'want'), 0.35));
  dopaChart(E0 + 1.6, 'ch');
  pageTag('dopamine');
  pageCaption(['fires for', 'the chase'], [[1, 'chase']], { at: Math.max(1.0, cu.chase - E0 - 0.5), y: 1370, size: 74 });
}

// ---- era 6: morning — the glow became the sun
const SUN6 = { x: 740, y: 470, r: 125 };
function friendDoodle(x, y, r, o = {}) {   // a friend: ink and graphite only (the colour is Sam's)
  const key = o.key ?? 'fr', lw = Math.max(3, r * 0.065);
  ctx.save(); ctx.translate(x, y);
  for (const s of [-1, 1]) {
    gline([[s * r * 0.3, r * 0.85], [s * r * 0.36, r * 1.42]], { w: lw, key: key + 'lg' + s, second: false, step: 8 });
    gline([[s * r * 0.36, r * 1.42], [s * r * 0.58, r * 1.42]], { w: lw * 1.2, key: key + 'ft' + s, second: false, step: 6 });
  }
  (o.arms ?? [0.3, 0.3]).forEach((ang, i) => { const s = i ? 1 : -1, sh = [s * r * 0.9, r * 0.1], hd = [sh[0] + s * r * 0.8 * Math.cos(ang), sh[1] - r * 0.8 * Math.sin(ang)]; gline([sh, hd], { w: lw, key: key + 'a' + s, second: false, step: 8 }); });
  const body = [...loopPts(0, 0, r, r * 0.92, 0, 0, 40)];
  gfill(body, SK.sheet, { off: [r * 0.05, r * 0.05], key: key + 'f' });
  litHatch(body, { ang: -0.85, gap: Math.max(6, r * 0.09), col: SK.graph, w: 2, a: 0.6, key: key + 'h' });
  gline(loopPts(0, 0, r, r * 0.92, 0.08), { w: lw, key: key + 'o' });
  for (const s of [-1, 1]) { ctx.fillStyle = SK.ink; ctx.beginPath(); ctx.ellipse(s * r * 0.3, 0, r * 0.08, r * 0.11, 0, 0, TAU); ctx.fill(); }
  ctx.fillStyle = SK.ink; ctx.beginPath(); ctx.moveTo(-r * 0.2, r * 0.3); ctx.quadraticCurveTo(0, r * 0.6, r * 0.2, r * 0.3); ctx.closePath(); ctx.fill();
  gline([[-r * 0.5, -r * 0.75], [-r * 0.2, -r * 1.0], [r * 0.15, -r * 0.82]], { w: lw, key: key + 'hair', second: false });
  ctx.restore();
}
function sunDraw(x, y, r, key, grow = 1) {
  const SP = ellipsePts(x, y, r, r, 0, 64);
  for (let i = 0; i < 14; i++) {
    const a = i / 14 * TAU + TT * 0.25, r0 = r * 1.18, r1 = r * (1.42 + 0.1 * ((B + i) % 2));
    gline([[x + Math.cos(a) * r0, y + Math.sin(a) * r0], [x + Math.cos(a) * r1, y + Math.sin(a) * r1]], { w: 5, key: key + 'ray' + i, part: grow, second: false, amp: 0.8, step: 8 });
  }
  scribbleFill(SP, SK.hilite, { key: key + 'f', gap: 12, w: 4.5, base: 0.4 });
  gline(loopPts(x, y, r, r, 0.06), { key: key + 'o', w: 6 });
}
function sceneMorning() {
  const cu = TIMELINE.cues;
  sketchPage({ grid: 'dots' });
  sunDraw(SUN6.x, SUN6.y, SUN6.r, 'sun6', ev(E0, 0.5));
  for (let i = 0; i < 3; i++) doodleBird(160 + 80 * (TT - E0) + i * 60, 760 + i * 30 - (i % 2) * 14, 1.2 - i * 0.2, (B + i) % 2, 'bd' + i);
  // the hill and grass
  const hill = [[-160, 1260], [120, 1190], [420, 1150], [700, 1160], [1000, 1200], [1240, 1250]];
  gline(hill, { key: 'hill', w: 6 });
  for (let i = 0; i < 18; i++) { const x = 90 + i * 48, y = 1185 + 8 * Math.sin(i * 1.7); gpencil([[x, y], [x + 6, y - 22 - 6 * ((B + i) % 2)]], { key: 'gr' + i, w: 2.4, a: 0.7, passes: 1 }); }
  // the checklist in a thought cloud: sleep, play, real faces — each ticked on its word
  const cl = xform([...arcPts(250, 540, 80, Math.PI * 0.7, Math.PI * 1.55, 8), ...arcPts(370, 440, 110, Math.PI * 1.1, Math.PI * 1.95, 8), ...arcPts(500, 540, 90, Math.PI * 1.5, Math.PI * 2.4, 8), ...arcPts(380, 680, 120, Math.PI * 0.05, Math.PI * 0.9, 8), ...arcPts(230, 650, 70, Math.PI * 0.5, Math.PI * 1.15, 6)], -20, 10);
  gfill(cl, SK.sheet, { off: [4, 4], key: 'cloudf' }); gline(cl, { closed: true, w: 4.5, key: 'cloud', part: ev(E0 + 0.3, 0.5) });
  [[cu.sleep, 'sleep'], [cu.play, 'play'], [cu.faces, 'real faces']].forEach(([t, w], i) => {
    const y = 490 + i * 82;
    checkMark(200, y - 12, 0.8, ev(t, 0.25));
    handLetter(w, 245, y, 54, { align: 'left', key: 'ck' + i, reveal: ev(t - 0.05, 0.3) });
  });
  for (let i = 0; i < 3; i++) gline(loopPts(320 + i * 30, 800 + i * 44, 14 - i * 3, 14 - i * 3, 0.1), { w: 3, key: 'tb' + i, second: false });
  // Sam and a friend playing catch; the ball arcs between them on 2s
  const per = 1.6, ph = ((TT - E0) / per) % 1, dir = Math.floor((TT - E0) / per) % 2;
  const A = [400, 960], Bp = [780, 980], u = dir ? 1 - ph : ph;
  const bx = lerp(A[0], Bp[0], u), by = lerp(A[1], Bp[1], u) - 260 * Math.sin(Math.PI * u);
  const hopS = Math.sin(Math.PI * clamp(((TT - E0) % (per * 2)) / 0.3)) * (dir ? 0 : 1);
  doodleHero(330, 1010 - 30 * hopS, 100, { key: 'sam', legs: true, mood: 'happy', look: [0.8, -0.6], arms: [-0.5, 1.2], sy: 1 + 0.05 * hopS });
  friendDoodle(820, 1020, 92, { key: 'friend', arms: [1.1, -0.4] });
  const BP = loopPts(bx, by, 26, 26, 0.1);
  gfill(BP, SK.sheet, { off: [2, 2], key: 'ballf' }); gline(BP, { w: 4, key: 'ball' }); gline([[bx - 24, by], [bx + 24, by]], { w: 2.5, key: 'balls', second: false });
  pageTag('good news');
  pageCaption(['built to', 'change'], [[1, 'change']], { at: 0.8, y: 1370 });
}
