import { path } from '../support/app-data'

const header = {
	'Connection': 'keep-alive',
	'Accept-Encoding': 'gzip, deflate, br',
	'Accept': '*/*',
	'Content-Type': 'application/json'
}

export async function createSession() {
	return cy.request({
		method: 'POST',
		url: `${Cypress.env('fxtrBaseUrl')}${path['session']}`,
		headers: header,
		body:
			{
				'agentid': '',
				'app_session': {
					'host': 'localhost:3000'
				},
				'claims': {}
			}
	})
}

export async function getSession(sessionId) {
	return cy.request({
		method: 'GET',
		url: `${Cypress.env('fxtrBaseUrl')}${path['session']}/${sessionId}`,
		headers: header
	})
}

export async function singUp(singUpUrl, email) {
	return cy.request({
		method: 'POST',
		url: `${singUpUrl}/EN/submit`,
		form: true,
		body: {
			login: email,
			password: 'password',
			agreement: '1',
			resident: '1'
		},
		headers: header
	})
}

export async function singIn(singInUrl, email) {
	return cy.request({
		method: 'POST',
		url: `${singInUrl}/EN/submit`,
		form: true,
		body: {
			login: email,
			password: 'password',
		},
		headers: header
	})
}

export function verifyIsRegisteredIsAuthorized(response, state) {
	expect(response.body.is_registered).to.eq(state)
	expect(response.body.is_authorised).to.eq(state)
	expect(response.body.is_authorized).to.eq(state)
}