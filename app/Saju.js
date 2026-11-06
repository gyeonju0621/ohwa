/* 오화 — 사주(四柱) 계산
   입력한 생년월일·시간(양력/음력)으로 네 기둥을 실제로 계산한다.
   - 년주: 입춘(태양 황경 315°) 기준으로 해가 바뀜
   - 월주: 12절기(황경 30°마다) 기준, 월간은 년간에서 (갑기→병인 …)
   - 일주: 1900-01-01 = 甲戌(60갑자 10번째) 기준 날짜 차
   - 시주: 서울 경도 보정 -30분, 23:30 이후는 다음 날 子시. 시간 모름이면 시주 없음(여섯 글자)
   - 음력 입력은 브라우저 내장 중국력(Intl, ca-chinese)으로 양력 변환
   태양 황경은 Meeus 저정밀 식(오차 수 분). 절입 시각 몇 분 안쪽에 태어난 경우만 만세력과 다를 수 있다.
   "오늘 필요한 기운"은 시연용 규칙(원국 + 그날 일진 오행이 가장 적은 기운). 실제 서비스 전 용신 규칙을 정해야 한다. */
(function () {
  const STEM = { 甲: ['갑', 'wood'], 乙: ['을', 'wood'], 丙: ['병', 'fire'], 丁: ['정', 'fire'], 戊: ['무', 'earth'], 己: ['기', 'earth'], 庚: ['경', 'metal'], 辛: ['신', 'metal'], 壬: ['임', 'water'], 癸: ['계', 'water'] };
  const BRANCH = { 子: ['자', 'water'], 丑: ['축', 'earth'], 寅: ['인', 'wood'], 卯: ['묘', 'wood'], 辰: ['진', 'earth'], 巳: ['사', 'fire'], 午: ['오', 'fire'], 未: ['미', 'earth'], 申: ['신', 'metal'], 酉: ['유', 'metal'], 戌: ['술', 'earth'], 亥: ['해', 'water'] };
  const STEMS = Object.keys(STEM), BRANCHES = Object.keys(BRANCH);
  const STEM_MEAN = { 甲: '큰 나무', 乙: '풀꽃', 丙: '태양', 丁: '촛불', 戊: '큰 산', 己: '논밭', 庚: '바위', 辛: '보석', 壬: '큰 물', 癸: '빗물' };
  const GEN = { wood: 'fire', fire: 'earth', earth: 'metal', metal: 'water', water: 'wood' }; // 생
  const GEN_BY = Object.fromEntries(Object.entries(GEN).map(([a, b]) => [b, a]));
  const mod = (a, n) => ((a % n) + n) % n;
  const DEG = Math.PI / 180;

  /* 태양 겉보기 황경 (도) — utcMs: UTC 밀리초 */
  function sunLongitude(utcMs) {
    const jd = utcMs / 86400000 + 2440587.5, T = (jd - 2451545) / 36525;
    const L0 = 280.46646 + 36000.76983 * T + 0.0003032 * T * T;
    const M = (357.52911 + 35999.05029 * T - 0.0001537 * T * T) * DEG;
    const C = (1.914602 - 0.004817 * T - 0.000014 * T * T) * Math.sin(M) + (0.019993 - 0.000101 * T) * Math.sin(2 * M) + 0.000289 * Math.sin(3 * M);
    const om = (125.04 - 1934.136 * T) * DEG;
    return mod(L0 + C - 0.00569 - 0.00478 * Math.sin(om), 360);
  }
  const ganzhi = (i) => ({ stem: STEMS[mod(i, 10)], branch: BRANCHES[mod(i, 12)] });
  const DAY0 = Date.UTC(1900, 0, 1); // 甲戌
  const dayIndex = (y, m, d) => mod(Math.round((Date.UTC(y, m - 1, d) - DAY0) / 86400000) + 10, 60);

  /* 음력 → 양력 (Intl 중국력). 없으면 null */
  let CN = null;
  try { CN = new Intl.DateTimeFormat('en-u-ca-chinese', { timeZone: 'UTC', year: 'numeric', month: 'numeric', day: 'numeric' }); } catch (_) {}
  function lunarParts(ms) {
    const p = {}; CN.formatToParts(new Date(ms)).forEach(x => { p[x.type] = x.value; });
    const mm = String(p.month || ''); return { y: +(p.relatedYear || p.year), m: parseInt(mm, 10), leap: /bis|閏|윤|L/i.test(mm), d: +p.day };
  }
  function lunarToSolar(y, m, d, leap) {
    if (!CN) return null;
    for (let t = Date.UTC(y, 0, 10); t < Date.UTC(y + 1, 2, 1); t += 86400000) {
      const l = lunarParts(t);
      if (l.y === y && l.m === m && l.d === d && l.leap === !!leap) { const g = new Date(t); return { y: g.getUTCFullYear(), m: g.getUTCMonth() + 1, d: g.getUTCDate() }; }
    }
    return null;
  }

  /* birth = { name, y, m, d, hour, minute, timeKnown, cal: '양력'|'음력', leap } → profile 또는 { error } */
  function compute(birth) {
    let y = +birth.y, m = +birth.m, d = +birth.d;
    if (!(y >= 1900 && y <= 2100)) return { error: '1900년부터 2100년 사이로 적어주세요' };
    if (!(m >= 1 && m <= 12)) return { error: '월을 다시 확인해 주세요' };
    let solar = { y, m, d };
    if (birth.cal === '음력') {
      solar = lunarToSolar(y, m, d, birth.leap);
      if (!solar) return { error: birth.leap ? '그해에는 그 윤달이 없어요' : '음력 날짜를 다시 확인해 주세요' };
    } else {
      const g = new Date(Date.UTC(y, m - 1, d));
      if (!(d >= 1) || g.getUTCMonth() !== m - 1) return { error: '날짜를 다시 확인해 주세요' };
    }
    const known = !!birth.timeKnown;
    const hh = known ? +birth.hour : 12, mi = known ? +(birth.minute || 0) : 0;
    if (known && !(hh >= 0 && hh <= 23 && mi >= 0 && mi <= 59)) return { error: '태어난 시간을 다시 확인해 주세요' };
    // 태어난 순간 (한국 표준시 = UTC+9)
    const utc = Date.UTC(solar.y, solar.m - 1, solar.d, hh, mi) - 9 * 3600000;
    const lam = sunLongitude(utc);
    const mIdx = mod(Math.floor((lam - 315) / 30), 12);           // 0 = 寅월
    const sajuYear = solar.m <= 2 && mIdx >= 10 ? solar.y - 1 : solar.y; // 입춘 전이면 전해
    const yS = mod(sajuYear - 4, 10), yB = mod(sajuYear - 4, 12);
    const mS = mod((yS % 5) * 2 + 2 + mIdx, 10), mB = mod(mIdx + 2, 12);
    // 시: 서울 경도 보정 -30분
    const local = hh * 60 + mi - 30;
    const late = known && local >= 23 * 60;                          // 23:30 이후 → 다음 날 子시
    const dayDate = new Date(Date.UTC(solar.y, solar.m - 1, solar.d + (late ? 1 : 0)));
    const dI = dayIndex(dayDate.getUTCFullYear(), dayDate.getUTCMonth() + 1, dayDate.getUTCDate());
    const pillars = [];
    if (known) {
      const hB = mod(Math.floor((local + 60) / 120), 12);           // 23:00~01:00(보정 후) = 子
      const hS = mod((dI % 10 % 5) * 2 + hB, 10);
      pillars.push({ label: '시', stem: STEMS[hS], branch: BRANCHES[hB] });
    } else pillars.push({ label: '시', stem: null, branch: null });
    pillars.push({ label: '일', ...ganzhi(dI) });
    pillars.push({ label: '월', stem: STEMS[mS], branch: BRANCHES[mB] });
    pillars.push({ label: '년', stem: STEMS[yS], branch: BRANCHES[yB] });

    const count = { wood: 0, fire: 0, earth: 0, metal: 0, water: 0 };
    pillars.forEach(p => { if (p.stem) { count[STEM[p.stem][1]]++; count[BRANCH[p.branch][1]]++; } });
    const dayStem = pillars[1].stem;
    const pad = (n) => String(n).padStart(2, '0');
    const ampm = (h) => `${h < 12 ? '오전' : '오후'} ${h % 12 || 12}시${mi ? ` ${mi}분` : ''}`;
    return {
      name: (birth.name || '').trim(),
      display: (birth.name || '').trim() ? (birth.name || '').trim() + '님' : '나',
      input: { ...birth },
      solar,
      birth: `${y}. ${pad(m)}. ${pad(d)}`,
      time: known ? ampm(hh) : '시간 모름',
      calendar: birth.cal === '음력' ? (birth.leap ? '음력(윤달)' : '음력') : '양력',
      solarNote: birth.cal === '음력' ? `양력 ${solar.y}. ${pad(solar.m)}. ${pad(solar.d)}` : '',
      pillars, count, letters: known ? 8 : 6,
      dayStem, dayMaster: STEM[dayStem][1], dayMean: STEM_MEAN[dayStem],
      lack: Object.keys(count).filter(k => count[k] === 0),
      seed: solar.y * 400 + solar.m * 31 + solar.d + (known ? hh : 99),
    };
  }

  /* ---------- 현재 사용자 ---------- */
  const KEY = 'ohwa5-birth';
  const DEFAULT = { name: '', y: '1998', m: '3', d: '14', hour: '8', minute: '0', timeKnown: true, cal: '양력', leap: false };
  let saved = null; try { saved = JSON.parse(localStorage.getItem(KEY)); } catch (_) {}
  let profile = compute(saved || DEFAULT); if (profile.error) profile = compute(DEFAULT);

  function setBirth(birth) {
    const p = compute(birth); if (p.error) return p;
    profile = p; api.profile = p;
    try { localStorage.setItem(KEY, JSON.stringify(birth)); } catch (_) {}
    return p;
  }

  // 오늘 (한국 날짜 기준)
  const now = new Date(Date.now() + 9 * 3600000);
  const TODAY = new Date(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());

  function dayPillar(date) { return ganzhi(dayIndex(date.getFullYear(), date.getMonth() + 1, date.getDate())); }
  // 그날 필요한 기운 (시연 규칙): 원국 + 일진 두 글자의 오행을 더해 가장 적은 기운. 동률이면 일간을 생해 주는 기운 → 순서
  function needFor(date) {
    const dp = dayPillar(date);
    const dayEls = [STEM[dp.stem][1], BRANCH[dp.branch][1]];
    const c = { ...profile.count }; dayEls.forEach(e => c[e]++);
    const helper = GEN_BY[profile.dayMaster];
    const order = ['wood', 'fire', 'earth', 'metal', 'water'].sort((a, b) => c[a] - c[b] || (b === helper) - (a === helper));
    return { pillar: dp, dayEls, need: order[0], next: order[1], after: c };
  }
  // 시연용 기록: 사람(생일)마다 다른 결정적 의사난수
  function history(days = 35) {
    const out = [];
    for (let i = days - 1; i >= 0; i--) {
      const dt = new Date(TODAY); dt.setDate(dt.getDate() - i);
      const n = needFor(dt);
      const seed = mod(Math.floor(Math.sin(profile.seed * 0.137 + dt.getDate() * 12.9898 + dt.getMonth() * 78.233) * 43758.5453), 11);
      const fill = i === 0 ? null : (seed < 2 ? 0 : seed < 5 ? 10 + seed * 2 : 30);
      out.push({ date: dt, ...n, fill });
    }
    return out;
  }
  const api = { STEM, BRANCH, STEM_MEAN, GEN, GEN_BY, profile, compute, setBirth, sunLongitude, lunarToSolar, dayPillar, needFor, history, TODAY, DEFAULT };
  window.OhwaSaju = api;
})();
