const gameCanvas = document.getElementById("gameCanvas");
const context = gameCanvas.getContext("2d");
const startBtn = document.getElementById("startBtn");
const stopBtn = document.getElementById("stopBtn");

gameCanvas.width = 880;
gameCanvas.height = 620;

const paddleHeight = 20;
const paddleWidth = 95;
let paddlePositionX = (gameCanvas.width - paddleWidth) / 2;

const ballRadius = 20;
let ballX, ballY, ballSpeedX, ballSpeedY;

const totalBrickRows = 5;
const totalBrickColumns = 5;
const brickWidth = 105;
const brickHeight = 20;
const brickSpacing = 20;
const brickTopOffset = 50;
const brickLeftOffset = 120;

let brickGrid = [];
let playerScore = 0;
let playerLives = 3;

let moveRight = false;
let moveLeft = false;

function resetGame() {
  playerScore = 0;
  playerLives = 3;
  ballX = gameCanvas.width / 2;
  ballY = gameCanvas.height - 30;
  ballSpeedX = 2;
  ballSpeedY = -2;
  paddlePositionX = (gameCanvas.width - paddleWidth) / 2;

  brickGrid = Array.from({ length: totalBrickColumns }, () =>
    Array.from({ length: totalBrickRows }, () => ({ x: 0, y: 0, isActive: true }))
  );
}

document.addEventListener("keydown", (event) => {
  if (event.key === "Right" || event.key === "ArrowRight") moveRight = true;
  if (event.key === "Left" || event.key === "ArrowLeft") moveLeft = true;
});
document.addEventListener("keyup", (event) => {
  if (event.key === "Right" || event.key === "ArrowRight") moveRight = false;
  if (event.key === "Left" || event.key === "ArrowLeft") moveLeft = false;
});

function renderGame() {
  context.clearRect(0, 0, gameCanvas.width, gameCanvas.height);

  renderBricks();
  renderBall();
  renderPaddle();
  renderScore();
  renderLives();

  handleCollisions();

  if (ballX + ballSpeedX > gameCanvas.width - ballRadius || ballX + ballSpeedX < ballRadius) ballSpeedX = -ballSpeedX;
  if (ballY + ballSpeedY < ballRadius) ballSpeedY = -ballSpeedY;
  else if (ballY + ballSpeedY > gameCanvas.height - ballRadius) {
    if (ballX > paddlePositionX && ballX < paddlePositionX + paddleWidth) {
      ballSpeedY = -ballSpeedY;
    } else {
      playerLives--;
      if (!playerLives) {
        showToast(`Game Over! Your Score: ${playerScore}`, "error");
        stopGame();
        return;
      } else {
        ballX = gameCanvas.width / 2;
        ballY = gameCanvas.height - 30;
        ballSpeedX = 2;
        ballSpeedY = -2;
        paddlePositionX = (gameCanvas.width - paddleWidth) / 2;
      }
    }
  }

  if (moveRight && paddlePositionX < gameCanvas.width - paddleWidth) paddlePositionX += 7;
  else if (moveLeft && paddlePositionX > 0) paddlePositionX -= 7;

  ballX += ballSpeedX;
  ballY += ballSpeedY;

  if (playerScore >= 25) {
    showToast("You Won!", "success");
    stopGame();
  }
}

function renderBall() {
  context.beginPath();
  context.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
  context.fillStyle = "#ffffff";
  context.fill();
  context.closePath();
}

function renderPaddle() {
  context.beginPath();
  context.rect(paddlePositionX, gameCanvas.height - paddleHeight, paddleWidth, paddleHeight);
  context.fillStyle = "#ffffff";
  context.fill();
  context.closePath();
}

function renderBricks() {
  for (let column = 0; column < totalBrickColumns; column++) {
    for (let row = 0; row < totalBrickRows; row++) {
      const brick = brickGrid[column][row];
      if (brick.isActive) {
        const brickX = column * (brickWidth + brickSpacing) + brickLeftOffset;
        const brickY = row * (brickHeight + brickSpacing) + brickTopOffset;
        brick.x = brickX;
        brick.y = brickY;
        context.beginPath();
        context.rect(brickX, brickY, brickWidth, brickHeight);
        context.fillStyle = "#ffffff";
        context.fill();
        context.closePath();
      }
    }
  }
}

function renderScore() {
  context.font = "16px Arial";
  context.fillStyle = "#ffffff";
  context.fillText("Score: " + playerScore, 8, 20);
}

function renderLives() {
  context.font = "16px Arial";
  context.fillStyle = "#ffffff";
  context.fillText("Lives: " + "❤️".repeat(playerLives), gameCanvas.width - 150, 20);
}

function handleCollisions() {
  for (let column = 0; column < totalBrickColumns; column++) {
    for (let row = 0; row < totalBrickRows; row++) {
      const brick = brickGrid[column][row];
      if (brick.isActive) {
        if (
          ballX > brick.x &&
          ballX < brick.x + brickWidth &&
          ballY > brick.y &&
          ballY < brick.y + brickHeight
        ) {
          ballSpeedY = -ballSpeedY;
          brick.isActive = false;
          playerScore++;
        }
      }
    }
  }
}

function startGame() {
  resetGame();
  gameInterval = setInterval(renderGame, 10);
}

function stopGame() {
  clearInterval(gameInterval);
  showToast(`Game Stopped. Your Score: ${playerScore}`, "info");
}

function showToast(message, type) {
  Toastify({
    text: message,
    duration: 3000,
    gravity: "top",
    position: "center",
    backgroundColor: type === "success" ? "green" : type === "error" ? "red" : "blue",
    stopOnFocus: true,
  }).showToast();
}

startBtn.addEventListener("click", startGame);
stopBtn.addEventListener("click", stopGame);
