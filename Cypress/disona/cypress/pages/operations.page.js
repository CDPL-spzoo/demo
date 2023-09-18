import { BasePage } from './base.page'


const depositAmountInput = '[role="spinbutton"]'
const balance = '[class*="styled__Price"]'
const currency = '[class*="styled__Currency"]'
const copyButton = '[class*="styles__Copy"]'
const historyHeaders = '[role="columnheader"]'
const historyOperations = 'tbody>[role="row"]'

export class OperationsPage extends BasePage{
	historyHeaders = ['Type', 'Amount', 'Date', 'Status', 'Account', 'Transaction ID']
	valueTemplates = [
		/^.{1,40}$/,
		/^\d{1,10}\s{1,2}USD$/,
		/^(\d{1,2})-(\d{1,2})-(\d{4}), \d{2}:\d{2}$/,
		/(CANCELED\/REJECTED|COMPLETED)/,
		/^\d{4,10}$/,
		/^(\w{1,10}-){4}\w{1,15}$/,
	]
	getDemoAccountToggle = () => cy.get('p').contains(/^Demo$/)
	getRealAccountToggle = () => cy.get('p').contains(/^Real$/)
	getDepositToggle = () => cy.get('p').contains(/^Deposit$/)
	getWithdrawToggle = () => cy.get('p').contains(/^Withdraw$/)
	clickDemoAccountToggle = () => this.getDemoAccountToggle().click()
	clickRealAccountToggle = ({ force = false } = {}) => this.getRealAccountToggle().click({force})
	clickDepositToggle = () => this.getDepositToggle().click()
	clickWithdrawToggle = () => this.getWithdrawToggle().click()
	getActiveAccountToggle = () => cy.get('p:contains("Demo")~div')
	getAccountSelector = () => cy.get('[class*="styles__FormElement"]:contains("Account")')
	clickAccountSelector = () => this.getAccountSelector().click()
	getAccountOptions = () => this.getAccountSelector().find('[id*="-option-"]')
	getDepositAmountInput = () => cy.get(depositAmountInput)
	typeInDepositAmountInput = (value) => this.getDepositAmountInput().type(value)
	getWithdrawAmountInput = () => this.getDepositAmountInput()
	typeInWithdrawAmountInput = (value) => this.getWithdrawAmountInput.type(value)
	getWithdrawButton = () => this.getButtonByText('Withdraw Funds')
	getBalance = () => cy.get(balance)
	getBalanceCurrency = () => cy.get(currency)
	getHistoryTableHeaders = () => cy.get(historyHeaders)
	getHistoryOperations = () => cy.get(historyOperations)
	getHistoryTableValueByHeaderAndRowIndex = (columnHeader, rowIndex) => {
		let headerIndex
		return cy.get('[role="columnheader"]', {log:false}).each((header, index) => {
			if (header.text() === columnHeader) {
				headerIndex = index
				return false
			}
		}).then(() => cy.get(`[role="row"]:eq("${rowIndex+1}")`).find(`[role="cell"]:eq("${headerIndex}")`))
	}
	clickCopyButtonByRowIndex = (index) => cy.get(`${copyButton}:eq(${index})`).click()
	validateHistoryTableValues = () => {
		this.getHistoryTableHeaders().should('have.length', this.historyHeaders.length)
			.each(($header, index) => {
				expect($header).to.have.text(this.historyHeaders[index])
			})
		this.getHistoryOperations().should('exist').each((operation) => {
			cy.wrap(operation, { log: false }).find('[role="cell"]').each((cell, index) => {
				cy.wrap(cell, { log: false }).invoke('prop', 'outerText').should('match', this.valueTemplates[index])
			})
		})
	}
}