import LoginPage from '../../../page_objects/pages/LoginPage'
import NavBarComponent from '../../../page_objects/pages/NavBarComponent'
import { assertion, commonConstant, country, navBarItems, path } from '../../../support/app-data'
import ProfilePage from '../../../page_objects/pages/ProfilePage'
import { getRandomNumber } from '../../../support/Helpers'

describe('Profile page tests (Real)', () => {
	const loginPage = new LoginPage()
	const navBarComponent = new NavBarComponent()
	const profilePage = new ProfilePage()
	let nickname;
	const {realUsername, password} = Cypress.env()
	let cookies

	before(() => {
		cy.clearCookies()
		loginPage.open(path['login'])
		cy.performLogin(realUsername, password)
		cy.getCookies().then((res) => cookies=res)
	})

	beforeEach(() => {
		cy.setCookies(cookies)
		loginPage.open(path['trading'])
		cy.waitForLoader()
		navBarComponent.clickOnNavigationItem(navBarItems['profile'])
		profilePage.verifyUrl(path['profile'])
	})

	it('C2762: should check profile page all elements', function() {
		profilePage.verifyProfilePageAllElementsDisplayed()
	})

	it('C1978: should check save button disabled without changes', function() {
		profilePage.verifySaveButtonDisabled()
	})

	it('C2763: should check save button enabled with changes any field', function() {
		nickname = commonConstant['autotest'] + getRandomNumber(3);
		profilePage
			.setNickName(nickname)
			.verifySaveButtonEnabled()
	})

	it('C1976: should check change personal information functionality', function() {
		nickname = commonConstant['autotest'] + getRandomNumber(3);
		profilePage
			.setNickName(nickname)
			.clickOnSaveButton()
			.verifyMessage(assertion['profile_updated_success_message'])
		navBarComponent.clickOnNavigationItem(navBarItems['trading'])
		profilePage.verifyUrl(path['trading'])
		navBarComponent.clickOnNavigationItem(navBarItems['profile'])
		profilePage.verifyUrl(path['profile'])
		profilePage.verifyPersonalInfoElementValue(profilePage.nickNameField(), nickname)
	})

	it('C2764: should check change country changing functionality', function() {
		profilePage
			.selectCountry(country['germany']['name'])
			.clickOnSaveButton()
			.verifyMessage(assertion['profile_updated_success_message'])
		navBarComponent.clickOnNavigationItem(navBarItems['trading'])
		profilePage.verifyUrl(path['trading'])
		navBarComponent.clickOnNavigationItem(navBarItems['profile'])
		profilePage.verifyUrl(path['profile'])
		profilePage.verifyCountry(country['germany']['name'])
		profilePage
			.selectCountry(country['brazil']['name'])
			.clickOnSaveButton()
			.verifyMessage(assertion['profile_updated_success_message'])
		navBarComponent.clickOnNavigationItem(navBarItems['trading'])
		profilePage.verifyUrl(path['trading'])
		navBarComponent.clickOnNavigationItem(navBarItems['profile'])
		profilePage.verifyUrl(path['profile'])
		profilePage.verifyCountry(country['brazil']['name'])
	})

	it('C1975: should check avatar modal functionality', function() {
		profilePage
			.clickOnUploadAvatarButton()
			.verifyAvatarModalOpenSuccessfully()
			.clickOnAvatarModalCloseButton()
			.verifyProfilePageAllElementsDisplayed()
	})
})