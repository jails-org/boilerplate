
export const User = ({

	id 		 = String(),
	name 	 = String(),
	username = String(),
	email 	 = String(),
	address  = Object(),
	phone 	 = String(),
	website  = String(),
	company  = Object()

}) => ({

	id,
	name,
	username,
	email,
	phone,
	website,
	address : Address(address),
	company : company.name

})

export const Address = ({
	street,
	city,
	suite,
	zipcode,
	geo
}) => {
	return `${street}, ${city} - ${suite}`
}
