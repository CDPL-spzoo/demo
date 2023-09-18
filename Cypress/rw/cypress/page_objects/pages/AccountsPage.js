import BasePage from '../BasePage'
import { assertion } from '../../support/app-data'

export default class AccountsPage extends BasePage {

	accountNumber() {return cy.get("div > a[href^='/accounts/']")}
	accountName() {return cy.get("[id^='accountInfo'] div span")}
	//1-10 elements
	accountColumnNames() {return cy.get("th > div")}
	openAccountButton() {return cy.get("button:contains('Open Account')")}

	clickOnAccountNumber() {
		this.accountNumber().first().click({force: true})
		return this
	}

	clickOnOpenAccountButton() {
		this.openAccountButton().should(assertion['visible']).click()
		return this
	}

	verifyAccountName(name) {
		this.accountName().should(assertion['have_text'], name)
		return this
	}

	verifyAccountHistoryColumnsName() {
		const names = ['Time', 'Ticket', 'Type', 'Symbol', 'Volume',
			'Price', 'S/L', 'T/P', 'Profit', 'Comment']
		for (let i = 1; i <= 10; i++) {
			this.accountColumnNames().eq(i).should(assertion['have_text'], names[i - 1])
		}
		return this
	}
}