'use strict';

/* ============================================================
   Pixel Paws. One file, in this order:
   data, saved state, time passing, moods and insults, actions,
   the catch game, the shop and daily goals, the page, the drawing.
   ============================================================ */

const $ = id => document.getElementById(id);
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
const pick = arr => arr[Math.floor(Math.random() * arr.length)];

/* ---------- pixel icons: [x, y, w, h, colour] on a 16 x 16 grid ---------- */

const INK = '#5C4B51';
const ICONS = {
  coin: [[4, 2, 8, 12, '#F4C95D'], [2, 4, 12, 8, '#F4C95D'], [5, 4, 6, 8, '#FFE699'], [7, 5, 2, 6, '#B8860B']],
  paw: [[5, 8, 6, 5, INK], [6, 9, 4, 3, '#FFFDF9'], [3, 5, 2, 3, INK], [6, 3, 2, 3, INK], [9, 3, 2, 3, INK], [12, 5, 2, 3, INK]],
  bamboo: [[7, 2, 2, 12, '#58A85C'], [5, 5, 2, 2, '#78C87C'], [9, 8, 2, 2, '#78C87C'], [6, 6, 4, 1, '#3C7A40'], [6, 11, 4, 1, '#3C7A40']],
  fish: [[3, 6, 8, 4, '#7EC8E3'], [4, 5, 6, 6, '#7EC8E3'], [11, 5, 2, 2, '#5C9EAD'], [11, 9, 2, 2, '#5C9EAD'], [10, 7, 2, 2, '#5C9EAD'], [5, 7, 1, 1, INK]],
  bone: [[1, 3, 5, 5, INK], [1, 8, 5, 5, INK], [10, 3, 5, 5, INK], [10, 8, 5, 5, INK], [4, 5, 8, 6, INK],
    [2, 4, 3, 3, '#FFFDF9'], [2, 9, 3, 3, '#FFFDF9'], [11, 4, 3, 3, '#FFFDF9'], [11, 9, 3, 3, '#FFFDF9'], [3, 6, 10, 4, '#FFFDF9']],
  berry: [[4, 5, 8, 7, '#E86A92'], [3, 6, 10, 5, '#E86A92'], [5, 12, 6, 1, '#E86A92'], [6, 2, 4, 3, '#58A85C'], [7, 1, 2, 1, '#3C7A40'], [6, 7, 1, 1, '#FFFDF9'], [9, 8, 1, 1, '#FFFDF9']],
  cookie: [[4, 2, 8, 12, '#E2A86B'], [2, 4, 12, 8, '#E2A86B'], [3, 3, 10, 10, '#E2A86B'], [5, 5, 2, 2, INK], [9, 6, 2, 2, INK], [7, 10, 2, 2, INK]],
  apple: [[4, 5, 8, 8, '#E5534B'], [3, 6, 10, 6, '#E5534B'], [5, 13, 6, 1, '#C43E37'], [7, 3, 2, 2, '#7A4B2A'], [9, 2, 3, 2, '#58A85C'], [5, 7, 1, 2, '#FF9C94']],
  milk: [[4, 4, 8, 11, INK], [5, 2, 6, 2, '#7EC8E3'], [5, 5, 6, 9, '#FFFFFF'], [5, 8, 6, 3, '#7EC8E3'], [6, 9, 2, 1, '#FFFFFF']],
  meat: [[3, 3, 8, 8, '#C96B4B'], [4, 2, 6, 10, '#C96B4B'], [2, 4, 10, 6, '#C96B4B'], [5, 4, 2, 2, '#E59A7C'], [10, 10, 2, 2, '#FFFDF9'], [11, 11, 3, 3, '#FFFDF9'], [12, 10, 2, 1, '#FFFDF9']],
  rock: [[3, 7, 10, 6, '#8E8E99'], [5, 5, 6, 2, '#8E8E99'], [2, 9, 12, 3, '#8E8E99'], [5, 7, 2, 2, '#B5B5C0'], [9, 10, 3, 2, '#6E6E7A']],
  straw: [[4, 6, 8, 6, '#F1D58E'], [5, 5, 6, 1, '#F1D58E'], [4, 10, 8, 2, '#D9534F'], [1, 12, 14, 2, '#E8C77A'], [2, 14, 12, 1, '#C9A85C']],
  party: [[7, 1, 2, 2, '#FFFDF9'], [7, 3, 2, 2, '#7EC8E3'], [6, 5, 4, 2, '#F59BB2'], [5, 7, 6, 2, '#7EC8E3'], [4, 9, 8, 2, '#F59BB2'], [3, 11, 10, 2, '#7EC8E3'], [3, 13, 10, 1, '#F4C95D']],
  flowers: [[1, 12, 14, 2, '#58A85C'], [2, 10, 3, 3, '#F59BB2'], [6, 9, 4, 4, '#FFE699'], [11, 10, 3, 3, '#FFFFFF'], [3, 11, 1, 1, '#FFE699'], [7, 10, 2, 2, '#F4A261'], [12, 11, 1, 1, '#F4C95D']],
  crown: [[3, 9, 10, 5, '#F4C95D'], [3, 6, 2, 3, '#F4C95D'], [7, 5, 2, 4, '#F4C95D'], [11, 6, 2, 3, '#F4C95D'], [3, 13, 10, 1, '#D9A93A'], [7, 10, 2, 2, '#E5534B'], [4, 11, 1, 1, '#7EC8E3'], [11, 11, 1, 1, '#7EC8E3']],
  rug: [[2, 6, 12, 5, '#F59BB2'], [1, 7, 14, 3, '#F59BB2'], [4, 7, 8, 3, '#FADCE4'], [6, 8, 4, 1, '#F59BB2']],
  plant: [[7, 3, 2, 7, '#58A85C'], [4, 5, 3, 2, '#78C87C'], [9, 4, 3, 2, '#78C87C'], [5, 7, 2, 2, '#58A85C'], [9, 7, 2, 2, '#58A85C'], [4, 9, 8, 2, '#B56B45'], [5, 11, 6, 3, '#C9805A']],
  balloons: [[3, 2, 4, 5, '#F59BB2'], [9, 3, 4, 5, '#7EC8E3'], [4, 3, 1, 1, '#FFFFFF'], [10, 4, 1, 1, '#FFFFFF'], [5, 7, 1, 7, '#8C737B'], [10, 8, 1, 6, '#8C737B']],
  lights: [[1, 4, 14, 1, INK], [2, 5, 2, 3, '#F4C95D'], [6, 6, 2, 3, '#F59BB2'], [10, 6, 2, 3, '#7EC8E3'], [13, 5, 2, 3, '#88D498']]
};

