// Elements
const screens = {
  menu: document.getElementById('menu-screen'),
  game: document.getElementById('game-screen'),
  end: document.getElementById('end-screen')
};

const UI = {
  botCount: document.getElementById('bot-count'),
  userCount: document.getElementById('user-count'),
  tableZone: document.getElementById('table-zone'),
  botSlot: document.getElementById('bot-slot'),
  userSlot: document.getElementById('user-slot'),
  statusMsg: document.getElementById('status-msg'),
  turnNum: document.getElementById('turn-num'),
  drawBtn: document.getElementById('draw-btn'),
  autoBtn: document.getElementById('auto-btn'),
  winOverlay: document.getElementById('win-overlay'),
  botDeck: document.getElementById('bot-deck'),
  userDeck: document.getElementById('user-deck'),
  timer: document.getElementById('game-timer'),
  speedBtns: document.querySelectorAll('.speed-btn')
};

// SFX Generator (using Web Audio API to avoid external assets)
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function playSFX(type) {
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.connect(gain);
  gain.connect(audioCtx.destination);

  const now = audioCtx.currentTime;

  switch(type) {
    case 'draw':
      osc.type = 'sine';
      osc.frequency.setValueAtTime(400, now);
      osc.frequency.exponentialRampToValueAtTime(800, now + 0.1);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
      osc.start();
      osc.stop(now + 0.1);
      break;
    case 'win':
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(523.25, now); // C5
      osc.frequency.setValueAtTime(659.25, now + 0.1); // E5
      osc.frequency.setValueAtTime(783.99, now + 0.2); // G5
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);
      osc.start();
      osc.stop(now + 0.4);
      break;
    case 'lose':
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(200, now);
      osc.frequency.linearRampToValueAtTime(100, now + 0.3);
      gain.gain.setValueAtTime(0.1, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.3);
      osc.start();
      osc.stop(now + 0.3);
      break;
    case 'battle':
      osc.type = 'square';
      osc.frequency.setValueAtTime(150, now);
      osc.frequency.setValueAtTime(250, now + 0.05);
      osc.frequency.setValueAtTime(150, now + 0.1);
      gain.gain.setValueAtTime(0.05, now);
      gain.gain.linearRampToValueAtTime(0.01, now + 0.2);
      osc.start();
      osc.stop(now + 0.2);
      break;
  }
}

