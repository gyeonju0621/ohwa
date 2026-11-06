// 오화 — Toy-studio UI primitives
// Icon · Studio · StatusBar · Dock · Chip · Pedestal · Figure · PartsBody · EL meta
const feel = (s, o) => window.OhwaFeel && OhwaFeel.play(s, o);
const buzz = (p) => window.OhwaFeel && OhwaFeel.buzz(p);
const A = '../assets/';

const EL = {
  wood:  { ko: '목', hj: '木', part: '잎',   img: A + 'malangi/wood.png',  piece: A + 'parts-gummy2/wood.png',  pitch: 1.1, rgb: [99, 217, 87] },
  fire:  { ko: '화', hj: '火', part: '불꽃', img: A + 'malangi/fire.png',  piece: A + 'parts-gummy2/fire.png',  pitch: 1.22, rgb: [255, 98, 107] },
  earth: { ko: '토', hj: '土', part: '흙',   img: A + 'malangi/earth.png', piece: A + 'parts-gummy2/earth.png', pitch: .8, rgb: [255, 194, 71] },
  metal: { ko: '금', hj: '金', part: '빛',   img: A + 'malangi/metal.png', piece: A + 'parts-gummy2/metal.png', pitch: 1.4, rgb: [181, 160, 244] },
  water: { ko: '수', hj: '水', part: '물방울', img: A + 'malangi/water.png', piece: A + 'parts-gummy2/water.png', pitch: 1, rgb: [66, 188, 235] },
};
const EL_ORDER = ['wood', 'fire', 'earth', 'metal', 'water'];
const BODY = A + 'malangi/body.png';
const OUTFITS = { spring: { ko: '봄 조끼', img: A + 'malangi/spring.png' }, summer: { ko: '장마 망토', img: A + 'malangi/summer.png' }, winter: { ko: '겨울 목도리', img: A + 'malangi/winter.png' } };

/* 브랜드 로고 — 기하 워드마크 OHWA(원·H·역사다리꼴 W·삼각 A) + 붉은 타원 낙관 五和.
   글자는 currentColor(스튜디오=검정, 나이트=흰색), 낙관은 항상 --seal.
   mark="seal"이면 낙관만. height 기준으로 비율 유지. */
function OhwaLogo({ height = 28, mark = 'full', color = 'currentColor', seal = 'var(--seal)', style, title = 'OHWA 五和' }) {
  const sealOnly = mark === 'seal';
  const vb = sealOnly ? '736 0 144 232' : '0 0 878 232';
  const w = height * (sealOnly ? 144 : 878) / 232;
  const hz = { fontFamily: 'var(--font-seal)', fontWeight: 500, fontSize: 86 };
  return <svg viewBox={vb} width={w} height={height} role="img" aria-label={title} style={{ display: 'block', flex: 'none', overflow: 'visible', ...style }}>
    {!sealOnly && <g fill={color}>
      <path d="M2 122C2 74 34 42 82 42S162 74 162 122 130 202 82 202 2 170 2 122Z" />
      <path d="M203 44h55v69h19V44h56v155h-56v-75h-19v75h-55Z" />
      <path d="M370 44h189l-53 162-42-65-41 65Z" />
      <path d="M558 199 639 38l82 161Z" />
    </g>}
    <g fill={seal}>
      <ellipse cx="808" cy="116" rx="66" ry="113" fill="none" stroke={seal} strokeWidth={Math.max(1.8, 232 / height)} />{/* 화면에서 최소 1px */}
      <text x="808" y="72" textAnchor="middle" dominantBaseline="central" style={hz}>五</text>
      <text x="808" y="163" textAnchor="middle" dominantBaseline="central" style={hz}>和</text>
    </g>
  </svg>;
}

/* ---------- 낮 / 밤 테마 ----------
   'studio' = 아이보리 낮, 'night' = 코코아 밤. localStorage 'ohwa5-theme'에 저장(앱·웹사이트 같이 씀).
   색은 colors_and_type.css의 변수로만 바뀌므로, 화면 코드는 테마를 몰라도 된다. */
const THEME_KEY = 'ohwa5-theme';
const getTheme = () => { try { return localStorage.getItem(THEME_KEY) || 'studio'; } catch (_) { return 'studio'; } };
function applyTheme(t) {
  document.documentElement.dataset.theme = t;
  document.documentElement.style.colorScheme = t === 'night' ? 'dark' : 'light';
  try { localStorage.setItem(THEME_KEY, t); } catch (_) {}
  window.dispatchEvent(new Event('ohwa-theme'));
}
applyTheme(new URLSearchParams(location.search).get('theme') || getTheme());   // 개발용 ?theme=night
function useTheme() {
  const [t, set] = React.useState(getTheme);
  React.useEffect(() => { const f = () => set(getTheme()); window.addEventListener('ohwa-theme', f); return () => window.removeEventListener('ohwa-theme', f); }, []);
  return [t, () => { applyTheme(t === 'night' ? 'studio' : 'night'); feel('tick'); buzz(6); }];
}
/* 동그란 낮/밤 버튼 */
function ThemeButton({ className = 'roundbtn press', style }) {
  const [t, toggle] = useTheme();
  return <button className={className} aria-label={t === 'night' ? '낮 모드로' : '밤 모드로'} onClick={toggle} style={style}>
    <span key={t} style={{ display: 'flex', animation: 'ohwa-posepop 420ms var(--ease-jelly) both' }}><Icon name={t === 'night' ? 'Sun' : 'Moon'} size={19} /></span>
  </button>;
}

function Icon({ name, size = 22, color = 'currentColor', stroke = 2 }) {
  const lib = window.lucide && window.lucide.icons; const node = lib && lib[name];
  if (!node) return <span style={{ width: size, height: size, display: 'inline-block' }} />;
  const kids = typeof node[0] === 'string' ? node[2] : node;
  return <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round" style={{ flex: 'none', display: 'block' }}>
    {kids.map(([t, a], i) => React.createElement(t, { key: i, ...a }))}</svg>;
}

/* 스튜디오 배경: 웜 스윕 + 스포트라이트 + 기운 색 틴트 */
function Studio({ el, y = '44%' }) {
  return <div className="studio"><div className="tint" style={{ top: y, background: el ? `var(--${el})` : 'transparent' }} /></div>;
}

function StatusBar() {
  return <div style={{ height: 50, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '4px 30px 0 34px', fontWeight: 700, fontSize: 15, color: 'var(--fg1)' }}>
    <span className="num" style={{ fontSize: 14 }}>9:41</span>
    <span style={{ display: 'flex', gap: 6, alignItems: 'center' }}><Icon name="Signal" size={16} stroke={2.4} /><Icon name="Wifi" size={16} stroke={2.4} /><Icon name="BatteryFull" size={20} stroke={2} /></span>
  </div>;
}

