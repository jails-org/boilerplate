const path = require('path')
const { v4 } = require('uuid')

module.exports = ({ dirname, assetsFolder, version, mode }) => {
    return {
        version,
        assetsFolder: `/${assetsFolder}`,
        hash: mode == 'production' ? v4() : version,
        data( filename ) {
            const url = path.resolve(`pages/${this.page}/data/${filename}`)
            return require(url)
        }
    }
}