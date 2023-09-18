import LoginPage from '../../../page_objects/pages/LoginPage'
import SignUpPage from '../../../page_objects/pages/SignUpPage'
import { path, commonConstant } from '../../../support/app-data'

describe('Login Tests', {tags: 'smoke'}, () => {
	const loginPage = new LoginPage()
	const signUpPage = new SignUpPage()

	beforeEach(() => {
		loginPage.open(path['login'])
	})

	it('C2743: should check login with empty values',function() {
		loginPage.clickOnLogInButton()
		loginPage.verifyUrl(path['login'])
	})

	it('C448: should check login with incorrect credentials', function() {
		cy.performLogin(commonConstant['testEmail'], commonConstant['testPassword'])
		loginPage.verifyUrl(path['login'])
	})

	it('C865: should check sign up button', function() {
		loginPage.clickOnSignUpButton()
		signUpPage.isSignUpButtonDisabled()
		loginPage.verifyUrl(path['login'])
	})

	it('C443: should check login with valid credentials', function() {
		cy.performLogin(Cypress.env('smokeUsername'), Cypress.env('password'))
		loginPage.verifyUrl(path['trading'])
	})
})