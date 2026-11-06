// 오화 — 오늘의 기분 진단 (01 고민 → 02 구체적으로·오늘 기운 → 03 오늘의 처방 → 04 채우기 → 05 기록)
// 처방 = 공감 한 줄 + 지금 해 볼 작은 일 3가지(기운에 맞춰) + 내 사주 기운 + 응원. 문구는 Content.js WORRY_DETAIL
// 고민마다 도움이 되는 기운: 사주 추천 기운과 함께 "이것도 좋아요"로 보여 준다
const WORRY = [
  ['관계', 'Heart', 'fire', '마음을 따뜻하게 여는'],
  ['일·공부', 'Briefcase', 'metal', '고르고 정리하는'],
  ['돈', 'Wallet', 'earth', '중심을 단단히 잡는'],
  ['몸', 'Activity', 'water', '쉬어 가며 흐르게 하는'],
  ['마음', 'CloudMoon', 'wood', '새싹처럼 다시 자라는'],
];
const STEPS = 5;
const TX = () => window.OhwaText;
const jo = (w, a, b) => { const c = w.charCodeAt(w.length - 1) - 0xAC00; return w + (c >= 0 && c % 28 ? a : b); };   // 받침에 맞는 조사
function Frame({ i, title, onBack, children, footer, stage, stageH = 0 }) {
  return <div style={fadeIn}>
    {stage && <>
      <div style={{ position: 'absolute', left: 0, right: 0, top: -50, height: 50, background: tint(stage, 10) }} />
      <div className="stage" style={{ position: 'absolute', left: 0, right: 0, top: 0, height: stageH, background: `var(--${stage})` }}>
        <div style={{ position: 'absolute', left: '50%', bottom: -120, width: 520, height: 220, marginLeft: -260, borderRadius: '50%', background: 'rgba(255,255,255,.28)' }} />
      </div>
    </>}
    <div style={{ position: 'relative', display: 'flex', alignItems: 'center', gap: 10, padding: '8px 16px 0' }}>
      <button className="press" aria-label="뒤로" onClick={onBack} style={{ width: 38, height: 38, borderRadius: 19, border: 0, background: stage ? 'var(--chip-bg)' : 'var(--card)', boxShadow: stage ? 'none' : 'var(--shadow-card)', color: INK, display: 'grid', placeItems: 'center', cursor: 'pointer', flex: 'none' }}><Icon name="ChevronLeft" size={20} /></button>
      <div style={{ flex: 1, fontSize: 15, fontWeight: 800, color: stage ? INK : 'var(--fg1)', letterSpacing: '-.03em' }}>{title}</div>
      <div style={{ display: 'flex', gap: 5 }}>{Array.from({ length: STEPS }).map((_, k) => <i key={k} style={{ width: k === i ? 18 : 6, height: 6, borderRadius: 3, background: k <= i ? INK : (stage ? 'rgba(255,255,255,.6)' : 'var(--fg4)'), transition: 'all 300ms' }} />)}</div>
    </div>
    <div style={{ position: 'absolute', left: 0, right: 0, top: 58, bottom: footer ? 96 : 14, overflowY: 'auto', overflowX: 'hidden', padding: '0 16px', boxSizing: 'border-box' }}>{children}</div>
    {footer && <div style={{ position: 'absolute', left: 16, right: 16, bottom: 26, display: 'flex', gap: 8 }}>{footer}</div>}
  </div>;
}
function DiagnoseScreen({ go, fills, addFill }) {
  const S_ = S(), n = S_.needFor(S_.TODAY), rec = n.need, P = S_.profile;
  const QS = new URLSearchParams(location.search);       // 개발용: ?screen=diagnose&step=2&worry=마음
  const [step, setStep] = React.useState(+QS.get('step') || 0);
  const [sel, setSel] = React.useState(QS.get('worry'));  // 고민 하나
  const [memo, setMemo] = React.useState('');
  const [sub, setSub] = React.useState(QS.get('sub'));     // 구체적인 상황
  const [energy, setEnergy] = React.useState(QS.get('energy') ? +QS.get('energy') : 1);   // 0 지쳤어요 · 1 그럭저럭 · 2 괜찮아요
  const [checked, setChecked] = React.useState([]);        // 해 본 작은 일
  const w = WORRY.find(x => x[0] === sel);
  const subs = w ? TX().WORRY_DETAIL[sel] : [];
  const D = subs.find(s => s.k === sub) || subs[0] || { e: '', a: [], c: '' };
  const also = w && w[2] !== rec ? w[2] : null;          // 고민에 도움 되는 기운 (추천과 다르면)
  const [fillEl, setFillEl] = React.useState(rec);
  const charge = fills.length;
  const next = () => { feel('pop', { pitch: EL[rec].pitch }); buzz(8); setStep(s => Math.min(STEPS - 1, s + 1)); };
  const back = () => step === 0 ? go('today') : setStep(s => s - 1);
  /* ---------- 01 고민 ---------- */
  if (step === 0) return <Frame key="0" i={0} title="오늘의 기분 진단" onBack={back}
    footer={<button className="cta press" style={{ flex: 1 }} disabled={!sel} onClick={next}>{sel ? '다음' : '하나 골라 주세요'}</button>}>
    <div style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-.045em', lineHeight: 1.25, color: 'var(--fg1)', margin: '18px 4px 0' }}>오늘 어떤 게<br />마음에 걸려요?</div>
    <div className="caption" style={{ margin: '6px 4px 0' }}>하나만 골라 주세요. 조금 더 물어보고, 오늘 해 볼 일을 알려 드릴게요.</div>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 10, marginTop: 20 }}>
      {WORRY.map(([k, ic, e], idx) => { const on = sel === k;
        return <button key={k} className="press" onClick={() => { if (sel !== k) { setSel(k); setSub(null); setChecked([]); } feel('tick', { pitch: EL[e].pitch }); buzz(5); }}
          style={{ gridColumn: idx === 4 ? 'span 2' : 'auto', height: 78, borderRadius: 24, border: 0, cursor: 'pointer', fontFamily: 'var(--font-sans)', display: 'flex', alignItems: 'center', gap: 12, padding: '0 16px',
            background: on ? INK : 'var(--card)', color: on ? 'var(--on-ink)' : 'var(--fg1)', boxShadow: on ? '0 14px 24px -14px rgba(34,31,38,.7)' : 'var(--shadow-card)', transition: 'all 300ms var(--ease-jelly)' }}>
          <span style={{ width: 42, height: 42, borderRadius: 15, display: 'grid', placeItems: 'center', background: on ? 'rgba(160,140,120,.25)' : `var(--${e}-2)`, color: on ? 'var(--on-ink)' : `var(--${e}-ink)`, flex: 'none' }}><Icon name={ic} size={20} /></span>
          <span style={{ fontSize: 16, fontWeight: 800 }}>{k}</span>
        </button>; })}
    </div>
  </Frame>;
  /* ---------- 02 구체적으로 — 어떤 상황인지 + 오늘 기운 ---------- */
  if (step === 1) return <Frame key="1" i={1} title="오늘의 기분 진단" onBack={back}
    footer={<button className="cta press" style={{ flex: 1 }} disabled={!sub} onClick={next}>{sub ? '오늘의 처방 보기' : '하나 골라 주세요'}</button>}>
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, height: 28, padding: '0 12px', borderRadius: 999, margin: '16px 4px 0', background: `var(--${w[2]}-2)`, color: `var(--${w[2]}-ink)`, fontSize: 12.5, fontWeight: 800 }}>
      <Icon name={w[1]} size={14} />{sel}</div>
    <div style={{ fontSize: 26, fontWeight: 800, letterSpacing: '-.045em', lineHeight: 1.25, color: 'var(--fg1)', margin: '10px 4px 0' }}>조금 더 알려 줄래요?</div>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 8, marginTop: 16 }}>
      {subs.map(s => { const on = sub === s.k;
        return <button key={s.k} className="press" onClick={() => { setSub(s.k); setChecked([]); feel('tick'); buzz(5); }}
          style={{ minHeight: 60, borderRadius: 20, border: 0, cursor: 'pointer', fontFamily: 'var(--font-sans)', padding: '10px 14px', textAlign: 'left', fontSize: 15, fontWeight: 800, wordBreak: 'keep-all',
            background: on ? INK : 'var(--card)', color: on ? 'var(--on-ink)' : 'var(--fg1)', boxShadow: on ? '0 12px 22px -14px rgba(34,31,38,.7)' : 'var(--shadow-card)', transition: 'all 300ms var(--ease-jelly)' }}>{s.k}</button>; })}
    </div>
    <div style={{ fontSize: 15, fontWeight: 800, color: 'var(--fg1)', margin: '24px 4px 0' }}>오늘 내 기운은</div>
    <div style={{ display: 'flex', gap: 4, padding: 4, marginTop: 8, borderRadius: 999, background: 'var(--line)' }}>
      {TX().ENERGY.map((en, k) => { const on = energy === k;
        return <button key={en.k} className="press" onClick={() => { setEnergy(k); feel('tick', { pitch: .9 + k * .15 }); }} style={{ flex: 1, height: 44, border: 0, borderRadius: 999, cursor: 'pointer', fontFamily: 'var(--font-sans)', fontSize: 14, fontWeight: 800,
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5, background: on ? 'var(--card)' : 'transparent', color: on ? 'var(--fg1)' : 'var(--fg3)', boxShadow: on ? 'var(--shadow-card)' : 'none' }}>
          <Icon name={en.icon} size={16} />{en.k}</button>; })}
    </div>
    <input value={memo} onChange={e => setMemo(e.target.value)} placeholder="한 줄 메모 (선택)" maxLength={40}
      style={{ width: '100%', boxSizing: 'border-box', marginTop: 14, height: 52, borderRadius: 20, border: '1px solid var(--card-line)', background: 'var(--card)', boxShadow: 'var(--shadow-card)', padding: '0 18px', fontSize: 14, fontWeight: 600, color: 'var(--fg1)', outline: 'none', fontFamily: 'inherit' }} />
  </Frame>;

  /* ---------- 03 오늘의 처방 — 공감 한 줄 · 지금 해 볼 작은 일 3가지 · 내 사주 기운 · 응원 ---------- */
  if (step === 2) return <Frame key="2" i={2} title="오늘의 처방" onBack={back} stage={rec} stageH={330}
    footer={<button className="cta press" style={{ flex: 1 }} onClick={() => { setFillEl(rec); next(); }}>말랑이 채우러 가기</button>}>
    <div style={{ color: INK, padding: '12px 6px 0' }}>
      <div style={{ fontSize: 13, fontWeight: 700, opacity: .72 }}>{sel} · {sub}</div>
      <div style={{ fontSize: 23, fontWeight: 800, letterSpacing: '-.04em', lineHeight: 1.3, marginTop: 4, wordBreak: 'keep-all', maxWidth: 300 }}>{D.e}</div>
    </div>
    <div style={{ position: 'relative', height: 178 }}>
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0 }}>
        <Malangi h={150} pedestal={false} el={rec} pose={['sit', 'wave', 'cheer'][energy]} sleepy={false} />
      </div>
    </div>
    {/* 지금 해 볼 작은 일 */}
    <div className="card" style={{ marginTop: 26, padding: '16px 14px 8px' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', padding: '0 4px' }}>
        <div className="h3">지금 해 볼 작은 일</div><div className="caption">{TX().ENERGY[energy].note}</div>
      </div>
      <div style={{ marginTop: 6 }}>
        {D.a.map((t, k) => { const on = checked.includes(k), dim = energy === 0 && k > 0 && !on;
          return <div key={k} className="press" onClick={() => { setChecked(c => c.includes(k) ? c.filter(x => x !== k) : [...c, k]); feel('tick', { pitch: 1 + k * .1 }); buzz(6); }}
            style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '11px 4px', borderTop: k ? '1px solid var(--line)' : 0, cursor: 'pointer', opacity: dim ? .55 : 1 }}>
            <span style={{ width: 26, height: 26, borderRadius: 13, flex: 'none', display: 'grid', placeItems: 'center', background: on ? `var(--${rec})` : 'transparent', border: on ? 0 : '2px solid var(--fg4)', color: '#fff', transition: 'all 260ms var(--ease-jelly)', transform: on ? 'scale(1.08)' : 'none' }}>
              {on && <Icon name="Check" size={15} stroke={3} />}</span>
            <span style={{ flex: 1, fontSize: 14.5, fontWeight: 700, color: 'var(--fg1)', textDecoration: on ? 'line-through' : 'none', textDecorationColor: 'var(--fg3)', wordBreak: 'keep-all' }}>{t}</span>
          </div>; })}
      </div>
    </div>
    {/* 내 사주로 보면 */}
    <div className="card" style={{ marginTop: 10, padding: '14px 16px', display: 'flex', gap: 12, alignItems: 'flex-start' }}>
      <img src={EL[rec].piece} alt="" style={{ width: 40, height: 40, objectFit: 'contain', flex: 'none', marginTop: 2 }} />
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--fg1)' }}>내 사주로 보면, 오늘은 {EL[rec].ko} 기운</div>
        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--fg2)', marginTop: 3, lineHeight: 1.5, wordBreak: 'keep-all' }}>
          {EL[rec].ko} 기운이 {P.count[rec]}개뿐이라, {jo(TX().EL_TEXT[rec].keyword, '이', '가')} 필요할 때예요. {TX().EL_TEXT[rec].tip}도 좋아요.
          {also && <> {sel} 고민엔 {w[3]} <b style={{ color: `var(--${also}-ink)` }}>{EL[also].ko} 기운</b>도 도와줘요.</>}
        </div>
      </div>
    </div>
    {/* 응원 한마디 */}
    <div style={{ marginTop: 10, borderRadius: 24, padding: '16px 18px', background: `linear-gradient(135deg, ${tint(rec, 14)}, ${tint(rec, 32)})`, color: INK }}>
      <div style={{ fontSize: 12, fontWeight: 800, opacity: .7 }}>말랑이가 하고 싶은 말</div>
      <div style={{ fontSize: 16, fontWeight: 800, marginTop: 4, lineHeight: 1.45, letterSpacing: '-.02em', wordBreak: 'keep-all' }}>“{D.c}”</div>
    </div>
    {D.care && energy === 0 && <div style={{ marginTop: 10, borderRadius: 18, padding: '11px 14px', background: 'var(--card)', border: '1px solid var(--card-line)', fontSize: 12.5, fontWeight: 600, color: 'var(--fg2)', lineHeight: 1.5, wordBreak: 'keep-all' }}>{TX().CARE_LINE}</div>}
  </Frame>;
  /* ---------- 04 채우기 ---------- */
  if (step === 3) return <Frame key="3" i={3} title="기운 채우기" onBack={back} stage={fillEl} stageH={520}
    footer={<button className="cta press" style={{ flex: 1 }} onClick={next}>{charge >= 30 ? '다 채웠어요' : '오늘은 여기까지'}</button>}>
    <div style={{ display: 'flex', alignItems: 'flex-end', color: INK, padding: '14px 6px 0' }}>
      <div style={{ flex: 1, fontSize: 24, fontWeight: 800, letterSpacing: '-.045em', lineHeight: 1.25 }}>말랑이를 꾹<br />눌러 채워요</div>
      <div className="num" style={{ fontSize: 34, letterSpacing: '-.04em' }}>{charge}<span style={{ fontSize: 15, opacity: .5 }}>/30</span></div>
    </div>
    <div style={{ position: 'relative', height: 300, marginTop: 8 }}>
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0 }}>
        <Malangi h={250} pedestal={false} el={fillEl} parts={fills} onPress={() => addFill(fillEl)} onHold={() => addFill(fillEl)} />
      </div>
    </div>
    <div style={{ display: 'flex', justifyContent: 'center', gap: 10, marginTop: 14 }}>
      {[rec, also].filter(Boolean).map(e => { const on = e === fillEl;
        return <button key={e} className="press" onClick={() => { setFillEl(e); feel('tick', { pitch: EL[e].pitch }); }} style={{ height: 46, padding: '0 16px 0 10px', borderRadius: 999, border: 0, cursor: 'pointer', fontFamily: 'var(--font-sans)',
          background: on ? 'var(--card)' : 'var(--chip-bg-soft)', boxShadow: on ? `0 0 0 2.5px ${INK}` : 'none', display: 'flex', alignItems: 'center', gap: 6, fontWeight: 800, fontSize: 14, color: INK }}>
          <img src={EL[e].piece} alt="" style={{ width: 28, height: 28, objectFit: 'contain' }} />{EL[e].ko} 기운{e === rec ? ' · 추천' : ''}</button>; })}
    </div>
    <div style={{ textAlign: 'center', marginTop: 34, fontSize: 13, fontWeight: 700, color: 'var(--fg3)', lineHeight: 1.6 }}>톡 누르면 한 개 · 꾸우욱 누르고 있으면 계속<br />고른 기운의 조각이 배 속에 쌓여요</div>
  </Frame>;
  /* ---------- 05 기록 ---------- */
  const week = S_.history(7);
  const counts = EL_ORDER.map(e => [e, fills.filter(x => x === e).length]).filter(([, c]) => c);
  return <Frame key="4" i={4} title="오늘 기록" onBack={() => setStep(3)}
    footer={<>
      <button className="cta ghost press" style={{ flex: 1 }} onClick={() => go('records')}>기록 보기</button>
      <button className="cta press" style={{ flex: 1 }} onClick={() => go('today')}>오늘로</button>
    </>}>
    <div className="card" style={{ marginTop: 14, padding: '22px 18px 18px', textAlign: 'center' }}>
      <div className="caption">{fmtDate(S_.TODAY)} · {sel}{sub ? ' · ' + sub : ''}</div>
      <div style={{ position: 'relative', height: 150, marginTop: 8 }}><div style={{ position: 'absolute', left: 0, right: 0, bottom: 0 }}><Malangi h={150} pedestal={false} parts={fills} idle /></div></div>
      <div className="h1" style={{ marginTop: 10 }}>{charge}꾹 채웠어요</div>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginTop: 10, flexWrap: 'wrap' }}>
        {counts.length ? counts.map(([e, c]) => <span key={e} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, height: 30, padding: '0 11px 0 6px', borderRadius: 999, background: `var(--${e}-2)`, color: `var(--${e}-ink)`, fontSize: 12.5, fontWeight: 800 }}>
          <img src={EL[e].piece} alt="" style={{ width: 20, height: 20, objectFit: 'contain' }} />{EL[e].ko} {c}</span>) : <span className="caption">아직 채운 조각이 없어요</span>}
      </div>
      {sub && <div style={{ marginTop: 12, fontSize: 13.5, fontWeight: 700, color: 'var(--fg2)' }}>작은 일 {checked.length}/3 해 봤어요{checked.length ? ' · 잘했어요!' : ' · 내일 하나만 해 봐요'}</div>}
      {sub && <div style={{ marginTop: 8, fontSize: 14, fontWeight: 800, color: 'var(--fg1)', wordBreak: 'keep-all' }}>“{D.c}”</div>}
      {memo && <div style={{ marginTop: 12, borderRadius: 16, background: 'var(--bg)', padding: '10px 14px', fontSize: 13, fontWeight: 600, color: 'var(--fg2)' }}>“{memo}”</div>}
    </div>
    <div className="card" style={{ marginTop: 10, padding: '14px 12px' }}>
      <div style={{ display: 'flex', gap: 6 }}>
        {week.map((h, k) => { const today = k === week.length - 1, pct = Math.min(1, (h.fill === null ? charge : h.fill) / 30);
          return <div key={k} style={{ flex: 1, height: 70, borderRadius: 16, position: 'relative', overflow: 'hidden', background: 'var(--bg)', boxShadow: today ? `0 0 0 2px ${INK}` : 'none' }}>
            <i style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: `${pct * 100}%`, background: `var(--${h.need})` }} />
            <span style={{ position: 'absolute', left: 0, right: 0, top: 6, textAlign: 'center', fontSize: 10, fontWeight: 800, color: 'var(--fg2)' }}>{WEEK[h.date.getDay()]}</span>
          </div>; })}
      </div>
      <div className="caption" style={{ marginTop: 8, textAlign: 'center' }}>지난 7일 · 채운 만큼 차올라요</div>
    </div>
  </Frame>;
}
Object.assign(window, { DiagnoseScreen, WORRY });
