'use strict';

// ============================================================
//  メインループ & 描画処理
// ============================================================

// --- 描画：マップタイル ---
function drawMap() {
  const camX = G.camera.px;
  const camY = G.camera.py;
  const startCol = Math.floor(camX / T);
  const startRow = Math.floor(camY / T);
  const offX = -(camX % T);
  const offY = -(camY % T);

  for (let row = 0; row <= ROWS; row++) {
    for (let col = 0; col <= COLS; col++) {
      const mx = startCol + col;
      const my = startRow + row;
      const tile = getTile(mx, my);
      const gfx = tileGfx[tile];
      if (gfx) {
        ctx.drawImage(gfx, offX + col * T, offY + row * T);
      } else {
        ctx.fillStyle = '#000';
        ctx.fillRect(offX + col * T, offY + row * T, T, T);
      }
    }
  }

  // ワールドマップのロケーションアイコン描画
  if (G.mapId === 'world') {
    drawLocationIcon(5, 10, '村', '#ff8844', camX, camY);
    drawLocationIcon(18, 3, '街', '#4488ff', camX, camY);
    drawLocationIcon(17, 7, '洞', '#888888', camX, camY);
  }
}

function drawLocationIcon(mx, my, label, color, camX, camY) {
  const sx = mx * T - camX;
  const sy = my * T - camY;
  if (sx < -T || sx > COLS * T || sy < -T || sy > ROWS * T) return;
  // 点滅するマーカー
  const pulse = Math.sin(Date.now() / 300) * 0.3 + 0.7;
  ctx.globalAlpha = pulse;
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(sx + T / 2, sy + T / 2 - 8, 6, 0, Math.PI * 2);
  ctx.fill();
  // ラベル
  ctx.fillStyle = '#fff';
  ctx.font = 'bold 10px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText(label, sx + T / 2, sy + T / 2 - 14);
  ctx.globalAlpha = 1;
}

// --- 描画：NPC ---
function drawNPCs() {
  const camX = G.camera.px;
  const camY = G.camera.py;
  for (const npc of G.npcs) {
    const sx = npc.x * T - camX;
    const sy = npc.y * T - camY;
    if (sx < -T || sx > COLS * T || sy < -T || sy > ROWS * T) continue;
    drawCharSprite(ctx, sx, sy, npc.look, npc.dir, 0);
  }
}

// --- 描画：プレイヤー ---
function drawPlayer() {
  const p = G.player;
  const camX = G.camera.px;
  const camY = G.camera.py;
  let px = p.x * T - camX;
  let py = p.y * T - camY;
  let frame = 0;
  if (p.moving) {
    px += p.dx * T * p.step / MOVE_SPD;
    py += p.dy * T * p.step / MOVE_SPD;
    // 歩行アニメ（2フレームの足運び）
    frame = (Math.floor(p.step / (MOVE_SPD / 2)) % 2 === 0) ? 1 : 2;
  }
  drawCharSprite(ctx, px, py, PLAYER_LOOK, p.dir, frame);
}

// --- 描画：UI ---
function drawUI() {
  // 上部ステータスバー
  ctx.fillStyle = 'rgba(0, 0, 80, 0.85)';
  ctx.fillRect(0, 0, cv.width, 28);
  ctx.strokeStyle = '#8888cc';
  ctx.lineWidth = 1;
  ctx.strokeRect(0, 0, cv.width, 28);

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 13px sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('📍 ' + getMapName(G.mapId), 8, 19);

  ctx.textAlign = 'right';
  ctx.fillText('💰 ' + formatMoney(G.money), cv.width - 8, 19);

  // 目標表示（下部、ダイアログなしの時）
  if (G.state === 'EXPLORE') {
    const obj = getObjective();
    ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
    ctx.fillRect(0, cv.height - 22, cv.width, 22);
    ctx.fillStyle = '#ffdd88';
    ctx.font = '11px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('▶ ' + obj, cv.width / 2, cv.height - 7);
    // もちものヒント
    ctx.fillStyle = '#88aacc';
    ctx.font = '9px sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText('[X/B] もちもの', cv.width - 6, cv.height - 26);
  }
}

