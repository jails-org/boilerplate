
import path from 'path'
import { v4 } from 'uuid'
import packageJSON from '../package.json'
import routes_ from '../routes'
import envconfig from '../env.config.json'
import glob from 'glob'

export const whitelabel = ({ assetsPath, mode, config, routes }) => {

	const version = packageJSON.version

	return {
		page : '',
		route: {},
		mode,
		routes,
		version,
        assetsPath: `/${assetsPath}`,
		config,
        hash: mode == 'production' ? v4() : version,

        data( filename ) {
            const url = path.resolve(`pages/${this.page}/data/${filename}`)
            return require(url)
        }
	}
}

export const getConfig = async ({  env, entries, assetsPath = '' }) => {

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

	await Promise.all(routes.map( async (route:any) => {
		const api = route.controller? route.controller() : Promise.resolve({})
		const data = await api
		route.data = data
		return route
	}))

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

