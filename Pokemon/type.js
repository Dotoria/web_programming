// 18개 포켓몬 타입 메타데이터 + 채점 로직
// weakTo: 나를 흔드는 상대 / resists: 나에게 잘 안 통하는 상대 / strongAgainst: 내가 주도권을 쥐는 상대
// (근거: 문항설계.md. 상성은 6세대 이후 기준)

var TYPE_INFO = {
    normal:   { name: '노말',   color: '#A8A878', icon: '⚪',
                surface: '무난함, 균형',
                inner: '어디에도 안 치우치는 균형감각. "특별함이 없다"는 콤플렉스를 유연함으로 승화한다.',
                weakTo: ['fighting'], resists: ['ghost'], strongAgainst: [],
                note: '고스트에게는 신비주의·눈치싸움이 아예 안 통한다.' },
    fire:     { name: '불꽃',   color: '#F08030', icon: '🔥',
                surface: '열정, 다혈질',
                inner: '사그라들까 봐 두려워서 끊임없이 무언가에 몰입해야 존재감을 느낀다. 겉으로 잠잠해 보여도 속에서는 화가 좀처럼 쉽게 식지 않아서, 어느 순간 억눌러온 열기가 한 번에 터져 나오기도 한다.',
                weakTo: ['water', 'ground'], resists: ['fire', 'bug'], strongAgainst: ['grass', 'steel'],
                note: '특성 "맹화"처럼 궁지에 몰릴수록 불꽃은 오히려 더 거세진다.' },
    water:    { name: '물',     color: '#6890F0', icon: '💧',
                surface: '유연함, 포용력',
                inner: '강물처럼 흐르며 끌어안고, 바다처럼 넓게 품는 사람. 겉으로는 다 받아주는 것 같지만 사실 감정을 눌러 담다가 한번에 터진다. 감정을 다스리는 것 자체가 자아정체성이다.',
                weakTo: ['electric', 'grass'], resists: ['water', 'fire', 'steel'], strongAgainst: ['fire', 'ground'],
                note: '특성 "급류"처럼 여유가 사라지는 순간, 잔잔하던 물살이 가장 거세진다.' },
    grass:    { name: '풀',     color: '#78C850', icon: '🌿',
                surface: '평화, 느긋함',
                inner: '변화가 두려운 게 아니라 자기 속도를 지키고 싶은 것. 재촉하면 오히려 안 자란다.',
                weakTo: ['fire', 'ice', 'poison', 'flying'], resists: ['water', 'ground'], strongAgainst: ['water', 'rock'],
                note: '약점이 가장 많은 타입 중 하나라, 평화로워 보여도 섬세한 밸런스 위에 서 있다.' },
    electric: { name: '전기',   color: '#F8D030', icon: '⚡',
                surface: '발랄, 즉흥',
                inner: '멈춰있는 걸 못 견뎌서 계속 움직여야 안심되는 마음. 조용해지면 오히려 불안하다.',
                weakTo: ['ground'], resists: ['flying', 'steel'], strongAgainst: ['water', 'flying'],
                note: '땅에게는 거의 무효급으로 안 통한다 — 지극히 현실적인 사람 앞에서는 힘을 못 쓴다.' },
    ice:      { name: '얼음',   color: '#98D8D8', icon: '❄️',
                surface: '차가움, 거리감',
                inner: '쉽게 상처받아서 미리 방어막을 친다. 처음부터 곁을 안 주는 건 자기 보호다.',
                weakTo: ['fire', 'fighting', 'steel'], resists: ['ice'], strongAgainst: ['grass', 'flying', 'dragon'] },
    fighting: { name: '격투',   color: '#C03028', icon: '👊',
                surface: '우직함, 근성',
                inner: '말보다 행동으로 증명해야 인정받는다고 믿어서 쉬지 않고 노력한다.',
                weakTo: ['flying', 'psychic', 'fairy'], resists: ['bug', 'rock', 'dark'], strongAgainst: ['normal', 'ice', 'steel', 'dark'],
                note: '고스트에게는 아예 안 통한다 — 실체 없는 감정싸움엔 대응법을 모른다.' },
    poison:   { name: '독',     color: '#A040A0', icon: '☠️',
                surface: '예민함, 톡 쏘는 한마디',
                inner: '감각이 예민해서 거슬리는 것을 남들보다 먼저 알아챈다. 톡 쏘는 말로 상대를 찌를 때도 있지만, 사실은 먼저 다치기 싫어서 무기부터 숨겨두는 것이다.',
                weakTo: ['ground', 'psychic'], resists: ['grass', 'fighting', 'poison', 'fairy'], strongAgainst: ['grass', 'fairy'] },
    ground:   { name: '땅',     color: '#E0C068', icon: '⛰️',
                surface: '든든함, 현실감각',
                inner: '단단하기보다 든든한 사람. 화려하지 않아도 부드럽게, 그러나 크게 주변을 움직인다. 발 딛을 곳이 있어야 안심하고, 불확실한 것 자체가 스트레스다.',
                weakTo: ['water', 'grass', 'ice'], resists: ['poison', 'rock'], strongAgainst: ['fire', 'electric', 'poison', 'rock', 'steel'],
                note: '전기에게는 거의 무효급으로 안 통한다 — 일시적인 자극이나 유행엔 전혀 안 흔들린다.' },
    flying:   { name: '비행',   color: '#A890F0', icon: '🕊️',
                surface: '자유로움',
                inner: '정착하면 실망할까봐 미리 도망치는 회피성향일 수 있다. 다만 자유 속에서도 자기만의 신뢰는 지킨다.',
                weakTo: ['electric', 'ice', 'rock'], resists: ['grass', 'fighting', 'bug'], strongAgainst: ['grass', 'fighting', 'bug'],
                note: '땅에게는 낭만이 아예 안 통한다 — 지극히 현실적인 사람 앞에서는 힘을 못 쓴다.' },
    psychic:  { name: '에스퍼', color: '#F85888', icon: '🔮',
                surface: '직관, 사색',
                inner: '논리로 설명 못하는 걸 믿는 대신, 정작 자기 감정은 스스로도 잘 모를 때가 많다.',
                weakTo: ['bug', 'ghost', 'dark'], resists: ['fighting'], strongAgainst: ['fighting', 'poison'] },
    bug:      { name: '벌레',   color: '#A8B820', icon: '🐛',
                surface: '성실, 디테일',
                inner: '완벽하지 않으면 불안한 마음, 그래서 남들이 안 보는 것까지 챙긴다.',
                weakTo: ['fire', 'flying', 'rock'], resists: ['grass', 'fighting', 'ground'], strongAgainst: ['grass', 'psychic', 'dark'] },
    rock:     { name: '바위',   color: '#B8A038', icon: '🪨',
                surface: '단단함, 뚝심',
                inner: '단단하지만 한번 금이 가면 크게 부서지는 사람. 날카롭게 핵심을 찌르다가도 둥글게 구를 줄 안다. 바꾸지 않는 건 두려움이 아니라 지켜온 것에 대한 자부심 때문이다.',
                weakTo: ['water', 'grass', 'fighting', 'ground', 'steel'], resists: ['normal', 'fire', 'poison', 'flying'], strongAgainst: ['fire', 'ice', 'flying', 'bug'],
                note: '특성 "옹골참"처럼 어떤 충격도 한 번에 쓰러뜨리진 못한다. 다만 금이 가는 것까진 막을 수 없는, 겉바속여린 타입이다.' },
    ghost:    { name: '고스트', color: '#705898', icon: '👻',
                surface: '은둔, 장난기',
                inner: '상처를 유머로 포장하는 습관. 진지하게 다가오면 오히려 피한다.',
                weakTo: ['ghost', 'dark'], resists: ['poison', 'bug'], strongAgainst: ['psychic', 'ghost'],
                note: '노말·격투에게는 신비주의가 아예 안 통한다 — 너무 평범하고 직진하는 사람에게는 안 먹힌다.' },
    dragon:   { name: '드래곤', color: '#7038F8', icon: '🐉',
                surface: '강함, 자부심',
                inner: '강해야만 사랑받는다고 믿어서 약한 모습을 숨기지만, 사실 다정함을 들키고 싶어한다.',
                weakTo: ['ice', 'dragon'], resists: ['fire', 'water', 'electric', 'grass'], strongAgainst: ['dragon'],
                note: '페어리에게는 순수한 애정 앞에서 완전히 무장해제된다.' },
    dark:     { name: '악',     color: '#705848', icon: '🌑',
                surface: '날렵함, 자기기준',
                inner: '환한 곳보다 어둠이 편하고, 정면 승부보다 허를 찌르는 데 능하다. 비열하다는 오해도 받지만, 사실은 상처받지 않으려고 미리 기대를 접어둔 것뿐이다. "신경 안 쓴다"는 말은 신경을 너무 많이 써서 지쳤다는 뜻이기도 하다.',
                weakTo: ['fighting', 'bug', 'fairy'], resists: ['ghost', 'dark'], strongAgainst: ['psychic', 'ghost'],
                note: '에스퍼에게는 마음을 읽으려 해도 안 읽힌다.' },
    steel:    { name: '강철',   color: '#B8B8D0', icon: '⚙️',
                surface: '단단함, 원칙',
                inner: '여러 번 깎이고 담금질(제련)되며 만들어진 단단함이다. 웬만한 흔들림엔 끄떡없지만 진짜 약점은 아주 좁고 근본적인 곳에 있다.',
                weakTo: ['fire', 'fighting', 'ground'], resists: ['normal', 'grass', 'ice', 'flying', 'psychic', 'bug', 'rock', 'dragon', 'steel', 'fairy'], strongAgainst: ['ice', 'rock', 'fairy'],
                note: '독에게는 교묘한 이간질·유혹이 절대 안 통한다.' },
    fairy:    { name: '페어리', color: '#EE99AC', icon: '💖',
                surface: '사랑스러움',
                inner: '사람을 챙기는 게 자기 존재 이유라고 느껴서, 정작 자기 자신을 챙기는 데는 서투르다.',
                weakTo: ['poison', 'steel'], resists: ['fighting', 'bug', 'dark'], strongAgainst: ['fighting', 'dragon', 'dark'],
                note: '드래곤에게는 다정함이 아예 안 통한다 — 지나치게 강하고 자존심 센 상대에겐 안 먹힌다.' }
};

