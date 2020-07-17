const isTest = process.env.NODE_ENV === 'test'

module.exports = {
	presets: ['@babel/preset-typescript'],
	plugins: [isTest && '@babel/plugin-transform-modules-commonjs'].filter(Boolean),
}
