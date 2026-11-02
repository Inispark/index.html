  // SCORE BODY — The Glowing Rectangle (inside buildScore(); see kit/score-head.js)
  // the arc: a quiet night hum -> a pluck per swipe -> a groove that builds through the brain -> busiest at night
  // -> dead silence after "scattered focus" while the tablet goes face-down -> the loudest hit as the glow becomes
  // the sun -> warm and flat under "the good news" -> Sam's rising fifth, fading, at the end.
  const T = TIMELINE, cu = T.cues, R = RNG('score');
  const [T1, T2, T3, T4, T5, T6, T7] = T.morphs, END = T.duration, STOP = VL('cost').t1 + 0.05;
  const FIG = [['D4', 'A4', 'F4', 'A4', 'D5', 'A4', 'F4', 'A4'], ['C4', 'G4', 'E4', 'G4', 'C5', 'G4', 'E4', 'G4'],
    ['Bb3', 'F4', 'D4', 'F4', 'Bb4', 'F4', 'D4', 'F4'], ['A3', 'E4', 'Cs4', 'E4', 'A4', 'E4', 'Cs4', 'E4']];
  const ROOTS = ['D2', 'C2', 'Bb1', 'A1'];
  const SAM = (t, vel, notes = [['D4', 0], ['A4', E8]]) => notes.forEach(([n, dt], i) => pluck(t + dt, nz(n), vel, 0.1 - i * 0.1, 0.6, 2600, 0.35));
  const each = (t0, t1, step, fn) => { for (let k = 0; t0 + k * step < t1 - 1e-6; k++) fn(t0 + k * step, k); };

  // ================= MUSIC =================
  to = 'm';
  // night hook: a low hum and Sam's motif
  pad(0.0, T2 + 0.2, ['D3', 'A3', 'F4'], 0.03, { type: 'triangle', cut: 750, att: 0.6, rel: 0.4 });
  drone(0.0, T2 + 0.2, nz('D2'), 0.035, { att: 0.8, rel: 0.4 });
  SAM(1.0, 0.12);
  // the swipes: a pluck per swipe, the third one (WOW) a bright chime
  [T1 + 0.55, T1 + 1.35, T1 + 2.05, T1 + 2.75].forEach((t, i) => (i === 2 ? chime(t + 0.25, [nz('A5'), nz('D6'), nz('F6')], 0.06, 0.2) : pluck(t + 0.25, nz(['F4', 'E4', '', 'D4'][i]), 0.08, -0.2, 0.4, 1800, 0.3)));
  // the brain -> the brakes -> the night: 8ths, then 16ths, bass on the beat, building
  pad(T2, T5, ['D3', 'A3', 'E4'], 0.028, { cut: 950, att: 0.4, swellTo: 0.036, swellAt: T5 - 0.2, rel: 0.1, send: 0.3 });
  each(T2, T5, E8, (t, k) => {
    const sec = t < T3 ? 0 : t < T4 ? 1 : 2, fig = FIG[Math.floor(k / 8) % 4], acc = k % 2 === 0 ? 1 : 0.75;
    pluck(t, nz(fig[k % 8]), (0.05 + sec * 0.006) * acc, Math.sin(k * 0.9) * 0.3, 0.3, 2800 + sec * 500, 0.2);
    if (k % 2 === 0) bass(t, nz(ROOTS[Math.floor(k / 8) % 4]), 0.13 + sec * 0.01);
    if (sec >= 1 && k % 4 === 0) sub(t, 0.04 + sec * 0.006);
  });
  // the peak: night into the cost — 16ths, hats; stops dead on "focus" (dry in the last beat)
  pad(T5 - 0.1, STOP, ['D3', 'A3', 'E4', 'A4'], 0.03, { cut: 1300, att: 0.1, rel: 0.02, send: 0.08 });
  each(T4, STOP, E16, (t, k) => {
    if (t < T5 && k % 2) return;   // night: 8th hats; the cost: 16ths
    const dry = t >= STOP - 0.5 ? 0.02 : 0.1;
    noiseHit(t, 0.016, 'highpass', 8500, 0.7, k % 2 ? 0.016 : 0.026, k % 2 ? 0.3 : -0.3, dry);
  });
  each(T5, STOP, E16, (t, k) => {
    const fig = FIG[Math.floor(k / 8) % 4], dry = t >= STOP - 0.5 ? 0.02 : 0.12;
    pluck(t, nz(fig[k % 8]), 0.06 * (k % 4 === 0 ? 1.25 : 0.9), Math.sin(k * 0.9) * 0.4, t >= STOP - 0.25 ? 0.15 : 0.26, 5200, dry);
    if (k % 2 === 0) bass(t, nz(ROOTS[Math.floor(k / 8) % 4]), 0.15);
    if (k % 4 === 0) sub(t, 0.06);
  });
  // [silence: STOP -> T6, the tablet goes face-down and the glow lifts]
  // THE PAYOFF: the glow becomes the sun — a chord stab + sub on the hit, then a flat warm chord
  ['D3', 'A3', 'D4', 'Fs4', 'A4', 'D5'].forEach((n, i) => pluck(T6 + i * 0.006, nz(n), 0.36, (i - 2.5) * 0.15, 0.7, 5200, 0.4));
  pad(T6, T6 + 0.4, ['D3', 'A3', 'D4', 'Fs4', 'A4', 'D5'], 0.5, { cut: 3600, att: 0.008, rel: 0.35, send: 0.3 });
  sub(T6, 0.3);
  pad(T6 + 0.35, T7 + 0.2, ['D3', 'A3', 'D4', 'Fs4', 'A4'], 0.04, { cut: 1200, att: 0.3, rel: 0.3, send: 0.5 });
  drone(T6 + 0.35, T7 + 0.2, nz('D2'), 0.05, { att: 0.2, rel: 0.3 });
  [cu.sleep, cu.play, cu.faces].forEach((t, i) => chime(t + 0.05, [nz(['Fs5', 'A5', 'D6'][i])], 0.04, -0.2 + i * 0.2));   // the three ticks
  each(T6 + 1.0, T7, E8, (t, k) => { if (k % 2 === 0 || k % 8 === 5) pluck(t, nz(['D4', 'Fs4', 'A4', 'D5', 'A4', 'Fs4', 'E4', 'Fs4'][k % 8]), 0.04, Math.sin(k) * 0.3, 0.35, 2600, 0.25); if (k % 4 === 0) bass(t, nz(Math.floor(k / 8) % 2 ? 'A1' : 'D2'), 0.11); });
  // balance: back to the opening hum, in major, Sam's motif, fading
  pad(T7, END, ['D3', 'A3', 'Fs4'], 0.014, { type: 'triangle', cut: 800, att: 0.3, rel: 1.2 });
  SAM(cu.balance + 0.6, 0.09, [['D4', 0], ['A4', E8], ['D5', BEAT]]);

  // ================= SFX =================
  to = 's';
  const scratch = (t0, t1, vel = 0.025) => { for (let t = t0; t < t1 - 1e-6; t += E16) noiseHit(t + 0.01, 0.1, 'bandpass', 2800 + R.n(500), 1.4, vel * (0.7 + R.f() * 0.5), 0.2); };
  // morph whooshes (not into the payoff: that one happens in silence)
  [T1, T2, T3, T4, T5, T7].forEach((t) => sweep(t - 0.5, t, 0.01, 500, 2600, 0));
  // swipes: a soft flick each
  [T1 + 0.55, T1 + 1.35, T1 + 2.05, T1 + 2.75].forEach((t) => noiseHit(t, 0.12, 'bandpass', 1800, 1.2, 0.04, 0.2, 0, 4200));
  // the brain draws on; the brakes' pencil; captions written on
  scratch(T2 + 0.1, T2 + 0.7); scratch(T3 + 0.5, T3 + 1.8, 0.02);
  // the tablet goes face-down: one soft tap in the silence (quiet on purpose)
  noiseHit(cu.facedown + 0.25, 0.05, 'lowpass', 600, 0.8, 0.012, 0);
