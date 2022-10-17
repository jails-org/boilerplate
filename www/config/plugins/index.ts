import webpack from 'webpack'
import HtmlWebPackPlugin from 'html-webpack-plugin'
import HtmlCriticalWebpackPlugin from 'html-critical-webpack-plugin'
import SVGSpritemapPlugin from 'svg-spritemap-webpack-plugin'
import MiniCssExtractPlugin from 'mini-css-extract-plugin'
import imageminMozjpeg from 'imagemin-mozjpeg'
import ImageminPlugin from 'imagemin-webpack-plugin'

export default function plugins ({
	source,
	assetsPath,
	routes,
	Whitelabel,
	mode,
	output
}) {

	const isdev = mode === 'development'

    return [
		new ImageminPlugin({
			disable: isdev,
			test: /\.(jpe?g|png|gif|webp)$/i,
			pngquant: {
				quality: '95-100'
			},
			plugins: [
				imageminMozjpeg({ quality: 80 })
			]
		}),
		new SVGSpritemapPlugin([
			`${source}/assets/icons/*.svg`,
			`${source}/assets/icons/**/*.svg`
		], {
			sprite: { prefix: false },
			output: {
				filename: `${assetsPath}icons/sprite.svg`
			}
		}),
		new MiniCssExtractPlugin({
			filename: `${assetsPath}css/[name].css`,
			chunkFilename: `${assetsPath}css/[name].css`
		}),
		...routes.map((route) => {

			const { page } = route
			const file = route.path == '/'? 'index.html' : route.path.substring(1) + '/index.html'

			Whitelabel.page = page
			Whitelabel.route = route

			return new HtmlWebPackPlugin({
				template: `${source}/pages/${page}/index.pug`,
				templateParameters: {
					Whitelabel
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
		...(isdev ? [] : routes).map(({ path }) => {
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
    ]
}