/* 하단 도크 — 짙은 알약 위에 동그란 버튼, 활성은 흰 알약 (v8) */
function Dock({ tab, onTab }) {
  const items = [['today', 'Sun', '오늘'], ['saju', 'Orbit', '내 사주'], ['records', 'CalendarDays', '기록']];
  return <div style={{ position: 'absolute', left: '50%', bottom: 22, transform: 'translateX(-50%)', zIndex: 30, borderRadius: 999, padding: 6, display: 'flex', gap: 4, background: 'var(--dock-bg)', boxShadow: '0 18px 30px -16px rgba(40,25,15,.55)' }}>
    {items.map(([k, ic, lb]) => {
      const on = tab === k;
      return <button key={k} className="press" aria-label={lb} onClick={() => { if (!on) { feel('pop', { pitch: 1.1 }); buzz(8); onTab(k); } }}
        style={{ border: 0, height: 50, borderRadius: 999, padding: on ? '0 18px 0 14px' : 0, width: on ? 'auto' : 50, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7, cursor: 'pointer',
          background: on ? 'var(--dock-on)' : 'transparent', color: on ? 'var(--dock-on-ink)' : 'rgba(255,246,234,.62)', fontFamily: 'var(--font-sans)', fontWeight: 800, fontSize: 14,
          transition: 'all 450ms var(--ease-jelly)' }}>
        <Icon name={ic} size={21} />{on && <span style={{ whiteSpace: 'nowrap' }}>{lb}</span>}
      </button>;
    })}
  </div>;
}

/* 유리 칩 — 정보 라벨 (Venraft식 떠 있는 태그) */
function Chip({ children, el, style, onClick, strong }) {
  return <div className={`glass ${onClick ? 'press' : ''}`} onClick={onClick}
    style={{ display: 'inline-flex', alignItems: 'center', gap: 6, height: 34, padding: '0 13px', borderRadius: 999, fontSize: 13, fontWeight: 700, color: 'var(--fg1)',
      background: strong ? 'var(--glass-strong)' : undefined, boxShadow: 'var(--shadow-chip)', whiteSpace: 'nowrap', ...style }}>
    {el && <i style={{ width: 8, height: 8, borderRadius: 9, background: `var(--${el})`, flex: 'none' }} />}{children}
  </div>;
}

/* 받침대 — 피규어를 올려두는 턴테이블 */
function Pedestal({ w = 240, el }) {
  const h = w * .2;
  return <div style={{ position: 'absolute', left: '50%', bottom: -h * .55, width: w, height: h * 1.35, transform: 'translateX(-50%)', zIndex: 0 }}>
    <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: h, borderRadius: '50%', background: 'linear-gradient(180deg, var(--floor), color-mix(in oklab, var(--floor) 80%, #000 8%))' }} />
    <div style={{ position: 'absolute', left: 0, right: 0, top: 0, height: h, borderRadius: '50%', background: 'radial-gradient(70% 70% at 50% 40%, var(--bg-hi), var(--bg))',
      boxShadow: `inset 0 0 0 1.5px rgba(255,255,255,.7), inset 0 -6px 14px rgba(0,0,0,.05)` }} />
    {el && <div style={{ position: 'absolute', left: '14%', right: '14%', top: h * .18, height: h * .64, borderRadius: '50%', border: `2px solid var(--${el})`, opacity: .45 }} />}
  </div>;
}

/* 피규어 — 누르면 꾹, 끌면 늘어남, 놓으면 출렁. 이미지 그대로, 변형만 */
function Figure({ src, h = 300, el = 'water', onSquish, onRelease, pedestal = true, idle = true, children, ped }) {
  const ref = React.useRef(null); const st = React.useRef({ down: false, y0: 0, x0: 0 });
  const set = (t, ms, ease) => { const n = ref.current; if (!n) return; n.style.transition = ms ? `transform ${ms}ms ${ease}` : 'none'; n.style.transform = t; };
  const pitch = (EL[el] || EL.water).pitch;
  const down = (e) => {
    e.preventDefault(); st.current = { down: true, y0: e.clientY, x0: e.clientX };
    try { e.currentTarget.setPointerCapture(e.pointerId); } catch (_) {}
    set('scale(1.1, .84)', 90, 'var(--ease-squish)'); feel('squish', { pitch }); buzz(14); onSquish && onSquish();
  };
  const move = (e) => {
    if (!st.current.down) return;
    const dy = Math.max(-90, Math.min(40, e.clientY - st.current.y0)), dx = Math.max(-50, Math.min(50, e.clientX - st.current.x0));
    if (dy < -6) { const k = -dy / 90; set(`translate(${dx * .25}px, ${dy * .2}px) scale(${1 - k * .14}, ${1 + k * .22}) skewX(${-dx * .12}deg)`, 0); }
  };
  const up = () => {
    if (!st.current.down) return; st.current.down = false;
    set('scale(1,1)', 700, 'var(--ease-jelly)'); feel('boing', { pitch }); buzz(6); onRelease && onRelease();
  };
  return <div style={{ position: 'relative', height: h, width: h * .72, margin: '0 auto' }}>
    {pedestal && <Pedestal w={ped || h * .95} el={el} />}
    <div style={{ position: 'absolute', left: '50%', bottom: h * .02, width: h * .55, height: h * .06, transform: 'translateX(-50%)', borderRadius: '50%', background: 'rgba(40,30,25,.22)', filter: 'blur(8px)', zIndex: 1 }} />
    <div style={{ position: 'absolute', inset: 0, zIndex: 2, animation: idle ? 'ohwa-idle 3.6s ease-in-out infinite' : 'none', transformOrigin: '50% 100%' }}>
      <div ref={ref} onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up}
        style={{ position: 'absolute', inset: 0, transformOrigin: '50% 96%', cursor: 'grab', touchAction: 'none' }}>
        <img src={src} alt="" draggable={false} style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: '100%', width: '100%', objectFit: 'contain', objectPosition: 'bottom', pointerEvents: 'none', userSelect: 'none' }} />
        {children}
      </div>
    </div>
  </div>;
}

/* 커스텀용: 흰 몸체 + 배 안에 조각(최대 3개) */
const SLOT_POS = [[50, 70, 26], [36, 64, 22], [64, 64, 22]];
function PartsInBody({ parts }) {
  return <>{parts.map((p, i) => {
    const [x, y, w] = SLOT_POS[i];
    return <img key={i + p} src={EL[p].piece} alt="" style={{ position: 'absolute', left: `${x}%`, top: `${y}%`, width: `${w}%`, transform: 'translate(-50%,-50%)', opacity: .88,
      filter: 'saturate(1.05) drop-shadow(0 2px 3px rgba(0,0,0,.08))', animation: 'ohwa-pop 520ms var(--ease-jelly) both', pointerEvents: 'none' }} />;
  })}</>;
}

/* ============================================================
   하얀 말랑이 (오화의 주인공)
   - 누르는 시간만큼 꾸우욱 깊게 눌리고, 놓으면 스프링처럼 출렁(누른 깊이만큼 크게)
   - 짧게 톡: 얕게 눌렸다 바로 통통. 꾹 누르고 있으면 조각이 계속 생긴다(onHold)
   - 위로 끌면 쭉 늘어남, 옆으로 끌면 기울어짐
   - parts: 배 속 조각(오행 키 배열). 많을수록 배가 빵빵해지고, 2개부터 그 기운 색으로 물든다
   ============================================================ */
