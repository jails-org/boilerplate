import axios from 'axios'

export default async () => {

	const { data:users } = await axios.get('https://jsonplaceholder.typicode.com/users')

	return {
		users
	}
}
