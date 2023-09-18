import { Helper as apiHelper } from '../api_helpers/helper'
import { TradingPage } from '../pages/trading.page'
import { AccountsPage } from '../pages/accounts.page'
import { faker } from '@faker-js/faker'

describe('Account opening', () => {
	const { password } = Cypress.env()
	const tradingPage = new TradingPage()
	const accountsPage = new AccountsPage()
	let randomEmail

	beforeEach(() => {
		cy.clearLocalStorage()
		cy.clearCookies()
		randomEmail = apiHelper.getRandomEmail()
		cy.createUserAndLoginToDisona(randomEmail, password)
		tradingPage.clickAccountsLink()
	})

	it('C2609: Demo account opening/deleting', function () {
		accountsPage.getAccountsLink().should('have.attr', 'active', 'true')
		accountsPage.getDemoAccountsTable().within(() => {
			accountsPage.clickRemoveButtonByRow(0)
		})
		accountsPage
			.getNotificationMessageWithText("You can't delete account because there is money in it")
			.should('be.visible')
		accountsPage.getButtonByText('Create new demo Account').should('not.be.disabled')
		accountsPage.clickButtonByText('Create new demo Account')
		accountsPage.getNotificationMessageWithText('Added new account').should('be.visible')
		accountsPage.getDemoAccountsTable().within(() => {
			accountsPage.getAccountsRows().its('length').should('eq', 2)
			accountsPage.getTableValueByColumnHeaderAndRowIndex('balance', 1).should('have.text', '10000.00 USD')
		})
		accountsPage.getButtonByText('Create new demo Account').should('be.disabled')
	})

	it('C2610: Changing account name', function () {
		const randomName = faker.name.lastName()
		accountsPage.createRealAccount()
		accountsPage.getDemoAccountsTable().within(() => {
			accountsPage.clickOnEditNameByRow(0)
			accountsPage.getEditNameInput().clear().type(randomName)
			accountsPage.clickButtonByText('Ok')
			accountsPage.getAccountNameField().should('have.text', randomName)
		})
		accountsPage.getRealAccountsTable().within(() => {
			accountsPage.clickOnEditNameByRow(0)
			accountsPage.getEditNameInput().clear().type(randomName)
			accountsPage.clickButtonByText('Ok')
			accountsPage.getAccountNameField().should('have.text', randomName)
		})
		accountsPage.clickTradingLink()
		tradingPage.getTradingBalance().should('have.text', '10000USD')
		tradingPage.getAccountName().should('have.text', randomName)
		tradingPage.clickAccountDropdown()
		tradingPage.selectAccountType('real')
		tradingPage.getTradingBalance().should('have.text', '0USD')
		tradingPage.getAccountName().should('have.text', randomName)

	})

	it('C2608: Real account opening/deleting', function () {
		accountsPage.getButtonByText('Create new Real Account').should('not.be.disabled')
		accountsPage.clickButtonByText('Create new Real Account')
		accountsPage.selectLeverage('1:100')
		accountsPage.clickButtonByText('create')
		accountsPage.getNotificationMessageWithText('Added new account').should('be.visible')
		accountsPage.getRealAccountsTable().within(() => {
			accountsPage.getAccountsRows().its('length').should('eq', 1)
			accountsPage.getTableValueByColumnHeaderAndRowIndex('balance', 0).should('have.text', '0.00 USD')
		})
		accountsPage.getButtonByText('Create new Real Account').should('not.be.disabled')
		accountsPage.clickButtonByText('Create new Real Account')
		accountsPage.selectLeverage('1:100')
		accountsPage.clickButtonByText('create')
		accountsPage.getNotificationMessageWithText('Added new account').should('be.visible')
		accountsPage.getButtonByText('Create new Real Account').should('be.disabled')
		accountsPage.getRealAccountsTable().within(() => {
			accountsPage.getAccountsRows().its('length').should('eq', 2)
			accountsPage.getTableValueByColumnHeaderAndRowIndex('balance', 1).should('have.text', '0.00 USD')
		})
	})

	it('C2702: Account name field validation', function () {
		const longAccountName = faker.random.alpha(100).toLowerCase()
		accountsPage.createRealAccount()
		accountsPage.getDemoAccountsTable().within(() => {
			accountsPage.clickOnEditNameByRow(0)
			accountsPage.getEditNameInput().clear().type(longAccountName)
			accountsPage.clickButtonByText('Ok')
			accountsPage
				.getAccountNameField()
				.should('have.text', longAccountName)
				.find('span')
				.should('have.css', 'max-width', '200px')
				.and('have.css', 'overflow', 'hidden')
				.and('have.css', 'text-overflow', 'ellipsis')
		})
		accountsPage.getRealAccountsTable().within(() => {
			accountsPage.clickOnEditNameByRow(0)
			accountsPage.getEditNameInput().clear().type(longAccountName)
			accountsPage.clickButtonByText('Ok')
			accountsPage
				.getAccountNameField()
				.should('have.text', longAccountName)
				.find('span')
				.should('have.css', 'max-width', '200px')
				.and('have.css', 'overflow', 'hidden')
				.and('have.css', 'text-overflow', 'ellipsis')
		})
	})

	it('C2701: Deleting account with not empty balance', function () {
		accountsPage.createRealAccount()
		accountsPage.getRealAccountsTable().within(() => {
			accountsPage.getAccountsRows().its('length').should('eq', 1)
			accountsPage.getTableValueByColumnHeaderAndRowIndex('balance', 0).should('have.text', '0.00 USD')
			accountsPage.clickRemoveButtonByRow(0)
		})
		accountsPage.getNotificationMessageWithText('Account deleted')
		accountsPage.getDemoAccountsTable().within(() => {
			accountsPage.getAccountsRows().its('length').should('eq', 1)
			accountsPage.getTableValueByColumnHeaderAndRowIndex('balance', 0).should('have.text', '10000.00 USD')
			accountsPage.clickRemoveButtonByRow(0)
		})
		accountsPage.getNotificationMessageWithText("You can't delete account because there is money in it")
	})

	it('C2704: Maximum available demo accounts', function () {
		accountsPage.getCreateDemoAccountButton().should('not.be.disabled').click()
		accountsPage.getNotificationMessageWithText('Added new account').should('be.visible')
		accountsPage.getDemoAccountsTable().within(() => {
			accountsPage.getAccountsRows().its('length').should('eq', 2)
			accountsPage.getTableValueByColumnHeaderAndRowIndex('balance', 1).should('have.text', '10000.00 USD')
		})
		accountsPage.getCreateDemoAccountButton().should('be.disabled').click({ force: true })
		accountsPage.getDemoAccountsTable().within(() => {
			accountsPage.getAccountsRows().its('length').should('eq', 2)
		})
	})

	it('C2705: Maximum available real accounts', function () {
		accountsPage.getCreateRealAccountButton().should('not.be.disabled').click()
		accountsPage.clickButtonByText('create')
		accountsPage.getNotificationMessageWithText('Added new account').should('be.visible')
		accountsPage.clickCloseNotificationMessageButton()
		accountsPage.clickCreateRealAccountButton()
		accountsPage.clickButtonByText('create')
		accountsPage.getNotificationMessageWithText('Added new account').should('be.visible')
		accountsPage.getRealAccountsTable().within(() => {
			accountsPage.getAccountsRows().its('length').should('eq', 2)
		})
		accountsPage.getCreateRealAccountButton().should('be.disabled').click({ force: true })
		accountsPage.getNotificationMessageWithText('Added new account').should('not.exist')
		accountsPage.getRealAccountsTable().within(() => {
			accountsPage.getAccountsRows().its('length').should('eq', 2)
		})
	})

	it('C2703: Error message when deleting account with balance', function () {
		accountsPage.getDemoAccountsTable().within(() => {
			accountsPage.clickRemoveButtonByRow(0)
		})
		accountsPage
			.getNotificationMessageWithText("You can't delete account because there is money in it")
			.should('be.visible')
	})

	it('C2700: Demo account opening', function() {
		accountsPage.clickCreateDemoAccountButton()
		accountsPage.getNotificationMessageWithText('Added new account').should('be.visible')
		accountsPage.getDemoAccountsTable().within(() => {
			accountsPage.getAccountsRows().its('length').should('eq', 2)
			accountsPage.getTableValueByColumnHeaderAndRowIndex('balance', 1).should('have.text', '10000.00 USD')
		})
		accountsPage.clickTradingLink()
		tradingPage.getTradingBalance().should('have.length', 2).each(balance => {
			cy.wrap(balance, {log: false}).should('have.text', '10000USD')
		})
		tradingPage.getAccountName().should('have.length', 2).each(name => {
			cy.wrap(name, {log: false}).should('have.text', 'Demo')
		})
	})
})
