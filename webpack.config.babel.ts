import config from 'boilerplate-core/config'
import path from 'path'
import glob from 'glob'

import apis	 from './src/apis'
import routes from './src/routes'

const source = `${__dirname}/src`
const dirname = __dirname
const entryFiles = glob.sync(`${source}/pages/**/*{.ts,.styl}`)

export default Promise.resolve()

	.then( apis )
	.then(( api ) => {

		return {
			...config({
				source,
				dirname,
				version: '1.0',
				mode: 'development',
				metadata: { api },
				routes: routes( api ),

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
