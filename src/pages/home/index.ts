import jails from 'jails-js'
import * as helloWorld from './components/hello-world'

jails.register('hello-world', helloWorld, {})
jails.start()
