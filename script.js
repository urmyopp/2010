/* =====================================================================
   CẤU HÌNH: sửa phần này để đổi nội dung thư. Không cần đụng code bên dưới.
   Trong câu chữ có thể dùng:
     {I}  = cách tự xưng (mình / anh / con / em)
     {U}  = cách gọi người nhận (bạn / em / mẹ / chị)
     {Ic} = {I} viết hoa chữ đầu, {Uc} = {U} viết hoa chữ đầu
   ===================================================================== */
var CONFIG = {
  name: 'tình yêu của mình',          // Tên người nhận, ví dụ 'Lan'. Để trống thì thư mở đầu bằng 'Gửi {Uc},'
  from: 'nhân tình của em',          // Tên của bạn, ký ở cuối thư. ĐIỀN TÊN VÀO ĐÂY, ví dụ 'Minh'. Để trống thì thư không có chữ ký
  rel: 'friend',     // Cách xưng hô: 'friend' (mình - bạn), 'love' (anh - em), 'mom' (con - mẹ), 'sis' (em - chị)
  note: '',          // Lời riêng, hiện thành một đoạn viết tay trước lời kết. Để trống thì bỏ qua

  lines: [           // Các đoạn của thư, hiện lần lượt từng dòng. Thêm, xoá, sửa tuỳ ý
    'Hôm nay là ngày tri ân những người phụ nữ. Em đã nhớ tri ân bản thân mình chưa?',
    'Cảm ơn em vì đã luôn kiên nhẫn những lúc mình trông có vẻ trẻ con.',
    'Cảm ơn em vì những khi bất đồng vẫn ở đấy lắng nghe mình giải thích.',
    'Cảm ơn em vì những lo lắng và suy tư đã bỏ ra cho một người nôm có vẻ xa lạ này (giờ là người yêu em).',
    'Cảm ơn em vì những gì bản thân đã hoàn thành cho đến hiện tại, em đã làm tốt rồi.',
    'Cảm ơn em vì luôn luôn cố gắng dù có những lúc áp lực làm em kiệt sức.',
    'Cũng cảm ơn em, vì đã nắm tay mình thật lâu, trên chặng đường chông gai này.',
    'Mong em sẽ có những đêm ngon giấc, tận hưởng được nhiều niềm vui, và làm được mọi điều mà mình khao khát.',
    'Chúc em có một ngày thật ấm áp và hạnh phúc.'
  ],
  closing: 'nhớ người da diết',   // Câu kết, chữ nghiêng

  autoOpenMs: 0       // Sau bao nhiêu mili giây phong bì tự mở nếu chưa ai chạm. Đặt 0 để chỉ mở khi chạm
};

