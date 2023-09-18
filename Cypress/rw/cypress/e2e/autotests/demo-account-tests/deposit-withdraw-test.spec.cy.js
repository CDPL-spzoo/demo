import LoginPage from '../../../page_objects/pages/LoginPage'
import TradingPage from '../../../page_objects/pages/TradingPage'
import NavBarComponent from '../../../page_objects/pages/NavBarComponent'
import DepositWithdrawalPage from '../../../page_objects/pages/DepositWithdrawalPage'
import { commonConstant, navBarItems, numbers, path } from '../../../support/app-data'

describe('Deposit/Withdraw Tests [Demo]', () => {
	const loginPage = new LoginPage()
	const tradingPage = new TradingPage()
	const navBarComponent = new NavBarComponent()
	const depositWithdrawalPage = new DepositWithdrawalPage()
	const {demoUsername, password} = Cypress.env()
	let cookies

	before(() => {
		cy.clearCookies()
		loginPage.open(path['login'])
		cy.performLogin(demoUsername, password)
		cy.getCookies().then((res) => cookies=res)

	})

	beforeEach(() => {
		cy.setCookies(cookies)
		loginPage.open(path['trading'])
		cy.waitForLoader()
		navBarComponent.clickOnNavigationItem(navBarItems['profile'])
		cy.waitForLoader()
		navBarComponent
			.clickOnDemoRealSwitchButton(commonConstant['demo'])
			.clickOnNavigationItem(navBarItems['trading'])
	})

	it('C753: should check Deposit functionality', function() {
		tradingPage
			.setDepositWithdraw(numbers['_30_string'])
			.clickOnDepositButton()
		navBarComponent.clickOnNavigationItem(navBarItems['deposit_withdrawal'])
		navBarComponent.verifyUrl(path['operations'])
		navBarComponent.clickOnDemoRealSwitchButton(commonConstant['demo'])
		depositWithdrawalPage
			.clickOnRefreshUntilStatusNotChanged(0, commonConstant['completed'])
			.verifyOperationType(0, commonConstant['deposit'])
			.verifyOperationAmount(0, numbers['_30_string'])
			.verifyOperationStatus(0, commonConstant['completed'])
	})

	it.skip('should check Withdraw functionality', function() {
		tradingPage
			.setDepositWithdraw(numbers['_30_string'])
			.clickOnWithdrawButton()
		navBarComponent.clickOnNavigationItem(navBarItems['deposit_withdrawal'])
		depositWithdrawalPage.verifyUrl(path['operations'])
		navBarComponent.clickOnDemoRealSwitchButton(commonConstant['demo'])
		depositWithdrawalPage
			.clickOnRefreshUntilStatusNotChanged(0, commonConstant['completed'])
			.verifyOperationType(0, 'Withdrawal')
			.verifyOperationAmount(0, numbers['_30_string'])
			.verifyOperationStatus(0, 'completed')
	})

	it('C2765: should check Deposit/Withdraw disabled', function() {
		tradingPage
			.depositWithdrawInputField().clear()
		tradingPage
			.verifyDepositButtonDisabled()
			.verifyWithdrawButtonDisabled()
	})

	it('C753: should check Deposit functionality form Deposit/Withdraw page', function() {
		navBarComponent.clickOnNavigationItem(navBarItems['deposit_withdrawal'])
		depositWithdrawalPage.verifyUrl(path['operations'])
		navBarComponent.clickOnDemoRealSwitchButton(commonConstant['demo'])
		depositWithdrawalPage
			.setAmount(numbers['_30_string'])
			.clickOnDepositButton()
			.clickOnRefreshUntilStatusNotChanged(0, commonConstant['completed'])
			.verifyOperationType(0, commonConstant['deposit'])
			.verifyOperationAmount(0, numbers['_30_string'])
			.verifyOperationStatus(0, commonConstant['completed'])
			.verifyOperationDate(0, new Date().getDate())
	})

	it('C2766: should check Deposit disabled form Deposit/Withdraw page', function() {
		navBarComponent.clickOnNavigationItem(navBarItems['deposit_withdrawal'])
		depositWithdrawalPage.verifyUrl(path['operations'])
		navBarComponent.clickOnDemoRealSwitchButton(commonConstant['demo'])
		depositWithdrawalPage.amountInputField().clear()
		depositWithdrawalPage.verifyDepositWithdrawButtonDisabled()
	})
})