function svgIcon(name, cls) {
  const rects = (ICONS[name] || ICONS.cookie)
    .map(([x, y, w, h, c]) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${c}"/>`).join('');
  return `<svg class="${cls || 'px-icon-lg'}" viewBox="0 0 16 16" aria-hidden="true">${rects}</svg>`;
}

/* ---------- data ---------- */

const SNACK = {
  bamboo: { zh: '新鲜竹笋', en: 'Bamboo Shoot' },
  leaf: { zh: '嫩绿叶片', en: 'Tender Leaf' },
  apple: { zh: '红苹果', en: 'Red Apple' },
  berry: { zh: '山林浆果', en: 'Forest Berry' },
  magicBerry: { zh: '奇幻树莓', en: 'Magic Berry' },
  cookie: { zh: '甜饼干', en: 'Sweet Cookie' },
  fish: { zh: '香脆小鱼干', en: 'Dried Fish' },
  milk: { zh: '温牛奶', en: 'Warm Milk' },
  meat: { zh: '小鸡腿', en: 'Chicken Leg' },
  bone: { zh: '香浓大骨头', en: 'Meaty Bone' }
};

const SPECIES = {
  panda: {
    id: 'panda',
    name: { zh: '熊猫', en: 'Panda' },
    defaultName: { zh: '团子', en: 'Mochi' },
    voice: { zh: '嗯嘛', en: 'Mmm' },
    roomName: { zh: '🎋 竹林秘境小屋', en: '🎋 Bamboo Sanctuary' },
    roomDesc: {
      zh: '翠绿像素竹林随风摇曳，木屋旁有温热茶几与纸灯笼，安静又治愈。',
      en: 'Swaying pixel bamboo outside a cozy wooden cabin with warm tea and lanterns.'
    },
    favLabel: { zh: '❤️ 最爱：新鲜竹笋', en: '❤️ Fav: Fresh Bamboo' },
    snacks: [
      { id: 'bamboo', fav: true, cost: 10, name: SNACK.bamboo },
      { id: 'apple', fav: false, cost: 8, name: SNACK.apple },
      { id: 'berry', fav: false, cost: 12, name: SNACK.berry },
      { id: 'cookie', fav: false, cost: 8, name: SNACK.cookie }
    ]
  },
  cat: {
    id: 'cat',
    name: { zh: '小猫', en: 'Kitten' },
    defaultName: { zh: '奶糖', en: 'Toffee' },
    voice: { zh: '喵', en: 'Meow' },
    roomName: { zh: '🧶 暖心毛线小窝', en: '🧶 Cozy Yarn Hearth' },
    roomDesc: {
      zh: '壁炉跳动着温暖像素火光，窗台透进柔光，毛线球与软垫铺满小窝。',
      en: 'A warm brick fireplace, soft window light, cushions, and yarn balls in a snug den.'
    },
    favLabel: { zh: '❤️ 最爱：香脆小鱼干', en: '❤️ Fav: Dried Fish' },
    snacks: [
      { id: 'fish', fav: true, cost: 10, name: SNACK.fish },
      { id: 'milk', fav: false, cost: 8, name: SNACK.milk },
      { id: 'meat', fav: false, cost: 12, name: SNACK.meat },
      { id: 'cookie', fav: false, cost: 8, name: SNACK.cookie }
    ]
  },
  dog: {
    id: 'dog',
    name: { zh: '小狗', en: 'Puppy' },
    defaultName: { zh: '布丁', en: 'Pudding' },
    voice: { zh: '汪', en: 'Woof' },
    roomName: { zh: '🦴 阳光草坪木屋', en: '🦴 Sunny Lawn Cabin' },
    roomDesc: {
      zh: '明媚草坪围着白色栅栏，铺着野餐布与骨头玩具，随时准备撒欢奔跑。',
      en: 'Bright green lawn with white fences, picnic blanket, and toys ready for fetch.'
    },
    favLabel: { zh: '❤️ 最爱：大骨头 & 玩耍', en: '❤️ Fav: Bone & Playtime' },
    lovesPlay: true,
    snacks: [
      { id: 'bone', fav: true, cost: 10, name: SNACK.bone },
      { id: 'meat', fav: false, cost: 12, name: SNACK.meat },
      { id: 'apple', fav: false, cost: 8, name: SNACK.apple },
      { id: 'cookie', fav: false, cost: 8, name: SNACK.cookie }
    ]
  },
  dino: {
    id: 'dino',
    name: { zh: '小恐龙', en: 'Dino' },
    defaultName: { zh: '小绿', en: 'Sprout' },
    voice: { zh: '嗷呜', en: 'Rawr' },
    roomName: { zh: '🌿 奇幻蕨类温室', en: '🌿 Fern & Amber Den' },
    roomDesc: {
      zh: '巨型像素蕨叶与发光琥珀点缀洞穴，树叶巢穴温暖又充满冒险气息。',
      en: 'Giant pixel ferns, glowing amber stones, and a leafy nest full of adventure.'
    },
    favLabel: { zh: '❤️ 最爱：奇幻树莓', en: '❤️ Fav: Magic Berry' },
    snacks: [
      { id: 'berry', fav: true, cost: 12, name: SNACK.magicBerry },
      { id: 'bamboo', fav: false, cost: 10, name: SNACK.leaf },
      { id: 'meat', fav: false, cost: 12, name: SNACK.meat },
      { id: 'cookie', fav: false, cost: 8, name: SNACK.cookie }
    ]
  }
};

const SHOP = {
  hats: [
    { id: 'straw', cost: 80, name: { zh: '草帽', en: 'Straw Hat' } },
    { id: 'party', cost: 100, name: { zh: '派对帽', en: 'Party Hat' } },
    { id: 'flowers', cost: 150, name: { zh: '花环', en: 'Flower Crown' } },
    { id: 'crown', cost: 300, name: { zh: '小皇冠', en: 'Tiny Crown' } }
  ],
  decor: [
    { id: 'rug', cost: 60, name: { zh: '软软地毯', en: 'Soft Rug' } },
    { id: 'plant', cost: 80, name: { zh: '小盆栽', en: 'Potted Plant' } },
    { id: 'balloons', cost: 100, name: { zh: '气球', en: 'Balloons' } },
    { id: 'lights', cost: 120, name: { zh: '彩灯串', en: 'Fairy Lights' } }
  ]
};

const GOALS = [
  { id: 'pat', need: 5, name: { zh: '✋ 摸摸宠物', en: '✋ Pat your pet' } },
  { id: 'fav', need: 2, name: { zh: '❤️ 喂最爱的零食', en: '❤️ Feed a favourite snack' } },
  { id: 'game', need: 1, name: { zh: '🧶 玩一局接零食', en: '🧶 Play a round of catch' } }
];
const GOAL_REWARD = 15;

/* What an annoyed pet says. Sichuan first, then Guangxi; each is used once
   before any comes round again. */
const INSULTS = [
  { zh: '瓜娃子！', py: 'Guā wá zi!', en: 'You muppet!' },
  { zh: '宝器！', py: 'Bǎo qì!', en: 'You silly bugger!' },
  { zh: '哈戳戳！', py: 'Hā chuō chuō!', en: 'You absolute idiot!' },
  { zh: '龟儿子！', py: 'Guī ér zi!', en: 'You little bastard!' },
  { zh: '背时鬼！', py: 'Bèi shí guǐ!', en: 'You unlucky bastard!' },
  { zh: '哈批！', py: 'Hā pī!', en: 'You fucking idiot!' },
  { zh: '你脑壳有包嗦？', py: 'Nǐ nǎo ké yǒu bāo suo?', en: "What's wrong with your head?" },
  { zh: '搞屎棍！', py: 'Gǎo shǐ gùn!', en: 'You little troublemaker!' },
  { zh: '扯卵谈！', py: 'Chě luǎn tán!', en: 'Talking absolute bollocks!' },
  { zh: '乱巴炮！', py: 'Luàn bā pào!', en: 'Talking rubbish!' },
  { zh: '野仔！', py: 'Yě zǎi!', en: 'You cheeky little bastard!' },
  { zh: '痴仔！', py: 'Chī zǎi!', en: 'You idiot!' }
];

/* What the pet shouts in the catch game from its third rock on: it is always
   the player's fault. Rotated the same way as the insults. */
const BLAMES = [
  { zh: '都怪你！', py: 'Dōu guài nǐ!', en: "It's all your fault!" },
  { zh: '你咋个搞的嘛！', py: 'Nǐ zǎ gè gǎo de ma!', en: 'What the hell are you playing at!' },
  { zh: '你眼睛长起出气的嗦？', py: 'Nǐ yǎn jīng zhǎng qǐ chū qì de suo?', en: 'Are your eyes just there for breathing?' },
  { zh: '痛死老子了！', py: 'Tòng sǐ lǎo zi le!', en: 'That bloody hurt!' },
  { zh: '你会不会玩哦！', py: 'Nǐ huì bù huì wán o!', en: 'Do you even know how to play!' },
  { zh: '又砸到我脑壳了！', py: 'Yòu zá dào wǒ nǎo ké le!', en: "You've hit me on the head again!" },
  { zh: '你故意的嗦？', py: 'Nǐ gù yì de suo?', en: "You're doing this on purpose, aren't you?" },
  { zh: '搞啥子名堂哦！', py: 'Gǎo shá zi míng táng o!', en: 'What kind of bloody nonsense is this!' },
  { zh: '石头你都看不到？', py: 'Shí tou nǐ dōu kàn bù dào?', en: "Can't you even see a rock?" },
  { zh: '让你接零食，不是接石头！', py: 'Ràng nǐ jiē líng shí, bù shì jiē shí tou!', en: 'I said catch snacks, not rocks!' }
];
const BLAME_FROM = 3; // rocks in one round before the pet starts blaming you

/* {v} is the animal's own noise, {food} and {n} and {t} are filled in. */
const LINES = {
  pat: { zh: ['{v}～好舒服呀！', '{v}！再摸摸嘛～', '嘿嘿，喜欢你～'], en: ['{v}~ That feels so nice!', '{v}! More pats, please~', 'Hehe, I like you~'] },
  patEnough: { zh: ['够啦够啦，让我歇会儿'], en: ['Okay, okay, give me a moment'] },
  eat: { zh: ['吃了{food}，好满足！', '{v}，{food}真香！'], en: ['Ate the {food}, yummy!', '{v}, that {food} hit the spot!'] },
  eatFav: { zh: ['❤️ {v}！最爱吃{food}了！'], en: ['❤️ {v}! I love {food}!'] },
  stuffed: { zh: ['吃不下啦！'], en: ["I'm stuffed!"] },
  tired: { zh: ['太累了，玩不动…'], en: ['Too tired to play…'] },
  sleep: { zh: ['Zzz… 晚安…'], en: ['Zzz… Good night…'] },
  notSleepy: { zh: ['我还不困呢！'], en: ["I'm not sleepy yet!"] },
  wake: { zh: ['睡醒啦，元气满满！'], en: ['Wide awake and refreshed!'] },
  wakeEarly: { zh: ['还没睡够呢…'], en: ["I wasn't done sleeping…"] },
  disturbed: { zh: ['Zzz… 别吵…'], en: ['Zzz… shh…'] },
  hungry: { zh: ['肚子咕咕叫…', '{v}…好饿…'], en: ['My tummy is rumbling…', '{v}… so hungry…'] },
  forgive: { zh: ['哼，这次就原谅你。'], en: ['Hmph. Forgiven, this once.'] },
  greet: { zh: ['{v}！你回来啦！'], en: ["{v}! You're back!"] },
  greetLong: { zh: ['你去哪儿了？我等了{t}！'], en: ['Where were you? I waited {t}!'] },
  gameEnd: { zh: ['接到 {n} 个！太开心啦！'], en: ['Caught {n}! So much fun!'] },
  gameBruised: { zh: ['接到 {n} 个…可被石头砸了 {m} 次！'], en: ['Caught {n}… and got hit by {m} rocks!'] },
  gameNone: { zh: ['一个都没接到…'], en: ["Didn't catch a thing…"] },
  room: { zh: ['{room} 到啦！'], en: ['Welcome to {room}!'] }
};

/* ---------- saved state ---------- */

const STORAGE_KEY = 'PIXEL_PAWS_SAVE_V1';
const ANNOYED = 50; // the pet insults you from here up

const newPet = (name, gender) => ({ name, gender, level: 1, exp: 0, happy: 80, full: 75, energy: 85, sleeping: false, annoy: 0, hat: null });
const defaultState = () => ({
  lang: 'zh',
  coins: 120,
  activeSpecies: 'panda',
  lastSeen: Date.now(),
  owned: [],
  decorOn: [],
  daily: { date: '', gift: false, streak: 0, lastGift: '', pat: 0, fav: 0, game: 0, done: {} },
  pets: {
    panda: newPet('团子', 'female'),
    cat: newPet('奶糖', 'female'),
    dog: newPet('布丁', 'male'),
    dino: newPet('小绿', 'male')
  }
});

/* Turns whatever was saved, by this version or the first one, into a full state. */
function normalize(saved) {
  const d = defaultState();
  const s = { ...d, ...saved };
  const num = (v, fallback, lo, hi) => (Number.isFinite(Number(v)) ? clamp(Number(v), lo, hi) : fallback);
  s.lang = s.lang === 'en' ? 'en' : 'zh';
  s.coins = Math.round(num(s.coins, d.coins, 0, 1e9));
  if (!SPECIES[s.activeSpecies]) s.activeSpecies = 'panda';
  s.lastSeen = num(saved.lastSeen, Date.now(), 0, Date.now());
  s.owned = Array.isArray(saved.owned) ? saved.owned.filter(x => typeof x === 'string') : [];
  s.decorOn = Array.isArray(saved.decorOn) ? saved.decorOn.filter(x => s.owned.includes(x)) : [];
  s.daily = { ...d.daily, ...(saved.daily || {}) };
  s.daily.done = { ...((saved.daily || {}).done || {}) };
  s.pets = {};
  for (const id of Object.keys(d.pets)) {
    const p = { ...d.pets[id], ...((saved.pets || {})[id] || {}) };
    p.name = String(p.name || d.pets[id].name).slice(0, 12);
    p.gender = p.gender === 'male' ? 'male' : 'female';
    p.level = Math.round(num(p.level, 1, 1, 9999));
    p.exp = num(p.exp, 0, 0, 1e9);
    for (const k of ['happy', 'full', 'energy', 'annoy']) p[k] = num(p[k], d.pets[id][k], 0, 100);
    p.sleeping = !!p.sleeping;
    p.hat = s.owned.includes(p.hat) ? p.hat : null;
    s.pets[id] = p;
  }
  return s;
}

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? normalize(JSON.parse(raw)) : defaultState();
  } catch {
    return defaultState();
  }
}

