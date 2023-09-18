import { LoginPage } from '../pages/login.page'
import { Helper } from '../api_helpers/helper'
import { TradingPage } from '../pages/trading.page'
import { ProfilePage } from '../pages/profile.page'
import { faker } from '@faker-js/faker'

describe('SignIn/SignUp', { tags: ['smoke', 'regression'] }, () => {
	const loginPage = new LoginPage()
	const tradingPage = new TradingPage()
	const profilePage = new ProfilePage()
	const { email, password } = Cypress.env()
	const validationPassed = '1px solid rgba(0, 0, 0, 0)'
	const dataRequired = '1px solid rgb(255, 24, 80)'

	it('C2600: Sign in', () => {
		cy.visit('/')
		loginPage.typeInEmailInput(email)
		loginPage.typeInPasswordInput(password)
		loginPage.clickOnLogInButton()
		cy.location('pathname').should('be.eq', '/trading')
	})

	it('C2601: Sign up', function () {
		const randomEmail = Helper.getRandomEmail()
		cy.visit('/')
		loginPage.clickOnSingUpSwitcher()
		loginPage.getSingUpButton().should('be.disabled')
		loginPage.typeInEmailInput(randomEmail)
		loginPage.typeInPasswordInput(password)
		loginPage.checkAgreementCheckbox()
		loginPage.checkResidentCheckbox()
		loginPage.getSingUpButton().should('not.be.disabled')
		loginPage.clickSingUpButton()
		cy.location('pathname').should('be.eq', '/trading')
		tradingPage.clickVerifyAccountButton()
		cy.location('pathname').should('eq', '/profile')
		cy.waitForLoader()
		const fields = [
			'full name',
			'date of birth (DD.MM.YYYY)',
			'address',
			'phone number',
		]
		fields.forEach((label) => {
			profilePage
				.getInputByLabel(label)
				.should('have.attr', 'placeholder', 'Fill data')
				.and('have.css', 'border', dataRequired)
		})
		profilePage.getEmailInput().should('have.value', randomEmail)
		profilePage.typeInFullNameInput(faker.name.fullName())
		profilePage.typeInAddressInput(faker.address.streetAddress())
		profilePage.typeInBirthdateInput('25.04.2001')
		profilePage.selectCountry('Afghanistan')
		fields.pop()
		fields.forEach((label) => {
			profilePage
				.getInputByLabel(label)
				.should('have.attr', 'placeholder', 'Fill data')
				.and('have.css', 'border', validationPassed)
		})
		profilePage.clickSaveButton()
		profilePage.getProfileUpdatedMessage().should('be.visible')
	})

})