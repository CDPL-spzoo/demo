import BasePage from '../BasePage'
import { assertion, attributes, commonConstant } from '../../support/app-data'

export default class TradingPage extends BasePage {

	chartField() {return cy.get("div[class='react-stockchart']")}
	sellButton() {return cy.get("[data-testid='trading-sell-button']")}
	buyButton() {return cy.get("[data-testid='trading-buy-button']")}
	limitOfInvestment() {return cy.get("[data-testid='trading-newOrder-limitOfInvestment'] input")}
	message() {return cy.get("[role='alert']")}
	closeOrderButton() {return cy.get("[type='primary']")}
	openOrderTab() {return cy.get("[data-testid='trading-new-tab']")}
	openedOrdersTab() {return cy.get("[data-testid='trading-open-tab']")}
	pendingOrdersTab() {return cy.get("[data-testid='trading-pending-tab']")}
	historyTab() {return cy.get("[data-testid='trading-history-tab']")}
	depositWithdrawInputField() {return cy.get("[data-testid='trading-header-balance-input'] input")}
	depositButton() {return cy.get("[data-testid='trading-header-deposit-button']")}
	withdrawButton() {return cy.get("[data-testid='trading-header-withdraw-button']")}
	showFullFormButton() {return cy.get("[data-testid='trading-newOrder-expand-form']")}
	openAtPriceCheckboxes() {return cy.get("[data-testid='trading-open-when-checkbox']")}
	openAtPriceFields() {return cy.get("[data-testid='trading-open-when-input']")}
	showOrderDetailsButton() {return cy.get("button[type='link']")}
	orderEditButton() {return cy.get("[data-testid='trading-pending-tab-editButton']")}

	//Order Details Modal
	orderDetailsModal() {return cy.get("[role='dialog']")}
	openWhenPriceField() {return cy.get("[title='Open when price'] > span ~ span")}
	orderDetailsModalCloseButton() {return cy.get("[alt='close']")}
	orderDetailsTakeProfitValue() {return cy.get("[title='Take Profit'] > [data-testid='orderDetails-value']")}
	orderDetailsStopLossValue() {return cy.get("[title='Stop Loss'] > [data-testid='orderDetails-value']")}

	//Order update form
	closeVolumeField() {return cy.get("[data-testid='trading-update-closeVolume-input']")}
	takeProfitField() {return cy.get("[data-testid='trading-update-takeProfit-input']")}
	stopLossField() {return cy.get("[data-testid='trading-update-stopLoss-input']")}
	updateButton() {return cy.get("[data-testid='trading-update-updateButton']")}
	cancelButton() {return cy.get("[data-testid='trading-update-closeButton']")}

	historyItems() {return cy.get("[data-testid='history-card-status-and-symbol']")}
	accountType() {return cy.get("[data-testid='accounts-body-name'] ~ div").eq(1)}
	currencyPairsField() {return cy.get("[data-testid='trading-body-symbols-select'] input")}
	currencyPairsTextField() {return cy.get("[data-testid='trading-body-symbols-select'] span").eq(0)}
	chartTypeTextField() {return cy.get("[data-testid='trading-body-chart-types'] > div > div > div div").eq(0)}
	closeEmailVerificationMessageButton() {return cy.get("#stackModalWrapper img[src*='-close-sign']")}
	tradingBalanceField() {return cy.xpath("//*[text()='Trading balance']/div").eq(0)}

	setLimitOfInvestment(limitOfInvestment) {
		this.limitOfInvestment()
			.should(assertion['visible'])
			.clear()
			.type(limitOfInvestment)
			.type('{enter}')
		return this
	}

	setDepositWithdraw(amount) {
		this.pause(1000)
		this.depositWithdrawInputField().then($inputField => {
			if ($inputField.length <= 0) {
				cy.reload()
			}
		})
		this.depositWithdrawInputField()
			.clear()
			.type(amount)
		return this
	}

	setOpenAtPrice(price) {
		this.openAtPriceFields()
			.clear()
			.type(price)
		return this
	}

	setTakeProfit(profit) {
		this.takeProfitField()
			.should(assertion['visible'])
			.clear()
			.type(profit)
		return this
	}

	setStopLoss(value) {
		this.stopLossField()
			.should(assertion['visible'])
			.clear()
			.clear()
			.type(value)
		return this
	}

	selectCurrencyPair(pair) {
		this.currencyPairsField()
			.eq(0)
			.should(assertion['visible'])
			.type(`${pair}{enter}`, {force: true})
		return this
	}

	selectChartType(type) {
		if (type === commonConstant['candles'] &&
			this.chartTypeTextField().should(assertion['have_text'], commonConstant['line'])) {
			this.chartTypeTextField()
				.click()
				.type('{upArrow}{upArrow}{enter}', { delay: 100 })
			return this
		}
		else if (type === commonConstant['line'] &&
			this.chartTypeTextField().should(assertion['have_text'], commonConstant['candles'])) {
			this.chartTypeTextField()
				.click()
				.type('{upArrow}{upArrow}{enter}', { delay: 100 })
			return this
		}
	}

	clickOnBuyButton() {
		this.buyButton().click()
		this.pause(300)
		return this
	}

