import path from 'path'
import packageJSON from '../package.json'
import routes_ from '../routes'
import envconfig from '../env.config.json'
import glob from 'glob'
import { v4 } from 'uuid'

import TerserPlugin from 'terser-webpack-plugin'
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin'
import pluginsList from './plugins'
import loadersList from './loaders'

export default async ( env, arg ) => {

	const { entry, config, isdev, mode, routes, assetsPath, source } = await getConfig({
		env,
		entries: './pages/**/*{.ts,.styl}'
	})

	const output = {
		chunkFilename: 'js/[name].js',
		filename: 'js/[name].js',
		publicPath: '/',
		path: path.resolve(source, '../dist')
	}

	const Whitelabel = whitelabel({ config, mode, routes, assetsPath })
	const plugins 	 = pluginsList({ source, assetsPath, routes, Whitelabel, mode, output })
	const loaders	 = loadersList({ source, assetsPath })

	return {
		mode,
		output,
		entry,
		devtool: isdev ? 'source-map': false,

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

const getConfig = async ({  env, entries, assetsPath = '' }) => {

	const ENV = process.env.ENV || 'production'
	const config  = envconfig[ ENV ]

	const { mode } 	 = env
	const isdev 	 = mode === 'development'
	const source 	 = path.resolve('./')

	const routes = await routes_()

	const entry = glob.sync(entries).reduce((acc, file) => {
		const dirname = path.basename(path.dirname(file))
		acc[dirname] = dirname in acc ? acc[dirname].concat(file) : [file]
		return acc
	}, {})

	return {
		config,
		mode,
		routes,
		assetsPath,
		source,
		isdev,
		entry
	}
}

const whitelabel = ({ assetsPath, mode, config, routes }) => {

	const version = packageJSON.version
	const hash = mode == 'production' ? v4() : version
	const assetsPath_ = `/${assetsPath}`

	return {

		config,
		metadata: { hash, assetsPath: assetsPath_, version, mode },
		props : { routes, route :null, page: '' },

		getData( filename ) {
            const url = path.resolve(`pages/${this.props.page}/data/${filename}`)
            return require(url)
        }
	}
}