const BODY_RATIO = 366 / 560;          // body.png 가로/세로
const HEAD_END = .565;                 // 이 아래가 몸통(배). 위는 머리
const BELLY = { cx: .5, cy: .765, rx: .185, ry: .1 };
const SLICES = 32, FULL = 30;
const bellyBump = (y) => { const t = (y - HEAD_END) / (.985 - HEAD_END); return t <= 0 || t >= 1 ? 0 : Math.pow(Math.sin(Math.PI * Math.pow(t, .85)), .9); };

/* 조각 색을 섞어 몸 색 정하기: 2개부터 슬슬, 30개면 꽤 진하게 */
function bodyTint(parts) {
  // 2026-11-06: 몸이 빨개지는 게 별로라는 피드백 → 몸은 늘 하얗게. 색은 배 속 조각으로만.
  const n = parts.length; if (n < 2 || !bodyTint.on) return { color: 'transparent', a: 0 };
  const c = [0, 0, 0]; parts.forEach(p => { const r = EL[p].rgb; c[0] += r[0]; c[1] += r[1]; c[2] += r[2]; });
  return { color: `rgb(${c.map(v => Math.round(v / n)).join(',')})`, a: Math.pow(Math.min(1, (n - 1) / (FULL - 1)), .8) * .4 + .05 };
}

/* 스프링 젤리 — 누름 깊이 q(+ 눌림, − 늘어남)를 물리로 굴린다 */
function useJelly({ pitch = 1, onPress, onHold, onRelease, holdEvery = 340, disabled, hang }) {
  const ref = React.useRef(null);
  const s = React.useRef({ q: 0, v: 0, sk: 0, sv: 0, held: false, t0: 0, dx: 0, dy: 0, x0: 0, y0: 0, raf: 0, last: 0, nextHold: 0, deep: false, peak: 0 });
  const cb = React.useRef({}); cb.current = { onPress, onHold, onRelease, disabled, pitch, hang };
  const paint = () => {
    const o = s.current, n = ref.current; if (!n) return;
    const q = o.q, sx = 1 + .3 * q, sy = 1 - .27 * q;
    n.style.transform = `translateX(${o.held ? o.dx * .18 : 0}px) skewX(${o.sk}deg) scale(${sx}, ${sy})`;
  };
  const loop = (now) => {
    const o = s.current; const dt = Math.min(.032, (now - (o.last || now)) / 1000 || .016); o.last = now;
    let target = 0, k = 240, c = 7.5;                 // 놓은 뒤: 덜 감쇠 → 출렁출렁
    if (o.held) {
      const held = (now - o.t0) / 1000;
      target = .13 + .6 * (1 - Math.exp(-held * 1.6)); // 오래 누를수록 깊게 (최대 ≈ .73)
      if (o.dy < -8) target = -Math.min(1, -o.dy / 110) * .75;   // 위로 끌면 늘어남
      k = 520; c = 30;
      if (cb.current.hang) { target = -.2; k = 220; c = 9; }      // 대롱대롱: 매달려서 아래로 늘어남
      if (target > .55 && !o.deep && !cb.current.hang) { o.deep = true; feel('deep', { pitch: cb.current.pitch }); buzz(18); }
      if (o.snd) o.snd.set(cb.current.hang ? 0 : Math.max(0, o.q) / .73);   // 눌린 깊이만큼 뽀글뽀글
      o.peak = Math.max(o.peak, Math.abs(target));
    }
    o.v += (k * (target - o.q) - c * o.v) * dt; o.q += o.v * dt;
    const skT = o.held ? Math.max(-14, Math.min(14, -o.dx * .14)) : 0;
    o.sv += (200 * (skT - o.sk) - 9 * o.sv) * dt; o.sk += o.sv * dt;
    paint();
    if (o.held || Math.abs(o.q) > .0008 || Math.abs(o.v) > .002 || Math.abs(o.sk) > .02) o.raf = requestAnimationFrame(loop);
    else { o.q = o.v = o.sk = o.sv = 0; o.raf = 0; o.last = 0; paint(); }
  };
  const kick = () => { const o = s.current; if (!o.raf) { o.last = 0; o.raf = requestAnimationFrame(loop); } };
  const handlers = {
    onPointerDown: (e) => {
      if (cb.current.disabled) return;
      e.preventDefault(); const o = s.current;
      try { e.currentTarget.setPointerCapture(e.pointerId); } catch (_) {}
      Object.assign(o, { held: true, t0: performance.now(), x0: e.clientX, y0: e.clientY, dx: 0, dy: 0, deep: false, peak: 0 });
      o.v -= 2.2;                                      // 톡 — 첫 순간 살짝 튕겨 들어감
      // 꾹 누르고 있으면 0.48초 뒤부터 조각이 계속 (위로 끌어 늘리는 중엔 멈춤)
      clearTimeout(o.ht); clearInterval(o.hi);
      o.ht = setTimeout(() => { o.hi = setInterval(() => { if (o.held && o.dy > -8 && cb.current.onHold) { cb.current.onHold(); buzz(8); } }, holdEvery); }, 480);
      feel('press', { pitch: cb.current.pitch }); buzz(14); cb.current.onPress && cb.current.onPress();
      // 0.16초 넘게 누르고 있으면 "꾸우욱" 소리가 이어진다
      clearTimeout(o.st); if (o.snd) o.snd.stop(); o.snd = null;
      o.st = setTimeout(() => { if (o.held && window.OhwaFeel && OhwaFeel.hold) o.snd = OhwaFeel.hold({ pitch: cb.current.pitch }); }, 160);
      kick();
    },
    onPointerMove: (e) => { const o = s.current; if (!o.held) return; o.dx = Math.max(-60, Math.min(60, e.clientX - o.x0)); o.dy = Math.max(-110, Math.min(40, e.clientY - o.y0)); },
    onPointerUp: () => {
      const o = s.current; if (!o.held) return; o.held = false; clearTimeout(o.ht); clearInterval(o.hi); clearTimeout(o.st);
      if (o.snd) { o.snd.stop(); o.snd = null; }
      o.v -= 1.5 + o.peak * 4;                          // 깊게 눌렀을수록 크게 튀어 오름
      // 소리: 짧게 톡 = 가벼운 "퐁" / 오래 꾹 = 깊이만큼 출렁 "뽀옹" / 매달렸다 놓으면 Malangi가 "철퍽"을 낸다
      if (!cb.current.hang) { if (performance.now() - o.t0 < 220) feel('release', { pitch: cb.current.pitch }); else feel('rebound', { pitch: cb.current.pitch, amt: o.peak }); }
      buzz(o.peak > .5 ? [8, 30, 8] : 6);
      cb.current.onRelease && cb.current.onRelease(o.peak); kick();
    },
  };
  handlers.onPointerCancel = handlers.onPointerUp;
  React.useEffect(() => () => { cancelAnimationFrame(s.current.raf); clearTimeout(s.current.ht); clearInterval(s.current.hi); clearTimeout(s.current.st); if (s.current.snd) s.current.snd.stop(); }, []);
  return [ref, handlers];
}