function saveState() {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch {}
}

let state = loadState();
const cur = () => state.pets[state.activeSpecies];
const isZh = () => state.lang === 'zh';
const tr = (zh, en) => (isZh() ? zh : en);

/* ---------- time passing ---------- */

/* What `sec` seconds do to one pet that nobody touches, awake or asleep.
   The same rule runs while the page is open and for the time it was closed. */
function stepPet(pet, sec) {
  if (pet.sleeping) {
    pet.energy = Math.min(100, pet.energy + sec / 30);   // empty to full in 50 minutes
    pet.full = Math.max(0, pet.full - sec / 1200);
    pet.annoy = Math.max(0, pet.annoy - sec * 0.2);
    return;
  }
  pet.full = Math.max(0, pet.full - sec / 540);          // full to empty in 15 hours
  pet.energy = Math.max(0, pet.energy - sec / 720);      // 20 hours
  pet.happy = Math.max(0, pet.happy - (sec / 600) * (pet.full < 25 ? 2 : 1));
  // A hungry or miserable pet works itself up; otherwise it calms down.
  const temper = pet.full < 20 ? 0.1 : pet.happy < 20 ? 0.05 : -0.1;
  pet.annoy = clamp(pet.annoy + sec * temper, 0, 100);
}

/* Brings every pet up to `now`. Returns how many seconds had gone by. */
function advance(now) {
  const gone = Math.max(0, (now - state.lastSeen) / 1000);
  state.lastSeen = now;
  let left = Math.min(gone, 7 * 86400);
  while (left > 0) {
    const s = Math.min(60, left);
    for (const id in state.pets) stepPet(state.pets[id], s);
    left -= s;
  }
  return gone;
}

function today(d) {
  d = d || new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}
function yesterday() {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return today(d);
}

function awayText(sec) {
  const m = Math.round(sec / 60);
  if (m < 60) return tr(`${m} 分钟`, `${m} min`);
  const h = Math.round(m / 60);
  if (h < 48) return tr(`${h} 小时`, h === 1 ? '1 hour' : `${h} hours`);
  const days = Math.round(h / 24);
  return tr(`${days} 天`, `${days} days`);
}

/* ---------- speech, moods and insults ---------- */

let bubbleUntil = 0;

function bubble(main, sub, angry, ms) {
  const el = $('speech-bubble');
  el.textContent = '';
  const a = document.createElement('div');
  a.textContent = main;
  el.appendChild(a);
  if (sub) {
    const b = document.createElement('div');
    b.className = 'bubble-sub';
    b.textContent = sub;
    el.appendChild(b);
  }
  el.classList.remove('angry');
  void el.offsetWidth; // lets the shake start again
  el.classList.toggle('angry', !!angry);
  el.classList.remove('hidden');
  clearTimeout(el._t);
  el._t = setTimeout(() => el.classList.add('hidden'), ms);
  bubbleUntil = performance.now() + ms;
}

const say = msg => bubble(msg, '', false, 2400);

function line(key, vars) {
  const sp = SPECIES[state.activeSpecies];
  const all = { v: sp.voice[state.lang], ...(vars || {}) };
  return pick(LINES[key][state.lang]).replace(/\{(\w+)\}/g, (_, k) => (k in all ? all[k] : ''));
}

function showToast(msg) {
  const el = $('toast');
  const showing = !el.classList.contains('hidden');
  // Messages that arrive together are stacked, the newest three at most.
  const lines = showing ? el.textContent.split('\n').filter(l => l !== msg) : [];
  el.textContent = lines.concat(msg).slice(-3).join('\n');
  el.classList.remove('hidden');
  clearTimeout(el._t);
  el._t = setTimeout(() => el.classList.add('hidden'), 2400);
}

/* Deals a list out in random order, each entry once before any comes round again. */
function rotation(list) {
  let bag = [];
  let last = null;
  return () => {
    if (!bag.length) {
      bag = list.slice();
      for (let i = bag.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [bag[i], bag[j]] = [bag[j], bag[i]];
      }
      // The first of a new round is never the last of the old one.
      if (bag[bag.length - 1] === last) bag.reverse();
    }
    last = bag.pop();
    return last;
  };
}

const nextInsult = rotation(INSULTS);
const nextBlame = rotation(BLAMES);

function insult() {
  const i = nextInsult();
  setAnim('rant', 0.7);
  bubble(i.zh, isZh() ? '' : `${i.py} · ${i.en}`, true, 3200);
  nextMutterAt = performance.now() + 9000 + Math.random() * 6000;
}

/* Shouted mid-game, so it is gone sooner than an insult. */
function blame() {
  const b = nextBlame();
  game.blameUntil = T + 1.2;
  bubble(b.zh, isZh() ? '' : `${b.py} · ${b.en}`, true, 1900);
}

const annoyed = pet => pet.annoy >= ANNOYED;
const vex = (pet, by) => { pet.annoy = clamp(pet.annoy + by, 0, 100); };

/* An annoyed pet answers everything with an insult. */
function respond(pet, normal) {
  if (annoyed(pet)) insult();
  else say(normal);
}

/* After something that soothes: says so if that was enough to calm it down. */
function respondSoothed(pet, wasAnnoyed, normal) {
  if (wasAnnoyed && !annoyed(pet)) say(line('forgive'));
  else respond(pet, normal);
}

function moodOf(pet) {
  if (pet.sleeping) return { cls: 'asleep', text: tr('😴 睡觉中', '😴 Asleep') };
  if (annoyed(pet)) return { cls: 'bad', text: tr('😠 生气了', '😠 Annoyed') };
  if (pet.full < 25) return { cls: 'low', text: tr('🍙 饿了', '🍙 Hungry') };
  if (pet.energy < 20) return { cls: 'low', text: tr('🥱 困了', '🥱 Tired') };
  if (pet.happy < 25) return { cls: 'low', text: tr('😢 不开心', '😢 Sad') };
  if (pet.happy >= 70) return { cls: '', text: tr('😊 开心', '😊 Happy') };
  return { cls: '', text: tr('🙂 还不错', '🙂 Fine') };
}

/* ---------- actions ---------- */

const PAT_COOLDOWN = 5000;
let patReadyAt = 0;
let patSpam = 0;
let nextMutterAt = 0;

function refresh() {
  saveState();
  UI.render();
}

/* Touching a sleeping pet: it grumbles, and wakes up furious if pushed far enough. */
function disturb(pet) {
  vex(pet, 15);
  if (annoyed(pet)) {
    pet.sleeping = false;
    insult();
  } else {
    say(line('disturbed'));
  }
  refresh();
}

const Pet = {
  gainExp(pet, pts) {
    pet.exp += pts;
    while (pet.exp >= pet.level * 100) {
      pet.exp -= pet.level * 100;
      pet.level += 1;
      state.coins += 25;
      burst('star', 8);
      showToast(tr(`🎉 升到 Lv.${pet.level}！奖励 25 金币`, `🎉 Level Up! Lv.${pet.level} (+25 coins)`));
    }
  },

  rename(val) {
    const trimmed = val.trim();
    if (trimmed) cur().name = trimmed.slice(0, 12);
    refresh();
  },

  pat() {
    if (game) return;
    const pet = cur();
    if (pet.sleeping) return disturb(pet);
    const now = performance.now();
    if (now < patReadyAt) {
      // One pat too many is a warning; after that each one annoys.
      patSpam += 1;
      if (patSpam >= 2) vex(pet, 20);
      setAnim('refuse', 0.5);
      respond(pet, line('patEnough'));
      return refresh();
    }
    patReadyAt = now + PAT_COOLDOWN;
    patSpam = 0;
    const btn = $('btn-pat');
    btn.classList.add('cooling');
    setTimeout(() => btn.classList.remove('cooling'), PAT_COOLDOWN);

    if (annoyed(pet)) {
      vex(pet, -5);
      insult();
    } else {
      const eager = pet.happy < 95;
      pet.happy = Math.min(100, pet.happy + (eager ? 6 : 1));
      this.gainExp(pet, eager ? 5 : 1);
      goalTick('pat');
      setAnim('pat', 0.9);
      burst('heart', 4);
      say(line('pat'));
    }
    refresh();
  },

  play() {
    if (game) return;
    const pet = cur();
    if (pet.sleeping) return disturb(pet);
    if (pet.energy < 15) {
      vex(pet, 20);
      setAnim('refuse', 0.5);
      respond(pet, line('tired'));
      return refresh();
    }
    startGame();
  },

  sleep() {
    if (game) return;
    const pet = cur();
    if (pet.sleeping) {
      pet.sleeping = false;
      if (pet.energy < 50) {
        vex(pet, 55);
        respond(pet, line('wakeEarly'));
      } else {
        if (pet.energy >= 90) this.gainExp(pet, 8);
        respond(pet, line('wake'));
      }
    } else if (pet.energy >= 90) {
      respond(pet, line('notSleepy'));
    } else {
      pet.sleeping = true;
      say(line('sleep'));
    }
    refresh();
  },

  useSnack(snack) {
    if (game) return;
    const pet = cur();
    if (pet.sleeping) return disturb(pet);
    if (pet.full >= 95) {
      vex(pet, 20);
      setAnim('refuse', 0.5);
      respond(pet, line('stuffed'));
      return refresh();
    }
    if (state.coins < snack.cost) {
      showToast(tr('金币不够啦，去玩耍赚点金币吧', 'Not enough coins! Play to earn more'));
      return;
    }
    state.coins -= snack.cost;
    const wasAnnoyed = annoyed(pet);
    const bonus = snack.fav ? 10 : 0;
    pet.full = Math.min(100, pet.full + 22 + bonus);
    pet.happy = Math.min(100, pet.happy + 6 + bonus);
    vex(pet, snack.fav ? -45 : -25);
    this.gainExp(pet, 12 + (snack.fav ? 8 : 0));
    if (snack.fav) goalTick('fav');
    setAnim('eat', 1.4, snack.id);
    if (snack.fav) burst('heart', 3);
    const food = snack.name[state.lang];
    respondSoothed(pet, wasAnnoyed, line(snack.fav ? 'eatFav' : 'eat', { food }));
    refresh();
  }
};

/* ---------- the catch game ---------- */

const GAME_SECONDS = 30;
let game = null;

