exports.baseConfig = {
	chromeWebSecurity: false,
	waitForFailsChanges: false,
	waitForAnimations: true,
	animationDistanceThreshold: 5,
	defaultCommandTimeout: 15000,
	execTimeout: 30000,
	pageLoadTimeout: 60000,
	requestTimeout: 15000,
	responseTimeout: 15000,
	viewportWidth: 1920,
	viewportHeight: 1080,
	screenshotOnRunFailure: true,
	video: false,
	videoCompression: 32,
	videoUploadOnPasses: false,
	failOnStatusCode: false,
	watchForFileChanges: false,
	fixturesFolder: '../core/fixtures',
	env: {
		grepFilterSpecs: true,
	},
	retries: {
		runMode: 1,
		openMode: 0,
	},
	e2e: {
		experimentalOriginDependencies: true,
		experimentalModifyObstructiveThirdPartyCode: true,
		supportFile: './support.js',
		setupNodeEvents(on, config) {
			return require('../core/plugins/index')(on, config)
		},
	},
}
