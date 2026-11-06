// 오화 — Onboard · Today · Charge
const S = () => window.OhwaSaju;
const fadeIn = { animation: 'ohwa-in 560ms var(--ease-calm) both', position: 'absolute', inset: 0, boxSizing: 'border-box' };
const WEEK = ['일', '월', '화', '수', '목', '금', '토'];
const fmtDate = (d) => `${d.getMonth() + 1}월 ${d.getDate()}일 ${WEEK[d.getDay()]}요일`;
const FULL_CHARGE = 30;
/* 입력 칸 — 컴포넌트가 아니라 함수로 그려서 타이핑 중 포커스가 안 날아가게 */
function numField({ value, onChange, unit, w = 1, max = 2, placeholder, label }) {
  return <label key={unit || label} style={{ flex: w, minWidth: 0, height: 52, borderRadius: 18, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2, background: 'var(--bg)' }}>
    <input value={value} inputMode="numeric" maxLength={max} placeholder={placeholder} aria-label={label || unit}
      onChange={e => onChange(e.target.value.replace(/[^0-9]/g, '').slice(0, max))} onFocus={e => e.target.select()} className="num"
      style={{ width: max === 4 ? 60 : 30, border: 0, background: 'transparent', fontSize: 20, color: 'var(--fg1)', textAlign: 'right', outline: 'none', padding: 0 }} />
    <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--fg3)' }}>{unit}</span>
  </label>;
}
const seg = (on) => ({ height: 44, padding: '0 14px', background: on ? 'var(--primary)' : undefined, color: on ? 'var(--on-primary)' : undefined });
/* ---------- 01 Onboard — 위: 내 일간 색 무대(입력할 때마다 색·조각이 바뀜) / 아래: 흰 입력 카드 ---------- */
function OnboardScreen({ onDone, cta }) {
  const [f, setF] = React.useState(() => { const i = S().profile.input || S().DEFAULT; return { ...S().DEFAULT, ...i, y: String(i.y), m: String(i.m), d: String(i.d), hour: String(i.hour ?? ''), minute: String(i.minute ?? '') }; });
  const set = (k) => (v) => setF(o => ({ ...o, [k]: v }));
  const p = React.useMemo(() => S().compute(f), [f]);
  const ok = !p.error;
  const [shown, setShown] = React.useState(ok ? p : S().profile);   // 입력 중 잠깐 틀려도 마지막 결과 유지
  React.useEffect(() => { if (ok) setShown(p); }, [p]);
  const counts = shown.count, dm = shown.dayMaster;
  const top = EL_ORDER.slice().sort((a, b) => counts[b] - counts[a])[0];
  const ink = INK;
  const pill = (on) => ({ height: 40, padding: '0 13px', borderRadius: 999, border: 0, cursor: 'pointer', fontFamily: 'var(--font-sans)', fontSize: 13, fontWeight: 800, flex: 'none',
    background: on ? 'var(--primary)' : 'var(--bg)', color: on ? 'var(--on-primary)' : 'var(--fg2)', transition: 'background 200ms' });
  return <div style={fadeIn}>
    <div style={{ position: 'absolute', left: 0, right: 0, top: -50, height: 50, background: tint(dm, 10), transition: 'background 500ms' }} />
    {/* 무대 */}
    <div className="stage" style={{ height: 384, background: `var(--${dm})`, transition: 'background 500ms' }}>
      <div style={{ position: 'absolute', left: '50%', bottom: -120, width: 520, height: 210, marginLeft: -260, borderRadius: '50%', background: 'rgba(255,255,255,.3)' }} />
      <div style={{ position: 'relative', padding: '10px 22px 0', color: ink }}>
        <OhwaLogo height={22} />
        <div style={{ fontSize: 27, fontWeight: 800, letterSpacing: '-.045em', lineHeight: 1.2, marginTop: 14 }}>태어난 날을 알려주세요</div>
        <div style={{ fontSize: 13.5, fontWeight: 700, opacity: .72, marginTop: 4 }}>날짜가 바뀌면 내 기운 조각도 바뀌어요</div>
      </div>
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 14 }}>
        <Malangi h={188} pedestal={false} el={top} enter float={<FloatingParts key={JSON.stringify(counts)} counts={counts} h={188} top={0} spread={1.05} />} />
      </div>
    </div>
    {/* 입력 카드 */}
    <div className="card" style={{ position: 'relative', margin: '12px 14px 0', padding: 14 }}>
      <div style={{ display: 'flex', gap: 6 }}>
        {numField({ value: f.y, onChange: set('y'), unit: '년', w: 1.45, max: 4 })}
        {numField({ value: f.m, onChange: set('m'), unit: '월' })}
        {numField({ value: f.d, onChange: set('d'), unit: '일' })}
      </div>
      <div style={{ display: 'flex', gap: 6, marginTop: 6, alignItems: 'center' }}>
        {f.timeKnown ? <>
          {numField({ value: f.hour, onChange: set('hour'), unit: '시', placeholder: '0' })}
          {numField({ value: f.minute, onChange: set('minute'), unit: '분', placeholder: '0' })}
        </> : <div style={{ flex: 2, height: 52, borderRadius: 18, background: 'var(--bg)', display: 'grid', placeItems: 'center', fontSize: 13, fontWeight: 700, color: 'var(--fg3)' }}>시간 없이 여섯 글자로 봐요</div>}
        <button className="press" onClick={() => { feel('tick'); set('timeKnown')(!f.timeKnown); }} style={{ ...pill(!f.timeKnown), height: 52, borderRadius: 18 }}>시간 모름</button>
      </div>
      <div style={{ display: 'flex', gap: 6, marginTop: 6, alignItems: 'center' }}>
        <label style={{ flex: 1, minWidth: 0, height: 40, borderRadius: 999, display: 'flex', alignItems: 'center', padding: '0 15px', background: 'var(--bg)' }}>
          <input value={f.name} maxLength={8} placeholder="이름 (선택)" aria-label="이름" onChange={e => set('name')(e.target.value)}
            style={{ width: '100%', border: 0, background: 'transparent', fontSize: 14, fontWeight: 700, color: 'var(--fg1)', outline: 'none', padding: 0, fontFamily: 'var(--font-sans)' }} />
        </label>
        {[['양력', false], ['음력', false], ['윤달', true]].map(([c, lp]) => {
          const on = c === '윤달' ? f.cal === '음력' && f.leap : f.cal === c && !(c === '음력' && f.leap);
          return <button key={c} className="press" onClick={() => { feel('tick'); setF(o => ({ ...o, cal: c === '양력' ? '양력' : '음력', leap: lp })); }} style={pill(on)}>{c}</button>;
        })}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 12, minHeight: 22, padding: '0 4px', flexWrap: 'nowrap', overflow: 'hidden' }}>
        {ok ? [<span key="dm" style={{ height: 24, padding: '0 9px', borderRadius: 999, background: tint(dm, 22), color: INK, fontSize: 12, fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: 3, flex: 'none' }}><span className="hanja">{shown.dayStem}</span>{shown.dayMean}</span>, ...EL_ORDER.map(e => <span key={e} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 12.5, fontWeight: 800, color: counts[e] ? `var(--${e}-ink)` : 'var(--fg4)' }}>
          <img src={EL[e].piece} alt="" style={{ width: 18, height: 18, objectFit: 'contain', opacity: counts[e] ? 1 : .35, filter: counts[e] ? 'none' : 'grayscale(1)' }} />{EL[e].ko}{counts[e]}</span>)]
          : <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--error)' }}>{p.error}</span>}
      </div>
    </div>
    <div style={{ position: 'absolute', left: 20, right: 20, bottom: 36 }}>
      <button className="cta press" style={{ width: '100%' }} disabled={!ok}
        onClick={() => { const r = S().setBirth(f); if (r.error) return; feel('pop'); buzz(10); onDone(); }}>{ok ? (cta || `${shown.display === "나" ? "내" : shown.display} 사주 보러 가기`) : '날짜를 확인해 주세요'}</button>
    </div>
  </div>;
}
/* ---------- 02 Today v8 — 링 앱 같은 와이어프레임 + 원더 같은 흰→파스텔 톤 + 말하는 이야기 카드 ---------- */
const T = () => window.OhwaText;
const dayKey = () => S().TODAY.toDateString() + '-' + S().profile.seed;
const INK = 'var(--ink-strong)';   // 낮 코코아 브라운 / 밤 크림 (테마 변수)
const tint = (el, p) => `color-mix(in srgb, var(--${el}) ${p}%, var(--tint-base))`;   // 흰색 대신 아이보리와 섞는다
const sceneBg = (el) => `linear-gradient(180deg, var(--scene-top) 0%, ${tint(el, 14)} 45%, ${tint(el, 48)} 100%)`;
/* 아래에서 올라오는 시트 (다른 화면에서도 씀) */
function Sheet({ onClose, children }) {
  return <div style={{ position: 'absolute', inset: 0, zIndex: 40, background: 'rgba(30,25,30,.28)', display: 'flex', alignItems: 'flex-end', animation: 'ohwa-in 260ms both' }} onClick={onClose}>
    <div className="card" onClick={e => e.stopPropagation()} style={{ margin: 12, borderRadius: 34, padding: '24px 22px 18px', width: '100%', textAlign: 'center', animation: 'ohwa-pop 520ms var(--ease-jelly) both' }}>{children}</div>
  </div>;
}
/* 말랑이가 들려주는 오늘의 이야기 — 위: 말랑이(자세가 바뀜) / 아래: 말풍선처럼 솟은 흰 판 + 다음 */
function storyPages(rec, charge) {
  const P = S().profile, n = S().needFor(S().TODAY), r = T().recipe(rec, S().TODAY, P), ko = EL[rec].ko;
  const josa = (w, a, b) => { const c = w.charCodeAt(w.length - 1) - 0xAC00; return w + (c >= 0 && c % 28 ? a : b); };
  const call = P.name ? `${P.name}, ` : '';
  return [
    { pose: 'cheer', at: 0, title: `${call}오늘은 ${ko} 기운을\n채우면 좋은 하루야`, body: `내 사주엔 ${ko} 기운이 ${P.count[rec]}개뿐이야. 오늘 ${n.pillar.stem}${n.pillar.branch}일에 말랑이 배를 같이 채워 보자!` },
    { pose: 'sit', at: 10, emoji: r[0].emoji, title: `오늘의 기운 밥은\n${r[0].name}!`, body: `${r[0].sub}. ${r[0].why}.` },
    { pose: 'kick', at: 20, emoji: r[1].emoji, title: `오늘은\n${josa(r[1].name, '은', '는')} 어때?`, body: `${r[1].sub}. ${r[1].why}.` },
    { pose: 'wave', at: 30, emoji: '🔮', title: `${T().DAY_STEM[P.dayStem].pic}인 너에게\n${josa(T().EL_TEXT[rec].name, '은', '는')} ${T().relation(P.dayMaster, rec).replace(' 기운', '')} 기운이야`, body: T().ADVICE[rec].replace('보세요.', '봐.').replace('해 보세요.', '해 봐.') },
  ].map(p => ({ ...p, locked: charge < p.at }));
}
function TalkStory({ el, charge, start = 0, onClose }) {
  const pages = storyPages(el, charge);
  const [i, setI] = React.useState(start);
  const p = pages[i], last = i === pages.length - 1;
  const go = (d) => { const v = i + d; if (v < 0) return; if (v >= pages.length) return onClose(); setI(v); feel('tick', { pitch: 1 + v * .08 }); buzz(5); };
  const d = S().TODAY;
  // 폰 전체 위에 띄운다 (화면 전환 애니메이션 안에 갇히면 도크가 위로 올라옴)
  const [host, setHost] = React.useState(() => document.querySelector('.phone'));
  React.useEffect(() => { if (!host) setHost(document.querySelector('.phone')); }, []);
  if (!host) return null;
  return ReactDOM.createPortal(<div style={{ position: 'absolute', inset: 0, zIndex: 35, borderRadius: 'inherit', overflow: 'hidden', background: sceneBg(el), animation: 'ohwa-in 260ms both', display: 'flex', flexDirection: 'column' }}>
    {/* 진행 막대 */}
    <div style={{ display: 'flex', gap: 4, padding: '54px 16px 0' }}>{pages.map((_, k) => <i key={k} style={{ flex: 1, height: 4, borderRadius: 2, background: k <= i ? INK : 'var(--line)', transition: 'background 300ms' }} />)}</div>
    <div style={{ display: 'flex', alignItems: 'center', padding: '10px 12px 0' }}>
      <button className="press" aria-label="닫기" onClick={onClose} style={{ width: 40, height: 40, border: 0, background: 'transparent', color: INK, cursor: 'pointer', display: 'grid', placeItems: 'center' }}><Icon name="X" size={22} /></button>
      <div style={{ flex: 1, textAlign: 'center', fontSize: 15, fontWeight: 800, color: INK, marginRight: 40 }}>{d.getFullYear()}. {d.getMonth() + 1}. {d.getDate()}. ({WEEK[d.getDay()]}) 오늘의 이야기</div>
    </div>
    {/* 말랑이 */}
    <div style={{ position: 'relative', flex: 1 }} onClick={(e) => { const r = e.currentTarget.getBoundingClientRect(); go(e.clientX - r.left < r.width * .3 ? -1 : 1); }}>
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 22 }}>
        <Malangi key={i} h={232} pedestal={false} el={el} pose={p.locked ? 'sit' : p.pose} sleepy={false} lean={false} />
      </div>
      {p.emoji && !p.locked && <div key={'e' + i} style={{ position: 'absolute', left: '50%', bottom: 150, marginLeft: 70, fontSize: 46, animation: 'ohwa-pop 520ms 200ms var(--ease-jelly) both' }}>
        <div style={{ animation: 'ohwa-bob 4.4s ease-in-out infinite', '--r0': '-8deg' }}>{p.emoji}</div></div>}
      {p.locked && <div style={{ position: 'absolute', left: '50%', bottom: 160, marginLeft: 64, fontSize: 34, animation: 'ohwa-wiggle 1.4s ease-in-out infinite' }}>🔒</div>}
    </div>
    {/* 말풍선 판 */}
    <div style={{ position: 'relative', background: 'var(--card)', borderRadius: '50% 50% 0 0 / 46px 46px 0 0', padding: '40px 26px 30px', textAlign: 'center', animation: 'ohwa-rise 420ms var(--ease-calm) both', boxShadow: '0 -10px 30px -20px rgba(0,0,0,.25)' }}>
      <i style={{ position: 'absolute', left: '50%', marginLeft: -11, top: -9, width: 22, height: 22, background: 'var(--card)', transform: 'rotate(45deg)', borderRadius: 4 }} />
      <div key={i} style={{ animation: 'ohwa-slide 380ms var(--ease-calm) both' }}>
        <div style={{ fontSize: 21, fontWeight: 800, color: 'var(--fg1)', letterSpacing: '-.035em', lineHeight: 1.4, whiteSpace: 'pre-line', wordBreak: 'keep-all', minHeight: 58 }}>
          {p.locked ? `${p.at}꾹 채우면\n알려 줄게!` : p.title}</div>
        <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--fg2)', marginTop: 12, lineHeight: 1.55, wordBreak: 'keep-all', minHeight: 46 }}>
          {p.locked ? `지금 ${charge}꾹이야. ${p.at - charge}꾹만 더 눌러 줘.` : p.body}</div>
      </div>
      <button className="press" onClick={() => p.locked ? onClose() : go(1)} style={{ width: '100%', height: 56, marginTop: 22, border: 0, borderRadius: 999, cursor: 'pointer', fontFamily: 'var(--font-sans)', fontSize: 16, fontWeight: 800,
        background: tint(el, 70), color: INK }}>{p.locked ? '채우러 가기' : last ? '마음에 담기' : '다음'}</button>
    </div>
  </div>, host);
}
/* 반원 게이지 (링 앱 Steps 카드처럼) */
function HalfGauge({ value, max = 30, el, size = 112 }) {
  const r = size / 2 - 7, c = Math.PI * r, p = Math.min(1, value / max), a = Math.PI * (1 - p);
  return <svg width={size} height={size / 2 + 10} viewBox={`0 0 ${size} ${size / 2 + 10}`} style={{ display: 'block' }}>
    <path d={`M 7 ${size / 2} A ${r} ${r} 0 0 1 ${size - 7} ${size / 2}`} fill="none" stroke="var(--line)" strokeWidth="7" strokeLinecap="round" />
    <path d={`M 7 ${size / 2} A ${r} ${r} 0 0 1 ${size - 7} ${size / 2}`} fill="none" stroke={`var(--${el})`} strokeWidth="7" strokeLinecap="round" strokeDasharray={`${c * p} ${c}`} style={{ transition: 'stroke-dasharray 600ms var(--ease-jelly)' }} />
    <circle cx={size / 2 + Math.cos(a) * r} cy={size / 2 - Math.sin(a) * r} r="6" fill="var(--card)" stroke={`var(--${el})`} strokeWidth="3" style={{ transition: 'all 600ms var(--ease-jelly)' }} />
  </svg>;
}
/* 오행 말랑이 한 명 소개 — 내 사주 속 개수 + 그 기운의 오늘 밥·행동 */
function FriendSheet({ e, rec, onClose, onFill }) {
  const P = S().profile, t = T().EL_TEXT[e], r = T().recipe(e, S().TODAY, P), c = P.count[e];
  return <Sheet onClose={onClose}>
    <div style={{ position: 'relative', height: 150, margin: '-6px -8px 0', borderRadius: 26, background: `linear-gradient(180deg, var(--scene-top), ${tint(e, 35)})`, overflow: 'hidden' }}>
      <img src={EL[e].img} alt="" style={{ position: 'absolute', left: '50%', bottom: 6, height: 136, transform: 'translateX(-50%)', animation: 'ohwa-drop 800ms var(--ease-calm) both' }} />
      {e === rec && <span style={{ position: 'absolute', left: 12, top: 12, height: 22, padding: '0 9px', borderRadius: 11, background: INK, color: 'var(--on-ink)', fontSize: 11, fontWeight: 800, lineHeight: '22px' }}>오늘 추천</span>}
    </div>
    <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--fg1)', letterSpacing: '-.035em', marginTop: 14 }}>{EL[e].ko} <span className="hanja">{EL[e].hj}</span> · {t.name} 말랑이</div>
    <div style={{ fontSize: 14, fontWeight: 700, color: `var(--${e}-ink)`, marginTop: 4 }}>{t.keyword} — {t.like}</div>
    <div style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--fg2)', marginTop: 8 }}>내 사주에 {c ? `${c}개 있어요` : '없어요 · 채울 자리가 있어요'}</div>
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 14, textAlign: 'left' }}>
      {[[r[0].emoji, '이 기운 밥', r[0].name], [r[1].emoji, '이 기운 행동', r[1].name]].map(([em, k, v]) => <div key={k} style={{ borderRadius: 18, background: 'var(--bg)', padding: '10px 12px' }}>
        <div style={{ fontSize: 22 }}>{em}</div><div className="caption" style={{ marginTop: 2 }}>{k}</div><div style={{ fontSize: 13, fontWeight: 800, color: 'var(--fg1)', marginTop: 2, wordBreak: 'keep-all' }}>{v}</div></div>)}
    </div>
    <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
      <button className="cta ghost press" style={{ flex: 1 }} onClick={onClose}>닫기</button>
      <button className="cta press" style={{ flex: 1.4 }} onClick={onFill}>이 기운 채우기</button>
    </div>
  </Sheet>;
}
function TodayScreen({ go, fills, addFill }) {
  const n = S().needFor(S().TODAY), rec = n.need, P = S().profile;
  const [sel, setSel] = React.useState(rec);
  const [friend, setFriend] = React.useState(null);
  const scroller = React.useRef(null);
  const [story, setStory] = React.useState(() => { const s = new URLSearchParams(location.search).get('story'); return s == null ? null : +s; });   // 개발용 ?story=1
  const charge = fills.length, full = charge >= FULL_CHARGE;
  const opened = Math.min(4, 1 + Math.floor(charge / 10));
  // 이번 주 7일 (오늘은 실제로 채운 양) + 꽉 채운 연속 날
  const week = S().history(7).map(d => d.fill === null ? { ...d, fill: charge } : d);
  let streak = 0; for (let k = week.length - 1; k >= 0; k--) { if (week[k].fill >= 30) streak++; else if (k === week.length - 1) continue; else break; }
  // 조각이 날아오는 출발점(말랑이 배 기준): 몸을 누르면 아래에서, 기운 칩을 누르면 그 칩에서
  const [from, setFrom] = React.useState({ x: 0, y: 150 });
  const add = () => { setFrom({ x: 0, y: 150 }); addFill(sel, 1); };
  const prev = React.useRef(charge);
  React.useEffect(() => { // 10꾹을 넘기면 만세 모션이 끝난 뒤 새 이야기가 열린다
    const a = Math.floor(prev.current / 10), b = Math.floor(charge / 10); prev.current = charge;
    if (b > a && b >= 1) setTimeout(() => setStory(Math.min(3, b)), 1300);
  }, [charge]);
  React.useEffect(() => { // 하루 처음 들어오면 인사부터
    const k = 'ohwa5-hello-' + dayKey(); let seen = false; try { seen = !!localStorage.getItem(k); localStorage.setItem(k, '1'); } catch (_) {}
    if (!seen && !new URLSearchParams(location.search).get('nohello')) setTimeout(() => setStory(0), 1100);
  }, []);
  // 2026-11-07: 기운 칩을 누르면 고르기만 하지 않고 바로 그 조각이 칩에서 배로 쏙 (예전엔 칩을 고른 뒤 몸을 다시 눌러야 했음)
  // 칩 가운데 x = 장면 가운데에서 (i-2)×66.8px, 칩은 말랑이 발밑보다 약 38px 아래 → 배 가운데 기준 약 +92px
  const pick = (e, i) => { setSel(e); setFrom({ x: (i - 2) * 66.8, y: 92 }); addFill(e, 1); feel('tick', { pitch: EL[e].pitch }); buzz(6); };
  const hello = new Date().getHours() < 12 ? '좋은 아침이에요' : new Date().getHours() < 18 ? '좋은 오후예요' : '편안한 저녁이에요';
  return <div style={fadeIn}>
    <div ref={scroller} style={{ position: 'absolute', inset: 0, overflowY: 'auto', overflowX: 'hidden', paddingBottom: 120, boxSizing: 'border-box' }}>
    {/* 위 줄 */}
    <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '6px 16px 0' }}>
      <div style={{ width: 44, height: 44, borderRadius: 22, background: 'var(--card)', boxShadow: 'var(--shadow-card)', display: 'grid', placeItems: 'center', flex: 'none' }}><img src={EL[P.dayMaster].piece} alt="" style={{ width: 28, height: 28, objectFit: 'contain' }} /></div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--fg3)' }}>{hello}</div>
        <div style={{ fontSize: 17, fontWeight: 800, color: 'var(--fg1)', letterSpacing: '-.03em' }}>{P.name ? `${P.name}님` : <OhwaLogo height={17} />}</div>
      </div>
      <ThemeButton />
      <button className="roundbtn press" aria-label="기분 진단" onClick={() => go('diagnose')}><Icon name="Heart" size={19} /></button>
      <button className="roundbtn dark press" aria-label="내 사주" onClick={() => go('saju')}><Icon name="Orbit" size={19} /></button>
    </div>
    {/* 장면 카드 */}
    <div className="scene" style={{ margin: '12px 16px 0', height: 452, background: sceneBg(sel), boxShadow: 'var(--shadow-card)' }}>
      <div style={{ position: 'absolute', left: 20, top: 18, right: 120 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--fg3)' }}>{fmtDate(S().TODAY)}</div>
        <div style={{ fontSize: 24, fontWeight: 800, letterSpacing: '-.045em', lineHeight: 1.25, color: INK, marginTop: 4 }}>오늘은 {EL[rec].ko} 기운을<br />채우면 좋아요</div>
      </div>
      {/* 말랑이 */}
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 78 }}>
        <Malangi h={232} parts={fills} el={sel} pedestal={false} onPress={add} onHold={add} enter flyFrom={from} />
      </div>
      {/* 기운 고르기 — 유리 칩 */}
      <div style={{ position: 'absolute', left: 12, right: 12, bottom: 14, display: 'flex', gap: 6 }}>
        {EL_ORDER.map((e, i) => { const on = e === sel;
          return <button key={e} className={'press' + (on ? '' : ' chipglass')} aria-label={`${EL[e].ko} 기운 채우기`} onClick={() => pick(e, i)} style={{ position: 'relative', flex: 1, height: 52, borderRadius: 18, cursor: 'pointer', fontFamily: 'var(--font-sans)',
            border: on ? 0 : undefined, background: on ? 'var(--card)' : undefined, boxShadow: on ? `0 0 0 2px ${INK}, 0 10px 18px -12px rgba(0,0,0,.4)` : 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 3, padding: 0, transition: 'transform 180ms var(--ease-jelly), box-shadow 120ms', transform: on ? 'translateY(-3px)' : 'none' }}>
            <img src={EL[e].piece} alt="" style={{ width: 26, height: 26, objectFit: 'contain' }} /><span style={{ fontSize: 13, fontWeight: 800, color: INK }}>{EL[e].ko}</span>
            {e === rec && <span style={{ position: 'absolute', top: -8, right: -2, height: 16, padding: '0 5px', borderRadius: 8, background: INK, color: 'var(--on-ink)', fontSize: 9.5, fontWeight: 800, lineHeight: '16px' }}>추천</span>}
          </button>; })}
      </div>
    </div>
    {/* 숫자 카드 두 장 */}
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, margin: '12px 16px 0' }}>
      <div className="card" style={{ padding: '14px 16px 12px', borderRadius: 28, position: 'relative' }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--fg2)' }}>채운 조각</div>
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: 6 }}><HalfGauge value={charge} el={sel} size={110} /></div>
        <div style={{ position: 'absolute', left: 0, right: 0, bottom: 14, textAlign: 'center' }}><span className="num" style={{ fontSize: 24, color: 'var(--fg1)' }}>{charge}</span><span style={{ fontSize: 12, fontWeight: 700, color: 'var(--fg3)' }}> / 30</span></div>
      </div>
      <div className="card press" onClick={() => setStory(Math.min(3, opened - 1))} style={{ padding: '14px 16px 12px', borderRadius: 28, position: 'relative', cursor: 'pointer' }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--fg2)' }}>오늘의 이야기</div>
        <div style={{ position: 'absolute', right: 10, top: 10, width: 32, height: 32, borderRadius: 16, background: 'var(--bg)', display: 'grid', placeItems: 'center', color: INK }}><Icon name="ArrowUpRight" size={16} /></div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 2, marginTop: 10 }}><span className="num" style={{ fontSize: 30, color: 'var(--fg1)' }}>{opened}</span><span style={{ fontSize: 13, fontWeight: 700, color: 'var(--fg3)' }}>/4 열림</span></div>
        <div style={{ display: 'flex', gap: 4, marginTop: 8 }}>{[0, 1, 2, 3].map(k => <i key={k} style={{ flex: 1, height: 6, borderRadius: 3, background: k < opened ? `var(--${rec})` : 'var(--line)' }} />)}</div>
      </div>
    </div>
    {/* 다섯 기운 친구들 — 오행 말랑이 */}
    <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', margin: '22px 20px 0' }}>
      <div className="h3">다섯 기운 친구들</div><div className="caption">눌러서 만나 보세요</div>
    </div>
    <div style={{ display: 'flex', gap: 10, overflowX: 'auto', padding: '10px 16px 6px', scrollSnapType: 'x mandatory', scrollPaddingLeft: 16 }}>
      {EL_ORDER.map((e, i) => { const c = P.count[e];
        return <div key={e} className="press" onClick={() => { setFriend(e); feel('pop', { pitch: EL[e].pitch }); }} style={{ flex: 'none', width: 118, height: 168, borderRadius: 28, position: 'relative', overflow: 'hidden', cursor: 'pointer', scrollSnapAlign: 'start',
          background: `linear-gradient(180deg, var(--scene-top) 0%, ${tint(e, 22)} 60%, ${tint(e, 45)} 100%)`, boxShadow: 'var(--shadow-card)' }}>
          {e === rec && <span style={{ position: 'absolute', left: 10, top: 10, height: 20, padding: '0 8px', borderRadius: 10, background: INK, color: 'var(--on-ink)', fontSize: 10.5, fontWeight: 800, lineHeight: '20px', zIndex: 2 }}>오늘 추천</span>}
          <div style={{ position: 'absolute', left: 0, right: 0, bottom: 40, display: 'flex', justifyContent: 'center' }}>
            <img src={EL[e].img} alt={`${EL[e].ko} 말랑이`} style={{ height: 104, animation: `ohwa-bob ${4.6 + i * .4}s ${-i * .9}s ease-in-out infinite`, '--r0': '0deg', filter: c ? 'none' : 'saturate(.55)' }} /></div>
          <div style={{ position: 'absolute', left: 12, right: 12, bottom: 10, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{ fontSize: 14, fontWeight: 800, color: INK }}>{EL[e].ko} <span className="hanja" style={{ fontSize: 12, opacity: .6 }}>{EL[e].hj}</span></span>
            <span style={{ display: 'flex', gap: 2 }}>{[0, 1, 2, 3].map(k => <i key={k} style={{ width: 6, height: 6, borderRadius: 3, background: k < c ? INK : 'var(--line)' }} />)}</span>
          </div>
        </div>; })}
    </div>
    {/* 이번 주 */}
    <div className="card" style={{ margin: '14px 16px 0', padding: '16px 14px 14px', borderRadius: 28 }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', padding: '0 4px' }}>
        <div className="h3">이번 주</div>
        <div style={{ fontSize: 12.5, fontWeight: 800, color: streak ? `var(--${rec}-ink)` : 'var(--fg3)' }}>{streak ? `${streak}일 연속 꽉 채웠어요` : '오늘부터 연속 기록 시작!'}</div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12 }}>
        {week.map((d, k) => { const today = k === week.length - 1, p = Math.min(1, d.fill / 30), R = 17, C = 2 * Math.PI * R;
          return <div key={k} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}>
            <span style={{ fontSize: 11, fontWeight: 800, color: today ? INK : 'var(--fg3)' }}>{WEEK[d.date.getDay()]}</span>
            <div style={{ position: 'relative', width: 42, height: 42 }}>
              <svg width="42" height="42" style={{ position: 'absolute', inset: 0, transform: 'rotate(-90deg)' }}>
                <circle cx="21" cy="21" r={R} fill="none" stroke="var(--line)" strokeWidth="4" />
                <circle cx="21" cy="21" r={R} fill="none" stroke={`var(--${d.need})`} strokeWidth="4" strokeLinecap="round" strokeDasharray={`${C * p} ${C}`} />
              </svg>
              {p >= 1 ? <img src={EL[d.need].piece} alt="" style={{ position: 'absolute', left: 10, top: 10, width: 22, height: 22, objectFit: 'contain' }} />
                : <span className="num" style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', fontSize: 10.5, color: 'var(--fg3)' }}>{d.fill || ''}</span>}
            </div>
            <span className="num" style={{ fontSize: 10.5, color: today ? INK : 'var(--fg4)' }}>{d.date.getDate()}</span>
          </div>; })}
      </div>
    </div>
    </div>
    {friend && <FriendSheet e={friend} rec={rec} onClose={() => setFriend(null)} onFill={() => { setSel(friend); setFriend(null); scroller.current && scroller.current.scrollTo({ top: 0, behavior: 'smooth' }); }} />}
    {story !== null && <TalkStory el={rec} charge={charge} start={story} onClose={() => setStory(null)} />}
  </div>;
}
Object.assign(window, { OnboardScreen, TodayScreen, Sheet, TalkStory, HalfGauge, fadeIn, fmtDate, WEEK, FULL_CHARGE, INK, sceneBg, tint });
