import { BasePage } from './base.page'

const accountNameBox = '#editable-account-name'
const nameInput = '#edit-name-container input'
const submitButton = 'button[type="primary"]:contains("Ok")'
export class AccountsPage extends BasePage {

	getDemoAccountsTable = () => cy.get('table:eq(0)')
	getRealAccountsTable = () => cy.get('table:eq(1)')
	getAccountsRows = () => cy.get('tbody tr')
	getFirstAccountRow = () => this.getAccountsRows().first()
	getSecondAccountRow = () => this.getAccountsRows().last()
 	getRemoveButtonByRow = (rowIndex) =>
		cy.get(`tbody tr:eq("${rowIndex}") td`).last()
	clickRemoveButtonByRow = (rowIndex) =>
		this.getRemoveButtonByRow(rowIndex).click()
	clickOnEditNameByRow = (rowIndex) =>
		cy.get(`tbody tr:eq("${rowIndex}") ${accountNameBox} svg`).click()
	getAccountNameField = () => cy.get(accountNameBox)
	getEditNameInput = () => cy.get(nameInput)
	getTableValueByColumnHeaderAndRowIndex = (columnHeader, rowIndex) => {
		let headerIndex
		return cy.get('[role="columnheader"]', {log:false}).each((header, index) => {
			if (header.text() === columnHeader) {
				headerIndex = index
				return false
			}
		}).then(() => this.getAccountsRows().eq(rowIndex).find(`[role="cell"]:eq("${headerIndex}")`))
	}
	getCreateRealAccountButton = () => cy.xpath('//button[text()="Create new Real Account"]')
	clickCreateRealAccountButton = () => this.getCreateRealAccountButton().click()
	getCreateDemoAccountButton = () => cy.xpath('//button[text()="Create new demo Account"]')
	clickCreateDemoAccountButton = () => this.getCreateDemoAccountButton().click()
	createRealAccount = () => {
		this.clickCreateRealAccountButton()
		this.clickButtonByText('create')
		this.getNotificationMessageWithText('Added new account').should('be.visible')
		this.clickCloseNotificationMessageButton()
	}
}