// --- 描画：ダイアログボックス ---
function drawDialogBox() {
  const d = G.dialog;
  const bx = 16, by = cv.height - 110, bw = cv.width - 32, bh = 96;

  // 外枠
  ctx.fillStyle = '#000044';
  ctx.fillRect(bx - 2, by - 2, bw + 4, bh + 4);
  ctx.fillStyle = '#000088';
  ctx.fillRect(bx, by, bw, bh);
  ctx.strokeStyle = '#aaaaff';
  ctx.lineWidth = 2;
  ctx.strokeRect(bx, by, bw, bh);
  ctx.strokeStyle = '#6666cc';
  ctx.lineWidth = 1;
  ctx.strokeRect(bx + 3, by + 3, bw - 6, bh - 6);

  // テキスト
  const text = d.lines[d.idx] || '';
  const displayText = text.substring(0, d.charIdx);
  ctx.fillStyle = '#ffffff';
  ctx.font = '14px sans-serif';
  ctx.textAlign = 'left';

  // テキスト折り返し
  const maxWidth = bw - 24;
  const lines = wrapText(displayText, maxWidth);
  for (let i = 0; i < Math.min(lines.length, 4); i++) {
    ctx.fillText(lines[i], bx + 12, by + 22 + i * 20);
  }

  // 続きマーク
  if (d.done) {
    const blink = Math.floor(Date.now() / 400) % 2;
    if (blink) {
      ctx.fillStyle = '#ffdd88';
      ctx.fillText('▼', bx + bw - 24, by + bh - 10);
    }
  }
}

function wrapText(text, maxWidth) {
  const lines = [];
  let line = '';
  for (const char of text) {
    line += char;
    if (ctx.measureText(line).width > maxWidth) {
      lines.push(line.slice(0, -1));
      line = char;
    }
  }
  if (line) lines.push(line);
  return lines;
}

// --- 描画：選択肢 ---
function drawChoiceBox() {
  const c = G.choice;
  const bx = 16, by = cv.height - 110, bw = cv.width - 32, bh = 96;

  // ダイアログボックスと同じ背景
  ctx.fillStyle = '#000044';
  ctx.fillRect(bx - 2, by - 2, bw + 4, bh + 4);
  ctx.fillStyle = '#000088';
  ctx.fillRect(bx, by, bw, bh);
  ctx.strokeStyle = '#aaaaff';
  ctx.lineWidth = 2;
  ctx.strokeRect(bx, by, bw, bh);

  // 質問テキスト
  ctx.fillStyle = '#ffffff';
  ctx.font = '13px sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText(c.question, bx + 12, by + 20);

  // 選択肢
  for (let i = 0; i < c.opts.length; i++) {
    const y = by + 42 + i * 22;
    if (i === c.sel) {
      ctx.fillStyle = '#ffdd88';
      ctx.fillText('▶ ', bx + 20, y);
    }
    ctx.fillStyle = i === c.sel ? '#ffdd88' : '#aaaacc';
    ctx.fillText(c.opts[i], bx + 38, y);
  }
}

// --- 描画：フェード ---
function drawFade() {
  if (G.fade.alpha > 0) {
    ctx.fillStyle = `rgba(0, 0, 0, ${G.fade.alpha})`;
    ctx.fillRect(0, 0, cv.width, cv.height);
  }

  // チャプター表示
  if (G.fade.alpha >= 0.95 && G.chapterTimer > 0) {
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 20px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('第' + G.chapter + '章', cv.width / 2, cv.height / 2 - 20);
    ctx.font = '16px sans-serif';
    ctx.fillText(G.chapterTitle, cv.width / 2, cv.height / 2 + 10);
    G.chapterTimer--;
  }
}

