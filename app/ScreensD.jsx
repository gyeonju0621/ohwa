// 오화 — 처음 여는 화면들: Splash(로고) · Login · Intro(소개 3장) · Connect(말랑이 굿즈 NFC 연결)
// 흐름: splash → (로그인 전) login → intro → onboard(생일) → connect → today
//       splash → (로그인 후) 마지막 탭(today·saju·records)
// 저장: localStorage 'ohwa5-auth' = { provider, at, device? }, 'ohwa5-onboarded' = '1'
// ※ 프로토타입: 실제 로그인·메일 발송·NFC는 없다. 버튼은 흐름만 보여 준다.
const AUTH_KEY = 'ohwa5-auth', ONB_KEY = 'ohwa5-onboarded';
const getAuth = () => { try { return JSON.parse(localStorage.getItem(AUTH_KEY)); } catch (_) { return null; } };
const setAuth = (v) => { try { v ? localStorage.setItem(AUTH_KEY, JSON.stringify(v)) : localStorage.removeItem(AUTH_KEY); } catch (_) {} };
const isOnboarded = () => { try { return localStorage.getItem(ONB_KEY) === '1'; } catch (_) { return false; } };
const setOnboarded = (on) => { try { on ? localStorage.setItem(ONB_KEY, '1') : localStorage.removeItem(ONB_KEY); } catch (_) {} };
const ALL5 = { wood: 1, fire: 1, earth: 1, metal: 1, water: 1 };
const pastel5 = `linear-gradient(165deg, ${tint('water', 16)} 0%, ${tint('metal', 26)} 48%, ${tint('fire', 22)} 100%)`;

/* 로고: 글자 먼저, 낙관(五和)은 도장 찍듯 쿵 — 낙관을 따로 그려 위에 얹는다 */
function LogoStamp({ height = 40, delay = 600 }) {
  const W = height * 878 / 232, sx = height * 736 / 232, sw = height * 144 / 232;
  React.useEffect(() => { const t = setTimeout(() => { feel('tap', { pitch: .8 }); }, delay + 260); return () => clearTimeout(t); }, []);
  return <div style={{ position: 'relative', width: W, height, color: 'var(--ink-strong)' }}>
    <div style={{ animation: `ohwa-in 520ms ${delay - 380}ms var(--ease-calm) both` }}><OhwaLogo height={height} seal="transparent" /></div>
    <div style={{ position: 'absolute', left: sx, top: 0, width: sw, height, animation: `ohwa-stamp 560ms ${delay}ms var(--ease-jelly) both` }}>
      <OhwaLogo height={height} mark="seal" />
    </div>
  </div>;
}

/* ---------- 00 Splash — 말랑이 둘레를 다섯 기운 조각이 천천히 돌고, 로고 낙관이 쿵 ---------- */
function SplashScreen({ onDone, quick }) {
  const done = React.useRef(false);
  const finish = () => { if (done.current) return; done.current = true; onDone(); };
  React.useEffect(() => { if (new URLSearchParams(location.search).has('hold')) return; const t = setTimeout(finish, quick ? 1600 : 3000); return () => clearTimeout(t); }, []);   // 개발용 ?hold=1 이면 멈춰 둠
  const R = 116;
  return <div onClick={finish} style={{ position: 'absolute', inset: '-50px 0 0', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
    background: `radial-gradient(120% 70% at 50% 42%, var(--scene-top) 0%, var(--bg) 60%)` }}>
    {/* 조각 고리 + 말랑이 */}
    <div style={{ position: 'relative', width: 2 * R + 70, height: 2 * R + 70, marginTop: -40 }}>
      <div style={{ position: 'absolute', inset: 35, borderRadius: '50%', border: '1.5px dashed var(--line)', animation: 'ohwa-in 600ms both' }} />
      <div style={{ position: 'absolute', inset: 0, animation: 'ohwa-spin 36s linear infinite' }}>
        {EL_ORDER.map((e, k) => { const a = -Math.PI / 2 + k * 2 * Math.PI / 5, x = R + 35 + Math.cos(a) * R, y = R + 35 + Math.sin(a) * R;
          return <div key={e} style={{ position: 'absolute', left: x - 22, top: y - 22, width: 44, height: 44, animation: 'ohwa-spin 36s linear infinite reverse' }}>
            <img src={EL[e].piece} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain', filter: 'drop-shadow(0 6px 8px rgba(40,30,25,.16))', animation: `ohwa-pop 520ms ${120 + k * 110}ms var(--ease-jelly) both` }} />
          </div>; })}
      </div>
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 62 }}>
        <Malangi h={142} pedestal={false} enter sleepy={false} lean={false} />
      </div>
    </div>
    <div style={{ marginTop: 30 }}><LogoStamp height={38} delay={900} /></div>
    <div style={{ marginTop: 14, fontSize: 14, fontWeight: 700, color: 'var(--fg3)', letterSpacing: '-.01em', animation: 'ohwa-in 520ms 1250ms var(--ease-calm) both' }}>다섯 기운을 말랑하게 채우는 하루</div>
    <div style={{ position: 'absolute', bottom: 46, fontSize: 11.5, fontWeight: 700, color: 'var(--fg4)', letterSpacing: '.14em', animation: 'ohwa-in 520ms 1500ms both' }}>AI 오행 감정케어</div>
  </div>;
}

