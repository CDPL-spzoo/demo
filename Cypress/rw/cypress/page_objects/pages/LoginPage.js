import BasePage from '../BasePage'

export default class LoginPage extends BasePage {

	clickOnLogInButton() {
		this.logInfo('Click on login button')
		cy.get('iframe').should((iframe) => {
			expect(iframe.contents().find('.auth-submit')).to.be.visible
		}).invoke('contents').find('.auth-submit').click()
	}

	clickOnSignUpButton() {
		this.logInfo('Click on signup button')
		cy.get('iframe').should((iframe) => {
			expect(iframe.contents().find('body a > b > u')).to.be.visible
		}).invoke('contents').find('body a > b > u').click()
	}
}