// --- 描画：タイトル画面 ---
function drawTitle() {
  // 背景
  ctx.fillStyle = '#001133';
  ctx.fillRect(0, 0, cv.width, cv.height);

  // 星空
  const time = Date.now() / 1000;
  for (let i = 0; i < 60; i++) {
    const sx = ((i * 137 + 50) % cv.width);
    const sy = ((i * 97 + 30) % (cv.height - 100));
    const brightness = Math.sin(time + i) * 0.3 + 0.7;
    ctx.fillStyle = `rgba(255, 255, 200, ${brightness})`;
    ctx.fillRect(sx, sy, 2, 2);
  }

  // 地面
  ctx.fillStyle = '#1a4a1a';
  ctx.fillRect(0, cv.height - 100, cv.width, 100);
  ctx.fillStyle = '#2a5a2a';
  for (let x = 0; x < cv.width; x += 40) {
    ctx.beginPath();
    ctx.arc(x + 20, cv.height - 100, 20 + (x % 60) / 3, Math.PI, 0);
    ctx.fill();
  }

  // タイトル
  ctx.fillStyle = '#ffcc00';
  ctx.font = 'bold 28px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('幸運の娘ハナ', cv.width / 2, 80);

  ctx.fillStyle = '#ffeeaa';
  ctx.font = '16px sans-serif';
  ctx.fillText('～ 宝くじ長者物語 ～', cv.width / 2, 110);

  // メニュー
  const opts = ['はじめから'];
  for (let i = 0; i < opts.length; i++) {
    const y = 200 + i * 30;
    ctx.fillStyle = i === G.titleSel ? '#ffdd88' : '#8888aa';
    ctx.font = '16px sans-serif';
    if (i === G.titleSel) {
      ctx.fillText('▶ ' + opts[i], cv.width / 2, y);
    } else {
      ctx.fillText(opts[i], cv.width / 2, y);
    }
  }

  // 操作説明
  ctx.fillStyle = '#6666aa';
  ctx.font = '11px sans-serif';
  ctx.fillText('矢印キー/WASD：移動　Space/Z：決定　X/Esc：キャンセル', cv.width / 2, cv.height - 30);
  ctx.fillText('モバイル：画面下のボタンで操作', cv.width / 2, cv.height - 14);
}

// --- 描画：エンディング ---
function drawEnding() {
  G.endTimer++;
  ctx.fillStyle = '#000000';
  ctx.fillRect(0, 0, cv.width, cv.height);

  const t = G.endTimer;

  if (t < 60) {
    // フェードイン
    ctx.globalAlpha = t / 60;
  } else {
    ctx.globalAlpha = 1;
  }

  // 夕焼け空
  const grad = ctx.createLinearGradient(0, 0, 0, cv.height);
  grad.addColorStop(0, '#ff6633');
  grad.addColorStop(0.3, '#ff9944');
  grad.addColorStop(0.6, '#ffcc66');
  grad.addColorStop(1, '#ffeeaa');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, cv.width, cv.height);

  // 地平線
  ctx.fillStyle = '#2a4a1a';
  ctx.fillRect(0, cv.height - 80, cv.width, 80);

  // テキスト表示（スクロール）
  const scrollY = Math.max(0, t - 120) * 0.5;
  const lines = [
    '',
    '～ ありがとう ～',
    '',
    'お母さんの病気を治すことができた',
    '',
    'おうちを素敵にリフォームできた',
    '',
    'ひまわり村に活気が戻った',
    '',
    'やまびこ洞窟でタケシくんを救出した',
    '',
    '夢のパン屋「ひまわりベーカリー」を開いた',
    '',
    '',
    '使ったお金: ' + formatMoney(Math.max(0, G.earned - G.money)),
    '残りのお金: ' + formatMoney(G.money),
    '',
    '',
    'お金で買えないもの...',
    'それは みんなの笑顔と 絆',
    '',
    '',
    '',
    '～ 幸運の娘ハナ ～',
    '～ 宝くじ長者物語 ～',
    '',
    '- FIN -',
    '',
    '',
    'プレイしていただき',
    'ありがとうございました！',
  ];

  ctx.fillStyle = '#333333';
  ctx.font = '14px sans-serif';
  ctx.textAlign = 'center';
  ctx.globalAlpha = 1;

  for (let i = 0; i < lines.length; i++) {
    const ly = cv.height / 2 + i * 28 - scrollY;
    if (ly < -20 || ly > cv.height + 20) continue;
    if (lines[i].startsWith('～') || lines[i] === '- FIN -') {
      ctx.font = 'bold 18px sans-serif';
      ctx.fillStyle = '#882200';
    } else {
      ctx.font = '14px sans-serif';
      ctx.fillStyle = '#553311';
    }
    ctx.fillText(lines[i], cv.width / 2, ly);
  }

  // エンディング終了後
  if (t > 800) {
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.fillRect(0, cv.height - 40, cv.width, 40);
    ctx.fillStyle = '#ffdd88';
    ctx.font = '13px sans-serif';
    ctx.fillText('Spaceキーでタイトルに戻る', cv.width / 2, cv.height - 18);
    if (consumeAction()) {
      G.state = 'TITLE';
      G.flags = {};
      G.money = 500;
      G.earned = 500;
      G.items = {};
    }
  }
}

