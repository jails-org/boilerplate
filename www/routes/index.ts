import axios from 'axios'

export default async () => {

	return [
		{
			title: 'Home',
			page: 'home',
			path: '/',
			async controller() {
				const { data:users } = await axios.get('https://jsonplaceholder.typicode.com/users')
				return {
					users
				}
			}
		}
	]
}
