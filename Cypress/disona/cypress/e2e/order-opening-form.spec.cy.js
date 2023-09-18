import { Helper } from '../api_helpers/helper'
import { TradingPage } from '../pages/trading.page'

describe('Order opening form', () => {
	const tradingPage = new TradingPage()
	const { password } = Cypress.env()
	let email
	const lot = {
		medium: 85,
		min: 0.1,
		high: 170,
		veryHigh: 310,
	}
	const incorrectStoplossOrtakeprofitMessage =
		'Incorrect stoploss or takeprofit.' +
		' Please check the difference between the current price, Stop Loss and Take Profit.'

	beforeEach(() => {
		cy.intercept('POST', '**/acuity', ).as('acuity')
		email = Helper.getRandomEmail()
		cy.createUserAndLoginToDisona(email, password)
	})

	it('C2618: BUY/SELL orders', function () {
		tradingPage.getTradingBalance().should('have.text', '10000USD')
		Object.keys(lot).forEach((volume) => {
			tradingPage.moveSlider(lot[volume])
			tradingPage.clickBuyButton()
			tradingPage.getNotificationMessageWithText('Order opened successfully').should('be.visible')
			tradingPage.clickCloseNotificationMessageButton()
			tradingPage.clickCloseOrderButton()
			cy.contains(/^No orders$/).should('be.visible')
			tradingPage.clickOpenOrderButton()
			tradingPage.moveSlider(lot[volume])
			tradingPage.clickSellButton()
			tradingPage.getNotificationMessageWithText('Order opened successfully').should('be.visible')
			tradingPage.clickCloseNotificationMessageButton()
			tradingPage.clickCloseOrderButton()
			cy.contains(/^No orders$/).should('be.visible')
			tradingPage.clickNewTab()
		})
	})

	it('C2622: History', function () {
		tradingPage.clickHistoryTab()
		tradingPage.getHistoryItems().should('not.exist')
		cy.contains(/^You have seen it all!$/).should('be.visible')
		tradingPage.clickNewTab()
		tradingPage.openAndCloseOrder('min')
		tradingPage.clickHistoryTab()
		cy.contains(/^You have seen it all!$/).should('be.visible')
		tradingPage.waitForHistoryUpdate()
			.should('have.length', 1)
			.and('contain.text', 'BUY')
		tradingPage.getHistoryInfoBox().should('be.visible')
		for (let param of ['Volume', 'Price', 'SL / TP']) {
			tradingPage.getHistoryInfoByLabel(param).should('be.visible')
		}
		tradingPage.clickHistoryExpanderButton()
		for (let param of ['Closed price', 'Time', 'Commission', 'Swap']) {
			tradingPage.getHistoryInfoByLabel(param).should('be.visible')
		}
	})

	it('C2620: Edit orders', function () {
		tradingPage.clickButtonByText('Crypto')
		tradingPage.clickBTCUSDInstrument()
		tradingPage.getCurrentInstrumentSelector().should('have.text', 'BTC / USD')
		tradingPage.moveSlider(lot.medium)
		tradingPage.clickBuyButton()
		tradingPage.getNotificationMessageWithText('Order opened successfully').should('be.visible')
		tradingPage.clickEditOrderButton()
		tradingPage.getInputByLabel('Close Volume').clear().type('200')
		tradingPage.clickUpdateOrderButton()
		tradingPage
			.getNotificationMessageWithText('An error occurred when closing the order. Please try again later')
			.should('be.visible')
		tradingPage.clickEditOrderButton()
		tradingPage.getOrderVolume().invoke('text').then((volume) => {
				tradingPage.getInputByLabel('Close Volume').clear().type(+volume - 0.1)
				tradingPage.clickUpdateOrderButton()
				tradingPage.getOrderVolume().invoke('text').should('be.oneOf', ['0.1', '0.1001'])
			})
		tradingPage.clickEditOrderButton()
		tradingPage.getInputByLabel('Take Profit').type('1000000')
		tradingPage.getInputByLabel('Stop Loss').clear()
		tradingPage.clickUpdateOrderButton()
		tradingPage.getOrderValueByLabel('Take Profit').should('have.text', '1000000.00')
		tradingPage.clickEditOrderButton()
		tradingPage.getInputByLabel('Take Profit').clear().type('1')
		tradingPage.clickUpdateOrderButton()
		tradingPage.getNotificationMessageWithText(incorrectStoplossOrtakeprofitMessage).should('be.visible')
		tradingPage.getOrderValueByLabel('Take Profit').should('have.text', '1000000.00')
		tradingPage.clickEditOrderButton()
		tradingPage.getInputByLabel('Stop Loss').type('1000000')
		tradingPage.getInputByLabel('Take Profit').clear()
		tradingPage.clickUpdateOrderButton()
		tradingPage.getNotificationMessageWithText(incorrectStoplossOrtakeprofitMessage).should('be.visible')
		tradingPage.getOrderValueByLabel('Take Profit').should('have.text', '1000000.00')
		tradingPage.getOrderValueByLabel('Stop Loss').should('have.text', 'Unset')
		tradingPage.clickEditOrderButton()
		tradingPage.getInputByLabel('Stop Loss').type('1')
		tradingPage.getInputByLabel('Take Profit').clear()
		tradingPage.clickUpdateOrderButton()
		tradingPage.getOrderValueByLabel('Take Profit').should('have.text', 'Unset')
		tradingPage.getOrderValueByLabel('Stop Loss').should('have.text', '1.00')
		tradingPage.clickCloseOrderButton()
		cy.contains(/^No orders$/).should('be.visible')
	})

	it('C2619: Pending orders', function () {
		for (let category of ['Crypto', 'Forex', 'Commodities', 'Indices', ]){
			tradingPage.clickInstrumentCategoryTab(category)
			tradingPage.clickInstrumentByIndex(1)
			cy.waitForLoader(40000)
			tradingPage.clickExpandButton()
			tradingPage.getNewOrderDropdown().should('be.visible')
			tradingPage.clickToggleByLabel('open at price')
			tradingPage.getInputByLabel('open at price').clear().type('999999')
			tradingPage.clickBuyButton()
			tradingPage.clickPendingTab()
			tradingPage.getOrders().should('have.length', 1)
			for (let label of ['Last updated', 'Current price', 'Take Profit', 'Stop Loss', 'Volume', 'Open when price']) {
				tradingPage.getOrderValueByLabel(label).should('be.visible')
			}
			tradingPage.getOrderValueByLabel('Open when price').invoke('text')
				.then(num => expect(+num).to.eq(999999))
			tradingPage.clickButtonByText('Cancel')
			tradingPage.clickNewTab()
		}
	})

	it('C2621: Signals', function() {
		tradingPage.clickSignalsTab()
		cy.waitForLoader()
		tradingPage.clickSignalByIndex(0)
		tradingPage.getAgreementForm().should('be.visible')
		tradingPage.getAgreementTitle().should('have.text', 'Accept agreement to see signal details')
		tradingPage.clickButtonByText('I Accept')
		tradingPage.getNewSignalForm().should('be.visible')
		tradingPage.getSignalFormTitle().should('have.text.trimmed', 'YOUR DISONA SIGNAL IS')
		tradingPage.moveSlider(lot.high)
		tradingPage.getInputByLabel('Choose your investment sum:').invoke('val')
			.then(investmentSum => expect(+investmentSum).to.be.greaterThan(3400))
		tradingPage.getNewSignalMarketId().then(marketIdName =>
			tradingPage.getSignalDetails(marketIdName).as('report'))
		cy.get('@report').then((report) => {
			let entryTarget
			if (report.action_text === 'SELL') entryTarget = report.sell_entry_target_1
			else entryTarget = report.buy_entry_target_1
			tradingPage.getInputByLabel('Stop loss price is:').invoke('val')
				.then(val => expect(+val).to.be.eq(report.stop))
			tradingPage.getInputByLabel('Open when the price is:').invoke('val')
				.then(val => expect(+val).to.be.eq(entryTarget))
			tradingPage.getSignalFormBadge().invoke('text').invoke('toLowerCase')
				.then(actionType =>
				tradingPage.clickSignalFormByButton(actionType))
			tradingPage.getOrderValueByLabel('Stop Loss').invoke('text')
				.then(val => expect(+val).to.be.eq(report.stop))
			tradingPage.getOrderValueByLabel('Open when price').invoke('text')
				.then(val => expect(+val).to.be.eq(entryTarget))
		})
		tradingPage.clickButtonByText('Cancel')
	})

	it('C2812: Open sell order with major instrument minimum volume', function () {
		tradingPage.clickExpandButton()
		tradingPage.setVolume('0.01')
		tradingPage.clickSellButton()
		tradingPage.getNotificationMessageWithText('Order opened successfully').should('be.visible')
		tradingPage.clickCloseNotificationMessageButton()
		tradingPage.clickCloseOrderButton()
		cy.contains(/^No orders$/).should('be.visible')
	});

	it('C2813: Open buy order with major instrument minimum volume', function () {
		tradingPage.clickExpandButton()
		tradingPage.setVolume('0.01')
		tradingPage.clickBuyButton()
		tradingPage.getNotificationMessageWithText('Order opened successfully').should('be.visible')
		tradingPage.clickCloseNotificationMessageButton()
		tradingPage.clickCloseOrderButton()
		cy.contains(/^No orders$/).should('be.visible')
	});

	it('C2814: Open sell order with minor instrument minimum volume', function () {
		tradingPage.selectInstrument('AUD / JPY')
		tradingPage.clickExpandButton()
		tradingPage.setVolume('0.01')
		tradingPage.clickSellButton()
		tradingPage.getNotificationMessageWithText('Order opened successfully').should('be.visible')
		tradingPage.clickCloseNotificationMessageButton()
		tradingPage.clickCloseOrderButton()
		cy.contains(/^No orders$/).should('be.visible')
	});

	it('C2815: Open buy order with minor instrument minimum volume', function () {
		tradingPage.selectInstrument('AUD / JPY')
		tradingPage.clickExpandButton()
		tradingPage.setVolume('0.01')
		tradingPage.clickBuyButton()
		tradingPage.getNotificationMessageWithText('Order opened successfully').should('be.visible')
		tradingPage.clickCloseNotificationMessageButton()
		tradingPage.clickCloseOrderButton()
		cy.contains(/^No orders$/).should('be.visible')
	});

	it('C2816: Open sell order with crypto instrument minimum volume', function () {
		tradingPage.selectInstrument('ETH / USD')
		tradingPage.clickExpandButton()
		tradingPage.setVolume('0.01')
		tradingPage.clickSellButton()
		tradingPage.getNotificationMessageWithText('Order opened successfully').should('be.visible')
		tradingPage.clickCloseNotificationMessageButton()
		tradingPage.clickCloseOrderButton()
		cy.contains(/^No orders$/).should('be.visible')
	});

	it('C2817: Open buy order with crypto instrument minimum volume', function () {
		tradingPage.selectInstrument('BTC / USD')
		tradingPage.clickExpandButton()
		tradingPage.setVolume('0.01')
		tradingPage.clickBuyButton()
		tradingPage.getNotificationMessageWithText('Order opened successfully').should('be.visible')
		tradingPage.clickCloseNotificationMessageButton()
		tradingPage.clickCloseOrderButton()
		cy.contains(/^No orders$/).should('be.visible')
	});
})
