/*
 * Score
 * ============================================================================
 *
 *
 */


class Score {
  constructor (game, value, ... args) {
    this.game     = game;
    this.value    = value;
    this.target   = value;
    this.x        = 20;
    this.y        = 20;
    this.timer    = this.game.time.create(false);
    this.label    = '𐇲 ';
    this.display = this.game.add.text(this.x, this.y, '');
    this.emitter  = this.game.add.emitter(this.x, this.y + this.display.height/4, 200);

    this.sounds = {};
    this.sounds.score = this.game.add.audio('score1');

    // display
    this.updateText();
    this.display.smoothed = false;
    this.display.font = 'VT323';
    this.display.fontSize = '24px';
    this.display.fill = '#00ff00';
    // timer
    this.timer.loop(250, this.changeScore, this);
    this.timer.start();
    this.timer.pause();
    // emitter
    this.emitter.width = 10;
    this.emitter.makeParticles('particle01');
    this.emitter.minParticleSpeed.set(-60, -60);
    this.emitter.maxParticleSpeed.set(60, 60);
    this.emitter.setRotation(0, 1);
    this.emitter.setAlpha(0.8, 1);
    this.emitter.setScale(1, 1, 2, 2);
    this.emitter.gravity = 100;
  }

  changeScore () {
    if (this.value === this.target) {
      this.timer.pause();
    }
    // TODO play a sound and use particle effect
    this.sounds.score.play();
    let diff = this.target - this.value;
    let sign = Math.sign(diff);
    this.value += sign;

    this.updateText();
    this.emitter.x = this.x + this.display.width - 10;
    this.emitter.start(true, 500, null, 20);
  }

  updateText () {
    this.display.text = this.label + this.value;
  }

  add (amt) {
    this.target += amt;
    if (this.timer.paused) {
      this.timer.resume();
    }
  }

  remove (amt) {
    this.target -= amt;
    if (this.timer.paused) {
      this.timer.resume();
    }
  }

}


export default Score;
