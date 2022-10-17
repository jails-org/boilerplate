import path from 'path'
import core from '@medusa/core'

/* Env Config */
import envconfig from  './env.config.json'
import packagejson from './package.json'

const dirname = __dirname
const source = `${dirname}`
const version = packagejson.version

export default Promise.resolve()
	.then(() => core({
		source,
		dirname,
		version,
		envconfig,
		entry:`${source}/pages/**/*{.ts,.styl}`,
		output: {
			chunkFilename: 'js/[name].js',
			filename: 'js/[name].js',
			publicPath: '/',
			path: path.resolve(__dirname, '../dist')
		}
	}))
