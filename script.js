const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

const tileSize = 20;
const canvasSize = 600;
canvas.width = canvasSize;
canvas.height = canvasSize;

let player1Wins = 0;
let player2Wins = 0;

const snake1 = {
  body: [{ x: 5, y: 5 }],
  direction: { x: 0, y: 0 },
  color: 'limegreen',
  score: 0
};

const snake2 = {
  body: [{ x: 23, y: 5 }],
  direction: { x: 0, y: 0 },
  color: 'deepskyblue',
  score: 0
};

let food = { x: 10, y: 10 };
let gameOver = false;

function drawSquare(x, y, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw food
  drawSquare(food.x, food.y, 'red');

  // Draw snakes
  snake1.body.forEach(segment => drawSquare(segment.x, segment.y, snake1.color));
  snake2.body.forEach(segment => drawSquare(segment.x, segment.y, snake2.color));

  // Update displayed scores
  document.getElementById('player1Score').innerText = snake1.score;
  document.getElementById('player2Score').innerText = snake2.score;
}

function moveSnake(snake) {
  if (snake.direction.x === 0 && snake.direction.y === 0) return;

  const head = { ...snake.body[0] };
  head.x += snake.direction.x;
  head.y += snake.direction.y;

  // Wrap around edges
  if (head.x < 0) head.x = canvas.width / tileSize - 1;
  if (head.x >= canvas.width / tileSize) head.x = 0;
  if (head.y < 0) head.y = canvas.height / tileSize - 1;
  if (head.y >= canvas.height / tileSize) head.y = 0;

  snake.body.unshift(head);

  // Check for food
  if (head.x === food.x && head.y === food.y) {
    snake.score++;
    placeFood();
  } else {
    snake.body.pop();
  }
}

function placeFood() {
  food.x = Math.floor(Math.random() * (canvas.width / tileSize));
  food.y = Math.floor(Math.random() * (canvas.height / tileSize));
}

function checkSelfCollision(snake) {
  const head = snake.body[0];
  for (let i = 1; i < snake.body.length; i++) {
    if (snake.body[i].x === head.x && snake.body[i].y === head.y) {
      return true;
    }
  }
  return false;
}

function checkSnakeCollision(snake1, snake2) {
  const head1 = snake1.body[0];
  const head2 = snake2.body[0];

  for (const segment of snake2.body) {
    if (segment.x === head1.x && segment.y === head1.y) {
      return true;
    }
  }

  for (const segment of snake1.body) {
    if (segment.x === head2.x && segment.y === head2.y) {
      return true;
    }
  }

  return false;
}

function update() {
  if (gameOver) return;

  moveSnake(snake1);
  moveSnake(snake2);

  if (checkSelfCollision(snake1)) {
    player2Wins++;
    updateScoreboard();
    endGame('Player 2 wins!');
  }

  if (checkSelfCollision(snake2)) {
    player1Wins++;
    updateScoreboard();
    endGame('Player 1 wins!');
  }

  if (checkSnakeCollision(snake1, snake2)) {
    endGame('It\'s a tie!');
  }

  draw();
}

function endGame(message) {
  gameOver = true;
  setTimeout(() => {
    alert(message);
    resetGame();
  }, 100);
}

function resetGame() {
  snake1.body = [{ x: 5, y: 5 }];
  snake1.direction = { x: 0, y: 0 };
  snake1.score = 0;

  snake2.body = [{ x: 23, y: 5 }];
  snake2.direction = { x: 0, y: 0 };
  snake2.score = 0;

  placeFood();
  gameOver = false;
}

function updateScoreboard() {
  document.getElementById('player1Wins').innerText = player1Wins;
  document.getElementById('player2Wins').innerText = player2Wins;
}

window.addEventListener('keydown', (e) => {
  if (gameOver) return;

  // Player 1 controls (WASD)
  if (e.key === 'w') snake1.direction = { x: 0, y: -1 };
  if (e.key === 's') snake1.direction = { x: 0, y: 1 };
  if (e.key === 'a') snake1.direction = { x: -1, y: 0 };
  if (e.key === 'd') snake1.direction = { x: 1, y: 0 };

  // Player 2 controls (Arrow keys)
  if (e.key === 'ArrowUp') snake2.direction = { x: 0, y: -1 };
  if (e.key === 'ArrowDown') snake2.direction = { x: 0, y: 1 };
  if (e.key === 'ArrowLeft') snake2.direction = { x: -1, y: 0 };
  if (e.key === 'ArrowRight') snake2.direction = { x: 1, y: 0 };
});

placeFood();
setInterval(update, 100);
