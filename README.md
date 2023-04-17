### About
#### Features
- Smooth movement towards a goal using A* and steering
- Movement profiles that change based on the terrain
- Avoid hazards such as blocks, entities and coordinates
### Usage
#### Installation
- Install the plugin into your project folder using NPM:
```sh
npm install trailblazer
```
#### API
##### Example
```js
const mineflayer = require("mineflayer")
const trailblazer = require("trailblazer").plugin

const bot = mineflayer.createBot()

const { RadiusCB } = require("trailblazer").goals
const { Entity } = require("trailblazer").hazards

bot.once("spawn", async function init() {
  const entity = bot.nearestEntity(entity => entity.type === "player")
  
  if (entity) {
    const goal = new RadiusCB(() => entity.position, 3) // use callback to dynamically update position
    const hazard = new Entity(1, 5) // cost multiplier: +100%, radius: 5
      .entities(Object.values(bot.entities).filter(entity => entity.type === "mob"))
      
    await bot.trailblazer.goto(goal, hazard)
    bot.chat("Arrived")
    return
  }
  
  bot.chat("I can't see anyone!")
})
```