/* ---------- 로그인 버튼 — 누르면 잠깐 동그라미가 돈 뒤 다음으로 ---------- */
function AuthButton({ kind, label, icon, onGo, busy, style }) {
  const looks = {
    kakao: { background: '#FEE500', color: '#191600' },
    apple: { background: 'var(--primary)', color: 'var(--on-primary)' },
  }[kind];
  return <button className="cta press" disabled={!!busy && busy !== kind} onClick={() => onGo(kind)}
    style={{ width: '100%', height: 54, fontSize: 15.5, position: 'relative', ...looks, ...style }}>
    <span style={{ position: 'absolute', left: 22, display: 'flex' }}>{icon}</span>
    {busy === kind ? <i style={{ width: 20, height: 20, borderRadius: '50%', border: '2.5px solid currentColor', borderRightColor: 'transparent', animation: 'ohwa-spin 700ms linear infinite' }} /> : label}
  </button>;
}
const KakaoMark = () => <svg width="20" height="20" viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 3.5c-5 0-9 3.1-9 7 0 2.5 1.7 4.7 4.2 6l-1 3.6c-.1.3.3.6.6.4l4.2-2.8c.3 0 .7.1 1 .1 5 0 9-3.1 9-7s-4-7.3-9-7.3Z" /></svg>;

