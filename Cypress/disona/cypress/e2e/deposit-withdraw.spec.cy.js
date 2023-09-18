import { Helper } from '../api_helpers/helper'
import { AccountsPage } from '../pages/accounts.page'
import { OperationsPage } from '../pages/operations.page'
import { TradingPage } from '../pages/trading.page'

describe('Deposit/Withdraw', () => {
	const { email, password } = Cypress.env()
	const accountsPage = new AccountsPage()
	const operationsPage = new OperationsPage()
	const tradingPage = new TradingPage()
	let newUserEmail

	beforeEach(() => {
		const title = Cypress.currentTest.title
		if (!title.includes('C2614')&&!title.includes('C2709')) {
			newUserEmail = Helper.getRandomEmail()
			cy.createUserAndLoginToDisona(newUserEmail, password)
		} else {
			cy.visit('/')
			cy.performLogin(email, password)
			cy.visit('/operations')
			operationsPage.clickRealAccountToggle({force: true})
		}
	})

	it('C2611: Demo account deposit', function () {
		tradingPage.getTradingBalance().should('have.text', '10000USD')
		cy.visit('/accounts')
		accountsPage.clickButtonByText('Create new demo Account')
		accountsPage.getNotificationMessageWithText('Added new account').should('be.visible')
		accountsPage.clickDepositWithdrawalLink()
		cy.location('pathname').should('eq', '/operations')
		operationsPage.clickRealAccountToggle()
		operationsPage.getActiveAccountToggle().should('have.text', 'Real')
		operationsPage.clickDemoAccountToggle()
		operationsPage.getActiveAccountToggle().should('have.text', 'Demo')
		operationsPage.clickAccountSelector()
		operationsPage.getAccountOptions().should('have.length', 2)
		operationsPage.getDepositAmountInput().should('have.value', '50.00').clear()
		operationsPage.typeInDepositAmountInput('100.00')
		operationsPage.clickButtonByText('Deposit Funds')
		operationsPage.getBalance().should('have.text.trimmed', '10100')
		operationsPage.getBalanceCurrency().should('have.text', 'USD')
		operationsPage.getHistoryTableValueByHeaderAndRowIndex('Amount', 0).should('have.text', '100USD')
		operationsPage.getHistoryTableValueByHeaderAndRowIndex('Status', 0).should('have.text', 'completed')
		operationsPage.clickCopyButtonByRowIndex(0)
		operationsPage.getNotificationMessageWithText('Copied to clipboard').should('be.visible')
		operationsPage.getWithdrawToggle().should('have.attr', 'disabled', 'disabled')
	})

	it('C2708: Amount field validation', function () {
		tradingPage.clickAccountsLink()
		accountsPage.createRealAccount()
		accountsPage.clickDepositWithdrawalLink()
		operationsPage.clickRealAccountToggle({force: true})
		operationsPage.getActiveAccountToggle().should('have.text', 'Real')
		const values = ['-100', '1', 'qwer1234$#$']
		values.forEach((value) => {
			operationsPage.getDepositAmountInput().clear()
			operationsPage.typeInDepositAmountInput(`${value}{enter}`)
			operationsPage.getDepositAmountInput().should('have.value', '10.00')
		})
	})

	it('C2614: Transaction list', function () {
		operationsPage.validateHistoryTableValues()
		operationsPage.clickDemoAccountToggle()
		operationsPage.validateHistoryTableValues()
	})

	it('C2709: Withdraw bigger than current balance', function() {
		operationsPage.clickWithdrawToggle()
		operationsPage.getWithdrawAmountInput().clear().type('9999999')
		operationsPage.getWithdrawButton().should('be.disabled')
	})
})
