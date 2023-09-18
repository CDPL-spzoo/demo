export class BasePage {
	getProfileLink = () => cy.get('a:contains("Profile")')
	clickProfileLink = () => this.getProfileLink().click()
	getTradingLink = () => cy.get('a[href="/trading"]')
	clickTradingLink = () => this.getTradingLink().click()
	getAccountsLink = () => cy.get('a:contains("Accounts")')
	clickAccountsLink = () => this.getAccountsLink().click()
	getBonusLink = () => cy.get('a:contains("Bonus")')
	clickBonusLink = () => this.getBonusLink().click()
	getDepositWithdrawalLink = () => cy.get('a:contains("Deposit, Withdrawal")')
	clickDepositWithdrawalLink = () => this.getDepositWithdrawalLink().click()
	getNotificationMessageWithText = (text) =>
		cy.get(`[role="alert"]:contains("${text}")`)
	clickCloseNotificationMessageButton = () => cy.get('.close-button').click()
	getButtonByText = (text) => cy.xpath(`//button[text()="${text}"]`)
	clickButtonByText = (text) => this.getButtonByText(text).click()
	selectLeverage = (leverage) => {
		cy.get('#stackModalWrapper').contains('leverage').parent().find('input').click()
		cy.get(`[id*="-option-"]:contains("${leverage}")`).click()
	}
	clickLogOutButton = () => cy.xpath('//*[text()="Logout"]').click()
}