/* ---------- 01 Login ---------- */
function LoginScreen({ onDone }) {
  const [busy, setBusy] = React.useState(null);
  const [mail, setMail] = React.useState(null);        // null | { v, sent }
  const go = (provider) => {
    if (busy) return;
    if (provider === 'email') { feel('tick'); setMail({ v: '', sent: false }); return; }
    feel('pop'); buzz(8); setBusy(provider);
    setTimeout(() => { setAuth({ provider, at: Date.now() }); onDone(provider); }, provider === 'guest' ? 200 : 900);
  };
  const okMail = mail && /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(mail.v);
  return <div style={fadeIn}>
    <div style={{ display: 'flex', justifyContent: 'center', padding: '8px 0 0', color: 'var(--ink-strong)' }}><OhwaLogo height={22} /></div>
    {/* 무대 */}
    <div className="clip" style={{ position: 'relative', margin: '14px 14px 0', height: 466, borderRadius: 38, overflow: 'hidden', background: pastel5 }}>
      <div style={{ position: 'absolute', left: '50%', bottom: -150, width: 560, height: 230, marginLeft: -280, borderRadius: '50%', background: 'var(--floor-glow, rgba(255,255,255,.3))' }} />
      <div style={{ position: 'relative', padding: '26px 24px 0', color: INK }}>
        <div style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-.045em', lineHeight: 1.25 }}>오늘 부족한 기운,<br />말랑이에게 채워 볼까요?</div>
        <div style={{ fontSize: 14, fontWeight: 700, opacity: .7, marginTop: 8 }}>태어난 날로 보는 다섯 기운, 하루 한 번</div>
      </div>
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 18 }}>
        <Malangi h={196} pedestal={false} pose="wave" sleepy={false} el="metal" float={<FloatingParts counts={ALL5} h={196} spread={1.1} />} />
      </div>
    </div>
    {/* 버튼 */}
    <div style={{ position: 'absolute', left: 20, right: 20, bottom: 30, zIndex: 5, display: 'flex', flexDirection: 'column', gap: 8 }}>
      <AuthButton kind="kakao" label="카카오로 3초 만에 시작" icon={<KakaoMark />} onGo={go} busy={busy} />
      <AuthButton kind="apple" label="Apple로 계속하기" icon={<Icon name="Apple" size={19} />} onGo={go} busy={busy} />
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 4, marginTop: 4 }}>
        <button className="press" onClick={() => go('email')} style={linkBtn}>이메일로 시작</button>
        <i style={{ width: 3, height: 3, borderRadius: 2, background: 'var(--fg4)' }} />
        <button className="press" onClick={() => go('guest')} style={linkBtn}>먼저 둘러볼게요</button>
      </div>
      <div style={{ textAlign: 'center', fontSize: 11.5, fontWeight: 600, color: 'var(--fg4)', lineHeight: 1.5, marginTop: 2 }}>
        시작하면 <u>이용약관</u>과 <u>개인정보 처리방침</u>에 동의하게 돼요</div>
    </div>
    {mail && <Sheet onClose={() => setMail(null)}>
      {!mail.sent ? <>
        <div style={{ fontSize: 20, fontWeight: 800, letterSpacing: '-.03em', color: 'var(--fg1)' }}>이메일로 시작하기</div>
        <div style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--fg3)', marginTop: 4 }}>비밀번호 없이, 로그인 링크를 보내 드려요</div>
        <input autoFocus type="email" value={mail.v} onChange={e => setMail({ ...mail, v: e.target.value.trim() })} placeholder="name@example.com" aria-label="이메일"
          onKeyDown={e => { if (e.key === 'Enter' && okMail) setMail({ ...mail, sent: true }); }}
          style={{ width: '100%', boxSizing: 'border-box', marginTop: 18, height: 54, borderRadius: 20, border: '1px solid var(--card-line)', background: 'var(--bg)', padding: '0 18px', fontSize: 16, fontWeight: 700, color: 'var(--fg1)', outline: 'none', fontFamily: 'var(--font-sans)', textAlign: 'left' }} />
        <button className="cta press" disabled={!okMail} onClick={() => { feel('pop'); setMail({ ...mail, sent: true }); }} style={{ width: '100%', marginTop: 10 }}>로그인 링크 받기</button>
      </> : <>
        <div style={{ width: 64, height: 64, margin: '4px auto 0', borderRadius: 32, display: 'grid', placeItems: 'center', background: tint('water', 30), color: 'var(--water-ink)', animation: 'ohwa-pop 520ms var(--ease-jelly) both' }}><Icon name="MailCheck" size={30} /></div>
        <div style={{ fontSize: 20, fontWeight: 800, letterSpacing: '-.03em', color: 'var(--fg1)', marginTop: 14 }}>메일함을 확인해 주세요</div>
        <div style={{ fontSize: 13.5, fontWeight: 600, color: 'var(--fg3)', marginTop: 4, wordBreak: 'break-all' }}><b style={{ color: 'var(--fg2)' }}>{mail.v}</b>로<br />로그인 링크를 보냈어요</div>
        <button className="cta press" onClick={() => { setMail(null); setAuth({ provider: 'email', at: Date.now() }); onDone('email'); }} style={{ width: '100%', marginTop: 18 }}>링크를 눌렀어요</button>
        <button className="press" onClick={() => setMail({ ...mail, sent: false })} style={{ ...linkBtn, marginTop: 6 }}>다른 이메일 쓰기</button>
      </>}
    </Sheet>}
  </div>;
}
const linkBtn = { border: 0, background: 'transparent', cursor: 'pointer', fontFamily: 'var(--font-sans)', fontSize: 14, fontWeight: 700, color: 'var(--fg2)', padding: '10px 10px' };

