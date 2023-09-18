import LoginPage from '../../../page_objects/pages/LoginPage'
import TradingPage from '../../../page_objects/pages/TradingPage'
import { assertion, numbers, path } from '../../../support/app-data'

describe('Order Tests (Demo)', () => {
	const loginPage = new LoginPage()
	const tradingPage = new TradingPage()
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
		cy.waitForLoader(30000)
		tradingPage.verifyPricingSectionOpen()
	})

	afterEach(() => {
		tradingPage.closeOpenOrder()
	})

	it('C465: should check buy order opening functionality', function() {
		tradingPage
			.setLimitOfInvestment(numbers['_30_string'])
			.clickOnBuyButton()
			.verifyMessage(assertion['order_open_success_message'])
			.clickOnCloseOrderButton()
			.verifyMessage(assertion['order_close_success_message'])
	})

	it('C466: should check sell order opening functionality', function() {
		tradingPage
			.setLimitOfInvestment(numbers['_30_string'])
			.clickOnSellButton()
			.verifyMessage(assertion['order_open_success_message'])
			.clickOnCloseOrderButton()
			.verifyMessage(assertion['order_close_success_message'])
	})

	it('C2750: should check pending order opening functionality', function() {
		tradingPage
			.clickOnShowFullFormButton()
			.clickOnOpenAtPriceCheckbox()
			.setOpenAtPrice(numbers['_100_string'])
			.clickOnBuyButton()
			.verifyMessage(assertion['order_open_success_message'])
			.clickOnShowOrderDetailsButton()
			.verifyOrderDetailsModalDisplayed()
			.verifyOpenWhenPrice(numbers['_100_string'])
			.clickOnCloseOrderDetailsModal()
			.clickOnCloseOrderButton()
			.verifyMessage(assertion['order_close_success_message'])
	})

	it('C475: should check order update form', function() {
		tradingPage
			.setLimitOfInvestment(numbers['_30_string'])
			.clickOnSellButton()
			.verifyMessage(assertion['order_open_success_message'])
			.clickOnOrderEditButton()
			.verifyOrderUpdateFormAllElementsDisplayed()
			.clickOnOrderEditCancelButton()
			.clickOnCloseOrderButton()
			.verifyMessage(assertion['order_close_success_message'])
	})

	it('C2751: should check order take profit can update successfully', function() {
		tradingPage
			.setLimitOfInvestment(numbers['_30_string'])
			.clickOnBuyButton()
			.verifyMessage(assertion['order_open_success_message'])
			.clickOnOrderEditButton()
			.verifyOrderUpdateFormAllElementsDisplayed()
			.setTakeProfit(numbers['_10000_string'])
			.clickOnOrderUpdateButton()
			.verifyMessage(assertion['order_update_success_message'])
			.clickOnShowOrderDetailsButton()
			.verifyOrderDetailsModalDisplayed()
			.verifyOrderDetailsModalTakeProfitValue(numbers['_10000_string'])
			.clickOnCloseOrderDetailsModal()
			.clickOnCloseOrderButton()
			.verifyMessage(assertion['order_close_success_message'])
	})

	it('C2752: should check order stop loss can update successfully', function() {
		tradingPage
			.setLimitOfInvestment(numbers['_30_string'])
			.clickOnBuyButton()
			.verifyMessage(assertion['order_open_success_message'])
			.clickOnOrderEditButton()
			.verifyOrderUpdateFormAllElementsDisplayed()
			.setStopLoss(numbers['_1000_string'])
			.clickOnOrderUpdateButton()
			.verifyMessage(assertion['order_update_success_message'])
			.clickOnShowOrderDetailsButton()
			.verifyOrderDetailsModalDisplayed()
			.verifyOrderDetailsModalStopLossValue(numbers['_1000_string'])
			.clickOnCloseOrderDetailsModal()
			.clickOnCloseOrderButton()
			.verifyMessage(assertion['order_close_success_message'])
	})

	it('C2753: should check order take profit Unset value', function() {
		tradingPage
			.setLimitOfInvestment(numbers['_30_string'])
			.clickOnBuyButton()
			.verifyMessage(assertion['order_open_success_message'])
			.clickOnShowOrderDetailsButton()
			.verifyOrderDetailsModalDisplayed()
			.verifyOrderDetailsModalTakeProfitValue('Unset')
			.clickOnCloseOrderDetailsModal()
			.clickOnCloseOrderButton()
			.verifyMessage(assertion['order_close_success_message'])
	})
})