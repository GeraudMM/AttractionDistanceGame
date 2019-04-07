# AttractionDistanceGame
In this project, we use NeuroEvolution to train 2 different agents. The first one wants to reach the second one who is trying to escape.

## Environment

In this project we train multiple neural networks to play AttractionDistance Game. At each generation we choose the Agents that performed the better for each hunter and hunted and mutate them a little in order to converge to optimal neural networks.
The goal for the hunter is to reach as many hunted agent as possible and the goal for the hunted is to escape the hunter.
The episode ends when all the hunter are dead or after 120 secondes. The hunter die if it hit a wall or reach no one for 15 secondes.

For both Agents, the four actions are : 
- `0` - Applies a force forward
- `1` - Apllies a force backward
- `3` - Turn a bit to the left
- `4` - Turn a bit to the right

#### Trained Agents
For each generation we train multiple agents simultaneously. Here we have 8*10 training in the same time.
The purple ones are the Hunter and the green ones are the hunted. When a hunted is reach, it pop in an other location of its cell.
![](https://github.com/GeraudMM/AttractionDistanceGame/blob/master/AttractionDistanceGame.png)

During an episode of training, we have 8*10*2 agents trying to stay alive. Once the generation ends, we choose the bests ones in both sides and duplicate them with a genetic algorithm that provide mutation on the neurals networks. 
Finally, after many selection and mutation we succed to have interresting behaviour between the two agents. The hunted learn to fool the hunter by turning arround him instead of run away from it.

## Installing

In order to run this simulation, you'll have to download Atom, sublim text or visual studio. Thanks to an HTMl file provided in the folder, you would be able to run it in your browser (you should use chrome for more efficiency).
I recomand you to go with [Atom](https://atom.io/) as you can directly download the Atom-live-server packages to lauch your projects locally on your browser.


This project was made thanks to Daniel shifman's tutorials on NeuroEvolution on YouTube.

