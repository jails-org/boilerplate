
export default class HelloWorld extends HTMLElement {

	constructor() {
		super()
	}

	connectedCallback(){
		console.log('hello world mounted')
		console.log('[Hello World] - Logging Whitelabel var', { Whitelabel })
	}

	disconnectedCallback() {
		console.log('unmount')
	}
  }
