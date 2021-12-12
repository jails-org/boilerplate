
export default {

	required({ element, value, fields, options }){
		const message = 'Este campo é obrigatório'
		const isValid = element.type == 'checkbox'
			? element.checked
			: Boolean( element.form[element.name].value.trim() )
		return { isValid, message }
	},

	email({ element, value, fields, options }) {
		if( !value ) {
			return { isValid:true }
		}
		return {
			isValid: Boolean(value.match(/\w*\@\w*\.\w{2,}/)),
			message: 'Digite um email válido'
		}
	},

	name({ element, value, fields, options }) {
		if( !value ) {
			return { isValid:true }
		}
		return {
			isValid: Boolean(value.match(/(\w*)\s(\w*)/)),
			message: 'Digite um nome válido'
		}
	}
}
