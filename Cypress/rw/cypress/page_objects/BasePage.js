import { assertion } from '../support/app-data'

export default class BasePage {

	open(path) {
		this.logInfo(`Open ${path} page`)
		cy.visit(Cypress.env('stageUrl') + path)
	}

	openProduction(path) {
		this.logInfo(`Open ${path} page`)
		cy.visit(Cypress.env('prodUrl') + path)
	}

	verifyUrl(path) {
		this.logInfo(`Verify url`)
		cy.url().should(assertion['include'], path)
	}

	pause(ms) {
		cy.wait(ms)
	}

	logInfo(message) {
		cy.log(message)
	}

	static setMobileViewport() {
		cy.viewport('iphone-x')
	}

	static setTableViewport() {
		cy.viewport('ipad-2')
	}

	static setDesktopViewport() {
		cy.viewport('macbook-13')
	}

	static setLargeDesktopViewport() {
		cy.viewport('macbook-15')
	}
}