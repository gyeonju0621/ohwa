/* 오화 — Feel engine v4: 말랑이 만지는 소리 = 실리콘 마찰음 (WebAudio로 실시간 합성) + 진동
   예전 버전은 사인파 "삐융" 소리라 전자음 같았다. 이번엔 실제 슬라임·스퀴시 소리가 만들어지는 방식대로:
   - 물기 있는 찌걱임 = 방울 수십 개 + 대역 필터를 지난 노이즈
   - 고무가 늘어나는 끽 소리 = 노이즈를 좁은 대역 필터로 훑기
   - 바닥에 떨어지는 철퍽 = 낮은 쿵 + 짧은 노이즈 터짐 + 방울
   한 번 소리: OhwaFeel.play(name, {pitch, amt})
     tap      짧게 톡 — 가벼운 "뽁"
     press    꾹 누르기 시작 — 촉촉하게 눌리는 "꾹"
     deep     아주 깊게 눌림 — 찌걱 한 번 더
     release  짧게 누르고 뗌 — 가볍게 "퐁"
     rebound  오래 누르다 뗌 — 출렁 "뽀옹" (amt = 얼마나 깊었나 0~1)
     lift     들어 올림 — 바닥에서 쭈욱 떨어지는 "뽁!" (흡착 떨어지는 소리)
     swing    매달려 흔들 — 작은 바람 소리
     land     떨어뜨림 — "철퍽" + 출렁
     plop     조각이 배에 쏙
     stretch  옆으로 늘이기 — 고무 끽
     chime    하트 반짝
     (옛 이름 squish/boing/pop/crunch/tick도 그대로 동작)
   누르고 있는 동안 소리: const h = OhwaFeel.hold({pitch}); h.set(depth 0~1); h.stop()
     — 눌린 깊이만큼 작은 방울이 뽀글뽀글 터지고 고무가 눌리는 소리가 이어진다
   실제 녹음 ASMR로 바꿀 땐 같은 이름으로 play만 바꾸면 된다. */
