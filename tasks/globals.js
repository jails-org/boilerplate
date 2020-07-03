import fs from 'fs'

// Global Functions
export default ({ routes }) => ({

	Boilerplate :{
		toJSON(value = '') {
			return JSON.stringify(value).replace(/\"/g, '\'')
		},

		getData(name) {
			return JSON.parse(fs.readFileSync(`./data/static/${name}.json`, 'utf-8'))
		},

		getRoute(page) {
			return routes.find(r => r.page === page)
		},

		toTemplate(object, prefix = 'item') {
			return Object.keys(object).reduce((acc, key) => ({
				...acc,
				[key]: `{{ ${prefix}.${key} }}`
			}), {})
		}
	}
})