function startGame() {
  const pet = cur();
  game = { t: GAME_SECONDS, score: 0, caught: 0, rocks: 0, blameUntil: 0, items: [], x: LW / 2, tx: LW / 2, spawn: 0.6, stun: 0 };
  document.body.classList.add('playing');
  $('game-hud').classList.remove('hidden');
  updateHud();
  respond(pet, tr('拖动接住零食，躲开石头！', 'Drag to catch snacks. Dodge the rocks!'));
}

function updateHud() {
  $('hud-time').textContent = Math.max(0, Math.ceil(game.t));
  $('hud-score').textContent = game.score;
}

function gameStep(dt) {
  const g = game;
  g.t -= dt;
  if (g.t <= 0) return endGame();
  const elapsed = GAME_SECONDS - g.t;
  const speed = 38 + elapsed * 1.6;

  g.spawn -= dt;
  if (g.spawn <= 0) {
    g.spawn = 0.75 - elapsed * 0.012;
    const snacks = SPECIES[state.activeSpecies].snacks;
    const roll = Math.random();
    const snack = roll < 0.22 ? null : pick(snacks);
    g.items.push({ x: 12 + Math.random() * (LW - 24), y: -16, kind: snack ? snack.id : 'rock', worth: snack ? (snack.fav ? 3 : 1) : -2 });
  }

  if (g.stun > 0) g.stun -= dt;
  else g.x += clamp(g.tx - g.x, -170 * dt, 170 * dt);

  for (let i = g.items.length - 1; i >= 0; i--) {
    const it = g.items[i];
    it.y += speed * dt;
    const reach = it.y + 14 >= FEET - 38 && it.y <= FEET - 12 && Math.abs(it.x - g.x) < 15;
    if (reach) {
      g.items.splice(i, 1);
      if (it.worth > 0) {
        g.score += it.worth;
        g.caught += 1;
        spawnPart(it.worth > 1 ? 'heart' : 'star', g.x, FEET - 42);
      } else {
        g.score = Math.max(0, g.score + it.worth);
        g.stun = 0.6;
        g.rocks += 1;
        spawnPart('cross', g.x, FEET - 42);
        if (g.rocks >= BLAME_FROM) blame();
      }
    } else if (it.y > LH) {
      g.items.splice(i, 1);
    }
  }
  updateHud();
}

function endGame() {
  const g = game;
  if (!g) return;
  game = null;
  document.body.classList.remove('playing');
  $('game-hud').classList.add('hidden');
  const pet = cur();
  const wasAnnoyed = annoyed(pet);
  pet.energy = Math.max(0, pet.energy - 15);
  pet.full = Math.max(0, pet.full - 8);
  pet.happy = Math.min(100, pet.happy + (SPECIES[state.activeSpecies].lovesPlay ? 25 : 15));
  vex(pet, -20);
  state.coins += g.score;
  if (g.score > 0) showToast(tr(`🪙 +${g.score} 金币`, `🪙 +${g.score} coins`));
  Pet.gainExp(pet, 10 + g.score);
  goalTick('game');
  setAnim('cheer', 1.2);
  burst('star', 5);
  const verdict = g.rocks >= BLAME_FROM ? line('gameBruised', { n: g.caught, m: g.rocks })
    : g.caught ? line('gameEnd', { n: g.caught }) : line('gameNone');
  respondSoothed(pet, wasAnnoyed, verdict);
  refresh();
}

/* ---------- daily gift and goals ---------- */

function rollDaily() {
  const d = state.daily;
  if (d.date === today()) return;
  d.date = today();
  d.gift = false;
  d.pat = 0;
  d.fav = 0;
  d.game = 0;
  d.done = {};
}

function goalTick(id) {
  rollDaily();
  const d = state.daily;
  const goal = GOALS.find(g => g.id === id);
  if (d.done[id]) return;
  d[id] += 1;
  if (d[id] >= goal.need) {
    d.done[id] = true;
    state.coins += GOAL_REWARD;
    showToast(tr(`✅ 完成任务！+${GOAL_REWARD} 金币`, `✅ Goal done! +${GOAL_REWARD} coins`));
  }
}

function giftAmount(streak) {
  return 20 + Math.min(streak - 1, 6) * 5;
}

function claimGift() {
  rollDaily();
  const d = state.daily;
  if (d.gift) return;
  d.streak = d.lastGift === yesterday() ? d.streak + 1 : 1;
  d.lastGift = today();
  d.gift = true;
  const amount = giftAmount(d.streak);
  state.coins += amount;
  burst('star', 6);
  showToast(tr(`🎁 每日礼物 +${amount} 金币（连续 ${d.streak} 天）`, `🎁 Daily gift +${amount} coins (day ${d.streak} in a row)`));
  refresh();
}

/* ---------- the shop ---------- */

function shopClick(kind, item) {
  const pet = cur();
  if (!state.owned.includes(item.id)) {
    if (state.coins < item.cost) {
      showToast(tr('金币不够啦，去玩耍赚点金币吧', 'Not enough coins! Play to earn more'));
      return;
    }
    state.coins -= item.cost;
    state.owned.push(item.id);
    if (kind === 'hats') pet.hat = item.id;
    else state.decorOn.push(item.id);
    burst('star', 5);
    showToast(tr(`买到了${item.name.zh}！`, `Bought the ${item.name.en}!`));
  } else if (kind === 'hats') {
    pet.hat = pet.hat === item.id ? null : item.id;
  } else if (state.decorOn.includes(item.id)) {
    state.decorOn = state.decorOn.filter(x => x !== item.id);
  } else {
    state.decorOn.push(item.id);
  }
  refresh();
}

/* ---------- app-level buttons ---------- */

const App = {
  toggleLang() {
    const from = state.lang;
    state.lang = from === 'zh' ? 'en' : 'zh';
    // A pet still on its default name takes the default of the new language.
    for (const id in state.pets) {
      if (state.pets[id].name === SPECIES[id].defaultName[from]) state.pets[id].name = SPECIES[id].defaultName[state.lang];
    }
    refresh();
  },
  selectSpecies(id) {
    if (game) return;
    state.activeSpecies = id;
    anim = null;
    refresh();
    const pet = cur();
    if (!pet.sleeping) respond(pet, line('room', { room: SPECIES[id].roomName[state.lang] }));
  },
  setGender(g) {
    cur().gender = g;
    refresh();
    say(g === 'female' ? tr('🎀 戴上蝴蝶结啦！', '🎀 Cute bow on!') : tr('👔 帅气领结登场！', '👔 Dapper bowtie on!'));
  },
  togglePanel(id) {
    for (const other of ['save-panel', 'shop-panel']) {
      if (other !== id) $(other).classList.add('hidden');
    }
    $(id).classList.toggle('hidden');
  },
  exportSave() {
    const box = $('save-code-box');
    box.value = btoa(unescape(encodeURIComponent(JSON.stringify(state))));
    box.focus();
    box.select();
    showToast(tr('已生成存档码，可复制保存到备忘录', 'Save code generated!'));
  },
  importSave() {
    const box = $('save-code-box');
    try {
      const decoded = JSON.parse(decodeURIComponent(escape(atob(box.value.trim()))));
      if (!decoded || !decoded.pets) throw new Error('invalid');
      state = normalize(decoded);
      state.lastSeen = Date.now(); // no time passes for a save that was put away
      refresh();
      showToast(tr('存档恢复成功！', 'Save restored!'));
    } catch {
      showToast(tr('存档码格式不正确', 'Invalid save code'));
    }
  }
};

/* ---------- the page ---------- */

