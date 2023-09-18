import BasePage from '../BasePage'
import { assertion, attributes } from '../../support/app-data'

export default class ProfilePage extends BasePage {

	firstNameField() {return cy.get("[placeholder='First Name *']")}
	lastNameField() {return cy.get("[placeholder='Last Name *']")}
	dateOfBirthField() {return cy.get("[placeholder='Date of birth *']")}
	countryField() {return cy.get("div[class='rwSelect__input'] input")}
	countryTextField() {return cy.get("div[class^='rwSelect__single-value']")}
	emailField() {return cy.get("div:nth-child(5) > input")}
	phoneNumberField() {return cy.get("[type='tel']")}
	nickNameField() {return cy.get("#nickName")}
	firstNameRealField() {return cy.get("#firstName")}
	lastNameRealField() {return cy.get("#lastName")}
	dateOfBirthRealField() {return cy.get("#dateOfBirth")}
	saveButton() {return cy.get("[data-testid='profile-button-save']")}
	changePasswordButton() {return cy.get("[type='button']").contains('Click here')}
	uploadAvatarButtonButton() {return cy.get("[data-testid='profile-uploader']")}
	message() {return cy.get("[role='alert']")}

	//Avatar modal
	uploadPhotoButton() {return cy.get("#my_file")}
	defaultImageFields() {return cy.get("div img[alt^='avatar']")}
	avatarModalCloseButton() {return cy.get("form > div div~ button").eq(0)}

	setNickName(nickname) {
		this.nickNameField().clear();
		this.pause(800)
		this.nickNameField().type(nickname)
		return this
	}

	selectCountry(country) {
		this.countryField()
			.should(assertion['visible'])
			.type(`${country}{enter}`, {force: true})
		return this
	}

	clickOnUploadAvatarButton() {
		this.uploadAvatarButtonButton().click()
		return this
	}

	clickOnAvatarModalCloseButton() {
		this.avatarModalCloseButton().click()
		return this
	}

	clickOnSaveButton() {
		this.pause(1500)
		this.saveButton().should(assertion['enabled']).trigger('click')
		return this
	}

	verifyEmail(email) {
		this.emailField()
			.should(assertion['have_attribute'], attributes['value'], `${email}`)
		return this
	}

	verifyPhoneCodeByCountry(country) {
		this.phoneNumberField()
			.should(assertion['have_attribute'], attributes['value'], `${country['phoneCode']}`)
		return this
	}

	verifyPersonalInformationFieldsDisplayed() {
		this.firstNameField().should(assertion['visible'])
		this.lastNameField().should(assertion['visible'])
		this.dateOfBirthField().should(assertion['visible'])
		this.countryField().should(assertion['visible'])
		this.emailField().should(assertion['visible'])
		this.phoneNumberField().should(assertion['visible'])
		return this
	}

	verifyProfilePageAllElementsDisplayed() {
		this.nickNameField().should(assertion['visible'])
		this.firstNameRealField().should(assertion['visible'])
		this.lastNameRealField().should(assertion['visible'])
		this.dateOfBirthRealField().should(assertion['visible'])
		this.countryField().should(assertion['visible'])
		this.saveButton().should(assertion['visible'])
		this.changePasswordButton().should(assertion['visible'])
		this.uploadAvatarButtonButton().should(assertion['visible'])
		return this
	}

	verifySaveButtonDisabled() {
		this.saveButton().should(assertion['have_attribute'], attributes['disabled'])
		return this
	}

	verifySaveButtonEnabled() {
		this.saveButton().should(assertion['not_have_attribute'], attributes['disabled'])
		return this
	}

	verifyAvatarModalOpenSuccessfully() {
		this.uploadPhotoButton().should(assertion['visible'])
		this.defaultImageFields().should(assertion['visible']).should(assertion['have_length'], 5)
		this.avatarModalCloseButton().should(assertion['visible'])
		return this
	}

	verifyMessage(message) {
		this.message().should(assertion['have_text'], message)
		this.pause(500)
		return this
	}

	verifyPersonalInfoElementValue(element, value) {
		element.should(assertion['have_value'], value)
	}

	verifyCountry(country) {
		this.countryTextField().should(assertion['have_text'], country)
	}
}