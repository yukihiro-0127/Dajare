const state = {
  language: 'ja',
  tone: 'casual',
  results: [],
  favorites: [],
  isGenerating: false,
  speakingId: null,
};

const uiStrings = {
  ja: {
    eyebrow: 'ことばで遊ぶダジャレ生成',
    subtitle: '音・意味・文脈のズレで、言語感覚をくすぐるダジャレを。',
    inputLabel: '単語または短文を入力',
    placeholder: '例：さくら / 会議 / coffee break',
    generate: '生成する',
    generating: '生成中…',
    helper: '生成結果はカードをクリックしてコピーできます。',
    resultsTitle: '生成結果',
    favoritesTitle: 'Favorites（保存したダジャレ）',
    toneLabel: 'トーン',
    emptyError: '入力が空です。単語または短文を入力してください。',
    copied: 'コピーしました！',
    copy: 'Copy',
    play: '再生',
    stop: '再生中',
    types: {
      phonetic: '音が似ている',
      semantic: '意味のズラし',
      context: '文脈のひねり',
    },
    tones: {
      casual: 'Casual',
      business: 'Business',
    },
  },
  en: {
    eyebrow: 'Playful pun generator',
    subtitle: 'Explore phonetics, semantics, and context shifts for witty puns.',
    inputLabel: 'Enter a word or short phrase',
    placeholder: 'e.g., sakura / meeting / coffee break',
    generate: 'Generate',
    generating: 'Generating…',
    helper: 'Click a card to copy the pun.',
    resultsTitle: 'Generated Puns',
    favoritesTitle: 'Favorites',
    toneLabel: 'Tone',
    emptyError: 'Please enter a word or short phrase first.',
    copied: 'Copied!',
    copy: 'Copy',
    play: 'Play',
    stop: 'Playing',
    types: {
      phonetic: 'Phonetic',
      semantic: 'Semantic shift',
      context: 'Context twist',
    },
    tones: {
      casual: 'Casual',
      business: 'Business',
    },
  },
};

const toneFlavor = {
  ja: {
    casual: {
      reactions: ['ちょっと笑った', 'ついツッコミたくなる', '口に出すと楽しい'],
      context: ['カフェで', '散歩中に', '友だちとの会話で'],
      qualifiers: ['ゆるく', '気軽に', 'ちょっと'],
    },
    business: {
      reactions: ['場が和む', 'アイスブレイクにちょうどいい', '軽い雑談に使える'],
      context: ['会議の冒頭で', 'オンラインミーティングで', '社内雑談で'],
      qualifiers: ['やさしく', '控えめに', '安全に'],
    },
  },
  en: {
    casual: {
      reactions: ['gets a quick chuckle', 'makes you grin', 'sounds fun out loud'],
      context: ['at a café', 'on a walk', 'with friends'],
      qualifiers: ['lightly', 'playfully', 'casually'],
    },
    business: {
      reactions: ['breaks the ice', 'keeps it safe', 'fits a friendly chat'],
      context: ['in a meeting opener', 'during a team sync', 'on a work chat'],
      qualifiers: ['gently', 'safely', 'professionally'],
    },
  },
};

const semanticTwists = {
  ja: ['お菓子', '天気予報', '仕事のタスク', '旅の予定', '心の声', 'お守り'],
  en: [
    'a snack',
    'a weather report',
    'a work task',
    'a travel plan',
    'a hidden thought',
    'a lucky charm',
  ],
};

const contextPunches = {
  ja: ['実は褒め言葉', '軽いボケの合図', '気分転換のサイン', '気持ちを整える合図'],
  en: ['a subtle compliment', 'a playful cue', 'a mood reset', 'a gentle nudge'],
};

const phoneticFrames = {
  ja: [
    '「{input}」って言ったら「{twin}」に聞こえて、{reaction}。',
    '「{input}」より「{twin}」の方が口に残るかも。{reaction}。',
    '「{input}」？いやいや「{twin}」のつもりで言ったでしょ？',
  ],
  en: [
    '"{input}" sounds like "{twin}", which {reaction}.',
    'Say "{input}" and it slips into "{twin}" — that {reaction}.',
    '"{input}"? No, I heard "{twin}".',
  ],
};

