import { ProfilePage } from '../pages/profile.page'
import { Helper } from '../api_helpers/helper'
import { AccountsPage } from '../pages/accounts.page'
import { faker } from '@faker-js/faker'

describe('Profile passing', () => {
	const { password } = Cypress.env()
	const inputFields = ['full name', 'date of birth (DD.MM.YYYY)', 'address']
	const profilePage = new ProfilePage()
	const accountsPage = new AccountsPage()

	it('C2602: Save button for every input', function () {
		const email = Helper.getRandomEmail()
		Helper.createUser(email)
		cy.visit('/')
		cy.performLogin(email, password)
		cy.intercept('get', '**/webchat/**').as('webchat')
		cy.visit('/profile')
		cy.wait('@webchat')
		cy.waitForLoader()
		cy.location('pathname').should('eq', '/profile')
		inputFields.forEach((input) => {
			profilePage.getInputByLabel(input).then((input) => {
				const value = input.val()
				profilePage.getSaveButton().should('not.exist')
				cy.wrap(input, { log: false }).clear()
				profilePage.getSaveButton().should('be.visible').and('be.disabled')
				cy.wrap(input, { log: false }).type(value)
				profilePage.getSaveButton().should('not.exist')
			})
		})
		profilePage.selectCountry('Afghanistan')
		profilePage.getSaveButton().should('be.visible').and('not.be.disabled')
	})

	it('C2603: Real account creation after passing profile', function () {
		const email = Helper.getRandomEmail()
		Helper.createUser(email, password, { isActive: false })
		cy.visit('/')
		cy.performLogin(email, password)
		cy.intercept('get', '**/webchat/**').as('webchat')
		cy.visit('/profile')
		cy.wait('@webchat')
		profilePage.getAccountStatus()
			.should('have.text', 'Account not verified')
		profilePage.typeInFullNameInput(faker.name.fullName())
		profilePage.typeInBirthdateInput('2001.04.25')
		profilePage.typeInAddressInput(faker.address.streetAddress())
		profilePage.selectCountry('Viet Nam')
		profilePage.clickSaveButton()
		profilePage.getProfileUpdatedMessage().should('be.visible')
		profilePage.getAddedNewTradingAccountMessage().should('be.visible')
		profilePage.getAccountStatus()
			.should('have.text', 'Account successfully verified')
		cy.visit('/accounts')
		accountsPage.getRealAccountsTable().within( () => {
			accountsPage.getAccountsRows().should('have.length', 1)
		})
	})
})
