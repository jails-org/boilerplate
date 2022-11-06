
import axios from 'axios'
import { User } from '../../entities/sample'

const baseURL = 'https://jsonplaceholder.typicode.com'
const http = axios.create({ baseURL })

export const getUsers = async () => {
	const { data:users }  = await http.get('/users')
	return users.map( User )
}