var TYPE_ORDER = ['normal', 'fire', 'water', 'grass', 'electric', 'ice', 'fighting', 'poison',
    'ground', 'flying', 'psychic', 'bug', 'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy'];

// 문항 설계상 모든 타입은 정확히 7개 문항(단일 5 + 복합 2)에서 점수를 받는다
var QUESTIONS_PER_TYPE = 7;

// ---------- 결과와 타입이 "완벽하게" 일치하는 포켓몬 ----------

// 단일 타입 결과용 (순수 단일 타입 포켓몬)
var PURE_POKEMON = {
    normal: '잠만보', fire: '부스터', water: '거북왕', grass: '메가니움',
    electric: '피카츄', ice: '글레이시아', fighting: '괴력몬', poison: '질뻐기',
    ground: '닥트리오', flying: '토네로스', psychic: '뮤츠', bug: '쁘사이저',
    rock: '레지락', ghost: '무우마직', dragon: '미끄래곤', dark: '블래키',
    steel: '레지스틸', fairy: '님피아'
};

// 복합 타입 결과용. 키는 TYPE_ORDER 순서로 정렬한 "타입1|타입2".
// 실제로 그 타입 조합을 가진 포켓몬만 수록 (지역 폼 제외). 없는 조합은 미수록.
var COMBO_POKEMON = {
    'normal|fire': '화염레오',   'normal|water': '비버통',    'normal|grass': '바라철록',
    'normal|electric': '일레도리자드', 'normal|fighting': '이븐곰', 'normal|ground': '파르토',
    'normal|flying': '찌르호크', 'normal|psychic': '키링키',  'normal|dragon': '노공룡',
    'normal|dark': '가로막구리', 'normal|fairy': '푸크린',
    'fire|water': '볼케니온',    'fire|grass': '스코빌런',    'fire|fighting': '번치코',
    'fire|poison': '염뉴트',     'fire|ground': '폭타',       'fire|flying': '리자몽',
    'fire|psychic': '마폭시',    'fire|bug': '불카모스',      'fire|rock': '마그카르고',
    'fire|ghost': '샹델라',      'fire|dragon': '레시라무',   'fire|dark': '헬가',
    'fire|steel': '히드런',
    'water|grass': '로파파',     'water|electric': '란턴',    'water|ice': '라프라스',
    'water|fighting': '강챙이',  'water|poison': '독파리',    'water|ground': '대짱이',
    'water|flying': '갸라도스',  'water|psychic': '야도란',   'water|bug': '갑주무사',
    'water|rock': '암스타',      'water|ghost': '탱탱겔',     'water|dragon': '킹드라',
    'water|dark': '샤크니아',    'water|steel': '엠페르트',   'water|fairy': '마릴리',
    'grass|ice': '눈설왕',       'grass|fighting': '브리가론', 'grass|poison': '이상해꽃',
    'grass|ground': '토대부기',  'grass|flying': '트로피우스', 'grass|psychic': '나시',
    'grass|bug': '파라섹트',     'grass|rock': '릴리요',      'grass|ghost': '대로트',
    'grass|dragon': '애프룡',    'grass|dark': '밤선인',      'grass|steel': '너트령',
    'grass|fairy': '엘풍',
    'electric|fighting': '무쇠손', 'electric|poison': '스트린더', 'electric|ground': '메더',
    'electric|flying': '썬더',   'electric|bug': '전툴라',    'electric|ghost': '로토무',
    'electric|dragon': '제크로무', 'electric|dark': '모르페코', 'electric|steel': '자포코일',
    'electric|fairy': '데데엔네',
    'ice|fighting': '모단단게',  'ice|ground': '맘모꾸리',    'ice|flying': '프리져',
    'ice|psychic': '루주라',     'ice|bug': '모스노우',       'ice|rock': '아마루르가',
    'ice|ghost': '눈여아',       'ice|dragon': '큐레무',      'ice|dark': '포푸니라',
    'fighting|poison': '독개굴', 'fighting|ground': '위대한엄니', 'fighting|flying': '루차불',
    'fighting|psychic': '메디참', 'fighting|bug': '헤라크로스', 'fighting|rock': '테라키온',
    'fighting|ghost': '마샤도',  'fighting|dragon': '짜랑고우거', 'fighting|dark': '곤율거니',
    'fighting|steel': '루카리오', 'fighting|fairy': '무쇠무인',
    'poison|ground': '니드킹',   'poison|flying': '크로뱃',   'poison|bug': '독침붕',
    'poison|rock': '킬라플로르', 'poison|ghost': '팬텀',      'poison|dragon': '무한다이노',
    'poison|dark': '스컹탱크',
    'ground|flying': '글라이온', 'ground|psychic': '점토도리', 'ground|bug': '토중몬',
    'ground|rock': '코뿌리',     'ground|ghost': '골루그',    'ground|dragon': '한카리아스',
    'ground|dark': '악비아르',   'ground|steel': '강철톤',
    'flying|psychic': '네이티오', 'flying|bug': '버터플',     'flying|rock': '프테라',
    'flying|ghost': '둥실라이드', 'flying|dragon': '망나뇽',  'flying|dark': '돈크로우',
    'flying|steel': '아머까오',  'flying|fairy': '토게키스',
    'psychic|bug': '이올브',     'psychic|rock': '루나톤',    'psychic|ghost': '루나아라',
    'psychic|dragon': '라티오스', 'psychic|dark': '칼라마네로', 'psychic|steel': '메타그로스',
    'psychic|fairy': '가디안',
    'bug|rock': '단단지',        'bug|ghost': '껍질몬',       'bug|dark': '엑스레그',
    'bug|steel': '핫삼',         'bug|fairy': '에리본',
    'rock|dragon': '견고라스',   'rock|dark': '마기라스',     'rock|steel': '보스로라',
    'rock|fairy': '디안시',
    'ghost|dragon': '기라티나',  'ghost|dark': '미카루게',    'ghost|steel': '킬가르도',
    'ghost|fairy': '미미키유',
    'dragon|dark': '삼삼드래',   'dragon|steel': '디아루가',
    'dark|steel': '절각참',      'dark|fairy': '오롱털',
    'steel|fairy': '클레피'
};

