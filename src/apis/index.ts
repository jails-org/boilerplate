import chalk from 'chalk'
import axios from 'axios'

export default async () => {
	try {
		const { data:users } = await axios.get('https://jsonplaceholder.typicode.com/users')
		return {
			users
		}
	}catch( err ) {
		console.log( chalk.bold.red('❌  [ API ERROR ]'), '===>', chalk.bgRed.bold.white(` ${err.message} `) )
	}
}
