'use strict';

// ============================================================
//  NPC定義 & キャラクター描画
// ============================================================

// --- 色ユーティリティ ---
function shade(hex, amt) {
  const n = parseInt(hex.slice(1), 16);
  let r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
  r = Math.max(0, Math.round(r * (1 - amt)));
  g = Math.max(0, Math.round(g * (1 - amt)));
  b = Math.max(0, Math.round(b * (1 - amt)));
  return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}
function tint(hex, amt) {
  const n = parseInt(hex.slice(1), 16);
  let r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
  r = Math.min(255, Math.round(r + (255 - r) * amt));
  g = Math.min(255, Math.round(g + (255 - g) * amt));
  b = Math.min(255, Math.round(b + (255 - b) * amt));
  return '#' + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

// --- キャラクター描画（ドラクエ/FF風 ドット絵） ---
function drawCharSprite(cx, x, y, look, dir, frame) {
  look = look || {};
  const skin  = look.skin || '#ffd2a0';
  const skinD = shade(skin, 0.16);
  const hair  = look.hair || '#5a3a22';
  const hairL = tint(hair, 0.28);
  const out   = look.outfit || '#cc5577';
  const outD  = look.outfitDark || shade(out, 0.24);
  const outL  = tint(out, 0.22);
  const pants = look.pants || shade(out, 0.5);
  const pantsD = shade(pants, 0.28);
  const shoe  = look.shoe || '#4a3322';
  const OL    = '#20202e';
  const small = look.small;
  const style = look.hairStyle || '';
  frame = frame || 0;

  cx.save();
  cx.translate(x, y);
  if (small) { cx.translate(16, 20); cx.scale(0.74, 0.74); cx.translate(-16, -16); }

  // 影
  cx.fillStyle = 'rgba(0,0,0,0.22)';
  cx.beginPath();
  cx.ellipse(16, 29, 8, 2.6, 0, 0, Math.PI * 2);
  cx.fill();

  const R = (a, b, w, h, c) => { cx.fillStyle = c; cx.fillRect(a, b, w, h); };
  const bob = (frame === 1 || frame === 2) ? -1 : 0;

  function legs() {
    let lY = 23, lH = 6, rY = 23, rH = 6;
    const lX = 10, rX = 18;
    if (frame === 1) { lY = 23; lH = 7; rY = 24; rH = 5; }
    else if (frame === 2) { lY = 24; lH = 5; rY = 23; rH = 7; }
    R(lX - 1, lY - 1, 6, lH + 1, OL); R(rX - 1, rY - 1, 6, rH + 1, OL);
    R(lX, lY, 4, lH, pants); R(rX, rY, 4, rH, pants);
    R(lX, lY, 4, 1, pantsD); R(rX, rY, 4, 1, pantsD);
    R(lX - 1, lY + lH - 2, 6, 3, OL); R(rX - 1, rY + rH - 2, 6, 3, OL);
    R(lX, lY + lH - 1, 4, 2, shoe); R(rX, rY + rH - 1, 4, 2, shoe);
  }
  function torso() {
    R(8, 13 + bob, 16, 12, OL);
    R(9, 14 + bob, 14, 10, out);
    R(11, 14 + bob, 10, 2, outL);
    R(9, 21 + bob, 14, 2, outD);
    R(6, 14 + bob, 3, 9, OL); R(23, 14 + bob, 3, 9, OL);
    R(7, 15 + bob, 2, 7, out); R(23, 15 + bob, 2, 7, out);
    R(7, 21 + bob, 2, 2, skin); R(23, 21 + bob, 2, 2, skin);
  }
  function drawDown() {
    legs(); torso();
    R(9, 3 + bob, 14, 13, OL);
    R(10, 4 + bob, 12, 11, skin);
    R(10, 13 + bob, 12, 2, skinD);
    R(10, 3 + bob, 12, 4, hair);
    R(9, 4 + bob, 2, 10, hair); R(21, 4 + bob, 2, 10, hair);
    R(10, 7 + bob, 3, 2, hair); R(19, 7 + bob, 3, 2, hair);
    R(10, 3 + bob, 12, 1, hairL);
    R(12, 9 + bob, 3, 3, '#fff'); R(17, 9 + bob, 3, 3, '#fff');
    R(13, 10 + bob, 2, 2, '#33323a'); R(18, 10 + bob, 2, 2, '#33323a');
    R(11, 12 + bob, 2, 1, '#ff9db2'); R(19, 12 + bob, 2, 1, '#ff9db2');
    R(15, 13 + bob, 2, 1, skinD);
  }
  function drawUp() {
    legs(); torso();
    R(9, 3 + bob, 14, 13, OL);
    R(10, 4 + bob, 12, 11, skin);
    R(10, 3 + bob, 12, 11, hair);
    R(9, 4 + bob, 2, 10, hair); R(21, 4 + bob, 2, 10, hair);
    R(10, 3 + bob, 12, 1, hairL);
    if (style === 'pony') { R(13, 2 + bob, 6, 3, hair); R(14, 4 + bob, 4, 8, hair); R(14, 4 + bob, 4, 1, hairL); }
  }
  function drawSide() {
    legs();
    R(9, 13 + bob, 14, 12, OL);
    R(10, 14 + bob, 12, 10, out);
    R(10, 14 + bob, 12, 2, outL);
    R(10, 21 + bob, 12, 2, outD);
    R(10, 15 + bob, 3, 8, OL); R(11, 16 + bob, 2, 6, out); R(11, 21 + bob, 2, 2, skin);
    R(10, 3 + bob, 12, 13, OL);
    R(11, 4 + bob, 10, 11, skin);
    R(11, 13 + bob, 10, 2, skinD);
    R(11, 3 + bob, 10, 5, hair);
    R(18, 4 + bob, 4, 10, hair);
    R(11, 5 + bob, 2, 4, hair);
    R(11, 3 + bob, 10, 1, hairL);
    if (style === 'pony') { R(19, 5 + bob, 4, 3, hair); R(20, 7 + bob, 3, 7, hair); }
    R(12, 9 + bob, 2, 3, '#fff'); R(12, 10 + bob, 2, 2, '#33323a');
    R(10, 10 + bob, 1, 2, skinD);
  }

  if (dir === 0) drawDown();
  else if (dir === 3) drawUp();
  else { if (dir === 2) { cx.translate(32, 0); cx.scale(-1, 1); } drawSide(); }

  cx.restore();
}

// --- 主人公（ハナ）の見た目 ---
const PLAYER_LOOK = { skin: '#ffd9b0', hair: '#7a4a24', outfit: '#e8537f', outfitDark: '#c23a63', pants: '#4b3a86', shoe: '#6b3f1f', hairStyle: 'pony' };

// --- NPC見た目定義 ---
const NPC_LOOKS = {
  mom:       { skin: '#f6cba0', hair: '#9a9aa6', outfit: '#9b6fd0', hairStyle: 'pony' },
  shop:      { skin: '#e8b488', hair: '#3a2a1e', outfit: '#3a9a4e' },
  chief:     { skin: '#eec39a', hair: '#dadada', outfit: '#3a4f7a' },
  villager1: { skin: '#f0c098', hair: '#86592a', outfit: '#cc6a33' },
  villager2: { skin: '#e7b486', hair: '#2a2a30', outfit: '#5e93cc', hairStyle: 'pony' },
  villager3: { skin: '#f4c39c', hair: '#c06030', outfit: '#cc6aaa', hairStyle: 'pony' },
  lotteryStaff: { skin: '#eebf96', hair: '#1e1e24', outfit: '#2a4fb0' },
  cityNpc1:  { skin: '#e9b98e', hair: '#7a3a1e', outfit: '#b03a66', hairStyle: 'pony' },
  cityNpc2:  { skin: '#d8a070', hair: '#1c1c20', outfit: '#5a5a64' },
  hospitalDoc: { skin: '#eebf96', hair: '#2a2a30', outfit: '#f4f4f8' },
  traveler:  { skin: '#d69a66', hair: '#6e4a2a', outfit: '#8a7a5a' },
  child:     { skin: '#ffd2a0', hair: '#2a2a30', outfit: '#3f86d6', small: true },
  childMom:  { skin: '#f3c39c', hair: '#5a3322', outfit: '#cc6488', hairStyle: 'pony' },
  customer1: { skin: '#f0c098', hair: '#86522a', outfit: '#dd8a44' },
  customer2: { skin: '#e7b486', hair: '#1e1e24', outfit: '#3aa884', hairStyle: 'pony' },
  kuroi:     { skin: '#d8a878', hair: '#15151a', outfit: '#2b2b3c', outfitDark: '#16161f', pants: '#15151c' },
  sage:      { skin: '#e7b88e', hair: '#e8e8ee', outfit: '#3a6a8a', hairStyle: '' },
};

// --- NPC生成関数 ---
function getNPCsForMap(mapId) {
  const f = G.flags;
  const npcs = [];

  function npc(x, y, look, dir, talkFn) {
    const l = NPC_LOOKS[look] || { hair: '#5a3a22', outfit: '#888888' };
    return { x, y, dir: dir || 0, look: l, small: l.small || false, talk: talkFn };
  }

  switch (mapId) {
    // ====== ハナの家 ======
    case 'home':
      if (!f.healedMom) {
        // お母さんが寝ている（ベッドの隣）
        npcs.push(npc(2, 4, 'mom', 2, () => {
          if (!f.talkedMom) {
            showDialog([
              'おかあさん「ハナ... ゴホゴホ... ごめんね、また寝込んじゃって...」',
              'ハナ「お母さん、無理しないで。今日もバイト頑張ってくるね！」',
              'おかあさん「そうだ、ハナ。よろず屋さんに宝くじの当選番号が届いてるって話よ」',
              'ハナ「あ！ 毎年買ってる宝くじ！ 確認しに行かなきゃ！」',
            ], '', () => { f.talkedMom = true; });
          } else if (f.wonLottery && !f.healedMom) {
            showDialog([
              'ハナ「お母さん！ 宝くじが当たったの！ 10億円！」',
              'おかあさん「え...？ ハナ、冗談はやめて...」',
              'ハナ「本当だよ！ これでお母さんの病気も治せるよ！」',
            ], '', () => {
              showChoice('にじいろ街の病院で治療を受けさせる？', ['治療する（5000万円）', 'まだ待つ'], (sel) => {
                if (sel === 0 && G.money >= 50000000) {
                  G.money -= 50000000;
                  f.healedMom = true;
                  showDialog([
                    '＊ お母さんを にじいろ街の病院へ連れて行った！',
                    '＊ 最高の治療を受けることができた！',
                    'おかあさん「ハナ... ありがとう... すっかり元気になったわ」',
                    'おかあさん「お金があっても、あなたの優しさが一番の宝物よ」',
                    '＊ おかあさんの病気が治った！',
                  ]);
                } else if (sel === 0) {
                  showDialog(['＊ お金が足りない...']);
                }
              });
            });
          } else {
            showDialog(['おかあさん「ハナ、気をつけてね」']);
          }
        }));
      } else {
        // 治療後：お母さんが立っている
        npcs.push(npc(3, 3, 'mom', 0, () => {
          if (!f.renovatedHouse) {
            showDialog([
              'おかあさん「すっかり元気になったわ！ ハナのおかげよ」',
            ], '', () => {
              showChoice('おうちをリフォームする？', ['リフォームする（1億円）', 'まだいいかな'], (sel) => {
                if (sel === 0 && G.money >= 100000000) {
                  G.money -= 100000000;
                  f.renovatedHouse = true;
                  showDialog([
                    '＊ おうちを立派にリフォームした！',
                    'おかあさん「まあ！ こんなに素敵なおうちに... ありがとう、ハナ！」',
                    '＊ おかあさんが涙を流して喜んでいる！',
                  ]);
                } else if (sel === 0) {
                  showDialog(['＊ お金が足りない...']);
                }
              });
            });
          } else if (!f.gotRecipe) {
            showDialog([
              'おかあさん「ハナ、ひとつ 渡したい物があるの」',
              'おかあさん「これは お母さんの パン作りのレシピ。ずっと あなたに 継いでほしかったの」',
              'ハナ「お母さん…！ 子供のころ 一緒に焼いたパン、大好きだった」',
              'おかあさん「いつか あなたのお店を 持てたら… なんてね」',
              '＊ 📜「母のレシピ」を 受け取った！',
            ], '', () => { f.gotRecipe = true; giveItem('recipe'); });
          } else if (f.gameComplete) {
            showDialog([
              'おかあさん「ハナ、本当に立派になったわね」',
              'おかあさん「お母さん、世界一の幸せ者よ」',
            ]);
          } else {
            showDialog(['おかあさん「ハナ、あなたは本当に優しい子ね。お母さんは幸せよ」']);
          }
        }));
      }
      break;

    // ====== ひまわり村 ======
    case 'village':
      // 村人1
      npcs.push(npc(3, 8, 'villager1', 2, () => {
        if (f.helpedVillage) {
          showDialog(['村人「村に公園ができて、子供たちが遊びに来るようになったよ！ ありがとう！」']);
        } else if (f.wonLottery) {
          showDialog(['村人「ハナちゃん、宝くじ当たったんだって！？ すごいねぇ！」']);
        } else {
          showDialog(['村人「ハナちゃん、今日もバイトかい？ えらいねぇ」']);
        }
      }));

      // 村人2（洞窟イベント後に追加）
      if (f.helpedVillage && !f.rescuedChild) {
        npcs.push(npc(8, 8, 'childMom', 1, () => {
          showDialog([
            'おかあさん「大変なの！ うちの タケシが やまびこ洞窟に入ったまま帰ってこないの！」',
            'おかあさん「あの洞窟は複雑で迷いやすいって... お願い、助けて！」',
          ], '', () => { f.heardAboutChild = true; });
        }));
      }
      if (f.rescuedChild) {
        npcs.push(npc(8, 8, 'childMom', 1, () => {
          showDialog(['おかあさん「タケシを助けてくれて本当にありがとう！ 一生忘れません！」']);
        }));
        npcs.push(npc(9, 8, 'child', 1, () => {
          showDialog(['タケシ「ハナおねえちゃん、ありがとう！ もう洞窟には行かないよ！」']);
        }));
      }

      // 花畑の村人
      npcs.push(npc(13, 9, 'villager3', 1, () => {
        if (f.helpedVillage) {
          showDialog(['村人「村がどんどん良くなっていくわ！ ハナちゃんのおかげね！」']);
        } else {
          showDialog(['村人「この村も静かになったわねぇ... 若い人がみんな街に行っちゃって...」']);
        }
      }));
      break;

    // ====== よろず屋 ======
    case 'shop':
      npcs.push(npc(4, 1, 'shop', 0, () => {
        if (!f.talkedMom) {
          showDialog(['店主「おはよう、ハナちゃん！ 何かお買い物？」']);
        } else if (!f.wonLottery) {
          showDialog([
            '店主「おはよう、ハナちゃん！ 宝くじの当選番号？ もちろん確認できるよ」',
            '店主「えっと... ハナちゃんの番号は...」',
            '店主「...」',
            '店主「い、1等！？ 10億円！？」',
            'ハナ「え... ええええ！？」',
            '店主「す、すごい！ おめでとう、ハナちゃん！！」',
            '店主「でも当選金を受け取るには にじいろ街の宝くじセンターに行かないとね」',
            'ハナ「にじいろ街... 遠いけど行ってみる！」',
            '＊ 宝くじ1等当選！ にじいろ街へ向かおう！',
          ], '', () => { f.wonLottery = true; });
        } else {
          showDialog(['店主「にじいろ街は 村を出て東に進んだ先だよ。気をつけてね！」']);
        }
      }));
      break;

    // ====== 村長の家 ======
    case 'chief':
      npcs.push(npc(5, 2, 'chief', 0, () => {
        if (f.helpedVillage) {
          showDialog([
            '村長「ハナちゃんのおかげで、村に活気が戻ってきたぞい！」',
            '村長「公園に子供たちが遊びに来ておる。わしゃ嬉しいのう...」',
          ]);
        } else if (f.healedMom) {
          showDialog([
            '村長「ハナちゃん、宝くじ当選おめでとう！ 実はお願いがあるんじゃが...」',
            '村長「この村は年々人が減って、学校も廃校の危機なんじゃ」',
            '村長「公園や施設を作れば、若い家族が戻ってくるかもしれん...」',
          ], '', () => {
            showChoice('村の発展に投資する？', ['投資する（5億円）', 'もう少し考える'], (sel) => {
              if (sel === 0 && G.money >= 500000000) {
                G.money -= 500000000;
                f.helpedVillage = true;
                showDialog([
                  'ハナ「もちろんです！ この村は私を育ててくれた大切な場所ですから」',
                  '村長「おお... ハナちゃん... ありがとう...（涙）」',
                  '＊ 村に公園、図書室、診療所を建設した！',
                  '＊ ひまわり村が活気を取り戻し始めた！',
                ]);
              } else if (sel === 0) {
                showDialog(['＊ お金が足りない...']);
              }
            });
          });
        } else if (f.wonLottery) {
          showDialog(['村長「ハナちゃん、宝くじが当たったそうじゃな！ すごいのう！」']);
        } else {
          showDialog(['村長「ハナちゃん、いつも頑張っておるな。えらいぞい」']);
        }
      }));
      break;

    // ====== パン屋（閉店中）======
    case 'bakery_closed':
      if (f.helpedVillage && f.rescuedChild && !f.openedBakery) {
        npcs.push(npc(5, 3, 'villager2', 0, () => {
          showDialog([
            '不動産屋「この物件、パン屋にぴったりですよ」',
            'ハナ「子供の頃からの夢... パン屋さんを開くこと...」',
          ], '', () => {
            showChoice('パン屋を開業する？', ['開業する（2億円）', 'まだ考える'], (sel) => {
              if (sel === 0 && G.money >= 200000000) {
                G.money -= 200000000;
                f.openedBakery = true;
                // パン屋マップへのトランジションを更新
                MAPS.village.transitions[3] = { x: 10, y: 6, map: 'bakery', px: 4, py: 5, dir: 3 };
                showDialog([
                  '＊ 夢のパン屋「ひまわりベーカリー」がオープンした！',
                  'ハナ「やった... 夢が叶った！ お母さんみたいな美味しいパンを作るんだ！」',
                  '＊ 村のみんなが お祝いに駆けつけてくれた！',
                ], '', () => {
                  f.gameComplete = true;
                  fadeToMap('bakery', 4, 3, 0);
                });
              } else if (sel === 0) {
                showDialog(['＊ お金が足りない...']);
              }
            });
          });
        }));
      } else {
        npcs.push(npc(5, 3, 'villager2', 0, () => {
          showDialog(['看板「テナント募集中」... いつかここでお店を開けたらいいな...']);
        }));
      }
      break;

    // ====== パン屋（開店後）======
    case 'bakery':
      if (f.openedBakery) {
        npcs.push(npc(4, 3, 'customer1', 3, () => {
          showDialog(['お客さん「ここのメロンパン、最高！ 毎日来ちゃうよ！」']);
        }));
        npcs.push(npc(6, 3, 'customer2', 3, () => {
          showDialog(['お客さん「ハナさんのパンは愛情がこもっていて本当に美味しいわ」']);
        }));
        npcs.push(npc(4, 1, 'mom', 0, () => {
          showDialog([
            'おかあさん「ハナ、立派になったわね...」',
            'おかあさん「昔、一緒にパンを焼いたこと覚えてる？」',
            'ハナ「もちろん！ お母さんのパンが大好きで、パン屋さんになりたいって思ったんだよ」',
            'おかあさん「... お母さん、世界一幸せよ」',
          ]);
        }));
      }
      break;

    // ====== ワールドマップ ======
    case 'world':
      // 旅人（宝くじ当選後に出現）
      if (f.wonLottery && !f.helpedTraveler) {
        npcs.push(npc(8, 7, 'traveler', 0, () => {
          showDialog([
            '旅人「お腹が空いて... もう動けない...」',
            '旅人「誰か... 食べ物を...」',
          ], '', () => {
            showChoice('おにぎりを買ってあげる？', ['あげる（500円）', '声だけかける'], (sel) => {
              if (sel === 0) {
                G.money -= 500;
                f.helpedTraveler = true;
                showDialog([
                  '＊ おにぎりを あげた！',
                  '旅人「あ、ありがとう... 生き返った...！」',
                  '旅人「お礼に教えてあげるよ。にじいろ街は北東に進めばすぐだよ」',
                  '旅人「途中の看板も参考にしてね」',
                ]);
              } else {
                showDialog([
                  'ハナ「がんばって！」',
                  '旅人「う、うん... ありがとう...」',
                ]);
                f.helpedTraveler = true;
              }
            });
          });
        }));
      }
      break;

    // ====== 宝くじセンター ======
    case 'lottery':
      npcs.push(npc(4, 1, 'lotteryStaff', 0, () => {
        if (!f.claimedPrize) {
          showDialog([
            'スタッフ「いらっしゃいませ。宝くじの当選確認ですね」',
            'スタッフ「確認いたしました... 間違いございません！」',
            'スタッフ「1等 10億円の大当たりです！！」',
            'スタッフ「おめでとうございます！！！」',
            'ハナ「本当に... 私が... 10億円...」',
            'ハナ「お母さんの病気を治せる... お母さんに楽をさせてあげられる！」',
            '＊ 10億円を受け取った！！',
          ], '', () => {
            f.claimedPrize = true;
            addMoney(1000000000);
          });
        } else {
          showDialog(['スタッフ「改めましておめでとうございます！ 素敵な使い方をしてくださいね」']);
        }
      }));
      break;

    // ====== 病院 ======
    case 'hospital':
      npcs.push(npc(4, 1, 'hospitalDoc', 0, () => {
        if (f.healedMom) {
          showDialog(['医師「お母様はすっかり回復されましたよ。安心してください」']);
        } else {
          showDialog(['医師「何かお困りですか？ 当院は最新の設備を備えております」']);
        }
      }));
      break;

    // ====== にじいろ街 ======
    case 'city':
      npcs.push(npc(7, 5, 'cityNpc1', 0, () => {
        if (f.kuroiDone) {
          const lines = ['市民「ねえ知ってる？ 投資詐欺の "黒井" が ついに警察に捕まったのよ！」'];
          if (f.scammed) {
            lines.push('市民「だまされた人も いたみたい... お金は 戻ってくるといいわね」');
          } else if (f.refusedScam) {
            lines.push('市民「あなた 断ったんですって？ さすが しっかりしてるわね！」');
          }
          showDialog(lines);
        } else if (f.claimedPrize) {
          showDialog([
            '市民「あなたが 10億円当選者？ すごいわね！」',
            '市民「でも こんなご時世、変な人に だまされないよう 気をつけてね」',
          ]);
        } else {
          showDialog(['市民「にじいろ街へようこそ！ 宝くじセンターは 北西の建物よ」']);
        }
      }));
      npcs.push(npc(3, 9, 'cityNpc2', 2, () => {
        showDialog(['市民「この街には 色んなお店があるよ。ゆっくり見て行ってね」']);
      }));

      // 投資詐欺師・黒井（当選後に出現）
      if (f.claimedPrize && !f.kuroiDone) {
        npcs.push(npc(11, 6, 'kuroi', 1, () => {
          showDialog([
            '黒井「やぁ お嬢さん。10億円当選の噂を聞いてね」',
            '黒井「実はね… "絶対に儲かる" 投資の話があるんだ」',
            '黒井「いま 3億円 預ければ、すぐに 5倍になって返ってくる」',
            '黒井「みんな やってるよ。乗り遅れたら 損だよ？」',
          ], '', () => {
            showChoice('怪しい投資の話に乗る？', ['3億円を渡す', 'きっぱり断る'], (sel) => {
              if (sel === 0 && G.money >= 300000000) {
                G.money -= 300000000;
                f.kuroiDone = true; f.scammed = true;
                showDialog([
                  '黒井「毎度あり！ では、また 連絡するよ…」',
                  '＊ 黒井は お金を受け取ると 足早に去っていった。',
                  'ハナ「…なんだか、嫌な予感がする」',
                ]);
              } else if (sel === 0) {
                showDialog(['黒井「なんだ、持ち合わせが 足りないのか。ちぇっ」']);
              } else {
                f.kuroiDone = true; f.refusedScam = true;
                showDialog([
                  'ハナ「ごめんなさい。そんな うまい話、信じられません」',
                  '黒井「…っ。ふん、せっかくの 親切を 無駄にして！」',
                  '＊ 黒井は 舌打ちして 去っていった。',
                  'ハナ「このお金は お母さんとの 約束のために 大切に使うんだ」',
                ]);
              }
            });
          });
        }));
      }
      break;

    // ====== カフェ ======
    case 'cafe':
      npcs.push(npc(6, 3, 'villager3', 3, () => {
        showDialog(['お客さん「ここのコーヒーは絶品よ！」']);
      }));
      break;

    // ====== 洞窟 最奥 ======
    case 'cave3':
      if (!f.rescuedChild) {
        npcs.push(npc(4, 3, 'child', 0, () => {
          showDialog([
            'タケシ「うえーん！ 暗くて 出られないよぉ...」',
            'ハナ「もう大丈夫。お姉ちゃんが 来たからね」',
            'タケシ「ハナおねえちゃん...！」',
            'ハナ「さあ、ランタンの明かりで 一緒に帰ろう」',
            '＊ タケシを 無事にみつけた！',
          ], '', () => {
            f.rescuedChild = true;
            showDialog([
              '＊ ……と、その時。洞窟の奥が ほのかに光った。',
              '???「よくぞ 子を救いに来た、心優しき娘よ」',
              '洞窟の主「わしは この洞窟を見守る者。お主の勇気、しかと見届けた」',
              '洞窟の主「これを 持って行くがよい。きっと お主を守ってくれよう」',
              '＊ 🧿「まもりのお守り」を手に入れた！',
              '洞窟の主「さあ、その子と共に お帰り。みなが 待っておるぞ」',
            ], '', () => {
              giveItem('amulet');
            });
          });
        }));
      } else {
        npcs.push(npc(4, 1, 'sage', 0, () => {
          showDialog([
            '洞窟の主「お主のような 優しい者がいる限り、この村は 安泰じゃ」',
            '洞窟の主「ふぉっふぉっ。 達者でな、ハナよ」',
          ]);
        }));
      }
      break;

    // 他のマップはNPCなし（または汎用NPCを配置）
    case 'bank':
      npcs.push(npc(4, 1, 'lotteryStaff', 0, () => {
        showDialog([
          '行員「にじいろ銀行へようこそ」',
          '行員「現在の残高: ' + formatMoney(G.money) + ' です」',
        ]);
      }));
      break;

    case 'inn':
      npcs.push(npc(4, 1, 'villager1', 0, () => {
        showDialog([
          '宿屋の主人「おつかれさま！ ゆっくり休んでいきな」',
          '＊ HPとMPが全回復した！... なんてね、このゲームにHPはないよ！',
        ]);
      }));
      break;

    case 'library':
      npcs.push(npc(4, 5, 'villager2', 3, () => {
        showDialog(['読書家「本は心の栄養だよ。たくさん読むといいよ」']);
      }));
      break;
  }

  return npcs;
}
