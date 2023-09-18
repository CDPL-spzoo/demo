import BasePage from '../BasePage'
import { assertion, commonConstant, navBarItems } from '../../support/app-data'
import LoginPage from './LoginPage'

export default class NavBarComponent extends BasePage {

	navigationItem(pageName) {return cy.get(`[data-testid='trading-${pageName}']`)}
	demoSwitchButton() {return cy.get("[data-testid='trading-switch-demo']").eq(1)}
	realSwitchButton() {return cy.get("[data-testid='trading-switch-real']").eq(1)}
	followUsSection() {return cy.xpath("//*[text()='Follow us']")}
	englishLanguage() {return cy.xpath("//*[text()='English']").eq(2)}
	russianLanguage() {return cy.xpath("//*[text()='Русский']")}
	indianLanguage() {return cy.xpath("//*[text()='हिन्दी']")}
	vietnamLanguage() {return cy.xpath("//*[text()='Tiếng Việt']")}
	languageSelectField() {return cy.get("[aria-haspopup='dialog']").eq(1)}
	logoutButton() {return cy.get("[data-testid='trading-logout']")}

	clickOnNavigationItem(item) {
		this.navigationItem(item).should(assertion['visible']).click()
		this.pause(500)
		return this
	}

	clickOnDemoRealSwitchButton(type) {
		if (type === commonConstant['demo']) {
			this.demoSwitchButton().should(assertion['visible']).click()
			return this
		}
		else if (type === commonConstant['real']) {
			this.realSwitchButton().should(assertion['visible']).click()
			return this
		}
	}

	clickOnLanguageSelectButton() {
		this.languageSelectField().click()
		return this
	}

	clickOnLogoutButton() {
		this.logoutButton().click()
		this.pause(1000)
		return new LoginPage();
	}

	verifyAllUIElements() {
		this.navigationItem(navBarItems['trading']).should(assertion['visible'])
		this.navigationItem(navBarItems['profile']).should(assertion['visible'])
		this.navigationItem(navBarItems['accounts']).should(assertion['visible'])
		this.navigationItem(navBarItems['deposit_withdrawal']).should(assertion['visible'])
		//TODO this.navigationItem(navBarItems['bonus']).should(assertion['visible']) ?
		this.navigationItem(navBarItems['analytics']).should(assertion['visible'])
		this.navigationItem(navBarItems['faq']).should(assertion['visible'])
		this.realSwitchButton().should(assertion['visible'])
		this.demoSwitchButton().should(assertion['visible'])
		this.followUsSection().should(assertion['visible'])
		this.languageSelectField().should(assertion['visible'])
		return this
	}

	verifyLanguagesDisplayed() {
		this.englishLanguage().should(assertion['visible'])
		this.russianLanguage().should(assertion['visible'])
		this.indianLanguage().should(assertion['visible'])
		this.vietnamLanguage().should(assertion['visible'])
		return this
	}
}