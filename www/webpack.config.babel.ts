import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import ImageminPlugin from 'imagemin-webpack-plugin'
import imageminMozjpeg from 'imagemin-mozjpeg'

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
		loaders,
		plugins,
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


/**
 * @Extensions
 * */
const loaders = [
	{
		test: /\.styl$/,
		use: [
			MiniCssExtractPlugin.loader,
			{
				loader: 'css-loader'
			},
			{
				loader: 'stylus-loader',
				options: {
					stylusOptions : {
						paths 		: [
							path.resolve(dirname, '../', 'node_modules'),
							path.resolve(dirname)
						],
						import		:['rupture'],
						resolveURL	: true,
						includeCSS	: true
					}
				}
			}
		]
	}
]

const plugins = [
	new ImageminPlugin({
		disable: process.env.NODE_ENV == 'development',
		test: /\.(jpe?g|png|gif|webp)$/i,
		pngquant: {
			quality: '95-100'
		},
		plugins: [
			imageminMozjpeg({ quality: 80 })
		]
	})
]