	clickOnSellButton() {
		this.sellButton().click()
		this.pause(300)
		return this
	}

	clickOnCloseOrderButton() {
		this.closeOrderButton().click({ multiple: true })
		this.pause(100)
		return this
	}

	clickOnHistoryTab() {
		this.historyTab().click()
		return this
	}

	clickOnDepositButton() {
		this.depositButton().click()
		this.pause(500)
		return this
	}

	clickOnWithdrawButton() {
		this.withdrawButton().click()
		this.pause(500)
		return this
	}

	clickOnShowFullFormButton() {
		this.showFullFormButton()
			.should(assertion['visible'])
			.click()
		return this
	}

	clickOnOpenAtPriceCheckbox() {
		this.openAtPriceCheckboxes()
			.check()
		return this
	}

	closeOpenOrder() {
		this.closeOrderButton()
			.then($element => {
				if ($element.is(':visible')) {
					$element.click()
					return this
				} else {
					return this
				}
			})
	}

	clickOnShowOrderDetailsButton() {
		this.showOrderDetailsButton().click({ multiple: true })
		return this
	}

	clickOnCloseOrderDetailsModal() {
		this.orderDetailsModalCloseButton().click()
		return this
	}

	clickOnCloseEmailVerificationMessageButton() {
		this.closeEmailVerificationMessageButton()
			.should(assertion['visible'])
			.click()
		return this
	}

	clickOnOrderEditButton() {
		this.orderEditButton().eq(0).should(assertion['visible']).click()
		return this
	}

	clickOnOrderEditCancelButton() {
		this.cancelButton().should(assertion['visible']).click()
		return this
	}

	clickOnOrderUpdateButton() {
		this.updateButton().should(assertion['visible']).click()
		return this
	}

	verifyChartOpen() {
		this.chartField().should(assertion['visible'])
		return this
	}

	verifyPricingSectionOpen() {
		cy.waitForLoader(30000)
		this.limitOfInvestment().should(assertion['visible'])
		this.sellButton().should(assertion['visible'])
		this.buyButton().should(assertion['visible'])
		return this
	}

	verifyMessage(message) {
		this.message().should(assertion['have_text'], message)
		this.pause(500)
		return this
	}

	verifyDepositButtonDisabled() {
		this.depositButton().should(assertion['have_attribute'], attributes['disabled'])
		return this
	}

	verifyWithdrawButtonDisabled() {
		this.withdrawButton().should(assertion['have_attribute'], attributes['disabled'])
		return this
	}

	verifyWithdrawButtonEnabled() {
		this.withdrawButton().should(assertion['not_have_attribute'], attributes['disabled'])
		return this
	}

	verifyBuyButtonDisabled() {
		this.buyButton().should(assertion['have_attribute'], attributes['disabled'])
		return this
	}

	verifySellButtonDisabled() {
		this.sellButton().should(assertion['have_attribute'], attributes['disabled'])
		return this
	}

	verifyBuyButtonEnabled() {
		this.buyButton().should(assertion['not_have_attribute'], attributes['disabled'])
		return this
	}

	verifySellButtonEnabled() {
		this.sellButton().should(assertion['not_have_attribute'], attributes['disabled'])
		return this
	}

	verifyOrderDetailsModalDisplayed() {
		this.pause(1000)
		this.orderDetailsModal().should(assertion['visible'])
		return this
	}

	verifyOrderDetailsModalTakeProfitValue(value) {
		this.pause(300)
		this.orderDetailsTakeProfitValue().should(assertion['have_text'], value)
		return this
	}

	verifyOrderDetailsModalStopLossValue(value) {
		this.pause(300)
		this.orderDetailsStopLossValue().should(assertion['have_text'], value)
		return this
	}

	verifyOpenWhenPrice(price) {
		this.openWhenPriceField().should(assertion['have_text'], price)
		return this
	}

	verifyOrdersHistoryDisplayed() {
		this.historyItems().should('have.length.greaterThan', 0)
	}

	verifyAccountType(type) {
		this.accountType()
			.invoke('attr', 'type')
			.should('eq', type)
		return this
	}

	verifyCurrencyPair(pair) {
		this.currencyPairsTextField().contains(pair)
		return this
	}

	verifyChartType(type) {
		this.chartTypeTextField().should(assertion['have_text'], type)
		return this
	}

	verifyLimitOfInvestmentValue(value) {
		this.limitOfInvestment().should(assertion['have_value'], value)
		return this
	}

	verifyLimitOfInvestmentEnabled() {
		this.limitOfInvestment().should(assertion['not_have_attribute'], attributes['disabled'])
		return this
	}

	verifyOrderUpdateFormAllElementsDisplayed() {
		this.closeVolumeField().should(assertion['visible'])
		this.takeProfitField().should(assertion['visible'])
		this.stopLossField().should(assertion['visible'])
		this.updateButton().should(assertion['visible'])
		this.cancelButton().should(assertion['visible'])
		return this
	}

	verifyTradingBalance(balance) {
		this.tradingBalanceField()
			.should(assertion['visible'])
			.should(assertion['have_text'], balance)
	}
}
