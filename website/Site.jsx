// 오화 — marketing site (toy-studio) · 주인공은 하얀 말랑이
const MEANING = { wood: '생명 · 성장', fire: '열정 · 변화', earth: '안정 · 중심', metal: '선명 · 정돈', water: '유연 · 흐름' };
const ONE_EACH = { wood: 1, fire: 1, earth: 1, metal: 1, water: 1 };
function SiteNav({ onCTA }) {
  return <div style={{ position: 'sticky', top: 12, zIndex: 20, display: 'flex', justifyContent: 'center' }}>
    <div className="glass" style={{ width: 'min(1120px, calc(100% - 32px))', borderRadius: 999, padding: '8px 8px 8px 22px', display: 'flex', alignItems: 'center', gap: 22 }}>
      <a href="#" aria-label="오화 OHWA 홈" style={{ color: 'var(--fg1)', display: 'flex' }}><OhwaLogo height={30} /></a>
      <div style={{ flex: 1 }} />
      {[['#try', '내 사주'], ['#five', '다섯 친구'], ['#story', '오늘의 이야기'], ['#how', '하루 흐름']].map(([h, l]) => <a key={h} href={h} style={{ fontSize: 14, fontWeight: 600, color: 'var(--fg2)' }}>{l}</a>)}
      <ThemeButton />
      <button className="cta press" style={{ height: 44, padding: '0 20px', fontSize: 14 }} onClick={onCTA}>앱 열기</button>
    </div>
  </div>;
}
/* 히어로 — 하얀 말랑이를 직접 눌러 보는 데모. 고른 기운 조각이 배에 쌓이고 배가 빵빵해진다 */
function SiteHero({ onCTA }) {
  const [sel, setSel] = React.useState('fire');
  const [parts, setParts] = React.useState(['fire', 'fire', 'wood']);
  const full = parts.length >= 30;
  const add = () => setParts(p => { if (p.length >= 30) return p; return [...p, sel]; });
  return <section style={{ position: 'relative', maxWidth: 1120, margin: '20px auto 0', padding: '0 16px' }}>
    <div style={{ position: 'relative', borderRadius: 44, overflow: 'hidden', height: 640, background: 'var(--bg)' }}>
      <Studio el={sel} y="56%" />
      <div style={{ position: 'absolute', left: 56, top: 64, maxWidth: 470 }}>
        <Chip strong>사주 × 말랑이</Chip>
        <div style={{ fontSize: 64, lineHeight: 1.08, fontWeight: 800, color: 'var(--fg1)', letterSpacing: '-.05em', marginTop: 18 }}>내 사주에<br />비어 있는 기운,<br />말랑하게 채우기</div>
        <div className="p" style={{ marginTop: 20, fontSize: 16, color: 'var(--fg2)', maxWidth: 400 }}>태어난 날로 오늘 필요한 기운을 찾고, 하얀 말랑이를 꾹 눌러 그 기운 조각을 배 속에 채워요.</div>
        <div style={{ display: 'flex', gap: 10, marginTop: 30 }}>
          <a href="#try" className="cta press">내 사주 보기</a>
          <button className="cta ghost press" onClick={onCTA}>앱 열기</button>
        </div>
      </div>
      <div style={{ position: 'absolute', right: 30, bottom: 30, width: 540, height: 560 }}>
        {/* 기운 고르기 */}
        <div style={{ position: 'absolute', left: 0, top: 150, display: 'flex', flexDirection: 'column', gap: 8, zIndex: 9 }}>
          {EL_ORDER.map(e => <button key={e} className="press" aria-label={`${EL[e].ko} 기운`} onClick={() => { setSel(e); feel('tick', { pitch: EL[e].pitch }); }}
            style={{ width: 56, height: 56, borderRadius: 20, border: 0, padding: 0, display: 'grid', placeItems: 'center', cursor: 'pointer',
              background: sel === e ? `var(--${e}-2)` : 'var(--glass-strong)', boxShadow: sel === e ? `inset 0 0 0 2px var(--${e}), var(--shadow-chip)` : 'var(--shadow-chip)' }}>
            <img src={EL[e].piece} alt="" style={{ width: 34, height: 34, objectFit: 'contain' }} />
          </button>)}
        </div>
        <div style={{ position: 'absolute', left: 80, right: 0, bottom: 56 }}>
          <Malangi h={360} ped={300} el={sel} parts={parts} onPress={add} onHold={add}
            float={<FloatingParts counts={ONE_EACH} h={360} top={-6} spread={.95} />} />
        </div>
        <Chip el={sel} strong style={{ position: 'absolute', right: 10, top: 196, zIndex: 9 }}><span className="hanja">{EL[sel].hj}</span> {EL[sel].part} 조각</Chip>
        <Chip strong style={{ position: 'absolute', right: 30, top: 250, zIndex: 9 }}><span className="num" style={{ fontSize: 12 }}>{parts.length}/30</span></Chip>
        <div style={{ position: 'absolute', left: 80, right: 0, bottom: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 10, fontSize: 13, fontWeight: 600, color: 'var(--fg2)' }}>
          {full ? <>배가 꽉 찼어요 <button className="chip press" onClick={() => setParts([])} style={{ border: 0, borderRadius: 999, height: 32, padding: '0 14px', background: 'var(--primary)', color: 'var(--on-primary)', fontWeight: 700, cursor: 'pointer' }}>비우기</button></>
            : '톡 누르면 하나, 꾸우욱 누르고 있으면 계속 들어가요'}
        </div>
      </div>
    </div>
  </section>;
}
/* 내 사주 미리 보기 — 생년월일을 넣으면 그 자리에서 네 기둥과 다섯 기운이 바뀐다 */
function SiteTry({ onCTA }) {
  const [f, setF] = React.useState({ y: '1998', m: '3', d: '14', hour: '8', minute: '0', timeKnown: true, cal: '양력', leap: false, name: '' });
  const set = (k, max) => (e) => { const v = e.target.value.replace(/[^0-9]/g, '').slice(0, max); setF(o => ({ ...o, [k]: v })); };
  const p = React.useMemo(() => OhwaSaju.compute(f), [f]);
  const [shown, setShown] = React.useState(p);
  React.useEffect(() => { if (!p.error) setShown(p); }, [p]);
  const C = shown.count, top = EL_ORDER.slice().sort((a, b) => C[b] - C[a])[0];
  const field = (k, unit, max, w) => <label key={k} className="glass" style={{ width: w, height: 58, borderRadius: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 3, boxShadow: 'var(--shadow-chip)' }}>
    <input value={f[k]} onChange={set(k, max)} onFocus={e => e.target.select()} inputMode="numeric" aria-label={unit} className="num"
      style={{ width: max === 4 ? 62 : 32, border: 0, background: 'transparent', fontSize: 21, color: 'var(--fg1)', textAlign: 'right', outline: 'none', padding: 0 }} />
    <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--fg3)' }}>{unit}</span>
  </label>;
  const pill = (on) => ({ height: 40, padding: '0 15px', cursor: 'pointer', background: on ? 'var(--primary)' : undefined, color: on ? 'var(--on-primary)' : undefined });
  return <section id="try" style={{ maxWidth: 1120, margin: '0 auto', padding: '110px 16px 0' }}>
    <div style={{ position: 'relative', borderRadius: 44, overflow: 'hidden', minHeight: 620, display: 'grid', gridTemplateColumns: '1.1fr .9fr', background: 'var(--bg)' }}>
      <Studio el={shown.dayMaster} y="58%" />
      <div style={{ position: 'relative', padding: '52px 0 48px 56px' }}>
        <div className="h1" style={{ fontSize: 40 }}>태어난 날을 넣어 보세요</div>
        <div className="p" style={{ marginTop: 10, fontSize: 15, color: 'var(--fg2)' }}>날짜와 시간이 바뀌면 여덟 글자, 다섯 기운, 머리 위 조각이 그 자리에서 달라져요.</div>
        <div style={{ display: 'flex', gap: 8, marginTop: 26, flexWrap: 'wrap', alignItems: 'center' }}>
          {field('y', '년', 4, 120)}{field('m', '월', 2, 82)}{field('d', '일', 2, 82)}
          {f.timeKnown && <>{field('hour', '시', 2, 76)}{field('minute', '분', 2, 76)}</>}
        </div>
        <div style={{ display: 'flex', gap: 6, marginTop: 10, flexWrap: 'wrap' }}>
          <Chip strong onClick={() => { feel('tick'); setF(o => ({ ...o, timeKnown: !o.timeKnown })); }} style={pill(!f.timeKnown)}>시간 모름</Chip>
          <span style={{ width: 8 }} />
          {[['양력', '양력', false], ['음력', '음력', false], ['윤달', '음력', true]].map(([l, c, lp]) => {
            const on = f.cal === c && !!f.leap === lp;
            return <Chip key={l} onClick={() => { feel('tick'); setF(o => ({ ...o, cal: c, leap: lp })); }} style={pill(on)}>{l}</Chip>;
          })}
        </div>
        <div style={{ minHeight: 22, marginTop: 12, fontSize: 13, fontWeight: 700, color: 'var(--error)' }}>{p.error || (shown.solarNote ? <span style={{ color: 'var(--fg3)', fontWeight: 600 }}>{shown.solarNote}</span> : '')}</div>
        {/* 네 기둥 */}
        <div className="glass" style={{ marginTop: 6, borderRadius: 28, padding: '14px 16px', display: 'grid', gridTemplateColumns: 'repeat(4, 64px)', gap: 12, width: 'max-content' }}>
          {shown.pillars.map((pl, i) => <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: pl.label === '일' ? 'var(--fg1)' : 'var(--fg3)' }}>{pl.label}주</span>
            {pl.stem ? <>
              <HanjaTile ch={pl.stem} el={OhwaSaju.STEM[pl.stem][1]} read={OhwaSaju.STEM[pl.stem][0]} size={54} />
              <HanjaTile ch={pl.branch} el={OhwaSaju.BRANCH[pl.branch][1]} read={OhwaSaju.BRANCH[pl.branch][0]} size={54} />
            </> : [0, 1].map(k => <div key={k} style={{ width: 54, height: 54, borderRadius: 17, border: '1.5px dashed var(--fg4)', display: 'grid', placeItems: 'center', color: 'var(--fg3)', fontWeight: 800 }}>?</div>)}
          </div>)}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 16, flexWrap: 'wrap' }}>
          <Chip el={shown.dayMaster} strong style={{ height: 32, fontSize: 13 }}>나를 뜻하는 글자 · <span className="hanja">{shown.dayStem}</span> {shown.dayMean}</Chip>
          {EL_ORDER.map(e => <span key={e} style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 13, fontWeight: 700, color: C[e] ? `var(--${e}-ink)` : 'var(--fg4)' }}>
            <i style={{ width: 8, height: 8, borderRadius: 9, background: C[e] ? `var(--${e})` : 'var(--fg4)' }} />{EL[e].ko} {C[e]}</span>)}
        </div>
      </div>
      <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', alignItems: 'center', paddingBottom: 56 }}>
        <Malangi h={300} ped={260} el={top} float={<FloatingParts key={JSON.stringify(C)} counts={C} h={300} top={-4} />} />
        <button className="cta press" style={{ marginTop: 34 }} onClick={onCTA}>앱에서 이어 보기</button>
      </div>
    </div>
  </section>;
}
/* v12 — 웹사이트도 앱과 같은 아이보리 톤. 색은 아이보리와 섞어 따뜻하게 */
const wtint = (e, p) => `color-mix(in srgb, var(--${e}) ${p}%, var(--tint-base))`;
const WINK = 'var(--ink-strong)';
/* 다섯 기운 친구들 — 오행 말랑이 + 그 기운의 조각 */
function SiteFive() {
  return <section id="five" style={{ maxWidth: 1120, margin: '0 auto', padding: '110px 16px 0' }}>
    <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', padding: '0 8px' }}>
      <div className="h1" style={{ fontSize: 40 }}>다섯 기운 친구들</div>
      <div className="p" style={{ fontSize: 15, color: 'var(--fg2)' }}>기운마다 친구가 하나, 젤리 조각이 하나</div>
    </div>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 14, marginTop: 30 }}>
      {EL_ORDER.map((e, i) => <div key={e} className="card" style={{ borderRadius: 32, position: 'relative', overflow: 'hidden', padding: 0 }}>
        <div style={{ position: 'relative', height: 230, background: `linear-gradient(180deg, var(--scene-top) 0%, ${wtint(e, 24)} 62%, ${wtint(e, 52)} 100%)` }}>
          <span className="hanja" style={{ position: 'absolute', left: 16, top: 12, fontSize: 30, color: `var(--${e}-ink)`, opacity: .9 }}>{EL[e].hj}</span>
          <div style={{ position: 'absolute', left: 0, right: 0, bottom: 10, display: 'flex', justifyContent: 'center' }}>
            <img src={EL[e].img} alt={`${EL[e].ko} 말랑이`} style={{ height: 170, animation: `ohwa-bob ${3 + i * .3}s ${-i * .7}s ease-in-out infinite`, '--r0': '0deg', filter: 'drop-shadow(0 12px 14px rgba(110,75,45,.25))' }} /></div>
          <img src={EL[e].piece} alt="" style={{ position: 'absolute', right: 12, top: 12, width: 40, height: 40, objectFit: 'contain', filter: 'drop-shadow(0 4px 6px rgba(110,75,45,.25))' }} />
        </div>
        <div style={{ padding: '14px 16px 16px' }}>
          <div style={{ fontSize: 17, fontWeight: 800, color: 'var(--fg1)' }}>{EL[e].ko} · {{ wood: '나무', fire: '불', earth: '흙', metal: '쇠', water: '물' }[e]} 말랑이</div>
          <div style={{ fontSize: 13, fontWeight: 700, color: `var(--${e}-ink)`, marginTop: 3 }}>{MEANING[e]}</div>
        </div>
      </div>)}
    </div>
  </section>;
}
/* 말랑이가 들려주는 오늘의 이야기 — 실제 오늘 레시피(밥·행동·사주 한마디)를 보여 준다 */
function SiteStory() {
  const P = OhwaSaju.profile, n = OhwaSaju.needFor(OhwaSaju.TODAY), el = n.need;
  const r = window.OhwaText ? OhwaText.recipe(el, OhwaSaju.TODAY, P) : [];
  const [i, setI] = React.useState(0);
  const items = [
    { pose: 'sit', at: '10꾹', title: '기운 밥', item: r[0], note: '오행의 색과 맛으로 고른 오늘의 한 끼' },
    { pose: 'kick', at: '20꾹', title: '기운 행동', item: r[1], note: '몸으로 채우는 작은 습관 하나' },
    { pose: 'wave', at: '30꾹', title: '사주 한마디', item: r[2], note: '내 일간과 오늘 기운의 관계로 건네는 말' },
  ];
  const cur = items[i];
  return <section id="story" style={{ maxWidth: 1120, margin: '0 auto', padding: '110px 16px 0' }}>
    <div style={{ display: 'grid', gridTemplateColumns: '420px 1fr', gap: 28, alignItems: 'stretch' }}>
      {/* 이야기 카드 (앱 화면 그대로) */}
      <div style={{ position: 'relative', borderRadius: 40, overflow: 'hidden', minHeight: 560, background: `linear-gradient(180deg, var(--scene-top) 0%, ${wtint(el, 16)} 50%, ${wtint(el, 46)} 100%)`, boxShadow: 'var(--shadow-card)', display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', gap: 4, padding: '20px 20px 0' }}>{items.map((_, k) => <i key={k} style={{ flex: 1, height: 4, borderRadius: 2, background: k <= i ? WINK : 'var(--line)' }} />)}</div>
        <div style={{ textAlign: 'center', fontSize: 14, fontWeight: 800, color: WINK, marginTop: 12 }}>오늘의 이야기</div>
        <div style={{ position: 'relative', flex: 1 }}>
          <div key={'p' + i} style={{ position: 'absolute', left: 0, right: 0, bottom: 18, display: 'flex', justifyContent: 'center' }}>
            <img src={POSES[cur.pose].src} alt="" style={{ height: 190, ...POSE_FADE, animation: 'ohwa-posepop 420ms var(--ease-jelly) both' }} /></div>
          {cur.item && <div key={'e' + i} style={{ position: 'absolute', left: '50%', bottom: 140, marginLeft: 70, fontSize: 46, animation: 'ohwa-pop 500ms 150ms var(--ease-jelly) both' }}>{cur.item.emoji}</div>}
        </div>
        <div style={{ position: 'relative', background: 'var(--card)', borderRadius: '50% 50% 0 0 / 40px 40px 0 0', padding: '34px 26px 24px', textAlign: 'center' }}>
          <i style={{ position: 'absolute', left: '50%', marginLeft: -11, top: -9, width: 22, height: 22, background: 'var(--card)', transform: 'rotate(45deg)', borderRadius: 4 }} />
          <div key={'t' + i} style={{ animation: 'ohwa-slide 360ms var(--ease-calm) both' }}>
            <div style={{ fontSize: 13, fontWeight: 800, color: `var(--${el}-ink)` }}>{cur.title} · {EL[el].ko} 기운</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--fg1)', letterSpacing: '-.035em', marginTop: 6, wordBreak: 'keep-all' }}>{cur.item ? `${cur.item.name}${cur.item.sub && i === 2 ? ' ' + cur.item.sub : ''}` : ''}</div>
            <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--fg2)', marginTop: 8, lineHeight: 1.55, wordBreak: 'keep-all', minHeight: 44 }}>{cur.item ? (i === 2 ? cur.item.why : `${cur.item.sub}. ${cur.item.why}.`) : ''}</div>
          </div>
          <button className="press" onClick={() => setI((i + 1) % items.length)} style={{ width: '100%', height: 52, marginTop: 14, border: 0, borderRadius: 999, cursor: 'pointer', fontFamily: 'var(--font-sans)', fontSize: 15, fontWeight: 800, background: wtint(el, 70), color: WINK }}>다음</button>
        </div>
      </div>
      {/* 설명 + 목록 */}
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div className="h1" style={{ fontSize: 40, lineHeight: 1.2 }}>채울수록 열리는<br />오늘의 이야기</div>
        <div className="p" style={{ fontSize: 16, color: 'var(--fg2)', marginTop: 12, maxWidth: 480, wordBreak: 'keep-all' }}>말랑이를 10꾹 채울 때마다 내 사주에 맞춘 이야기가 하나씩 열려요. 운세가 아니라, 오늘 나를 한 번 더 챙기는 작은 레시피예요.</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 26 }}>
          {items.map((it, k) => <div key={k} className="card press" onClick={() => setI(k)} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '14px 18px', borderRadius: 26, cursor: 'pointer', boxShadow: k === i ? `0 0 0 2.5px ${WINK}, var(--shadow-card)` : 'var(--shadow-card)' }}>
            <div style={{ width: 72, height: 72, borderRadius: 22, background: wtint(el, 22), position: 'relative', overflow: 'hidden', flex: 'none' }}>
              <img src={POSES[it.pose].src} alt="" style={{ position: 'absolute', left: '50%', bottom: -4, height: 74, transform: 'translateX(-50%)' }} /></div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}><span style={{ fontSize: 17, fontWeight: 800, color: 'var(--fg1)' }}>{it.title}</span>
                <span className="num" style={{ fontSize: 11, color: 'var(--fg3)', background: 'var(--bg)', borderRadius: 999, padding: '3px 8px' }}>{it.at}</span></div>
              <div style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--fg2)', marginTop: 3 }}>{it.note}</div>
            </div>
            <span style={{ fontSize: 30 }}>{it.item ? it.item.emoji : ''}</span>
          </div>)}
        </div>
      </div>
    </div>
  </section>;
}
function SiteHow() {
  const steps = [['태어난 날', '생년월일로 여덟 글자와 다섯 기운을 계산해요.', 'CalendarHeart'], ['추천 기운', '오늘 일진과 겹쳐 채우면 좋은 기운을 추천해요. 고르는 건 나.', 'Sparkles'], ['꾹 · 톡 · 대롱대롱', '말랑이를 누르고, 꾹 누르고, 들어 올리며 조각을 채워요.', 'Hand'], ['오늘의 이야기', '10꾹마다 기운 밥 · 행동 · 사주 한마디가 열려요.', 'BookOpen']];
  return <section id="how" style={{ maxWidth: 1120, margin: '0 auto', padding: '110px 16px 0' }}>
    <div className="h1" style={{ fontSize: 40, padding: '0 8px' }}>하루 흐름</div>
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 14, marginTop: 30 }}>
      {steps.map(([t, d, ic], i) => { const e = EL_ORDER[i + 1];
        return <div key={t} className="card" style={{ borderRadius: 30, padding: 24, minHeight: 200, display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ width: 48, height: 48, borderRadius: 18, background: wtint(e, 30), color: `var(--${e}-ink)`, display: 'grid', placeItems: 'center' }}><Icon name={ic} size={22} /></div>
            <span className="num" style={{ fontSize: 13, color: 'var(--fg3)' }}>0{i + 1}</span>
          </div>
          <div className="h2" style={{ marginTop: 'auto' }}>{t}</div>
          <div className="p" style={{ marginTop: 6, fontSize: 14, wordBreak: 'keep-all' }}>{d}</div>
        </div>; })}
    </div>
  </section>;
}
function SiteCTA({ onCTA }) {
  return <section style={{ maxWidth: 1120, margin: '0 auto', padding: '110px 16px 0' }}>
    <div style={{ borderRadius: 44, background: 'var(--primary)', color: 'var(--on-primary)', padding: '56px 56px', display: 'flex', alignItems: 'center', gap: 30, overflow: 'hidden', position: 'relative', minHeight: 220 }}>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 44, fontWeight: 800, letterSpacing: '-.05em', lineHeight: 1.1 }}>오늘 필요한 기운은?</div>
        <button className="cta press" style={{ marginTop: 26, background: 'var(--on-primary)', color: 'var(--primary)' }} onClick={onCTA}>앱 열기</button>
      </div>
      <div style={{ position: 'relative', width: 340, alignSelf: 'stretch' }}>
        <div style={{ position: 'absolute', left: 0, right: 0, bottom: -110 }}>
          <Malangi h={250} pedestal={false} parts={['wood', 'fire', 'earth', 'metal', 'water']} float={<FloatingParts counts={ONE_EACH} h={250} top={-2} />} />
        </div>
      </div>
    </div>
  </section>;
}
function SiteFooter() {
  return <footer style={{ maxWidth: 1120, margin: '0 auto', padding: '50px 24px 50px', display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--fg3)' }}>
    <span style={{ display: 'flex', alignItems: 'center', gap: 14 }}><span style={{ color: 'var(--fg1)' }}><OhwaLogo height={22} /></span>사주 기반 셀프케어</span>
    <span style={{ display: 'flex', gap: 18 }}><a>이용약관</a><a>개인정보</a><a>문의</a></span>
  </footer>;
}
Object.assign(window, { SiteNav, SiteHero, SiteTry, SiteFive, SiteStory, SiteHow, SiteCTA, SiteFooter });
