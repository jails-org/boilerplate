const path 		 = require('path')
const webpack 	 = require('webpack')
const glob 		 = require('glob')
const MedusaCore = require('./medusa')

/* Plugins */
const TerserPlugin 				= require('terser-webpack-plugin')
const HtmlWebPackPlugin 		= require('html-webpack-plugin')
const CssMinimizerPlugin 		= require('css-minimizer-webpack-plugin')
const HtmlCriticalWebpackPlugin = require('html-critical-webpack-plugin')
const SVGSpritemapPlugin 		= require('svg-spritemap-webpack-plugin')
const MiniCssExtractPlugin 		= require('mini-css-extract-plugin')
const imageminMozjpeg 			= require('imagemin-mozjpeg')
const ImageminPlugin 			= require('imagemin-webpack-plugin').default

module.exports = ({

	entry,
	dirname,
	output,
	source,
	assetsFolder = '',
	version = '1.0',
	envconfig,
	loaders = [],
	plugins = []

}) => {
	
	const mode 	 = process.env.NODE_ENV || 'production'
	const isdev = mode === 'development'
	const ENVCONFIG = envconfig[ process.env.NODE_ENV || 'production']
	const apis = require(`${dirname}/apis`).default
	const routes = require(`${dirname}/routes`).default

	const entries = glob.sync(entry).reduce((acc, file) => {
		const dirname = path.basename(path.dirname(file))
		acc[dirname] = dirname in acc ? acc[dirname].concat(file) : [file]
		return acc
	}, {})

	return apis()
		.then( api => {
			
			const _routes = routes(api)
			const Medusa = MedusaCore({ dirname, mode, version, assetsFolder })

			return {
				mode,
				output,
				devtool: mode == 'production' ? false : 'eval-source-map',
				entry  : entries,

				resolve: {
					extensions: ['*', '.js', '.ts'],
					modules: [
						source,
						path.resolve(dirname, '../node_modules')
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
					...plugins,
					new ImageminPlugin({
						disable: process.env.NODE_ENV == 'development',
						test: /\.(jpe?g|png|gif|webp)$/i,
						pngquant: {
							quality: '95-100'
						},
						plugins: [
							imageminMozjpeg({ quality: 80 })
						]
					}),
					new webpack.DefinePlugin({
						ENVCONFIG : JSON.stringify(ENVCONFIG),
						Medusa: JSON.stringify(Medusa)
					}),
					new SVGSpritemapPlugin([
						`${source}/assets/icons/*.svg`,
						`${source}/assets/icons/**/*.svg`
					], {
						sprite: { prefix: false },
						output: {
							filename: `${assetsFolder}icons/sprite.svg`
						}
					}),
					new MiniCssExtractPlugin({
						filename: `${assetsFolder}css/[name].css`,
						chunkFilename: `${assetsFolder}css/[name].css`
					}),
					..._routes.map((route) => {
						
						const { page } = route
						const file = route.path == '/'? 'index.html' : route.path.substring(1) + '/index.html'
						
						Medusa.page = page
						Medusa.route = route 
						Medusa.routes = _routes 
						Medusa.environment = ENVCONFIG

						return new HtmlWebPackPlugin({
							template: `${source}/pages/${page}/index.pug`,
							templateParameters: {
								Medusa,
								ENVCONFIG
							},
							filename: `./${file}`,
							inject: false,
							minify: isdev ? false : {
								collapseWhitespace: true,
								removeComments: true,
								removeRedundantAttributes: false,
								removeScriptTypeAttributes: true,
								removeStyleLinkTypeAttributes: true,
								useShortDoctype: true
							}
						})
					}),
					...(isdev ? [] : _routes).map(({ path }) => {
						const file = path == '/'? 'index.html' : path.substring(1) + '/index.html'
						return new HtmlCriticalWebpackPlugin({
							base: output.path,
							src: file,
							dest: file,
							inline: true,
							minify: true,
							extract: true,
							width: 1280,
							height: 1980,
							penthouse: {
								blockJSRequests: false
							}
						})
					})
				],
				module: {
					rules: [
						...loaders,
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
						},
						{
							test: /\.pug$/,
							loader: 'pug-loader',
							options: {
								root: source,
								basedir: source,
								pretty: true
							}
						},
						{
							test: /\.(js|ts)$/,
							exclude: [/node_modules/],
							loader: 'ts-loader',
							options: {
								transpileOnly: true
							}
						},
						{
							test: /\.html$/,
							use: [
								{
									loader: 'html-loader',
									options: { minimize: true }
								}
							]
						},

						{
							test: /\.css$/,
							use: {
								loader: 'css-loader'
							}
						},
						{
							test: /\.(gif|png|jpe?g|svg|webp)$/i,
							use: [
								{
									loader: 'file-loader',
									options: {
										outputPath: assetsFolder + 'images/',
										name: file => file.split(/\/(images|node_modules)\//).pop()
									}
								}
							]
						}
					]
				}
			}
		})	
}