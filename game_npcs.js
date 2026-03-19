'use strict';

// ============================================================
//  NPC定義 & キャラクター描画
// ============================================================

// --- キャラクター描画 ---
function drawCharSprite(cx, x, y, hair, outfit, dir, isSmall) {
  const sz = isSmall ? 0.7 : 1.0;
  const ox = isSmall ? 5 : 0;
  const oy = isSmall ? 8 : 0;

  // 体
  cx.fillStyle = outfit;
  cx.fillRect(x + 8 + ox, y + 14 * sz + oy, 16 * sz, 14 * sz);

  // 頭
  cx.fillStyle = '#ffcc99';
  cx.beginPath();
  cx.arc(x + 16, y + 10 * sz + oy, 8 * sz, 0, Math.PI * 2);
  cx.fill();

  // 髪
  cx.fillStyle = hair;
  cx.beginPath();
  cx.arc(x + 16, y + 8 * sz + oy, 8 * sz, Math.PI, Math.PI * 2);
  cx.fill();
  cx.fillRect(x + 8 + ox, y + 4 * sz + oy, 16 * sz, 6 * sz);

  // 目
  cx.fillStyle = '#333';
  if (dir === 0) { // 下向き
    cx.fillRect(x + 12 + ox * 0.5, y + 10 * sz + oy, 2 * sz, 2 * sz);
    cx.fillRect(x + 18 - ox * 0.5, y + 10 * sz + oy, 2 * sz, 2 * sz);
  } else if (dir === 3) { // 上向き（目見えない）
  } else if (dir === 1) { // 左
    cx.fillRect(x + 10 + ox * 0.5, y + 10 * sz + oy, 2 * sz, 2 * sz);
  } else { // 右
    cx.fillRect(x + 18 - ox * 0.5, y + 10 * sz + oy, 2 * sz, 2 * sz);
  }

  // 足
  cx.fillStyle = '#996633';
  if (!isSmall) {
    cx.fillRect(x + 10, y + 28, 4, 4);
    cx.fillRect(x + 18, y + 28, 4, 4);
  } else {
    cx.fillRect(x + 12, y + 26, 3, 3);
    cx.fillRect(x + 17, y + 26, 3, 3);
  }
}

// --- NPC色定義 ---
const NPC_LOOKS = {
  mom:       { hair: '#888888', outfit: '#9966cc' },
  shop:      { hair: '#333333', outfit: '#338833' },
  chief:     { hair: '#cccccc', outfit: '#334466' },
  villager1: { hair: '#886633', outfit: '#cc6633' },
  villager2: { hair: '#333333', outfit: '#6699cc' },
  villager3: { hair: '#cc6633', outfit: '#cc66aa' },
  lotteryStaff: { hair: '#222222', outfit: '#2244aa' },
  cityNpc1:  { hair: '#884422', outfit: '#aa3366' },
  cityNpc2:  { hair: '#222222', outfit: '#666666' },
  hospitalDoc: { hair: '#333333', outfit: '#ffffff' },
  traveler:  { hair: '#775533', outfit: '#887766' },
  child:     { hair: '#333333', outfit: '#4488cc', small: true },
  childMom:  { hair: '#553322', outfit: '#cc6688' },
  customer1: { hair: '#885522', outfit: '#dd8844' },
  customer2: { hair: '#222222', outfit: '#44aa88' },
};

// --- NPC生成関数 ---
function getNPCsForMap(mapId) {
  const f = G.flags;
  const npcs = [];

  function npc(x, y, look, dir, talkFn) {
    const l = NPC_LOOKS[look] || { hair: '#333', outfit: '#666' };
    return { x, y, dir: dir || 0, hair: l.hair, outfit: l.outfit, small: l.small || false, talk: talkFn };
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
            G.money += 10000000000;
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
        if (f.claimedPrize) {
          showDialog(['市民「あなたが10億円当選者？ すごいわね！」']);
        } else {
          showDialog(['市民「にじいろ街へようこそ！ 宝くじセンターは北西の建物よ」']);
        }
      }));
      npcs.push(npc(3, 9, 'cityNpc2', 2, () => {
        showDialog(['市民「この街には色んなお店があるよ。ゆっくり見て行ってね」']);
      }));
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
        npcs.push(npc(3, 3, 'child', 0, () => {
          showDialog([
            'タケシ「うえーん！ 出られなくなっちゃった...」',
            'ハナ「大丈夫！ 一緒に帰ろう！」',
            'タケシ「おねえちゃん... ありがとう！」',
            '＊ タケシを無事に救出した！',
          ], '', () => {
            f.rescuedChild = true;
            G.money -= 1000000; // 救助費用
            showDialog([
              '＊ タケシを連れて 洞窟を脱出した！',
              '＊ 村に戻ろう！',
            ]);
          });
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