const semanticFrames = {
  ja: [
    '「{input}」を{twist}に例えると、{reaction}。',
    'もし「{input}」が{twist}だったら、{reaction}よね。',
    '「{input}」は{twist}だと思うと、{qualifier}しっくりくる。',
  ],
  en: [
    'If "{input}" were {twist}, it {reaction}.',
    'Treat "{input}" as {twist} and it suddenly {reaction}.',
    '"{input}" as {twist} is {qualifier} on-brand.',
  ],
};

const contextFrames = {
  ja: [
    '{context}「{input}」って言ったら、実は{punch}。',
    '{context}「{input}」で通じるのが、ちょっと面白い。',
  ],
  en: [
    '{context}, saying "{input}" becomes {punch}.',
    '{context}, "{input}" lands as {punch}.',
  ],
};

const elements = {
  eyebrow: document.getElementById('eyebrow'),
  title: document.getElementById('title'),
  subtitle: document.getElementById('subtitle'),
  inputLabel: document.getElementById('inputLabel'),
  prompt: document.getElementById('prompt'),
  generate: document.getElementById('generate'),
  status: document.getElementById('status'),
  helper: document.getElementById('helper'),
  resultsTitle: document.getElementById('resultsTitle'),
  resultsCount: document.getElementById('resultsCount'),
  resultsGrid: document.getElementById('resultsGrid'),
  favoritesTitle: document.getElementById('favoritesTitle'),
  favoritesCount: document.getElementById('favoritesCount'),
  favoritesList: document.getElementById('favoritesList'),
  toneLabel: document.getElementById('toneLabel'),
  languageButtons: document.querySelectorAll('[data-lang]'),
  toneButtons: document.querySelectorAll('[data-tone]'),
};

const storageKey = 'dajare-favorites-v1';

function setActiveToggle(buttons, value, attr) {
  buttons.forEach((button) => {
    button.classList.toggle('active', button.dataset[attr] === value);
  });
}

function updateLanguage() {
  const strings = uiStrings[state.language];
  document.documentElement.lang = state.language;
  elements.eyebrow.textContent = strings.eyebrow;
  elements.subtitle.textContent = strings.subtitle;
  elements.inputLabel.textContent = strings.inputLabel;
  elements.prompt.placeholder = strings.placeholder;
  elements.generate.textContent = strings.generate;
  elements.helper.textContent = strings.helper;
  elements.resultsTitle.textContent = strings.resultsTitle;
  elements.favoritesTitle.textContent = strings.favoritesTitle;
  elements.toneLabel.textContent = strings.toneLabel;
  setActiveToggle(elements.languageButtons, state.language, 'lang');
  setActiveToggle(elements.toneButtons, state.tone, 'tone');
  renderResults();
  renderFavorites();
}

function hashId(text) {
  let hash = 0;
  for (let i = 0; i < text.length; i += 1) {
    hash = (hash << 5) - hash + text.charCodeAt(i);
    hash |= 0;
  }
  return `pun-${Math.abs(hash)}`;
}

function buildPunItem(text, type) {
  return {
    id: hashId(`${state.language}-${state.tone}-${type}-${text}`),
    text,
    type,
    tone: state.tone,
    language: state.language,
  };
}

function getRandomItem(list) {
  return list[Math.floor(Math.random() * list.length)];
}

