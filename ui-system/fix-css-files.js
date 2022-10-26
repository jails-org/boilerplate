/**
 * This script will take the tailwind css generated file and wraps it with @css{ } directive for stylus
 * This is to avoid errors raised by empty vars created by tailwind breaking stylus compilations silently.
 */

const fs = require('fs')
const path = require('path')
const glob = require('glob')
const files = glob.sync('./dist/*.css')

const file = files.shift()
const css = fs.readFileSync(path.resolve(file), 'utf-8')

fs.writeFileSync('./index.styl', `@css{
	${css}
}`)
