// =====================================================================
//  SCENES — The Glowing Rectangle. World coords 1080x1920 (the page); TT on 2s; ev / popS for events.
//  Yellow (SK.hilite) is the screen's glow and nothing else; terracotta is Sam.
// =====================================================================
const NIGHT = '#1f2c4f';
const ROOM = { tab: [640, 960, 240, 168, -0.32], sam: [400, 1000, 140], win: [250, 600, 220, 240] };

// ---- shared props
function tabletPts(x, y, w, h, rot, inset = 0) {   // a rounded rectangle, rotated about its centre
  return xform(rrectPts(-w / 2 + inset, -h / 2 + inset, w - 2 * inset, h - 2 * inset, 18 - inset * 0.5, 6), x, y, rot);
}
function tablet(x, y, w, h, rot, glow, key, o = {}) {
  const outer = tabletPts(x, y, w, h, rot), inner = tabletPts(x, y, w, h, rot, 14);
  gfill(outer, o.faceDown ? SK.graphL : SK.lead, { off: [3, 3], key: key + 'b', a: 0.9 });
  if (!o.faceDown) {
    gfill(inner, glow > 0 ? '#fff6c8' : SK.sheet, { off: [0, 0], key: key + 'g', a: 1 });
    if (glow > 0) scribbleFill(inner, SK.hilite, { key: key + 's', gap: 11, w: 4, base: 0.45 * glow });
  } else ghatch(x - w / 2, y - h / 2 - 30, x + w / 2, y + h / 2 + 30, { ang: 0.7, gap: 10, col: SK.graph, w: 2, a: 0.0, key: key + 'hh' });
  gline(outer, { closed: true, w: 5, key: key + 'o' });
  if (!o.faceDown) gline(inner, { closed: true, w: 2.5, key: key + 'i', second: false });
  return inner;
}
// a soft cone of screen light from the tablet onto a target (a yellow scribble, low and loose)
function glowCone(from, to, spread, a, key) {
  const dx = to[0] - from[0], dy = to[1] - from[1], L = Math.hypot(dx, dy), nx = -dy / L, ny = dx / L;
  const P = [[from[0] + nx * 40, from[1] + ny * 40], [to[0] + nx * spread, to[1] + ny * spread], [to[0] - nx * spread, to[1] - ny * spread], [from[0] - nx * 40, from[1] - ny * 40]];
  ctx.save(); ctx.globalAlpha = a; scribbleFill(P, SK.hilite, { key, gap: 18, w: 3, base: 0.25 }); ctx.restore();
}
function windowFrame(x, y, w, h, key, sky, o = {}) {
  const P = sketchBox(x - w / 2, y - h / 2, w, h, 8, 0.03);
  gfill(rrectPts(x - w / 2, y - h / 2, w, h, 8), sky, { off: [0, 0], key: key + 'sky', a: 1 });
  if (o.moon) {
    const m = loopPts(x + 28, y - 30, 34, 34, 0.08);
    gfill(m, '#f3eedb', { off: [0, 0], key: key + 'mf' }); gline(m, { w: 3.5, key: key + 'm', col: '#f3eedb', second: false });
    [[x - 40, y - 50], [x - 20, y + 40], [x + 45, y + 50]].forEach(([sx, sy], i) => doodleStar(sx, sy, 9 + 3 * ((B + i) % 3 === 0), key + 'st' + i, { w: 2.2, col: '#f3eedb' }));
  }
  if (o.sun) {
    const s = loopPts(x + 20, y - 25, 38, 38, 0.08);
    scribbleFill(s, SK.hilite, { key: key + 'sf', gap: 9, w: 3.5, base: 0.5 }); gline(s, { w: 3.5, key: key + 's' });
    for (let i = 0; i < 8; i++) { const a = i / 8 * TAU + TT * 0.3; gline([[x + 20 + Math.cos(a) * 48, y - 25 + Math.sin(a) * 48], [x + 20 + Math.cos(a) * 60, y - 25 + Math.sin(a) * 60]], { w: 3, key: key + 'r' + i, second: false }); }
  }
  gline(P, { w: 5, key: key + 'fr' });
  gline([[x, y - h / 2], [x, y + h / 2]], { w: 3.5, key: key + 'v', second: false });
  gline([[x - w / 2, y], [x + w / 2, y]], { w: 3.5, key: key + 'h', second: false });
}
function wallClock(x, y, r, key, night) {
  const P = loopPts(x, y, r, r, 0.06);
  gfill(P, SK.sheet, { off: [3, 3], key: key + 'f', a: night ? 0.55 : 1 }); gline(P, { w: 4, key: key + 'o' });
  for (let i = 0; i < 12; i++) { const a = i / 12 * TAU; gline([[x + Math.cos(a) * r * 0.78, y + Math.sin(a) * r * 0.78], [x + Math.cos(a) * r * 0.9, y + Math.sin(a) * r * 0.9]], { w: 2.2, key: key + 't' + i, second: false, amp: 0.2 }); }
  const hr = night ? -Math.PI / 2 + TAU * (10.5 / 12) : -Math.PI / 2 + TAU * (8 / 12), mn = -Math.PI / 2 + TAU * (B % 60) / 60;
  gline([[x, y], [x + Math.cos(hr) * r * 0.5, y + Math.sin(hr) * r * 0.5]], { w: 5, key: key + 'hr', second: false });
  gline([[x, y], [x + Math.cos(mn) * r * 0.75, y + Math.sin(mn) * r * 0.75]], { w: 3, key: key + 'mn', second: false });
}
function plant(x, y, s, key) {
  const pot = [[x - 40 * s, y - 70 * s], [x + 40 * s, y - 70 * s], [x + 30 * s, y], [x - 30 * s, y]];
  gfill(pot, SK.wood, { key: key + 'p' }); gline(pot, { closed: true, w: 4, key: key + 'po' });
  for (let i = 0; i < 5; i++) {
    const a = -Math.PI / 2 + (i - 2) * 0.42 + 0.04 * Math.sin(TT * 2 + i), L = (90 + 22 * (i % 2)) * s;
    const b = [x + Math.cos(a) * L, y - 70 * s + Math.sin(a) * L], m = [x + Math.cos(a) * L * 0.5 + 14 * s, y - 70 * s + Math.sin(a) * L * 0.5];
    gline([[x, y - 70 * s], m, b, [x + Math.cos(a) * L * 0.5 - 10 * s, y - 70 * s + Math.sin(a) * L * 0.55], [x, y - 70 * s]], { w: 3.2, key: key + 'l' + i, second: false });
  }
}
function beanbag(x, y, key) {
  const P = [[x - 210, y + 150], [x - 230, y + 60], [x - 170, y - 20], [x - 60, y - 40], [x + 60, y - 20], [x + 150, y + 30], [x + 200, y + 150]];
  gfill(P, SK.sheet, { off: [4, 4], key: key + 'f' });
  ctx.save(); gclip(P); ghatch(x - 240, y - 50, x + 210, y + 160, { ang: -0.8, gap: 13, col: SK.graph, w: 2, a: 0.35, key: key + 'h' }); ctx.restore();
  gline(P, { closed: true, w: 5, key: key + 'o' });
}

