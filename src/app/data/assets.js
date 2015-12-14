/*
 * The `assets` module
 * ============================================================================
 *
 * Use this module to declare static Phaser Asset Packs, that would be loaded
 * using the `Loader#pack` API.
 *
 * Regarding how the game assets should be declared using this file, refer to
 * the sample `assetPack.json` included in the Phaser package, under
 * `node_modules/phaser/resources/` directory, for a more complete
 * reference.
 *
 */


export default {

  // - Boot Assets ------------------------------------------------------------
  boot: [
    {
      key: 'splash-screen',
      url: 'img/splash-screen.png',
      type: 'image'
    },

    {
      key: 'progress-bar',
      url: 'img/progress-bar.png',
      type: 'image'
    }
  ],

  // - Game assets ------------------------------------------------------------
  game: [
    {
      key: 'phaser',
      url: 'img/phaser.png',
      type: 'image'
    },

    {
      type: 'script',
      key: 'webfonts',
      url: '//ajax.googleapis.com/ajax/libs/webfont/1.4.7/webfont.js'
    },

    {
      key: 'vine-leaf',
      url: 'img/vine-leaf.png',
      type: 'image'
    },

    {
      key: 'vine-stalk',
      url: 'img/vine-stalk.png',
      type: 'image'
    },

    {
      key: 'vine-stalk2',
      url: 'img/vine-stalk2.png',
      type: 'image'
    },

    {
      key: 'frame',
      url: 'img/frame.png',
      type: 'image'
    },

    {
      key: 'frame-red',
      url: 'img/frame-red.png',
      type: 'image'
    },

    {
      key: 'particle01',
      url: 'img/particle01.png',
      type: 'image'
    },

    {
      key: 'cursor',
      url: 'img/cursor.png',
      type: 'image'
    },

    {
      key: 'power1',
      url: 'img/power1.png',
      type: 'spritesheet',
      frameWidth: 16,
      frameHeight: 16,
      frameMax: 3
    },

    {
      'type': 'audio',
      'key': 'end1',
      'urls': ['sound/end1.wav'],
      'autoDecode': true
    },

    {
      'type': 'audio',
      'key': 'grow1',
      'urls': ['sound/grow1.wav'],
      'autoDecode': true
    },

    {
      'type': 'audio',
      'key': 'leaf1',
      'urls': ['sound/leaf1.wav'],
      'autoDecode': true
    },

    {
      'type': 'audio',
      'key': 'pickup1',
      'urls': ['sound/pickup1.wav'],
      'autoDecode': true
    },

    {
      'type': 'audio',
      'key': 'score1',
      'urls': ['sound/score1.wav'],
      'autoDecode': true
    },

    {
      'type': 'audio',
      'key': 'select1',
      'urls': ['sound/select1.wav'],
      'autoDecode': true
    },

    {
      'type': 'audio',
      'key': 'select2',
      'urls': ['sound/select2.wav'],
      'autoDecode': true
    },

    {
      'type': 'audio',
      'key': 'select3',
      'urls': ['sound/select3.wav'],
      'autoDecode': true
    },

    // Example: adding a background music.
    // {
    //   key: 'tune',
    //   type: 'audio',
    //   urls: [ 'tune.oga', 'tune.m4a' ]
    // }

    // Example: adding a audio sprite containing sound effects.
    // {
    //   key: 'sfx',
    //   type: 'audiosprite',
    //   urls: [ 'sfx.m4a' ],
    //   jsonURL: 'sfx.json'
    // }
  ]

};
