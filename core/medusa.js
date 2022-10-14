const path = require('path')

module.exports = ({ dirname, assetsFolder, version, mode }) => {
    return {
        version,
        assetsFolder: `/${assetsFolder}`,
        hash: mode == 'production' ? generateHash() : version,
        data( jsonpath ) {
            const url = path.resolve(dirname, `data/${jsonpath}`)
            return require(url)
        }
    }
}

function generateHash(){
	return Math.random().toString(36).substring(2, 15) +
		Math.random().toString(36).substring(2, 15)
}