// ---- era 0 and 7: the room (night at the start; daylight at the end, the tablet face-down)
function sceneRoom(day) {
  const cu = TIMELINE.cues, [sx, sy, sr] = ROOM.sam, [tx, ty, tw, th, trot] = ROOM.tab;
  sketchPage({ grid: 'dots', tint: day ? null : NIGHT, tintA: 0.58 });
  // floor line, rug, the window, clock, plant
  gpencil([[70, 1215], [400, 1210], [700, 1218], [1000, 1212]], { key: 'floor', w: 3, a: 0.8 });
  gpencil(loopPts(500, 1240, 330, 34, 0.05), { key: 'rug', w: 2.6, a: 0.55 });
  windowFrame(ROOM.win[0], ROOM.win[1], ROOM.win[2], ROOM.win[3], 'win', day ? '#dfeaf0' : '#1c2436', { moon: !day, sun: day });
  wallClock(790, 560, 74, 'clock', !day);
  plant(870, 1210, 0.95, 'plant');
  beanbag(sx, sy + 90, 'bag');
  if (!day) {
    // night: hunched over the glow
    // a pool of screen light on the dark page, then the tablet and the cone onto Sam's face
    const pool = loopPts(tx - 80, ty - 20, 330, 250, 0.05);
    ctx.save(); ctx.globalAlpha = 0.18; scribbleFill(pool, SK.hilite, { key: 'pool', gap: 22, w: 3, base: 0.35 }); ctx.restore();
    glowCone([tx - 30, ty - 20], [sx + 30, sy - 20], 130, 0.85, 'cone');
    const inner = tablet(tx, ty, tw, th, trot, 1, 'tab');
    doodleHero(sx, sy, sr, { key: 'sam', legs: true, mood: 'calm', look: [1, 0.6], sx: 1.02, sy: 0.96, arms: [-1.2, -0.25], rot: 0.08 });
    // a sparkle on the screen on 2s: the feed refreshing
    sparkle(tx + 30, ty - 20, 22, (B % 6) / 6, 'tabspk');
    // the time and the dark
    pageTag('~5 hrs a day');
    pageCaption(['a glowing', 'rectangle'], [[1, 'rectangle']], { at: 0.6 });
  } else {
    // daylight: the tablet face-down on the rug; Sam drawing in a sketchbook
    tablet(tx + 120, 1205, tw, 30, 0, 0, 'tabdown', { faceDown: true });
    const bk = [[sx + 70, sy + 40], [sx + 230, sy + 10], [sx + 250, sy + 110], [sx + 90, sy + 140]];
    gfill(bk, SK.sheet, { off: [3, 3], key: 'book' }); gline(bk, { closed: true, w: 4.5, key: 'booko' });
    gpencil([[sx + 120, sy + 60], [sx + 160, sy + 50], [sx + 200, sy + 70]], { key: 'bookdoodle', w: 2.4, part: ev(E0 + 0.6, 1.5) });
    const hop = Math.sin(Math.PI * ev(cu.balance, 0.3));
    doodleHero(sx, sy - 40 * hop, sr, { key: 'sam', legs: true, mood: 'happy', look: [0.6, 0.3], arms: [-0.6, -0.1] });
    paperPlaneLoop('pp', 820, 820);
    pageTag('balance');
    pageCaption(['balance is', 'the skill'], [[1, 'skill']], { at: Math.max(0.6, cu.balance - E0 - 0.3) });
  }
}
function paperPlaneLoop(key, cx, cy) {
  const at = (p) => [cx + 110 * Math.sin(TAU * p), cy + 50 * Math.sin(2 * TAU * p)];
  const p = TT / 3.4, trail = [];
  for (let i = 0; i <= 24; i++) trail.push(at(p - 0.35 + 0.35 * i / 24));
  ctx.save(); ctx.setLineDash([10, 12]); gpencil(trail, { key: key + 'tr', w: 2.2, a: 0.6, passes: 1, amp: 1 }); ctx.restore();
  const [x, y] = at(p), [x2, y2] = at(p + 0.01);
  paperPlane(x, y, Math.atan2(y2 - y, x2 - x), 1.15, key);
}
