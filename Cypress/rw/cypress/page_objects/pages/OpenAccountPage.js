import BasePage from '../BasePage'
import { assertion, attributes, commonConstant } from '../../support/app-data'

export default class OpenAccountPage extends BasePage {

	standardAccountTypeSections() {return cy.get("[data-testid='accounts-create-basic']")}
	masterAccountTypeSections() {return cy.get("[data-testid='accounts-create-master']")}
	investorAccountTypeSections() {return cy.get("[data-testid='accounts-create-investor']")}
	demoAccountTypeField() {return cy.get("[data-testid='accounts-create-demo']")}
	realAccountTypeField() {return cy.get("[data-testid='accounts-create-real']")}
	createButton() {return cy.get("[data-testid='accounts-create-account-button']")}
	cancelButton() {return cy.get("[data-testid='accounts-create-cancel-button']")}
	acceptTermsConditionsCheckbox() {return cy.get("[type='checkbox']")}
	//0-13
	copyMasterButtons() {return cy.get("[data-testid='accounts-investor-body-copy'] button")}

	clickOnDemoSwitchButton() {
		this.demoAccountTypeField().click()
		return this
	}

	clickOnRealSwitchButton() {
		this.realAccountTypeField().click()
		return this
	}

	clickOnMasterAccountTypeButton() {
		this.masterAccountTypeSections().should(assertion['visible']).click()
		return this
	}

	clickOnInvestorAccountTypeButton() {
		this.investorAccountTypeSections().should(assertion['visible']).click()
		return this
	}

	clickOnTermsConditionsCheckbox(check) {
		if (check) {
			this.acceptTermsConditionsCheckbox().check().should(assertion['be_checked'])
		} else this.acceptTermsConditionsCheckbox().uncheck()
		return this
	}

	clickOnCopyMasterButton() {
		let index = Math.floor(Math.random() * 8);
		this.copyMasterButtons().eq(index).click()
		this.pause(1500)
		this.copyMasterButtons().eq(index).should(assertion['have_text'], commonConstant['selected'])
		return this
	}

	clickOnCancelButton() {
		this.cancelButton().click()
	}

	verifyAllElementsDisplayed() {
		this.standardAccountTypeSections().should(assertion['visible'])
		this.masterAccountTypeSections().should(assertion['visible'])
		this.investorAccountTypeSections().should(assertion['visible'])
		this.demoAccountTypeField().should(assertion['visible'])
		this.realAccountTypeField().should(assertion['visible'])
		this.createButton().should(assertion['visible'])
		this.cancelButton().should(assertion['visible'])
		return this
	}

	verifyCreateButtonDisabled(state) {
		if (state) {
			this.createButton().should(assertion['have_attribute'], attributes['disabled'])
		} else this.createButton().should(assertion['not_have_attribute'], attributes['disabled'])
		return this
	}
}