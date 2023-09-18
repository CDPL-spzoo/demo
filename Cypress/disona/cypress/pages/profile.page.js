import { BasePage } from './base.page'

const fullNameInput = '#fullname'
const birthdateInput = '#birthdate'
const addressInput = '#address'
const phoneInput = '.PhoneInputInput'
const emailInput = '#email'
const saveButton = '[type="submit"]'
const countrySelect = '[class*="indicatorContainer"]'
export class ProfilePage extends BasePage{

	getFullNameInput = () => cy.get(fullNameInput)
	typeInFullNameInput = (fullName) => this.getFullNameInput().type(fullName)
	getBirthdateInput = () => cy.get(birthdateInput)
	typeInBirthdateInput = (date) => this.getBirthdateInput().type(date)
	getAddressInput = () => cy.get(addressInput)
	typeInAddressInput = (address) => this.getAddressInput().type(address)
	getPhoneInput = () => cy.get(phoneInput)
	getEmailInput = () => cy.get(emailInput)
	getInputByLabel = (label) => cy.get(`div:contains("${label}")>input, div:contains("${label}")>div>input`)
	getSaveButton = () => cy.get(saveButton)
	clickSaveButton = () => this.getSaveButton().click()
	getProfileUpdatedMessage = () => cy.contains(/^profile updated successfully$/)
	getAddedNewTradingAccountMessage = () => cy.contains(/^Added new trading account$/)
	getAccountStatus = () => cy.contains(/^Personal Information$/).siblings('span')
	getCountrySelect = () => cy.get(countrySelect)
	selectCountry = (country) => {
		this.getCountrySelect().click()
		cy.get(`[id*="-option-"]:contains("${country}")`).click()
	}
}