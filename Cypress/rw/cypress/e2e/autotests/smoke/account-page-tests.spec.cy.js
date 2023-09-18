import LoginPage from '../../../page_objects/pages/LoginPage'
import NavBarComponent from '../../../page_objects/pages/NavBarComponent'
import { commonConstant, navBarItems, path } from '../../../support/app-data'
import AccountsPage from '../../../page_objects/pages/AccountsPage'
import OpenAccountPage from '../../../page_objects/pages/OpenAccountPage'

describe('Account tests (Demo/Real)', {tags: 'smoke'}, () => {
	const loginPage = new LoginPage()
	const navBarComponent = new NavBarComponent()
	const accountsPage = new AccountsPage()
	const openAccountPage = new OpenAccountPage()
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
		navBarComponent.clickOnNavigationItem(navBarItems['accounts'])
	})

	it.skip('C460: should check account names', function() {
		accountsPage.verifyAccountName(commonConstant['demo'])
		navBarComponent.clickOnDemoRealSwitchButton(commonConstant['real'])
		accountsPage.verifyAccountName(commonConstant['standard']) //TODO check why opened 2 real account ???
	})

	it('C2744: should check account history columns', function() {
		accountsPage
			.clickOnAccountNumber()
			.verifyAccountHistoryColumnsName()
	})

	it('should check support chat functionality', function() {
		cy.sendSupportMessage(' ***NO REPLY***')
	})

	it('C2745: should check open account UI elements', function() {
		accountsPage.clickOnOpenAccountButton()
		openAccountPage.verifyAllElementsDisplayed()
	})

	it.skip('should check create button for Standard account', function() {
		accountsPage.clickOnOpenAccountButton()
		openAccountPage
			.verifyCreateButtonDisabled(true)
			.clickOnDemoSwitchButton()
			.verifyCreateButtonDisabled(false)
	})

	it('C2746: should check create button for Master account', function() {
		accountsPage.clickOnOpenAccountButton()
		openAccountPage
			.clickOnRealSwitchButton()
			.clickOnMasterAccountTypeButton()
			.verifyCreateButtonDisabled(true)
			.clickOnTermsConditionsCheckbox(true)
			.verifyCreateButtonDisabled(false)
			.clickOnTermsConditionsCheckbox(false)
			.verifyCreateButtonDisabled(true)
	})

	it('C2747: should check create button for Investor account', function() {
		accountsPage.clickOnOpenAccountButton()
		openAccountPage
			.clickOnRealSwitchButton()
			.clickOnInvestorAccountTypeButton()
			.verifyCreateButtonDisabled(true)
			.clickOnTermsConditionsCheckbox(true)
			.verifyCreateButtonDisabled(false)
			.clickOnTermsConditionsCheckbox(false)
			.verifyCreateButtonDisabled(true)
	})

	it('C2748: should check copy master functionality for Investor account', function() {
		accountsPage.clickOnOpenAccountButton()
		openAccountPage
			.clickOnRealSwitchButton()
			.clickOnInvestorAccountTypeButton()
			.clickOnTermsConditionsCheckbox(false)
			.verifyCreateButtonDisabled(true)
			.clickOnCopyMasterButton()
			.clickOnTermsConditionsCheckbox(true)
			.verifyCreateButtonDisabled(false)
			.clickOnTermsConditionsCheckbox(false)
			.verifyCreateButtonDisabled(true)
	})

	it('C455: should check Cancel button functionality', function() {
		accountsPage.clickOnOpenAccountButton()
		openAccountPage.clickOnCancelButton()
		accountsPage.verifyUrl(path['accounts'])
	})
})