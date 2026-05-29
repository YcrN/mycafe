'use strict';

// ============================================================
//  タイル定義と描画（ドラクエ/FF風 ドット絵）
// ============================================================

const TILE_INFO = {
  'g': { solid: false, name: 'grass' },
  'G': { solid: false, name: 'dark_grass' },
  'w': { solid: true,  name: 'water' },
  'm': { solid: true,  name: 'mountain' },
  't': { solid: true,  name: 'tree' },
  'p': { solid: false, name: 'path' },
  'f': { solid: false, name: 'flower' },
  'b': { solid: false, name: 'bridge' },
  's': { solid: true,  name: 'sign' },
  '#': { solid: true,  name: 'wall' },
  '.': { solid: false, name: 'floor' },
  'd': { solid: false, name: 'door' },
  'c': { solid: true,  name: 'counter' },
  'e': { solid: true,  name: 'bed' },
  'L': { solid: true,  name: 'table' },
  'h': { solid: true,  name: 'bookshelf' },
  'r': { solid: false, name: 'carpet' },
  'x': { solid: true,  name: 'chest' },
  'X': { solid: true,  name: 'chest_open' },
  '*': { solid: true,  name: 'crystal' },
  'F': { solid: true,  name: 'fence' },
  'C': { solid: false, name: 'cave_floor' },
  'R': { solid: true,  name: 'cave_wall' },
  'W': { solid: true,  name: 'bldg_wall' },
  'D': { solid: false, name: 'bldg_door' },
  'P': { solid: false, name: 'stone_path' },
  'S': { solid: false, name: 'stairs' },
  'o': { solid: false, name: 'mat' },
  'v': { solid: true,  name: 'stove' },
  'j': { solid: true,  name: 'jar' },
  'k': { solid: false, name: 'cave_entrance' },
  'n': { solid: false, name: 'sand' },
  'i': { solid: true,  name: 'well' },
  'a': { solid: false, name: 'carpet2' },
  'q': { solid: true,  name: 'window_wall' },
};

// --- タイルキャッシュ ---
const tileGfx = {};

function makeTileCanvas(fn) {
  const tc = document.createElement('canvas');
  tc.width = T; tc.height = T;
  const c = tc.getContext('2d');
  c.imageSmoothingEnabled = false;
  fn(c);
  return tc;
}

