import LoginPage from '../../../page_objects/pages/LoginPage'
import TradingPage from '../../../page_objects/pages/TradingPage'
import { commonConstant, currencyPairs, navBarItems, path } from '../../../support/app-data'
import NavBarComponent from '../../../page_objects/pages/NavBarComponent'

describe('Trading Base Tests (Demo)', () => {
	const loginPage = new LoginPage()
	const tradingPage = new TradingPage()
	const navBarComponent = new NavBarComponent()
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
	})

	it('C2754: should check chart open', function() {
		tradingPage.verifyChartOpen()
	})

	it('C2755: should check pricing section open', function() {
		tradingPage.verifyPricingSectionOpen()
	})

	it('C2756: should check terminal open', function() {
		tradingPage
			.verifyPricingSectionOpen()
			.verifyChartOpen()
	})

	it('C2757: should check demo/real switch functionality', function() {
		tradingPage.verifyAccountType(commonConstant['demo'])
		navBarComponent.clickOnDemoRealSwitchButton(commonConstant['real'])
		tradingPage.verifyAccountType(commonConstant['real'])
	})

	it.skip('should check real account without balance', function() {
		tradingPage.verifyPricingSectionOpen()
		navBarComponent.clickOnDemoRealSwitchButton(commonConstant['real'])
		tradingPage
			.verifyWithdrawButtonDisabled()
			.verifyBuyButtonDisabled()
			.verifySellButtonDisabled()
	})

	it('C491: should check currency pair (BTC/USD) changing functionality', function() {
		tradingPage
			.selectCurrencyPair(currencyPairs['btc_usd'])
			.verifyCurrencyPair(currencyPairs['btc_usd'])
	})

	it('C491: should check currency pair (EUR/USD) changing functionality', function() {
		tradingPage
			.selectCurrencyPair(currencyPairs['eur_usd'])
			.verifyCurrencyPair(currencyPairs['eur_usd'])
	})

	it('C935: should check currency pair not change after actions', function() {
		tradingPage
			.selectCurrencyPair(currencyPairs['eth_usd'])
			.verifyCurrencyPair(currencyPairs['eth_usd'])
		navBarComponent
			.clickOnNavigationItem(navBarItems['profile'])
			.clickOnDemoRealSwitchButton(commonConstant['demo'])
			.clickOnNavigationItem(navBarItems['trading'])
		tradingPage
			.verifyCurrencyPair(currencyPairs['eth_usd'])
			.selectCurrencyPair(currencyPairs['eur_usd'])
			.verifyCurrencyPair(currencyPairs['eur_usd'])
	})

	it('C492: should check chart Line and Candles options', function() {
		tradingPage
			.selectChartType(commonConstant['candles'])
			.verifyChartType(commonConstant['candles'])
		navBarComponent
			.clickOnNavigationItem(navBarItems['profile'])
			.clickOnDemoRealSwitchButton(commonConstant['demo'])
			.clickOnNavigationItem(navBarItems['trading'])
		tradingPage
			.selectChartType(commonConstant['line'])
			.verifyChartType(commonConstant['line'])
	})
})