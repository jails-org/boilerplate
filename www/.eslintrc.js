module.exports = {
	'parser':'@babel/eslint-parser',
	'rules': {
		'indent': [2,'tab', {'SwitchCase':1}],
		'quotes': [2,'single'],
		'semi': [2,'never'],
		'no-unused-vars': ['warn', { 'vars': 'all', 'args': 'none' }],
		'no-console': 0
	},
	'plugins':['jest'],
	'env': {
		'es6': true,
		'browser': true,
		'mocha': true,
		'node' : true,
	},
	'extends': 'eslint:recommended',
	'parserOptions': {
		'sourceType': 'module',
		'ecmaVersion': 2017,
		'ecmaFeatures': {
			'experimentalObjectRestSpread': true
		}
	},
	'globals':{
		'Whitelabel': true,
		'expect': true
	}
}
