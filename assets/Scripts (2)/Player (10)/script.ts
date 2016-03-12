class PlayerBehavior extends Sup.Behavior {
  awake() {
    Sup.log("PlayerBehavior: awake");
  }
  
  start() {
    Sup.log("PlayerBehavior: start");
    // set position of Player actor to the playerPosition 2D vector
    this.actor.setPosition(playerPosition);
  }
  
  move(x, y) {
    /*
    We update the future position of the player and start to check condition :
    - (1) if the next tile is an empty floor, the player can move, canMove is true
    - (2) else, canMove is false
    - (3) if the next tile is a box, then we check a second branch of condition :
        - (4) if the the next tile after the box tile is an empty floor, the player can push the box
        - (5) else, canMove is false
    - (6) if canMove is true, then we update the SpriteRenderer of the Player Actor to the new position
    - (7) else, we take back the previous coordinates for the player position
    */
    let canMove:boolean;
    
    // Set to new coordinates.
    playerPosition.add(x, y);
    
    // We get the tiles index for each layer of the map from the new coorinates.
    let level = Sup.getActor("Level").tileMapRenderer.getTileMap();
    let tileWorld = level.getTileAt(Layers.World, playerPosition.x, playerPosition.y);
    let tileActors = level.getTileAt(Layers.Actors, playerPosition.x, playerPosition.y);
    
    if (tileWorld === Tiles.Floor || tileWorld == Tiles.Target) {
      canMove = true;
      if (tileActors == Tiles.Crate || tileActors == Tiles.Packet) { // if new position has a box.
        let nextWorldTile = level.getTileAt(Layers.World, playerPosition.x + x, playerPosition.y + y);
        let nextActorsTile = level.getTileAt(Layers.Actors, playerPosition.x + x, playerPosition.y + y);
        if (nextWorldTile == Tiles.Floor && nextActorsTile == Tiles.Empty) {
          // move create to next.
          level.setTileAt(Layers.Actors, playerPosition.x, playerPosition.y, Tiles.Empty);
          level.setTileAt(Layers.Actors, playerPosition.x + x, playerPosition.y + y, Tiles.Crate);
        } else if (nextWorldTile == Tiles.Target && nextActorsTile == Tiles.Empty) {
          // move create to next and this box become a packet.
          level.setTileAt(Layers.Actors, playerPosition.x, playerPosition.y, Tiles.Empty);
          level.setTileAt(Layers.Actors, playerPosition.x + x, playerPosition.y + y, Tiles.Packet);          
        } else {
          canMove = false;
        }
      }
    } else {
      canMove = false;
    }
    
    if (canMove) {
      // We update the Player Actor iwth the new playerPosition vector coordinate
      this.actor.setPosition(playerPosition.x, playerPosition.y);
    } else {
      // blocked, return to previous value
      playerPosition.subtract(x, y);
    }
  }

  update() {
    // if the level is NOT won, the player have control
    if (!isLevelWon) {
      if (Sup.Input.wasKeyJustPressed("UP")) {
        this.move(0, 1);
        this.actor.spriteRenderer.setAnimation('up');
      } else if (Sup.Input.wasKeyJustPressed("DOWN")) {
        this.move(0, -1);
        this.actor.spriteRenderer.setAnimation('down');
      } else if (Sup.Input.wasKeyJustPressed("LEFT")) {
        this.move(-1, 0);
        this.actor.spriteRenderer.setAnimation('left');
      } else if (Sup.Input.wasKeyJustPressed("RIGHT")) {
        this.move(1, 0);
        this.actor.spriteRenderer.setAnimation('right');
      }
    }
  }
}
Sup.registerBehavior(PlayerBehavior);
