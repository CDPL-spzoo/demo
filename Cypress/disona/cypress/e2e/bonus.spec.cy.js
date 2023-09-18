import { Helper } from '../api_helpers/helper'
import { BonusPage } from '../pages/bonus.page'
import { AccountsPage } from '../pages/accounts.page'

describe('Bonus', () => {
	const bonusPage = new BonusPage()
	const accountsPage = new AccountsPage()
	const { password } = Cypress.env()
	let email

	beforeEach(() => {
		email = Helper.getRandomEmail()
		cy.createUserAndLoginToDisona(email, password)
		cy.visit('/bonus')
	})

	it('C2616: Bonus activating after real account creation', function () {
		bonusPage.getActiveStep().should('contain.text', 'Fill-out your profile details')
		bonusPage
			.getAllSteps()
			.should('have.length', 6)
			.each((step) => expect(step).to.be.visible)
		bonusPage.getStepByNumber(1).should('contain.text', 'Fill-out your profile details').click()
		cy.location('pathname').should('eq', '/profile')
		bonusPage.clickAccountsLink()
		accountsPage.clickCreateRealAccountButton()
		accountsPage.clickButtonByText('create')
		accountsPage.getNotificationMessageWithText('Added new').should('be.visible')
		accountsPage.clickBonusLink()
		bonusPage.getActiveStep().should('contain.text', 'Make Deposit').click()
		cy.location('pathname').should('eq', '/operations')
	})

	it('C2724: Navigation buttons', function () {
		bonusPage.clickNextButton().wait(1000)
		bonusPage.clickNextButton()
		bonusPage.getActiveStep().should('not.be.visible')
		bonusPage.clickPrevButtonTillDisabled()
		bonusPage.getActiveStep().should('be.visible')
	})
})
