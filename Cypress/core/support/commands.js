import 'cypress-wait-until'
import { recurse } from 'cypress-recurse'
import { Helper } from '../../disona/cypress/api_helpers/helper'

Cypress.Commands.add('performLogin', (login, password) => {
	cy.get('iframe').should((iframe) => {
		const body = iframe.contents().find('body')
		body.find('.auth-email').val(login)
		body.find('.auth-password').val(password)
		expect(body.find('.auth-email')).to.have.value(login)
		body.find('.auth-submit').click()
	})
})

Cypress.Commands.add('performRegistration', (login, password) => {
	cy.get('iframe')
		.should((iframe) => expect(iframe.contents().find('body #agreement')).to.be.visible)
		.then((iframe) => {
			const body = iframe.contents().find('body')
			cy.wrap(body, { log: false }).find('.auth-email').type(login)
			cy.wrap(body, { log: false }).find('.auth-password').type(password)
			cy.wrap(body, { log: false }).find('#agreement').click()
			cy.wrap(body, { log: false }).find('#resident').click()
			cy.wrap(body, { log: false }).find('#do_submit').should('be.enabled').click()
		})
})

Cypress.Commands.add('getCurrentDateTime', () => {
	let now = new Date()
	return now.toISOString().replaceAll('-', '.').replace('T', ' ').substring(0, 16)
})

Cypress.Commands.add('sendSupportMessage', (message) => {
	cy.wait(5000)
	cy.get('#fc_widget').then((iframe) => {
		cy.wait(2000)
		const body = iframe.contents().find('body')
		cy.wrap(body).find("div[class^='d-hotline h-btn animated']").click({ force: true })
		cy.wrap(body).find('#app-conversation-editor > p').type(`${message}{enter}`)
		cy.fixture('btc.jpg').as('btcImage')
		cy.wrap(body).find('#fileUploadInput').selectFile('@btcImage', { force: true })
		cy.wait(3000)
		cy.wrap(body).find('#app-conversation-editor > p').type('{enter}')
	})
})

Cypress.Commands.add('setCookies', (cookies = []) => {
	cookies.forEach((cookie) => {
		cy.setCookie(cookie.name, cookie.value)
	})
})

Cypress.Commands.add('waitForLoader', (timeout = 30000) => {
	let iter = 0
	const loader = '.sc-jKJlTe, :contains("Waiting for prices..."), [class*="Spinner__StyledSpinner"]'
	recurse(
		() =>
			cy.then(() => {
				return Cypress.$(loader).length
			}),
		(x) => x + iter > 28 || x,
		{
			log: false,
			limit: 30, // max number of iterations
			delay: 90, // delay before next iteration, ms
			timeout,
			post() {
				iter++
			},
		}
	).then(() => cy.get(loader, { timeout }).should('not.exist'))
	return cy
})

function overwriteShould(originalFn, subject, chainer, method, value) {
	if (chainer === 'have.text.trimmed') {
		return originalFn(subject.prop('innerText').trim(), 'equal', method, value).then(() => subject)
	}
	if (chainer === 'have.status') {
		return originalFn(subject.status, 'equal', method, value).then(() => subject)
	}
	const args = Cypress._.reject(arguments, { name: 'originalFn' })
	return originalFn(...args)
}

Cypress.Commands.overwrite('should', overwriteShould)

Cypress.Commands.overwrite('and', overwriteShould)

Cypress.Commands.add('createUserAndLoginToDisona', (email, password, { isActive = true } = {}) => {
	Helper.createUser(email, password, {isActive})
	cy.visit('/')
	cy.performLogin(email, password)
	cy.location('pathname').should('eq', '/trading')
	cy.waitForLoader()
})