/* ---------- 자세(포즈) ----------
   stand = body.png (서 있기, 배가 빵빵해지는 띠 변형은 이 자세에서만)
   나머지 = 사용자 사진에서 오린 자세. 같은 사진·같은 배율이라 crop 높이 / 618(서 있는 몸 높이)로 크기를 맞춘다. */
const POSE_H0 = 618;
// 오린 자세 사진은 발밑에 바닥 그림자 자국이 조금 남아 있어 아래 끝을 살짝 흐리게
// 2026-11-06: 발밑 바닥을 사진에서 직접 지웠으니(_build/fix-feet.html) 아래 흐림은 쓰지 않는다 — 흐림 때문에 발이 번져 보였음
const POSE_FADE = {};
const POSES = {
  stand: { src: BODY, w: 366, h: 560, k: 1, belly: BELLY },
  wave:  { src: A + 'malangi/poses/wave.png',  w: 439, h: 638, k: 638 / POSE_H0, belly: { cx: .53, cy: .735, rx: .16, ry: .085 } },
  cheer: { src: A + 'malangi/poses/cheer.png', w: 443, h: 638, k: 638 / POSE_H0, belly: { cx: .5, cy: .74, rx: .16, ry: .085 } },
  sit:   { src: A + 'malangi/poses/sit.png',   w: 397, h: 571, k: 571 / POSE_H0, belly: { cx: .5, cy: .7, rx: .15, ry: .075 } },
  kick:  { src: A + 'malangi/poses/kick.png',  w: 461, h: 652, k: 652 / POSE_H0, belly: { cx: .47, cy: .66, rx: .14, ry: .075 } },
};
Object.values(POSES).forEach(p => { const i = new Image(); i.src = p.src; });   // 미리 불러 깜빡임 방지

/* 배 속에 "보이는" 조각은 최대 5개(최근 것). 채운 개수(30까지)는 배 크기·숫자로만 보인다.
   자리: 가운데 하나 + 둘레 넷 — 개수가 적을 땐 가운데부터 */
const VISIBLE = 5;
const SLOT5 = [[0, 0], [-.62, -.35], [.62, -.3], [-.5, .55], [.55, .6]];
function bellySlot(i, fill, B = BELLY, bulgeOn = true) {
  const [dx, dy] = SLOT5[i % VISIBLE];
  const bulge = bulgeOn ? 1 + .2 * fill : 1;
  const x = B.cx + dx * B.rx * bulge, y = B.cy + dy * B.ry * (1 + (bulgeOn ? .1 : 0) * fill);
  const rot = ((i * 47) % 50) - 25;
  return { x, y, rot };
}

/* ---------- 얼굴 v2 (2026-11-06) — 모든 자세에 같은 얼굴 ----------
   사용자가 준 얼굴 사진: 크고 반짝이는 까만 눈 + 작게 웃는 입(‿). 눈 사이 = 머리 폭의 44%, 눈 지름 = 머리 폭의 7.2%.
   자세 사진마다 원래 눈·입 위치를 재서(_build/measure-poses.html) 그 자리를 살색으로 덮고, 같은 비율로 새 얼굴을 그린다.
   좌표는 각 이미지 픽셀. L·R = 원래 눈 중심, M = 원래 입, ew = 원래 눈 크기, hw = 눈 높이의 머리 폭, skin = 눈 주변 살색 */
const FACES = {
  stand: { L: [131.2, 218.8], R: [238.1, 219.1], M: [186, 230.4], ew: 20, mw: 18, mh: 7, hw: 347, sL: '234,225,207', sR: '241,234,221' },
  wave:  { L: [168.4, 219.7], R: [312.7, 219.9], M: [241.1, 236.0], ew: 22, mw: 18, mh: 9, hw: 372, sL: '232,216,189', sR: '237,226,208' },
  cheer: { L: [150.6, 203.7], R: [293.3, 203.6], M: [222.9, 219.3], ew: 22, mw: 18, mh: 9, hw: 366, sL: '232,215,188', sR: '236,224,208' },
  sit:   { L: [128.0, 231.9], R: [272.1, 230.3], M: [200.6, 249.0], ew: 22, mw: 18, mh: 7, hw: 374, sL: '233,216,190', sR: '239,226,209' },
  kick:  { L: [148.2, 251.8], R: [275.5, 193.3], M: [219.6, 236.2], ew: 22, mw: 17, mh: 11, hw: 358, sL: '235,219,195', sR: '239,229,215' },
};
const mixRGB = (a, b) => a.split(',').map((v, i) => Math.round((+v + +b.split(',')[i]) / 2)).join(',');
function Face({ pose = 'stand', gaze = [0, 0], blink = false, closed = false }) {
  const f = FACES[pose] || FACES.stand, P = POSES[pose] || POSES.stand, ink = '#1F1A18';
  const [lx, ly] = f.L, [rx, ry] = f.R, d = Math.hypot(rx - lx, ry - ly), u = [(rx - lx) / d, (ry - ly) / d], nv = [-u[1], u[0]];   // 눈 줄 방향 · 아래 방향
  const c = [(lx + rx) / 2, (ly + ry) / 2], hw = f.hw, ang = Math.atan2(u[1], u[0]) * 180 / Math.PI;
  // 사용자 얼굴 사진에서 잰 비율 (머리 폭 hw 기준): 눈 사이 44.5%, 눈 지름 7%, 입 폭 6.5%·두께 1.9%, 입은 눈 중심보다 4.2% 아래, 거의 평평한 콩 모양
  const half = hw * .2225, r = hw * .035, drop = hw * .012;
  const at = (s, k) => [c[0] + u[0] * s + nv[0] * k + gaze[0], c[1] + u[1] * s + nv[1] * k + gaze[1]];
  const eyes = [at(-half, drop), at(half, drop)];
  const mk = drop + hw * .042, sw = hw * .052, sag = hw * .011;
  const mc = [c[0] + nv[0] * mk, c[1] + nv[1] * mk];
  const m0 = [mc[0] - u[0] * sw / 2, mc[1] - u[1] * sw / 2], m1 = [mc[0] + u[0] * sw / 2, mc[1] + u[1] * sw / 2], mq = [mc[0] + nv[0] * sag, mc[1] + nv[1] * sag];
  const id = 'fc-' + pose;
  return <svg viewBox={`0 0 ${P.w} ${P.h}`} preserveAspectRatio="none" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', overflow: 'visible' }}>
    <defs>
      {[['L', f.sL], ['R', f.sR], ['M', mixRGB(f.sL, f.sR)]].map(([k, s]) => <radialGradient key={k} id={id + k}><stop offset="55%" stopColor={`rgb(${s})`} /><stop offset="100%" stopColor={`rgba(${s},0)`} /></radialGradient>)}
    </defs>
    {/* 원래 눈·입 덮기 */}
    <ellipse cx={lx} cy={ly} rx={f.ew * 1.05} ry={f.ew * 1.08} fill={`url(#${id}L)`} />
    <ellipse cx={rx} cy={ry} rx={f.ew * 1.05} ry={f.ew * 1.08} fill={`url(#${id}R)`} />
    <ellipse cx={f.M[0]} cy={f.M[1]} rx={f.mw * .95} ry={f.mh * 1.6} fill={`url(#${id}M)`} transform={`rotate(${ang} ${f.M[0]} ${f.M[1]})`} />
    {/* 새 눈: 까맣고 동그란 눈 (안광 없음) */}
    {eyes.map(([x, y], i) => <g key={i} transform={`rotate(${ang} ${x} ${y})`}>
      {closed   /* 잘 때(z z): 아래로 살짝 휜 감은 눈 */
        ? <path d={`M ${x - r * 1.05} ${y - r * .1} Q ${x} ${y + r * .75} ${x + r * 1.05} ${y - r * .1}`} fill="none" stroke={ink} strokeWidth={hw * .027} strokeLinecap="round" />
        : <ellipse cx={x} cy={y} rx={r} ry={blink ? r * .14 : r} fill={ink} />}
    </g>)}
    {/* 입: 작고 거의 평평한 콩 모양 */}
    <path d={`M ${m0[0]} ${m0[1]} Q ${mq[0]} ${mq[1]} ${m1[0]} ${m1[1]}`} fill="none" stroke={ink} strokeWidth={hw * .027} strokeLinecap="round" />
  </svg>;
}