function makePhoneticTwin(input, lang) {
  const asciiOnly = /^[\x00-\x7F]+$/.test(input);
  if (lang === 'en' || asciiOnly) {
    const consonantSwaps = {
      b: 'p',
      p: 'b',
      t: 'd',
      d: 't',
      k: 'g',
      g: 'k',
      f: 'v',
      v: 'f',
      s: 'z',
      z: 's',
      c: 'k',
      m: 'n',
      n: 'm',
    };
    const lower = input.toLowerCase();
    for (let i = 0; i < lower.length; i += 1) {
      const char = lower[i];
      if (consonantSwaps[char]) {
        return input.slice(0, i) + consonantSwaps[char] + input.slice(i + 1);
      }
    }
    const vowels = ['a', 'e', 'i', 'o', 'u'];
    for (let i = 0; i < lower.length; i += 1) {
      const char = lower[i];
      if (vowels.includes(char)) {
        const nextVowel = vowels[(vowels.indexOf(char) + 1) % vowels.length];
        return input.slice(0, i) + nextVowel + input.slice(i + 1);
      }
    }
    return `${input}y`;
  }

  const kanaMap = {
    あ: 'か', か: 'が', が: 'か', さ: 'ざ', ざ: 'さ', た: 'だ', だ: 'た',
    な: 'ま', ま: 'な', は: 'ば', ば: 'ぱ', ぱ: 'は', ら: 'わ',
    し: 'じ', じ: 'し', き: 'ぎ', ぎ: 'き', ふ: 'ぶ', ぶ: 'ぷ', ぷ: 'ふ',
    ア: 'カ', カ: 'ガ', ガ: 'カ', サ: 'ザ', ザ: 'サ', タ: 'ダ', ダ: 'タ',
    ナ: 'マ', マ: 'ナ', ハ: 'バ', バ: 'パ', パ: 'ハ', ラ: 'ワ',
    シ: 'ジ', ジ: 'シ', キ: 'ギ', ギ: 'キ', フ: 'ブ', ブ: 'プ', プ: 'フ',
  };

  for (let i = 0; i < input.length; i += 1) {
    const char = input[i];
    if (kanaMap[char]) {
      return input.slice(0, i) + kanaMap[char] + input.slice(i + 1);
    }
  }

  return `${input}ん`;
}

function applyFrame(frame, values) {
  return frame.replace(/\{(\w+)\}/g, (_, key) => values[key] ?? '');
}

function generatePhoneticPun(input, lang) {
  const twin = makePhoneticTwin(input, lang);
  const flavor = toneFlavor[lang][state.tone];
  const frame = getRandomItem(phoneticFrames[lang]);
  return applyFrame(frame, {
    input,
    twin,
    reaction: getRandomItem(flavor.reactions),
  });
}

function generateSemanticPun(input, lang) {
  const twist = getRandomItem(semanticTwists[lang]);
  const flavor = toneFlavor[lang][state.tone];
  const frame = getRandomItem(semanticFrames[lang]);
  return applyFrame(frame, {
    input,
    twist,
    reaction: getRandomItem(flavor.reactions),
    qualifier: getRandomItem(flavor.qualifiers),
  });
}

function generateContextPun(input, lang) {
  const flavor = toneFlavor[lang][state.tone];
  const punch = getRandomItem(contextPunches[lang]);
  const frame = getRandomItem(contextFrames[lang]);
  return applyFrame(frame, {
    input,
    context: getRandomItem(flavor.context),
    punch,
  });
}

function generatePuns(input, lang) {
  const items = [];
  const types = ['phonetic', 'semantic', 'context'];
  const generators = {
    phonetic: () => generatePhoneticPun(input, lang),
    semantic: () => generateSemanticPun(input, lang),
    context: () => generateContextPun(input, lang),
  };
  const counts = { phonetic: 2, semantic: 2, context: 1 };

  types.forEach((type) => {
    for (let i = 0; i < counts[type]; i += 1) {
      items.push(buildPunItem(generators[type](), type));
    }
  });

  return items.slice(0, 5);
}

function setStatus(message) {
  elements.status.textContent = message;
}

function setGenerating(isGenerating) {
  state.isGenerating = isGenerating;
  const strings = uiStrings[state.language];
  if (isGenerating) {
    setStatus(strings.generating);
  } else {
    setStatus('');
  }
}

function isFavorite(item) {
  return state.favorites.some((fav) => fav.id === item.id);
}

function toggleFavorite(item) {
  if (isFavorite(item)) {
    state.favorites = state.favorites.filter((fav) => fav.id !== item.id);
  } else {
    state.favorites = [...state.favorites, item];
  }
  localStorage.setItem(storageKey, JSON.stringify(state.favorites));
  renderResults();
  renderFavorites();
}

function handleCopy(text) {
  const strings = uiStrings[state.language];
  if (navigator.clipboard?.writeText) {
    navigator.clipboard.writeText(text).then(() => {
      setStatus(strings.copied);
      setTimeout(() => setStatus(''), 1200);
    });
  }
}

function playSpeech(text, language, button, id) {
  if (!window.speechSynthesis || state.speakingId) {
    return;
  }

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = language === 'ja' ? 'ja-JP' : 'en-US';
  state.speakingId = id;
  button.classList.add('playing');
  button.disabled = true;

  utterance.onend = () => {
    state.speakingId = null;
    button.classList.remove('playing');
    button.disabled = false;
  };

  utterance.onerror = () => {
    state.speakingId = null;
    button.classList.remove('playing');
    button.disabled = false;
  };

  window.speechSynthesis.speak(utterance);
}

