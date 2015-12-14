/*
 * PowerUp
 * @extends Phaser.Sprite
 * ============================================================================
 *
 *
 */


class PowerUp extends Phaser.Sprite {
  constructor (game, ... args) {
    super(game, ... args);
    this.sounds = {};
    this.sounds.pickup = this.game.add.audio('pickup1');
  }

  static collisionHandler (sprite, self) {
    self.kill();
    self.sounds.pickup.play();
  }

}


export default PowerUp;