/* 자세 사진 + 새 얼굴 (움직이지 않는 작은 그림용: 기록·웹사이트 등) */
function PoseImg({ pose = 'stand', h = 100, style }) {
  const P = POSES[pose] || POSES.stand, ph = h * P.k, pw = ph * P.w / P.h;
  return <div style={{ position: 'relative', width: pw, height: ph, flex: 'none', ...style }}>
    <div style={{ position: 'absolute', inset: 0, filter: pose === 'stand' ? 'url(#ohwa-warm)' : 'none' }}>
      <img src={P.src} alt="" draggable={false} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', ...(pose === 'stand' ? {} : POSE_FADE) }} />
      <Face pose={pose} />
    </div>
  </div>;
}

/* 하얀 말랑이 v10 — 자세 + 얼굴 + 여러 반응
   만지는 곳마다 다르게:  이마 → 눈 >< 질끈   볼 → ^^ 볼 빨개짐   코 → 깜짝 O   배 → 간지러워 꼼지락 ^^   팔 → 손 흔들기
   꾹 누르고 있으면 1.1초 뒤 발이 바닥에서 떨어져 손가락에 매달려 대롱대롱 (끌면 따라옴), 놓으면 툭 떨어져 출렁
   두 번 톡톡 → 빙글 점프 / 빠르게 다섯 번 → 어지러워 @@ / 옆으로 끌기 → 발차기
   가만히 → 둥둥 + 3~5초마다 눈 깜빡 + 손가락 쪽을 바라봄, 9초 지나면 앉아서 꾸벅
   조각 10개마다 만세 + 폴짝 + 반짝이, 30개 넘게 눌러도 하트 */