// 결과 타입(1개 또는 2개)과 타입이 완벽하게 일치하는 포켓몬 이름. 없으면 null.
function getExactPokemon(types) {
    if (types.length === 1) {
        return PURE_POKEMON[types[0]] || null;
    }
    var a = TYPE_ORDER.indexOf(types[0]);
    var b = TYPE_ORDER.indexOf(types[1]);
    var key = (a <= b) ? types[0] + '|' + types[1] : types[1] + '|' + types[0];
    return COMBO_POKEMON[key] || null;
}

// ---------- 타입 상성 ----------

// 정식 타입 상성표 (6세대 이후 기준). 공격 타입 -> { 방어 타입: 배율 }, 없는 조합은 1배.
var TYPE_CHART = {
    normal:   { rock: 0.5, ghost: 0, steel: 0.5 },
    fire:     { fire: 0.5, water: 0.5, grass: 2, ice: 2, bug: 2, rock: 0.5, dragon: 0.5, steel: 2 },
    water:    { fire: 2, water: 0.5, grass: 0.5, ground: 2, rock: 2, dragon: 0.5 },
    grass:    { fire: 0.5, water: 2, grass: 0.5, poison: 0.5, ground: 2, flying: 0.5, bug: 0.5, rock: 2, dragon: 0.5, steel: 0.5 },
    electric: { water: 2, electric: 0.5, grass: 0.5, ground: 0, flying: 2, dragon: 0.5 },
    ice:      { fire: 0.5, water: 0.5, grass: 2, ice: 0.5, ground: 2, flying: 2, dragon: 2, steel: 0.5 },
    fighting: { normal: 2, ice: 2, poison: 0.5, flying: 0.5, psychic: 0.5, bug: 0.5, rock: 2, ghost: 0, dark: 2, steel: 2, fairy: 0.5 },
    poison:   { grass: 2, poison: 0.5, ground: 0.5, rock: 0.5, ghost: 0.5, steel: 0, fairy: 2 },
    ground:   { fire: 2, electric: 2, grass: 0.5, poison: 2, flying: 0, bug: 0.5, rock: 2, steel: 2 },
    flying:   { electric: 0.5, grass: 2, fighting: 2, bug: 2, rock: 0.5, steel: 0.5 },
    psychic:  { fighting: 2, poison: 2, psychic: 0.5, dark: 0, steel: 0.5 },
    bug:      { fire: 0.5, grass: 2, fighting: 0.5, poison: 0.5, flying: 0.5, psychic: 2, ghost: 0.5, dark: 2, steel: 0.5, fairy: 0.5 },
    rock:     { fire: 2, ice: 2, fighting: 0.5, ground: 0.5, flying: 2, bug: 2, steel: 0.5 },
    ghost:    { normal: 0, psychic: 2, ghost: 2, dark: 0.5 },
    dragon:   { dragon: 2, steel: 0.5, fairy: 0 },
    dark:     { fighting: 0.5, psychic: 2, ghost: 2, dark: 0.5, fairy: 0.5 },
    steel:    { fire: 0.5, water: 0.5, electric: 0.5, ice: 2, rock: 2, steel: 0.5, fairy: 2 },
    fairy:    { fire: 0.5, fighting: 2, poison: 0.5, dragon: 2, dark: 2, steel: 0.5 }
};

