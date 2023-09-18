import LoginPage from '../../../page_objects/pages/LoginPage'
import SignUpPage from '../../../page_objects/pages/SignUpPage'
import { path, commonConstant, navBarItems, country } from '../../../support/app-data'
import TradingPage from '../../../page_objects/pages/TradingPage'
import NavBarComponent from '../../../page_objects/pages/NavBarComponent'
import ProfilePage from '../../../page_objects/pages/ProfilePage'
import { getRandomNumber } from '../../../support/Helpers'

describe('Registration Tests', {tags: 'smoke'}, () => {
	const loginPage = new LoginPage()
	const signUpPage = new SignUpPage()
	const tradingPage = new TradingPage()
	const navBarComponent = new NavBarComponent()
	const profilePage = new ProfilePage()

	beforeEach(() => {
		loginPage.open(path['login'])
	})

	it('C444: should check registration with incorrect credentials', function() {
		loginPage.clickOnSignUpButton()
		signUpPage.isSignUpButtonDisabled()
		loginPage.verifyUrl(path['login'])
		cy.performRegistration(commonConstant['wrongFormatEmail'], commonConstant['testPassword'])
		loginPage.verifyUrl(path['login'])
	})

	it('C442: should check registration and profile page with correct credentials', function() {
		const testEmail = commonConstant['autotest'] + getRandomNumber(7) + commonConstant['gmail_form'];
		loginPage.clickOnSignUpButton()
		signUpPage.isSignUpButtonDisabled()
		loginPage.verifyUrl(path['login'])
		cy.performRegistration(testEmail, commonConstant['testPassword'])
		loginPage.verifyUrl(path['trading'])
		tradingPage.clickOnCloseEmailVerificationMessageButton()
		navBarComponent.clickOnNavigationItem(navBarItems['profile'])
		profilePage
			.verifyPersonalInformationFieldsDisplayed()
			.verifyEmail(testEmail)
			.selectCountry(country['germany']['name'])
			.verifyPhoneCodeByCountry(country['germany'])
		navBarComponent
			.clickOnNavigationItem(navBarItems['accounts'])
			.clickOnNavigationItem(navBarItems['profile'])
		profilePage
			.selectCountry(country['australia']['name'])
			.verifyPhoneCodeByCountry(country['australia'])
	})
})