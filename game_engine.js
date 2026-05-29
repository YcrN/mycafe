'use strict';

// ============================================================
//  幸運の娘ハナ ～宝くじ長者物語～  ゲームエンジン
// ============================================================

const T = 32;       // タイルサイズ(px)
const COLS = 16;    // 画面横タイル数
const ROWS = 12;    // 画面縦タイル数
const MOVE_SPD = 8; // 移動アニメフレーム数
const TEXT_SPD = 2; // テキスト表示速度

const cv = document.getElementById('c');
cv.width = COLS * T;
cv.height = ROWS * T;
const ctx = cv.getContext('2d');
ctx.imageSmoothingEnabled = false;

// --- 画面リサイズ ---
function resizeCanvas() {
  const s = Math.min(window.innerWidth / cv.width, (window.innerHeight - 160) / cv.height, 2.5);
  cv.style.width = Math.floor(cv.width * s) + 'px';
  cv.style.height = Math.floor(cv.height * s) + 'px';
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// --- ゲーム状態 ---
const G = {
  state: 'TITLE',  // TITLE, EXPLORE, DIALOG, CHOICE, FADE, ENDING, CREDITS
  mapId: '',
  mapData: null,
  mapW: 0,
  mapH: 0,
  player: { x: 0, y: 0, dir: 0, moving: false, step: 0, dx: 0, dy: 0, anim: 0 },
  camera: { x: 0, y: 0, px: 0, py: 0 },
  money: 500,
  earned: 500,
  items: {},
  menu: { sel: 0 },
  flags: {},
  npcs: [],
  dialog: { lines: [], idx: 0, charIdx: 0, timer: 0, done: false, cb: null, speaker: '' },
  choice: { question: '', opts: [], sel: 0, cb: null },
  fade: { alpha: 0, dir: 0, cb: null },
  titleSel: 0,
  endTimer: 0,
  chapter: 0,
  chapterTitle: '',
  chapterTimer: 0,
};

// --- 入力 ---
const keys = { up: false, down: false, left: false, right: false, action: false, cancel: false };
const keyDown = {};

function onKeyDown(e) {
  if (keyDown[e.code]) return;
  keyDown[e.code] = true;
  switch (e.code) {
    case 'ArrowUp': case 'KeyW': keys.up = true; break;
    case 'ArrowDown': case 'KeyS': keys.down = true; break;
    case 'ArrowLeft': case 'KeyA': keys.left = true; break;
    case 'ArrowRight': case 'KeyD': keys.right = true; break;
    case 'Space': case 'Enter': case 'KeyZ': keys.action = true; break;
    case 'KeyX': case 'Escape': keys.cancel = true; break;
  }
  e.preventDefault();
}
function onKeyUp(e) {
  keyDown[e.code] = false;
  switch (e.code) {
    case 'ArrowUp': case 'KeyW': keys.up = false; break;
    case 'ArrowDown': case 'KeyS': keys.down = false; break;
    case 'ArrowLeft': case 'KeyA': keys.left = false; break;
    case 'ArrowRight': case 'KeyD': keys.right = false; break;
    case 'Space': case 'Enter': case 'KeyZ': keys.action = false; break;
    case 'KeyX': case 'Escape': keys.cancel = false; break;
  }
}
document.addEventListener('keydown', onKeyDown);
document.addEventListener('keyup', onKeyUp);

// --- モバイルコントロール ---
function setupMobile() {
  const bind = (sel, key) => {
    const el = document.querySelector(sel);
    if (!el) return;
    const on = () => { keys[key] = true; };
    const off = () => { keys[key] = false; };
    el.addEventListener('touchstart', (e) => { e.preventDefault(); on(); }, { passive: false });
    el.addEventListener('touchend', (e) => { e.preventDefault(); off(); });
    el.addEventListener('mousedown', on);
    el.addEventListener('mouseup', off);
    el.addEventListener('mouseleave', off);
  };
  bind('.up', 'up');
  bind('.down', 'down');
  bind('.left', 'left');
  bind('.right', 'right');
  bind('.btn-a', 'action');
  bind('.btn-b', 'cancel');
}
setupMobile();

// --- キー消費ユーティリティ ---
function consumeAction() {
  if (keys.action) { keys.action = false; keyDown['Space'] = false; keyDown['Enter'] = false; keyDown['KeyZ'] = false; return true; }
  return false;
}
function consumeCancel() {
  if (keys.cancel) { keys.cancel = false; keyDown['KeyX'] = false; keyDown['Escape'] = false; return true; }
  return false;
}

// --- お金加算（獲得総額も記録） ---
function addMoney(n) {
  G.money += n;
  if (n > 0) G.earned += n;
}

// --- カメラ ---
function updateCamera() {
  const p = G.player;
  const px = p.x * T + (p.moving ? p.dx * T * p.step / MOVE_SPD : 0);
  const py = p.y * T + (p.moving ? p.dy * T * p.step / MOVE_SPD : 0);
  let cx = px - (COLS * T / 2) + T / 2;
  let cy = py - (ROWS * T / 2) + T / 2;
  cx = Math.max(0, Math.min(cx, G.mapW * T - COLS * T));
  cy = Math.max(0, Math.min(cy, G.mapH * T - ROWS * T));
  if (G.mapW <= COLS) cx = (G.mapW * T - COLS * T) / 2;
  if (G.mapH <= ROWS) cy = (G.mapH * T - ROWS * T) / 2;
  G.camera.px = cx;
  G.camera.py = cy;
}

// --- マップ管理 ---
function loadMap(id, px, py, dir) {
  const m = MAPS[id];
  if (!m) { console.error('Map not found:', id); return; }
  G.mapId = id;
  G.mapData = m.data.map(row => row.split(''));
  G.mapW = m.data[0].length;
  G.mapH = m.data.length;
  G.player.x = px;
  G.player.y = py;
  G.player.dir = dir !== undefined ? dir : 0;
  G.player.moving = false;
  G.player.step = 0;
  G.npcs = getNPCsForMap(id);
  updateCamera();
}

function getTile(x, y) {
  if (x < 0 || y < 0 || x >= G.mapW || y >= G.mapH) return 'm';
  return G.mapData[y][x];
}

function isSolid(x, y) {
  const t = getTile(x, y);
  const info = TILE_INFO[t];
  if (!info) return true;
  if (info.solid) return true;
  // NPCがいる場所もソリッド
  for (const npc of G.npcs) {
    if (npc.x === x && npc.y === y) return true;
  }
  return false;
}

// --- 移動 ---
function tryMove(dx, dy) {
  const p = G.player;
  if (p.moving) return;
  // 方向転換
  const dir = dx < 0 ? 1 : dx > 0 ? 2 : dy < 0 ? 3 : 0;
  p.dir = dir;
  const nx = p.x + dx;
  const ny = p.y + dy;
  if (isSolid(nx, ny)) return;
  p.dx = dx;
  p.dy = dy;
  p.moving = true;
  p.step = 0;
  p.anim = (p.anim + 1) % 2;
}

function updateMovement() {
  const p = G.player;
  if (!p.moving) return;
  p.step++;
  if (p.step >= MOVE_SPD) {
    p.x += p.dx;
    p.y += p.dy;
    p.moving = false;
    p.step = 0;
    checkTransitions();
    checkStepEvents();
  }
}

// --- トランジション ---
function checkTransitions() {
  const m = MAPS[G.mapId];
  if (!m.transitions) return;
  for (const tr of m.transitions) {
    if (G.player.x === tr.x && G.player.y === tr.y) {
      // 洞窟の奥はランタンがないと進めない
      if (tr.map === 'cave2' && !hasItem('lantern')) {
        showDialog([
          'ハナ「この先は 真っ暗だ...」',
          'ハナ「明かりがないと とても進めそうにない」',
          '＊ どこかに 明かりを見つけよう。',
        ]);
        return;
      }
      fadeToMap(tr.map, tr.px, tr.py, tr.dir);
      return;
    }
  }
}

function fadeToMap(mapId, px, py, dir) {
  G.state = 'FADE';
  G.fade.alpha = 0;
  G.fade.dir = 1;
  G.fade.cb = () => {
    loadMap(mapId, px, py, dir);
    G.fade.dir = -1;
    G.fade.cb = () => {
      G.state = 'EXPLORE';
      G.fade.alpha = 0;
    };
  };
}

// --- インタラクション ---
function interact() {
  const p = G.player;
  const dx = p.dir === 1 ? -1 : p.dir === 2 ? 1 : 0;
  const dy = p.dir === 0 ? 1 : p.dir === 3 ? -1 : 0;
  const tx = p.x + dx;
  const ty = p.y + dy;

  // NPC
  for (const npc of G.npcs) {
    if (npc.x === tx && npc.y === ty) {
      // NPCをプレイヤーの方に向ける
      npc.dir = p.dir === 0 ? 3 : p.dir === 3 ? 0 : p.dir === 1 ? 2 : 1;
      if (npc.talk) npc.talk();
      return;
    }
  }

  // 宝箱
  const tile = getTile(tx, ty);
  if (tile === 'x' || tile === 'X') {
    openChest(tx, ty);
    return;
  }

  // 看板
  if (tile === 's') {
    checkSignEvents(tx, ty);
  }
}

// --- ダイアログシステム ---
function showDialog(lines, speaker, cb) {
  if (typeof lines === 'string') lines = [lines];
  G.state = 'DIALOG';
  G.dialog.lines = lines;
  G.dialog.idx = 0;
  G.dialog.charIdx = 0;
  G.dialog.timer = 0;
  G.dialog.done = false;
  G.dialog.cb = cb || null;
  G.dialog.speaker = speaker || '';
}

function updateDialog() {
  const d = G.dialog;
  if (d.done) {
    if (consumeAction()) {
      d.idx++;
      if (d.idx >= d.lines.length) {
        G.state = 'EXPLORE';
        if (d.cb) d.cb();
        return;
      }
      d.charIdx = 0;
      d.timer = 0;
      d.done = false;
    }
    return;
  }
  d.timer++;
  if (d.timer >= TEXT_SPD) {
    d.timer = 0;
    d.charIdx++;
    const line = d.lines[d.idx];
    if (d.charIdx >= line.length) {
      d.done = true;
    }
  }
  // Aボタンで一気に表示
  if (consumeAction()) {
    d.charIdx = d.lines[d.idx].length;
    d.done = true;
  }
}

// --- 選択肢システム ---
function showChoice(question, opts, cb) {
  G.state = 'CHOICE';
  G.choice.question = question;
  G.choice.opts = opts;
  G.choice.sel = 0;
  G.choice.cb = cb;
}

function updateChoice() {
  if (keys.up) { keys.up = false; G.choice.sel = Math.max(0, G.choice.sel - 1); }
  if (keys.down) { keys.down = false; G.choice.sel = Math.min(G.choice.opts.length - 1, G.choice.sel + 1); }
  if (consumeAction()) {
    G.state = 'EXPLORE';
    if (G.choice.cb) G.choice.cb(G.choice.sel);
  }
}

// --- フェード ---
function updateFade() {
  G.fade.alpha += G.fade.dir * 0.05;
  if (G.fade.dir > 0 && G.fade.alpha >= 1) {
    G.fade.alpha = 1;
    if (G.fade.cb) G.fade.cb();
  }
  if (G.fade.dir < 0 && G.fade.alpha <= 0) {
    G.fade.alpha = 0;
    if (G.fade.cb) G.fade.cb();
  }
}

// --- チャプター表示 ---
function showChapter(num, title, cb) {
  G.chapter = num;
  G.chapterTitle = title;
  G.chapterTimer = 120;
  G.state = 'FADE';
  G.fade.alpha = 0;
  G.fade.dir = 1;
  G.fade.cb = () => {
    G.fade.dir = 0;
    setTimeout(() => {
      G.fade.dir = -1;
      G.fade.cb = () => {
        G.state = 'EXPLORE';
        G.fade.alpha = 0;
        if (cb) cb();
      };
    }, 2000);
  };
}

// --- お金フォーマット ---
function formatMoney(n) {
  if (n >= 100000000) {
    const oku = Math.floor(n / 100000000);
    const rem = n % 100000000;
    if (rem === 0) return oku + '億円';
    if (rem >= 10000) return oku + '億' + Math.floor(rem / 10000) + '万円';
    return oku + '億' + rem + '円';
  }
  if (n >= 10000) {
    const man = Math.floor(n / 10000);
    const rem = n % 10000;
    if (rem === 0) return man + '万円';
    return man + '万' + rem + '円';
  }
  return n + '円';
}