function Malangi({ h = 300, parts = [], pedestal = true, ped, el, idle = true, onPress, onHold, onRelease, disabled, children, holdEvery, float, pose: forced, enter = false, lean = true, flyFrom, sleepy = true, tilt = 0 }) {
  const w = h * BODY_RATIO;
  const fill = Math.min(1, parts.length / FULL);
  const pitch = el ? EL[el].pitch : 1;
  const [pose, setPose] = React.useState('stand');
  const [react, setReact] = React.useState({ k: enter ? 'drop' : '', n: 0 });
  const [flies, setFlies] = React.useState([]);
  const [burst, setBurst] = React.useState(0);
  const [hearts, setHearts] = React.useState([]);
  const [leanDeg, setLean] = React.useState(0);
  const [expr, setExpr] = React.useState('normal');
  const [blink, setBlink] = React.useState(false);
  const [gaze, setGaze] = React.useState([0, 0]);
  const [dangle, setDangle] = React.useState(null);          // { tx, ty } 매달렸을 때 몸을 옮길 거리(만세 자세의 머리 위 = 커서)
  const boxRef = React.useRef(null), timers = React.useRef({}), drag = React.useRef(null), prevLen = React.useRef(parts.length), prevSerial = React.useRef(parts.length - 1), taps = React.useRef([]);
  const cur = forced || pose, P = POSES[cur] || POSES.stand, isStand = cur === 'stand';
  const later = (key, ms, fn) => { clearTimeout(timers.current[key]); timers.current[key] = setTimeout(fn, ms); };
  const play = (k) => setReact(r => ({ k, n: r.n + 1 }));
  // 2026-11-06 사용자: 표정은 기본 표정만. (표정 그리기는 Face에 남겨 두고, 바꾸지는 않는다 — 몸 모션은 그대로)
  const face = () => {};
  const armSleep = () => { if (!sleepy || forced) return; later('sleep', 9000, () => { setPose('sit'); play('pop'); }); };
  const wake = () => { if (pose === 'sit') { setPose('wave'); play('pop'); later('back', 900, () => setPose('stand')); } armSleep(); };
  React.useEffect(() => { armSleep(); return () => Object.values(timers.current).forEach(clearTimeout); }, [forced]);
  // 눈 깜빡
  React.useEffect(() => { let alive = true; const loop = () => { if (!alive) return; setBlink(true); setTimeout(() => setBlink(false), 130); setTimeout(loop, 2600 + Math.random() * 2600); };
    const t = setTimeout(loop, 1800); return () => { alive = false; clearTimeout(t); }; }, []);
  // 조각마다 일련번호: 늘면 +늘어난 수, 꽉 찬 뒤 바뀌면(가장 오래된 게 빠지고 새 게 들어옴) +1 → 배 속 조각은 제자리, 새 조각만 쏙
  const serial = React.useRef({ n: parts.length - 1, parts, sig: parts.slice(-VISIBLE).join() });
  if (serial.current.parts !== parts) {
    const s0 = serial.current, sig = parts.slice(-VISIBLE).join();
    if (parts.length > s0.parts.length) s0.n += parts.length - s0.parts.length;
    else if (parts.length === s0.parts.length && sig !== s0.sig) s0.n += 1;
    else if (parts.length < s0.parts.length) s0.n = parts.length - 1;
    s0.parts = parts; s0.sig = sig;
  }
  const newest = serial.current.n;
  // 조각이 늘었을 때: 날아오는 조각 + 10개마다 만세
  React.useEffect(() => {
    const a = prevLen.current, b = parts.length; prevLen.current = b;
    if (b < a) return;
    if (b === a && newest === prevSerial.current) return;               // 바뀐 게 없음
    prevSerial.current = newest;
    const id = Math.random(), from = flyFrom || { x: 0, y: h * .7 };
    setFlies(f => [...f.slice(-5), { id, el: parts[b - 1], sx: from.x + (Math.random() - .5) * 30, sy: from.y }]);
    later('fly' + id, 700, () => setFlies(f => f.filter(x => x.id !== id)));
    if (Math.floor(b / 10) > Math.floor(a / 10)) {
      if (!forced && !dangle) { setPose('cheer'); later('back', 1500, () => setPose('stand')); }
      play('hop'); setBurst(x => x + 1); buzz([10, 40, 14]);
    }
    armSleep();
  }, [parts.length, newest]);
  // 매달려 흔들리는 동안 바람 소리
  React.useEffect(() => { if (!dangle) return; const t = setInterval(() => feel('swing', { pitch }), 600); return () => clearInterval(t); }, [!!dangle]);
  // 손가락 쪽으로 기울고 바라보기
  React.useEffect(() => {
    if (!lean) return;
    const mv = (e) => { const n = boxRef.current; if (!n) return; const r = n.getBoundingClientRect(); const cx = r.left + r.width / 2, cy = r.top + r.height * .38;
      const dx = e.clientX - cx, dy = e.clientY - cy, d = Math.hypot(dx, dy) || 1;
      setLean(Math.max(-7, Math.min(7, dx / 28))); setGaze([dx / d * Math.min(5, d / 30), dy / d * Math.min(4, d / 40)]);
      later('lean', 1600, () => { setLean(0); setGaze([0, 0]); }); };
    window.addEventListener('pointermove', mv); window.addEventListener('pointerdown', mv);
    return () => { window.removeEventListener('pointermove', mv); window.removeEventListener('pointerdown', mv); };
  }, [lean]);
  // 어디를 만졌나
  const zone = (nx, ny) => ny < .2 ? 'forehead' : ny < .5 ? (Math.abs(nx - .5) > .2 ? 'cheek' : 'nose') : (nx < .16 || nx > .84) ? 'arm' : ny > .9 ? 'feet' : 'belly';
  const react2 = (z) => {
    const now = performance.now(); taps.current = [...taps.current.filter(t => now - t < 1500), now];
    if (taps.current.length >= 5) { taps.current = []; setPose('stand'); face('dizzy', 1700); play('spin'); feel('stretch', { pitch: .7 }); buzz([8, 30, 8, 30, 8]); return; }
    if (taps.current.length >= 2 && now - taps.current[taps.current.length - 2] < 300) { play('spin'); face('happy', 700); return; }
    if (forced) return;
    if (z === 'forehead') { setPose('stand'); face('squint', 800); play('nod'); }
    else if (z === 'cheek') { setPose('stand'); face('happy', 700); play('wiggle'); }
    else if (z === 'nose') { setPose('stand'); face('surprised', 600); play('pop'); }
    else if (z === 'belly') { setPose('stand'); face('happy', 900); play('giggle'); }
    else if (z === 'arm') { setPose('wave'); later('back', 900, () => setPose('stand')); }
    else play('hop');
  };
  const [ref, hand] = useJelly({ pitch, holdEvery, disabled, hang: !!dangle,
    onPress: () => {
      wake();
      if (parts.length >= FULL) { const id = Math.random(); setHearts(x => [...x.slice(-8), { id, dx: (Math.random() - .5) * w * .9, s: .8 + Math.random() * .7 }]); later('h' + id, 1200, () => setHearts(x => x.filter(y => y.id !== id))); }
      onPress && onPress();
    },
    onHold, onRelease: (peak) => { if (peak > .45 && !dangle) play('hop'); onRelease && onRelease(peak); } });
  // 매달리기: 만세 자세(두 손 위)의 머리 꼭대기가 커서 바로 아래 오게 몸을 옮긴다. 발은 바닥에서 최소 h*.12 떨어짐
  const anchor = (cx, cy) => {
    const n = boxRef.current; if (!n) return { tx: 0, ty: -h * .2 };
    const r = n.getBoundingClientRect(), s = r.width / n.offsetWidth || 1;
    const C = POSES.cheer, phc = h * C.k, topY = h - phc * (1 - 10 / C.h);
    return { tx: (cx - r.left) / s - n.offsetWidth / 2, ty: Math.min((cy - r.top) / s - topY + 4, -h * .12) };
  };
  const aboveHead = (cy) => { const n = boxRef.current; if (!n) return false; const r = n.getBoundingClientRect(), s = r.width / n.offsetWidth || 1; return (cy - r.top) / s < h * .04; };
  const startDangle = (cx, cy) => {
    if (dangle) return; clearTimeout(timers.current.dangle); clearTimeout(timers.current.back);
    setPose('cheer'); setDangle(anchor(cx, cy)); feel('lift', { pitch }); buzz([6, 20, 6]);
  };
  const handlers = { ...hand,
    onPointerDown: (e) => {
      const n = ref.current, r = n ? n.getBoundingClientRect() : null;
      const nx = r ? (e.clientX - r.left) / r.width : .5, ny = r ? (e.clientY - r.top) / r.height : .5;
      drag.current = { x: e.clientX, y: e.clientY, cx: e.clientX, cy: e.clientY, nx, ny };
      hand.onPointerDown(e);
      if (!disabled) {
        react2(zone(nx, ny));
        // 오래 누르면 대롱대롱
        if (!forced) later('dangle', 1100, () => { const d = drag.current; if (d) startDangle(d.cx, d.cy); });
      }
    },
    onPointerMove: (e) => {
      hand.onPointerMove(e); const d0 = drag.current; if (!d0) return;
      d0.cx = e.clientX; d0.cy = e.clientY;
      if (dangle) setDangle(anchor(e.clientX, e.clientY));                                 // 커서를 따라 대롱대롱
      // 위로 땡기면: 먼저 쭉 늘어나다가, 커서가 머리 위로 올라가면(또는 120px 넘게 당기면) 두 손 들고 커서에 매달림
      else if (!forced && !disabled && (d0.y - e.clientY > 120 || (d0.y - e.clientY > 30 && aboveHead(e.clientY)))) startDangle(e.clientX, e.clientY);
      else if (!forced && Math.abs(e.clientX - d0.x) > 44 && pose !== 'kick') { clearTimeout(timers.current.dangle); setPose('kick'); feel('stretch', { pitch }); }
    },
    onPointerUp: (e) => {
      drag.current = null; clearTimeout(timers.current.dangle); hand.onPointerUp(e);
      if (dangle) { setDangle(null); setPose('stand'); play('land'); feel('land', { pitch }); buzz([14, 30, 8]); }
      if (pose === 'kick') later('back', 500, () => setPose('stand'));
    },
  };
  handlers.onPointerCancel = handlers.onPointerUp;

  const ph = h * P.k, pw = ph * P.w / P.h;                 // 지금 자세 이미지 크기
  const box = Math.max(w * 1.3, pw);
  const pieceW = w * .24;
  const lastV = parts.slice(-VISIBLE); const vis = lastV.map((p, i) => [p, newest - (lastV.length - 1 - i)]);   // [기운, 일련번호]
  const B = P.belly, bulgeOn = isStand;
  const bands = [{ a: 0, b: HEAD_END + .004, s: 1 }];
  if (isStand) for (let i = 0; i < SLICES; i++) {
    const a = HEAD_END + (1 - HEAD_END) * i / SLICES, b = HEAD_END + (1 - HEAD_END) * (i + 1) / SLICES;
    bands.push({ a: a - .0015, b: b + .0015, s: 1 + .18 * fill * bellyBump((a + b) / 2) });
  } else bands[0].b = 1;
  const floating = idle && cur !== 'sit' && !dangle;
  const reactAnim = { drop: 'ohwa-drop 900ms var(--ease-calm) both', hop: 'ohwa-hop 620ms var(--ease-calm) both', pop: 'ohwa-posepop 420ms var(--ease-jelly) both', wiggle: 'ohwa-wiggle 520ms ease-in-out both',
    spin: 'ohwa-spinjump 760ms var(--ease-calm) both', nod: 'ohwa-nod 520ms var(--ease-calm) both', giggle: 'ohwa-giggle 700ms ease-in-out both', land: 'ohwa-land 700ms var(--ease-calm) both' }[react.k] || 'none';
  return <div ref={boxRef} style={{ position: 'relative', width: box, height: h, margin: '0 auto' }}>
    {pedestal && <Pedestal w={ped || h * .9} el={el} />}
    <div style={{ position: 'absolute', left: '50%', bottom: h * .005, width: w * (.78 + .16 * fill) * (dangle ? .55 : 1), height: h * .055, borderRadius: '50%', background: 'rgba(40,30,25,.22)', filter: 'blur(7px)', zIndex: 1,
      opacity: dangle ? .45 : 1, animation: 'none', transform: `translateX(calc(-50% + ${dangle ? dangle.tx : 0}px))`, transition: 'width 300ms, opacity 300ms, transform 120ms' }} />
    {float}
    <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: h, zIndex: 2, transform: `rotate(${dangle ? 0 : leanDeg + tilt}deg)`, transformOrigin: '50% 100%', transition: 'transform 700ms var(--ease-jelly)' }}>
      {/* 매달림: 잡은 곳을 축으로 들려서 흔들 */}
      <div style={{ position: 'absolute', inset: 0, transform: dangle ? `translate(${dangle.tx}px, ${dangle.ty}px)` : 'none', transition: dangle ? 'transform 110ms ease-out' : 'transform 260ms var(--ease-calm)' }}>
      <div style={{ position: 'absolute', inset: 0, transformOrigin: dangle ? `50% ${(h - ph * (1 - 10 / P.h)) / h * 100}%` : '50% 100%', animation: dangle ? 'ohwa-dangle 1.2s ease-in-out infinite alternate' : 'none' }}>
      <div style={{ position: 'absolute', inset: 0, transformOrigin: '50% 100%', animation: floating ? 'ohwa-breathe 4.4s ease-in-out infinite' : 'none' }}>
        {/* 누르는 요소(ref)는 절대 다시 만들지 않는다 — 다시 만들면 포인터 캡처가 끊겨 놓기·끌기를 놓친다 */}
          <div ref={ref} {...handlers} style={{ position: 'absolute', left: '50%', bottom: 0, width: isStand ? w : pw, height: isStand ? h : ph, marginLeft: -(isStand ? w : pw) / 2,
            transformOrigin: dangle ? '50% 10%' : '50% 97%', cursor: disabled ? 'default' : dangle ? 'grabbing' : 'pointer', touchAction: 'none', userSelect: 'none', WebkitUserSelect: 'none', WebkitTouchCallout: 'none' }}>
           <div key={react.k + react.n} style={{ position: 'absolute', inset: 0, transformOrigin: '50% 100%', animation: reactAnim, pointerEvents: 'none' }}>
            <div key={cur} style={{ position: 'absolute', inset: 0, animation: 'ohwa-posepop 380ms var(--ease-jelly) both', pointerEvents: 'none' }}>
              {/* 몸 + 얼굴 — 서 있기(body.png)는 자세 사진 색에 맞춰 살짝 따뜻하게 */}
              <div style={{ position: 'absolute', inset: 0, filter: isStand ? 'url(#ohwa-warm)' : 'none' }}>
                {bands.map((bd, i) => <div key={i} style={{ position: 'absolute', inset: 0, clipPath: isStand ? `inset(${bd.a * 100}% -30% ${(1 - bd.b) * 100}% -30%)` : 'none', transform: `scaleX(${bd.s})`, transition: 'transform 520ms var(--ease-jelly)', pointerEvents: 'none' }}>
                  <img src={P.src} alt="" draggable={false} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none', ...(isStand ? {} : POSE_FADE) }} />
                </div>)}
                <Face pose={cur} gaze={cur === 'sit' && !forced ? [0, 0] : gaze} blink={blink} closed={cur === 'sit' && !forced} />
              </div>
              {/* 배 속 조각 (보이는 건 최대 5개) */}
              <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
                {vis.map(([p, idx]) => { const { x, y, rot } = bellySlot(idx, fill, B, bulgeOn);
                  return <img key={idx} src={EL[p].piece} alt="" draggable={false} style={{ position: 'absolute', left: `${x * 100}%`, top: `${y * 100}%`, width: pieceW, marginLeft: -pieceW / 2, marginTop: -pieceW / 2,
                    '--rot': `${rot}deg`, '--fx': '0px', '--fy': '0px', transform: `rotate(${rot}deg)`, opacity: .84, filter: 'saturate(1.05) drop-shadow(0 1px 2px rgba(0,0,0,.12))', animation: idx === newest ? 'ohwa-bellypop 520ms 380ms var(--ease-jelly) both' : 'none' }} />; })}
              </div>
            </div>
           </div>
            {children}
          </div>
      </div>
      </div>
      </div>
      {/* 날아오는 조각 — 배 가운데를 목표로 */}
      {flies.map(f => <img key={f.id} src={EL[f.el].piece} alt="" style={{ position: 'absolute', left: '50%', bottom: h * (1 - B.cy) - pieceW / 2, width: pieceW * 1.1, marginLeft: -pieceW * .55, zIndex: 5, pointerEvents: 'none',
        '--sx': `${f.sx}px`, '--sy': `${f.sy}px`, animation: 'ohwa-flyin 620ms cubic-bezier(.3,.1,.3,1) forwards' }} />)}
      {/* 10개마다 반짝 */}
      {burst > 0 && <div key={'b' + burst} style={{ position: 'absolute', left: '50%', top: '40%', width: 0, height: 0, zIndex: 6, pointerEvents: 'none' }}>
        {Array.from({ length: 12 }).map((_, i) => <span key={i} style={{ position: 'absolute', left: 0, top: 0, fontSize: 14 + (i % 3) * 6, color: el ? `var(--${el})` : '#FFC247', '--r': `${i * 30}deg`, '--d': `${-h * (.42 + (i % 2) * .12)}px`,
          animation: `ohwa-burst 900ms ${i * 18}ms cubic-bezier(.2,.7,.3,1) both`, textShadow: '0 1px 0 #fff' }}>{i % 3 ? '✦' : '●'}</span>)}
      </div>}
      {hearts.map(t => <span key={t.id} style={{ position: 'absolute', left: '50%', top: h * .25, zIndex: 6, pointerEvents: 'none', fontSize: 22 * t.s, color: el ? `var(--${el})` : '#FF626B', textShadow: '0 2px 0 #fff',
        '--hx': `${t.dx}px`, animation: 'ohwa-heart 1.1s cubic-bezier(.2,.7,.3,1) forwards' }}>♥</span>)}
      {/* 어지러움 별 */}
      {expr === 'dizzy' && <div style={{ position: 'absolute', left: '50%', top: h * .02, width: 0, height: 0, zIndex: 6, pointerEvents: 'none', animation: 'ohwa-spin 1.2s linear infinite' }}>
        {[0, 1, 2].map(i => <span key={i} style={{ position: 'absolute', left: Math.cos(i * 2.09) * w * .32 - 8, top: Math.sin(i * 2.09) * 12 - 8, fontSize: 16, color: '#FFC247' }}>★</span>)}
      </div>}
      {/* 꾸벅 */}
      {cur === 'sit' && !forced && <div style={{ position: 'absolute', left: '50%', top: h * .12, marginLeft: w * .32, zIndex: 6, pointerEvents: 'none', fontWeight: 900, color: '#8C8794' }}>
        {[0, 1, 2].map(i => <span key={i} style={{ position: 'absolute', left: i * 9, top: -i * 12, fontSize: 12 + i * 4, animation: `ohwa-zz 2.4s ${i * .6}s ease-out infinite` }}>z</span>)}
      </div>}
    </div>
  </div>;
}

