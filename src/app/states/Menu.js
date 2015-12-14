/*
 * Menu state
 * @extends Phaser.State
 * ===========================================================================
 *
 * Main menu state
 */


export default class Menu extends Phaser.State {

  init () {
    this.title;
  }

  preload () {

    this.game.stage.setBackgroundColor(0x000900);

    this.title = this.add.text(this.world.centerX, this.world.centerY, ' Binary Tree ');
    this.title.anchor.setTo(0.5);
    this.title.smoothed = false;

    this.title.font = 'VT323';
    this.title.fontSize = '64px';
    this.title.fill = '#008000';

    this.title.align = 'center';

    this.subtitle = this.add.text(this.world.centerX, this.world.centerY + 100, '\u2013 Press Start \u2013');
    this.subtitle.anchor.setTo(0.5);
    this.subtitle.smoothed = false;

    this.subtitle.font = 'VT323';
    this.subtitle.fontSize = '26px';
    this.subtitle.fill = '#008000';

    this.subtitle.align = 'center';
  }

  create () {
    this.input.onTap.add(function () {
      this.state.start('Instructions');
    }, this);

    this.input.keyboard.onDownCallback = () => {
      this.state.start('Instructions');
    };
  }

  update () {
    // TODO: Stub
  }

  render () {
    // TODO: Stub
  }

}
