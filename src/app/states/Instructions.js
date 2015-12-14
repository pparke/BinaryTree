/*
 * Instructions state
 * @extends Phaser.State
 * ===========================================================================
 *
 *
 */


export default class Instructions extends Phaser.State {

  init () {
    // TODO: Stub
  }

  preload () {
    let text = `Use the J and K keys to control both the movement of the cursor on the rules at the top of the screen. \n\nPressing and holding will cause the cursor to scroll. \n\nTapping the keys will change the symbol under the cursor. \n\n1 tells the plant to grow, 0 tells it to sprout a leaf and will also be replaced by the rule on each iteration, - and + decrease and increase the angle of growth. \n\n[ is used to save the current position and angle which can then be retrieved with ]\n\nTry to collect as many flashing stars as possible without growing out of bounds.`;

    let style = {
      wordWrap: true,
      wordWrapWidth: 600
    };
    this.info = this.add.text(30, 30, text, style);
    this.info.smoothed = false;

    this.info.font = 'VT323';
    this.info.fontSize = '20px';
    this.info.fill = '#00a800';
    this.wordWrap = true;
    this.wordWrapWidth = 640;

    this.info.align = 'left';
  }

  create () {
    this.input.onTap.add(function () {
      this.state.start('Game');
    }, this);

    this.input.keyboard.onDownCallback = () => {
      this.state.start('Game');
    };
  }

  update () {
    // TODO: Stub
  }

  render () {
    // TODO: Stub
  }

}