// 공격 타입 attackType이 내 타입 조합 defTypes를 공격할 때의 최종 배율
function defenseMultiplier(attackType, defTypes) {
    var row = TYPE_CHART[attackType] || {};
    var m = 1;
    for (var i = 0; i < defTypes.length; i++) {
        var v = row[defTypes[i]];
        m *= (v === undefined ? 1 : v);
    }
    return m;
}

// 내 타입 조합 기준으로 18개 공격 타입을 배율별로 그룹화 (1배는 제외)
function computeMatchups(myTypes) {
    var groups = { x4: [], x2: [], x05: [], x025: [], x0: [] };
    for (var i = 0; i < TYPE_ORDER.length; i++) {
        var atk = TYPE_ORDER[i];
        var m = defenseMultiplier(atk, myTypes);
        if (m === 4) groups.x4.push(atk);
        else if (m === 2) groups.x2.push(atk);
        else if (m === 0.5) groups.x05.push(atk);
        else if (m === 0.25) groups.x025.push(atk);
        else if (m === 0) groups.x0.push(atk);
    }
    return groups;
}

// 두 타입 조합 A가 B를 공격할 때 가장 잘 통하는 배율 (그룹 상성용)
function bestAttackMultiplier(atkTypes, defTypes) {
    var best = 0;
    for (var i = 0; i < atkTypes.length; i++) {
        var m = defenseMultiplier(atkTypes[i], defTypes);
        if (m > best) best = m;
    }
    return best;
}