const UI = {
  render() {
    const sp = SPECIES[state.activeSpecies];
    const pet = cur();
    const L = state.lang;
    rollDaily();

    document.documentElement.lang = isZh() ? 'zh-CN' : 'en';
    $('header-paw-icon').innerHTML = svgIcon('paw', 'px-icon');
    $('coin-icon-slot').innerHTML = svgIcon('coin', 'px-icon');
    $('btn-lang').textContent = tr('中文 / EN', 'EN / 中文');
    $('btn-shop').textContent = tr('🛍️ 商店', '🛍️ Shop');
    $('btn-save-panel').textContent = tr('💾 存档', '💾 Save');
    $('t-subtitle-badge').textContent = tr('像素陪伴', 'Pixel Pet');
    $('t-iphone-tip').textContent = tr('iPhone Safari 点分享 → 添加到主屏幕即可安装', 'iPhone Safari: Share → Add to Home Screen to install');

    $('t-save-title').textContent = tr('💾 存档备份与恢复（推荐定期导出到备忘录）', '💾 Save Backup & Restore (Recommended for Safari)');
    $('btn-export-save').textContent = tr('📤 导出存档码', '📤 Export Save');
    $('btn-import-save').textContent = tr('📥 导入存档码', '📥 Import Save');
    $('save-code-box').placeholder = tr('点“导出存档码”生成备份，或粘贴之前导出的存档码后点“导入存档码”...', 'Tap "Export Save" to make a backup, or paste an earlier code and tap "Import Save"...');

    const tabs = $('species-tabs');
    tabs.textContent = '';
    Object.values(SPECIES).forEach(item => {
      const btn = document.createElement('button');
      btn.className = `pixel-btn ${item.id === state.activeSpecies ? 'bg-gold' : 'bg-card'}`;
      btn.textContent = item.name[L];
      btn.onclick = () => App.selectSpecies(item.id);
      tabs.appendChild(btn);
    });

    $('t-gender-label').textContent = tr('性别：', 'Gender:');
    $('btn-gender-female').textContent = tr('♀ 女生', '♀ Girl');
    $('btn-gender-male').textContent = tr('♂ 男生', '♂ Boy');
    $('btn-gender-female').classList.toggle('selected', pet.gender === 'female');
    $('btn-gender-male').classList.toggle('selected', pet.gender === 'male');

    $('ui-room-badge').textContent = sp.roomName[L];
    $('ui-fav-hint').textContent = sp.favLabel[L];
    $('ui-room-desc').textContent = sp.roomDesc[L];
    $('t-room-desc-title').textContent = tr('🏡 房间特色', '🏡 Room Vibe');

    $('btn-pat').textContent = tr('✋ 摸摸', '✋ Pat');
    $('btn-play').textContent = tr('🧶 玩耍', '🧶 Play');

    const grid = $('snacks-grid');
    grid.textContent = '';
    sp.snacks.forEach(sn => {
      const card = document.createElement('button');
      card.className = `pixel-card-sm snack ${sn.fav ? 'fav' : ''}`;
      card.onclick = () => Pet.useSnack(sn);
      card.innerHTML = `
        ${sn.fav ? `<span class="fav-badge">${tr('❤️ 最爱', '❤️ FAV')}</span>` : ''}
        ${svgIcon(sn.id)}
        <span class="snack-name">${sn.name[L]}</span>
        <span class="snack-cost">🪙 ${sn.cost}</span>`;
      grid.appendChild(card);
    });

    const nameInput = $('pet-name-input');
    if (document.activeElement !== nameInput) nameInput.value = pet.name;
    const gTag = $('ui-gender-tag');
    gTag.textContent = pet.gender === 'female' ? tr('♀ 女生', '♀ Girl') : tr('♂ 男生', '♂ Boy');
    gTag.className = `tag ${pet.gender === 'female' ? 'bg-pink' : 'bg-blue'}`;

    $('lbl-exp').textContent = tr('✨ 经验', '✨ EXP');
    $('lbl-happy').textContent = tr('💖 开心', '💖 Happy');
    $('lbl-full').textContent = tr('🍙 饱腹', '🍙 Full');
    $('lbl-energy').textContent = tr('⚡ 精力', '⚡ Energy');
    $('lbl-annoy').textContent = tr('💢 怒气', '💢 Temper');

    // Shop
    $('t-shop-title').textContent = tr('🛍️ 商店（买过的可以随时换）', '🛍️ Shop (swap what you own any time)');
    $('t-shop-hats').textContent = tr(`🎩 帽子 · 给${pet.name}戴`, `🎩 Hats · for ${pet.name}`);
    $('t-shop-decor').textContent = tr('🏡 房间装饰 · 每个房间都有', '🏡 Room decor · shown in every room');
    for (const kind of ['hats', 'decor']) {
      const box = $(`shop-${kind}`);
      box.textContent = '';
      SHOP[kind].forEach(item => {
        const owned = state.owned.includes(item.id);
        const active = kind === 'hats' ? pet.hat === item.id : state.decorOn.includes(item.id);
        const btn = document.createElement('button');
        btn.className = `pixel-card-sm shop-item ${owned ? 'owned' : ''} ${active ? 'active' : ''}`;
        btn.onclick = () => shopClick(kind, item);
        let status;
        if (!owned) status = `🪙 ${item.cost}`;
        else if (kind === 'hats') status = active ? tr('✓ 戴着 · 点击摘下', '✓ Wearing · tap to remove') : tr('点击戴上', 'Tap to wear');
        else status = active ? tr('✓ 摆着 · 点击收起', '✓ Out · tap to store') : tr('点击摆放', 'Tap to place');
        btn.innerHTML = `${svgIcon(item.id)}<span class="shop-name">${item.name[L]}</span><span class="shop-state">${status}</span>`;
        box.appendChild(btn);
      });
    }

    // Daily
    const d = state.daily;
    $('t-daily-title').textContent = tr('📅 今日任务', "📅 Today's goals");
    const gift = $('btn-gift');
    const nextStreak = d.lastGift === yesterday() ? d.streak + 1 : 1;
    gift.disabled = d.gift;
    gift.textContent = d.gift ? tr('🎁 已领取', '🎁 Claimed') : tr(`🎁 领取 +${giftAmount(nextStreak)}`, `🎁 Gift +${giftAmount(nextStreak)}`);
    const list = $('goal-list');
    list.textContent = '';
    GOALS.forEach(g => {
      const li = document.createElement('li');
      const done = !!d.done[g.id];
      if (done) li.className = 'done';
      const a = document.createElement('span');
      a.textContent = g.name[L];
      const b = document.createElement('span');
      b.textContent = done ? '✓' : `${Math.min(d[g.id], g.need)}/${g.need} · 🪙 ${GOAL_REWARD}`;
      li.append(a, b);
      list.appendChild(li);
    });

    this.stats();
  },

  /* The parts that change as time passes; cheap enough to run every second. */
  stats() {
    const pet = cur();
    $('ui-coins').textContent = state.coins;
    $('btn-sleep').textContent = pet.sleeping ? tr('☀️ 唤醒', '☀️ Wake') : tr('💤 休息', '💤 Sleep');
    $('ui-level').textContent = pet.level;
    const maxExp = pet.level * 100;
    $('val-exp').textContent = `${Math.floor(pet.exp)}/${maxExp}`;
    $('bar-exp').style.width = `${Math.min(100, (pet.exp / maxExp) * 100)}%`;
    for (const k of ['happy', 'full', 'energy', 'annoy']) {
      $(`val-${k}`).textContent = Math.round(pet[k]);
      $(`bar-${k}`).style.width = `${pet[k]}%`;
    }
    const mood = moodOf(pet);
    const el = $('ui-mood');
    el.textContent = mood.text;
    el.className = `mood ${mood.cls}`;
  }
};

/* ============================================================
   Drawing. The scene is 120 pixels high and as wide as the box
   makes it, scaled up by the browser, so every shape is drawn in
   whole pixels and stays crisp.
   ============================================================ */

const canvas = $('scene-canvas');
const ctx = canvas.getContext('2d');
const LH = 120;   // scene height
const GY = 84;    // where the floor starts
const FEET = 102; // where the pet stands
let LW = 160;     // scene width, set by fit()
let T = 0;        // seconds of animation so far

function fit() {
  const r = canvas.getBoundingClientRect();
  if (r.width < 1 || r.height < 1) return;
  const w = Math.round((LH * r.width) / r.height);
  if (canvas.width !== w || canvas.height !== LH) {
    LW = w;
    canvas.width = w;
    canvas.height = LH;
  }
}

function R(x, y, w, h, c) {
  ctx.fillStyle = c;
  ctx.fillRect(Math.round(x), Math.round(y), Math.round(w), Math.round(h));
}

function E(cx, cy, rx, ry, c) {
  cx = Math.round(cx);
  cy = Math.round(cy);
  ctx.fillStyle = c;
  for (let dy = -ry; dy <= ry; dy++) {
    const hw = Math.round(rx * Math.sqrt(Math.max(0, 1 - (dy * dy) / ((ry + 0.5) * (ry + 0.5)))));
    ctx.fillRect(cx - hw, cy + dy, hw * 2 + 1, 1);
  }
}

function EO(cx, cy, rx, ry, c) {
  E(cx, cy, rx + 1, ry + 1, INK);
  E(cx, cy, rx, ry, c);
}

/* A triangle pointing up: tip at (cx, top), `half` wide each side at the base. */
function tri(cx, top, half, h, c) {
  cx = Math.round(cx);
  top = Math.round(top);
  ctx.fillStyle = c;
  for (let i = 0; i < h; i++) {
    const w = Math.round(((i + 1) / h) * half);
    ctx.fillRect(cx - w, top + i, w * 2 + 1, 1);
  }
}

function triO(cx, top, half, h, c) {
  tri(cx, top - 1, half + 1, h + 1, INK);
  tri(cx, top, half, h, c);
}

function drawIcon(name, x, y) {
  x = Math.round(x);
  y = Math.round(y);
  for (const [rx, ry, w, h, c] of ICONS[name] || ICONS.cookie) R(x + rx, y + ry, w, h, c);
}

/* ---------- particles ---------- */

const parts = [];

function spawnPart(kind, x, y) {
  parts.push({
    kind, x: x + (Math.random() - 0.5) * 16, y: y + (Math.random() - 0.5) * 8,
    vx: (Math.random() - 0.5) * 10, vy: kind === 'crumb' ? 12 : -14 - Math.random() * 8,
    life: kind === 'z' ? 1.8 : 1.1
  });
}

function burst(kind, n) {
  for (let i = 0; i < n; i++) spawnPart(kind, LW / 2, FEET - 38);
}

function drawParts(dt) {
  for (let i = parts.length - 1; i >= 0; i--) {
    const p = parts[i];
    p.life -= dt;
    if (p.life <= 0) { parts.splice(i, 1); continue; }
    p.x += p.vx * dt;
    p.y += p.vy * dt;
    const x = Math.round(p.x), y = Math.round(p.y);
    if (p.kind === 'heart') {
      R(x, y, 2, 1, '#F0607F'); R(x + 3, y, 2, 1, '#F0607F'); R(x, y + 1, 5, 1, '#F0607F'); R(x + 1, y + 2, 3, 1, '#F0607F'); R(x + 2, y + 3, 1, 1, '#F0607F');
    } else if (p.kind === 'star') {
      R(x + 1, y, 1, 3, '#F4C95D'); R(x, y + 1, 3, 1, '#F4C95D'); R(x + 1, y + 1, 1, 1, '#FFF3B0');
    } else if (p.kind === 'z') {
      R(x, y, 5, 1, '#FFFFFF'); R(x + 3, y + 1, 1, 1, '#FFFFFF'); R(x + 2, y + 2, 1, 1, '#FFFFFF'); R(x + 1, y + 3, 1, 1, '#FFFFFF'); R(x, y + 4, 5, 1, '#FFFFFF');
    } else if (p.kind === 'cross') {
      R(x, y, 1, 1, '#E5534B'); R(x + 2, y, 1, 1, '#E5534B'); R(x + 1, y + 1, 1, 1, '#E5534B'); R(x, y + 2, 1, 1, '#E5534B'); R(x + 2, y + 2, 1, 1, '#E5534B');
    } else {
      R(x, y, 1, 1, '#C9805A');
    }
  }
}

/* ---------- rooms ---------- */

function bambooStalk(x, i) {
  const sway = Math.sin(T * 1.2 + i * 1.7) * 3;
  for (let k = 0; k < 9; k++) {
    const y = GY + 6 - (k + 1) * 12;
    const off = Math.round(sway * (k / 8) * (k / 8));
    R(x + off, y, 4, 12, '#4CAF50');
    R(x + off, y + 1, 1, 11, '#7BC67E');
    R(x + off, y, 4, 1, '#2E7D32');
    if (k % 2 === (i % 2) && k > 1) {
      const side = (k + i) % 4 < 2 ? 4 : -6;
      R(x + off + side, y + 2, 6, 2, '#66BB6A');
      R(x + off + side + (side > 0 ? 3 : -2), y + 4, 5, 1, '#66BB6A');
    }
  }
}

function fern(x, base, n, i) {
  const sway = Math.sin(T * 1.1 + i * 2) * 2;
  R(x, base - n * 6, 2, n * 6, '#2D6A4F');
  for (let k = 0; k < n; k++) {
    const y = base - 4 - k * 6;
    const len = (n - k) * 2 + 4;
    const off = Math.round(sway * (k / n));
    R(x - len + off, y, len, 2, '#40916C');
    R(x - len + off + 1, y + 2, len - 2, 1, '#52B788');
    R(x + 2 + off, y - 1, len, 2, '#40916C');
    R(x + 3 + off, y + 1, len - 2, 1, '#52B788');
  }
}

