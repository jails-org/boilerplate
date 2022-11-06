import { getUsers } from '../shared/services/sample'

export default async () => {

	return [
		{
			title: 'Home',
			page: 'home',
			path: '/',
			async controller() {
				const users = await getUsers()
				return { users }
			}
		}
	]
}
