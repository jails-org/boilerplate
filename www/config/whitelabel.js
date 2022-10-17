
import path from 'path'
import { v4 } from 'uuid'
import packageJSON from '../package.json'

export default function whitelabel ({ assetsPath, mode, ENVCONFIG, routes, api }) {

	const version = packageJSON.version

	return {
		page : '',
		route: {},
		mode,
		api,
		routes,
		version,
        assetsPath: `/${assetsPath}`,
		config: ENVCONFIG,
        hash: mode == 'production' ? v4() : version,

        data( filename ) {
            const url = path.resolve(`pages/${this.page}/data/${filename}`)
            return require(url)
        }
	}
}

