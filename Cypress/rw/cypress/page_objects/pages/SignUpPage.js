import BasePage from '../BasePage'

export default class SignUpPage extends BasePage {

	isSignUpButtonDisabled() {
		cy.get('iframe').should((iframe) => {
			const body = iframe.contents().find('body');
			expect(body.find('#do_submit')).to.be.disabled
		});
	}
}