function buildCard(
  item,
  options = { showCopy: true, showStar: true, showTone: true, showLanguage: false }
) {
  const strings = uiStrings[state.language];
  const card = document.createElement('article');
  card.className = 'card';
  card.tabIndex = 0;

  const text = document.createElement('div');
  text.className = 'text';
  text.textContent = item.text;

  const meta = document.createElement('div');
  meta.className = 'meta';
  const typeTag = document.createElement('span');
  typeTag.className = 'tag';
  typeTag.textContent = strings.types[item.type];
  meta.appendChild(typeTag);

  if (options.showTone) {
    const toneTag = document.createElement('span');
    toneTag.className = 'tag';
    toneTag.textContent = strings.tones[item.tone];
    meta.appendChild(toneTag);
  }

  if (options.showLanguage) {
    const languageTag = document.createElement('span');
    languageTag.className = 'tag';
    languageTag.textContent = item.language === 'ja' ? '日本語' : 'English';
    meta.appendChild(languageTag);
  }

  const controls = document.createElement('div');
  controls.className = 'controls';

  const playButton = document.createElement('button');
  playButton.type = 'button';
  playButton.className = 'icon-btn';
  playButton.textContent = '👂';
  playButton.setAttribute('aria-label', strings.play);
  playButton.addEventListener('click', (event) => {
    event.stopPropagation();
    playSpeech(item.text, item.language, playButton, item.id);
  });

  controls.appendChild(playButton);

  if (options.showCopy) {
    const copyButton = document.createElement('button');
    copyButton.type = 'button';
    copyButton.className = 'copy';
    copyButton.textContent = strings.copy;
    copyButton.addEventListener('click', (event) => {
      event.stopPropagation();
      handleCopy(item.text);
    });
    controls.appendChild(copyButton);
  }

  if (options.showStar) {
    const starButton = document.createElement('button');
    starButton.type = 'button';
    starButton.className = 'icon-btn star';
    starButton.textContent = '★';
    starButton.classList.toggle('active', isFavorite(item));
    starButton.addEventListener('click', (event) => {
      event.stopPropagation();
      toggleFavorite(item);
    });
    controls.appendChild(starButton);
  }

  card.appendChild(meta);
  card.appendChild(text);
  card.appendChild(controls);

  card.addEventListener('click', () => handleCopy(item.text));

  return card;
}

function renderResults() {
  elements.resultsGrid.innerHTML = '';
  elements.resultsCount.textContent = state.results.length.toString();
  state.results.forEach((item) => {
    const card = buildCard(item, {
      showCopy: true,
      showStar: true,
      showTone: true,
      showLanguage: false,
    });
    elements.resultsGrid.appendChild(card);
  });
}

function renderFavorites() {
  elements.favoritesList.innerHTML = '';
  elements.favoritesCount.textContent = state.favorites.length.toString();
  state.favorites.forEach((item) => {
    const card = buildCard(item, {
      showCopy: false,
      showStar: true,
      showTone: true,
      showLanguage: true,
    });
    elements.favoritesList.appendChild(card);
  });
}

function handleGenerate() {
  const strings = uiStrings[state.language];
  const input = elements.prompt.value.trim();
  if (!input) {
    setStatus(strings.emptyError);
    return;
  }

  setGenerating(true);
  setTimeout(() => {
    state.results = generatePuns(input, state.language);
    setGenerating(false);
    renderResults();
  }, 450);
}

function loadFavorites() {
  const saved = localStorage.getItem(storageKey);
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed)) {
        state.favorites = parsed;
      }
    } catch (error) {
      state.favorites = [];
    }
  }
}

elements.generate.addEventListener('click', handleGenerate);

elements.languageButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const newLang = button.dataset.lang;
    if (newLang === state.language) {
      return;
    }
    state.language = newLang;
    state.results = [];
    updateLanguage();
  });
});

elements.toneButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const newTone = button.dataset.tone;
    if (newTone === state.tone) {
      return;
    }
    state.tone = newTone;
    updateLanguage();
  });
});

loadFavorites();
updateLanguage();
renderFavorites();
