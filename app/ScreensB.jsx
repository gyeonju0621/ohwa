// 오화 — Saju · Records · Custom
const scrollWrap = { ...fadeIn, overflowY: 'auto', paddingBottom: 130 };
/* ---------- 04 내 사주 자세히 — 나를 뜻하는 글자 · 여덟 글자 · 다섯 기운 · 상생 · 사주 사전 ---------- */
function SajuScreen({ go }) {
  const P = S().profile, C = P.count, n = S().needFor(S().TODAY), TX = window.OhwaText;
  const dm = P.dayMaster, max = Math.max(...Object.values(C));
  const [col, setCol] = React.useState(1);               // 고른 기둥 (기본 = 일주)
  const lackFirst = EL_ORDER.find(e => C[e] === 0) || n.need;
  const [elOpen, setElOpen] = React.useState(lackFirst);
  const [faq, setFaq] = React.useState(0);
  const [tab, setTab] = React.useState('me');
  const pick = P.pillars[col], pinfo = TX.PILLAR[pick.label];
  const ink = INK;
  const title = (t, sub) => <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', padding: '0 4px' }}>
    <div className="h3">{t}</div>{sub && <div className="caption">{sub}</div>}</div>;
  return <div style={{ ...fadeIn, overflowY: 'auto', paddingBottom: 130 }}>
    {/* 머리 */}
    <div style={{ display: 'flex', alignItems: 'flex-end', padding: '12px 22px 0' }}>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--fg3)' }}>{P.birth} · {P.time} · {P.calendar}</div>
        <div className="h1" style={{ marginTop: 4 }}>{P.display}의 사주</div>
      </div>
      <button className="press" onClick={() => go('onboard')} style={{ height: 34, padding: '0 13px', borderRadius: 999, border: 0, background: 'var(--card)', boxShadow: 'var(--shadow-card)', color: 'var(--fg2)', fontWeight: 700, fontSize: 12.5, fontFamily: 'var(--font-sans)', cursor: 'pointer' }}>다시 입력</button>
    </div>
    {/* 탭 — 한 번에 하나만 */}
    <div style={{ display: 'flex', gap: 4, padding: 4, margin: '14px 16px 0', borderRadius: 999, background: 'var(--line)' }}>
      {[['me', '나'], ['five', '다섯 기운'], ['dict', '사주 사전']].map(([k, l]) => <button key={k} className="press" onClick={() => { setTab(k); feel('tick'); }}
        style={{ flex: 1, height: 38, border: 0, borderRadius: 999, cursor: 'pointer', fontFamily: 'var(--font-sans)', fontWeight: 800, fontSize: 14, background: tab === k ? 'var(--card)' : 'transparent', color: tab === k ? 'var(--fg1)' : 'var(--fg3)', boxShadow: tab === k ? 'var(--shadow-card)' : 'none' }}>{l}</button>)}
    </div>
    {tab === 'me' && <>
    {/* 나를 뜻하는 글자 — 행택 같은 색 블록 */}
    <div style={{ position: 'relative', margin: '14px 16px 0', borderRadius: 30, background: `linear-gradient(135deg, var(--scene-top) 0%, ${tint(dm, 30)} 45%, ${tint(dm, 70)} 100%)`, boxShadow: 'var(--shadow-card)', color: ink, padding: '20px 20px 22px', overflow: 'hidden', minHeight: 150 }}>
      <img src={BODY} alt="" style={{ position: 'absolute', right: 6, bottom: -26, height: 150, transform: 'rotate(-6deg)' }} />
      <img src={EL[dm].piece} alt="" style={{ position: 'absolute', right: 86, bottom: 70, width: 38, animation: 'ohwa-bob 3s ease-in-out infinite' }} />
      <div style={{ fontSize: 13, fontWeight: 800, opacity: .7 }}>나를 뜻하는 글자 · 일간</div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 10 }}>
        <div style={{ width: 66, height: 66, borderRadius: 22, background: 'var(--card)', display: 'grid', placeItems: 'center', boxShadow: '0 8px 16px -10px rgba(0,0,0,.4)' }}>
          <span className="hanja" style={{ fontSize: 36, color: ink, lineHeight: 1 }}>{P.dayStem}</span></div>
        <div>
          <div style={{ fontSize: 24, fontWeight: 800, letterSpacing: '-.04em' }}>{TX.DAY_STEM[P.dayStem].pic}</div>
          <div style={{ fontSize: 13, fontWeight: 700, opacity: .75, marginTop: 2 }}>{S().STEM[P.dayStem][0]} · {EL[dm].ko}({EL[dm].hj}) 기운</div>
        </div>
      </div>
      <div style={{ fontSize: 14, fontWeight: 700, lineHeight: 1.5, marginTop: 14, maxWidth: 230, wordBreak: 'keep-all' }}>{TX.DAY_STEM[P.dayStem].line}</div>
    </div>
    {/* 여덟 글자 */}
    <div className="card" style={{ margin: '12px 16px 0', padding: '18px 14px 14px' }}>
      {title(P.letters === 8 ? '여덟 글자' : '여섯 글자', '기둥을 눌러 보세요')}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 6, marginTop: 12 }}>
        {P.pillars.map((p, i) => {
          const on = i === col, info = TX.PILLAR[p.label];
          return <button key={i} className="press" onClick={() => { setCol(i); feel('tick'); }} style={{ border: 0, padding: '8px 0 10px', borderRadius: 22, cursor: 'pointer', fontFamily: 'var(--font-sans)',
            background: on ? 'var(--bg)' : 'transparent', boxShadow: on ? 'inset 0 0 0 1.5px var(--fg1)' : 'none', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 12, fontWeight: 800, color: on ? 'var(--fg1)' : 'var(--fg3)' }}>{info.title}<span style={{ fontWeight: 600 }}> · {info.sub}</span></span>
            {p.stem ? <><HanjaTile ch={p.stem} el={S().STEM[p.stem][1]} read={S().STEM[p.stem][0]} size={54} /><HanjaTile ch={p.branch} el={S().BRANCH[p.branch][1]} read={S().BRANCH[p.branch][0]} size={54} /></>
              : [0, 1].map(k => <div key={k} style={{ width: 54, height: 54, borderRadius: 17, border: '1.5px dashed var(--fg4)', display: 'grid', placeItems: 'center', color: 'var(--fg3)', fontWeight: 800 }}>?</div>)}
          </button>;
        })}
      </div>
      <div key={col} style={{ marginTop: 10, borderRadius: 20, background: 'var(--bg)', padding: '13px 15px', animation: 'ohwa-in 260ms both' }}>
        <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--fg1)' }}>{pinfo.title} — {pinfo.sub}</div>
        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--fg2)', marginTop: 4, lineHeight: 1.5, wordBreak: 'keep-all' }}>{pinfo.line}</div>
        {pick.stem ? <div style={{ display: 'flex', gap: 6, marginTop: 10, flexWrap: 'wrap' }}>
          {[['위', pick.stem, S().STEM], ['아래', pick.branch, S().BRANCH]].map(([k, ch, M]) => <span key={k} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, height: 28, padding: '0 10px', borderRadius: 999, background: `var(--${M[ch][1]}-2)`, color: `var(--${M[ch][1]}-ink)`, fontSize: 12, fontWeight: 800 }}>
            {k} <span className="hanja">{ch}</span>({M[ch][0]}) · {EL[M[ch][1]].ko}</span>)}
        </div> : <div className="caption" style={{ marginTop: 8 }}>태어난 시간을 넣으면 이 기둥도 채워져요.</div>}
      </div>
    </div>
    </>}
    {tab === 'five' && <>
    {/* 다섯 기운 */}
    <div className="card" style={{ margin: '12px 16px 0', padding: '18px 14px 10px' }}>
      {title('다섯 기운', `${P.letters === 8 ? '여덟' : '여섯'} 글자 중`)}
      <div style={{ marginTop: 8 }}>
        {EL_ORDER.map(e => {
          const c = C[e], on = elOpen === e, t = TX.EL_TEXT[e];
          return <div key={e} style={{ borderTop: '1px solid var(--line)' }}>
            <div className="press" onClick={() => { setElOpen(on ? null : e); feel('tick', { pitch: EL[e].pitch }); }} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 4px', cursor: 'pointer' }}>
              <img src={EL[e].piece} alt="" style={{ width: 34, height: 34, objectFit: 'contain', filter: c ? 'none' : 'grayscale(.8)', opacity: c ? 1 : .5 }} />
              <div style={{ width: 52, flex: 'none' }}><div style={{ fontSize: 14, fontWeight: 800, color: 'var(--fg1)' }}>{EL[e].ko} <span className="hanja" style={{ fontSize: 12, color: `var(--${e}-ink)` }}>{EL[e].hj}</span></div><div style={{ fontSize: 11, fontWeight: 600, color: 'var(--fg3)' }}>{t.name}</div></div>
              <div style={{ flex: 1, height: 12, borderRadius: 9, background: 'var(--line)', overflow: 'hidden' }}><div style={{ width: `${c / Math.max(4, max) * 100}%`, height: '100%', borderRadius: 9, background: `var(--${e})`, transition: 'width 500ms var(--ease-jelly)' }} /></div>
              <span className="num" style={{ width: 16, textAlign: 'right', fontSize: 15, color: c ? 'var(--fg1)' : 'var(--fg4)' }}>{c}</span>
              <span style={{ width: 54, display: 'flex', justifyContent: 'flex-end', flex: 'none' }}>{c === 0 ? <span style={{ fontSize: 10.5, fontWeight: 800, color: `var(--${e}-ink)`, background: `var(--${e}-2)`, borderRadius: 999, padding: '3px 7px' }}>비어 있음</span>
                : c === max ? <span style={{ fontSize: 10.5, fontWeight: 800, color: 'var(--fg2)', background: 'var(--line)', borderRadius: 999, padding: '3px 7px' }}>넉넉</span> : null}</span>
            </div>
            {on && <div style={{ margin: '0 4px 12px', borderRadius: 18, background: `var(--${e}-2)`, padding: '12px 14px', animation: 'ohwa-in 240ms both' }}>
              <div style={{ fontSize: 13.5, fontWeight: 800, color: `var(--${e}-ink)` }}>{t.keyword} · {t.like}</div>
              <div style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--fg2)', marginTop: 6, lineHeight: 1.5, wordBreak: 'keep-all' }}>이럴 때 채워요 — {t.fill}<br />이렇게 채워요 — {t.tip}</div>
            </div>}
          </div>;
        })}
      </div>
    </div>
    {/* 상생 */}
    <div className="card" style={{ margin: '12px 16px 0', padding: '18px 14px 16px' }}>
      {title('기운은 서로 키워 줘요', '상생')}
      <div style={{ position: 'relative', height: 220, marginTop: 4 }}>
        <svg width="220" height="220" viewBox="-110 -110 220 220" style={{ position: 'absolute', left: '50%', top: 0, marginLeft: -110 }}>
          <defs><marker id="ar" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="7" markerHeight="7" orient="auto"><path d="M0 1 L8 5 L0 9 Z" fill="var(--fg3)" /></marker></defs>
          {EL_ORDER.map((e, i) => { const a0 = (-90 + i * 72 + 20) * Math.PI / 180, a1 = (-90 + (i + 1) * 72 - 20) * Math.PI / 180, r = 78;
            return <path key={e} d={`M ${Math.cos(a0) * r} ${Math.sin(a0) * r} A ${r} ${r} 0 0 1 ${Math.cos(a1) * r} ${Math.sin(a1) * r}`} fill="none" stroke="var(--fg4)" strokeWidth="2.5" strokeDasharray="1 6" strokeLinecap="round" markerEnd="url(#ar)" />; })}
        </svg>
        {EL_ORDER.map((e, i) => { const a = (-90 + i * 72) * Math.PI / 180;
          return <div key={e} style={{ position: 'absolute', left: `calc(50% + ${Math.cos(a) * 78}px)`, top: 110 + Math.sin(a) * 78, transform: 'translate(-50%,-50%)', width: 52, height: 52, borderRadius: 18, background: `var(--${e}-2)`, display: 'grid', placeItems: 'center' }}>
            <img src={EL[e].piece} alt={EL[e].ko} style={{ width: 34, height: 34, objectFit: 'contain' }} /></div>; })}
        <div style={{ position: 'absolute', left: '50%', top: 110, transform: 'translate(-50%,-50%)', textAlign: 'center' }}>
          <img src={BODY} alt="" style={{ height: 52 }} />
        </div>
      </div>
      <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--fg2)', lineHeight: 1.55, textAlign: 'center', wordBreak: 'keep-all', padding: '0 6px' }}>나무는 불을 키우고, 불은 흙을, 흙은 쇠를, 쇠는 물을, 물은 다시 나무를 키워요.</div>
    </div>
    {/* 오늘 */}
    <div className="press" onClick={() => go('today')} style={{ margin: '12px 16px 0', borderRadius: 26, background: `linear-gradient(90deg, ${tint(n.need, 25)}, ${tint(n.need, 60)})`, color: ink, padding: '14px 16px', display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}>
      <div style={{ width: 52, height: 52, borderRadius: 18, background: 'var(--chip-bg)', display: 'grid', placeItems: 'center', flex: 'none' }}><img src={EL[n.need].piece} alt="" style={{ width: 34, height: 34, objectFit: 'contain' }} /></div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 12.5, fontWeight: 700, opacity: .75 }}>오늘 <span className="hanja">{n.pillar.stem}{n.pillar.branch}</span>일</div>
        <div style={{ fontSize: 17, fontWeight: 800, marginTop: 2 }}>오늘은 {EL[n.need].ko} 기운을 채우면 좋아요</div>
      </div>
      <Icon name="ChevronRight" size={20} />
    </div>
    </>}
    {tab === 'dict' && <>
    {/* 사주 사전 */}
    <div className="card" style={{ margin: '12px 16px 0', padding: '18px 14px 8px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '0 4px' }}>
        <img src={BODY} alt="" style={{ height: 30 }} /><div className="h3" style={{ flex: 1 }}>말랑이의 사주 사전</div>
      </div>
      <div style={{ marginTop: 8 }}>
        {TX.FAQ.map((f, i) => { const on = faq === i, e = EL_ORDER[i % 5];
          return <div key={i} style={{ borderTop: '1px solid var(--line)' }}>
            <div className="press" onClick={() => { setFaq(on ? -1 : i); feel('tick'); }} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '12px 4px', cursor: 'pointer' }}>
              <span style={{ width: 26, height: 26, borderRadius: 9, background: `var(--${e}-2)`, color: `var(--${e}-ink)`, display: 'grid', placeItems: 'center', fontSize: 13, fontWeight: 900, flex: 'none' }}>Q</span>
              <span style={{ flex: 1, fontSize: 14, fontWeight: 800, color: 'var(--fg1)' }}>{f.q}</span>
              <span style={{ transform: on ? 'rotate(90deg)' : 'none', transition: 'transform 300ms var(--ease-jelly)', color: 'var(--fg3)', display: 'flex' }}><Icon name="ChevronRight" size={18} /></span>
            </div>
            {on && <div style={{ display: 'flex', gap: 8, padding: '0 4px 14px', animation: 'ohwa-in 240ms both' }}>
              <span style={{ width: 26, flex: 'none' }} />
              <div style={{ flex: 1, borderRadius: '6px 18px 18px 18px', background: 'var(--bg)', padding: '11px 13px', fontSize: 13, fontWeight: 600, color: 'var(--fg2)', lineHeight: 1.6, wordBreak: 'keep-all' }}>{f.a}</div>
            </div>}
          </div>; })}
      </div>
    </div>
    <div className="caption" style={{ textAlign: 'center', margin: '14px 24px 0' }}>오화는 재미와 마음 돌봄을 위한 서비스예요</div>
    </>}
  </div>;
}
/* ---------- 05 Records — 숫자 3개 · 달력 · 고른 날(자세 + 그날 레시피) · 이번 달 채운 기운 ---------- */
function RecordsScreen({ charge, fills = [] }) {
  const P = S().profile;
  const H = S().history(35).map(h => h.fill === null ? { ...h, fill: charge, today: true } : h);
  const T0 = S().TODAY;
  const month = H.filter(h => h.date.getMonth() === T0.getMonth());
  const [sel, setSel] = React.useState(month.length - 1);
  const first = new Date(T0.getFullYear(), T0.getMonth(), 1).getDay();
  const days = new Date(T0.getFullYear(), T0.getMonth() + 1, 0).getDate();
  const byDay = Object.fromEntries(month.map((h, i) => [h.date.getDate(), [h, i]]));
  const h = month[sel];
  const fullDays = month.filter(x => x.fill >= 30).length;
  let streak = 0; for (let k = H.length - 1; k >= 0; k--) { if (H[k].fill >= 30) streak++; else if (H[k].today) continue; else break; }
  const pieces = month.reduce((s, x) => s + x.fill, 0);
  // 이번 달 기운별 조각 수 (오늘은 실제로 고른 기운, 지난날은 그날 필요했던 기운)
  const mix = Object.fromEntries(EL_ORDER.map(e => [e, 0]));
  month.forEach(x => { if (x.today) fills.forEach(f => mix[f]++); else mix[x.need] += x.fill; });
  const mixTotal = Object.values(mix).reduce((a, b) => a + b, 0) || 1;
  const topEl = EL_ORDER.slice().sort((a, b) => mix[b] - mix[a])[0];
  const r = T().recipe(h.need, h.date, P);
  const pose = h.fill >= 30 ? 'cheer' : h.fill > 0 ? 'wave' : 'sit';
  const stat = (k, v, unit, icon) => <div className="card" style={{ flex: 1, borderRadius: 24, padding: '12px 12px 10px' }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, fontWeight: 700, color: 'var(--fg2)' }}><Icon name={icon} size={14} />{k}</div>
    <div style={{ marginTop: 6 }}><span className="num" style={{ fontSize: 24, color: 'var(--fg1)' }}>{v}</span><span style={{ fontSize: 12, fontWeight: 700, color: 'var(--fg3)' }}> {unit}</span></div>
  </div>;
  return <div style={scrollWrap}>
    <div style={{ position: 'relative', padding: '12px 22px 0' }}>
      <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--fg3)' }}>{T0.getFullYear()}</div><div className="h1" style={{ marginTop: 2 }}>{T0.getMonth() + 1}월 기록</div>
    </div>
    {/* 숫자 3개 */}
    <div style={{ display: 'flex', gap: 8, margin: '12px 16px 0' }}>
      {stat('꽉 채운 날', fullDays, '일', 'CalendarCheck')}{stat('연속', streak, '일', 'Flame')}{stat('모은 조각', pieces, '개', 'Sparkles')}
    </div>
    {/* 달력 */}
    <div className="card" style={{ position: 'relative', margin: '10px 16px 0', borderRadius: 30, padding: '14px 12px 12px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', rowGap: 6, justifyItems: 'center' }}>
        {WEEK.map(w => <span key={w} className="caption" style={{ paddingBottom: 4 }}>{w}</span>)}
        {Array.from({ length: first }).map((_, i) => <span key={'e' + i} />)}
        {Array.from({ length: days }).map((_, i) => {
          const d = i + 1, rr = byDay[d], on = rr && rr[1] === sel, today = d === T0.getDate();
          if (!rr) return <div key={d} style={{ width: 40, height: 40, display: 'grid', placeItems: 'center', fontSize: 13, fontWeight: 600, color: 'var(--fg4)' }} className="num">{d}</div>;
          const [x] = rr, pct = Math.min(1, x.fill / 30);
          return <button key={d} className="press" onClick={() => { setSel(rr[1]); feel('tick', { pitch: EL[x.need].pitch }); }}
            style={{ width: 40, height: 40, borderRadius: 15, border: 0, padding: 0, position: 'relative', overflow: 'hidden', background: `var(--${x.need}-2)`, cursor: 'pointer',
              boxShadow: on ? `0 0 0 2.5px ${INK}` : today ? `0 0 0 2px var(--${x.need})` : 'none' }}>
            <i style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: `${pct * 100}%`, background: `var(--${x.need})`, opacity: .85, transition: 'height 500ms var(--ease-jelly)' }} />
            {pct >= 1 ? <img src={EL[x.need].piece} alt="" style={{ position: 'relative', width: 22, height: 22, objectFit: 'contain', filter: 'drop-shadow(0 1px 0 #fff)' }} />
              : <span className="num" style={{ position: 'relative', fontSize: 12.5, color: `var(--${x.need}-ink)` }}>{d}</span>}
          </button>;
        })}
      </div>
    </div>
    {/* 고른 날 */}
    <div key={sel} className="card" style={{ position: 'relative', margin: '10px 16px 0', borderRadius: 30, padding: 14, animation: 'ohwa-in 300ms both' }}>
      <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
        <div style={{ width: 92, height: 108, borderRadius: 24, background: `linear-gradient(180deg, var(--scene-top), ${tint(h.need, 40)})`, position: 'relative', overflow: 'hidden', flex: 'none' }}>
          <div style={{ position: 'absolute', left: 0, right: 0, bottom: 4, display: 'flex', justifyContent: 'center' }}>
            <img src={POSES[pose].src} alt="" style={{ height: pose === 'sit' ? 86 : 96, animation: 'ohwa-posepop 420ms var(--ease-jelly) both' }} /></div>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div className="caption">{fmtDate(h.date)} · <span className="hanja">{h.pillar.stem}{h.pillar.branch}</span>일</div>
          <div className="h3" style={{ marginTop: 3 }}>{EL[h.need].ko} 기운이 {h.today ? '좋은 날' : '필요했던 날'}</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 10 }}>
            <div style={{ flex: 1, height: 8, borderRadius: 9, background: 'var(--line)', overflow: 'hidden' }}><div style={{ width: `${Math.min(1, h.fill / 30) * 100}%`, height: '100%', background: `var(--${h.need})` }} /></div>
            <span className="num" style={{ fontSize: 12, color: 'var(--fg1)' }}>{h.fill}/30</span>
          </div>
          <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--fg3)', marginTop: 6 }}>{h.fill >= 30 ? '꽉 채웠어요' : h.fill > 0 ? `${30 - h.fill}꾹 모자랐어요` : '쉬어 간 날'}</div>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginTop: 12 }}>
        {[[r[0].emoji, '그날의 기운 밥', r[0].name], [r[1].emoji, '그날의 기운 행동', r[1].name]].map(([em, k, v]) => <div key={k} style={{ display: 'flex', alignItems: 'center', gap: 8, borderRadius: 18, background: 'var(--bg)', padding: '10px 12px' }}>
          <span style={{ fontSize: 22 }}>{em}</span><div style={{ minWidth: 0 }}><div className="caption">{k}</div><div style={{ fontSize: 12.5, fontWeight: 800, color: 'var(--fg1)', wordBreak: 'keep-all' }}>{v}</div></div></div>)}
      </div>
    </div>
    {/* 이번 달 채운 기운 */}
    <div className="card" style={{ position: 'relative', margin: '10px 16px 0', borderRadius: 30, padding: '16px 16px 14px', overflow: 'hidden' }}>
      <div className="h3">이번 달 채운 기운</div>
      <div style={{ display: 'flex', height: 14, borderRadius: 8, overflow: 'hidden', marginTop: 12, background: 'var(--line)' }}>
        {EL_ORDER.filter(e => mix[e]).map(e => <i key={e} style={{ width: `${mix[e] / mixTotal * 100}%`, background: `var(--${e})` }} />)}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10 }}>
        {EL_ORDER.map(e => <span key={e} style={{ display: 'inline-flex', alignItems: 'center', gap: 3, fontSize: 12, fontWeight: 800, color: mix[e] ? `var(--${e}-ink)` : 'var(--fg4)' }}>
          <img src={EL[e].piece} alt="" style={{ width: 18, height: 18, objectFit: 'contain', opacity: mix[e] ? 1 : .35, filter: mix[e] ? 'none' : 'grayscale(1)' }} />{EL[e].ko} {mix[e]}</span>)}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 14, borderRadius: 20, background: `linear-gradient(90deg, ${tint(topEl, 14)}, ${tint(topEl, 34)})`, padding: '10px 12px' }}>
        <img src={EL[topEl].img} alt="" style={{ height: 52, flex: 'none' }} />
        <div style={{ fontSize: 13.5, fontWeight: 700, color: INK, lineHeight: 1.45, wordBreak: 'keep-all' }}>이번 달엔 <b>{EL[topEl].ko} 기운</b>을 가장 많이 채웠어요. {T().EL_TEXT[topEl].keyword}의 한 달!</div>
      </div>
    </div>
  </div>;
}
Object.assign(window, { SajuScreen, RecordsScreen });
