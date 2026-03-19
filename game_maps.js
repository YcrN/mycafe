'use strict';

// ============================================================
//  マップデータ定義
// ============================================================

const MAPS = {
  // ============ ハナの家 (10x8) ============
  home: {
    data: [
      '##q#####q#',
      '#..L..h..#',
      '#..L.....#',
      '#........#',
      '#e.......#',
      '#e..r.r.j#',
      '####od####',
      '##########',
    ],
    transitions: [
      { x: 4, y: 6, map: 'village', px: 6, py: 2, dir: 0 },
    ],
  },

  // ============ ひまわり村 (16x12) ============
  village: {
    data: [
      'tttttttttttttttt',
      'tgggWWDWWggWDWgt',
      'tgggg.g.ggggoght',
      'tgFFFpppFFgggggt',
      'tggfgpgpgfgigggt',
      'tWDWgpgpgggggfgt',
      'tgggppgpgWDWgfgt',
      'tggggpgpgggggggt',
      'tgsgpppppppppggt',
      'tggggpgggggfpfgt',
      'ttttpptttttppttt',
      'ttttpptttttppttt',
    ],
    transitions: [
      { x: 6, y: 1, map: 'home', px: 4, py: 5, dir: 3 },
      { x: 12, y: 1, map: 'shop', px: 4, py: 5, dir: 3 },
      { x: 2, y: 5, map: 'chief', px: 4, py: 5, dir: 3 },
      { x: 10, y: 6, map: 'bakery_closed', px: 4, py: 5, dir: 3 },
      { x: 4, y: 11, map: 'world', px: 5, py: 10, dir: 0 },
      { x: 5, y: 11, map: 'world', px: 5, py: 10, dir: 0 },
      { x: 12, y: 11, map: 'world', px: 5, py: 10, dir: 0 },
      { x: 13, y: 11, map: 'world', px: 5, py: 10, dir: 0 },
    ],
  },

  // ============ 村のよろず屋 (10x8) ============
  shop: {
    data: [
      '##q####q##',
      '#hccccc.h#',
      '#........#',
      '#........#',
      '#.j....j.#',
      '#........#',
      '####od####',
      '##########',
    ],
    transitions: [
      { x: 4, y: 6, map: 'village', px: 12, py: 2, dir: 0 },
    ],
  },

  // ============ 村長の家 (10x8) ============
  chief: {
    data: [
      '##q####q##',
      '#hh..L.hh#',
      '#....L...#',
      '#..r.r.r.#',
      '#..r.r.r.#',
      '#..r.r.r.#',
      '####od####',
      '##########',
    ],
    transitions: [
      { x: 4, y: 6, map: 'village', px: 2, py: 6, dir: 0 },
    ],
  },

  // ============ パン屋（閉店中）(10x8) ============
  bakery_closed: {
    data: [
      '##q####q##',
      '#........#',
      '#........#',
      '#........#',
      '#........#',
      '#........#',
      '####od####',
      '##########',
    ],
    transitions: [
      { x: 4, y: 6, map: 'village', px: 10, py: 7, dir: 0 },
    ],
  },

  // ============ パン屋（開店後）(10x8) ============
  bakery: {
    data: [
      '##q####q##',
      '#hccccc.h#',
      '#..r.r.r.#',
      '#.L..L.L.#',
      '#........#',
      '#.v....j.#',
      '####od####',
      '##########',
    ],
    transitions: [
      { x: 4, y: 6, map: 'village', px: 10, py: 7, dir: 0 },
    ],
  },

  // ============ ワールドマップ (24x16) ============
  world: {
    data: [
      'mmmmmmmmmmmmmmmmmmmmmmmm',
      'mttggggwgtttttttttttttgm',
      'mtgfgggwgtgggggfggfggfm',
      'mttggggwgtgpppppppppggm',
      'mgggggpwgggpggggggpggmm',
      'mggggppttbttpggttggpgmm',
      'mgggppgggggpggttggpggmm',
      'mggppggfggfpggttgkpggmm',
      'mgppggfggffpppppppgggmm',
      'mppgggfggggpggggggggsmm',
      'mpppppppppppgggggggggmm',
      'mtgggggwgggggfgfgfggmmm',
      'mttggggwggggggfgfgggmmm',
      'mmttgggwwgggggggggggmmm',
      'mmmttttwwttttttttttmmmm',
      'mmmmmmmmmmmmmmmmmmmmmmmm',
    ],
    transitions: [
      { x: 5, y: 10, map: 'village', px: 5, py: 10, dir: 3 },
      { x: 4, y: 10, map: 'village', px: 4, py: 10, dir: 3 },
      { x: 18, y: 3, map: 'city', px: 7, py: 11, dir: 3 },
      { x: 17, y: 7, map: 'cave', px: 7, py: 13, dir: 3 },
    ],
  },

  // ============ にじいろ街 (16x12) ============
  city: {
    data: [
      'WWWWWWWWWWWWWWWW',
      'WPPWDWPPPPWDWPgW',
      'WPPggPPPPPggPPgW',
      'WPPPPPPsPPPPPPgW',
      'WPPWDWPPPPWDWPPW',
      'WPPggPPPPPggPPPW',
      'WPPPPPPPPPPPPPfW',
      'WPfPPPPPPPPPPPfW',
      'WPfPWDWPPWDWPPfW',
      'WPPPggPPPggPPPgW',
      'WPPPPPPPPPPPPPgW',
      'WWWWWWPPPPWWWWgW',
    ],
    transitions: [
      { x: 4, y: 1, map: 'lottery', px: 4, py: 5, dir: 3 },
      { x: 10, y: 1, map: 'hospital', px: 4, py: 5, dir: 3 },
      { x: 4, y: 4, map: 'cafe', px: 4, py: 5, dir: 3 },
      { x: 10, y: 4, map: 'bank', px: 4, py: 5, dir: 3 },
      { x: 4, y: 8, map: 'inn', px: 4, py: 5, dir: 3 },
      { x: 10, y: 8, map: 'library', px: 4, py: 5, dir: 3 },
      { x: 6, y: 11, map: 'world', px: 18, py: 4, dir: 0 },
      { x: 7, y: 11, map: 'world', px: 18, py: 4, dir: 0 },
      { x: 8, y: 11, map: 'world', px: 18, py: 4, dir: 0 },
      { x: 9, y: 11, map: 'world', px: 18, py: 4, dir: 0 },
    ],
  },

  // ============ 宝くじセンター (10x8) ============
  lottery: {
    data: [
      '##q####q##',
      '#hccccc.h#',
      '#..a.a.a.#',
      '#..a.a.a.#',
      '#........#',
      '#........#',
      '####od####',
      '##########',
    ],
    transitions: [
      { x: 4, y: 6, map: 'city', px: 4, py: 2, dir: 0 },
    ],
  },

  // ============ 病院 (10x8) ============
  hospital: {
    data: [
      '##q####q##',
      '#hccccc.h#',
      '#........#',
      '#.e..e...#',
      '#........#',
      '#.e..e...#',
      '####od####',
      '##########',
    ],
    transitions: [
      { x: 4, y: 6, map: 'city', px: 10, py: 2, dir: 0 },
    ],
  },

  // ============ カフェ (10x8) ============
  cafe: {
    data: [
      '##q####q##',
      '#v.cccc.j#',
      '#........#',
      '#.L..L.L.#',
      '#........#',
      '#.L..L.L.#',
      '####od####',
      '##########',
    ],
    transitions: [
      { x: 4, y: 6, map: 'city', px: 4, py: 5, dir: 0 },
    ],
  },

  // ============ 銀行 (10x8) ============
  bank: {
    data: [
      '##q####q##',
      '#hccccc.h#',
      '#..a.a.a.#',
      '#..a.a.a.#',
      '#........#',
      '#..j..j..#',
      '####od####',
      '##########',
    ],
    transitions: [
      { x: 4, y: 6, map: 'city', px: 10, py: 5, dir: 0 },
    ],
  },

  // ============ 宿屋 (10x8) ============
  inn: {
    data: [
      '##q####q##',
      '#..ccc..h#',
      '#........#',
      '#.e..e...#',
      '#........#',
      '#.e..e...#',
      '####od####',
      '##########',
    ],
    transitions: [
      { x: 4, y: 6, map: 'city', px: 4, py: 9, dir: 0 },
    ],
  },

  // ============ 図書館 (10x8) ============
  library: {
    data: [
      '##q####q##',
      '#hh.hh.hh#',
      '#........#',
      '#hh.hh.hh#',
      '#........#',
      '#.L..L...#',
      '####od####',
      '##########',
    ],
    transitions: [
      { x: 4, y: 6, map: 'city', px: 10, py: 9, dir: 0 },
    ],
  },

  // ============ やまびこ洞窟 (16x14) ============
  cave: {
    data: [
      'RRRRRRRRRRRRRRRR',
      'RRCCCCCCRCCCCCCR',
      'RRCRRRCCRCRRRRCR',
      'RRCRCCCCRCRRCCCR',
      'RRCRCRRRRCRRCRCR',
      'RRCRCCCCCCRRCRCR',
      'RRCRRRRRCCRRCRCR',
      'RRCCCCCRCCCRCCCo',
      'RRRRRCCRRRRCCCCo',
      'RRCCCCCCCCCRRRRR',
      'RRCRRRRRRCCCCCCo',
      'RRCCCCCCRRRRRCCo',
      'RRRRRCCCCCCCCCCo',
      'RRRRRRRCCRRRRRRR',
    ],
    transitions: [
      { x: 14, y: 7, map: 'cave2', px: 1, py: 7, dir: 2 },
      { x: 14, y: 8, map: 'cave2', px: 1, py: 8, dir: 2 },
      { x: 14, y: 10, map: 'cave2', px: 1, py: 10, dir: 2 },
      { x: 14, y: 11, map: 'cave2', px: 1, py: 11, dir: 2 },
      { x: 14, y: 12, map: 'cave2', px: 1, py: 12, dir: 2 },
      { x: 7, y: 13, map: 'world', px: 17, py: 8, dir: 0 },
      { x: 8, y: 13, map: 'world', px: 17, py: 8, dir: 0 },
    ],
  },

  // ============ やまびこ洞窟 奥 (16x14) ============
  cave2: {
    data: [
      'RRRRRRRRRRRRRRRR',
      'RCCCCCRRCCCCCCoR',
      'RCRRRCRRCRRRRCCR',
      'RCCCRCRRCRCCCRCR',
      'RRRCRCCCCRCCCRRR',
      'RRCCRRRRCRRRCCCR',
      'RRCRRRCCCCCRCCCR',
      'oCCCCRRRCCCRCRRR',
      'oCRRCCCCCCCCCCCR',
      'RCRRRRRRCRRRRRCR',
      'oCCCCCCCCCCCCCCR',
      'oCRRRRRRCRRRCRCR',
      'oCCCCCCCCCRRCCCR',
      'RRRRRRRRRRRRRRRR',
    ],
    transitions: [
      { x: 0, y: 7, map: 'cave', px: 13, py: 7, dir: 1 },
      { x: 0, y: 8, map: 'cave', px: 13, py: 8, dir: 1 },
      { x: 0, y: 10, map: 'cave', px: 13, py: 10, dir: 1 },
      { x: 0, y: 11, map: 'cave', px: 13, py: 11, dir: 1 },
      { x: 0, y: 12, map: 'cave', px: 13, py: 12, dir: 1 },
      { x: 14, y: 1, map: 'cave3', px: 1, py: 6, dir: 2 },
    ],
  },

  // ============ やまびこ洞窟 最奥 (10x8) ============
  cave3: {
    data: [
      'RRRRRRRRRR',
      'RCCCCCCCCR',
      'RCRRRRCCCR',
      'RCCCCRCCCR',
      'RRRRCRCCCR',
      'RCCCCRCCCR',
      'oCCCCCCCCR',
      'RRRRRRRRRR',
    ],
    transitions: [
      { x: 0, y: 6, map: 'cave2', px: 13, py: 1, dir: 1 },
    ],
  },
};
