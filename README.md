# ChalkBox
> one of the best colors modules out there.
it does not extend string prototype and is 10x engineered. it uses commonjs and not esm.

## get color and style in your node.js console
(which is cool)
![Demo](https://raw.githubusercontent.com/tj-commits/chalkbox/master/screenshots/colors.png)

## Installation

    npm install chalkbox

## colors and styles!

### text colors

  - black
  - red
  - green
  - yellow
  - blue
  - magenta
  - cyan
  - white
  - gray
  - grey

### bright text colors

  - brightRed
  - brightGreen
  - brightYellow
  - brightBlue
  - brightMagenta
  - brightCyan
  - brightWhite

### background colors

  - bgBlack
  - bgRed
  - bgGreen
  - bgYellow
  - bgBlue
  - bgMagenta
  - bgCyan
  - bgWhite
  - bgGray
  - bgGrey

### bright background colors

  - bgBrightRed
  - bgBrightGreen
  - bgBrightYellow
  - bgBrightBlue
  - bgBrightMagenta
  - bgBrightCyan
  - bgBrightWhite

### styles

  - reset
  - bold
  - dim
  - italic
  - underline
  - inverse
  - hidden
  - strikethrough

### extras

  - rainbow
  - zebra
  - america
  - trap
  - random

## Usage

```js
const chalkbox = require('chalkbox');
const log = require('logtoconsole').log;

log(chalkbox.green('hello')); // outputs green text
log(chalkbox.red.underline('i like cake and pies')); // outputs red underlined text
log(chalkbox.inverse('inverse the color')); // inverses the color
log(chalkbox.rainbow('OMG Rainbows!')); // rainbow
log(chalkbox.trap('Run the trap')); // Drops the bass

```

## Enabling/Disabling Colors

The package will auto-detect whether your terminal can use colors and enable/disable accordingly. When colors are disabled, the color functions do nothing. You can override this with a command-line flag:

```bash
node myapp.js --no-color
node myapp.js --color=false

node myapp.js --color
node myapp.js --color=true
node myapp.js --color=always

FORCE_COLOR=1 node myapp.js
```

Or in code:

```javascript
var chalkbox = require('chalkbox');
chalkbox.enable();
chalkbox.disable();
```

## Custom themes

```js
var chalkbox = require('chalkbox');
var log = require('logtoconsole').log;

// set single property
var error = chalkbox.red;
error('this is red');

// set theme
chalkbox.setTheme({
  silly: 'rainbow',
  input: 'grey',
  verbose: 'cyan',
  prompt: 'grey',
  info: 'green',
  data: 'grey',
  help: 'cyan',
  warn: 'yellow',
  debug: 'blue',
  error: 'red'
});

// outputs red text
log(chalkbox.error("this is an error"));

// outputs yellow text
log(chalkbox.warn("this is a warning"));

```

### Combining Colors

```javascript
var chalkbox = require('chalkbox');

chalkbox.setTheme({
  custom: ['red', 'underline']
});

console.log(chalkbox.custom('test'));
```

*Protip: There is a secret undocumented style in `chalkbox`. If you find the style you can summon him.*
