class Food {
  //pourquoi ne pas faire une nourriture intelligente qui fuit la voiture
  //Ainsi on pourrait peut etre voir des strats se developper
  constructor(i, j, brain) {
    this.pos = p5.Vector.random2D().add(createVector(1.2, 1.2)).mult(
      heightOfSketch / 2.5).add(i * heightOfSketch, j * heightOfSketch);
    this.vel = p5.Vector.random2D().normalize().mult(heightOfSketch /
      400);
    this.acc = createVector();
    this.maxSpeed = 2;
    this.score = 1;
    this.fitness = 0;
    this.disposed = false;


    this.dead = false;
    this.r = heightOfSketch / 40;

    this.i = i;
    this.j = j;

    if (brain) {
      this.brain = brain.copy();
    } else {
      this.brain = new NeuralNetwork(4, 20, 4);
    }
  }

  mutate(rate) {
    this.brain.mutate(rate);
  }

  think() {

    //penser a prendre en compte la vitesse de l'autre dans les inputs
    let carPos = cars[this.i][this.j].pos.copy();
    let inputs = [];
    //console.log(this.vel.angleBetween(foodPos.sub(this.pos)) * 180 / PI);
    inputs[0] = this.pos.dist(carPos) / heightOfSketch;
    inputs[1] = this.vel.angleBetween(carPos.sub(this.pos));
    inputs[2] = (this.pos.x - this.i * heightOfSketch) / heightOfSketch;
    inputs[3] = (this.pos.y - this.j * heightOfSketch) / heightOfSketch;


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

  update() {
    if (this.dead) {
      this.score /= 2;
      this.newLocation();
      this.dead = false;
    }
    this.vel.add(this.acc);
    this.pos.add(this.vel);
    this.acc.mult(0);
    this.vel.limit(this.maxSpeed);
    this.constrainInBorder();
  }

  newLocation() {
    this.pos = p5.Vector.random2D().add(createVector(1.2, 1.2)).mult(
      heightOfSketch / 2.5).add(this.i * heightOfSketch, this.j *
      heightOfSketch);
  }
  display() {
    push();
    fill(50, 255, 50);
    noStroke();
    // ellipseMode(CENTER);
    // ellipse(this.pos.x, this.pos.y, this.r, this.r);noStroke();
    translate(this.pos.x, this.pos.y);
    rotate(this.vel.heading()); //permet de ne pas s'emmerder avec les angles
    rotate(PI / 2);

    beginShape();
    vertex(0, -this.r * 2);
    vertex(this.r, this.r * 2);
    vertex(-this.r, this.r * 2);

    endShape(CLOSE);
    pop(); // rotation and things won't affect anything else thanks to pop()
  }


  applyForce(force) {
    this.acc.add(force);
  }

  constrainInBorder() {
    if (this.pos.x < (this.i + 1 / 10) * heightOfSketch) {
      // this.vel.rotate(PI).mult(0.5);
      this.pos.x = (this.i + 1 / 10) * heightOfSketch;
    }
    if (this.pos.x > (this.i + 1 - 1 / 10) * heightOfSketch) {
      // this.vel.rotate(PI).mult(0.5);
      this.pos.x = (this.i + 1 - 1 / 10) * heightOfSketch;
    }
    if (this.pos.y < (this.j + 1 / 10) * heightOfSketch) {
      // this.vel.rotate(PI).mult(0.5);
      this.pos.y = (this.j + 1 / 10) * heightOfSketch;
    }
    if (this.pos.y > (this.j + 1 - 1 / 10) * heightOfSketch) {
      // this.vel.rotate(PI).mult(0.5);
      this.pos.y = (this.j + 1 - 1 / 10) * heightOfSketch;
    }
  }
}
