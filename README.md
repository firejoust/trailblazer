<div align="center">
  <h1>Trailblazer</h1>
  <body>
  <img src="https://img.shields.io/npm/v/mineflayer-trailblazer?style=flat-square">
  <img src="https://img.shields.io/github/issues-pr/firejoust/trailblazer?style=flat-square">
  <img src="https://img.shields.io/github/issues/firejoust/trailblazer?style=flat-square">
  </body>
</div>

### About
#### Features
- Smooth movement towards a goal using A* and steering
- Movement profiles that change based on the terrain
- Avoid hazards such as blocks, entities and coordinates
### Usage
#### Installation
- Install the plugin into your project folder using NPM:
```sh
npm install mineflayer-trailblazer
```
### API
#### Methods
(API Reference)
```js
// returns a promise; resolves when the goal is complete, rejects if it is stopped midway
bot.trailblazer.goto(goal, ...hazards?)

// only for tick function; sets the goal and hazards to avoid internally.
bot.trailblazer.setGoal(goal, ...hazards?)

// applies a tick of movement, updating the path, changing control states and yaw, etc.
bot.trailblazer.tick()

// stops all ongoing movement operations and clears control states (note this will reject the goto promise)
bot.trailblazer.stop(reason?)

// applies a tick of movement, but only returns the yaw.
bot.trailblazer.getYaw()

// returns the control states required to move towards the yaw value
bot.trailblazer.getControls(yaw)

// configures one of the three navigation modules (see configuration below)
bot.trailblazer.configure(category)
```
(Getting from A to B)
- Promise based approach:
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

// complete when within a certain radius of a static position
new Radius(destination, radius)

// complete when within a certain radius of a dynamic position (returned by the callback)
new RadiusCB(callback, radius)

// complete when a certain distance away from a position
new Avoid(position, distance)

// complete when a certain distance away from a changing position (returned by the callback)
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

// applies weight from certain blocks at an offset to the current node
new Block(bot, weight?, offset?, avoid?)
  .weight(number)
  .offset(Vec3)
  .avoid(Object) // key/value object mapping block name (string) to boolean

// applies weight to nodes within a radius of the specified entities
new Entity(weight?, radius?, entities?)
  .weight(number)
  .radius(number)
  .entities(Entity[])

// applies weight to nodes within a radius of the coordinates specified
new Position(weight?, radius?, coordinates?)
  .weight(number)
  .radius(number)
  .coordinates(Vec3[])
```
#### Configuration
- Three primary modules make up the navigation algorithm, being movement, pathfinding, and traversal
- Each module is configurable using a dynamic builder instance created with the `configure` function
- It is recommended to keep one configuration instance (per module) during the lifetime of your program.

(API Reference)
```js
const instance = bot.trailblazer.configure('movement' | 'pathfinder' | 'traversal')
// instance.[etc...]
```
(Movement)
- Changes movement behaviour whilst moving between nodes
- Refer to [mineflayer-movement](https://github.com/firejoust/mineflayer-movement) README for more information
```js
bot.trailblazer.configure('movement')
  .jumpSprint(boolean) // whether to always jump regardless
  .fov(number) // frame of vision used for movement
  .rotations(number) // total rotations used for movement
  .blend(number) // blend used for movement
  .goalHeadless(MovementGoal) // used instead of pathfinding if the path is too small
  .goalGround(MovementGoal) // following a path, on the ground
  .goalAirborne(MovementGoal) // following a path, jumping/falling
  .goalSwimming(MovementGoal) // not following a path, in water
  .goalClimbing(MovementGoal) // following a path, climbing up blocks
```
(Pathfinder)
- Configures the path that the player will take to get to the destination
- Refer to [mineflayer-pathfinder-lite](https://github.com/firejoust/mineflayer-pathfinder-lite) README for more information
```js
bot.trailblazer.configure('pathfinder')
  .avoid(Object) // key/value object mapping block name (string) to boolean
  .depth(number) // maximum depth the pathfinder can descend blocks
  .blocks(number) // how many blocks to check, maximum
  .timeout(number) // how many miliseconds to find a path, maximum
  .minimumNodes(number) // the minimum nodes a path can have before switching to headless mode
```
(Traversal)
- Modifies the requirements needed to get to the next node
```js
bot.trailblazer.configure('traversal')
  .prevision(number) // how many nodes to look ahead
  .radiusXZ(number) // how far within horizontal distance of a node
  .radiusAscent(number) // how far within vertical distance of a node whilst climbing up
  .radiusDescent(number) // how far within vertical distance of a node whilst descending
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
