/*
 * RuleDisplay
 * ============================================================================
 *
 *
 */


class RuleDisplay {
  constructor (game, x, y, ... args) {
    this.game       = game;
    this.rules      = [];
    this.displays   = [];
    this.symbolList = ['0', '1', '-', '+', '[', ']', ' '];
    this.x          = x;
    this.y          = y;
    this.spacing    = 15;
    this.yOffset    = 0;
    this.cursorPos  = { display: 0, column: 0 };
    this.cursor     = null;
    this.lastMove   = 0;
    this.repeatTime = 200;

    this.sounds = {};
    this.sounds.select1 = this.game.add.audio('select3');
    this.sounds.select2 = this.game.add.audio('select2');

    this.events = {
      onRuleUpdate: new Phaser.Signal()
    };

    this.createCursor();
  }

  addRule (rule) {
    this.rules.push(rule);
    let display = this.game.add.group();
    display.x = this.x;
    display.y = this.y + this.yOffset;
    // create a text sprite for each of the symbols in the rule
    rule.forEach((elem, i) => {
      let x = i * this.spacing;
      let symbol = this.game.add.text(x, 0, elem);
      symbol.smoothed = false;
      symbol.font = 'VT323';
      symbol.fontSize = '24px';
      symbol.fill = '#00ff00';
      display.add(symbol);
    });

    this.yOffset += display.height + 10;
    this.displays.push(display);
    this.updateCursor();
  }

  updateRule (dir) {
    this.sounds.select2.play();
    let currentSymbol = this.displays[this.cursorPos.display].getChildAt(this.cursorPos.column);
    let pos = this.symbolList.indexOf(currentSymbol.text);
    pos += dir;
    if (pos < 0) {
      pos = this.symbolList.length - 1;
    }
    else if (pos > this.symbolList.length - 1) {
      pos = 0;
    }
    this.rules[this.cursorPos.display][this.cursorPos.column] = this.symbolList[pos];
    currentSymbol.text = this.symbolList[pos];
    // dispath a onRuleUpdate event
    this.events.onRuleUpdate.dispatch(this.rules[this.cursorPos.display].join(''));
  }

  createCursor () {
    this.cursor = this.game.add.sprite(this.x, this.y, 'cursor');
    this.cursor.anchor.set(0.5, 0.8);
  }

  updateCursor () {
    let display = this.displays[this.cursorPos.display];
    if (!display) { return; }
    let symbol = display.getChildAt(this.cursorPos.column);
    if (!symbol) { return; }
    this.cursor.x = display.x + symbol.x + symbol.width/2 + 2;
    this.cursor.y = display.y + symbol.y;
  }

  moveCursor (x, y) {
    let now = this.game.time.now;
    if (now - this.lastMove < this.repeatTime) {
      return;
    }

    this.sounds.select1.play();

    this.lastMove = now;

    if (y) {
      this.cursorPos.display += y;
      if (this.cursorPos.display < 0) {
        this.cursorPos.display = this.displays.length - 1;
      }
      else if (this.cursorPos.display > this.displays.length) {
        this.cursorPos.display = 0;
      }
    }
    if (x) {
      this.cursorPos.column += x;
      if (this.cursorPos.column < 0) {
        this.cursorPos.column = this.displays[this.cursorPos.display].total - 1;
      }
      else if (this.cursorPos.column > this.displays[this.cursorPos.display].total - 1) {
        this.cursorPos.column = 0;
      }
    }
    this.updateCursor();
  }


}


export default RuleDisplay;
