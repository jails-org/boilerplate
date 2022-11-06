import LazyLoad from 'vanilla-lazyload'

export default function main () {

	new LazyLoad({
		elements_selector: '[data-src]'
	})
}