function drawRoom(sp) {
  const W = LW, H = LH;
  if (sp === 'panda') {
    R(0, 0, W, H, '#E8F5E9');
    for (let i = 0; i < 12; i++) R(Math.round(W * (0.04 + i * 0.085)), 0, 2, GY, '#D3EAD5');
    R(0, GY, W, H - GY, '#A5D6A7');
    R(0, GY, W, 1, '#8CC78F');
    for (let i = 0; i < 9; i++) R(Math.round(W * (0.06 + i * 0.11)), GY + 6 + (i % 3) * 9, 3, 1, '#8CC78F');
    // lantern
    const lx = Math.round(W * 0.68) + Math.round(Math.sin(T * 1.5));
    R(lx, 0, 1, 9, INK);
    EO(lx, 16, 5, 6, '#E5534B');
    R(lx - 4, 11, 9, 1, '#F4C95D'); R(lx - 4, 21, 9, 1, '#F4C95D'); R(lx, 23, 1, 4, '#F4C95D');
    R(lx - 2, 14, 1, 4, '#F28B82');
    // tea table
    const tx = Math.round(W * 0.2);
    R(tx, GY + 9, 20, 3, '#A9744F'); R(tx, GY + 9, 20, 1, '#C08A5E');
    R(tx + 2, GY + 12, 2, 6, '#8C5A3C'); R(tx + 16, GY + 12, 2, 6, '#8C5A3C');
    R(tx + 7, GY + 5, 6, 4, '#FFFDF9'); R(tx + 13, GY + 6, 1, 2, '#FFFDF9'); R(tx + 8, GY + 5, 4, 1, '#B7D9A8');
    for (let k = 0; k < 3; k++) R(tx + 9 + Math.round(Math.sin(T * 2 + k)), GY + 2 - k * 2, 1, 1, '#FFFFFF');
    [0.06, 0.16, 0.84, 0.94].forEach((fx, i) => bambooStalk(Math.round(W * fx), i));
  } else if (sp === 'cat') {
    R(0, 0, W, GY, '#FFF3E0');
    for (let x = 4; x < W; x += 10) R(x, 0, 1, GY, '#FBE6CC');
    R(0, GY - 3, W, 3, '#E0B892');
    R(0, GY, W, H - GY, '#F3D5B5');
    R(0, GY + 9, W, 1, '#E6C29C'); R(0, GY + 22, W, 1, '#E6C29C');
    for (let x = 12; x < W; x += 34) { R(x, GY, 1, 9, '#E6C29C'); R(x + 17, GY + 10, 1, 12, '#E6C29C'); }
    // window
    const wx = Math.round(W * 0.09);
    R(wx, 14, 30, 30, '#A9744F'); R(wx + 2, 16, 26, 26, '#BDE3F2');
    E(wx + 9 + Math.round((T * 2) % 14), 23, 4, 2, '#FFFFFF');
    R(wx + 14, 16, 2, 26, '#A9744F'); R(wx + 2, 28, 26, 2, '#A9744F');
    R(wx - 2, 44, 34, 3, '#C08A5E');
    R(wx - 3, 12, 6, 30, '#F7C6D0'); R(wx + 27, 12, 6, 30, '#F7C6D0'); R(wx - 4, 10, 38, 3, '#E59AAE');
    // fireplace
    const fx = Math.round(W * 0.74), fw = 30;
    R(fx, 44, fw, GY - 44, '#C97B4A');
    for (let y = 48; y < GY; y += 6) R(fx, y, fw, 1, '#A85F36');
    for (let y = 44; y < GY; y += 12) { R(fx + 9, y, 1, 5, '#A85F36'); R(fx + 21, y + 6, 1, 5, '#A85F36'); }
    R(fx - 2, 40, fw + 4, 4, '#8C5A3C'); R(fx - 2, 40, fw + 4, 1, '#A9744F');
    R(fx + 6, 58, fw - 12, GY - 58, '#3D2B1F');
    const fl = k => Math.round(Math.abs(Math.sin(T * 6 + k * 2.1)) * 5);
    R(fx + 9, GY - 9 - fl(0), 4, 9 + fl(0), '#FF7043');
    R(fx + 13, GY - 13 - fl(1), 4, 13 + fl(1), '#FF8A50');
    R(fx + 17, GY - 8 - fl(2), 4, 8 + fl(2), '#FF7043');
    R(fx + 11, GY - 5 - fl(3), 3, 5 + fl(3), '#FFD54F'); R(fx + 15, GY - 6 - fl(4), 3, 6 + fl(4), '#FFD54F');
    R(fx + 5, GY - 2, fw - 10, 2, '#5C4033');
    E(fx + 15, GY + 5, 15, 3, 'rgba(255,183,77,0.25)');
    // cushion and yarn
    EO(Math.round(W * 0.17), 107, 14, 5, '#F59BB2'); E(Math.round(W * 0.17), 106, 10, 3, '#FADCE4');
    const yx = Math.round(W * 0.7);
    EO(yx, 108, 5, 5, '#7EC8E3'); R(yx - 3, 106, 6, 1, '#5C9EAD'); R(yx - 4, 109, 8, 1, '#5C9EAD'); R(yx + 5, 112, 6, 1, '#7EC8E3');
  } else if (sp === 'dog') {
    R(0, 0, W, 78, '#D4EBF2');
    const sx = Math.round(W * 0.86);
    E(sx, 16, 9, 9, '#FFE9A8'); E(sx, 16, 7, 7, '#FFD54F');
    const cx = ((T * 4) % (W + 60)) - 30;
    E(cx, 20, 9, 4, '#FFFFFF'); E(cx + 8, 17, 7, 4, '#FFFFFF'); E(cx - 8, 22, 6, 3, '#FFFFFF');
    E(Math.round(W * 0.28), 80, Math.round(W * 0.34), 16, '#CDEAC0'); E(Math.round(W * 0.82), 82, Math.round(W * 0.3), 14, '#BFE3B4');
    R(0, 78, W, H - 78, '#B7E4C7');
    for (let i = 0; i < 10; i++) { const gx = Math.round(W * (0.03 + i * 0.1)); R(gx, 88 + (i % 3) * 9, 1, 2, '#8FCFA5'); R(gx + 2, 89 + (i % 3) * 9, 1, 2, '#8FCFA5'); }
    // fence
    const f0 = Math.round(W * 0.4);
    R(f0, 66, W - f0, 2, '#FFFDF9'); R(f0, 74, W - f0, 2, '#FFFDF9');
    for (let x = f0; x < W; x += 8) { R(x, 62, 4, 18, '#FFFDF9'); R(x + 1, 61, 2, 1, '#FFFDF9'); R(x + 3, 63, 1, 17, '#E5D9C5'); }
    // doghouse
    const dx = Math.round(W * 0.07);
    R(dx - 1, 55, 32, 28, INK); R(dx, 56, 30, 26, '#E5989B');
    tri(dx + 15, 36, 20, 21, INK); tri(dx + 15, 38, 17, 18, '#C1666B');
    E(dx + 15, 70, 7, 7, '#5C4B51'); R(dx + 8, 70, 15, 12, '#5C4B51');
    R(dx + 10, 59, 10, 3, '#FFFDF9');
    // picnic blanket and ball
    const px = Math.round(W * 0.68);
    for (let r = 0; r < 3; r++) for (let c = 0; c < 7; c++) R(px + c * 5, 100 + r * 4, 5, 4, (r + c) % 2 ? '#FFFDF9' : '#E5534B');
    const bx = Math.round(W * 0.3);
    EO(bx, 108, 4, 4, '#F4C95D'); R(bx - 4, 108, 9, 1, '#FFFDF9');
  } else {
    R(0, 0, W, GY, '#E6F4EA');
    const vx = Math.round(W * 0.62);
    tri(vx, 30, 36, 54, '#C5DCCB'); R(vx - 4, 30, 9, 2, '#F4A261'); R(vx - 2, 32, 5, 2, '#F6BD60');
    for (let k = 0; k < 3; k++) { const p = (T * 0.25 + k / 3) % 1; E(vx + Math.round(Math.sin(p * 6 + k) * 3), 26 - p * 22, 3 + Math.round(p * 3), 2 + Math.round(p * 2), '#F4F8F5'); }
    R(0, GY, W, H - GY, '#C8E6C9'); R(0, GY, W, 1, '#A9D4AD');
    for (let i = 0; i < 8; i++) E(Math.round(W * (0.08 + i * 0.125)), GY + 8 + (i % 3) * 9, 4, 1, '#B4DAB8');
    fern(Math.round(W * 0.09), GY + 8, 9, 0);
    fern(Math.round(W * 0.93), GY + 6, 7, 1);
    fern(Math.round(W * 0.26), GY + 4, 4, 2);
    // amber
    const ax = Math.round(W * 0.8);
    const glow = 0.25 + 0.15 * Math.sin(T * 2);
    E(ax + 3, 98, 14, 7, `rgba(244,201,93,${glow.toFixed(2)})`);
    triO(ax, 88, 5, 12, '#F4C95D'); tri(ax - 1, 91, 2, 8, '#FFE699');
    triO(ax + 9, 93, 4, 8, '#F6A93B'); tri(ax + 8, 95, 1, 5, '#FFD27A');
    // nest
    const nx = Math.round(W * 0.2);
    E(nx - 3, 102, 4, 5, INK); E(nx - 3, 102, 3, 4, '#FFFDF9'); R(nx - 4, 101, 1, 1, '#88D498'); R(nx - 2, 103, 1, 1, '#88D498');
    E(nx + 5, 103, 4, 5, INK); E(nx + 5, 103, 3, 4, '#FFF3D6'); R(nx + 5, 101, 1, 1, '#F59BB2');
    EO(nx, 109, 13, 4, '#A9744F'); R(nx - 9, 108, 18, 1, '#8C5A3C'); R(nx - 6, 110, 12, 1, '#C08A5E');
  }
}