(function () {
  let ctx = null, master = null, wet = null;
  const F = { enabled: true, haptics: true };
  const ac = () => {
    if (!ctx) {
      try { ctx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) { return null; }
      // 마스터: 컴프레서(갑자기 커지지 않게) + 아주 짧은 잔향(손 안에서 나는 소리처럼)
      const comp = ctx.createDynamicsCompressor(); comp.threshold.value = -18; comp.ratio.value = 4; comp.attack.value = .003; comp.release.value = .12;
      master = ctx.createGain(); master.gain.value = .9; master.connect(comp).connect(ctx.destination);
      const d = ctx.createDelay(); d.delayTime.value = .045; const fb = ctx.createGain(); fb.gain.value = .22; const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = 2600;
      wet = ctx.createGain(); wet.gain.value = .18; wet.connect(d); d.connect(lp).connect(fb).connect(d); lp.connect(master);
    }
    if (ctx.state === 'suspended') ctx.resume();
    return ctx;
  };
  const out = (node) => { node.connect(master); node.connect(wet); };
  let NB = null;
  const noise = (c) => { if (!NB) { NB = c.createBuffer(1, c.sampleRate * 1.5, c.sampleRate); const d = NB.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1; } return NB; };
  const rnd = (a, b) => a + Math.random() * (b - a);
  // 소리 엔진은 처음 만들 때 한 번 느리다(폰에선 수백 ms). 화면을 처음 누르는 순간 미리 깨워 둬서, 오행 고르기 같은 첫 반응이 늦지 않게
  addEventListener('pointerdown', () => { if (!F.enabled) return; const c = ac(); if (c) noise(c); }, { once: true, capture: true, passive: true });

  // 방울 하나: 반지름이 작을수록 높고 짧다. 터질 때 음이 살짝 올라간다(실제 방울 소리 모델)
  function bubble(c, t, f, dur, vol) {
    const o = c.createOscillator(), g = c.createGain();
    o.type = 'sine'; o.frequency.setValueAtTime(f, t); o.frequency.exponentialRampToValueAtTime(f * rnd(1.6, 2.4), t + dur);
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + .002); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g); out(g); o.start(t); o.stop(t + dur + .02);
  }
  // 걸러진 노이즈 한 덩어리
  function hiss(c, t, dur, { type = 'bandpass', f0 = 800, f1 = 400, q = 1, vol = .2, attack = .005 } = {}) {
    const n = c.createBufferSource(), f = c.createBiquadFilter(), g = c.createGain();
    n.buffer = noise(c); f.type = type; f.Q.value = q; f.frequency.setValueAtTime(f0, t); f.frequency.exponentialRampToValueAtTime(Math.max(40, f1), t + dur);
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + attack); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    n.connect(f).connect(g); out(g); n.start(t, Math.random()); n.stop(t + dur + .02);
  }
  // 낮은 쿵/출렁 (몸이 흔들리는 저음)
  function thump(c, t, f0, f1, dur, vol, wob = 0) {
    const o = c.createOscillator(), g = c.createGain();
    o.type = 'sine'; o.frequency.setValueAtTime(f0, t); o.frequency.exponentialRampToValueAtTime(f1, t + dur);
    if (wob) { const l = c.createOscillator(), lg = c.createGain(); l.frequency.value = wob; lg.gain.value = f1 * .18; l.connect(lg).connect(o.frequency); l.start(t); l.stop(t + dur + .02); }
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(vol, t + .006); g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g); out(g); o.start(t); o.stop(t + dur + .02);
  }
  // 찌걱: 방울 n개를 짧은 시간에 흩뿌림
  function squelch(c, t, p, n, span, lo, hi, vol) { for (let i = 0; i < n; i++) bubble(c, t + Math.pow(Math.random(), 1.4) * span, rnd(lo, hi) * p, rnd(.018, .05), vol * rnd(.4, 1)); }

  // v4 (2026-11-06): "실리콘·말랑한 장난감을 천천히 쥐었다 폈을 때의 부드럽고 묵직한 마찰음"
  //   실리콘끼리 비벼질 때 나는 소리 = 표면이 붙었다 미끄러졌다 하는(stick-slip) 아주 짧은 마찰 알갱이가 불규칙하게 수십 개
  //   → 알갱이 하나 = 10~20ms 노이즈를 낮은 대역(200~600Hz)으로 거르고 빠르게 줄임. 쥐는 속도만큼 촘촘하고, 깊을수록 낮다.
  //   + 그 밑에 먹먹한 저음 노이즈(손 안에서 눌리는 몸통 소리). 사인파 "쿵·삐융"은 쓰지 않는다.
  function grain(c, t, f, v, q = 3.5) {
    const n = c.createBufferSource(), b = c.createBiquadFilter(), lp = c.createBiquadFilter(), g = c.createGain();
    n.buffer = noise(c); b.type = 'bandpass'; b.frequency.value = f; b.Q.value = q; lp.type = 'lowpass'; lp.frequency.value = 1100;
    const d = rnd(.008, .022);
    g.gain.setValueAtTime(0.0001, t); g.gain.exponentialRampToValueAtTime(v, t + .0015); g.gain.exponentialRampToValueAtTime(0.0001, t + d);
    n.connect(b).connect(lp).connect(g); out(g); n.start(t, Math.random() * 1.2); n.stop(t + d + .01);
  }
  // 일정 시간 동안 마찰 알갱이를 흩뿌린다 (r=초당 개수, f=중심 주파수, v=세기 — 시작→끝으로 변함)
  function rub(c, t, dur, { r0, r1, f0, f1, v0, v1, q }) {
    let tt = t;
    while (tt < t + dur) {
      const k = (tt - t) / dur, rate = r0 + (r1 - r0) * k;
      grain(c, tt, (f0 + (f1 - f0) * k) * rnd(.75, 1.3), Math.max(.0002, (v0 + (v1 - v0) * k) * rnd(.45, 1)), q);
      tt += rnd(.35, 1.65) / Math.max(4, rate);
    }
  }
  // 몸통: 손 안에서 눌리는 먹먹한 저음 숨소리
  const body = (c, t, dur, f0, f1, vol, attack = .06) => hiss(c, t, dur, { type: 'lowpass', f0, f1, q: .9, vol, attack });

  const S = {
    // 천천히 쥐기: 처음엔 촘촘히 뽀드득, 점점 느슨하게 — 깊을수록 낮아짐
    press(c, t, p) { rub(c, t, .42, { r0: 85, r1: 26, f0: 430 * p, f1: 250 * p, v0: .26, v1: .08 }); body(c, t, .45, 420 * p, 190, .09, .07); },
    // 아주 깊이 눌림: 한 번 더 꽉 쥐는 묵직한 마찰
    deep(c, t, p) { rub(c, t, .34, { r0: 110, r1: 50, f0: 280 * p, f1: 200 * p, v0: .22, v1: .1, q: 4.5 }); body(c, t, .36, 300, 150, .08, .05); },
    // 펴기: 실리콘이 천천히 되돌아오며 미끄러지는 소리 — 점점 높고 가늘게 사라짐
    release(c, t, p) { rub(c, t, .3, { r0: 55, r1: 12, f0: 300 * p, f1: 470 * p, v0: .16, v1: .03 }); body(c, t, .3, 240, 420 * p, .045, .03); },
    rebound(c, t, p, amt = .5) { rub(c, t, .34 + amt * .3, { r0: 70 + amt * 40, r1: 10, f0: 260 * p, f1: 500 * p, v0: .14 + amt * .1, v1: .02 }); body(c, t, .4 + amt * .2, 220, 460 * p, .05 + amt * .04, .03); },
    // 짧게 톡: 살짝 쥐었다 바로 폄
    tap(c, t, p) { rub(c, t, .13, { r0: 95, r1: 50, f0: 380 * p, f1: 300 * p, v0: .2, v1: .1 }); rub(c, t + .12, .16, { r0: 45, r1: 10, f0: 320 * p, f1: 460 * p, v0: .1, v1: .02 }); body(c, t, .22, 360, 220, .05, .02); },
    // 들어 올림: 늘어나며 촘촘해지는 마찰 → 바닥에서 떨어지는 먹먹한 "뽁"
    lift(c, t, p) { rub(c, t, .36, { r0: 35, r1: 120, f0: 300 * p, f1: 620 * p, v0: .07, v1: .17 }); body(c, t + .32, .14, 650, 160, .14, .004); },
    swing(c, t, p) { body(c, t, .34, 420, 600, .022, .12); },
    // 내려놓음: 묵직하게 "푹" + 짧은 마찰
    land(c, t, p) { body(c, t, .2, 520, 120, .32, .003); rub(c, t + .01, .26, { r0: 90, r1: 18, f0: 300 * p, f1: 220 * p, v0: .2, v1: .03 }); },
    // 옆으로 늘이기: 비틀며 미끄러지는 마찰
    stretch(c, t, p) { rub(c, t, .26, { r0: 60, r1: 85, f0: 480 * p, f1: 700 * p, v0: .08, v1: .12, q: 5 }); },
    // 아래는 지금 화면에서 안 쓴다(남겨 둠)
    plop(c, t, p) { bubble(c, t, 340 * p, .08, .5); },
    chime(c, t, p) { [1, 1.5, 2].forEach((m, i) => { const o = c.createOscillator(), g = c.createGain(); o.type = 'sine'; o.frequency.value = 880 * p * m; g.gain.setValueAtTime(0.0001, t + i * .05); g.gain.exponentialRampToValueAtTime(.08, t + i * .05 + .005); g.gain.exponentialRampToValueAtTime(0.0001, t + i * .05 + .5); o.connect(g); out(g); o.start(t + i * .05); o.stop(t + i * .05 + .55); }); },
    crunch(c, t, p) { for (let i = 0; i < 9; i++) { const tt = t + i * rnd(.012, .03); hiss(c, tt, .03, { f0: rnd(2200, 4800) * p, f1: 1800, q: 1.4, vol: .3 * (1 - i / 12), attack: .001 }); } },
    tick(c, t, p) { grain(c, t, 900 * p, .12, 6); },
  };
  S.squish = S.press; S.boing = (c, t, p) => S.rebound(c, t, p, .4); S.pop = S.tap;

  F.play = (name, opt = {}) => {
    if (!F.enabled) return; const c = ac(); if (!c || !S[name]) return;
    S[name](c, c.currentTime + .002, opt.pitch || 1, opt.amt);
  };

  // 누르고 있는 동안: 쥐는 속도(깊이가 바뀌는 빠르기)만큼 마찰 알갱이가 촘촘해지고, 깊을수록 낮고 묵직하다.
  // 가만히 꾹 쥐고만 있으면 아주 가끔 미세하게 뽀득 — 실제로 쥐고 있을 때처럼
  F.hold = (opt = {}) => {
    const c = F.enabled ? ac() : null; const p = opt.pitch || 1;
    if (!c) return { set() {}, stop() {} };
    let depth = 0, vel = 0, lastD = 0, lastT = performance.now(), alive = true;
    const n = c.createBufferSource(), f = c.createBiquadFilter(), g = c.createGain();
    n.buffer = noise(c); n.loop = true; f.type = 'lowpass'; f.Q.value = .9; f.frequency.value = 320 * p; g.gain.value = 0.0001;
    n.connect(f).connect(g); out(g); n.start();
    const TICK = .03;
    const tick = () => {
      if (!alive) return; const t = c.currentTime;
      vel *= .85;                                                     // 쥐는 속도는 서서히 잦아든다
      const rate = 6 + depth * 14 + Math.min(220, vel * 260);
      f.frequency.setTargetAtTime((330 - depth * 150) * p, t, .08);
      g.gain.setTargetAtTime(.008 + depth * .05 + Math.min(.05, vel * .06), t, .06);
      let tt = t; while (tt < t + TICK) { tt += rnd(.35, 1.65) / rate; if (tt < t + TICK) grain(c, tt + .02, rnd(200, 460) * (1 - depth * .3) * p, (.05 + depth * .08 + Math.min(.12, vel * .15)) * rnd(.4, 1)); }
      setTimeout(tick, TICK * 1000);
    };
    tick();
    return {
      set(d) { const now = performance.now(), dt = Math.max(.016, (now - lastT) / 1000); d = Math.max(0, Math.min(1, d)); vel = Math.max(vel, Math.abs(d - lastD) / dt); lastD = d; lastT = now; depth = d; },
      stop() { if (!alive) return; alive = false; const t = c.currentTime; g.gain.setTargetAtTime(0.0001, t, .04); n.stop(t + .25); },
    };
  };
  F.buzz = (pattern) => { if (F.haptics && navigator.vibrate) try { navigator.vibrate(pattern); } catch (e) {} };
  window.OhwaFeel = F;
})();
