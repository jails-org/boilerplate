import path from 'path'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'

export default function loaders ({ source, assetsPath }) {
    return [
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
								path.resolve(source, '../', 'node_modules'),
								path.resolve(source)
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
			test: /\.webcomponent.(js|ts)$/,
			exclude: [/node_modules/],
			loader: 'babel-loader'
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
						outputPath: assetsPath + 'images/',
						name: file => file.split(/\/(images|node_modules|icons)\//).pop()
					}
				}
			]
		}
    ]
}