/* ---------- 02 Intro — 소개 3장 (밀어서 넘기기) ---------- */
function NfcRings({ size = 260, fast }) {
  return <div style={{ position: 'absolute', left: '50%', top: '50%', width: 0, height: 0, pointerEvents: 'none' }}>
    {[0, 1, 2].map(k => <i key={k} style={{ position: 'absolute', left: 0, top: 0, width: size, height: size, borderRadius: '50%', border: '2px solid var(--water)',
      animation: `ohwa-nfc ${fast ? 2.2 : 3.8}s ${k * (fast ? .73 : 1.26)}s var(--ease-calm) infinite` }} />)}
  </div>;
}
function IntroScreen({ onDone }) {
  const [i, setI] = React.useState(0);
  const [dx, setDx] = React.useState(0);
  const drag = React.useRef(null);
  const [demo, setDemo] = React.useState([]);          // 2장: 배에 조각이 하나씩 들어가는 시연
  React.useEffect(() => {
    if (i !== 1) return;
    setDemo([]);
    const t = setInterval(() => setDemo(d => d.length >= 5 ? d : [...d, 'fire']), 850);
    return () => clearInterval(t);
  }, [i]);
  const P = [
    { el: 'wood', t: <>태어난 날로<br />내 다섯 기운을 알아봐요</>, s: '사주 여덟 글자 속 목·화·토·금·수가 몇 개인지, 말랑이가 조각으로 보여 줘요' },
    { el: 'fire', t: <>모자란 기운은<br />말랑이 배에 채워요</>, s: '톡 누르면 조각이 쏙. 오늘 어울리는 음식과 행동도 함께 추천해요' },
    { el: 'water', t: <>말랑이 굿즈에<br />폰을 톡 대 보세요</>, s: 'NFC 태그 한 번이면 오늘의 기분 진단이 바로 열려요' },
  ];
  const to = (n) => { const v = Math.max(0, Math.min(2, n)); if (v !== i) { feel('tick', { pitch: 1 + v * .12 }); buzz(5); } setI(v); };
  const next = () => i < 2 ? to(i + 1) : (feel('pop'), buzz(10), onDone());
  const sample = { wood: 3, fire: 0, earth: 2, metal: 2, water: 1 };
  const visual = (k) => {
    if (k === 0) return <Malangi h={196} pedestal={false} el="wood" sleepy={false} float={<FloatingParts counts={sample} h={196} spread={1.1} />} />;
    if (k === 1) return <Malangi h={206} pedestal={false} el="fire" sleepy={false} parts={i === 1 ? demo : []} onPress={() => setDemo(d => [...d, 'fire'].slice(-30))} />;
    return <div style={{ position: 'relative', height: 230 }}>
      <NfcRings size={250} />
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0 }}><Malangi h={190} pedestal={false} el="water" pose="cheer" sleepy={false} /></div>
      <div style={{ position: 'absolute', right: 58, top: 2, width: 58, height: 92, borderRadius: 16, background: 'var(--ink-strong)', boxShadow: '0 14px 24px -12px rgba(40,25,15,.5)',
        display: 'grid', placeItems: 'center', color: 'var(--on-ink)', animation: 'ohwa-tapphone 3.8s var(--ease-calm) infinite' }}><Icon name="Nfc" size={24} /></div>
    </div>;
  };
  return <div style={fadeIn}>
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '4px 14px 0 22px', color: 'var(--ink-strong)' }}>
      <OhwaLogo height={20} />
      <button className="press" onClick={() => { feel('tick'); onDone(); }} style={{ ...linkBtn, opacity: i < 2 ? 1 : 0, pointerEvents: i < 2 ? 'auto' : 'none', transition: 'opacity 300ms' }}>건너뛰기</button>
    </div>
    <div style={{ position: 'absolute', left: 0, right: 0, top: 54, bottom: 150, overflow: 'hidden', touchAction: 'pan-y' }}
      onPointerDown={e => { drag.current = { x: e.clientX, moved: false }; }}
      onPointerMove={e => { const d = drag.current; if (!d) return; const v = e.clientX - d.x; if (Math.abs(v) > 8) d.moved = true; if (d.moved) setDx(v); }}
      onPointerUp={() => { const d = drag.current; drag.current = null; if (d && d.moved) { if (dx < -60) to(i + 1); else if (dx > 60) to(i - 1); } setDx(0); }}
      onPointerLeave={() => { if (drag.current) { drag.current = null; setDx(0); } }}>
      <div style={{ display: 'flex', width: 390 * 3, height: '100%', transform: `translateX(${-i * 390 + dx}px)`, transition: dx ? 'none' : 'transform 520ms var(--ease-jelly)' }}>
        {P.map((p, k) => <div key={k} style={{ width: 390, flex: 'none', padding: '0 14px', boxSizing: 'border-box', display: 'flex', flexDirection: 'column' }}>
          <div className="clip" style={{ position: 'relative', height: 380, borderRadius: 38, overflow: 'hidden', background: sceneBg(p.el) }}>
            <div style={{ position: 'absolute', left: '50%', bottom: -150, width: 560, height: 230, marginLeft: -280, borderRadius: '50%', background: 'var(--floor-glow, rgba(255,255,255,.3))' }} />
            <div style={{ position: 'absolute', left: 0, right: 0, bottom: 22 }}>{Math.abs(k - i) <= 1 && visual(k)}</div>
          </div>
          <div style={{ padding: '24px 10px 0', opacity: k === i ? 1 : .3, transition: 'opacity 400ms' }}>
            <div style={{ fontSize: 27, fontWeight: 800, letterSpacing: '-.045em', lineHeight: 1.27, color: 'var(--fg1)' }}>{p.t}</div>
            <div style={{ fontSize: 14.5, fontWeight: 600, lineHeight: 1.55, color: 'var(--fg3)', marginTop: 10, wordBreak: 'keep-all' }}>{p.s}</div>
          </div>
        </div>)}
      </div>
    </div>
    <div style={{ position: 'absolute', left: 20, right: 20, bottom: 36 }}>
      <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginBottom: 22 }}>
        {P.map((p, k) => <button key={k} aria-label={`${k + 1}번째 소개`} onClick={() => to(k)} style={{ border: 0, padding: 0, cursor: 'pointer', height: 8, borderRadius: 4,
          width: k === i ? 24 : 8, background: k === i ? `var(--${p.el})` : 'var(--line)', transition: 'all 420ms var(--ease-jelly)' }} />)}
      </div>
      <button className="cta press" style={{ width: '100%' }} onClick={next}>{i < 2 ? '다음' : '내 기운 알아보기'}</button>
    </div>
  </div>;
}