// --- メイン更新処理 ---
function update() {
  switch (G.state) {
    case 'TITLE':
      if (consumeAction()) {
        G.state = 'FADE';
        G.fade.alpha = 0;
        G.fade.dir = 1;
        G.fade.cb = () => {
          G.flags = {};
          G.money = 500;
          G.earned = 500;
          G.items = {};
          loadMap('home', 4, 3, 0);
          G.fade.dir = -1;
          G.fade.cb = () => {
            G.state = 'EXPLORE';
            G.fade.alpha = 0;
            showChapter(1, 'ひまわり村のハナ', () => showDialog([
              '＊＊＊ ある朝のこと ＊＊＊',
              'ハナは ひまわり村に住む貧しい娘。',
              '病気のお母さんと 小さな家で二人暮らし。',
              '毎日バイトをしながら、お母さんの薬代を稼いでいる。',
              'そんなハナには 毎年ひとつだけの贅沢があった。',
              '年に1枚だけ買う 宝くじ。',
              '「いつか当たったら お母さんの病気を治すんだ...」',
              'その小さな願いが... 今日、叶おうとしていた。',
              '',
              '＊ お母さんに話しかけてみよう（Spaceキー）',
            ]));
          };
        };
      }
      break;

    case 'EXPLORE':
      if (consumeCancel()) { openMenu(); break; }
      if (!G.player.moving) {
        if (keys.up) tryMove(0, -1);
        else if (keys.down) tryMove(0, 1);
        else if (keys.left) tryMove(-1, 0);
        else if (keys.right) tryMove(1, 0);
        else if (consumeAction()) interact();
      }
      updateMovement();
      updateCamera();
      break;

    case 'MENU':
      updateMenu();
      break;

    case 'DIALOG':
      updateDialog();
      break;

    case 'CHOICE':
      updateChoice();
      break;

    case 'FADE':
      updateFade();
      break;

    case 'ENDING':
      // endTimerはdrawEnding内で更新
      break;
  }
}

// --- メイン描画処理 ---
function draw() {
  ctx.clearRect(0, 0, cv.width, cv.height);

  switch (G.state) {
    case 'TITLE':
      drawTitle();
      break;

    case 'ENDING':
      drawEnding();
      break;

    default:
      drawMap();
      drawNPCs();
      drawPlayer();
      drawUI();
      if (G.state === 'DIALOG') drawDialogBox();
      if (G.state === 'CHOICE') drawChoiceBox();
      if (G.state === 'MENU') drawMenu();
      if (G.state === 'FADE') drawFade();
      break;
  }
}

// --- ゲームループ ---
function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

// --- 初期化 ---
initTiles();
requestAnimationFrame(gameLoop);
