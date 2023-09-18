import { BasePage } from './base.page'
import { recurse } from 'cypress-recurse'

const accountContainer = '[class*="TradingShowAccountdisonastyled__Outer"]'
const accountName = '[class*="TradingShowAccountdisonastyled__AccountName"]'
const slider = '.rc-slider-rail'
const BTCUSDInstrument = '[id="BTCUSD.ds"]'
const currentInstrumentSelect = '[class*="styleddisona__ChartContainer"] .rwSelect__value-container'
const volume = '[class*="styled__Volume"]'
const historyInfoBox = '[class*="styled__InfoBox"]'
const historyExpandButton = '[class*="styled__TriggerButton"]'
const expandButton = 'button[class*="style__ExpandButton"][id*="react-collapsed-toggle"]'
const newOrderDropdown = 'section[id*="react-collapsed-panel"]'
const toggles = '[class*="styled__ToggleButton"]'
const orderContainer = '[class*="OrderListWrapper"] [class*="styled__Container-sc-7"]'
const instrumentItem = 'tbody>tr'
const instrumentCategory = '[class*="style__Category"]'
const signalsTab = '[data-testid="trading-signals-tab"]'
const signalFormTitle = '[class*="signalstyle__Title-"]'
const allSignalsContainer = '[data-testid="history-all-orders"]'
const newSignalForm = '[class*="signalstyle__Form"]'
const agreementForm = '[class*="style__Modal-"]:contains("Accept agreement to see signal details")'
const agreementTitle = '[class*="style__Modal-"] section[class*="style__Title-"]'
const signalFormImg = '[class*="signalstyle__Container"] img'
const signalFormBadge = '[class*="signalstyle__Badge"]'
const historyItems = '[class*="HistoryOuterContainer"] [class*="Container"]:contains("Volume")'
const timeFrameSelectField = 'div[class*="trading"] div[class$="singleValue"]'
const instrumentsSelectField = 'div[class^="Grid__Row"] input[id^="react-select"]'
const instrumentsSearchField = 'input[class*="SearchInput"]'
const volumeInputField = '//*[text()="volume"]/following-sibling::input'
const favoriteInstrumentButtons = '[class*="FavoriteButton"]'
const myFavoritesItem = '//*[text()="My favorites"]'

export class TradingPage extends BasePage {

	getVerifyAccountButton = () => cy.contains(/^Verify account$/)
	clickVerifyAccountButton = () => this.getVerifyAccountButton().click()
	getTradingBalance = () =>
		cy.xpath('//*[text()="Trading balance"]/following-sibling::div|//*[text()="Trading balance"]/div')
	getBalanceCurrency = () => this.getTradingBalance().children('div')
	getAccountContainers = () => cy.get(accountContainer)
	getAccountName = () => cy.get(accountName)
	getAccountsDropdown = () => cy.xpath('//p[text()="Accounts:"]/following-sibling::div')
	clickAccountDropdown = () => this.getAccountsDropdown().click()
	selectAccountType = (type) => cy.get(`[class*="styled__Option-"]:contains("${type.toUpperCase()}")`).click()
	getCloseOrderButton = () => cy.xpath('//button[text()="Close Order"]')
	clickCloseOrderButton = () => this.getCloseOrderButton().click()
	getEditOrderButton = () => cy.xpath('//button[text()="Edit"]')
	clickEditOrderButton = () => this.getEditOrderButton().click()
	getUpdateOrderButton = () => cy.xpath('//button[text()="Update"]')
	clickUpdateOrderButton = () => this.getUpdateOrderButton().click()
	getOpenOrderButton = () => cy.xpath('//button[text()="Open Order"]')
	clickOpenOrderButton = () => this.getOpenOrderButton().click()
	getOrders = () => cy.get(orderContainer)
	setVolume = (volumeQuantity) => cy.xpath(volumeInputField).clear().type(volumeQuantity);
	// tabs
	getNewTab = () => cy.xpath('//*[text()="New"]')
	clickNewTab = () => this.getNewTab().click()
	getHistoryTab = () => cy.xpath('//*[text()="history"]')
	clickHistoryTab = () => this.getHistoryTab().click()
	//history
	getHistoryItems = () => cy.get(this.historyItems)
	getHistoryInfoBox = () => cy.get(historyInfoBox)
	getHistoryInfoByLabel = (label) => cy.get('p', { log: false }).contains(new RegExp(`^${label}$`))
	clickHistoryExpanderButton = () => cy.get(historyExpandButton).click()

