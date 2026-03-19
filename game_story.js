'use strict';

// ============================================================
//  ストーリーイベント & 看板テキスト
// ============================================================

// --- ステップイベント（マスに乗ったとき） ---
function checkStepEvents() {
  const f = G.flags;
  const p = G.player;
  const mapId = G.mapId;

  // ゲーム開始：家を出たとき
  if (mapId === 'village' && !f.intro && (p.x === 5 && p.y === 2)) {
    f.intro = true;
    showDialog([
      'ハナ「今日もいい天気... バイトの前に宝くじの結果を見に行こう」',
      '＊ 右の方にある よろず屋に行ってみよう',
    ]);
  }

  // 初めてワールドマップに出たとき
  if (mapId === 'world' && !f.firstWorld && f.wonLottery) {
    f.firstWorld = true;
    showDialog([
      'ハナ「村の外は広いなぁ... にじいろ街は東の方にあるはず」',
      '＊ 矢印キー（またはWASD）で移動　Spaceキーで話す・調べる',
      '＊ 東へ進んで にじいろ街を目指そう！',
    ]);
  }

  // 初めて にじいろ街に入ったとき
  if (mapId === 'city' && !f.firstCity) {
    f.firstCity = true;
    if (!f.claimedPrize) {
      showDialog([
        'ハナ「わぁ、大きな街！ これが にじいろ街...」',
        '＊ 宝くじセンターを探して 当選金を受け取ろう！',
      ]);
    }
  }

  // 宝くじ受取後に村に戻ったとき
  if (mapId === 'village' && f.claimedPrize && !f.returnedHome) {
    f.returnedHome = true;
    showDialog([
      'ハナ「お母さんに早く教えなきゃ！ まずはおうちに帰ろう！」',
    ]);
  }

  // 村を助けた後の洞窟イベント告知
  if (mapId === 'village' && f.helpedVillage && !f.heardAboutChild && !f.rescuedChild) {
    // 村人NPCが話しかけてくる（NPC側で処理）
  }

  // 洞窟に初めて入ったとき
  if (mapId === 'cave' && !f.firstCave && f.heardAboutChild) {
    f.firstCave = true;
    showDialog([
      'ハナ「ここが やまびこ洞窟... タケシくんを探さなきゃ！」',
      '＊ 洞窟の奥へ進んで タケシくんを見つけよう',
    ]);
  }

  // 洞窟に初めて入ったとき（イベント前）
  if (mapId === 'cave' && !f.firstCave && !f.heardAboutChild) {
    f.firstCaveEarly = true;
    showDialog([
      'ハナ「暗い洞窟... ちょっと怖いけど、探検してみよう」',
    ]);
  }

  // ゲームクリア後に村に戻ったとき
  if (mapId === 'village' && f.openedBakery && !f.ending) {
    f.ending = true;
    setTimeout(() => {
      showDialog([
        'ハナ「宝くじが当たって、本当にいろんなことができた」',
        'ハナ「お母さんの病気を治して... おうちもリフォームして...」',
        'ハナ「村を元気にして... 迷子のタケシくんも助けて...」',
        'ハナ「そして、夢のパン屋さんも開けた」',
        'ハナ「でも一番大切なのは... みんなの笑顔」',
        'ハナ「お金は使えばなくなるけど、みんなとの絆は一生の宝物」',
        'ハナ「これからも、みんなと一緒に幸せでいたいな」',
      ], '', () => {
        G.state = 'ENDING';
        G.endTimer = 0;
      });
    }, 500);
  }
}

// --- 看板イベント ---
function checkSignEvents(x, y) {
  const mapId = G.mapId;

  if (mapId === 'village' && x === 3 && y === 8) {
    showDialog(['【看板】 ひまわり村 ～ みんなの笑顔が咲く村 ～']);
  }
  if (mapId === 'city' && x === 7 && y === 3) {
    showDialog(['【看板】 にじいろ街 中央広場']);
  }
  if (mapId === 'world' && x === 21 && y === 9) {
    showDialog(['【看板】 ← 北：にじいろ街　↓ 南：ひまわり村　→ 東：やまびこ洞窟']);
  }
}

// --- マップ名取得 ---
function getMapName(id) {
  const names = {
    home: 'ハナの家',
    village: 'ひまわり村',
    shop: 'よろず屋',
    chief: '村長の家',
    world: 'フィールド',
    city: 'にじいろ街',
    lottery: '宝くじセンター',
    hospital: '病院',
    cafe: 'カフェ',
    bank: '銀行',
    inn: '宿屋',
    library: '図書館',
    cave: 'やまびこ洞窟',
    cave2: 'やまびこ洞窟 奥',
    cave3: 'やまびこ洞窟 最奥',
    bakery_closed: '空き店舗',
    bakery: 'ひまわりベーカリー',
  };
  return names[id] || id;
}

// --- 次の目標を取得 ---
function getObjective() {
  const f = G.flags;
  if (!f.talkedMom) return 'お母さんに話しかけよう';
  if (!f.wonLottery) return 'よろず屋で宝くじの結果を確認しよう';
  if (!f.claimedPrize) return 'にじいろ街の宝くじセンターへ行こう';
  if (!f.healedMom) return 'おうちに帰ってお母さんに報告しよう';
  if (!f.renovatedHouse) return 'お母さんのためにおうちをリフォームしよう';
  if (!f.helpedVillage) return '村長さんに相談してみよう';
  if (!f.heardAboutChild && !f.rescuedChild) return '村の人に話を聞いてみよう';
  if (f.heardAboutChild && !f.rescuedChild) return 'やまびこ洞窟でタケシくんを救出しよう';
  if (!f.openedBakery) return '村の空き店舗でパン屋を開こう';
  if (f.openedBakery && !f.ending) return 'ひまわり村へ戻ろう';
  return 'Thank you for playing!';
}
