class Car {

  constructor(i, j, brain) {
    this.i = i;
    this.j = j;
    this.pos = createVector(heightOfSketch * (i + 0.5), heightOfSketch * (j +
      0.5));
    this.vel = p5.Vector.random2D().normalize().mult(heightOfSketch /
      400);
    this.acc = createVector();

    this.lastPos = createVector(0, 0);
    this.lastVel = createVector(0, 0);

    this.maxSpeed = 3;
    this.r = heightOfSketch / 40;
    this.score = 0;
    this.fitness = 0;

    this.dead = false;
    this.disposed = false;
    this.lastMeal = millis();
    this.timeAlive = millis();
    this.maxTimeAload = 15000;
    this.maxTimeAlive = 120000;
    this.scoreLastIncrease = 0;

    if (brain) {
      this.brain = brain.copy();
    } else {
      this.brain = new NeuralNetwork(5, 20, 4);
    }


  }

  mutate(rate) {
    this.brain.mutate(rate);
  }

  think() {


    let foodPos = foods[this.i][this.j].pos.copy();
    let inputs = [];
    //console.log(this.vel.angleBetween(foodPos.sub(this.pos)) * 180 / PI);
    inputs[0] = this.pos.dist(foodPos) / heightOfSketch;
    inputs[1] = this.vel.angleBetween(foodPos.sub(this.pos));
    inputs[2] = (this.pos.x - this.i * heightOfSketch) / heightOfSketch;
    inputs[3] = (this.pos.y - this.j * heightOfSketch) / heightOfSketch;
    inputs[4] = (this.scoreLastIncrease + 3) / 5;

    //console.log(this.vel());

    let outputs = this.brain.predict(inputs);
    //console.log(inputs);

    let outputMax = 0;
    for (let k = 1; k < inputs.length; k++) {
      if (outputs[k] > outputs[outputMax]) {
        outputMax = k;
      }
    }
    let force = this.vel.copy();

    if (outputMax === 0) {
      this.applyForce(force.normalize().mult(
        heightOfSketch / 400));
    } else if (outputMax === 1) {
      this.applyForce(force.rotate(PI).normalize().mult(
        heightOfSketch / 400));
    } else if (outputMax === 2) {
      this.vel.rotate(PI / 8);
    } else if (outputMax === 3) {
      this.vel.rotate(-PI / 8);
    }
  }

  eat(food) {
    if (this.pos.dist(food.pos) < food.r) {
      this.lastMeal = millis();
      food.dead = true;
      return true;
    } else {
      return false;
    }
  }

  isDead() {
    if (this.crossBorder() || this.crossTime()) {
      this.dead = true;
      return true;
    } else return false;
  }

  scoreIncreaser() {

    this.scoreLastIncrease = 0;
    let foodPos = foods[this.i][this.j].pos.copy();


    if (this.eat(foods[this.i][this.j])) {
      this.score += 30;
    }

    if (this.lastPos.dist(foods[this.i][this.j].pos) >
      this.pos.dist(foods[this.i][this.j].pos)) {
      this.scoreLastIncrease++;
    } else {
      this.scoreLastIncrease -= 1.5;
    }
    if (this.lastVel.angleBetween(foodPos.sub(this.pos)) >
      this.vel.angleBetween(foodPos.sub(this.pos))) {
      this.scoreLastIncrease++;
    } else {
      this.scoreLastIncrease -= 1.5;
    }
    this.lastPos = this.pos.copy();
    this.lastVel = this.vel.copy();
    this.score +=
      this.scoreLastIncrease;
  }

  update() {

    //this.applyForce(force);
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.mult(0);
    this.vel.limit(this.maxSpeed);
  }
  display() {

    push();
    let alpha = this.lastMeal + this.maxTimeAload / timeSlider.value() -
      millis();
    alpha *= 255 * timeSlider.value() / this.maxTimeAload * 5;
    fill(255, 100, 255, alpha);
    noStroke();
    translate(this.pos.x, this.pos.y);
    rotate(this.vel.heading()); //permet de ne pas s'emmerder avec les angles
    rotate(PI / 2);

    beginShape();
    vertex(0, -this.r * 2);
    vertex(this.r, this.r * 2);
    vertex(-this.r, this.r * 2);

    endShape(CLOSE);

    pop(); // rotationg thing and else won't affect
    //anything else thanks to the push and pop
  }


  applyForce(force) {
    this.acc.add(force);
  }

  crossTime() {

    if (millis() - this.lastMeal > this.maxTimeAload / timeSlider.value()) {
      return true;
    } else if (millis() - this.timeAlive > this.maxTimeAlive / timeSlider.value()) {
      return true;
    } else {
      return false;
    }
  }
  crossBorder() {
    if (this.pos.x < this.i * heightOfSketch) {
      return true;
    } else if (this.pos.x > (this.i + 1) * heightOfSketch) {
      return true;
    } else if (this.pos.y < this.j * heightOfSketch) {
      return true;
    } else if (this.pos.y > (this.j + 1) * heightOfSketch) {
      return true;
    } else {
      return false;
    }
  }

}
