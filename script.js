// ===== DOM ELEMENTS =====
const board = document.querySelector('.board');
const startButton = document.querySelector('.btn-start');
const modal = document.querySelector('.modal');
const startGameModal = document.querySelector('.start-game');
const gameOverModal = document.querySelector('.game-over');
const restartButton = document.querySelector('.btn-restart');

const highScoreElement = document.querySelector('#high-score');
const scoreElement = document.querySelector('#score');
const timeElement = document.querySelector('#time');

// ===== CONSTANTS =====
const BLOCK_SIZE = 30;
const NORMAL_SPEED = 300;
const FAST_SPEED = 100;

// ===== GAME STATE =====
let highScore = Number(localStorage.getItem('highScore')) || 0;
let score = 0;
let time = 0;

let intervalId = null;
let timerIntervalId = null;

let direction = 'right';
let snake = [{ x: 1, y: 3 }];
let food;

// ===== BOARD SETUP =====
const cols = Math.floor(board.clientWidth / BLOCK_SIZE);
const rows = Math.floor(board.clientHeight / BLOCK_SIZE);
const blocks = {};

highScoreElement.innerText = highScore;

// create grid
for (let x = 0; x < rows; x++) {
  for (let y = 0; y < cols; y++) {
    const block = document.createElement('div');
    block.classList.add('block');
    board.appendChild(block);
    blocks[`${x}-${y}`] = block;
  }
}

// ===== HELPERS =====
function randomFood() {
  return {
    x: Math.floor(Math.random() * rows),
    y: Math.floor(Math.random() * cols)
  };
}

function drawFood() {
  blocks[`${food.x}-${food.y}`].classList.add('food');
}

function clearSnake() {
  snake.forEach(({ x, y }) => {
    blocks[`${x}-${y}`].classList.remove('fill');
  });
}

function drawSnake() {
  snake.forEach(({ x, y }) => {
    blocks[`${x}-${y}`].classList.add('fill');
  });
}

// ===== CORE GAME LOOP =====
function render() {
  const head = snake[0];
  let newHead;

  // calculate new head
  if (direction === 'right') newHead = { x: head.x, y: head.y + 1 };
  if (direction === 'left') newHead = { x: head.x, y: head.y - 1 };
  if (direction === 'up') newHead = { x: head.x - 1, y: head.y };
  if (direction === 'down') newHead = { x: head.x + 1, y: head.y };

  // wall collision
  if (
    newHead.x < 0 ||
    newHead.x >= rows ||
    newHead.y < 0 ||
    newHead.y >= cols
  ) {
    endGame();
    return;
  }

  clearSnake();
  snake.unshift(newHead);

  // food logic
  if (newHead.x === food.x && newHead.y === food.y) {
    score += 10;
    scoreElement.innerText = score;

    if (score > highScore) {
      highScore = score;
      highScoreElement.innerText = highScore;
      localStorage.setItem('highScore', highScore);
    }

    blocks[`${food.x}-${food.y}`].classList.remove('food');
    food = randomFood();
    drawFood();
  } else {
    snake.pop(); // normal move
  }

  drawSnake();
}

// ===== GAME CONTROL =====
function startGame() {
  modal.style.display = 'none';
  food = randomFood();
  drawFood();

  intervalId = setInterval(render, NORMAL_SPEED);

  timerIntervalId = setInterval(() => {
    time++;
    const min = String(Math.floor(time / 60)).padStart(2, '0');
    const sec = String(time % 60).padStart(2, '0');
    timeElement.innerText = `${min}:${sec}`;
  }, 1000);
}

function endGame() {
  clearInterval(intervalId);
  clearInterval(timerIntervalId);

  modal.style.display = 'flex';
  startGameModal.style.display = 'none';
  gameOverModal.style.display = 'flex';
}

function changeSpeed(speed) {
    clearInterval(intervalId);
    intervalId = setInterval(render, speed);
}

function restartGame() {
  clearInterval(intervalId);
  clearInterval(timerIntervalId);

  clearSnake();
  blocks[`${food.x}-${food.y}`]?.classList.remove('food');

  score = 0;
  time = 0;
  direction = 'right';
  snake = [{ x: 1, y: 3 }];

  scoreElement.innerText = score;
  timeElement.innerText = '00:00';

  startGame();
}

// ===== EVENTS =====
startButton.addEventListener('click', startGame);
restartButton.addEventListener('click', restartGame);

let isFast = false;

window.addEventListener('keydown', (e) => {
    if(e.repeat) return;
  if (e.key === 'ArrowUp' && direction !== 'down') direction = 'up';
  if (e.key === 'ArrowDown' && direction !== 'up') direction = 'down';
  if (e.key === 'ArrowLeft' && direction !== 'right') direction = 'left';
  if (e.key === 'ArrowRight' && direction !== 'left') direction = 'right';

  if(!isFast) {
    isFast = true;
    changeSpeed(FAST_SPEED);
  }
});

window.addEventListener('keyup', () => {
    if(isFast) {
        isFast = false;
        changeSpeed(NORMAL_SPEED);
    }
})

const controlButtons = document.querySelectorAll('.mobile-controls button');

controlButtons.forEach(button => {
  button.addEventListener('touchstart', (e) => {
    e.preventDefault(); // stops scrolling

    const dir = button.dataset.dir;

    if (dir === 'up' && direction !== 'down') direction = 'up';
    if (dir === 'down' && direction !== 'up') direction = 'down';
    if (dir === 'left' && direction !== 'right') direction = 'left';
    if (dir === 'right' && direction !== 'left') direction = 'right';
  });
});

