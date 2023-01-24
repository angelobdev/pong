function getAngle() {
  var xDir = random(1) > 0.5 ? true : false;
  var yDir = random(1) > 0.5 ? true : false;
  var angle = random(PI / 6);

  if (xDir && !yDir) return angle;
  else if (!xDir && !yDir) return PI - angle;
  else if (!xDir && yDir) return PI + angle;
  else if (xDir && yDir) return 2 * PI - angle;
}

// Ball class
class Ball {
  constructor(x, y, r, speed) {
    this.x = x - r / 2;
    this.y = y - r / 2;
    this.r = r;
    this.speed = speed;
    this.angle = getAngle();
  }

  reset() {
    this.x = width / 2 - this.r / 2;
    this.y = height / 2 - this.r / 2;
    this.angle = getAngle();
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
    fill(220);
    stroke(0);
    ellipse(this.x, this.y, this.r);
  }
}
//Racket
class Racket {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.w = width * 0.01;
    this.h = height * 0.4;

    this.acc = 1;
    this.speed = 0;
  }

  move(dir) {
    this.speed += this.acc;
    this.y += this.speed * dir;
  }

  update() {
    //HEIGHT CONSTRAINS
    if (this.y < this.h / 2) this.y = this.h / 2;
    else if (this.y > height - this.h / 2) {
      this.y = height - this.h / 2;
    }

    //RIGHT PUCK CONTROLLER
    if (this.x > width / 2) {
      if (ball.y > this.h / 2 && ball.y < height - this.h / 2)
        if (this.y < ball.y) this.y += 0.4;
        else this.y -= 0.4;
      //BALL COLLISION RIGHT
      if (
        ball.y < this.y + this.h / 2 &&
        ball.y > this.y - this.h / 2 &&
        ball.x + ball.r / 2 > this.x - this.w / 2
      ) {
        ball.speed *= -1;
        ball.angle *= -1;
      }
    } else {
      //BALL COLLISION LEFT
      if (
        ball.y < this.y + this.h / 2 &&
        ball.y > this.y - this.h / 2 &&
        ball.x - ball.r / 2 < this.x + this.w / 2
      ) {
        ball.speed *= -1;
        ball.angle *= -1;
      }
      //speed decreaser
      this.speed *= 0.9;
    }
  }

  render() {
    if (this.x > width / 2) fill(255, 0, 0);
    else fill(0, 0, 255);
    stroke(0);
    strokeWeight(1);
    rect(this.x - this.w / 2, this.y - this.h / 2, this.w, this.h);
  }
}

//Game
let ball;
let leftR;
let rightR;

var border;

var leftScore = 0;
var rightScore = 0;

function setup() {
  createCanvas(700, 400);
  ball = new Ball(width / 2, height / 2, 20, 2);
  border = width * 0.02;
  leftR = new Racket(border, height / 2);
  rightR = new Racket(width - border, height / 2);
}

function draw() {
  background(0, 255, 0);

  noFill();
  stroke(255);
  strokeWeight(1);
  text(leftScore, width * 0.2, height * 0.2);
  text(rightScore, width * 0.8, height * 0.2);

  noFill();
  stroke(255, 255, 0);
  strokeWeight(4);
  line(width / 2, 0, width / 2, height);
  circle(width / 2, height / 2, height / 2);

  leftR.update();
  rightR.update();
  ball.update();

  leftR.render();
  rightR.render();
  ball.render();

  if (keyIsDown(UP_ARROW)) {
    leftR.move(-1);
  }
  if (keyIsDown(DOWN_ARROW)) {
    leftR.move(1);
  }
}
