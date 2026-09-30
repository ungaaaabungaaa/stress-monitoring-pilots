/* Stress Monitoring for Pilots. Local-only, no dependencies.
 * Scoring rules are documented in docs/research/05-system-design.md. */
(function () {
  'use strict';

  const STORE_KEY = 'smp.v1';
  const LIKERT = ['Never', 'Almost never', 'Sometimes', 'Fairly often', 'Very often'];

  // Perceived Stress Scale, 10-item version (Cohen, Kamarck & Mermelstein, 1983; Cohen & Williamson, 1988).
  // reverse: true means the item is positively worded and scored 4 - response.
  const PSS10 = [
    { t: 'been upset because of something that happened unexpectedly?' },
    { t: 'felt that you were unable to control the important things in your life?' },
    { t: 'felt nervous and stressed?' },
    { t: 'felt confident about your ability to handle your personal problems?', reverse: true },
    { t: 'felt that things were going your way?', reverse: true },
    { t: 'found that you could not cope with all the things that you had to do?' },
    { t: 'been able to control irritations in your life?', reverse: true },
    { t: 'felt that you were on top of things?', reverse: true },
    { t: 'been angered because of things that were outside of your control?' },
    { t: 'felt difficulties were piling up so high that you could not overcome them?' },
  ];
  // PSS-4 uses items 2, 4, 5 and 10 of the PSS-10.
  const PSS4 = [1, 3, 4, 9].map((i) => PSS10[i]);

  const SP_LABELS = {
    1: 'fully alert', 2: 'very lively', 3: 'okay', 4: 'a little tired',
    5: 'moderately tired', 6: 'extremely tired', 7: 'completely exhausted',
  };
  const IMSAFE_LABELS = {
    illness: 'Illness', medication: 'Medication', stress: 'Stress',
    alcohol: 'Alcohol', fatigue: 'Fatigue', emotion: 'Emotion',
  };

  /* ---------- storage ---------- */
  function load() {
    try {
      const raw = localStorage.getItem(STORE_KEY);
      const d = raw ? JSON.parse(raw) : null;
      return d && Array.isArray(d.checkins) && Array.isArray(d.pss) ? d : { checkins: [], pss: [] };
    } catch (e) {
      return { checkins: [], pss: [] };
    }
  }
  function save(d) {
    try { localStorage.setItem(STORE_KEY, JSON.stringify(d)); } catch (e) { /* storage unavailable */ }
  }
  let data = load();

  /* ---------- scoring ---------- */
  function scorePss(items, answers) {
    let total = 0;
    for (let i = 0; i < items.length; i++) {
      const v = answers[i];
      total += items[i].reverse ? 4 - v : v;
    }
    return total;
  }

  function pss10Band(s) {
    if (s <= 13) return { level: 'low', cls: 'green' };
    if (s <= 26) return { level: 'moderate', cls: 'amber' };
    return { level: 'high', cls: 'red' };
  }

  // Returns { state: 'green'|'amber'|'red', reasons: [...] }
  function assessReadiness(c) {
    const red = [];
    const amber = [];
    const f = c.imsafe;

    if (f.includes('illness')) red.push('Illness is flagged. Symptoms that affect performance are a no-go item on IM SAFE.');
    if (f.includes('medication')) red.push('Medication is flagged. Fly only with medication cleared by your aviation medical examiner.');
    if (f.includes('alcohol')) red.push('Alcohol is flagged. Regulations require a minimum bottle-to-throttle time and no residual impairment.');
    if (f.includes('stress')) amber.push('Stress is flagged. Consider whether the pressure on your mind will follow you into the cockpit.');
    if (f.includes('emotion')) amber.push('Emotion is flagged. Strong emotion narrows attention and slows decisions.');
    if (f.includes('fatigue')) amber.push('Fatigue is flagged on IM SAFE.');

    if (c.sleep < 5) red.push(`Only ${c.sleep} h of sleep in the last 24 h. Below 5 h, performance decline is comparable to legal alcohol impairment.`);
    else if (c.sleep < 6.5) amber.push(`${c.sleep} h of sleep is below the 7 h most adults need for full alertness.`);

    if (c.awake >= 17) red.push(`${c.awake} h awake at start of duty. After 17 h awake, performance is comparable to a 0.05% blood alcohol level.`);
    else if (c.awake >= 14) amber.push(`${c.awake} h awake at start of duty is a long day before the flight has begun.`);

    if (c.sp >= 6) red.push(`Samn-Perelli ${c.sp} (${SP_LABELS[c.sp]}). Levels 6 and 7 are considered unfit for duty in fatigue research.`);
    else if (c.sp >= 4) amber.push(`Samn-Perelli ${c.sp} (${SP_LABELS[c.sp]}). Monitor for further decline during duty.`);

    if (c.pss4 >= 12) red.push(`PSS-4 score of ${c.pss4}/16 indicates high perceived stress over the past month.`);
    else if (c.pss4 >= 8) amber.push(`PSS-4 score of ${c.pss4}/16 indicates elevated perceived stress over the past month.`);

    if (red.length) return { state: 'red', reasons: red.concat(amber) };
    if (amber.length) return { state: 'amber', reasons: amber };
    return { state: 'green', reasons: ['No IM SAFE flags, adequate sleep, low fatigue and low perceived stress.'] };
  }

  const ADVICE = {
    green: 'You look ready. Keep checking in, especially on long duty days.',
    amber: 'Proceed with caution. Talk it through with your crew, plan extra margin, and consider whether the amber items will get better or worse during the duty.',
    red: 'Stop and reconsider. At least one item is at a level that research associates with a real performance decline. Speak to your crew, your operator, or a peer support programme before you fly. Calling in unfit is a professional decision, not a failure.',
  };

  /* ---------- rendering helpers ---------- */
  const $ = (sel, root) => (root || document).querySelector(sel);
  const $$ = (sel, root) => Array.from((root || document).querySelectorAll(sel));
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const fmtDate = (iso) => new Date(iso).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  const fmtDateTime = (iso) => new Date(iso).toLocaleString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });

  function renderLikert(container, items, name) {
    container.innerHTML = items.map((it, i) => `
      <div class="likert">
        <p>${i + 1}. …${esc(it.t)}</p>
        <div class="opts" role="radiogroup">
          ${LIKERT.map((l, v) => `<label><input type="radio" name="${name}${i}" value="${v}" required><span>${l}</span></label>`).join('')}
        </div>
      </div>`).join('');
  }

  function readLikert(form, count, name) {
    const out = [];
    for (let i = 0; i < count; i++) {
      const el = form.querySelector(`input[name="${name}${i}"]:checked`);
      if (!el) return null;
      out.push(Number(el.value));
    }
    return out;
  }

  /* ---------- tabs ---------- */
  function showTab(id) {
    $$('.tab').forEach((t) => {
      const on = t.dataset.tab === id;
      t.classList.toggle('is-active', on);
      t.setAttribute('aria-selected', on ? 'true' : 'false');
    });
    $$('.panel').forEach((p) => p.classList.toggle('is-active', p.id === 'tab-' + id));
    if (id === 'dashboard') renderDashboard();
    window.scrollTo({ top: 0 });
  }
  $$('.tab').forEach((t) => t.addEventListener('click', () => showTab(t.dataset.tab)));

  /* ---------- check-in ---------- */
  renderLikert($('#pss4-items'), PSS4, 'p4_');
  const checkinForm = $('#checkin-form');
  checkinForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const fd = new FormData(checkinForm);
    const answers = readLikert(checkinForm, PSS4.length, 'p4_');
    if (!answers) { alert('Please answer all four stress questions.'); return; }
    const c = {
      at: new Date().toISOString(),
      imsafe: fd.getAll('imsafe'),
      sleep: Number(fd.get('sleep')),
      awake: Number(fd.get('awake')),
      sp: Number(fd.get('sp')),
      pss4: scorePss(PSS4, answers),
      notes: String(fd.get('notes') || '').trim(),
    };
    if (Number.isNaN(c.sleep) || Number.isNaN(c.awake)) { alert('Please enter hours slept and hours awake.'); return; }
    const r = assessReadiness(c);
    c.state = r.state;
    c.reasons = r.reasons;
    data.checkins.push(c);
    save(data);
    renderResult(c);
  });
  checkinForm.addEventListener('reset', () => { $('#result').hidden = true; });

  function renderResult(c) {
    const box = $('#result');
    const title = { green: 'Green: ready', amber: 'Amber: caution', red: 'Red: not ready' }[c.state];
    box.className = 'result ' + c.state;
    box.innerHTML = `
      <div class="verdict">${title}</div>
      <p>${esc(ADVICE[c.state])}</p>
      <strong>Why:</strong>
      <ul>${c.reasons.map((r) => `<li>${esc(r)}</li>`).join('')}</ul>
      <p><small>Saved ${fmtDateTime(c.at)}. This is a self-assessment aid, not a fitness certificate.</small></p>`;
    box.hidden = false;
    box.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  /* ---------- PSS-10 ---------- */
  renderLikert($('#pss10-items'), PSS10, 'p10_');
  const pssForm = $('#pss-form');
  pssForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const answers = readLikert(pssForm, PSS10.length, 'p10_');
    if (!answers) { alert('Please answer all ten questions.'); return; }
    const score = scorePss(PSS10, answers);
    const band = pss10Band(score);
    const entry = { at: new Date().toISOString(), score, answers };
    data.pss.push(entry);
    save(data);
    const box = $('#pss-result');
    box.className = 'result ' + band.cls;
    box.innerHTML = `
      <div class="verdict">PSS-10: ${score} / 40 (${band.level})</div>
      <p>${{
        low: 'Your perceived stress over the last month is in the low range.',
        moderate: 'Your perceived stress is in the moderate range. This is common, but worth watching if it persists or rises. Protecting sleep, exercise and time off has the best evidence for bringing it down.',
        high: 'Your perceived stress is in the high range. Sustained high stress affects sleep, attention and mood. Consider talking to a peer support programme, your aviation medical examiner, or a mental-health professional.',
      }[band.level]}</p>
      <p><small>Bands: 0 to 13 low, 14 to 26 moderate, 27 to 40 high. The PSS is a measure of perceived stress, not a clinical diagnosis.</small></p>`;
    box.hidden = false;
    box.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
  pssForm.addEventListener('reset', () => { $('#pss-result').hidden = true; });

  /* ---------- dashboard ---------- */
  function renderDashboard() {
    const recent = data.checkins.slice(-30);
    renderStats(recent);
    renderReadinessChart($('#chart-readiness'), recent);
    renderLineChart($('#chart-sleep'), recent.map((c) => ({ x: c.at, y: c.sleep })), { min: 0, max: 12, bands: [[0, 5, 'red'], [5, 6.5, 'amber']] });
    renderLineChart($('#chart-fatigue'), recent.map((c) => ({ x: c.at, y: c.sp })), { min: 1, max: 7, bands: [[6, 7, 'red'], [4, 6, 'amber']] });
    renderStressChart($('#chart-stress'), recent, data.pss.slice(-12));
    renderHistory(recent);
  }

  function renderStats(recent) {
    const n = recent.length;
    const last7 = data.checkins.filter((c) => Date.now() - new Date(c.at) < 7 * 864e5);
    const avg = (arr, k) => (arr.length ? (arr.reduce((s, c) => s + c[k], 0) / arr.length) : null);
    const reds = last7.filter((c) => c.state === 'red').length;
    const lastPss = data.pss.length ? data.pss[data.pss.length - 1] : null;
    const cells = [
      ['Check-ins (30 shown)', n],
      ['Avg sleep, 7 days', avg(last7, 'sleep') === null ? '–' : avg(last7, 'sleep').toFixed(1) + ' h'],
      ['Red days, 7 days', last7.length ? reds : '–'],
      ['Latest PSS-10', lastPss ? `${lastPss.score}/40` : '–'],
    ];
    $('#stats').innerHTML = cells.map(([l, v]) => `<div class="stat"><div class="label">${l}</div><div class="value">${v}</div></div>`).join('');
  }

  const COLOR = { green: 'var(--green)', amber: 'var(--amber)', red: 'var(--red)' };

  function renderReadinessChart(el, recent) {
    if (!recent.length) { el.innerHTML = '<div class="empty">No check-ins yet.</div>'; return; }
    const w = 600, h = 90, pad = 4;
    const bw = (w - pad * 2) / Math.max(recent.length, 10);
    const bars = recent.map((c, i) => {
      const x = pad + i * bw;
      const hh = { green: 30, amber: 55, red: 80 }[c.state];
      return `<rect x="${x + 1}" y="${h - hh}" width="${Math.max(bw - 2, 2)}" height="${hh}" rx="2" fill="${COLOR[c.state]}"><title>${fmtDateTime(c.at)}: ${c.state}</title></rect>`;
    }).join('');
    const labels = recent.map((c, i) => (i % Math.ceil(recent.length / 6) === 0 ? `<text x="${pad + i * bw + 1}" y="${h + 14}" font-size="10" fill="var(--muted)">${fmtDate(c.at)}</text>` : '')).join('');
    el.innerHTML = `<svg viewBox="0 0 ${w} ${h + 18}" role="img" aria-label="Readiness over time">${bars}${labels}</svg>`;
  }

  function renderLineChart(el, pts, opt) {
    if (!pts.length) { el.innerHTML = '<div class="empty">No data yet.</div>'; return; }
    const w = 600, h = 160, pl = 28, pr = 8, pt = 8, pb = 22;
    const iw = w - pl - pr, ih = h - pt - pb;
    const X = (i) => pl + (pts.length === 1 ? iw / 2 : (i / (pts.length - 1)) * iw);
    const Y = (v) => pt + ih - ((Math.min(Math.max(v, opt.min), opt.max) - opt.min) / (opt.max - opt.min)) * ih;
    const bands = (opt.bands || []).map(([a, b, c]) => `<rect x="${pl}" y="${Y(b)}" width="${iw}" height="${Y(a) - Y(b)}" fill="${COLOR[c]}" opacity="0.12"/>`).join('');
    const ticks = [opt.min, (opt.min + opt.max) / 2, opt.max].map((v) => `<text x="${pl - 6}" y="${Y(v) + 4}" text-anchor="end" font-size="10" fill="var(--muted)">${v}</text><line x1="${pl}" x2="${w - pr}" y1="${Y(v)}" y2="${Y(v)}" stroke="var(--line)"/>`).join('');
    const path = pts.map((p, i) => `${i ? 'L' : 'M'}${X(i).toFixed(1)},${Y(p.y).toFixed(1)}`).join(' ');
    const dots = pts.map((p, i) => `<circle cx="${X(i)}" cy="${Y(p.y)}" r="3" fill="var(--accent)"><title>${fmtDateTime(p.x)}: ${p.y}</title></circle>`).join('');
    const labels = pts.map((p, i) => (i % Math.ceil(pts.length / 6) === 0 ? `<text x="${X(i)}" y="${h - 6}" text-anchor="middle" font-size="10" fill="var(--muted)">${fmtDate(p.x)}</text>` : '')).join('');
    el.innerHTML = `<svg viewBox="0 0 ${w} ${h}" role="img">${bands}${ticks}<path d="${path}" fill="none" stroke="var(--accent)" stroke-width="2"/>${dots}${labels}</svg>`;
  }

  function renderStressChart(el, recent, pss) {
    if (!recent.length && !pss.length) { el.innerHTML = '<div class="empty">No data yet.</div>'; return; }
    // Normalise both scales to 0..1 so they share an axis.
    const series = [
      { pts: recent.map((c) => ({ x: c.at, y: c.pss4 / 16, raw: `PSS-4 ${c.pss4}/16` })), color: 'var(--accent)' },
      { pts: pss.map((p) => ({ x: p.at, y: p.score / 40, raw: `PSS-10 ${p.score}/40` })), color: 'var(--amber)' },
    ];
    const all = series.flatMap((s) => s.pts);
    const t0 = Math.min(...all.map((p) => +new Date(p.x)));
    const t1 = Math.max(...all.map((p) => +new Date(p.x)));
    const w = 600, h = 160, pl = 28, pr = 8, pt = 8, pb = 22, iw = w - pl - pr, ih = h - pt - pb;
    const X = (iso) => pl + (t1 === t0 ? iw / 2 : ((+new Date(iso) - t0) / (t1 - t0)) * iw);
    const Y = (v) => pt + ih - Math.min(Math.max(v, 0), 1) * ih;
    const bands = `<rect x="${pl}" y="${Y(1)}" width="${iw}" height="${Y(0.675) - Y(1)}" fill="${COLOR.red}" opacity="0.12"/><rect x="${pl}" y="${Y(0.675)}" width="${iw}" height="${Y(0.35) - Y(0.675)}" fill="${COLOR.amber}" opacity="0.12"/>`;
    const ticks = [['low', 0], ['mod.', 0.5], ['high', 1]].map(([l, v]) => `<text x="${pl - 6}" y="${Y(v) + 4}" text-anchor="end" font-size="10" fill="var(--muted)">${l}</text>`).join('');
    const lines = series.map((s) => {
      if (!s.pts.length) return '';
      const path = s.pts.map((p, i) => `${i ? 'L' : 'M'}${X(p.x).toFixed(1)},${Y(p.y).toFixed(1)}`).join(' ');
      const dots = s.pts.map((p) => `<circle cx="${X(p.x)}" cy="${Y(p.y)}" r="3" fill="${s.color}"><title>${fmtDateTime(p.x)}: ${p.raw}</title></circle>`).join('');
      return `<path d="${path}" fill="none" stroke="${s.color}" stroke-width="2"/>${dots}`;
    }).join('');
    const legend = `<circle cx="${pl + 6}" cy="${h - 8}" r="4" fill="var(--accent)"/><text x="${pl + 14}" y="${h - 4}" font-size="10" fill="var(--muted)">PSS-4 (daily)</text><circle cx="${pl + 110}" cy="${h - 8}" r="4" fill="var(--amber)"/><text x="${pl + 118}" y="${h - 4}" font-size="10" fill="var(--muted)">PSS-10 (weekly)</text>`;
    el.innerHTML = `<svg viewBox="0 0 ${w} ${h}" role="img" aria-label="Perceived stress over time">${bands}${ticks}${lines}${legend}</svg>`;
  }

  function renderHistory(recent) {
    const tb = $('#history tbody');
    if (!recent.length) { tb.innerHTML = '<tr><td colspan="7"><small>No check-ins yet. Complete one on the Check-in tab.</small></td></tr>'; return; }
    tb.innerHTML = recent.slice().reverse().map((c) => `
      <tr>
        <td>${fmtDateTime(c.at)}</td>
        <td><span class="pill ${c.state}">${c.state}</span></td>
        <td>${c.sleep} h</td>
        <td>${c.sp}</td>
        <td>${c.pss4}</td>
        <td>${c.imsafe.map((k) => IMSAFE_LABELS[k] || k).join(', ') || '–'}</td>
        <td><button class="link-btn" data-del="${c.at}" aria-label="Delete this check-in">✕</button></td>
      </tr>`).join('');
    $$('[data-del]', tb).forEach((b) => b.addEventListener('click', () => {
      data.checkins = data.checkins.filter((c) => c.at !== b.dataset.del);
      save(data);
      renderDashboard();
    }));
  }

  /* ---------- export / import / wipe ---------- */
  $('#export').addEventListener('click', () => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `stress-monitoring-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
  });
  $('#import').addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const d = JSON.parse(reader.result);
        if (!Array.isArray(d.checkins) || !Array.isArray(d.pss)) throw new Error('bad shape');
        const seen = new Set(data.checkins.map((c) => c.at));
        d.checkins.forEach((c) => { if (!seen.has(c.at)) data.checkins.push(c); });
        const seenP = new Set(data.pss.map((p) => p.at));
        d.pss.forEach((p) => { if (!seenP.has(p.at)) data.pss.push(p); });
        data.checkins.sort((a, b) => a.at.localeCompare(b.at));
        data.pss.sort((a, b) => a.at.localeCompare(b.at));
        save(data);
        renderDashboard();
      } catch (err) {
        alert('That file does not look like an export from this app.');
      }
      e.target.value = '';
    };
    reader.readAsText(file);
  });
  $('#wipe').addEventListener('click', () => {
    if (!confirm('Delete all check-ins and stress scores from this browser? This cannot be undone.')) return;
    data = { checkins: [], pss: [] };
    save(data);
    renderDashboard();
  });

  // Expose scoring for tests and for curious readers.
  window.SMP = { assessReadiness, scorePss, pss10Band, PSS10, PSS4 };
})();
