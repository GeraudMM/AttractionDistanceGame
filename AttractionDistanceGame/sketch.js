let timeSlider;
let mrSlider;
let fitnessSlider;


const heightOfSketch = 100;
const wSketchNumber = 8;
const hSketchNumber = 10;

var genCars;
var genFoods;
var foods = new Array(wSketchNumber);
var cars = new Array(wSketchNumber);
for (let i = 0; i < wSketchNumber; i++) {
  cars[i] = new Array(hSketchNumber);
  foods[i] = new Array(hSketchNumber);
}
const total = wSketchNumber * hSketchNumber;

function setup() {
  createCanvas(heightOfSketch * wSketchNumber + 250, heightOfSketch *
    hSketchNumber + 1);

  timeSlider = createSlider(1, 10, 2);
  timeSlider.position(heightOfSketch * wSketchNumber + 40, 220);
  mrSlider = createSlider(0, 40, 3);
  mrSlider.position(heightOfSketch * wSketchNumber + 40, 320);
  fitnessSlider = createSlider(1, 10, 3);
  fitnessSlider.position(heightOfSketch * wSketchNumber + 40, 420);

  for (let i = 0; i < wSketchNumber; i++) {
    for (let j = 0; j < hSketchNumber; j++) {
      cars[i][j] = new Car(i, j);
      foods[i][j] = new Food(i, j);
    }
  }
  genCars = new GenerationCar();
  genFoods = new GenerationFood();
  frameRate(10);

}


function draw() {
  for (let n = 0; n < timeSlider.value(); n++) {


    for (let i = 0; i < wSketchNumber; i++) {
      for (let j = 0; j < hSketchNumber; j++) {
        if (!cars[i][j].isDead()) {
          foods[i][j].think();
          foods[i][j].update();
          cars[i][j].think();
          cars[i][j].scoreIncreaser();
          cars[i][j].update();
        } else if (!cars[i][j].disposed) {
          genCars.savedCreatures.push(cars[i][j]);
          genFoods.savedCreatures.push(foods[i][j]);
          cars[i][j].disposed = true;
          foods[i][j].disposed = true;
        }
      }
    }

    if (genCars.savedCreatures.length === genCars.population) {
      genCars.nextGeneration();
      genFoods.nextGeneration();
      // for (let i = 0; i < wSketchNumber; i++) {
      //   for (let j = 0; j < hSketchNumber; j++) {
      //     foods[i][j].newLocation();
      //   }
      // }
    }
  }
  background(6);
  printScores();
  for (let i = 0; i < wSketchNumber; i++) {
    for (let j = 0; j < hSketchNumber; j++) {
      if (!cars[i][j].isDead()) {
        foods[i][j].display();
        cars[i][j].display();
      }
    }
  }
  drawGrids();

  textSize(20);
  fill(255);
  textAlign(LEFT);
  strokeWeight(2);
  stroke(0);
  text("Best Score : " + floor(genCars.hightScore),
    heightOfSketch *
    wSketchNumber + 20, 60);
  text("Current BS : " + floor(genCars.currentHightScore),
    heightOfSketch *
    wSketchNumber + 20,
    100);
  text("generation : " + genCars.generation, heightOfSketch *
    wSketchNumber + 20,
    140);
  text("Process Speed : " + timeSlider.value(), heightOfSketch *
    wSketchNumber + 20,
    180);
  text("Mutation Rate  : " + mrSlider.value() + " %", heightOfSketch *
    wSketchNumber + 20,
    280);
  text("fitness Power  : " + fitnessSlider.value(), heightOfSketch *
    wSketchNumber + 20,
    380);
}


// function keyPressed() {
//   let force = cars[0][0].vel.copy();
//
//   if (keyCode === UP_ARROW) {
//     cars[0][0].applyForce(force.normalize().mult(0.1 * heightOfSketch / 400));
//   } else if (keyCode === DOWN_ARROW) {
//     cars[0][0].applyForce(force.rotate(PI).normalize().mult(0.1 *
//       heightOfSketch / 400));
//   } else if (keyCode === RIGHT_ARROW) {
//     cars[0][0].vel.rotate(PI / 12);
//   } else if (keyCode === LEFT_ARROW) {
//     cars[0][0].vel.rotate(-PI / 12);
//   }
// }


function drawGrids() {
  stroke(100, 100, 255);
  strokeWeight(3);
  line(0, hSketchNumber * heightOfSketch - 1, height, hSketchNumber *
    heightOfSketch - 1);
  line(0, 0, 0, height);
  line(0, 0, width, 0);
  line(width - 2, 0, width - 2, height);

  for (let i = 0; i < wSketchNumber; i++) {
    for (let j = 0; j < hSketchNumber; j++) {
      line(0, j * heightOfSketch, heightOfSketch * wSketchNumber, j *
        heightOfSketch);
    }
    line((i + 1) * heightOfSketch, 0, (i + 1) * heightOfSketch, height);
  }
}

function printScores() {
  fill(255, 80);
  noStroke();
  textSize(heightOfSketch / 4);
  textAlign(CENTER);
  for (let i = 0; i < wSketchNumber; i++) {
    for (let j = 0; j < hSketchNumber; j++) {
      text(floor(cars[i][j].score), (i + 0.5) * heightOfSketch, (j + 0.6) *
        heightOfSketch);
    }
  }
}
