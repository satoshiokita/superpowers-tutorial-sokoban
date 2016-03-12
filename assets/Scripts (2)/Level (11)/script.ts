class LevelBehavior extends Sup.Behavior {
  level = this.actor.tileMapRenderer;

  awake() {
    Sup.log("LevelBehavior awake");
    // set Level actor to the current level map path.
    this.level.setTileMap("Levels/" + LEVELS[levelCount]);
    // call the getPositions function with the current tile map as parameter.
    Game.getPosition(this.level.getTileMap());
  }

  update() {
    
  }
}
Sup.registerBehavior(LevelBehavior);
