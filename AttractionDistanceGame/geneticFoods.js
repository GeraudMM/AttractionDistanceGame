class GenerationFood {

  constructor() {
    this.generation = 1;
    this.population = wSketchNumber * hSketchNumber;
    this.currentHightScore = 0;
    this.hightScore = 0;
    this.avgScore = 0;
    this.totalScore = 0;
    this.savedCreatures = [];
  }

  nextGeneration() {
    this.generation++;
    //console.log("generation num : "+this.generation);
    this.calculateFitness();
    for (let i = 0; i < wSketchNumber; i++) {
      for (let j = 0; j < hSketchNumber; j++) {
        foods[i][j] = this.pickOne(i, j);
      }
    }
    this.savedCreatures = [];
  }

  pickOne(i, j) {

    var index = 0;
    var r = random(1);

    while (r > 0) {
      r = r - this.savedCreatures[index].fitness;
      index++;
    }
    index--;
    let creature = this.savedCreatures[index];
    let child = new Food(i, j, creature.brain);
    child.mutate(mrSlider.value() / 100);
    return child;
  }

  calculateFitness() {
    let sum = 0;
    let bestCreature = this.savedCreatures[0];
    for (let creature of this.savedCreatures) {
      if (creature.score < 0) {
        creature.score = 0;
      }
      sum += pow(creature.score, fitnessSlider.value());
      if (creature.score > bestCreature.score) {
        bestCreature = creature;
      }
    }
    this.currentHightScore = bestCreature.score;
    if (this.currentHightScore > this.hightScore) {
      this.hightScore = this.currentHightScore;
    }
    for (let creature of this.savedCreatures) {
      creature.fitness = pow(creature.score, fitnessSlider.value()) / sum;
    }
  }
}
