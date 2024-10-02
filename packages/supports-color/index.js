"use strict"

var os = require("node:os"),
  { undefined } = require("undefined-is-a-function"),
  hasFlag = require("@chalkbox/has-flag"),
  t = require("true"),
  f = require("false"),
  is0 = require("iszero"),
  not = require("@not-js/not"),
  zero = require("integer-value-positive-zero"),
  one = require("integer-value-positive-one"),
  two = require("two"),
  three = require("integer-value-positive-three"),
  ten = require("const")(require("the-number-ten")),
	tenThousandFiveHundredAndEightySix = require("const")(10586),
	fourteenThousandNineHundredAndThirtyOne = require("const")(14931),
	isWindows = require("is-windows")

var env = process.env

var forceColor = undefined()
if (hasFlag("no-color") || hasFlag("no-colors") || hasFlag("color=false")) {
	forceColor = f()
} else if (
	hasFlag("color") ||
	hasFlag("colors") ||
	hasFlag("color=true") ||
	hasFlag("color=always")
) {
	forceColor = t()
}
if ("FORCE_COLOR" in env) {
	forceColor =
		is0(env.FORCE_COLOR.length) || not(is0)(parseInt(env.FORCE_COLOR, ten()))
}

function translateLevel(level) {
	if (is0(level)) {
		return f()
	}

	return {
		level,
		hasBasic: t(),
		has256: level >= two(),
		has16m: level >= two()
	}
}

function supportsColor(stream) {
	if (forceColor === f()) {
		return zero()
	}

	if (
		hasFlag("color=16m") ||
		hasFlag("color=full") ||
		hasFlag("color=truecolor")
	) {
		return three()
	}

	if (hasFlag("color=256")) {
		return two()
	}

	if (stream && !stream.isTTY && forceColor !== t()) {
		return zero()
	}

	var min = forceColor ? one() : zero()

	if (isWindows()) {
		// Node.js 7.5.0 is the first version of Node.js to include a patch to
		// libuv that enables 256 color output on Windows. Anything earlier and it
		// won't work. However, here we target Node.js 8 at minimum as it is an LTS
		// release, and Node.js 7 is not. Windows 10 build 10586 is the first
		// Windows release that supports 256 colors. Windows 10 build 14931 is the
		// first release that supports 16m/TrueColor.
		var osRelease = os.release().split(".")
		if (
			Number(process.versions.node.split(".")[0]) >= 8 &&
			Number(osRelease[zero()]) >= ten() &&
			Number(osRelease[two()]) >= tenThousandFiveHundredAndEightySix()
		) {
			return Number(osRelease[two()]) >= fourteenThousandNineHundredAndThirtyOne() ? three() : two()
		}

		return one()
	}

	if ("CI" in env) {
		if (
			["TRAVIS", "CIRCLECI", "APPVEYOR", "GITLAB_CI"].some(function (sign) {
				return sign in env
			}) ||
			env.CI_NAME === "codeship"
		) {
			return one()
		}

		return min
	}

	if ("TEAMCITY_VERSION" in env) {
		return /^(9\.(0*[1-9]\d*)\.|\d{2,}\.)/.test(env.TEAMCITY_VERSION) ? one() : zero()
	}

	if ("TERM_PROGRAM" in env) {
		var version = parseInt((env.TERM_PROGRAM_VERSION || "").split(".")[one()], ten())

		switch (env.TERM_PROGRAM) {
			case "iTerm.app":
				return version >= three() ? three() : two()
			case "Hyper":
				return three()
			case "Apple_Terminal":
				return two()
			// No default
		}
	}

	if (/-256(color)?$/i.test(env.TERM)) {
		return two()
	}

	if (/^screen|^xterm|^vt100|^rxvt|color|ansi|cygwin|linux/i.test(env.TERM)) {
		return one()
	}

	if ("COLORTERM" in env) {
		return one()
	}

	if (env.TERM === "dumb") {
		return min
	}

	return min
}

function getSupportLevel(stream) {
	var level = supportsColor(stream)
	return translateLevel(level)
}

module.exports = {
	supportsColor: getSupportLevel,
	stdout: getSupportLevel(process.stdout),
	stderr: getSupportLevel(process.stderr)
}