// Constants
const SUITS = ['♠', '♥', '♦', '♣'];
const VALUES = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
const VALUE_MAP = { '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '10': 10, 'J': 11, 'Q': 12, 'K': 13, 'A': 14 };

// State
let userDeck = [];
let botDeck = [];
let tableCards = []; 
let pendingBattle = false;
let turnCount = 0;
let battleCount = 0;
let isAnimating = false;
let autoPlayMode = false;
let autoPlayInterval = null;
let gameStartTime = null;
let timerInterval = null;
let gameSpeed = 1;

// Utils
function createDeck() {
  const deck = [];
  for (const suit of SUITS) {
    for (const value of VALUES) {
      deck.push({ suit, value, rank: VALUE_MAP[value], isRed: suit === '♥' || suit === '♦' });
    }
  }
  return deck.sort(() => Math.random() - 0.5);
}

function createCardElement(card, isFaceUp = true) {
  const div = document.createElement('div');
  div.className = `playing-card ${card.isRed ? 'red' : ''}`;
  if (isFaceUp) {
    div.innerHTML = `
      <div class="card-top">
        <div class="card-value">${card.value}</div>
        <div class="card-suit-small">${card.suit}</div>
      </div>
      <div class="card-suit">${card.suit}</div>
      <div class="card-bottom">
        <div class="card-value">${card.value}</div>
        <div class="card-suit-small">${card.suit}</div>
      </div>
    `;
    div.classList.add('flipped');
  } else {
    div.classList.add('deck-visual');
  }
  return div;
}

function showScreen(screenId) {
  Object.values(screens).forEach(s => s.classList.remove('active'));
  screens[screenId].classList.add('active');
}

function updateTimer() {
  if (!gameStartTime) return;
  const elapsed = Math.floor((Date.now() - gameStartTime) / 1000);
  const m = Math.floor(elapsed / 60).toString().padStart(2, '0');
  const s = (elapsed % 60).toString().padStart(2, '0');
  UI.timer.textContent = `${m}:${s}`;
}

// Game Flow
function startGame() {
  const deck = createDeck();
  userDeck = deck.slice(0, 26);
  botDeck = deck.slice(26);
  tableCards = [];
  turnCount = 0;
  battleCount = 0;
  pendingBattle = false;
  isAnimating = false;
  autoPlayMode = false;
  clearInterval(autoPlayInterval);
  
  gameStartTime = Date.now();
  clearInterval(timerInterval);
  timerInterval = setInterval(updateTimer, 1000);
  
  UI.tableZone.innerHTML = '<div class="win-overlay" id="win-overlay"></div>';
  UI.winOverlay = document.getElementById('win-overlay');
  UI.tableZone.classList.remove('bataille-active');
  UI.autoBtn.textContent = 'Auto-play';
  UI.drawBtn.disabled = false;
  UI.drawBtn.textContent = 'Piocher';
  
  updateUI();
  showScreen('game');
  UI.statusMsg.textContent = 'À toi de piocher !';
  UI.statusMsg.style.color = 'inherit';

  if (window.GamesFirebase?.isReady) {
    window.GamesFirebase.trackEvent('Combattants', 'game_start', { mode: 'solo' });
  }
}

function updateUI() {
  UI.userCount.textContent = userDeck.length;
  UI.botCount.textContent = botDeck.length;
  UI.turnNum.textContent = turnCount;
  UI.userDeck.style.display = userDeck.length > 0 ? 'block' : 'none';
  UI.botDeck.style.display = botDeck.length > 0 ? 'block' : 'none';
}

function checkWin() {
  if (userDeck.length === 0 || botDeck.length === 0) {
    const isUserWin = botDeck.length === 0;
    endGame(isUserWin);
    return true;
  }
  return false;
}

function endGame(isUserWin) {
  stopAutoPlay();
  clearInterval(timerInterval);
  showScreen('end');
  
  document.getElementById('end-title').textContent = isUserWin ? 'Victoire !' : 'Défaite...';
  document.getElementById('end-msg').textContent = isUserWin 
    ? 'Tu as remporté toutes les cartes du royaume. Bien joué !'
    : 'Le bot a pris le dessus. Réessaie !';
    
  document.getElementById('stat-turns').textContent = turnCount;
  document.getElementById('stat-battles').textContent = battleCount;
  document.getElementById('stat-time').textContent = UI.timer.textContent;

  if (window.GamesFirebase?.isReady) {
    window.GamesFirebase.trackEvent('Combattants', 'game_end', { 
      winner: isUserWin ? 'user' : 'bot',
      turns: turnCount,
      battles: battleCount,
      time: UI.timer.textContent
    });
  }
}

function stopAutoPlay() {
  autoPlayMode = false;
  clearInterval(autoPlayInterval);
  UI.autoBtn.textContent = 'Auto-play';
  if (!isAnimating) UI.drawBtn.disabled = false;
}

function toggleAutoPlay() {
  if (autoPlayMode) {
    stopAutoPlay();
  } else {
    autoPlayMode = true;
    UI.autoBtn.textContent = 'Stop Auto';
    UI.drawBtn.disabled = true;
    if (!isAnimating) playTurn();
    
    const baseInterval = 1500;
    autoPlayInterval = setInterval(() => {
      if (!isAnimating && !checkWin()) {
        playTurn();
      }
    }, baseInterval / gameSpeed);
  }
}

function setSpeed(speed) {
  gameSpeed = parseInt(speed);
  UI.speedBtns.forEach(btn => {
    btn.classList.toggle('active', btn.dataset.speed == speed);
  });
  
  if (autoPlayMode) {
    clearInterval(autoPlayInterval);
    const baseInterval = 1500;
    autoPlayInterval = setInterval(() => {
      if (!isAnimating && !checkWin()) {
        playTurn();
      }
    }, baseInterval / gameSpeed);
  }
}

async function playTurn() {
  if (isAnimating || checkWin()) return;
  isAnimating = true;
  UI.drawBtn.disabled = true;
  
  if (!pendingBattle) turnCount++;
  updateUI();

  const userCard = userDeck.shift();
  const botCard = botDeck.shift();
  
  playSFX('draw');
  const userElem = createCardElement(userCard);
  const botElem = createCardElement(botCard);
  
  const offset = tableCards.length * 15;
  const animTime = 600 / gameSpeed;
  
  userElem.style.transitionDuration = `${animTime}ms`;
  botElem.style.transitionDuration = `${animTime}ms`;
  
  userElem.style.bottom = `${offset}px`;
  userElem.style.right = `calc(50% - 80px - ${offset}px)`;
  userElem.style.transform = `rotate(${(Math.random() - 0.5) * 15}deg)`;
  
  botElem.style.top = `${offset}px`;
  botElem.style.left = `calc(50% - 80px - ${offset}px)`;
  botElem.style.transform = `rotate(${(Math.random() - 0.5) * 15}deg)`;

  UI.tableZone.appendChild(userElem);
  UI.tableZone.appendChild(botElem);
  
  tableCards.push({ owner: 'user', card: userCard, elem: userElem });
  tableCards.push({ owner: 'bot', card: botCard, elem: botElem });
  
  updateUI();

  await new Promise(r => setTimeout(r, animTime));

  if (userCard.rank > botCard.rank) {
    await resolveTurn('user');
  } else if (botCard.rank > userCard.rank) {
    await resolveTurn('bot');
  } else {
    playSFX('battle');
    battleCount++;
    pendingBattle = true;
    UI.statusMsg.textContent = 'BATAILLE !';
    UI.statusMsg.style.color = '#ff4757';
    UI.tableZone.classList.add('bataille-active');
    
    await new Promise(r => setTimeout(r, 800 / gameSpeed));
    
    if (userDeck.length === 0) return endGame(false);
    if (botDeck.length === 0) return endGame(true);

    const userHidden = userDeck.shift();
    const botHidden = botDeck.shift();
    
    const userHiddenElem = createCardElement(userHidden, false);
    const botHiddenElem = createCardElement(botHidden, false);
    
    userHiddenElem.style.transitionDuration = `${animTime}ms`;
    botHiddenElem.style.transitionDuration = `${animTime}ms`;

    const hiddenOffset = tableCards.length * 15;
    userHiddenElem.style.bottom = `${hiddenOffset}px`;
    userHiddenElem.style.right = `calc(50% - 80px - ${hiddenOffset}px)`;

    botHiddenElem.style.top = `${hiddenOffset}px`;
    botHiddenElem.style.left = `calc(50% - 80px - ${hiddenOffset}px)`;

    UI.tableZone.appendChild(userHiddenElem);
    UI.tableZone.appendChild(botHiddenElem);
    
    tableCards.push({ owner: 'user', card: userHidden, elem: userHiddenElem });
    tableCards.push({ owner: 'bot', card: botHidden, elem: botHiddenElem });
    
    updateUI();
    
    isAnimating = false;
    if (!autoPlayMode) {
      UI.drawBtn.disabled = false;
      UI.drawBtn.textContent = 'Bataille !';
    }
  }
}

async function resolveTurn(winner) {
  pendingBattle = false;
  UI.tableZone.classList.remove('bataille-active');
  UI.statusMsg.textContent = winner === 'user' ? 'Tu remportes le pli !' : 'Le bot remporte le pli.';
  UI.statusMsg.style.color = winner === 'user' ? '#53e8b9' : '#ff7198';
  
  playSFX(winner === 'user' ? 'win' : 'lose');

  if (winner === 'user') {
    UI.winOverlay.textContent = 'VICTOIRE';
    UI.winOverlay.style.color = '#53e8b9';
  } else {
    UI.winOverlay.textContent = 'PERDU';
    UI.winOverlay.style.color = '#ff7198';
  }
  UI.winOverlay.classList.add('active');
  
  await new Promise(r => setTimeout(r, 800 / gameSpeed));
  UI.winOverlay.classList.remove('active');

  const wonCards = tableCards.map(tc => tc.card).sort(() => Math.random() - 0.5);
  const animTime = 400 / gameSpeed;

  tableCards.forEach(tc => {
    tc.elem.style.transitionDuration = `${animTime}ms`;
    tc.elem.style.zIndex = 100;
    if (winner === 'user') {
      tc.elem.style.bottom = '-200px';
      tc.elem.style.right = '0';
    } else {
      tc.elem.style.top = '-200px';
      tc.elem.style.left = '0';
    }
    tc.elem.style.opacity = '0';
  });

  await new Promise(r => setTimeout(r, animTime));
  
  if (winner === 'user') {
    userDeck.push(...wonCards);
  } else {
    botDeck.push(...wonCards);
  }

  tableCards.forEach(tc => tc.elem.remove());
  tableCards = [];
  
  updateUI();
  isAnimating = false;
  UI.drawBtn.textContent = 'Piocher';
  
  if (!autoPlayMode) {
    UI.drawBtn.disabled = false;
  }
  
  checkWin();
}

// Event Listeners
document.getElementById('start-solo').addEventListener('click', startGame);
document.getElementById('restart-btn').addEventListener('click', startGame);
document.getElementById('quit-game').addEventListener('click', () => {
  stopAutoPlay();
  clearInterval(timerInterval);
  showScreen('menu');
});

UI.drawBtn.addEventListener('click', playTurn);
UI.autoBtn.addEventListener('click', toggleAutoPlay);

UI.speedBtns.forEach(btn => {
  btn.addEventListener('click', () => setSpeed(btn.dataset.speed));
});