function initTiles() {
  const P = (c, x, y, w, h, col) => { c.fillStyle = col; c.fillRect(x, y, w, h); };
  // 散らばった点を描く
  const dots = (c, col, arr) => { c.fillStyle = col; for (const a of arr) c.fillRect(a[0], a[1], a[2] || 2, a[3] || 2); };

  // ===== 草 =====
  tileGfx['g'] = makeTileCanvas(c => {
    P(c, 0, 0, 32, 32, '#5db14d');
    P(c, 0, 0, 32, 4, '#6dc15a');
    dots(c, '#4ea043', [[4, 8], [15, 4], [25, 10], [9, 21], [21, 25], [28, 18]]);
    dots(c, '#79c968', [[6, 14, 1, 3], [18, 9, 1, 3], [27, 24, 1, 3]]);
  });
  // ===== 暗い草 =====
  tileGfx['G'] = makeTileCanvas(c => {
    P(c, 0, 0, 32, 32, '#3f8f3f');
    dots(c, '#357a35', [[5, 7], [18, 5], [10, 22], [24, 16]]);
    dots(c, '#56a456', [[7, 14, 1, 3], [22, 24, 1, 3]]);
  });
  // ===== 水 =====
  tileGfx['w'] = makeTileCanvas(c => {
    const g = c.createLinearGradient(0, 0, 0, 32);
    g.addColorStop(0, '#3a86d8'); g.addColorStop(1, '#2160b8');
    c.fillStyle = g; c.fillRect(0, 0, 32, 32);
    P(c, 0, 6, 12, 2, '#6fb0ee'); P(c, 16, 14, 12, 2, '#6fb0ee');
    P(c, 6, 22, 10, 2, '#4f95e2'); P(c, 20, 26, 8, 2, '#7cb8f0');
    P(c, 2, 16, 8, 1, '#82bdf2');
  });
  // ===== 山 =====
  tileGfx['m'] = makeTileCanvas(c => {
    P(c, 0, 0, 32, 32, '#6d5d4d');
    c.fillStyle = '#8a7a68';
    c.beginPath(); c.moveTo(16, 3); c.lineTo(31, 31); c.lineTo(1, 31); c.fill();
    c.fillStyle = '#a89684';
    c.beginPath(); c.moveTo(16, 3); c.lineTo(23, 17); c.lineTo(16, 13); c.lineTo(10, 19); c.fill();
    c.fillStyle = '#eef0f4';
    c.beginPath(); c.moveTo(16, 3); c.lineTo(20, 10); c.lineTo(16, 8); c.lineTo(12, 11); c.fill();
    P(c, 0, 30, 32, 2, '#574a3c');
  });
  // ===== 木 =====
  tileGfx['t'] = makeTileCanvas(c => {
    P(c, 0, 0, 32, 32, '#5db14d');
    c.fillStyle = 'rgba(0,0,0,0.18)'; c.beginPath(); c.ellipse(16, 27, 10, 3, 0, 0, Math.PI * 2); c.fill();
    P(c, 14, 19, 5, 10, '#6b4423');
    P(c, 14, 19, 2, 10, '#7d5230');
    c.fillStyle = '#2f7d34'; c.beginPath(); c.arc(16, 13, 12, 0, Math.PI * 2); c.fill();
    c.fillStyle = '#3a9440'; c.beginPath(); c.arc(13, 11, 7, 0, Math.PI * 2); c.fill();
    c.fillStyle = '#52ad58'; c.beginPath(); c.arc(11, 9, 4, 0, Math.PI * 2); c.fill();
    c.fillStyle = '#27692c'; c.beginPath(); c.arc(22, 17, 5, 0, Math.PI * 2); c.fill();
  });
  // ===== 道 =====
  tileGfx['p'] = makeTileCanvas(c => {
    P(c, 0, 0, 32, 32, '#caa86a');
    P(c, 0, 0, 32, 2, '#d8b87a');
    dots(c, '#b8985a', [[3, 6, 4, 3], [20, 5, 5, 3], [10, 16, 5, 3], [24, 20, 4, 3], [6, 25, 5, 3]]);
    dots(c, '#e0c488', [[5, 12], [26, 14], [14, 27]]);
  });
  // ===== 花畑 =====
  tileGfx['f'] = makeTileCanvas(c => {
    P(c, 0, 0, 32, 32, '#5db14d');
    dots(c, '#4ea043', [[8, 18], [22, 22]]);
    const flower = (x, y, col) => {
      c.fillStyle = col;
      c.fillRect(x, y - 2, 2, 2); c.fillRect(x - 2, y, 2, 2); c.fillRect(x + 2, y, 2, 2); c.fillRect(x, y + 2, 2, 2);
      c.fillStyle = '#ffe14d'; c.fillRect(x, y, 2, 2);
    };
    flower(7, 9, '#ff6f9c'); flower(20, 7, '#ff7a4d'); flower(13, 20, '#ffffff');
    flower(25, 22, '#b06bff'); flower(6, 24, '#ff5d7a');
  });
  // ===== 橋 =====
  tileGfx['b'] = makeTileCanvas(c => {
    P(c, 0, 0, 32, 32, '#2160b8');
    P(c, 2, 0, 28, 32, '#8a5a2a');
    P(c, 2, 0, 28, 2, '#a06e34');
    for (let i = 0; i < 4; i++) { P(c, 2, i * 8 + 6, 28, 2, '#6b4420'); }
    P(c, 2, 0, 3, 32, '#6b4420'); P(c, 27, 0, 3, 32, '#6b4420');
  });
  // ===== 看板 =====
  tileGfx['s'] = makeTileCanvas(c => {
    P(c, 0, 0, 32, 32, '#5db14d');
    P(c, 14, 14, 4, 16, '#6b4423');
    P(c, 5, 5, 22, 13, '#8a5a2a');
    P(c, 7, 7, 18, 9, '#b07838');
    dots(c, '#5e3c1c', [[9, 9, 14, 1], [9, 12, 11, 1]]);
  });
  // ===== 石壁 =====
  tileGfx['#'] = makeTileCanvas(c => {
    P(c, 0, 0, 32, 32, '#4a4250');
    c.fillStyle = '#6a6276';
    for (let y = 0; y < 4; y++) for (let x = 0; x < 4; x++) {
      const ox = (y % 2) * 8;
      c.fillRect(x * 16 + ox - 6, y * 8 + 1, 13, 6);
    }
    c.fillStyle = '#7d7589';
    for (let y = 0; y < 4; y++) for (let x = 0; x < 4; x++) {
      const ox = (y % 2) * 8;
      c.fillRect(x * 16 + ox - 6, y * 8 + 1, 13, 1);
    }
  });
  // ===== 窓付き壁 =====
  tileGfx['q'] = makeTileCanvas(c => {
    c.drawImage(tileGfx['#'], 0, 0);
    P(c, 8, 7, 16, 16, '#3a3550');
    P(c, 10, 9, 12, 12, '#8fd0ff');
    P(c, 10, 9, 12, 6, '#b3e2ff');
    P(c, 15, 9, 2, 12, '#3a3550'); P(c, 10, 14, 12, 2, '#3a3550');
  });
  // ===== 木の床 =====
  tileGfx['.'] = makeTileCanvas(c => {
    P(c, 0, 0, 32, 32, '#b9824f');
    for (let y = 0; y < 32; y += 8) { P(c, 0, y, 32, 1, '#9d6c3e'); }
    dots(c, '#a9743f', [[4, 3, 10, 1], [18, 11, 10, 1], [6, 19, 12, 1], [16, 27, 10, 1]]);
  });
  // ===== ドア =====
  tileGfx['d'] = makeTileCanvas(c => {
    P(c, 0, 0, 32, 32, '#b9824f');
    P(c, 4, 1, 24, 30, '#5e3c1c');
    P(c, 6, 3, 20, 27, '#8a5a2a');
    P(c, 15, 3, 2, 27, '#5e3c1c');
    c.fillStyle = '#ffd24d'; c.beginPath(); c.arc(22, 17, 2, 0, Math.PI * 2); c.fill();
  });
  // ===== 玄関マット / ラグ =====
  tileGfx['o'] = makeTileCanvas(c => {
    c.drawImage(tileGfx['.'], 0, 0);
    P(c, 4, 8, 24, 16, '#c4543a');
    P(c, 6, 10, 20, 12, '#dd6a4a');
    P(c, 4, 8, 24, 2, '#a83c28'); P(c, 4, 22, 24, 2, '#a83c28');
  });
  // ===== カウンター =====
  tileGfx['c'] = makeTileCanvas(c => {
    c.drawImage(tileGfx['.'], 0, 0);
    P(c, 0, 5, 32, 22, '#6b4226');
    P(c, 2, 7, 28, 18, '#8a5a2b');
    P(c, 0, 5, 32, 3, '#a06e34');
  });
  // ===== ベッド =====
  tileGfx['e'] = makeTileCanvas(c => {
    c.drawImage(tileGfx['.'], 0, 0);
    P(c, 2, 2, 28, 28, '#6b4423');
    P(c, 4, 4, 24, 9, '#f4f1ea');
    P(c, 4, 13, 24, 15, '#5b86c4');
    P(c, 4, 13, 24, 2, '#7aa0d8');
    P(c, 4, 4, 24, 2, '#ffffff');
  });
  // ===== テーブル =====
  tileGfx['L'] = makeTileCanvas(c => {
    c.drawImage(tileGfx['.'], 0, 0);
    P(c, 6, 24, 4, 6, '#5e3c1c'); P(c, 22, 24, 4, 6, '#5e3c1c');
    P(c, 4, 6, 24, 18, '#8a5a2a');
    P(c, 6, 8, 20, 14, '#a06e34');
    P(c, 4, 6, 24, 2, '#b88044');
  });
  // ===== 本棚 =====
  tileGfx['h'] = makeTileCanvas(c => {
    P(c, 0, 0, 32, 32, '#5e3c1c');
    P(c, 1, 1, 30, 30, '#6b4423');
    const books = ['#cc4444', '#4466cc', '#44aa44', '#ccaa44', '#aa44aa', '#44aaaa', '#cc7744', '#7744cc'];
    let bi = 0;
    for (let row = 0; row < 2; row++) for (let i = 0; i < 4; i++) {
      P(c, 3 + i * 7, 3 + row * 15, 6, 13, books[bi % books.length]); bi++;
    }
    P(c, 1, 16, 30, 1, '#3a2410');
  });
  // ===== 赤カーペット =====
  tileGfx['r'] = makeTileCanvas(c => {
    c.drawImage(tileGfx['.'], 0, 0);
    P(c, 2, 2, 28, 28, '#a82828');
    P(c, 4, 4, 24, 24, '#cc3535');
    P(c, 9, 9, 14, 14, '#a82828');
  });
  // ===== 青カーペット =====
  tileGfx['a'] = makeTileCanvas(c => {
    c.drawImage(tileGfx['.'], 0, 0);
    P(c, 2, 2, 28, 28, '#22409a');
    P(c, 4, 4, 24, 24, '#3354bb');
    P(c, 9, 9, 14, 14, '#22409a');
  });
  // ===== 宝箱（閉） =====
  tileGfx['x'] = makeTileCanvas(c => {
    P(c, 0, 0, 32, 32, '#5db14d');
    c.fillStyle = 'rgba(0,0,0,0.18)'; c.beginPath(); c.ellipse(16, 28, 11, 3, 0, 0, Math.PI * 2); c.fill();
    P(c, 5, 13, 22, 16, '#3a2410');
    P(c, 6, 14, 20, 14, '#8a5a2a');
    P(c, 6, 14, 20, 4, '#a87838');
    P(c, 5, 8, 22, 8, '#3a2410');
    P(c, 6, 9, 20, 6, '#9d6a30');
    P(c, 6, 9, 20, 2, '#b88044');
    // 金具
    P(c, 6, 14, 20, 2, '#e0b84a');
    P(c, 6, 9, 2, 19, '#e0b84a'); P(c, 24, 9, 2, 19, '#e0b84a');
    // 錠前
    P(c, 14, 13, 4, 6, '#f4d24a');
    P(c, 15, 15, 2, 2, '#5e3c1c');
  });
  // ===== 宝箱（開） =====
  tileGfx['X'] = makeTileCanvas(c => {
    P(c, 0, 0, 32, 32, '#5db14d');
    c.fillStyle = 'rgba(0,0,0,0.18)'; c.beginPath(); c.ellipse(16, 28, 11, 3, 0, 0, Math.PI * 2); c.fill();
    // 開いた蓋
    P(c, 5, 4, 22, 8, '#3a2410');
    P(c, 6, 5, 20, 6, '#7a4e24');
    // 箱本体
    P(c, 5, 14, 22, 15, '#3a2410');
    P(c, 6, 15, 20, 13, '#6b4220');
    P(c, 8, 17, 16, 9, '#241608');
    P(c, 6, 15, 2, 13, '#e0b84a'); P(c, 24, 15, 2, 13, '#e0b84a');
  });
  // ===== クリスタル =====
  tileGfx['*'] = makeTileCanvas(c => {
    P(c, 0, 0, 32, 32, '#3f3a4a');
    dots(c, '#4a4556', [[5, 6, 6, 4], [20, 18, 8, 5]]);
    const gem = (x, y, h, col, hi) => {
      c.fillStyle = col;
      c.beginPath(); c.moveTo(x, y); c.lineTo(x + 4, y + h * 0.4); c.lineTo(x + 2, y + h); c.lineTo(x - 2, y + h); c.lineTo(x - 4, y + h * 0.4); c.closePath(); c.fill();
      c.fillStyle = hi; c.fillRect(x - 1, y + 3, 1, h - 6);
    };
    gem(13, 8, 18, '#46d6e0', '#bff4f8');
    gem(20, 13, 12, '#3ab0e0', '#a9e6f8');
    gem(8, 16, 10, '#5fe0c0', '#c8f8ee');
  });
  // ===== 柵 =====
  tileGfx['F'] = makeTileCanvas(c => {
    P(c, 0, 0, 32, 32, '#5db14d');
    P(c, 3, 8, 4, 20, '#8a5a2a'); P(c, 25, 8, 4, 20, '#8a5a2a');
    P(c, 0, 12, 32, 4, '#9d6a30'); P(c, 0, 21, 32, 4, '#9d6a30');
    P(c, 0, 12, 32, 1, '#b88044'); P(c, 0, 21, 32, 1, '#b88044');
  });
  // ===== 洞窟の床 =====
  tileGfx['C'] = makeTileCanvas(c => {
    P(c, 0, 0, 32, 32, '#56525e');
    P(c, 0, 0, 32, 3, '#615d6b');
    dots(c, '#4a4651', [[4, 7, 7, 4], [19, 17, 9, 5], [9, 24, 6, 4]]);
    dots(c, '#67636f', [[14, 9, 3, 2], [24, 7, 3, 2], [6, 18, 3, 2]]);
  });
  // ===== 洞窟の壁 =====
  tileGfx['R'] = makeTileCanvas(c => {
    P(c, 0, 0, 32, 32, '#2c2933');
    c.fillStyle = '#3a3743';
    for (let y = 0; y < 4; y++) for (let x = 0; x < 3; x++) {
      const ox = (y % 2) * 10;
      c.fillRect(x * 12 + ox - 4, y * 8 + 1, 10, 6);
    }
    c.fillStyle = '#46434f';
    for (let y = 0; y < 4; y++) for (let x = 0; x < 3; x++) {
      const ox = (y % 2) * 10;
      c.fillRect(x * 12 + ox - 4, y * 8 + 1, 10, 1);
    }
  });
  // ===== 建物の壁 =====
  tileGfx['W'] = makeTileCanvas(c => {
    P(c, 0, 0, 32, 32, '#d8c0a0');
    P(c, 0, 0, 32, 3, '#e6d2b6');
    P(c, 0, 15, 32, 1, '#c4a886'); P(c, 0, 31, 32, 1, '#c4a886');
    P(c, 15, 0, 1, 16, '#c4a886'); P(c, 7, 16, 1, 16, '#c4a886'); P(c, 23, 16, 1, 16, '#c4a886');
  });
  // ===== 建物のドア =====
  tileGfx['D'] = makeTileCanvas(c => {
    c.drawImage(tileGfx['W'], 0, 0);
    P(c, 5, 2, 22, 30, '#5e3c1c');
    P(c, 7, 4, 18, 28, '#9d6a30');
    P(c, 15, 4, 2, 28, '#7a4e24');
    c.fillStyle = '#ffd24d'; c.beginPath(); c.arc(22, 18, 2, 0, Math.PI * 2); c.fill();
  });
  // ===== 石畳 =====
  tileGfx['P'] = makeTileCanvas(c => {
    P(c, 0, 0, 32, 32, '#7d7d86');
    const stone = (x, y, w, h) => { P(c, x, y, w, h, '#9a9aa2'); P(c, x, y, w, 1, '#b0b0b8'); };
    stone(1, 1, 13, 13); stone(17, 1, 14, 13); stone(1, 17, 14, 14); stone(17, 17, 13, 14);
  });
  // ===== 階段 =====
  tileGfx['S'] = makeTileCanvas(c => {
    P(c, 0, 0, 32, 32, '#56525e');
    for (let i = 0; i < 5; i++) {
      P(c, 0, i * 6 + 2, 32, 5, i % 2 === 0 ? '#8a8690' : '#6a6672');
      P(c, 0, i * 6 + 2, 32, 1, '#a4a0aa');
    }
  });
  // ===== かまど =====
  tileGfx['v'] = makeTileCanvas(c => {
    c.drawImage(tileGfx['.'], 0, 0);
    P(c, 3, 3, 26, 26, '#5a5a64');
    P(c, 5, 5, 22, 22, '#74747e');
    P(c, 9, 13, 14, 11, '#3a3340');
    P(c, 11, 16, 10, 7, '#ff6a1a');
    P(c, 13, 18, 6, 4, '#ffc24a');
    P(c, 5, 5, 22, 2, '#8a8a92');
  });
  // ===== 壺 =====
  tileGfx['j'] = makeTileCanvas(c => {
    c.drawImage(tileGfx['.'], 0, 0);
    c.fillStyle = '#8a6648'; c.beginPath(); c.ellipse(16, 20, 9, 9, 0, 0, Math.PI * 2); c.fill();
    P(c, 11, 9, 10, 12, '#8a6648');
    c.fillStyle = '#a07c58'; c.beginPath(); c.ellipse(16, 19, 6, 6, 0, 0, Math.PI * 2); c.fill();
    P(c, 10, 8, 12, 3, '#a8845e');
    P(c, 12, 22, 3, 4, '#6b4c30');
  });
  // ===== 井戸 =====
  tileGfx['i'] = makeTileCanvas(c => {
    P(c, 0, 0, 32, 32, '#5db14d');
    c.fillStyle = '#8a8a92'; c.beginPath(); c.arc(16, 17, 11, 0, Math.PI * 2); c.fill();
    c.fillStyle = '#2c2933'; c.beginPath(); c.arc(16, 17, 8, 0, Math.PI * 2); c.fill();
    c.fillStyle = '#2160b8'; c.beginPath(); c.arc(16, 17, 5, 0, Math.PI * 2); c.fill();
    P(c, 4, 4, 3, 22, '#8a5a2a'); P(c, 25, 4, 3, 22, '#8a5a2a');
    P(c, 3, 3, 26, 3, '#6b4423');
  });
  // ===== 砂 =====
  tileGfx['n'] = makeTileCanvas(c => {
    P(c, 0, 0, 32, 32, '#dcc88e');
    dots(c, '#cab87e', [[6, 8], [20, 14], [12, 24], [26, 22]]);
    dots(c, '#ecd89e', [[10, 6], [24, 10], [16, 18]]);
  });
  // ===== 洞窟入口 =====
  tileGfx['k'] = makeTileCanvas(c => {
    P(c, 0, 0, 32, 32, '#5db14d');
    P(c, 2, 16, 28, 16, '#6d5d4d');
    c.fillStyle = '#1a1820'; c.beginPath(); c.arc(16, 30, 13, Math.PI, 0); c.fill();
    c.fillStyle = '#0c0a10'; c.beginPath(); c.arc(16, 31, 9, Math.PI, 0); c.fill();
    c.fillStyle = '#8a7a68';
    c.beginPath(); c.moveTo(16, 6); c.lineTo(30, 22); c.lineTo(2, 22); c.fill();
  });
}
