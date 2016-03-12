// ??List the game levels
const LEVELS = {
  0: 'LevelTemplate',
  1: 'Level1',
  2: 'Level2',
  3: 'Level3'
};

// List the map layers
/*
enum Layers {
      Actors = 0,
      World = 1
     };
     */
enum Layers {
      World = 0,
      Actors = 1,
     };

enum Tiles {
      Empty = -1,
        Wall = 0,
        Floor = 1,
        Target = 2,
        Crate = 3, // 木箱
        Start = 4,
        Packet = 5
     };

// Game level won flag
var isLevelWon:boolean = false;

// Current Level, Start Level 1
var levelCount:number = 1;

// Number of level, checked when game awake
var levelMax:number;

// Set new player position to map origin
var playerPosition = new Sup.Math.Vector2(0, 0);

namespace Game {
  export function getMaxLevel() {
    levelMax = 0;
    // Add one for each level in LEVELS
    for (let level in LEVELS) {
      levelMax++;
    }
  }
  
  export function getPosition(level: Sup.TileMap) {
    /*
    Scan the 16/12 level in order to:
    - Set the playerPosition vector from the Start tiel position on Actor layer.
    - Change the Start tile by an empty tile (the Player Sprite will come instead)
    */
    Sup.log("getPosition");
    
    // Set the variable to default
    playerPosition.x = 0;
    playerPosition.y = 0;
    
    for (let row = 0; row < 12; row++) {
      for (let column = 0; column < 16; column++) {
        // get the tile on Actors layer for x = column and y = row positions
        let actorTile = level.getTileAt(Layers.Actors, column, row);
        if (actorTile === Tiles.Start) {
          // remote the Start tile and replace with empty tile
          level.setTileAt(Layers.Actors, column, row, Tiles.Empty);
          // set position to x,y on level map
          playerPosition.add(column, row);
          Sup.log(playerPosition);
        }
      }
    }
  }
}

// Call the getMaxLevel function when game is launched.
Game.getMaxLevel();