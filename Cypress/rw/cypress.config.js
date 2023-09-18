const { defineConfig } = require("cypress");
const { baseConfig } = require('../core/cypress.base.config');
const { rwConfig } = require('./rw.config')
const _ = require('lodash')

const config = _.merge(baseConfig, rwConfig)
module.exports = defineConfig({
  ...config
});