// ---------- 채점 ----------

// "fire5" -> { type: 'fire', score: 5 }
function parseAnswerToken(token) {
    var m = token.match(/^([a-z]+)(\d)$/);
    if (!m) return null;
    return { type: m[1], score: parseInt(m[2], 10) };
}

// answers: { "0": "fire5", "1": "water4|ice4", ... } -> { totals, counts, averages }
function computeTypeScores(answers) {
    var totals = {}, counts = {};
    for (var i = 0; i < TYPE_ORDER.length; i++) {
        totals[TYPE_ORDER[i]] = 0;
        counts[TYPE_ORDER[i]] = 0;
    }

    for (var key in answers) {
        if (!answers.hasOwnProperty(key)) continue;
        var tokens = answers[key].split('|');
        for (var t = 0; t < tokens.length; t++) {
            var parsed = parseAnswerToken(tokens[t]);
            if (!parsed || !TYPE_INFO[parsed.type]) continue;
            totals[parsed.type] += parsed.score;
            counts[parsed.type] += 1;
        }
    }

    var averages = {};
    for (var j = 0; j < TYPE_ORDER.length; j++) {
        var type = TYPE_ORDER[j];
        averages[type] = counts[type] > 0 ? totals[type] / counts[type] : 0;
    }

    return { totals: totals, counts: counts, averages: averages };
}