/* 머리 위에 둥둥 떠다니는 조각들 — counts: { wood: 3, ... } */
function FloatingParts({ counts, h, top = 0, spread = 1 }) {
  const items = []; EL_ORDER.forEach(e => { for (let i = 0; i < (counts[e] || 0); i++) items.push(e); });
  const n = items.length; const w = h * BODY_RATIO;
  return <div style={{ position: 'absolute', left: '50%', top, width: 0, height: 0, zIndex: 3, pointerEvents: 'none' }}>
    {items.map((e, i) => {
      const t = n === 1 ? .5 : i / (n - 1);
      const ang = Math.PI * (1.08 + .84 * t);                     // 머리 위 아치
      const R = w * (.62 + (i % 2) * .13) * spread;
      const x = Math.cos(ang) * R, y = Math.sin(ang) * R * .6 + (i % 3) * 7;
      const size = h * (.155 + (i % 3) * .02);
      return <div key={e + i} style={{ position: 'absolute', left: x, top: y, width: size, height: size, marginLeft: -size / 2, marginTop: -size / 2,
        animation: `ohwa-in 520ms ${i * 60}ms var(--ease-jelly) both` }}>
        <img src={EL[e].piece} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain', filter: 'drop-shadow(0 8px 10px rgba(40,30,25,.16))',
          animation: `ohwa-bob ${2.6 + (i % 4) * .45}s ${-(i * .53)}s ease-in-out infinite`, '--r0': `${((i * 37) % 30) - 15}deg` }} />
      </div>;
    })}
  </div>;
}

