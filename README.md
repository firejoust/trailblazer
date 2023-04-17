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
### API
#### Methods
(API Reference)
```js
bot.trailblazer.goto(goal, ...hazards?)

bot.trailblazer.setGoal(goal, ...hazards?)

bot.trailblazer.tick()

bot.trailblazer.stop(reason?)

bot.trailblazer.getYaw()

bot.trailblazer.getControls()

bot.trailblazer.configure(category)
```
(Getting from A to B)
- Promise based approach: (example)
```js
bot.once("spawn", async function init() {
  await bot.trailblazer.goto(goal, ...hazards?)
  bot.chat("Arrived at goal")
})
```
- Tick/loop based approach:
```js
bot.on("physicsTick", function tick() {
  bot.trailblazer.setGoal(goal, ...hazards?)
  bot.trailblazer.tick()
})
```
#### Goals
(API Reference)
```js
const { Radius, RadiusCB, Avoid, AvoidCB } = require("mineflayer-trailblazer").goals

new Radius(destination, radius)

new RadiusCB(callback, radius)

new Avoid(position, distance)

new AvoidCB(callback, distance)
```
(Static goals)
- Static goals only set a position once and don't update dynamically (unless using a tick/loop approach)
```js
const { Radius } = require("mineflayer-trailblazer").goals

bot.once("spawn", async function init() {
  const entity = bot.nearestEntity(entity => entity.type === "player")
  const goal = new Radius(entity.position) // entity.position will not update if the entity moves somewhere else
  await bot.trailblazer.goto(goal)
})
```
(Dynamic goals)
- Dynamic goals use a callback function to query a position, allowing it to change during operation
```js
const { RadiusCB } = require("mineflayer-trailblazer").goals

bot.once("spawn", async function init() {
  const entity = bot.nearestEntity(entity => entity.type === "player")
  const goal = new RadiusCB(() => entity.position) // callback will always return the updated position
  await bot.trailblazer.goto(goal)
})
```
#### Hazards
- Hazards change the cost of travelling to a node if certain conditions are met.
- All hazards have `weight`, which acts as a final multplier on the cost by `1 + weight`
- An instance of a hazard can be updated dynamically using Setters (see below)

(API Reference)
```js
const { Block, Entity, Position } = require("mineflayer-trailblazer").hazards

new Block(bot, weight?, offset?, avoid?)
  .weight(number)
  .offset(Vec3)
  .avoid(Object)

new Entity(weight?, radius?, entities?)
  .weight(number)
  .radius(number)
  .entities(Entity[])

new Position(weight?, radius?, coordinates?)
  .weight(number)
  .radius(number)
  .coordinates(Vec3[])
```
#### Configuration
(Movement)
```js
bot.trailblazer.configure('movement')
  .jumpSprint(boolean)
  .fov(number)
  .rotations(number)
  .blend(number)
  .goalHeadless(MovementGoal)
  .goalGround(MovementGoal)
  .goalAirborne(MovementGoal)
  .goalSwimming(MovementGoal)
  .goalClimbing(MovementGoal)
```
(Pathfinder)
```js

```
(Traversal)
```js
```
#### Examples
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
