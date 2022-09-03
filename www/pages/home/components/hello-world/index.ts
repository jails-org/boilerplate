
export default function helloWorld ({ main }) {

	main( _ => [
		hello
	])

	const hello = () => {
		console.log('hello world!')
	}
}
