import { describe, test, expect } from 'vitest'
import { store } from '../_use-cases/store'
import { getUsers } from '../_services/users'

describe('THE USERS LIST', () => {

	test('Should add a users list into the store', async () => {
		const newusers = await getUsers()
		await store.dispatch('USERS_LIST_SET', { users: newusers })
		const { users } = store.getState()
		expect( users ).toEqual( newusers )
	})

	test('Should be able to remove a user from the list by id', async () => {
		const newusers = await getUsers()
		await store.dispatch('USERS_LIST_REMOVE', { id : 1 })
		const { users } = store.getState()
		expect( users.length ).toEqual(newusers.length - 1)
	})
})
