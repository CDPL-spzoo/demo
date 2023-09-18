import LoginPage from '../../../page_objects/pages/LoginPage'
import TradingPage from '../../../page_objects/pages/TradingPage'
import NavBarComponent from '../../../page_objects/pages/NavBarComponent'
import { commonConstant, currencyPairs, navBarItems, path } from '../../../support/app-data'

describe('Trading Base Tests (Real)', () => {
	const loginPage = new LoginPage()
	const tradingPage = new TradingPage()
	const navBarComponent = new NavBarComponent()
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
		navBarComponent.clickOnDemoRealSwitchButton(commonConstant['real'])
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

	it('C2758: should check Withdraw button enabled', function() {
		tradingPage.verifyWithdrawButtonEnabled()
	})

	it('C2759: should check Deposit/Withdraw disabled', function() {
		tradingPage
			.depositWithdrawInputField().clear()
		tradingPage
			.verifyDepositButtonDisabled()
			.verifyWithdrawButtonDisabled()
	})

	it('C2760: should check Limit of investment enabled', function() {
		tradingPage.verifyLimitOfInvestmentEnabled()
	})

	it('C2761: should check buy/sell buttons enabled', function() {
		tradingPage
			.verifyPricingSectionOpen()
			.verifyBuyButtonEnabled()
			.verifySellButtonEnabled()
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

	it('C492: should check chart Line and Candles options', function() {
		tradingPage
			.selectChartType(commonConstant['candles'])
			.verifyChartType(commonConstant['candles'])
		navBarComponent
			.clickOnNavigationItem(navBarItems['profile'])
			.clickOnNavigationItem(navBarItems['trading'])
		tradingPage
			.selectChartType(commonConstant['line'])
			.verifyChartType(commonConstant['line'])
	})
})