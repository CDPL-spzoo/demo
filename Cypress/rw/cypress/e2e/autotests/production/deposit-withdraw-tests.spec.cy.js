import LoginPage from '../../../page_objects/pages/LoginPage'
import NavBarComponent from '../../../page_objects/pages/NavBarComponent'
import DepositWithdrawalPage from '../../../page_objects/pages/DepositWithdrawalPage'
import PaymentModal from "../../../page_objects/pages/modal/PaymentModal";
import { navBarItems, numbers, path } from '../../../support/app-data'

describe('Deposit/Withdraw Tests [Production]', () => {
	const loginPage = new LoginPage()
	const navBarComponent = new NavBarComponent()
	const depositWithdrawalPage = new DepositWithdrawalPage()
	const paymentModal = new PaymentModal()
	const {prodUsername, password} = Cypress.env()
	let cookies

	before(() => {
		cy.clearCookies()
		loginPage.openProduction(path['login'])
		cy.performLogin(prodUsername, password)
		cy.getCookies().then((res) => cookies=res)
	})

	beforeEach(() => {
		cy.setCookies(cookies)
		loginPage.openProduction(path['trading'])
		cy.waitForLoader()
	})

	it('C2774: should check Deposit modal open successfully form Deposit/Withdraw page', function() {
		navBarComponent.clickOnNavigationItem(navBarItems['deposit_withdrawal'])
		depositWithdrawalPage.verifyUrl(path['operations'])
		depositWithdrawalPage
			.setAmount(numbers['_10_string'])
			.clickOnDepositButton()
		paymentModal.verifyDepositModalDisplayed(numbers['_10_string'])
	})

	it('C2775: should check Bank Account and Crypto methods from Deposit/Withdraw page', function() {
		navBarComponent.clickOnNavigationItem(navBarItems['deposit_withdrawal'])
		depositWithdrawalPage.verifyUrl(path['operations'])
		depositWithdrawalPage
			.setAmount(numbers['_10_string'])
			.clickOnDepositButton()
		paymentModal
			.verifyDepositModalDisplayed(numbers['_10_string'])
			.verifyBankAccountAndCryptoDisplayed()
	})

	it('C2776: should check changing payment methods from Deposit/Withdraw page', function() {
		navBarComponent.clickOnNavigationItem(navBarItems['deposit_withdrawal'])
		depositWithdrawalPage.verifyUrl(path['operations'])
		depositWithdrawalPage
			.setAmount(numbers['_10_string'])
			.clickOnDepositButton()
		paymentModal
			.verifyDepositModalDisplayed(numbers['_10_string'])
			.verifyChangingPaymentMethods()
	})

	it('C2777: should check Bank Account required error message', function() {
		navBarComponent.clickOnNavigationItem(navBarItems['deposit_withdrawal'])
		depositWithdrawalPage.verifyUrl(path['operations'])
		depositWithdrawalPage
			.setAmount(numbers['_10_string'])
			.clickOnDepositButton()
		paymentModal
			.verifyDepositModalDisplayed(numbers['_10_string'])
			.verifyBankAccountRequiredErrorMessage();
	})

	it('C2778: should check Crypto details modal UI elements', function() {
		navBarComponent.clickOnNavigationItem(navBarItems['deposit_withdrawal'])
		depositWithdrawalPage.verifyUrl(path['operations'])
		depositWithdrawalPage
			.setAmount(numbers['_10_string'])
			.clickOnDepositButton()
		paymentModal
			.verifyDepositModalDisplayed(numbers['_10_string'])
			.verifyCryptoDetailsUIElements(numbers['_10_string']);
	})
})