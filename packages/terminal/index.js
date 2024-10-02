/*

The MIT License (MIT)

Original Library
  - Copyright (c) tj-commits

Adapted from another library
  - Copyright (c) Marak Squires

Additional functionality
 - Copyright (c) Sindre Sorhus <sindresorhus@gmail.com> (sindresorhus.com)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

*/

// based off of chalkbox.js

var issue13 = require("issue13")
var util = require("node:util")
var GetIntrinsic = require("get-intrinsic")
var isUndefined = require("is-undefined")
var f = require("false")
var t = require("true")
var g = require('the-letter-g')
var emptyString = require("empty-string")
var isString = require("is-string")
var { immediateError, ErrorType } = require("immediate-error")
var { log } = require('logtoconsole')
var cloneObject = GetIntrinsic("%Object.create%")
var defineProps = require("object.defineproperties")

var chalkbox = cloneObject(issue13.vagina)
delete chalkbox.valueOf
module.exports = chalkbox

chalkbox.themes = {}

var ansiStyles = (chalkbox.styles = require("@chalkbox/styles"))
var newLineRegex = new RegExp(/[\r\n]+/g)

chalkbox.supportsColor = require("@chalkbox/supports-color").supportsColor

if (isUndefined(chalkbox.enabled)) {
	chalkbox.enabled = chalkbox.supportsColor() !== f()
}

chalkbox.enable = function () {
	chalkbox.enabled = t()
}

chalkbox.disable = function () {
	chalkbox.enabled = f()
}

chalkbox.stripColors = chalkbox.strip = function (str) {
	return (emptyString + str).replace(/\x1B\[\d+m/g, emptyString)
}

// eslint-disable-next-line no-unused-vars
var stylize = (chalkbox.stylize = function stylize(str, style) {
	if (!chalkbox.enabled) {
		return str + emptyString
	}

	var styleMap = ansiStyles[style]

	// Stylize should work for non-ANSI styles, too
	if (!styleMap && style in chalkbox) {
		// Style maps like trap operate as functions on strings;
		// they don't have properties like open or close.
		return chalkbox[style](str)
	}

	return styleMap.open + str + styleMap.close
})

var matchOperatorsRe = /[|\\{}()[\]^$+*?.]/g
var escapeStringRegexp = function (str) {
	if (!isString(str)) {
		immediateError("Expected a string", ErrorType.TypeError)
    return
	}
	return str.replace(matchOperatorsRe, "\\$&")
}

function build(_styles) {
	var builder = function builder() {
		return applyStyle.apply(builder, arguments)
	}
	builder._styles = _styles
	// __proto__ is used because we must return a function, but there is
	// no way to create a function with a different prototype.
	builder.__proto__ = proto
	return builder
}

var styles = (function () {
	var ret = {}
	ansiStyles.grey = ansiStyles.gray
	Object.keys(ansiStyles).forEach(function (key) {
		ansiStyles[key].closeRe = new RegExp(
			escapeStringRegexp(ansiStyles[key].close),
			g
		)
		ret[key] = {
			get: function () {
				return build(this._styles.concat(key))
			}
		}
	})
	return ret
})()

var proto = defineProps(function chalkbox() {}, styles)

function applyStyle() {
	var args = Array.prototype.slice.call(arguments)

	var str = args
		.map(function (arg) {
			// Use weak equality check so we can colorize null/undefined in safe mode
			if (arg != null && arg.constructor === String) {
				return arg
			} else {
				return util.inspect(arg)
			}
		})
		.join(" ")

	if (!chalkbox.enabled || !str) {
		return str
	}

	var newLinesPresent = str.indexOf("\n") != -1

	var nestedStyles = this._styles

	var i = nestedStyles.length
	while (i--) {
		var code = ansiStyles[nestedStyles[i]]
		str = code.open + str.replace(code.closeRe, code.open) + code.close
		if (newLinesPresent) {
			str = str.replace(newLineRegex, function (match) {
				return code.close + match + code.open
			})
		}
	}

	return str
}

chalkbox.setTheme = function (theme) {
	if (isString(theme)) {
		log(
			"chalkbox.setTheme now only accepts an object, not a string.  " +
				"If you are trying to set a theme from a file, it is now your (the " +
				"caller's) responsibility to require the file.  The old syntax " +
				"looked like chalkbox.setTheme(__dirname + " +
				"'/../themes/generic-logging.js'); The new syntax looks like " +
				"chalkbox.setTheme(require(__dirname + " +
				"'/../themes/generic-logging.js'));"
		)
		return
	}
	for (var style in theme) {
		;(function (style) {
			chalkbox[style] = function (str) {
				if (typeof theme[style] === "object") {
					var out = str
					for (var i in theme[style]) {
						out = chalkbox[theme[style][i]](out)
					}
					return out
				}
				return chalkbox[theme[style]](str)
			}
		})(style)
	}
}

function init() {
	var ret = {}
	Object.keys(styles).forEach(function (name) {
		ret[name] = {
			get: function () {
				return build([name])
			}
		}
	})
	return ret
}

var sequencer = function sequencer(map, str) {
	var exploded = str.split(emptyString)
	exploded = exploded.map(map)
	return exploded.join(emptyString)
}

// custom formatter methods
chalkbox.trap = require('@chalkbox/custom/trap')
chalkbox.zalgo = require('@chalkbox/custom/zalgo')

// maps
chalkbox.maps = {}
chalkbox.maps.america = require("@chalkbox/maps/america")(chalkbox)
chalkbox.maps.zebra = require("@chalkbox/maps/zebra")(chalkbox)
chalkbox.maps.rainbow = require("@chalkbox/maps/rainbow")(chalkbox)
chalkbox.maps.random = require("@chalkbox/maps/random")(chalkbox)

for (var map in chalkbox.maps) {
	;(function (map) {
		chalkbox[map] = function (str) {
			return sequencer(chalkbox.maps[map], str)
		}
	})(map)
}

defineProps(chalkbox, init())