// averages 기준 상위 n개 타입 키를 반환 (동점이면 TYPE_ORDER 순서 유지)
function getTopTypes(averages, n) {
    var keys = TYPE_ORDER.slice();
    keys.sort(function (a, b) { return averages[b] - averages[a]; });
    return keys.slice(0, n);
}

// ---------- 결과 판정 ----------

// 1위가 2위보다 이만큼(평균 점수, 1~5 척도) 앞서면 단일 타입으로 판정
var SINGLE_TYPE_GAP = 0.75;
// 전체 타입의 최고-최저 평균 차이가 이 이하면 "완전한 균형" = 노말 단일로 판정
var FLAT_SPREAD = 0.35;

// averages -> { mode: 'flat'|'single'|'dual', types: [1~2개] }
// flat: 모든 타입이 고른 프로필(모두 가운데로 답한 경우 포함) -> 노말 단일
function decideResult(averages) {
    var sorted = getTopTypes(averages, 18);
    var max = averages[sorted[0]];
    var min = averages[sorted[17]];

    if (max - min <= FLAT_SPREAD) {
        return { mode: 'flat', types: ['normal'] };
    }
    if (averages[sorted[0]] - averages[sorted[1]] >= SINGLE_TYPE_GAP) {
        return { mode: 'single', types: [sorted[0]] };
    }
    return { mode: 'dual', types: [sorted[0], sorted[1]] };
}

// ---------- 결과 공유용 인코딩 ----------

// totals -> "21-28-14-..." (TYPE_ORDER 순서, 타입당 7문항이므로 각 값은 7~35)
function encodeShareCode(totals) {
    var parts = [];
    for (var i = 0; i < TYPE_ORDER.length; i++) {
        parts.push(totals[TYPE_ORDER[i]]);
    }
    return parts.join('-');
}

// "21-28-..." 또는 공유 URL 전체 -> { totals, averages } (형식이 잘못되면 null)
function decodeShareCode(code) {
    if (!code) return null;
    var s = String(code).trim();
    // URL이 통째로 들어오면 s 파라미터만 추출
    var m = s.match(/[?&]s=([0-9-]+)/);
    if (m) s = m[1];

    var parts = s.split('-');
    if (parts.length !== TYPE_ORDER.length) return null;

    var totals = {}, averages = {};
    for (var i = 0; i < TYPE_ORDER.length; i++) {
        var v = parseInt(parts[i], 10);
        if (isNaN(v) || v < 0 || v > 5 * QUESTIONS_PER_TYPE) return null;
        totals[TYPE_ORDER[i]] = v;
        averages[TYPE_ORDER[i]] = v / QUESTIONS_PER_TYPE;
    }
    return { totals: totals, averages: averages };
}
