import LoginPage from '../../../page_objects/pages/LoginPage'
import NavBarComponent from '../../../page_objects/pages/NavBarComponent'
import { path } from '../../../support/app-data'

describe('Navigation Bar Tests', {tags: 'smoke'}, () => {
	const loginPage = new LoginPage()
	const navBarComponent = new NavBarComponent()
	const {smokeUsername, password} = Cypress.env()
	let cookies

	before(() => {
		cy.clearCookies()
		loginPage.open(path['login'])
		cy.performLogin(smokeUsername, password)
		cy.getCookies().then((res) => cookies=res)
	})

	beforeEach(() => {
		cy.setCookies(cookies)
		loginPage.open(path['trading'])
		cy.waitForLoader()
	})

	it('C2749: should check navigation bar UI elements', function() {
		navBarComponent.verifyAllUIElements()
	})

	it('C1980: should check language menu elements', function() {
		navBarComponent
			.clickOnLanguageSelectButton()
			.verifyLanguagesDisplayed()
	})

	it.skip('C596: should check logout functionality', function() {
		navBarComponent.clickOnLogoutButton()
		loginPage.verifyUrl(path['login'])
	})
})