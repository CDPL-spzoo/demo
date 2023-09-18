import { Helper } from '../api_helpers/helper'
import { TradingPage } from '../pages/trading.page'
import { AccountsPage } from '../pages/accounts.page'
import {faker} from "@faker-js/faker";

describe('Trading page', () => {
	const tradingPage = new TradingPage()
	const accountsPage = new AccountsPage()
	const { password } = Cypress.env()
	let randomEmail
	let cookies
	const accounts = ['Demo', 'Trading']

	before(() => {
		cy.clearCookies()
		randomEmail = Helper.getRandomEmail()
		cy.createUserAndLoginToDisona(randomEmail, password)
		tradingPage.getTradingBalance().should('contain.text', '10000USD')
		tradingPage.clickAccountsLink()
		accountsPage.clickButtonByText('Create new Real Account')
		accountsPage.clickButtonByText('create')
		accountsPage.getNotificationMessageWithText('Added new account')
			.should('be.visible')
		cy.getCookies().then(res => cookies = res)

	})

	it('C2626: Demo/real account changing', function () {
		cy.setCookies(cookies)
		cy.visit('/')
		tradingPage.getTradingBalance().should('have.text', '10000USD')
		accountsPage.clickTradingLink()
		cy.waitForLoader()
		tradingPage.getAccountContainers().should('have.length', 1)
		tradingPage.getAccountName().should('have.text', 'Demo')
		tradingPage.clickAccountDropdown()
		tradingPage.selectAccountType('real')
		cy.waitForLoader()
		tradingPage.getAccountContainers().should('have.length', 1)
		tradingPage.getAccountName().should('have.text', 'Trading')
		tradingPage.clickAccountDropdown()
		tradingPage.selectAccountType('all')
		cy.waitForLoader()
		tradingPage.getAccountContainers().should('have.length', 2)
			.each((container, index) => {
				cy.wrap(container, { log: false }).within(() => {
					tradingPage.getAccountName().should('have.text', accounts[index])
				})
			})
	})

	it('C2627: Logout', function() {
		cy.clearCookies()
		cy.visit('/')
		cy.performLogin(randomEmail, password)
		cy.location('pathname').should('eq', '/trading')
		cy.waitForLoader()
		tradingPage.getTradingBalance().should('have.text', '10000USD')
		tradingPage.clickLogOutButton()
		cy.waitForLoader()
		cy.location('pathname').should('eq', '/login')
	})

	it('C2624: Chart type', function() {
		cy.clearCookies()
		cy.visit('/')
		cy.performLogin(randomEmail, password)
		cy.location('pathname').should('eq', '/trading')
		cy.waitForLoader()
		tradingPage
			.selectChartType('Candles')
			.selectChartType('Line')
	})

	it('C2625: Time frame', function() {
		cy.clearCookies()
		cy.visit('/')
		cy.performLogin(randomEmail, password)
		cy.location('pathname').should('eq', '/trading')
		cy.waitForLoader()
		tradingPage
			.selectTimeFrame('1 min')
			.selectTimeFrame('5 min')
			.selectTimeFrame('15 min')
			.selectTimeFrame('30 min')
			.selectTimeFrame('1 hour')
			.selectTimeFrame('4 hour')
			.selectTimeFrame('1 day')
			.selectTimeFrame('1 week')
			.selectTimeFrame('1 month')
			.selectTimeFrame('1 min')
	})

	it('C2623:  Instrument types', function() {
		cy.clearCookies()
		cy.visit('/')
		cy.performLogin(randomEmail, password)
		cy.location('pathname').should('eq', '/trading')
		cy.waitForLoader()
		tradingPage
			.selectInstrument('BTC / USD')
			.selectInstrument('LTC / USD')
			.selectInstrument('EUR / USD')
			.selectInstrument('ETH / USD')
			.selectInstrument('BTC / USD')
	})

	it('C2800:  Check user able to search instruments', function() {
		cy.clearCookies()
		cy.visit('/')
		cy.performLogin(randomEmail, password)
		cy.location('pathname').should('eq', '/trading')
		cy.waitForLoader()
		tradingPage
			.searchInstrument('ETH / USD')
	})

	it('C2811: Check "There are no instruments in the selected category" message', function() {
		cy.clearCookies()
		cy.visit('/')
		cy.performLogin(randomEmail, password)
		cy.location('pathname').should('eq', '/trading')
		cy.waitForLoader()
		tradingPage
			.verifyNoInstrumentsSelectedMessage(faker.random.word())
	})

	it('C2799: Check user able to add instruments in "MY FAVORITES" section', function() {
		cy.clearCookies()
		cy.visit('/')
		cy.performLogin(randomEmail, password)
		cy.location('pathname').should('eq', '/trading')
		cy.waitForLoader()
		tradingPage
			.searchInstrument('ETH / USD')
			.clickOnFavoriteInstrumentButton(0)
			.openMyFavoritesSection()
			.getInstrumentName().should('have.text', 'ETH / USD')
	})
})
