// =====================================================================
//  ERAS, CAMERAS, BRIDGES — The Glowing Rectangle (read by kit/morph.js)
//  Each bridge sits in the pause between two voice lines; the camera pulls in on the bridge object first.
// =====================================================================
const ERA_BG = [NIGHT, '#f2ead8', '#f2ead8', '#f2ead8', NIGHT, '#ece4d2', '#f2ead8', '#f2ead8'];
function pieceCam(era, t) {
  const [tx, ty] = ROOM.tab;
  if (era === 0) return push(t, T1 - 2.4, T1 - 0.6, { z: 1.45, p: [tx, ty], to: [540, 820] });                              // into the tablet
  return null;
}
const circ = (x, y, r) => ellipsePts(x, y, r, r, 0, 96);
const BRIDGES = [
  { tc: T1, A: () => ({ P: tabletPts(...ROOM.tab, 14), c: SK.hilite }), B: () => ({ P: phoneInner(), c: SK.hilite }) },            // the tablet -> the phone screen
  { tc: T2, A: () => ({ P: phoneInner(), c: SK.hilite }), B: () => ({ P: brainPts(), c: '#f6e3dc' }) },                           // the screen -> the brain
  { tc: T3, A: () => { const [x, y, r] = FRONTAL(); return { P: circ(x, y, r), c: SK.graphL }; }, B: () => ({ P: circ(BIKE.fx, BIKE.y, BIKE.r), c: SK.graphL }) },   // the front of the brain -> the front wheel
  { tc: T4, A: () => ({ P: circ(BIKE.fx, BIKE.y, BIKE.r), c: SK.graphL }), B: () => ({ P: circ(MOON4.x, MOON4.y, MOON4.r), c: '#f3eedb' }) },                    // the wheel -> the moon
  { tc: T5, A: () => ({ P: circ(MOON4.x, MOON4.y, MOON4.r), c: '#f3eedb' }), B: () => ({ P: circ(SAM5[0], SAM5[1], SAM5[2]), c: SK.terra }) },                   // the moon -> tired Sam
  { tc: T6, A: () => { const [x, y, r] = glowAt(); return { P: circ(x, y, r), c: SK.hilite }; }, B: () => ({ P: circ(SUN6.x, SUN6.y, SUN6.r), c: SK.hilite }) },   // THE PAYOFF: the glow -> the sun
  { tc: T7, A: () => ({ P: circ(SUN6.x, SUN6.y, SUN6.r), c: SK.hilite }), B: () => ({ P: rrectPts(ROOM.win[0] - ROOM.win[2] / 2, ROOM.win[1] - ROOM.win[3] / 2, ROOM.win[2], ROOM.win[3], 8), c: '#dfeaf0' }) },   // the sun -> the window
];
