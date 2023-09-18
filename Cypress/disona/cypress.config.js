const { defineConfig } = require('cypress')
const { baseConfig } = require('../core/cypress.base.config')
const { disonaConfig } = require('./disona.config')
const _ = require('lodash')

const config = _.merge(baseConfig, disonaConfig)
module.exports = defineConfig({
	...config,
})