/* The decorations bought in the shop: the same in every room. */
function drawDecorBack() {
  const on = id => state.decorOn.includes(id);
  if (on('lights')) {
    const cols = ['#F4C95D', '#F59BB2', '#7EC8E3', '#88D498'];
    for (let x = 0; x < LW; x++) {
      const y = 3 + Math.round(5 * Math.sin(Math.PI * ((x / (LW / 2)) % 1)));
      R(x, y, 1, 1, INK);
      if (x % 10 === 5) {
        const k = Math.floor(x / 10);
        const lit = Math.floor(T * 2 + k) % 3 !== 0;
        R(x - 1, y + 1, 2, 3, lit ? cols[k % 4] : '#B9AFA5');
        if (lit) R(x - 1, y + 1, 1, 1, '#FFFFFF');
      }
    }
  }
  if (on('rug')) {
    const cx = Math.round(LW / 2);
    E(cx, FEET + 2, 27, 7, INK); E(cx, FEET + 2, 26, 6, '#F59BB2'); E(cx, FEET + 2, 21, 4, '#FADCE4'); E(cx, FEET + 2, 15, 2, '#F59BB2');
  }
  if (on('plant')) {
    const x = Math.round(LW / 2) - 27;
    R(x, GY - 2, 2, 13, '#58A85C');
    E(x - 4, GY + 3, 3, 2, '#78C87C'); E(x + 5, GY, 3, 2, '#78C87C'); E(x - 3, GY - 3, 2, 2, '#58A85C'); E(x + 4, GY - 5, 2, 2, '#78C87C');
    R(x - 5, GY + 10, 12, 2, '#B56B45'); R(x - 4, GY + 12, 10, 6, '#C9805A'); R(x - 3, GY + 12, 1, 6, '#DA9A76');
  }
  if (on('balloons')) {
    const x = Math.round(LW / 2) + 27;
    const b1 = Math.round(Math.sin(T * 1.3) * 2), b2 = Math.round(Math.sin(T * 1.3 + 1.5) * 2);
    R(x - 3, 50 + b1, 1, 50 - b1, '#8C737B'); R(x + 4, 54 + b2, 1, 46 - b2, '#8C737B');
    EO(x - 3, 43 + b1, 5, 6, '#F59BB2'); R(x - 6, 40 + b1, 2, 2, '#FFFFFF');
    EO(x + 5, 47 + b2, 5, 6, '#7EC8E3'); R(x + 2, 44 + b2, 2, 2, '#FFFFFF');
    R(x - 3, 99, 8, 3, '#A9744F');
  }
}

/* ---------- the pet ---------- */

const PAL = {
  panda: { body: '#FFFFFF', dark: '#3B2F2F', belly: '#FFFFFF', cheek: '#F9C5D1', eye: '#FFFFFF', limb: '#3B2F2F' },
  cat: { body: '#FFD9A0', dark: '#F29E4C', belly: '#FFF6E6', cheek: '#F9B4B4', eye: '#2B2125', limb: '#FFD9A0' },
  dog: { body: '#F4A261', dark: '#A85A1E', belly: '#FFE8D0', cheek: '#F28B82', eye: '#2B2125', limb: '#F4A261' },
  dino: { body: '#74C69D', dark: '#2D8A5F', belly: '#D8F3DC', cheek: '#F7A8B8', eye: '#2B2125', limb: '#74C69D' }
};

let anim = null; // { type, start, until, item }

function setAnim(type, dur, item) {
  anim = { type, start: T, until: T + dur, item };
}

/* How the pet holds itself and what its face does, from its mood and what it is doing. */
function poseOf(pet) {
  if (pet.sleeping) return { eyes: 'closed', mouth: 'flat', lying: true };
  const f = { eyes: 'open', mouth: 'flat', bob: Math.sin(T * 2.4) > 0.5 ? -1 : 0 };
  if (annoyed(pet)) { f.eyes = 'angry'; f.mouth = 'frown'; f.vein = true; }
  else if (pet.full < 25 || pet.happy < 25) { f.eyes = 'sad'; f.mouth = 'frown'; f.sweat = true; }
  else if (pet.energy < 20) { f.eyes = 'closed'; f.mouth = 'flat'; f.sweat = true; }
  else if (pet.happy >= 70) { f.mouth = 'smile'; f.wag = true; }
  if (f.eyes === 'open' && T % 3.7 < 0.13) f.eyes = 'closed';

  const a = anim && T < anim.until ? anim : null;
  if (a) {
    const p = (T - a.start) / (a.until - a.start);
    if (a.type === 'pat') { f.eyes = 'happy'; f.mouth = 'open'; f.jump = -Math.round(Math.abs(Math.sin(p * Math.PI * 2)) * 3); f.wag = true; }
    else if (a.type === 'cheer') { f.eyes = 'happy'; f.mouth = 'open'; f.armsUp = true; f.jump = -Math.round(Math.abs(Math.sin(p * Math.PI * 3)) * 4); f.wag = true; }
    else if (a.type === 'eat') { f.mouth = Math.floor(T * 8) % 2 ? 'open' : 'flat'; f.eating = a.item; f.eaten = p; if (f.eyes !== 'angry') f.eyes = 'happy'; }
    else if (a.type === 'rant') { f.eyes = 'angry'; f.mouth = 'open'; f.vein = true; f.shake = Math.round(Math.sin(T * 50) * 1.5); }
    else if (a.type === 'refuse') { f.eyes = f.eyes === 'angry' ? 'angry' : 'closed'; f.mouth = 'frown'; f.shake = Math.round(Math.sin(T * 30) * 2); }
  }
  return f;
}

function drawEye(c, ey, kind, col, brow, inward) {
  // c is the left pixel of a two-pixel-wide eye; `inward` is +1 for the left eye, -1 for the right.
  if (kind === 'closed') { R(c - 1, ey + 1, 4, 1, col); return; }
  if (kind === 'happy') { R(c - 1, ey + 1, 1, 1, col); R(c, ey, 2, 1, col); R(c + 2, ey + 1, 1, 1, col); return; }
  if (kind === 'dizzy') { R(c - 1, ey - 1, 1, 1, col); R(c + 2, ey - 1, 1, 1, col); R(c, ey, 2, 1, col); R(c - 1, ey + 1, 1, 1, col); R(c + 2, ey + 1, 1, 1, col); return; }
  R(c, ey - 1, 2, 3, col);
  if (col !== '#FFFFFF') R(c, ey - 1, 1, 1, '#FFFFFF');
  if (kind === 'angry' || kind === 'sad') {
    const tilt = kind === 'angry' ? inward : -inward;
    // The brow's low end is towards the nose when angry, away from it when sad.
    const lowX = tilt > 0 ? c + 1 : c - 1, highX = tilt > 0 ? c - 1 : c + 1;
    R(highX, ey - 4, 2, 1, brow);
    R(lowX, ey - 3, 2, 1, brow);
  }
}

function drawPet(bx, by, spId, pet, f) {
  const P = PAL[spId];
  const x = Math.round(bx) + (f.shake || 0);
  const g = Math.round(by) + (f.jump || 0);
  const lying = !!f.lying;
  const bob = f.bob || 0;
  const hy = g - (lying ? 18 : 27) + bob;           // centre of the head
  const cy = g - (lying ? 7 : 10);                  // centre of the body
  const brx = lying ? 14 : 11, bry = lying ? 7 : 10;
  const wag = f.wag ? Math.round(Math.sin(T * 14) * 2) : Math.round(Math.sin(T * 2.5));

  E(Math.round(bx), Math.round(by) + 1, 16, 3, 'rgba(92,75,81,0.18)');

  // tail
  if (spId === 'cat') {
    const pts = [[11, 3, 0], [14, 1, 0], [16, -2, 0], [17, -6, 1], [16, -10, 1]];
    for (const [dx, dy, s] of pts) E(x + dx + (s ? wag : 0), cy + dy, 3, 3, INK);
    for (const [dx, dy, s] of pts) E(x + dx + (s ? wag : 0), cy + dy, 2, 2, P.dark);
    E(x + 16 + wag, cy - 10, 2, 2, '#FFF6E6');
  } else if (spId === 'dog') {
    const pts = [[11, -1, 0], [13, -4, 1], [14, -8, 1]];
    for (const [dx, dy, s] of pts) E(x + dx + (s ? wag : 0), cy + dy, 3, 3, INK);
    for (const [dx, dy, s] of pts) E(x + dx + (s ? wag : 0), cy + dy, 2, 2, P.dark);
  } else if (spId === 'dino') {
    EO(x + 13, cy + 4, 7, 4, P.body); EO(x + 20, cy + 6 + Math.round(wag / 2), 4, 3, P.body); E(x + 15, cy + 5, 6, 3, P.body);
    tri(x + 13, cy - 4, 2, 3, '#F4C95D'); tri(x + 19, cy, 2, 3, '#F4C95D');
  } else {
    EO(x + 11, cy + 3, 3, 3, P.body);
  }

  // ears and crest that sit behind the head
  if (spId === 'panda') { EO(x - 10, hy - 10, 4, 4, P.dark); EO(x + 10, hy - 10, 4, 4, P.dark); }
  else if (spId === 'cat') {
    triO(x - 9, hy - 18, 5, 9, P.body); tri(x - 9, hy - 15, 2, 5, '#F9B4B4');
    triO(x + 9, hy - 18, 5, 9, P.body); tri(x + 9, hy - 15, 2, 5, '#F9B4B4');
  } else if (spId === 'dino') {
    triO(x - 7, hy - 16, 2, 5, '#F4C95D'); triO(x, hy - 19, 3, 7, '#F4C95D'); triO(x + 7, hy - 16, 2, 5, '#F4C95D');
  }

  // body
  EO(x, cy, brx, bry, P.body);
  if (spId !== 'panda') E(x, cy + 1, brx - 4, bry - 3, P.belly);
  EO(x - 6, g - 1, 4, 2, P.limb); EO(x + 6, g - 1, 4, 2, P.limb);
  if (!lying) {
    if (f.armsUp) { EO(x - brx, cy - 8, 3, 4, P.limb); EO(x + brx, cy - 8, 3, 4, P.limb); }
    else { EO(x - brx + 1, cy - 1, 3, 5, P.limb); EO(x + brx - 1, cy - 1, 3, 5, P.limb); }
  }

  // head
  EO(x, hy, 14, 12, P.body);
  if (spId === 'panda') { E(x - 6, hy - 1, 4, 5, P.dark); E(x + 6, hy - 1, 4, 5, P.dark); }
  else if (spId === 'cat') {
    E(x, hy + 5, 6, 4, P.belly);
    R(x - 1, hy - 12, 2, 4, P.dark); R(x - 5, hy - 11, 2, 3, P.dark); R(x + 3, hy - 11, 2, 3, P.dark);
  } else if (spId === 'dog') {
    E(x - 6, hy - 1, 4, 5, '#E0873F'); E(x, hy + 5, 7, 5, P.belly);
    EO(x - 14, hy + 1, 3, 7, P.dark); EO(x + 14, hy + 1, 3, 7, P.dark);
  } else {
    E(x, hy + 5, 9, 5, P.belly);
  }

  // face
  const ey = hy - 1;
  const eyes = f.eyes || 'open';
  const brow = spId === 'panda' ? '#FFFFFF' : '#2B2125';
  drawEye(x - 7, ey, eyes, P.eye, brow, 1);
  drawEye(x + 5, ey, eyes, P.eye, brow, -1);
  if (eyes !== 'angry') { R(x - 12, hy + 3, 3, 2, P.cheek); R(x + 9, hy + 3, 3, 2, P.cheek); }

  if (spId === 'panda') R(x - 1, hy + 2, 3, 2, P.dark);
  else if (spId === 'cat') {
    R(x - 1, hy + 2, 3, 1, '#E8788A'); R(x, hy + 3, 1, 1, '#E8788A');
    R(x - 19, hy + 2, 4, 1, INK); R(x - 19, hy + 5, 4, 1, INK); R(x + 16, hy + 2, 4, 1, INK); R(x + 16, hy + 5, 4, 1, INK);
  } else if (spId === 'dog') R(x - 2, hy + 1, 5, 2, '#2B2125');
  else { R(x - 3, hy + 2, 1, 1, P.dark); R(x + 2, hy + 2, 1, 1, P.dark); }

  const my = hy + 6;
  const mc = '#2B2125';
  if (f.mouth === 'smile') {
    R(x - 2, my, 1, 1, mc); R(x - 1, my + 1, 3, 1, mc); R(x + 2, my, 1, 1, mc);
    if (spId === 'dog') R(x, my + 2, 2, 2, '#F28B82');
    if (spId === 'dino') R(x + 3, my + 1, 1, 2, '#FFFFFF');
  } else if (f.mouth === 'open') {
    R(x - 2, my, 5, 3, '#7A3B46'); R(x - 1, my + 2, 3, 1, '#F28B82');
    if (spId === 'dino') { R(x - 2, my, 1, 1, '#FFFFFF'); R(x + 2, my, 1, 1, '#FFFFFF'); }
  } else if (f.mouth === 'frown') {
    R(x - 2, my + 1, 1, 1, mc); R(x - 1, my, 3, 1, mc); R(x + 2, my + 1, 1, 1, mc);
  } else {
    R(x - 1, my, 3, 1, mc);
  }

  // what it wears
  if (pet.gender === 'male') {
    const ny = hy + 12;
    R(x - 5, ny - 1, 4, 4, '#4EA8DE'); R(x + 2, ny - 1, 4, 4, '#4EA8DE'); R(x - 1, ny, 3, 2, '#90E0EF');
  }
  if (pet.hat) drawIcon(pet.hat, x - 8, hy - 25);
  if (pet.gender === 'female') {
    const bxx = x + 6, byy = hy - (pet.hat ? 11 : 14);
    R(bxx, byy, 3, 4, '#FF758F'); R(bxx + 5, byy, 3, 4, '#FF758F'); R(bxx + 3, byy + 1, 2, 2, '#FFB3C1');
  }

  if (f.vein) {
    const vx = x - 17, vy = hy - 15 - (Math.floor(T * 4) % 2);
    const c = '#E5534B';
    R(vx, vy + 1, 1, 1, c); R(vx + 1, vy, 1, 1, c); R(vx + 3, vy, 1, 1, c); R(vx + 4, vy + 1, 1, 1, c);
    R(vx, vy + 3, 1, 1, c); R(vx + 1, vy + 4, 1, 1, c); R(vx + 3, vy + 4, 1, 1, c); R(vx + 4, vy + 3, 1, 1, c);
  }
  if (f.sweat) { R(x + 13, hy - 8, 2, 3, '#7EC8E3'); R(x + 13, hy - 9, 1, 1, '#7EC8E3'); }

  if (f.eating) {
    const ix = x + 5, iy = g - 26;
    const cut = Math.floor(f.eaten * 16);
    ctx.save();
    ctx.beginPath();
    ctx.rect(ix, iy + cut, 16, 16 - cut);
    ctx.clip();
    drawIcon(f.eating, ix, iy);
    ctx.restore();
  }
}

