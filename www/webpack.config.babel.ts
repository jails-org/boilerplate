
import path from 'path'
import glob from 'glob'

import core from '@boilerplate/core'
import apis	 from './apis'
import routes from './routes'

const source = `${__dirname}`
const dirname = __dirname
const entryFiles = glob.sync(`${source}/pages/**/*{.ts,.styl}`)

/* Env Config */
import envconfig from  './env.config.json'

export default Promise.resolve()

	.then( apis )
	.then(( api ) => {

		return {
			...core({
				source,
				dirname,
				version: '1.0',
				mode: 'development',
				metadata: { api },
				routes: routes( api ),
				envconfig,

				// Entry
				entry: entryFiles.reduce((acc, file) => {
					const dirname = path.basename(path.dirname(file))
					acc[dirname] = dirname in acc ? acc[dirname].concat(file) : [file]
					return acc
				}, {}),

				// Output
				output  :{
					chunkFilename: 'js/[name].js',
					filename: 'js/[name].js',
					publicPath: '/',
					path: path.resolve(__dirname, './dist')
				}
			})
		}
	})
