'use strict';

// ============================================================
//  アイテム・インベントリ・宝箱システム
// ============================================================

const ITEMS = {
  onigiri: { name: 'おにぎり',     icon: '🍙', desc: 'ほかほかのおにぎり。お腹がすいた人にあげよう。' },
  lantern: { name: 'ランタン',     icon: '🏮', desc: '暗い洞窟を照らす明かり。これで奥へ進める。' },
  gem:     { name: 'きらめく宝石', icon: '💎', desc: '美しく輝く宝石。とても価値がありそう。' },
  herb:    { name: 'やくそう',     icon: '🌿', desc: 'どこかで見たような薬草。持っていると心強い。' },
  recipe:  { name: '母のレシピ',   icon: '📜', desc: 'お母さん直伝のパンのレシピ。何よりの宝物。' },
  goldBar: { name: '金の延べ棒',   icon: '🪙', desc: 'ずっしりと重い金塊。' },
  photo:   { name: '昔の写真',     icon: '🖼️', desc: 'お母さんと写った子供のころの写真。宝物だ。' },
  amulet:  { name: 'まもりのお守り', icon: '🧿', desc: '洞窟の主からもらったお守り。幸運を呼ぶという。' },
};

// マップごとの宝箱の中身（座標キー "x,y"）
const CHESTS = {
  home:  { '7,1':  { item: 'photo', msg: '＊ 懐かしい思い出が よみがえった。' } },
  cave:  {
    '8,1':  { item: 'goldBar', money: 50000 },
    '10,5': { item: 'lantern', msg: '＊ これで洞窟の奥へ進めそうだ！' },
  },
  cave2: { '13,3': { item: 'gem' } },
  cave3: { '5,2':  { item: 'herb', money: 1000000, msg: '＊ 洞窟の奥に眠っていた 古の財宝だ！' } },
};

// --- インベントリ操作 ---
function giveItem(id, n) {
  n = n || 1;
  G.items[id] = (G.items[id] || 0) + n;
}
function hasItem(id) { return (G.items[id] || 0) > 0; }
function countItem(id) { return G.items[id] || 0; }
function ownedItems() {
  return Object.keys(G.items).filter(k => G.items[k] > 0);
}

// --- 宝箱を開ける ---
function openChest(x, y) {
  const key = 'chest_' + G.mapId + '_' + x + '_' + y;
  const tile = getTile(x, y);
  if (G.flags[key] || tile === 'X') {
    showDialog(['＊ 宝箱は からっぽだ。']);
    return;
  }
  G.flags[key] = true;
  G.mapData[y][x] = 'X';
  const c = (CHESTS[G.mapId] || {})[x + ',' + y];
  if (!c) {
    showDialog(['＊ 宝箱を開けた！ ... 中は空っぽだった。']);
    return;
  }
  const msgs = ['＊ 宝箱を開けた！'];
  if (c.money) { addMoney(c.money); msgs.push('＊ ' + formatMoney(c.money) + ' を手に入れた！'); }
  if (c.item) { giveItem(c.item); msgs.push('＊ ' + ITEMS[c.item].icon + '「' + ITEMS[c.item].name + '」を手に入れた！'); }
  if (c.msg) msgs.push(c.msg);
  showDialog(msgs);
}

// --- メニュー（もちもの）---
function openMenu() {
  G.state = 'MENU';
  G.menu.sel = 0;
}

function updateMenu() {
  const owned = ownedItems();
  const max = owned.length;
  if (keys.up) { keys.up = false; G.menu.sel = Math.max(0, G.menu.sel - 1); }
  if (keys.down) { keys.down = false; G.menu.sel = Math.min(Math.max(0, max - 1), G.menu.sel + 1); }
  if (consumeCancel()) { G.state = 'EXPLORE'; return; }
  if (consumeAction()) {
    if (max === 0) { G.state = 'EXPLORE'; return; }
    const id = owned[G.menu.sel];
    const it = ITEMS[id];
    showDialog([it.icon + '「' + it.name + '」', it.desc]);
  }
}

function drawMenu() {
  // 半透明の暗幕
  ctx.fillStyle = 'rgba(0,0,0,0.45)';
  ctx.fillRect(0, 0, cv.width, cv.height);

  const bx = 24, by = 40, bw = cv.width - 48, bh = cv.height - 90;
  ctx.fillStyle = '#101030';
  ctx.fillRect(bx - 2, by - 2, bw + 4, bh + 4);
  ctx.fillStyle = '#1a1a4e';
  ctx.fillRect(bx, by, bw, bh);
  ctx.strokeStyle = '#aab0ff'; ctx.lineWidth = 2; ctx.strokeRect(bx, by, bw, bh);
  ctx.strokeStyle = '#6066bb'; ctx.lineWidth = 1; ctx.strokeRect(bx + 3, by + 3, bw - 6, bh - 6);

  ctx.fillStyle = '#ffdd88';
  ctx.font = 'bold 15px sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('★ もちもの', bx + 14, by + 24);

  ctx.fillStyle = '#fff';
  ctx.font = '12px sans-serif';
  ctx.textAlign = 'right';
  ctx.fillText('💰 ' + formatMoney(G.money), bx + bw - 14, by + 24);

  ctx.strokeStyle = '#4044aa'; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(bx + 12, by + 32); ctx.lineTo(bx + bw - 12, by + 32); ctx.stroke();

  const owned = ownedItems();
  ctx.textAlign = 'left';
  if (owned.length === 0) {
    ctx.fillStyle = '#9999cc';
    ctx.font = '13px sans-serif';
    ctx.fillText('まだ なにも 持っていない。', bx + 16, by + 60);
  } else {
    for (let i = 0; i < owned.length; i++) {
      const id = owned[i];
      const it = ITEMS[id];
      const ry = by + 44 + i * 26;
      if (i === G.menu.sel) {
        ctx.fillStyle = 'rgba(255,221,136,0.18)';
        ctx.fillRect(bx + 8, ry - 16, bw - 16, 24);
        ctx.fillStyle = '#ffdd88';
        ctx.font = '13px sans-serif';
        ctx.fillText('▶', bx + 12, ry);
      }
      ctx.font = '16px sans-serif';
      ctx.fillStyle = '#fff';
      ctx.fillText(it.icon, bx + 30, ry + 1);
      ctx.font = '13px sans-serif';
      ctx.fillStyle = i === G.menu.sel ? '#ffeeaa' : '#dddef0';
      ctx.fillText(it.name, bx + 54, ry);
      const cnt = G.items[id];
      if (cnt > 1) {
        ctx.textAlign = 'right';
        ctx.fillStyle = '#aab0dd';
        ctx.fillText('×' + cnt, bx + bw - 18, ry);
        ctx.textAlign = 'left';
      }
    }
  }

  ctx.fillStyle = '#7d82c0';
  ctx.font = '10px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('↑↓：選ぶ　Space/Z：くわしく　X/B：とじる', cv.width / 2, by + bh - 10);
  ctx.textAlign = 'left';
}
