'use strict';

// ============================================================
//  タイル定義と描画
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
  fn(tc.getContext('2d'));
  return tc;
}

function initTiles() {
  // 草
  tileGfx['g'] = makeTileCanvas(c => {
    c.fillStyle = '#48a848'; c.fillRect(0, 0, 32, 32);
    c.fillStyle = '#3d9d3d';
    c.fillRect(5, 7, 2, 4); c.fillRect(15, 3, 2, 4);
    c.fillRect(25, 9, 2, 4); c.fillRect(9, 21, 2, 4); c.fillRect(21, 25, 2, 4);
  });
  // 暗い草
  tileGfx['G'] = makeTileCanvas(c => {
    c.fillStyle = '#3d8d3d'; c.fillRect(0, 0, 32, 32);
    c.fillStyle = '#348534';
    c.fillRect(5, 7, 2, 4); c.fillRect(18, 5, 2, 4); c.fillRect(10, 22, 2, 4);
  });
  // 水
  tileGfx['w'] = makeTileCanvas(c => {
    c.fillStyle = '#2868c8'; c.fillRect(0, 0, 32, 32);
    c.fillStyle = '#4888e8';
    c.fillRect(4, 10, 10, 2); c.fillRect(18, 22, 10, 2);
    c.fillStyle = '#3078d8';
    c.fillRect(8, 20, 8, 2); c.fillRect(2, 26, 6, 2);
  });
  // 山
  tileGfx['m'] = makeTileCanvas(c => {
    c.fillStyle = '#786858'; c.fillRect(0, 0, 32, 32);
    c.fillStyle = '#988878';
    c.beginPath(); c.moveTo(16, 2); c.lineTo(30, 30); c.lineTo(2, 30); c.fill();
    c.fillStyle = '#b8a898';
    c.beginPath(); c.moveTo(16, 2); c.lineTo(24, 18); c.lineTo(16, 14); c.fill();
  });
  // 木
  tileGfx['t'] = makeTileCanvas(c => {
    c.fillStyle = '#48a848'; c.fillRect(0, 0, 32, 32);
    c.fillStyle = '#3d9d3d'; c.fillRect(5, 7, 2, 4);
    c.fillStyle = '#654321'; c.fillRect(13, 18, 6, 12);
    c.fillStyle = '#2d7a2d';
    c.beginPath(); c.arc(16, 14, 11, 0, Math.PI * 2); c.fill();
    c.fillStyle = '#238a23';
    c.beginPath(); c.arc(13, 11, 6, 0, Math.PI * 2); c.fill();
  });
  // 道
  tileGfx['p'] = makeTileCanvas(c => {
    c.fillStyle = '#c8b070'; c.fillRect(0, 0, 32, 32);
    c.fillStyle = '#b8a060';
    c.fillRect(2, 2, 4, 4); c.fillRect(20, 14, 4, 4); c.fillRect(10, 26, 4, 4);
  });
  // 花
  tileGfx['f'] = makeTileCanvas(c => {
    c.fillStyle = '#48a848'; c.fillRect(0, 0, 32, 32);
    c.fillStyle = '#ff6688'; c.fillRect(6, 8, 4, 4);
    c.fillStyle = '#ffdd44'; c.fillRect(18, 6, 4, 4);
    c.fillStyle = '#ffffff'; c.fillRect(12, 20, 4, 4);
    c.fillStyle = '#ff8844'; c.fillRect(24, 22, 4, 4);
    c.fillStyle = '#aa44ff'; c.fillRect(4, 24, 4, 4);
  });
  // 橋
  tileGfx['b'] = makeTileCanvas(c => {
    c.fillStyle = '#2868c8'; c.fillRect(0, 0, 32, 32);
    c.fillStyle = '#8B6914'; c.fillRect(2, 0, 28, 32);
    c.fillStyle = '#a07818';
    for (let i = 0; i < 4; i++) c.fillRect(2, i * 8, 28, 2);
  });
  // 看板
  tileGfx['s'] = makeTileCanvas(c => {
    c.fillStyle = '#48a848'; c.fillRect(0, 0, 32, 32);
    c.fillStyle = '#654321'; c.fillRect(14, 16, 4, 14);
    c.fillStyle = '#8B6914'; c.fillRect(6, 6, 20, 14);
    c.fillStyle = '#a07818'; c.fillRect(8, 8, 16, 10);
  });
  // 壁
  tileGfx['#'] = makeTileCanvas(c => {
    c.fillStyle = '#665544'; c.fillRect(0, 0, 32, 32);
    c.fillStyle = '#776655';
    for (let y = 0; y < 4; y++) for (let x = 0; x < 4; x++) {
      const ox = (y % 2) * 8;
      c.fillRect(x * 16 + ox + 1, y * 8 + 1, 14, 6);
    }
  });
  // 窓壁
  tileGfx['q'] = makeTileCanvas(c => {
    c.fillStyle = '#665544'; c.fillRect(0, 0, 32, 32);
    c.fillStyle = '#776655';
    for (let y = 0; y < 4; y++) for (let x = 0; x < 4; x++) {
      const ox = (y % 2) * 8;
      c.fillRect(x * 16 + ox + 1, y * 8 + 1, 14, 6);
    }
    c.fillStyle = '#88ccff'; c.fillRect(10, 8, 12, 12);
    c.fillStyle = '#aaddff'; c.fillRect(12, 10, 8, 8);
    c.strokeStyle = '#554433'; c.lineWidth = 1;
    c.strokeRect(10, 8, 12, 12);
  });
  // 床
  tileGfx['.'] = makeTileCanvas(c => {
    c.fillStyle = '#b08050'; c.fillRect(0, 0, 32, 32);
    c.fillStyle = '#a07040';
    c.fillRect(0, 0, 32, 1); c.fillRect(0, 15, 32, 1); c.fillRect(16, 0, 1, 32);
  });
  // ドア
  tileGfx['d'] = makeTileCanvas(c => {
    c.fillStyle = '#b08050'; c.fillRect(0, 0, 32, 32);
    c.fillStyle = '#8B6914'; c.fillRect(6, 2, 20, 28);
    c.fillStyle = '#a07818'; c.fillRect(8, 4, 16, 24);
    c.fillStyle = '#ffdd44'; c.fillRect(20, 14, 4, 4);
  });
  // 玄関マット
  tileGfx['o'] = makeTileCanvas(c => {
    c.fillStyle = '#b08050'; c.fillRect(0, 0, 32, 32);
    c.fillStyle = '#cc6633'; c.fillRect(4, 8, 24, 16);
  });
  // カウンター
  tileGfx['c'] = makeTileCanvas(c => {
    c.fillStyle = '#b08050'; c.fillRect(0, 0, 32, 32);
    c.fillStyle = '#6B4226'; c.fillRect(0, 4, 32, 24);
    c.fillStyle = '#8B5A2B'; c.fillRect(2, 6, 28, 20);
    c.fillStyle = '#7B4A2B'; c.fillRect(0, 4, 32, 3);
  });
  // ベッド
  tileGfx['e'] = makeTileCanvas(c => {
    c.fillStyle = '#b08050'; c.fillRect(0, 0, 32, 32);
    c.fillStyle = '#654321'; c.fillRect(2, 2, 28, 28);
    c.fillStyle = '#ffffff'; c.fillRect(4, 4, 24, 8);
    c.fillStyle = '#6688cc'; c.fillRect(4, 12, 24, 16);
    c.fillStyle = '#5577bb'; c.fillRect(4, 14, 24, 2);
  });
  // テーブル
  tileGfx['L'] = makeTileCanvas(c => {
    c.fillStyle = '#b08050'; c.fillRect(0, 0, 32, 32);
    c.fillStyle = '#8B6914'; c.fillRect(4, 6, 24, 20);
    c.fillStyle = '#a07818'; c.fillRect(6, 8, 20, 16);
  });
  // 本棚
  tileGfx['h'] = makeTileCanvas(c => {
    c.fillStyle = '#654321'; c.fillRect(0, 0, 32, 32);
    c.fillStyle = '#cc4444'; c.fillRect(2, 2, 6, 12);
    c.fillStyle = '#4444cc'; c.fillRect(10, 2, 5, 12);
    c.fillStyle = '#44aa44'; c.fillRect(17, 2, 6, 12);
    c.fillStyle = '#ccaa44'; c.fillRect(25, 2, 5, 12);
    c.fillStyle = '#aa44aa'; c.fillRect(2, 18, 7, 12);
    c.fillStyle = '#44aaaa'; c.fillRect(11, 18, 5, 12);
    c.fillStyle = '#cc8844'; c.fillRect(18, 18, 6, 12);
    c.fillStyle = '#8844cc'; c.fillRect(26, 18, 4, 12);
  });
  // カーペット
  tileGfx['r'] = makeTileCanvas(c => {
    c.fillStyle = '#b08050'; c.fillRect(0, 0, 32, 32);
    c.fillStyle = '#aa2222'; c.fillRect(2, 2, 28, 28);
    c.fillStyle = '#cc3333'; c.fillRect(4, 4, 24, 24);
  });
  // カーペット2（青）
  tileGfx['a'] = makeTileCanvas(c => {
    c.fillStyle = '#b08050'; c.fillRect(0, 0, 32, 32);
    c.fillStyle = '#2244aa'; c.fillRect(2, 2, 28, 28);
    c.fillStyle = '#3355bb'; c.fillRect(4, 4, 24, 24);
  });
  // 宝箱
  tileGfx['x'] = makeTileCanvas(c => {
    c.fillStyle = '#b08050'; c.fillRect(0, 0, 32, 32);
    c.fillStyle = '#cc8800'; c.fillRect(4, 8, 24, 18);
    c.fillStyle = '#ffaa00'; c.fillRect(6, 10, 20, 14);
    c.fillStyle = '#ffdd00'; c.fillRect(13, 12, 6, 6);
  });
  // フェンス
  tileGfx['F'] = makeTileCanvas(c => {
    c.fillStyle = '#48a848'; c.fillRect(0, 0, 32, 32);
    c.fillStyle = '#8B6914';
    c.fillRect(2, 10, 4, 20); c.fillRect(26, 10, 4, 20);
    c.fillRect(0, 12, 32, 4); c.fillRect(0, 22, 32, 4);
  });
  // 建物壁
  tileGfx['W'] = makeTileCanvas(c => {
    c.fillStyle = '#d4b896'; c.fillRect(0, 0, 32, 32);
    c.fillStyle = '#c4a886'; c.fillRect(0, 0, 32, 2);
    c.fillStyle = '#e4c8a6'; c.fillRect(2, 4, 28, 24);
  });
  // 建物ドア
  tileGfx['D'] = makeTileCanvas(c => {
    c.fillStyle = '#d4b896'; c.fillRect(0, 0, 32, 32);
    c.fillStyle = '#8B5A2B'; c.fillRect(6, 2, 20, 28);
    c.fillStyle = '#a07030'; c.fillRect(8, 4, 16, 24);
    c.fillStyle = '#ffcc00'; c.fillRect(20, 14, 3, 3);
  });
  // 石道
  tileGfx['P'] = makeTileCanvas(c => {
    c.fillStyle = '#999999'; c.fillRect(0, 0, 32, 32);
    c.fillStyle = '#aaaaaa';
    c.fillRect(1, 1, 14, 14); c.fillRect(17, 17, 14, 14);
    c.fillStyle = '#888888';
    c.fillRect(17, 1, 14, 14); c.fillRect(1, 17, 14, 14);
  });
  // 洞窟床
  tileGfx['C'] = makeTileCanvas(c => {
    c.fillStyle = '#555555'; c.fillRect(0, 0, 32, 32);
    c.fillStyle = '#4a4a4a';
    c.fillRect(4, 6, 6, 4); c.fillRect(20, 18, 8, 6);
    c.fillStyle = '#606060';
    c.fillRect(14, 10, 4, 4);
  });
  // 洞窟壁
  tileGfx['R'] = makeTileCanvas(c => {
    c.fillStyle = '#333333'; c.fillRect(0, 0, 32, 32);
    c.fillStyle = '#3d3d3d';
    c.fillRect(2, 4, 10, 8); c.fillRect(18, 16, 12, 10);
    c.fillStyle = '#2a2a2a';
    c.fillRect(10, 20, 8, 6);
  });
  // 洞窟入口
  tileGfx['k'] = makeTileCanvas(c => {
    c.fillStyle = '#48a848'; c.fillRect(0, 0, 32, 32);
    c.fillStyle = '#333333';
    c.beginPath(); c.arc(16, 32, 14, Math.PI, 0); c.fill();
    c.fillStyle = '#222222';
    c.beginPath(); c.arc(16, 32, 10, Math.PI, 0); c.fill();
  });
  // 階段
  tileGfx['S'] = makeTileCanvas(c => {
    c.fillStyle = '#555555'; c.fillRect(0, 0, 32, 32);
    for (let i = 0; i < 5; i++) {
      c.fillStyle = i % 2 === 0 ? '#888888' : '#666666';
      c.fillRect(0, i * 6 + 2, 32, 5);
    }
  });
  // 砂
  tileGfx['n'] = makeTileCanvas(c => {
    c.fillStyle = '#d4c090'; c.fillRect(0, 0, 32, 32);
    c.fillStyle = '#c8b480';
    c.fillRect(6, 8, 3, 3); c.fillRect(20, 14, 3, 3); c.fillRect(12, 24, 3, 3);
  });
  // 井戸
  tileGfx['i'] = makeTileCanvas(c => {
    c.fillStyle = '#48a848'; c.fillRect(0, 0, 32, 32);
    c.fillStyle = '#888888';
    c.beginPath(); c.arc(16, 16, 10, 0, Math.PI * 2); c.fill();
    c.fillStyle = '#2868c8';
    c.beginPath(); c.arc(16, 16, 7, 0, Math.PI * 2); c.fill();
    c.fillStyle = '#aaaaaa';
    c.fillRect(6, 6, 2, 20); c.fillRect(24, 6, 2, 20);
    c.fillRect(4, 4, 24, 2);
  });
  // かまど/ストーブ
  tileGfx['v'] = makeTileCanvas(c => {
    c.fillStyle = '#b08050'; c.fillRect(0, 0, 32, 32);
    c.fillStyle = '#888888'; c.fillRect(4, 4, 24, 24);
    c.fillStyle = '#666666'; c.fillRect(6, 6, 20, 20);
    c.fillStyle = '#ff6600'; c.fillRect(10, 14, 12, 8);
    c.fillStyle = '#ffaa00'; c.fillRect(13, 16, 6, 4);
  });
  // 壺
  tileGfx['j'] = makeTileCanvas(c => {
    c.fillStyle = '#b08050'; c.fillRect(0, 0, 32, 32);
    c.fillStyle = '#886644';
    c.beginPath(); c.arc(16, 20, 8, 0, Math.PI * 2); c.fill();
    c.fillRect(12, 8, 8, 12);
    c.fillStyle = '#aa8866';
    c.fillRect(10, 8, 12, 3);
  });
}
