import LoginPage from '../../../page_objects/pages/LoginPage'
import TradingPage from '../../../page_objects/pages/TradingPage'
import NavBarComponent from '../../../page_objects/pages/NavBarComponent'
import DepositWithdrawalPage from '../../../page_objects/pages/DepositWithdrawalPage'
import { commonConstant, navBarItems, numbers, path } from '../../../support/app-data'
import PaymentModal from "../../../page_objects/pages/modal/PaymentModal";
import { fillCardCredentials } from '../../../page_objects/pages/decta/DectaPage'

describe('Deposit/Withdraw Tests [Real]', () => {
	const loginPage = new LoginPage()
	const tradingPage = new TradingPage()
	const navBarComponent = new NavBarComponent()
	const depositWithdrawalPage = new DepositWithdrawalPage()
	const paymentModal = new PaymentModal()
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
		navBarComponent.clickOnDemoRealSwitchButton(commonConstant['real'])
	})

	it('C2767: should check Deposit modal open successfully form Trading page', function() {
		tradingPage
			.setDepositWithdraw(numbers['_100_string'])
			.clickOnDepositButton()
		paymentModal
			.verifyDepositModalDisplayed(numbers['_100_string'])
	})

	it('C2768: should check Deposit modal open successfully form Deposit/Withdraw page', function() {
		navBarComponent.clickOnNavigationItem(navBarItems['deposit_withdrawal'])
		depositWithdrawalPage.verifyUrl(path['operations'])
		depositWithdrawalPage
			.setAmount(numbers['_100_string'])
			.clickOnDepositButton()
		paymentModal
			.verifyDepositModalDisplayed(numbers['_100_string'])
	})

	it('C908: should check Balance successfully changed after deposit using Bank Card [Decta]', function() {
		tradingPage.tradingBalanceField().then(($balanceText) => {
			let balance = $balanceText.text()
			navBarComponent.clickOnNavigationItem(navBarItems['deposit_withdrawal'])
			depositWithdrawalPage.verifyUrl(path['operations'])
			depositWithdrawalPage
				.setAmount(numbers['_30_string'])
				.clickOnDepositButton()
			paymentModal
				.verifyDepositModalDisplayed(numbers['_30_string'])
				.clickOnBankCardByIndex(1)
			fillCardCredentials(true)
			depositWithdrawalPage
				.clickOnProceedTheTransactionsList()
				.clickOnRefreshUntilStatusNotChanged(0, commonConstant['completed'])
			navBarComponent.clickOnNavigationItem(navBarItems['trading'])
			tradingPage.verifyTradingBalance(parseFloat(balance) + 30)
		})
	})

	it('C2769: should check Balance successfully changed after deposit using Bank Card from Terminal [Decta]', function() {
		tradingPage.tradingBalanceField().then(($balanceText) => {
			let balance = $balanceText.text()
			tradingPage
				.setDepositWithdraw(numbers['_30_string'])
				.clickOnDepositButton()
			paymentModal
				.verifyDepositModalDisplayed(numbers['_30_string'])
				.clickOnBankCardByIndex(1)
			fillCardCredentials(true)
			depositWithdrawalPage
				.clickOnProceedTheTransactionsList()
				.clickOnRefreshUntilStatusNotChanged(0, commonConstant['completed'])
			navBarComponent.clickOnNavigationItem(navBarItems['trading'])
			tradingPage.verifyTradingBalance(parseFloat(balance) + 30)
		})
	})

	it('C933: should check Deposit successfully completed using Bank Card [Decta]', function() {
		navBarComponent.clickOnNavigationItem(navBarItems['deposit_withdrawal'])
		depositWithdrawalPage.verifyUrl(path['operations'])
		depositWithdrawalPage
			.setAmount(numbers['_30_string'])
			.clickOnDepositButton()
		paymentModal
			.verifyDepositModalDisplayed(numbers['_30_string'])
			.clickOnBankCardByIndex(1)
		fillCardCredentials(true)
		depositWithdrawalPage
			.clickOnProceedTheTransactionsList()
			.clickOnRefreshUntilStatusNotChanged(0, commonConstant['completed'])
			.verifyOperationType(0, commonConstant['deposit'])
			.verifyOperationAmount(0, numbers['_30_string'])
			.verifyOperationStatus(0, commonConstant['completed'])
	})

	it('C2770: should check Deposit status is confirmed with wrong bank card number [Decta]', function() {
		navBarComponent.clickOnNavigationItem(navBarItems['deposit_withdrawal'])
		depositWithdrawalPage.verifyUrl(path['operations'])
		depositWithdrawalPage
			.setAmount(numbers['_30_string'])
			.clickOnDepositButton()
		paymentModal
			.verifyDepositModalDisplayed(numbers['_30_string'])
			.clickOnBankCardByIndex(1)
		fillCardCredentials(false)
		depositWithdrawalPage
			.verifySomethingWentWrongErrorMessageDisplayed()
			.clickOnProceedTheTransactionsList()
			.clickOnRefreshUntilStatusNotChanged(0, commonConstant['confirmed'])
			.verifyOperationType(0, commonConstant['deposit'])
			.verifyOperationAmount(0, numbers['_30_string'])
			.verifyOperationStatus(0, commonConstant['confirmed'])
	})

	it('C2771: should check Deposit successfully completed using Bank Card', function() {
		navBarComponent.clickOnNavigationItem(navBarItems['deposit_withdrawal'])
		depositWithdrawalPage.verifyUrl(path['operations'])
		depositWithdrawalPage
			.setAmount(numbers['_30_string'])
			.clickOnDepositButton()
		paymentModal
			.verifyDepositModalDisplayed(numbers['_30_string'])
			.clickOnBankCardByIndex(2)
			.fillCardDetails()
			.closePaymentModal()
		depositWithdrawalPage
			.clickOnRefreshUntilStatusNotChanged(0, commonConstant['completed'])
			.verifyOperationType(0, commonConstant['deposit'])
			.verifyOperationAmount(0, numbers['_30_string'])
			.verifyOperationStatus(0, commonConstant['completed'])
	})

	it('C2772: should check Deposit successfully completed using Bank Card from Terminal', function() {
		tradingPage.tradingBalanceField().then(($balanceText) => {
			let balance = $balanceText.text()
			tradingPage
				.setDepositWithdraw(numbers['_30_string'])
				.clickOnDepositButton()
			paymentModal
				.verifyDepositModalDisplayed(numbers['_30_string'])
				.clickOnBankCardByIndex(2)
				.fillCardDetails()
				.closePaymentModal()
			navBarComponent.clickOnNavigationItem(navBarItems['deposit_withdrawal'])
			depositWithdrawalPage.verifyUrl(path['operations'])
			depositWithdrawalPage.clickOnRefreshUntilStatusNotChanged(0, commonConstant['completed'])
			navBarComponent.clickOnNavigationItem(navBarItems['trading'])
			tradingPage.verifyTradingBalance(parseFloat(balance) + 30)
		})
	})

	it.skip('C2773: should check Withdraw successfully completed using Bank Card from Terminal', function() {
		tradingPage.tradingBalanceField().then(($balanceText) => {
			let balance = $balanceText.text()
			tradingPage
				.setDepositWithdraw(numbers['_30_string'])
				.clickOnWithdrawButton()
			paymentModal
				.fillWithdrawCredentials()
				.closePaymentModal()
			navBarComponent.clickOnNavigationItem(navBarItems['deposit_withdrawal'])
			depositWithdrawalPage.verifyUrl(path['operations'])
			depositWithdrawalPage.clickOnRefreshUntilStatusNotChanged(0, commonConstant['completed']) //TODO why pending?
			navBarComponent.clickOnNavigationItem(navBarItems['trading'])
			tradingPage.verifyTradingBalance(parseFloat(balance) - 30)
		})
	})

	//TODO ask Arthur why country changed every day
	it.skip('C909: should check Withdraw successfully completed using Bank Card', function() {
		navBarComponent.clickOnNavigationItem(navBarItems['deposit_withdrawal'])
		depositWithdrawalPage.verifyUrl(path['operations'])
		depositWithdrawalPage
			.setAmount(numbers['_30_string'])
			.switchDepositWithdraw(commonConstant["withdraw"])
			.clickOnWithdrawButton()
		paymentModal
			.fillWithdrawCredentials()
			.closePaymentModal()
		depositWithdrawalPage
			.clickOnRefreshUntilStatusNotChanged(0, commonConstant['completed']) //TODO why pending?
			.verifyOperationType(0, commonConstant['withdrawal'])
			.verifyOperationAmount(0, numbers['_30_string'])
			.verifyOperationStatus(0, commonConstant['completed'])
	})
})