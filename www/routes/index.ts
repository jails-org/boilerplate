import { getUsers } from '../shared/services/sample'

export default async () => {

	const users = await getUsers()

	return [
		{
			title: 'Home',
			page: 'home',
			path: '/',
			users
		}
	]
}
