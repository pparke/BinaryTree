/*
 * Game state
 * ============================================================================
 *
 *
 */
import Lsystem      from '../objects/Lsystem';
import Score        from '../objects/Score';
import RuleDisplay  from '../objects/RuleDisplay';
import Tree         from '../objects/Tree';
import PowerUp      from '../objects/PowerUp';

export default class Game extends Phaser.State {

  init (rule) {
    this.left         = null;
    this.right        = null;
    this.leftTime     = null;
    this.rightTime    = null;
    this.leftDown     = false;
    this.rightDown    = false;
    this.lsystem      = null;
    this.score        = null;
    this.frame        = null;
    this.clock        = null;
    this.score        = null;
    this.tree         = null;
    this.outOfBounds  = false;
    this.rule         = rule;
    this.running      = false;
  }

  create () {

    this.game.physics.startSystem(Phaser.Physics.ARCADE);

    this.lsystem      = new Lsystem();
    this.score        = new Score(this.game, 0);
    this.ruleDisplay  = new RuleDisplay(this.game, 120, 20);
    this.tree         = new Tree(this.game, this.game.width/2, this.game.height - 10);

    if (this.rule) {
      this.lsystem.setRule('0', this.rule);
    }
    // rule display
    this.ruleDisplay.addRule(this.lsystem.rules['0'].split(''));
    this.ruleDisplay.events.onRuleUpdate.add(function (rule) {
      console.log('Rule Updated', rule);
      this.lsystem.setRule(0, rule);

    }, this);

    // sound
    this.sounds = {};
    this.sounds.end = this.game.add.audio('end1');
    // clock

    const { centerX: x, centerY: y } = this.world;

    // load images
    this.frame = this.add.sprite(0, 0, 'frame');

    this.tree.events.onOutOfBounds.add(function (position) {
      this.outOfBounds = true;
      this.frame.loadTexture('frame-red');
      this.endText.revive();
      this.sounds.end.play();
    }, this);

    // collision
    this.collisionGroup = this.game.add.physicsGroup();
    for (let i = 0; i < 50; i++) {
      let power = new PowerUp(this.game, this.game.rnd.between(50, 590), this.game.rnd.between(100, 430), 'power1');
      power.animations.add('pulse');
      power.animations.play('pulse', 3, true);
      this.collisionGroup.add(power);
    }

    this.createEndText();

    // input
    this.input.onDown.add(this.begin, this);

    this.input.keyboard.onDownCallback = this.keydown.bind(this);
    this.input.keyboard.onUpCallback = this.keyup.bind(this);

    this.left = this.input.keyboard.addKey(Phaser.Keyboard.J);
    this.right = this.input.keyboard.addKey(Phaser.Keyboard.K);

  }

  update () {
    // if the key is being held down, perform scroll action
    if (!this.running) {
      if (this.left.isDown && !this.left.downDuration(250)) {
        this.ruleDisplay.moveCursor(-1, 0);
      }
      else if (this.right.isDown && !this.right.downDuration(250)) {
        this.ruleDisplay.moveCursor(1, 0);
      }
    }

    // collision
    if (this.game.physics.arcade.overlap(this.tree.stalk, this.collisionGroup, PowerUp.collisionHandler)) {
      this.score.add(10);
    }
    if (this.game.physics.arcade.overlap(this.tree.leaf, this.collisionGroup, PowerUp.collisionHandler)) {
      this.score.add(10);
    }
  }

  render () {
    /*
    this.game.debug.body(this.tree.stalk);
    this.game.debug.body(this.tree.leaf);
    this.collisionGroup.forEachAlive(function (member) {
      this.game.debug.body(member);
    }, this);
    */
    /*
    this.game.debug.text( 'Angle: ' + this.tree.currentAngle, 50, 100 );
    this.game.debug.text( '--> ' + this.tree.endAngle, 200, 100 );
    this.game.debug.text( `X: ${this.tree.currentPosition.x} Y: ${this.tree.currentPosition.y}`, 50, 120 );
    this.game.debug.text( `--> X: ${this.tree.currentPosition.x} Y: ${this.tree.endPosition.y}`, 200, 120 );
    this.game.debug.text( `Symbol: ${this.tree.axiom[this.tree.position-1]}`, 50, 140);
    this.game.debug.text( `Axiom: ${this.lsystem.axiom}`, 50, 160);
    */
  }

  //---------------------------------------------------------------------------

  /**
   * Keydown
   * Sets the down and time properties for either key if
   * they are not already pressed
   */
  keydown (e) {

    if (e.keyCode === Phaser.Keyboard.J && !this.leftDown) {
      this.leftDown = true;
      this.leftTime = this.game.time.now;
    }
    else if (e.keyCode === Phaser.Keyboard.K && !this.rightDown) {
      this.rightDown = true;
      this.rightTime = this.game.time.now;
    }
  }

  /**
   * Keyup
   * Checks if the key was released quickly after it had been
   * pressed.
   */
  keyup (e) {
    if (this.outOfBounds) {
      this.restart();
    }
    if (this.running) {
      return;
    }
    let now = this.game.time.now;
    if (e.keyCode === Phaser.Keyboard.J) {
      this.leftDown = false;
      if (now - this.leftTime < 250) {
        console.log('quick left')
        this.ruleDisplay.updateRule(-1);
      }
    }
    else if (e.keyCode === Phaser.Keyboard.K) {
      this.rightDown = false;
      if (now - this.rightTime < 250) {
        console.log('quick right')
        this.ruleDisplay.updateRule(1);
      }
    }
    else if (e.keyCode === Phaser.Keyboard.SPACEBAR) {
      this.begin();
    }
  }

  createEndText () {
    this.endText = this.game.add.text(0, this.game.height/2.5, 'Out of Bounds');
    this.endText.smoothed = false;
    this.endText.font = 'VT323';
    this.endText.fontSize = '46px';
    this.endText.fill = '#8f0000';
    this.endText.x = this.game.width/2 - this.endText.width/2;
    this.endText.kill();
  }

  begin () {
    if (this.outOfBounds) {
      this.restart();
    }
    if (this.running) {
      return;
    }
    this.running = true;
    this.lsystem.iterate();
    this.lsystem.iterate();
    this.lsystem.iterate();
    // tree
    this.tree.axiom = this.lsystem.axiom;
    this.tree.start();
  }

  restart () {
    this.game.state.start('Game', true, false, this.lsystem.rules['0']);
  }

}
