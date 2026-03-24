const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const birdImg = new Image();
birdImg.src = "images/bird.png";

canvas.width = 400;
canvas.height = 600;

let bird, pipes, score, frame, gameOver, gameStarted;

// START GAME
function startGame() {
  document.getElementById("home").style.display = "none";
  document.getElementById("gameSection").style.display = "block";

  bird = { x: 80, y: 300, r: 20, v: 0 };
  pipes = [];
  score = 0;
  frame = 0;
  gameOver = false;
  gameStarted = true;

  update();
}

// RESTART
function restartGame() {
  location.reload();
}

// JUMP
document.addEventListener("click", () => {
  if (gameStarted && !gameOver) {
    bird.v = -5;
  }
});

// CREATE PIPES
function createPipe() {
  let gap = 200; // big gap = easy game

  // center position of gap
  let center = canvas.height / 2;

  // small variation (optional)
  let offset = Math.random() * 70 - 35; // -35 to +35

  let top = center + offset - canvas.height;

  pipes.push({
    x: canvas.width,
    y: top,
    w: 60,
    gap: gap,
    passed: false
  });
}

// DRAW BIRD (with tilt)
function drawBird() {
  ctx.save();

  ctx.translate(bird.x, bird.y);

  // clamp rotation for realism
  let angle = Math.max(-0.5, Math.min(1, bird.v * 0.08));
  ctx.rotate(angle);

  ctx.drawImage(birdImg, -20, -20, 40, 40);

  ctx.restore();
}
// DRAW PIPES
function drawPipes() {
  ctx.fillStyle = "green";
  pipes.forEach(p => {
    ctx.fillRect(p.x, p.y, p.w, canvas.height);
    ctx.fillRect(p.x, p.y + canvas.height + p.gap, p.w, canvas.height);
  });
}

// GAME LOOP
function update() {
  if (!gameStarted || gameOver) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // gravity (smooth)
bird.v += 0.25;

// apply movement
bird.y += bird.v;

// limit speed (prevents crazy fall)
if (bird.v > 5) bird.v = 5;

  if (frame % 100 === 0) createPipe();

  pipes.forEach(p => {
    p.x -= 2.5;

    // collision
    if (
  bird.x + bird.r > p.x &&
  bird.x - bird.r < p.x + p.w &&
  (
    bird.y - bird.r < p.y + canvas.height ||
    bird.y + bird.r > p.y + canvas.height + p.gap
  )
) {
  endGame();
}

    // score
    if (p.x + p.w < bird.x && !p.passed) {
      score++;
      p.passed = true;
      document.getElementById("score").innerText = score;
    }
  });

  pipes = pipes.filter(p => p.x + p.w > 0);

  // ground hit
  // keep bird inside screen
if (bird.y > canvas.height - bird.r) {
  bird.y = canvas.height - bird.r;
  bird.v = 0;
}

if (bird.y < bird.r) {
  bird.y = bird.r;
  bird.v = 0;
}

  drawBird();
  drawPipes();

  frame++;
  requestAnimationFrame(update);
}


function endGame() {
  gameOver = true;
  document.getElementById("gameOver").style.display = "flex";
  document.getElementById("finalScore").innerText = score;
}

function goHome() {
  location.reload();
}