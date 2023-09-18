import BasePage from '../BasePage'
import {assertion, attributes, commonConstant} from '../../support/app-data'
import { recurse } from 'cypress-recurse'

export default class DepositWithdrawalPage extends BasePage {

	operationAmountFields() {return cy.get("#amount span p")}
	operationTypeFields() {return cy.get("#type span")}
	operationStatusFields() {return cy.get("#status span")}
	operationDateFields() {return cy.get("#date div")}
	historyRefreshButton() {return cy.get("[data-testid='deposit-withdraw-reload-history']")}
	amountInputField() {return cy.get("[data-testid='deposit-withdraw-balance-input']")}
	depositButton() {return cy.get("[data-testid$='deposit-button']")}
	withdrawButton() {return cy.get("[data-testid$='withdraw-button']")}
	switchWithdrawButton() {return cy.get("[data-testid$='switch-withdraw']")}
	switchDepositButton() {return cy.get("[data-testid$='switch-deposit']")}
	proceedTheTransactionsList() {return cy.get("[href='/operations']")}
	somethingWentWrongErrorMessage() {return cy.xpath("//*[text()='Something went wrong.']")}

	setAmount(amount) {
		this.amountInputField()
			.should(assertion['visible'])
			.clear()
			.type(amount)
		return this
	}

	clickOnHistoryRefreshButton() {
		this.pause(1000)
		this.historyRefreshButton().should(assertion['visible']).click({ force: true })
		return this
	}

	clickOnDepositButton() {
		this.depositButton().click()
		return this
	}

	clickOnWithdrawButton() {
		this.withdrawButton().click()
		return this
	}

	clickOnProceedTheTransactionsList() {
		this.proceedTheTransactionsList().should(assertion['visible']).click()
		return this
	}

 	clickOnRefreshUntilStatusNotChanged(index, status) {
		const click = () => this.clickOnHistoryRefreshButton()
	recurse(
		() => this.operationStatusFields().eq(index).invoke('text'),
		(statusText) => statusText === status,
		{
			log: false,
			limit: 30, // max number of iterations
			delay: 5000, // delay before next iteration, ms
			timeout: 150000,
			post () {
				click()
				cy.waitForLoader()
			}
		}
	).should('eq', status)
		return this
	}

	switchDepositWithdraw(type) {
		type === commonConstant["deposit"] ? this.switchDepositButton().click() :
			type === commonConstant["withdraw"] ? this.switchWithdrawButton().click() : null
		return this
	}

	verifyOperationType(index, type) {
		this.operationTypeFields().eq(index).should(assertion['have_text'], type)
		return this
	}

	verifyOperationStatus(index, status) {
		this.operationStatusFields().eq(index).should(assertion['have_text'], status)
		return this
	}

	verifyOperationAmount(index, amount) {
		this.pause(500)
		this.operationAmountFields().eq(index).should(assertion['have_text'], amount)
		return this
	}

	verifyOperationDate(index, day) {
		this.operationDateFields().eq(index).contains(day)
		return this
	}

	verifyDepositWithdrawButtonDisabled() {
		this.depositButton().should(assertion['have_attribute'], attributes['disabled'])
	}

	verifySomethingWentWrongErrorMessageDisplayed() {
		this.somethingWentWrongErrorMessage().should(assertion['visible'])
		return this
	}
}