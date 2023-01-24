/* ***** GLOBAL METHODS ***** */
function genRandomAngle() {
  var xDir = random(1) > 0.5 ? true : false;
  var yDir = random(1) > 0.5 ? true : false;
  var angle = random(PI / 6);

  if (xDir && !yDir) return angle;
  else if (!xDir && !yDir) return PI - angle;
  else if (!xDir && yDir) return PI + angle;
  else if (xDir && yDir) return 2 * PI - angle;
}

function renderPlayingField() {
  background(64, 200, 78);
  // Drawing field lines
  noFill();
  stroke(255, 255, 128);
  strokeWeight(3);
  line(width / 2, 0, width / 2, height);
  circle(width / 2, height / 2, height / 2);
  arc(0, height / 2, 300, 300, (3 * PI) / 2, PI / 2);
  arc(width, height / 2, 300, 300, PI / 2, (3 * PI) / 2);
}

function renderScores() {
  if (!paused) {
    // Drawing scores
    fill(255);
    stroke(255);
    textSize(64);
    textAlign(CENTER, CENTER);
    text(leftScore, width / 2 - 48, height / 2);
    text(rightScore, width / 2 + 48, height / 2);
  } else {
    // Drawing "PAUSED"
    fill(255);
    stroke(0);
    textSize(72);
    textAlign(CENTER, CENTER);
    text("PAUSED", width / 2, height / 2);
  }
}

/* ***** BALL CLASS ***** */
class Ball {
  constructor(x, y, r, speed) {
    this.x = x - r / 2;
    this.y = y - r / 2;
    this.r = r;

    this.speed = speed;
    this.angle = PI / 4;
  }

  reset() {
    this.x = width / 2 - this.r / 2;
    this.y = height / 2 - this.r / 2;
    this.angle = genRandomAngle();
  }

  update() {
    this.x += this.speed * cos(this.angle);
    this.y += this.speed * sin(this.angle);

    var outLeft = this.x <= this.r / 2;
    var outRight = this.x >= width - this.r / 2;

    if (outLeft) {
      this.reset();
      rightScore++;
    }
    if (outRight) {
      this.reset();
      leftScore++;
    }

    if (this.y <= this.r / 2 || this.y >= height - this.r / 2) this.angle *= -1;
  }

  render() {
    fill(255);
    stroke(0);
    ellipse(this.x, this.y, this.r);
  }
}

/* ***** RACKET CLASS ***** */
class Racket {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.w = width * 0.01;
    this.h = height * 0.3;

    this.acc = 0.8;
    this.speed = 0;

    this.touching = false;
  }

  move(dir) {
    this.speed += this.acc;
    this.y += this.speed * dir;
  }

  checkCollision(ball) {
    var dx = Math.abs(ball.x - this.x); // Distance on X axis
    var dy = Math.abs(ball.y - this.y); // Distance on Y axis

    if (!this.touching) {
      if (dx <= this.w / 2 + ball.r / 2 && dy <= this.h / 2 + ball.r / 2) {
        this.touching = true;
        ball.angle = PI - ball.angle;
        ball.speed += 0.1;
      }
    } else {
      setTimeout(() => {
        // Waiting to avoid undesired effects
        this.touching = false;
      }, 1000);
    }
  }

  update() {
    // HEIGHT CONSTRAINS
    if (this.y < this.h / 2) this.y = this.h / 2;
    else if (this.y > height - this.h / 2) {
      this.y = height - this.h / 2;
    }

    // Decreasing speed
    this.speed *= 0.8;
  }

  render() {
    if (this.x > width / 2) fill(255, 128, 128);
    else fill(128, 128, 255);

    rectMode(CENTER);

    stroke(0);
    strokeWeight(1);
    rect(this.x, this.y, this.w, this.h, 20);
  }
}

/* ***** ***** GAME ***** ***** */
let ball;
let ballStartSpeed = 5;

let leftR;
let rightR;

var border;

var leftScore = 0;
var rightScore = 0;
function resetScore() {
  leftScore = 0;
  rightScore = 0;
  ball.reset();
  ball.speed = ballStartSpeed;
}

var paused = false;

function setup() {
  // Creating canvas
  createCanvas((3 * screen.width) / 6, (2 * screen.height) / 5);

  // Setting variables
  border = width * 0.02;

  // Creating ball and rackets
  ball = new Ball(width / 2, height / 2, 20, ballStartSpeed);
  leftR = new Racket(border, height / 2);
  rightR = new Racket(width - border, height / 2);
}

function draw() {
  //Processing inputs
  if (keyIsDown(81)) {
    // Q
    leftR.move(-1);
  }
  if (keyIsDown(65)) {
    // A
    leftR.move(1);
  }
  if (keyIsDown(80)) {
    // P
    rightR.move(-1);
  }
  if (keyIsDown(76)) {
    // L
    rightR.move(1);
  }

  // Updating
  leftR.checkCollision(ball);
  leftR.update();

  rightR.checkCollision(ball);
  rightR.update();

  ball.update();

  /* RENDERING */
  renderPlayingField();
  renderScores();

  stroke(0);
  fill(255);
  textSize(24);
  textAlign(CENTER, CENTER);
  text("Difficulty: " + ball.speed.toFixed(1), width / 2, height * 0.95);

  leftR.render();
  rightR.render();
  ball.render();
}

function keyPressed() {
  if (key === "r") {
    resetScore();
  }

  if (key === " ") {
    if (paused) loop();
    else noLoop();
    paused = !paused;
  }
}