/* 원형 이미지 오브 — 5마리 로스터/궤도용 */
function CharOrb({ el, size = 64, on, dim, onClick, label }) {
  return <div className={onClick ? 'press' : ''} onClick={onClick} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, opacity: dim ? .42 : 1 }}>
    <div style={{ width: size, height: size, borderRadius: '50%', position: 'relative', overflow: 'hidden',
      background: on ? `radial-gradient(circle at 50% 35%, #fff, var(--${el}-2))` : 'var(--glass-strong)',
      border: on ? `2.5px solid var(--${el})` : '1px solid var(--glass-edge)', boxShadow: on ? `0 10px 22px -10px var(--${el})` : 'var(--shadow-chip)',
      filter: dim ? 'grayscale(.9)' : 'none', transition: 'all 400ms var(--ease-jelly)' }}>
      <img src={EL[el].piece} alt="" style={{ position: 'absolute', left: '50%', top: '50%', width: '66%', height: '66%', objectFit: 'contain', transform: 'translate(-50%,-50%)' }} />
    </div>
    {label && <span style={{ fontSize: 12, fontWeight: 700, color: on ? 'var(--fg1)' : 'var(--fg3)' }}>{label}</span>}
  </div>;
}

/* 한자 타일 — 사주 글자 */
function HanjaTile({ ch, el, read, size = 60 }) {
  return <div style={{ width: size, height: size, borderRadius: size * .32, background: `var(--${el}-2)`, display: 'grid', placeItems: 'center', position: 'relative',
    boxShadow: `inset 0 1px 0 rgba(255,255,255,.8), inset 0 -4px 0 color-mix(in oklab, var(--${el}) 35%, transparent)` }}>
    <span className="hanja" style={{ fontSize: size * .46, color: `var(--${el}-ink)`, lineHeight: 1 }}>{ch}</span>
    {read && <span style={{ position: 'absolute', bottom: 5, fontSize: 9.5, fontWeight: 700, color: `var(--${el}-ink)`, opacity: .7 }}>{read}</span>}
  </div>;
}

/* 링 게이지 */
function Ring({ value, max = 30, size = 300, el, stroke = 6 }) {
  const ticks = max; const r = size / 2 - stroke;
  return <svg width={size} height={size} style={{ position: 'absolute', left: '50%', top: '50%', transform: 'translate(-50%,-50%)', pointerEvents: 'none' }}>
    {Array.from({ length: ticks }).map((_, i) => {
      const a = (i / ticks) * Math.PI * 2 - Math.PI / 2, on = i < value;
      const x1 = size / 2 + Math.cos(a) * (r - 10), y1 = size / 2 + Math.sin(a) * (r - 10), x2 = size / 2 + Math.cos(a) * r, y2 = size / 2 + Math.sin(a) * r;
      return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={on ? `var(--${el})` : 'var(--fg4)'} strokeWidth={stroke} strokeLinecap="round" style={{ transition: 'stroke 300ms' }} />;
    })}
  </svg>;
}

Object.assign(window, { feel, buzz, OhwaLogo, Malangi, Face, PoseImg, FACES, ThemeButton, useTheme, applyTheme, getTheme, POSES, POSE_FADE, FloatingParts, bodyTint, useJelly, EL, EL_ORDER, BODY, OUTFITS, Icon, Studio, StatusBar, Dock, Chip, Pedestal, Figure, PartsInBody, CharOrb, HanjaTile, Ring });
