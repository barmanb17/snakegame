const board = document.querySelector('.board');
const startButton = document.querySelector('.btn-start');
const modal = document.querySelector('.modal');
const startGameModal = document.querySelector('.start-game');
const gameOverModal = document.querySelector('.game-over');
const restartButton = document.querySelector('.btn-restart');

const highScoreElement = document.querySelector('#high-score');
const scoreElement = document.querySelector('#score');
const timeElement = document.querySelector('#time');



const BLOCK_SIZE = 30;
const NORMAL_SPEED = 300;
const FAST_SPEED = 100;


let highScore = Number(localStorage.getItem('highScore') ) || 0;
let score = 0;
let time = 0;

let intervalId = null;
let timerIntervalId = null;

let direction = 'right';
let snake = [{x: 1, y: 3}];
let food;


const cols = Math.floor(board.clientWidth / BLOCK_SIZE);
const rows = Math.floor(board.clientHeight / BLOCK_SIZE);
const blocks = {};

highScoreElement.innerText = highScore;

for(let x = 0; x<rows; x++) {
    for (let y = 0; y < cols; y++) {
        const block = document.createElement('div');
        block.classList.add('block');
        board.appendChild(block);
        blocks[`${x}-${y}`] = block;
    }
}

function randomFood() {
    let pos;
    do {
        pos = {
            x: Math.floor(Math.random()*rows),
            y: Math.floor(Math.random()*cols)
        }
    } while (snake.some(s => s.x=== pos.x && s.y ===pos.y));
    return pos;
}

function drawFood() {
    blocks[`${food.x}-${food.y}`].classList.add("food");
}

function clearSnake() {
    snake.forEach(({x, y}) => {
        blocks[`${x}-${y}`].classList.remove("fill");
    })
}

function drawSnake() {
    snake.forEach(({x, y}) => {
        blocks[`${x}-${y}`].classList.add("fill");
    })
}

function isSelfCollision(newHead) {
    return snake.some(
        (segment, index) => {
            index !== 0 &&
            segment.x === newHead.x && 
            segment.y === newHead.y
        }
    )
}


function render() {
    const head = snake[0];
    let newHead;

    if(direction === 'right') newHead = {x: head.x, y:head.y + 1};
  else if (direction === 'left') newHead = { x: head.x, y: head.y - 1 };
  else if (direction === 'up') newHead = { x: head.x - 1, y: head.y };
  else if (direction === 'down') newHead = { x: head.x + 1, y: head.y };

  // ✅ COLLISION CHECK (FIXED)
  if (
    newHead.x < 0 ||
    newHead.x >= rows ||
    newHead.y < 0 ||
    newHead.y >= cols ||
    isSelfCollision(newHead)
  ) {
    endGame();
    return;
  }}