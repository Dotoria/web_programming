// 18개 포켓몬 타입 메타데이터 + 채점 로직
// weakTo: 나를 흔드는 상대 / resists: 나에게 잘 안 통하는 상대 / strongAgainst: 내가 주도권을 쥐는 상대
// (근거: 문항설계.md의 대표 포켓몬·궁합 표. 상성은 6세대 이후 기준)

var TYPE_INFO = {
    normal:   { name: '노말',   pokemon: '이브이 · 잠만보 · 캥카',
                surface: '무난함, 평범함',
                inner: '어디에도 안 치우치는 균형감각. "특별함이 없다"는 콤플렉스를 유연함으로 승화한다.',
                weakTo: ['fighting'], resists: ['ghost'], strongAgainst: [],
                note: '고스트에게는 신비주의·눈치싸움이 아예 안 통한다.' },
    fire:     { name: '불꽃',   pokemon: '리자몽 · 블레이범 · 마그마번',
                surface: '열정, 다혈질',
                inner: '사그라들까 봐 두려워서 끊임없이 무언가에 몰입해야 존재감을 느낀다.',
                weakTo: ['water', 'ground'], resists: ['fire', 'bug'], strongAgainst: ['grass', 'steel'] },
    water:    { name: '물',     pokemon: '갸라도스 · 거북왕 · 라프라스',
                surface: '유연함, 온화함',
                inner: '겉으로는 다 받아주는 것 같지만 사실 감정을 억누르다가 한번에 터진다. 감정 통제 자체가 자아정체성이다.',
                weakTo: ['electric', 'grass'], resists: ['water', 'fire', 'steel'], strongAgainst: ['fire', 'ground'] },
    grass:    { name: '풀',     pokemon: '이상해꽃 · 리피아 · 나시',
                surface: '평화, 느긋함',
                inner: '변화가 두려운 게 아니라 자기 속도를 지키고 싶은 것. 재촉하면 오히려 안 자란다.',
                weakTo: ['fire', 'ice', 'poison', 'flying'], resists: ['water', 'ground'], strongAgainst: ['water', 'rock'],
                note: '약점이 가장 많은 타입 중 하나라, 평화로워 보여도 섬세한 밸런스 위에 서 있다.' },
    electric: { name: '전기',   pokemon: '피카츄 · 썬더 · 자포코일',
                surface: '발랄, 즉흥',
                inner: '멈춰있는 걸 못 견뎌서 계속 움직여야 안심되는 마음. 조용해지면 오히려 불안하다.',
                weakTo: ['ground'], resists: ['flying', 'steel'], strongAgainst: ['water', 'flying'],
                note: '땅에게는 거의 무효급으로 안 통한다 — 지극히 현실적인 사람 앞에서는 힘을 못 쓴다.' },
    ice:      { name: '얼음',   pokemon: '글레이시아 · 프리져 · 눈여아',
                surface: '차가움, 거리감',
                inner: '쉽게 상처받아서 미리 방어막을 친다. 처음부터 곁을 안 주는 건 자기 보호다.',
                weakTo: ['fire', 'fighting', 'steel'], resists: ['ice'], strongAgainst: ['grass', 'flying', 'dragon'] },
    fighting: { name: '격투',   pokemon: '괴력몬 · 루카리오 · 노보청',
                surface: '우직함, 근성',
                inner: '말보다 행동으로 증명해야 인정받는다고 믿어서 쉬지 않고 노력한다.',
                weakTo: ['flying', 'psychic', 'fairy'], resists: ['bug', 'rock', 'dark'], strongAgainst: ['normal', 'ice', 'steel', 'dark'],
                note: '고스트에게는 아예 안 통한다 — 실체 없는 감정싸움엔 대응법을 모른다.' },
    poison:   { name: '독',     pokemon: '니드킹 · 질뻐기 · 크로뱃',
                surface: '경계심, 뒤끝',
                inner: '먼저 다치기 싫어서 무기부터 숨겨두는 방어기제. 사실은 겁이 많다.',
                weakTo: ['ground', 'psychic'], resists: ['grass', 'fighting', 'poison', 'fairy'], strongAgainst: ['grass', 'fairy'] },
    ground:   { name: '땅',     pokemon: '텅구리 · 닥트리오 · 코뿌리',
                surface: '현실적, 안정',
                inner: '발 딛을 곳이 있어야 안심하는 성격. 불확실한 것 자체가 스트레스다.',
                weakTo: ['water', 'grass', 'ice'], resists: ['poison', 'rock'], strongAgainst: ['fire', 'electric', 'poison', 'rock', 'steel'],
                note: '전기에게는 거의 무효급으로 안 통한다 — 일시적인 자극이나 유행엔 전혀 안 흔들린다.' },
    flying:   { name: '비행',   pokemon: '토네로스 · 음번 · 아머까오',
                surface: '자유로움',
                inner: '정착하면 실망할까봐 미리 도망치는 회피성향일 수 있다. 다만 자유 속에서도 자기만의 신뢰는 지킨다.',
                weakTo: ['electric', 'ice', 'rock'], resists: ['grass', 'fighting', 'bug'], strongAgainst: ['grass', 'fighting', 'bug'],
                note: '땅에게는 낭만이 아예 안 통한다 — 지극히 현실적인 사람 앞에서는 힘을 못 쓴다.' },
    psychic:  { name: '에스퍼', pokemon: '후딘 · 뮤츠 · 가디안',
                surface: '직관, 사색',
                inner: '논리로 설명 못하는 걸 믿는 대신, 정작 자기 감정은 스스로도 잘 모를 때가 많다.',
                weakTo: ['bug', 'ghost', 'dark'], resists: ['fighting'], strongAgainst: ['fighting', 'poison'] },
    bug:      { name: '벌레',   pokemon: '핫삼 · 헤라크로스 · 버터플',
                surface: '성실, 디테일',
                inner: '완벽하지 않으면 불안한 마음, 그래서 남들이 안 보는 것까지 챙긴다.',
                weakTo: ['fire', 'flying', 'rock'], resists: ['grass', 'fighting', 'ground'], strongAgainst: ['grass', 'psychic', 'dark'] },
    rock:     { name: '바위',   pokemon: '레지락 · 딱구리 · 마기라스',
                surface: '안 변함',
                inner: '변화가 두려운 게 아니라 "내가 지켜온 것"에 대한 자부심을 잃을까봐 안 바꾸는 것이다.',
                weakTo: ['water', 'grass', 'fighting', 'ground', 'steel'], resists: ['normal', 'fire', 'poison', 'flying'], strongAgainst: ['fire', 'ice', 'flying', 'bug'],
                note: '약점이 가장 많은 타입이라, 단단해 보여도 사실 겉바속여린 성격이다.' },
    ghost:    { name: '고스트', pokemon: '팬텀 · 기라티나 · 샹델라',
                surface: '은둔, 장난기',
                inner: '상처를 유머로 포장하는 습관. 진지하게 다가오면 오히려 피한다.',
                weakTo: ['ghost', 'dark'], resists: ['poison', 'bug'], strongAgainst: ['psychic', 'ghost'],
                note: '노말·격투에게는 신비주의가 아예 안 통한다 — 너무 평범하고 직진하는 사람에게는 안 먹힌다.' },
    dragon:   { name: '드래곤', pokemon: '망나뇽 · 한카리아스 · 레쿠쟈',
                surface: '강함, 자부심',
                inner: '강해야만 사랑받는다고 믿어서 약한 모습을 숨기지만, 사실 다정함을 들키고 싶어한다.',
                weakTo: ['ice', 'dragon'], resists: ['fire', 'water', 'electric', 'grass'], strongAgainst: ['dragon'],
                note: '페어리에게는 순수한 애정 앞에서 완전히 무장해제된다.' },
    dark:     { name: '악',     pokemon: '블래키 · 조로아크 · 절각참',
                surface: '무심함, 자기기준',
                inner: '상처받은 적이 있어서 미리 기대를 안 하는 방어기제. "신경 안 쓴다"는 건 사실 신경을 너무 많이 써서 지친 상태다.',
                weakTo: ['fighting', 'bug', 'fairy'], resists: ['ghost', 'dark'], strongAgainst: ['psychic', 'ghost'],
                note: '에스퍼에게는 마음을 읽으려 해도 안 읽힌다.' },
    steel:    { name: '강철',   pokemon: '메타그로스 · 보스로라 · 코바르온',
                surface: '단단함, 원칙',
                inner: '여러 번 깎이고 담금질(제련)되며 만들어진 단단함이다. 웬만한 흔들림엔 끄떡없지만 진짜 약점은 아주 좁고 근본적인 곳에 있다.',
                weakTo: ['fire', 'fighting', 'ground'], resists: ['normal', 'grass', 'ice', 'flying', 'psychic', 'bug', 'rock', 'dragon', 'steel', 'fairy'], strongAgainst: ['ice', 'rock', 'fairy'],
                note: '독에게는 교묘한 이간질·유혹이 절대 안 통한다.' },
    fairy:    { name: '페어리', pokemon: '픽시 · 님피아 · 토게키스',
                surface: '사랑스러움',
                inner: '사람을 챙기는 게 자기 존재 이유라고 느껴서, 정작 자기 자신을 챙기는 데는 서투르다.',
                weakTo: ['poison', 'steel'], resists: ['fighting', 'bug', 'dark'], strongAgainst: ['fighting', 'dragon', 'dark'],
                note: '드래곤에게는 다정함이 아예 안 통한다 — 지나치게 강하고 자존심 센 상대에겐 안 먹힌다.' }
};

var TYPE_ORDER = ['normal', 'fire', 'water', 'grass', 'electric', 'ice', 'fighting', 'poison',
    'ground', 'flying', 'psychic', 'bug', 'rock', 'ghost', 'dragon', 'dark', 'steel', 'fairy'];

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
