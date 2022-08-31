const axios = require('axios')

module.exports = () => {

	const users = axios.get('https://jsonplaceholder.typicode.com/users')

	return Promise.all([ users ])
		.then( ([ users ]) => ({
			users: users.data
		}))
		.catch( err => {
			console.log( chalk.bold.red('❌  [ API ERROR ]'), '===>', chalk.bgRed.bold.white(` ${err.message} `) )
		})
	}
