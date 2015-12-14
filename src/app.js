/*
 * The `app` module
 * ============================================================================
 *
 * The module providing the main routine of the game application launch.
 */

// Import all declared states as an object.
import * as states from './app/states';
import webfonts from './app/data/webfonts';


export function init () {
  const game = new Phaser.Game(640, 480, Phaser.CANVAS);

  // WebFontConfig must exist on the global scope
  window.WebFontConfig = {
    //  the 'active' callback is triggered when all fonts have finished loading
    //  We set a 1 second delay before setting game.webfontsLoaded to true.
    //  For some reason if we don't the browser cannot render the text the first time it's created.
    active: function() {
      game.time.events.add(Phaser.Timer.SECOND, function () {
        game.webfontsLoaded = true;
      }, this);
    },

    //  The Google Fonts we want to load, specified in app/data/webfonts.js
    google: webfonts
  };

  // Dynamically add all required game states.
  Object.keys(states).forEach((key) => game.state.add(key, states[key]));

  game.state.start('Boot');

  return game;
}
