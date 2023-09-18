import { BasePage } from './base.page'

const signInIframe = 'iframe[title="sign in"]'
const logInButton = 'button:contains("LOG IN")'
const emailInput = 'input[type="email"]'
const passwordInput = 'input[type="password"]'
const switchToSignUpLink = 'b:contains("SIGN UP")'
const signUpButton = 'button:contains("SIGN UP")'
const agreementCheckbox = '#agreement'
const residentCheckbox = '#resident'

export class LoginPage extends BasePage {

	getSignInIframe = () => cy.get(signInIframe, {log: false})
	getLogInButton = () => this.getSignInIframe().should((iframe) => {
		expect(iframe.contents().find(logInButton)).to.be.visible
	}).invoke('contents', {log: false}).find(logInButton)

	clickOnLogInButton = () => this.getLogInButton().click()

	getEmailInput = () => this.getSignInIframe().should(iframe => {
		expect(iframe.contents().find(emailInput)).to.be.visible
	}).invoke('contents', {log: false}).find(emailInput)

	typeInEmailInput = (email) => this.getEmailInput().type(email)

	getPasswordInput = () => this.getSignInIframe().should(iframe => {
		expect(iframe.contents().find(passwordInput)).to.be.visible
	}).invoke('contents', {log: false}).find(passwordInput)

	typeInPasswordInput = (password) => this.getPasswordInput().type(password)

	clickOnSingUpSwitcher = () => this.getSignInIframe().should(iframe => {
		expect(iframe.contents().find(switchToSignUpLink)).to.be.visible
	}).invoke('contents', {log: false}).find(switchToSignUpLink).click()

	getSingUpButton = () => this.getSignInIframe().should(iframe => {
		expect(iframe.contents().find(signUpButton)).to.be.visible
	}).invoke('contents', {log: false}).find(signUpButton)

	clickSingUpButton = () => this.getSingUpButton().click()

	checkAgreementCheckbox = () => this.getSignInIframe().should(iframe => {
		expect(iframe.contents().find(agreementCheckbox)).not.to.be.checked
	}).invoke('contents', {log: false}).find(agreementCheckbox).check()

	checkResidentCheckbox = () => this.getSignInIframe().should(iframe => {
		expect(iframe.contents().find(residentCheckbox)).not.to.be.checked
	}).invoke('contents', {log: false}).find(residentCheckbox).check()
}