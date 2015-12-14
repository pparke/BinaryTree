/*
 * Tree
 * ============================================================================
 *
 *
 */


class Tree {
  constructor (game, x, y, ... args) {

    this.game             = game;
    this.stalk            = null;
    this.leaf             = null;
    this.bitmap           = null;

    this.constants = {
      '[': this.push.bind(this),
      ']': this.pop.bind(this),
      '+': this.turn.bind(this, 1),
      '-': this.turn.bind(this, -1)
    };

    this.rules = {
      '0': this.drawLeaf.bind(this),
      '1': this.forward.bind(this)
    };
    this.currentAngle     = 270;
    this.endAngle         = 270;
    this.angle            = 25;
    this.scale            = 1;
    this.drawLength       = 30;
    this.leafSide         = 1;
    this.leafDistance     = 8;
    this.stack            = [];
    this.position         = 0;
    this.currentPosition  = new Phaser.Point(x, y);
    this.endPosition      = new Phaser.Point(x, y);
    this.iterations       = 6;
    this.growTimer        = this.game.time.create(false);
    this.drawTimer        = null;
    this.speed            = 20;
    this.segments         = 10;

    this.events = {
      onOutOfBounds: new Phaser.Signal()
    };

    // timer
    this.growTimer.loop(this.speed*this.segments, this.grow, this);
    this.growTimer.start();
    this.growTimer.pause();

    this.stalk = this.game.add.sprite(-40, -40, 'vine-stalk2');
    this.stalk.anchor.set(0.5, 0.5);
    this.game.physics.arcade.enable(this.stalk);

    this.leaf = this.game.add.sprite(-40, -40, 'vine-leaf');
    this.leaf.anchor.set(1, 0.5);
    this.game.physics.arcade.enable(this.leaf);
    this.leaf.visible = false;

    this.bitmap = this.game.add.bitmapData(this.game.width, this.game.height);
    this.bitmap.addToWorld();
    this.bitmap.smoothed = false;

    // sound
    this.sounds = {};
    this.sounds.grow = this.game.add.audio('grow1');
    this.sounds.leaf = this.game.add.audio('leaf1');
  }

  set axiom (str) {
    this._axiom = str.split('');
  }

  get axiom () {
    return this._axiom;
  }

  start () {
    this.position = 0;
    this.resume();
  }

  resume () {
    this.growTimer.resume();
  }

  pause () {
    this.growTimer.pause();
  }

  grow () {
    if (this.position >= this.axiom.length) {
      this.growTimer.pause();
      return;
    }
    if (!this.drawing) {
      this.step();
    }
  }

  /**
   * Step
   * Performs one action of the axiom at a time.
   */
  step () {
    let symbol = this.axiom[this.position];
    // perform the action associated with the rule
    if (this.rules[symbol]) {
      this.rules[symbol]();
    }
    // if it is a constant, call the associated method
    else if (this.constants[symbol]) {
      this.constants[symbol]();
    }

    this.position += 1;
  }

  turtle () {
    let rotation = (this.endAngle - this.currentAngle)/this.segments;
    let distance = Phaser.Math.distance(this.currentPosition.x, this.currentPosition.y, this.endPosition.x, this.endPosition.y)/this.segments;
    this.drawing = true;
    this.sounds.grow.play();
    let count = 1;
    this.game.time.events.repeat(this.speed, this.segments, function () {
      this.advance(rotation, distance, this.segments - count);
      this.drawStalk();
      count += 1;
      if (count >= 10) {
        this.drawing = false;
      }
    }, this);
  }

  /**
   * Advance
   * Advances the draw position
   */
  advance (rotation, distance, remaining) {
    let angle = this.currentAngle + rotation;
    let movement = this.polarToCart(distance, angle);

    if (this.currentPosition.x < 10 || this.currentPosition.x > this.game.width - 10) {
      this.pause();
      this.events.onOutOfBounds.dispatch(this.currentPosition);
    }
    if (this.currentPosition.y < 10 || this.currentPosition.y > this.game.height - 10) {
      this.pause();
      this.events.onOutOfBounds.dispatch(this.currentPosition);
    }
    /*
    let count = 0;
    while (this.endPosition.x + (movement.x * remaining) < 10 && count < 360) {
      console.log('turning!', this.endPosition.x + movement.x)
      count += 1;
      this.angle += 1;
      movement = this.polarToCart(distance, angle);
    }
    */

    this.currentAngle += rotation;
    this.currentPosition.x += movement.x;
    this.currentPosition.y += movement.y;
  }

  /**
   * Forward
   * Move the end position forward by the draw length and at the end angle
   */
  forward () {
    let distance = this.drawLength * this.scale;
    let movement = this.polarToCart(distance, this.endAngle);

    this.endPosition.x += movement.x;
    this.endPosition.y += movement.y;
    this.scale -= 0.05;
    if (this.scale < 0.3) {
      this.scale = 0.3;
    }
    this.turtle();
  }

  /**
   * Draw Stalk
   * Updates the current draw position and draws the stalk
   */
  drawStalk () {
    this.stalk.rotation = Phaser.Math.degToRad(this.currentAngle);
    this.stalk.scale.x = this.scale;
    this.stalk.scale.y = this.scale;
    // move to the current location so that we can check for collision
    this.stalk.position.x = this.currentPosition.x;
    this.stalk.position.y = this.currentPosition.y;
    this.bitmap.draw(this.stalk, this.currentPosition.x, this.currentPosition.y);
  }

  /**
   * Draw Leaf
   */
  drawLeaf () {
    this.leaf.rotation = Phaser.Math.degToRad((this.currentAngle - 270)*this.leafSide);
    let offset = this.leafSide * (this.leafDistance * this.scale);
    this.leaf.scale.x = this.scale * this.leafSide;
    this.leaf.scale.y = this.scale;
    this.leaf.position.x = this.currentPosition.x;
    this.leaf.position.y = this.currentPosition.y;
    // move to the current location so that we can check for collision
    this.leafSide *= -1;
    this.bitmap.draw(this.leaf, this.currentPosition.x - offset, this.currentPosition.y);
    this.sounds.leaf.play();
  }

  /**
   * Push
   * Push the current state onto the stack
   */
  push () {
    this.stack.push({
      currentPosition: this.currentPosition.clone(),
      endPosition: this.endPosition.clone(),
      currentAngle: this.currentAngle,
      endAngle: this.endAngle,
      scale: this.scale
    });
  }

  /**
   * Pop
   * Pop the last state off the stack and restore it
   */
  pop () {
    let state = this.stack.pop();
    if (!state) {
      return;
    }
    this.currentPosition = state.currentPosition;
    this.endPosition = state.endPosition;
    this.currentAngle = state.currentAngle;
    this.endAngle = state.endAngle;
    this.scale = state.scale;
  }

  /**
   * Turn
   * Change the current angle of movement
   */
  turn (sign) {
    this.endAngle += this.angle * sign;
  }

  /**
   * Polar to Cartesian
   * Convert polar coordinates to cartesian.
   */
  polarToCart (radius, angle) {
    angle = Phaser.Math.degToRad(angle);
    let x = Math.round(radius * Math.cos(angle));
    let y = Math.round(radius * Math.sin(angle));
    return new Phaser.Point(x, y);
  }
}


export default Tree;