	// instruments
	getBTCUSDInstrument = () => cy.get(BTCUSDInstrument)
	clickBTCUSDInstrument = () => this.getBTCUSDInstrument().click()
	getCurrentInstrumentSelector = () => cy.get(currentInstrumentSelect)
	getAllInstruments = () => cy.get(instrumentItem)
	clickInstrumentByIndex = (index) => this.getAllInstruments().eq(index).click()
 	getInstrumentCategoryTabByTitle = (title) => cy.get(`${instrumentCategory}:contains("${title}")`)
	clickInstrumentCategoryTab = (title) => this.getInstrumentCategoryTabByTitle(title).click()
	getInstrumentName = () => cy.get(instrumentItem + ' p')
	// edit
	getInputByLabel = (label) => cy.xpath(`//*[text()="${label}"]/following-sibling::input`)
	getOrderVolume = () => cy.get(volume)
	// openTab
	getOrderValueByLabel = (label) => cy.xpath(`//*[text()="${label}"]/following-sibling::div`)
	//new order tab
	clickExpandButton = () => cy.get(expandButton).click()
	getBuyButton = () => cy.get('button:contains("buy:")')
	clickBuyButton = () => this.getBuyButton().click()
	getSellButton = () => cy.get('button:contains("sell:")')
	clickSellButton = () => this.getSellButton().click()
	moveSlider = (pixelsFromStart) => cy.get(slider).click(pixelsFromStart, 1, { force: true })
	getNewOrderDropdown = () => cy.get(newOrderDropdown)
	clickToggleByLabel = (label) =>
		cy.xpath(`//*[text()="${label}"]`)
			.parent('[class*="styled__Wrapper"]')
			.parent('[class*="styled__Wrapper"]').find(toggles).click()
	// Pending tab
	clickPendingTab = () => cy.xpath(`//*[text()="Pending"]`)
	//signals tab
	clickSignalsTab = () => cy.get(signalsTab).click()
	getAllSignals = () => cy.get(`${allSignalsContainer} [class*="style__Row"]`)
	getSignalByIndex = (index) => this.getAllSignals().eq(index)
	clickSignalByIndex = (index) => this.getSignalByIndex(index).click()
	clickSignalByMarketIdName = (marketId) =>
		cy.get(`${allSignalsContainer} [alt="${marketId}"]`).parents('[class*="style__Row"]:visible').click()
	getAgreementForm = () => cy.get(agreementForm)
	getAgreementTitle = () => cy.get(agreementTitle)
	getNewSignalForm = () => cy.get(newSignalForm)
	getSignalFormTitle = () => cy.get(signalFormTitle)
	clickSignalFormByButton = (text) => cy.get(`button:contains("${text}")`).click()
	getNewSignalMarketId = () => cy.get(signalFormImg).invoke('attr', 'alt')
	getSignalFormBadge = () => cy.get(signalFormBadge)

	//chart
	selectChartType = (type) => {
		cy.xpath(`//*[text()="${type}"]`).should('be.visible').click()
		cy.xpath(`//*[text()="${type}"]`).should('have.css', 'color', 'rgb(0, 164, 175)')
		return this;
	}

	selectTimeFrame = (timeFrame) => {
		cy.get(timeFrameSelectField).should('be.visible').click()
		cy.xpath(`//*[contains(@id, 'option') and text()='${timeFrame}']`).should('be.visible').click()
		cy.get(timeFrameSelectField).should('have.text', timeFrame);
		return this;
	}

	selectInstrument = (instrument) => {
		cy.get(instrumentsSelectField).parent().should('be.visible').click({force : true})
		cy.get(instrumentsSelectField).type(instrument)
		cy.wait(500)
		cy.xpath(`//*[contains(@id, 'option')]//div/span[text()='${instrument}']`)
			.should('be.visible').click()
		return this;
	}

	searchInstrument = (instrument) => {
		cy.get(instrumentsSearchField).should('be.visible').clear().type(instrument)
		this.getInstrumentName().should('be.visible').and('have.text', instrument)
		return this;
	}

	clickOnFavoriteInstrumentButton = (index) => {
		cy.get(favoriteInstrumentButtons).eq(index).should('be.visible').click()
		return this;
	}

	openMyFavoritesSection = () => {
		cy.xpath(myFavoritesItem).should('be.visible').click();
		return this;
	}

	verifyNoInstrumentsSelectedMessage = (instrument) => {
		cy.get(instrumentsSearchField).should('be.visible').clear().type(instrument)
		cy.get('[class*="EmptyCategoryText"]').should('have.text', 'There are no instruments in the selected category')
		return this;
	}

	//agreement form
	openAndCloseOrder = (lotVolume = 'medium', type = 'buy') => {
		const lot = {
			medium: 85,
			min: 0.1,
			high: 170,
			veryHigh: 310,
		}
		this.moveSlider(lot[lotVolume])
		if (type === 'buy') this.clickBuyButton()
		else this.clickSellButton()
		this.getNotificationMessageWithText('Order opened successfully').should('be.visible')
		this.clickCloseNotificationMessageButton()
		this.clickCloseOrderButton()
		cy.contains(/^No orders$/).should('be.visible')
	}
	getSignalDetails = (marketIdName) => {
		let report
		cy.get('@acuity.all').each(res => {
			const filtered = res.response?.body.filter(asset => asset.Report?.market_id)
			if (filtered?.length) {
				for (let item of filtered) {
					let marketId = item.Report.market_id.toUpperCase()
					let chart_widget = item.Product.chart_widget.toUpperCase()
					if ([marketId, chart_widget].includes(marketIdName)) {
						report = item.Report
						return false
					}
				}
			}
		})
		cy.then(()=> cy.log(report))
		return cy.then(() => cy.wrap(report))
	}
	waitForHistoryUpdate = () => recurse(
		() => cy.then(() => cy.$$(historyItems)),
		(items) => {
			console.log(items)
			expect(items.length).to.be.eq(1)
		},
		{
			log: false,
			limit: 15,
			timeout: 80000,
			delay: 5000,
			post() {
				const page = new TradingPage()
				page.clickNewTab()
				page.clickHistoryTab()
				cy.contains(/^You have seen it all!$/).should('be.visible')
			},
		}
	)
}