/* ---------- 04 Connect — 말랑이 굿즈(NFC) 연결. 굿즈가 없으면 건너뛴다 ---------- */
function ConnectScreen({ onDone, tag }) {
  const [st, setSt] = React.useState(() => tag ? 'done' : new URLSearchParams(location.search).get('cstate') || 'idle');   // idle → scan → done (개발용 ?cstate=done)
  const serial = React.useMemo(() => tag || 'OH-' + String(Math.floor(1000 + Math.random() * 9000)), []);
  React.useEffect(() => { if (tag) { setAuth({ ...(getAuth() || {}), device: tag }); feel('pop', { pitch: 1.2 }); } }, []);   // 스티커를 대서 들어왔으면 이미 연결된 것
  React.useEffect(() => {
    if (st !== 'scan') return;
    const t = setTimeout(() => connect(), 2600);
    return () => clearTimeout(t);
  }, [st]);
  const connect = () => { setSt(s => { if (s !== 'scan') return s; feel('pop', { pitch: 1.2 }); buzz([10, 40, 14]); setAuth({ ...(getAuth() || {}), device: serial }); return 'done'; }); };
  const name = S().profile.display === '나' ? '내' : S().profile.display + '의';
  const finish = () => { setOnboarded(true); feel('pop'); onDone(); };
  const T3 = {
    idle: [<>{name} 말랑이 굿즈와<br />연결할까요?</>, '굿즈가 있으면 폰을 대는 것만으로 오늘의 기운이 열려요'],
    scan: [<>폰 뒷면을<br />말랑이 등에 대 주세요</>, '조금만 기다려 주세요, 말랑이를 찾고 있어요'],
    done: [<>연결됐어요!</>, '이제 말랑이를 톡 대면 오늘의 기분 진단이 바로 열려요'],
  }[st];
  return <div style={fadeIn}>
    <div style={{ display: 'flex', justifyContent: 'center', padding: '8px 0 0', color: 'var(--ink-strong)' }}><OhwaLogo height={20} /></div>
    <div style={{ position: 'relative', height: 400, marginTop: 6 }} onClick={() => st === 'scan' && connect()}>
      <div style={{ position: 'absolute', left: '50%', top: 200, width: 290, height: 290, margin: '-145px 0 0 -145px', borderRadius: '50%',
        background: st === 'done' ? tint('water', 34) : tint('water', 16), transition: 'background 600ms' }} />
      {st !== 'done' && <div style={{ position: 'absolute', left: 0, right: 0, top: 70, height: 260 }}><NfcRings size={290} fast={st === 'scan'} /></div>}
      <div style={{ position: 'absolute', left: 0, right: 0, bottom: 70 }}>
        <Malangi key={st === 'done' ? 'd' : 'w'} h={210} pedestal={false} el="water" sleepy={false} pose={st === 'done' ? 'cheer' : st === 'scan' ? 'wave' : undefined} enter={st === 'done'} />
      </div>
      {st === 'done' && <div style={{ position: 'absolute', left: 0, right: 0, bottom: 26, display: 'flex', justifyContent: 'center' }}><div style={{ height: 32, padding: '0 14px', borderRadius: 999, display: 'inline-flex', alignItems: 'center', gap: 6,
        background: 'var(--card)', boxShadow: 'var(--shadow-chip)', fontSize: 13, fontWeight: 800, color: 'var(--fg1)', animation: 'ohwa-pop 520ms 200ms var(--ease-jelly) both' }}>
        <Icon name="Check" size={15} stroke={3} color="var(--water-ink)" /><span className="num">{serial}</span> 말랑이</div></div>}
    </div>
    <div key={st} style={{ padding: '0 30px', textAlign: 'center', animation: 'ohwa-in 420ms var(--ease-calm) both' }}>
      <div style={{ fontSize: 26, fontWeight: 800, letterSpacing: '-.045em', lineHeight: 1.28, color: 'var(--fg1)' }}>{T3[0]}</div>
      <div style={{ fontSize: 14.5, fontWeight: 600, lineHeight: 1.55, color: 'var(--fg3)', marginTop: 10, wordBreak: 'keep-all' }}>{T3[1]}</div>
    </div>
    <div style={{ position: 'absolute', left: 20, right: 20, bottom: 30, display: 'flex', flexDirection: 'column', alignItems: 'stretch', gap: 4 }}>
      {st === 'idle' && <>
        <button className="cta press" onClick={() => { feel('tick'); buzz(6); setSt('scan'); }}><Icon name="Nfc" size={20} />연결하기</button>
        <button className="press" onClick={finish} style={linkBtn}>굿즈가 아직 없어요 — 앱으로 시작할게요</button>
      </>}
      {st === 'scan' && <button className="press" onClick={() => setSt('idle')} style={{ ...linkBtn, height: 58 + 44 }}>취소</button>}
      {st === 'done' && <button className="cta press" onClick={finish} style={{ marginBottom: 44 }}>오늘 시작하기</button>}
    </div>
  </div>;
}

Object.assign(window, { SplashScreen, LoginScreen, IntroScreen, ConnectScreen, getAuth, setAuth, isOnboarded, setOnboarded, LogoStamp });
