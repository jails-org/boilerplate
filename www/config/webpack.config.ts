import path from 'path'
import { whitelabel, getConfig } from './whitelabel'

import TerserPlugin from 'terser-webpack-plugin'
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin'
import pluginsList from './plugins'
import loadersList from './loaders'

export default async function webpackConfig( env, arg ) {

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