(function () {
  'use strict';
  var $ = function (s) { return document.querySelector(s); };
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var HEART = 'M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z';

  /* ---------- Nội dung thư ---------- */
  var RELS = {
    friend: { I: 'mình', U: 'bạn' },
    love: { I: 'anh', U: 'em' },
    mom: { I: 'con', U: 'mẹ' },
    sis: { I: 'em', U: 'chị' }
  };
  var state = { name: CONFIG.name, from: CONFIG.from, rel: CONFIG.rel, note: CONFIG.note };
  if (!RELS[state.rel]) state.rel = 'friend';

  function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }
  function fill(t, I, U, Ic, Uc) {
    return t.split('{Ic}').join(Ic).split('{Uc}').join(Uc).split('{I}').join(I).split('{U}').join(U);
  }
  var box = $('#lines');
  var opened = false;

  function build() {
    var r = RELS[state.rel], I = r.I, U = r.U, Ic = cap(I), Uc = cap(U);
    var name = state.name.trim(), from = state.from.trim(), note = state.note.trim();
    $('#greet').textContent = 'Gửi ' + (name || Uc) + ',';
    $('#cardTo').textContent = name || Uc;

    var items = CONFIG.lines.map(function (t) { return ['line', fill(t, I, U, Ic, Uc)]; });
    if (note) items.push(['line note', note]);
    if (CONFIG.closing) items.push(['line closing', fill(CONFIG.closing, I, U, Ic, Uc)]);
    if (from) items.push(['line sign', from]);

    box.replaceChildren();
    items.forEach(function (it, i) {
      var el = document.createElement('div');
      el.className = it[0];
      if (it[0].indexOf('note') > -1) {
        var lab = document.createElement('span'); lab.className = 'note-label'; lab.textContent = 'Lời riêng';
        var tx = document.createElement('span'); tx.className = 'note-text'; tx.textContent = it[1];
        el.appendChild(lab); el.appendChild(tx);
      } else {
        el.textContent = it[1];
      }
      el.style.setProperty('--d', opened ? '0s' : (0.15 + i * 0.85).toFixed(2) + 's');
      if (opened) el.classList.add('in');
      box.appendChild(el);
    });
  }

  /* ---------- Mở phong bì ---------- */
  var env = $('#env'), reveal = $('#reveal'), hint = $('#hint');
  reveal.inert = true;
  var autoTimer = null;

  function openLetter() {
    if (opened) return;
    clearTimeout(autoTimer);
    opened = true;
    env.classList.add('open');
    env.setAttribute('aria-expanded', 'true');
    hint.classList.add('gone');
    var t = reduce ? 0 : 1000;
    setTimeout(function () { reveal.inert = false; reveal.classList.add('show'); }, t);
    setTimeout(function () {
      box.querySelectorAll('.line').forEach(function (el) { el.classList.add('in'); });
    }, t + (reduce ? 0 : 500));
  }
  env.addEventListener('click', openLetter);
  env.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openLetter(); }
  });
  if (CONFIG.autoOpenMs > 0) autoTimer = setTimeout(openLetter, CONFIG.autoOpenMs);

  /* ---------- Cánh hoa rơi ---------- */
  var pc = $('#petals'), px = pc.getContext('2d');
  var pw = 0, ph = 0, petals = [];
  var PCOL = ['255,182,200', '255,212,222', '244,150,175', '255,226,194', '226,170,215'];

  function newPetal(anywhere) {
    return {
      x: Math.random() * pw,
      y: anywhere ? Math.random() * ph : -20 - Math.random() * 60,
      s: 6 + Math.random() * 8,
      vy: 18 + Math.random() * 26,
      rot: Math.random() * 6.28,
      vr: (Math.random() - 0.5) * 1.6,
      t: Math.random() * 10,
      flip: Math.random() * 6.28,
      vf: 1 + Math.random() * 1.5,
      col: PCOL[(Math.random() * PCOL.length) | 0],
      a: 0.45 + Math.random() * 0.35
    };
  }
  function sizeP() {
    var d = Math.min(window.devicePixelRatio || 1, 1.5);
    pw = window.innerWidth; ph = window.innerHeight;
    pc.width = Math.round(pw * d); pc.height = Math.round(ph * d);
    px.setTransform(d, 0, 0, d, 0, 0);
    var n = Math.max(14, Math.min(40, Math.round(pw / 26)));
    while (petals.length < n) petals.push(newPetal(true));
    if (petals.length > n) petals.length = n;
  }
  function stepPetals(dt) {
    petals.forEach(function (p) {
      p.t += dt;
      p.y += p.vy * dt;
      p.x += (Math.sin(p.t * 0.9) * 22 + 6) * dt;
      p.rot += p.vr * dt;
      p.flip += p.vf * dt;
      if (p.y > ph + 20 || p.x > pw + 30) { var q = newPetal(false); p.x = q.x; p.y = q.y; }
    });
  }
  function drawPetals() {
    px.clearRect(0, 0, pw, ph);
    petals.forEach(function (p) {
      var s = p.s;
      px.save();
      px.translate(p.x, p.y);
      px.rotate(p.rot);
      px.scale(1, 0.25 + 0.75 * Math.abs(Math.cos(p.flip)));
      px.fillStyle = 'rgba(' + p.col + ',' + p.a + ')';
      px.beginPath();
      px.moveTo(0, -s);
      px.bezierCurveTo(s * 0.9, -s * 0.5, s * 0.7, s * 0.7, 0, s);
      px.bezierCurveTo(-s * 0.7, s * 0.7, -s * 0.9, -s * 0.5, 0, -s);
      px.fill();
      px.restore();
    });
  }

  /* ---------- Vườn hoa ---------- */
  var gc = $('#garden'), gx = gc.getContext('2d');
  var gw = 0, gh = 0, GROUND = 16;
  var flowers = [];
  function sizeG() {
    var d = Math.min(window.devicePixelRatio || 1, 2);
    var r = gc.getBoundingClientRect();
    if (!r.width) return;
    gw = r.width; gh = r.height;
    gc.width = Math.round(gw * d); gc.height = Math.round(gh * d);
    gx.setTransform(d, 0, 0, d, 0, 0);
  }
  function easeOutBack(x) { var c1 = 1.2, c3 = c1 + 1; return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2); }
  function easeInOut(x) { return x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2; }
  function clamp01(x) { return Math.max(0, Math.min(1, x)); }

  var MAX_FLOWERS = 100;   // Số bông hoa tối đa trong vườn
  var lastKind = -1;

  function updateCount() {
    $('#count').textContent = flowers.length >= MAX_FLOWERS
      ? 'Vườn đã đầy, ' + MAX_FLOWERS + ' bông hoa.'
      : 'Vườn có ' + flowers.length + ' / ' + MAX_FLOWERS + ' bông hoa.';
  }

  function plant(fx, cy, kind) {
    if (flowers.length >= MAX_FLOWERS) { updateCount(); return false; }
    if (!gw) sizeG();
    if (kind === undefined) {
      do { kind = (Math.random() * FLOWERS.length) | 0; } while (kind === lastKind && FLOWERS.length > 1);
    }
    lastKind = kind;
    var maxH = gh - GROUND - 40;
    var h = Math.max(70, Math.min(maxH, gh - GROUND - cy));
    flowers.push({
      fx: Math.max(0.07, Math.min(0.93, fx)),
      h: h,
      lean: (Math.random() - 0.5) * 50,
      R: (20 + Math.random() * 10 + h * 0.04) * FLOWERS[kind].k,
      kind: kind,
      born: performance.now(),
      seed: Math.random() * 10
    });
    updateCount();
    announce(kind);
    if (reduce) drawGarden(performance.now());
    return true;
  }

  /* Ba loài hoa: 0 hồng đỏ, 1 tulip, 2 hướng dương. Gốc toạ độ là đầu cuống hoa. */
  function drawRose(R, b) {
    var layers = [
      { r: 1.0, n: 5, c: '#9e1230', o: 0.2 },
      { r: 0.76, n: 5, c: '#bf1c3b', o: 0.9 },
      { r: 0.54, n: 4, c: '#d92b4b', o: 0.4 },
      { r: 0.33, n: 3, c: '#ea4a67', o: 1.1 }
    ];
    gx.lineWidth = 1;
    gx.strokeStyle = 'rgba(60,0,16,0.35)';
    layers.forEach(function (l) {
      var pr = R * l.r * 0.5 * b, d = R * l.r * 0.52 * b;
      gx.fillStyle = l.c;
      for (var k = 0; k < l.n; k++) {
        var a = l.o + k * 6.2832 / l.n;
        gx.beginPath();
        gx.arc(Math.sin(a) * d, -Math.cos(a) * d, pr, 0, 6.2832);
        gx.fill();
        gx.stroke();
      }
    });
    gx.fillStyle = '#b3173a';
    gx.beginPath();
    gx.arc(0, 0, R * 0.12 * b, 0, 6.2832);
    gx.fill();
    gx.strokeStyle = 'rgba(110,8,30,0.75)';
    gx.lineWidth = 1.2;
    gx.beginPath();
    gx.arc(0, 0, R * 0.1 * b, 0.4, 5.4);
    gx.stroke();
  }

  function drawTulip(R, b) {
    var w = R * 0.62 * b, h = R * 1.5 * b;
    function side(sg, fill) {
      gx.fillStyle = fill;
      gx.beginPath();
      gx.moveTo(0, 0);
      gx.bezierCurveTo(sg * w, -h * 0.05, sg * w * 1.08, -h * 0.62, sg * w * 0.42, -h);
      gx.bezierCurveTo(sg * w * 0.22, -h * 0.68, sg * w * 0.08, -h * 0.36, 0, 0);
      gx.fill();
    }
    side(-1, '#ff6f94');
    side(1, '#ff5483');
    var g = gx.createLinearGradient(0, 0, 0, -h);
    g.addColorStop(0, '#ff7fa0');
    g.addColorStop(1, '#ffb3c6');
    gx.fillStyle = g;
    gx.beginPath();
    gx.moveTo(0, 0);
    gx.bezierCurveTo(-w * 0.85, -h * 0.1, -w * 0.72, -h * 0.78, 0, -h * 1.08);
    gx.bezierCurveTo(w * 0.72, -h * 0.78, w * 0.85, -h * 0.1, 0, 0);
    gx.fill();
  }

  function drawSunflower(R, b) {
    var n = 15;
    [['#ffb703', 0.12], ['#ffd23f', 0]].forEach(function (L) {
      gx.fillStyle = L[0];
      for (var k = 0; k < n; k++) {
        gx.save();
        gx.rotate(k * 6.2832 / n + L[1]);
        gx.beginPath();
        gx.ellipse(0, -R * 0.72 * b, R * 0.13 * b, R * 0.36 * b, 0, 0, 6.2832);
        gx.fill();
        gx.restore();
      }
    });
    gx.fillStyle = '#5b3014';
    gx.beginPath();
    gx.arc(0, 0, R * 0.38 * b, 0, 6.2832);
    gx.fill();
    gx.fillStyle = '#2e1608';
    for (var i = 0; i < 22; i++) {
      var a = i * 2.399963, r = Math.sqrt(i / 22) * R * 0.3 * b;
      gx.beginPath();
      gx.arc(Math.cos(a) * r, Math.sin(a) * r, R * 0.028 * b, 0, 6.2832);
      gx.fill();
    }
  }
  /* Hàm phụ cho các cánh hoa */
  function circ(x, y, r) { gx.beginPath(); gx.arc(x, y, r, 0, 6.2832); }
  function pointed(w, L) {
    gx.beginPath();
    gx.moveTo(0, 0);
    gx.bezierCurveTo(-w, -L * 0.35, -w * 0.7, -L * 0.8, 0, -L);
    gx.bezierCurveTo(w * 0.7, -L * 0.8, w, -L * 0.35, 0, 0);
  }

  function drawDaisy(R, b) {
    var n = 17;
    gx.fillStyle = '#ffffff';
    gx.strokeStyle = 'rgba(150,110,140,0.35)';
    gx.lineWidth = 0.8;
    for (var k = 0; k < n; k++) {
      gx.save();
      gx.rotate(k * 6.2832 / n);
      gx.beginPath();
      gx.ellipse(0, -R * 0.7 * b, R * 0.1 * b, R * 0.34 * b, 0, 0, 6.2832);
      gx.fill();
      gx.stroke();
      gx.restore();
    }
    gx.fillStyle = '#ffc83d';
    circ(0, 0, R * 0.27 * b); gx.fill();
    gx.fillStyle = '#e8a317';
    circ(R * 0.05 * b, -R * 0.05 * b, R * 0.1 * b); gx.fill();
  }

  function drawCherry(R, b) {
    var w = R * 0.3 * b, L = R * 0.98 * b;
    gx.fillStyle = '#ffc2d6';
    gx.strokeStyle = 'rgba(224,100,140,0.55)';
    gx.lineWidth = 0.8;
    for (var k = 0; k < 5; k++) {
      gx.save();
      gx.rotate(k * 6.2832 / 5);
      gx.beginPath();
      gx.moveTo(0, 0);
      gx.bezierCurveTo(-w, -L * 0.25, -w * 1.15, -L * 0.85, -w * 0.3, -L);
      gx.lineTo(0, -L * 0.88);
      gx.lineTo(w * 0.3, -L);
      gx.bezierCurveTo(w * 1.15, -L * 0.85, w, -L * 0.25, 0, 0);
      gx.fill();
      gx.stroke();
      gx.restore();
    }
    gx.strokeStyle = '#d6457a';
    gx.fillStyle = '#d6457a';
    gx.lineWidth = 1;
    for (var s = 0; s < 8; s++) {
      var a = s * 6.2832 / 8, x = Math.sin(a) * R * 0.3 * b, y = -Math.cos(a) * R * 0.3 * b;
      gx.beginPath(); gx.moveTo(0, 0); gx.lineTo(x, y); gx.stroke();
      circ(x, y, R * 0.03 * b + 0.3); gx.fill();
    }
  }

  function drawLavender(R, b) {
    var n = 10, H = R * 1.9 * b;
    for (var i = 0; i < n; i++) {
      var t = i / (n - 1), y = -t * H, s = (1 - t * 0.5) * R * 0.13 * b;
      gx.fillStyle = i % 2 ? '#a58af0' : '#8f6fe0';
      gx.beginPath(); gx.ellipse(-s * 0.9, y, s, s * 1.3, -0.4, 0, 6.2832); gx.fill();
      gx.fillStyle = i % 2 ? '#8f6fe0' : '#b79cf5';
      gx.beginPath(); gx.ellipse(s * 0.9, y - s * 0.5, s, s * 1.3, 0.4, 0, 6.2832); gx.fill();
    }
    gx.fillStyle = '#b79cf5';
    circ(0, -H - R * 0.1 * b, R * 0.09 * b); gx.fill();
  }

  function drawLotus(R, b) {
    function row(angles, L, w, c0) {
      angles.forEach(function (deg) {
        gx.save();
        gx.rotate(deg * Math.PI / 180);
        var g = gx.createLinearGradient(0, 0, 0, -L);
        g.addColorStop(0, c0);
        g.addColorStop(1, '#fff2f7');
        gx.fillStyle = g;
        pointed(w, L);
        gx.fill();
        gx.strokeStyle = 'rgba(200,80,130,0.3)';
        gx.lineWidth = 0.7;
        gx.stroke();
        gx.restore();
      });
    }
    row([-62, -31, 0, 31, 62], R * 1.15 * b, R * 0.3 * b, '#f27fae');
    row([-46, -15, 15, 46], R * 0.92 * b, R * 0.28 * b, '#f9a3c4');
    gx.fillStyle = '#ffd36b';
    circ(0, -R * 0.12 * b, R * 0.1 * b); gx.fill();
  }

  function drawHydrangea(R, b) {
    var cols = ['#7aa7ff', '#9a8cff', '#b08cf5', '#8fc0ff'], n = 24;
    for (var i = 0; i < n; i++) {
      var a = i * 2.399963, r = Math.sqrt((i + 0.5) / n) * R * 0.8 * b;
      var x = Math.cos(a) * r, y = Math.sin(a) * r, pr = R * 0.11 * b;
      gx.fillStyle = cols[i % 4];
      for (var k = 0; k < 4; k++) {
        var q = k * 1.5708 + a;
        circ(x + Math.cos(q) * pr, y + Math.sin(q) * pr, pr); gx.fill();
      }
      gx.fillStyle = '#eef3ff';
      circ(x, y, pr * 0.35); gx.fill();
    }
  }

  function drawForgetMeNot(R, b) {
    [[0, -R * 0.15, 1], [-R * 0.55, R * 0.2, 0.8], [R * 0.55, R * 0.1, 0.85]].forEach(function (p) {
      var s = p[2] * R * 0.22 * b;
      gx.fillStyle = '#6fa8ff';
      for (var k = 0; k < 5; k++) {
        var a = k * 6.2832 / 5;
        circ(p[0] + Math.sin(a) * s * 1.05, p[1] - Math.cos(a) * s * 1.05, s); gx.fill();
      }
      gx.fillStyle = '#ffe066';
      circ(p[0], p[1], s * 0.5); gx.fill();
    });
  }

  function drawDahlia(R, b) {
    var layers = [[16, 1.0, 0.14, '#c2255c', 0], [14, 0.78, 0.14, '#e0407a', 0.2], [12, 0.58, 0.13, '#f06292', 0.1], [9, 0.38, 0.12, '#ff9bbc', 0.3]];
    gx.strokeStyle = 'rgba(80,0,40,0.25)';
    gx.lineWidth = 0.7;
    layers.forEach(function (l) {
      gx.fillStyle = l[3];
      for (var k = 0; k < l[0]; k++) {
        gx.save();
        gx.rotate(k * 6.2832 / l[0] + l[4]);
        pointed(R * l[2] * b, R * l[1] * b);
        gx.fill();
        gx.stroke();
        gx.restore();
      }
    });
    gx.fillStyle = '#ffd27a';
    circ(0, 0, R * 0.1 * b); gx.fill();
  }

  function drawCarnation(R, b) {
    var layers = [[0.85, 18, '#ee5f8b'], [0.6, 14, '#f5809f'], [0.36, 10, '#ffa6bf']];
    layers.forEach(function (l) {
      var r = R * l[0] * b, n = l[1];
      gx.fillStyle = l[2];
      circ(0, 0, r); gx.fill();
      for (var k = 0; k < n; k++) {
        var a = k * 6.2832 / n;
        circ(Math.sin(a) * r, -Math.cos(a) * r, R * 0.13 * b * (l[0] + 0.4)); gx.fill();
      }
    });
  }

  function drawLily(R, b) {
    var L = R * 1.15 * b, w = R * 0.21 * b;
    [60, 180, 300, 0, 120, 240].forEach(function (deg, idx) {
      gx.save();
      gx.rotate(deg * Math.PI / 180);
      var g = gx.createLinearGradient(0, 0, 0, -L);
      g.addColorStop(0, '#ff8fb0');
      g.addColorStop(0.5, '#ffe3ec');
      g.addColorStop(1, '#ffffff');
      gx.fillStyle = g;
      pointed(idx < 3 ? w * 0.9 : w, idx < 3 ? L * 0.94 : L);
      gx.fill();
      gx.strokeStyle = 'rgba(230,110,150,0.45)';
      gx.lineWidth = 0.8;
      gx.beginPath(); gx.moveTo(0, 0); gx.lineTo(0, -L * 0.6); gx.stroke();
      gx.restore();
    });
    gx.strokeStyle = '#c97a2c';
    gx.fillStyle = '#c97a2c';
    gx.lineWidth = 1;
    for (var s = 0; s < 6; s++) {
      var a = s * 6.2832 / 6 + 0.5, x = Math.sin(a) * R * 0.45 * b, y = -Math.cos(a) * R * 0.45 * b;
      gx.beginPath(); gx.moveTo(0, 0); gx.lineTo(x, y); gx.stroke();
      circ(x, y, R * 0.04 * b + 0.3); gx.fill();
    }
  }

  /* Danh sách loài hoa. Ba loài đầu mọc đầu tiên khi cuộn tới vườn, sau đó mỗi lần chạm mọc ngẫu nhiên.
     Toàn bộ bảng thông tin hoa phía trên vườn và dòng 'Vừa trồng' phía dưới vườn đều lấy từ danh sách này.
     name: tên hoa. mean: ý nghĩa. c: màu chấm. k: độ lớn. draw: hàm vẽ. */
  var FLOWERS = [
    { name: 'Hoa hồng', mean: 'luôn luôn nồng nhiệt', c: '#c41e3a', k: 0.95, draw: drawRose },
    { name: 'Hoa tulip', mean: 'đong đầy chân thành', c: '#ff6f94', k: 1, draw: drawTulip },
    { name: 'Hoa hướng dương', mean: 'mang màu hy vọng', c: '#ffc83d', k: 1.05, draw: drawSunflower },
    { name: 'Cúc họa mi', mean: 'thỉnh thoảng thuần khiết', c: '#ffffff', k: 1, draw: drawDaisy },
    { name: 'Hoa anh đào', mean: 'đôi khi mong manh', c: '#ffbfd3', k: 1, draw: drawCherry },
    { name: 'Oải hương', mean: 'e ấp dịu dàng', c: '#9b7bdc', k: 1, draw: drawLavender },
    { name: 'Hoa sen', mean: 'nghiêm túc', c: '#f7a8c6', k: 1.05, draw: drawLotus },
    { name: 'Cẩm tú cầu', mean: 'rực rỡ sắc màu', c: '#8fa8ff', k: 1, draw: drawHydrangea },
    { name: 'Lưu ly', mean: 'ngập tràn nỗi nhớ', c: '#6fa8ff', k: 1.1, draw: drawForgetMeNot },
    { name: 'Thược dược', mean: 'luôn trân trọng nhau', c: '#e0407a', k: 1.05, draw: drawDahlia },
    { name: 'Cẩm chướng hồng', mean: 'vô cùng đáng yêu', c: '#f06c95', k: 1, draw: drawCarnation },
    { name: 'Hoa ly', mean: 'mãi mãi', c: '#fff0f4', k: 1.05, draw: drawLily }
  ];

  var legendItems = [];
  var plantedEl = $('#planted');

  (function buildLegend() {
    var ul = $('#meanings');
    FLOWERS.forEach(function (fl) {
      var li = document.createElement('li');
      var dot = document.createElement('i');
      dot.style.setProperty('--c', fl.c);
      var nm = document.createElement('b');
      nm.textContent = fl.name;
      li.appendChild(dot);
      li.appendChild(nm);
      li.appendChild(document.createTextNode(fl.mean));
      ul.appendChild(li);
      legendItems.push(li);
    });
  })();

  /* Báo loài hoa vừa trồng: sáng dòng thông tin của loài đó và ghi tên dưới vườn */
  function announce(kind) {
    legendItems.forEach(function (li) { li.classList.remove('on'); });
    if (legendItems[kind]) legendItems[kind].classList.add('on');
    var fl = FLOWERS[kind];
    plantedEl.replaceChildren();
    var dot = document.createElement('i');
    dot.style.setProperty('--c', fl.c);
    var nm = document.createElement('b');
    nm.textContent = fl.name;
    plantedEl.appendChild(document.createTextNode('Vừa trồng'));
    plantedEl.appendChild(dot);
    plantedEl.appendChild(nm);
  }

  function drawGarden(now) {
    if (!gw) return;
    gx.clearRect(0, 0, gw, gh);
    var g = gx.createLinearGradient(0, gh - GROUND - 8, 0, gh);
    g.addColorStop(0, 'rgba(120,70,100,0)');
    g.addColorStop(1, 'rgba(90,45,80,0.9)');
    gx.fillStyle = g;
    gx.fillRect(0, gh - GROUND - 8, gw, GROUND + 8);

    flowers.forEach(function (f) {
      var p = reduce ? 1 : clamp01((now - f.born) / 2600);
      var bx = f.fx * gw, by = gh - GROUND;
      var sway = reduce ? 0 : Math.sin(now / 1100 + f.seed) * 3 * p;
      var cx = bx + f.lean, cy = by - f.h * 0.55;
      var ex = bx + f.lean * 0.4 + sway, ey = by - f.h;
      function B(u) {
        var a = (1 - u) * (1 - u), b = 2 * (1 - u) * u, c = u * u;
        return { x: a * bx + b * cx + c * ex, y: a * by + b * cy + c * ey };
      }
      var s = easeInOut(clamp01(p / 0.5));
      if (s <= 0) return;

      gx.strokeStyle = '#68b387';
      gx.lineWidth = 2.5;
      gx.lineCap = 'round';
      gx.beginPath();
      gx.moveTo(bx, by);
      for (var i = 1; i <= 24; i++) { var q = B(s * i / 24); gx.lineTo(q.x, q.y); }
      gx.stroke();

      if (s > 0.45) {
        var ls = clamp01((s - 0.4) / 0.4);
        var L = B(0.4), dir = f.lean >= 0 ? -1 : 1;
        gx.save();
        gx.translate(L.x, L.y);
        gx.rotate(dir * 0.9);
        gx.fillStyle = '#5aa57a';
        gx.beginPath();
        gx.ellipse(dir * 9 * ls, 0, 10 * ls, 4.5 * ls, 0, 0, 6.2832);
        gx.fill();
        gx.restore();
      }

      var H = B(s);
      var b = easeOutBack(clamp01((p - 0.45) / 0.55));
      if (b <= 0) return;
      gx.save();
      gx.translate(H.x, H.y);
      gx.rotate(reduce ? 0 : Math.sin(now / 1300 + f.seed) * 0.06);
      FLOWERS[f.kind].draw(f.R, b);
      gx.restore();
    });
  }

  var gardenStarted = false;
  function startGarden() {
    if (gardenStarted) return;
    gardenStarted = true;
    sizeG();
    [0.22, 0.5, 0.78].forEach(function (fx, i) {
      setTimeout(function () { plant(fx, gh * (0.22 + 0.1 * i), i); }, reduce ? 0 : i * 700);
    });
  }
  if ('IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { startGarden(); io.disconnect(); } });
    }, { threshold: 0.4 });
    io.observe(gc);
  } else { startGarden(); }

  gc.addEventListener('click', function (e) {
    var r = gc.getBoundingClientRect();
    if (!gardenStarted) { gardenStarted = true; sizeG(); }
    plant((e.clientX - r.left) / r.width, e.clientY - r.top);
  });

  /* ---------- Trái tim bay ---------- */
  var love = $('#love'), layer = $('#hearts'), sentEl = $('#sent'), sent = 0;
  var HCOL = ['#ffb3c4', '#f58aa5', '#ffd9e1', '#f2cb8c', '#e98fc0'];
  love.addEventListener('click', function () {
    var r = love.getBoundingClientRect();
    var x = r.left + r.width / 2, y = r.top + r.height / 2;
    var n = 14;
    if (!reduce) {
      for (var i = 0; i < n; i++) {
        var svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
        svg.setAttribute('viewBox', '0 0 24 24');
        svg.setAttribute('class', 'h');
        var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
        path.setAttribute('d', HEART);
        svg.appendChild(path);
        svg.style.left = x + 'px';
        svg.style.top = y + 'px';
        svg.style.setProperty('--s', (14 + Math.random() * 18).toFixed(0) + 'px');
        svg.style.setProperty('--c', HCOL[(Math.random() * HCOL.length) | 0]);
        svg.style.setProperty('--dx', ((Math.random() - 0.5) * 220).toFixed(0) + 'px');
        svg.style.setProperty('--dy', (-(window.innerHeight * (0.35 + Math.random() * 0.4))).toFixed(0) + 'px');
        svg.style.setProperty('--rot', ((Math.random() - 0.5) * 60).toFixed(0) + 'deg');
        svg.style.setProperty('--dur', (1.8 + Math.random() * 1.4).toFixed(2) + 's');
        svg.style.animationDelay = (Math.random() * 0.3).toFixed(2) + 's';
        layer.appendChild(svg);
        (function (el) { setTimeout(function () { el.remove(); }, 3800); })(svg);
      }
    }
    sent += n;
    sentEl.hidden = false;
    sentEl.textContent = 'Đã gửi ' + sent + ' trái tim.';
  });

  /* ---------- Khởi động ---------- */
  build();
  sizeP();
  window.addEventListener('resize', function () {
    sizeP(); sizeG();
    if (reduce) { drawPetals(); drawGarden(performance.now()); }
  });

  if (reduce) {
    drawPetals();
  } else {
    var last = performance.now();
    (function frame(now) {
      var dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      stepPetals(dt);
      drawPetals();
      if (flowers.length) drawGarden(now);
      requestAnimationFrame(frame);
    })(last);
  }
})();