/* ---------- one frame ---------- */

let lastFrame = performance.now();
let zTimer = 0;
let crumbTimer = 0;

function frame(now) {
  const dt = Math.min(0.05, (now - lastFrame) / 1000);
  lastFrame = now;
  T += dt;
  if (game) gameStep(dt);

  const sp = state.activeSpecies;
  const pet = cur();
  drawRoom(sp);
  drawDecorBack();

  if (game) {
    const g = game;
    for (const it of g.items) drawIcon(it.kind, it.x - 8, it.y);
    const moving = Math.abs(g.tx - g.x) > 1;
    drawPet(g.x, FEET, sp, pet, g.stun > 0
      ? { eyes: 'dizzy', mouth: 'frown', shake: Math.round(Math.sin(T * 40) * 2), vein: T < g.blameUntil }
      : T < g.blameUntil
      ? { eyes: 'angry', mouth: 'open', vein: true, shake: Math.round(Math.sin(T * 50) * 1.5) }
      : { eyes: 'open', mouth: 'open', armsUp: true, wag: true, bob: moving && Math.floor(T * 10) % 2 ? -1 : 0 });
  } else {
    const f = poseOf(pet);
    drawPet(LW / 2, FEET, sp, pet, f);
    if (pet.sleeping) {
      R(0, 0, LW, LH, 'rgba(40,35,80,0.38)');
      zTimer -= dt;
      if (zTimer <= 0) { zTimer = 0.9; spawnPart('z', LW / 2 + 14, FEET - 30); }
    }
    if (f.eating) {
      crumbTimer -= dt;
      if (crumbTimer <= 0) { crumbTimer = 0.18; spawnPart('crumb', LW / 2 + 6, FEET - 16); }
    }
  }
  drawParts(dt);
  requestAnimationFrame(frame);
}

/* ---------- wiring ---------- */

function gamePointer(e) {
  if (!game) return;
  const r = canvas.getBoundingClientRect();
  game.tx = clamp(((e.clientX - r.left) / r.width) * LW, 14, LW - 14);
  e.preventDefault();
}

canvas.addEventListener('pointerdown', gamePointer);
canvas.addEventListener('pointermove', gamePointer);
canvas.addEventListener('click', () => { if (!game) Pet.pat(); });
window.addEventListener('keydown', e => {
  if (!game) return;
  if (e.key === 'ArrowLeft') game.tx = clamp(game.tx - 24, 14, LW - 14);
  if (e.key === 'ArrowRight') game.tx = clamp(game.tx + 24, 14, LW - 14);
});

$('btn-lang').onclick = () => App.toggleLang();
$('btn-shop').onclick = () => App.togglePanel('shop-panel');
$('btn-shop-close').onclick = () => App.togglePanel('shop-panel');
$('btn-save-panel').onclick = () => App.togglePanel('save-panel');
$('btn-save-close').onclick = () => App.togglePanel('save-panel');
$('btn-export-save').onclick = () => App.exportSave();
$('btn-import-save').onclick = () => App.importSave();
$('btn-gender-female').onclick = () => App.setGender('female');
$('btn-gender-male').onclick = () => App.setGender('male');
$('btn-pat').onclick = () => Pet.pat();
$('btn-play').onclick = () => Pet.play();
$('btn-sleep').onclick = () => Pet.sleep();
$('btn-quit').onclick = () => endGame();
$('btn-gift').onclick = () => claimGift();
$('pet-name-input').onchange = e => Pet.rename(e.target.value);

/* Says hello after time away: an insult if the pet was left hungry. */
function welcomeBack(gone) {
  const pet = cur();
  if (pet.sleeping || gone < 300) return;
  if (annoyed(pet)) insult();
  else if (gone >= 3600) say(line('greetLong', { t: awayText(gone) }));
  else say(line('greet'));
}

let saveCountdown = 5;

function everySecond() {
  if (document.hidden) return;
  const gone = advance(Date.now());
  if (state.daily.date !== today()) UI.render();
  else UI.stats();
  if (gone >= 300) welcomeBack(gone);

  const pet = cur();
  const now = performance.now();
  if (!game && !pet.sleeping && now > bubbleUntil && now > nextMutterAt) {
    if (annoyed(pet)) insult();
    else if (pet.full < 25) { say(line('hungry')); nextMutterAt = now + 20000 + Math.random() * 10000; }
  }
  if (--saveCountdown <= 0) { saveCountdown = 5; saveState(); }
}

document.addEventListener('visibilitychange', () => {
  if (document.hidden) saveState();
  else everySecond();
});
window.addEventListener('pagehide', saveState);

if (window.ResizeObserver) new ResizeObserver(fit).observe(canvas);
window.addEventListener('resize', fit);

/* ---------- noticing a new version ----------
   A page left open, or an app kept on the home screen, goes on running the
   code it started with. So the page remembers what its own files looked like
   when it loaded, asks the server now and then whether they have changed, and
   loads itself again when they have. The game is saved first and nothing is
   lost; a round of catch is never interrupted. */

const OWN_FILES = [location.pathname, './style.css', './game.js'];
let ownBuild = null;

async function buildOf(cache) {
  const texts = await Promise.all(OWN_FILES.map(async url => {
    const res = await fetch(url, cache ? { cache } : undefined);
    if (!res.ok) throw new Error(String(res.status));
    return res.text();
  }));
  let h = 0x811c9dc5; // FNV-1a over all three files
  for (const ch of texts.join('\n')) h = Math.imul(h ^ ch.codePointAt(0), 0x01000193) >>> 0;
  return h.toString(16).padStart(8, '0');
}

async function checkForUpdate() {
  if (ownBuild === null || game || document.hidden) return;
  let latest;
  try { latest = await buildOf('no-cache'); } catch { return; } // offline: ask again later
  if (latest === ownBuild || game) return;
  // Once per new version: if loading again did not bring it, do not go round in circles.
  try {
    if (sessionStorage.getItem('reloadedFor') === latest) return;
    sessionStorage.setItem('reloadedFor', latest);
  } catch {}
  saveState();
  showToast(tr('有新版本，正在更新…', 'New version, updating…'));
  setTimeout(() => location.reload(), 900);
}

buildOf().then(b => {
  ownBuild = b;
  $('build-label').textContent = `build ${b}`;
  checkForUpdate();
}).catch(() => {});
setInterval(checkForUpdate, 5 * 60 * 1000);
document.addEventListener('visibilitychange', () => { if (!document.hidden) checkForUpdate(); });

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js').catch(() => {});
  });
}

const goneAtStart = advance(Date.now());
nextMutterAt = performance.now() + 4000;
UI.render();
fit();
saveState();
requestAnimationFrame(frame);
setTimeout(() => welcomeBack(goneAtStart), 600);
setInterval(everySecond, 1000);
