import path from 'path'
import glob from 'glob'
import whitelabel from './whitelabel'
import apis_ from '../apis'
import routes_ from '../routes'
import envconfig from '../env.config.json'
import pluginsList from './plugins'
import loadersList from './loaders'

import TerserPlugin from 'terser-webpack-plugin'
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin'

export default async function webpackConfig( env, arg ) {

	const assetsPath = ''
	const ENV = process.env.ENV || 'production'
	const ENVCONFIG  = envconfig[ ENV ]

	const { mode } 	 = env
	const isdev 	 = mode === 'development'
	const source 	 = path.resolve(__dirname, '..')

	const api 	 = await apis_()
	const routes = await routes_(api)

	const output = {
		chunkFilename: 'js/[name].js',
		filename: 'js/[name].js',
		publicPath: '/',
		path: path.resolve(source, '../dist')
	}

	const entries = glob.sync(`./pages/**/*{.ts,.styl}`).reduce((acc, file) => {
		const dirname = path.basename(path.dirname(file))
		acc[dirname] = dirname in acc ? acc[dirname].concat(file) : [file]
		return acc
	}, {})

	const Whitelabel = whitelabel({ ENVCONFIG, mode, routes, assetsPath, api })
	const plugins 	 = pluginsList({ source, assetsPath, routes, Whitelabel, mode, output })
	const loaders	 = loadersList({ source, assetsPath })

	return {
		mode,
		output,

		devtool: isdev ? 'eval-source-map': false,
		entry  : entries,

		resolve: {
			extensions: ['*', '.js', '.ts'],
			modules: [
				source,
				path.resolve(source, '../node_modules')
			]
		},

		optimization: {

			splitChunks: {
				chunks: 'initial',
				name  : 'main'
			},

			minimizer: [
				new TerserPlugin({ parallel: true }),
				new CssMinimizerPlugin()
			]
		},

		devServer: {
			hot: true,
			client : {
				overlay : {
					errors: true
				}
			}
		},

		plugins: [
			...plugins
		],

		module: {
			rules: [
				...loaders
			]
		}
	}
}
