import { faker } from '@faker-js/faker'
import { profilePattern } from './patterns'
const { fxtrApiUrl, regiApiUrl } = Cypress.env()
const headers = {
	Connection: 'keep-alive',
	'Accept-Encoding': 'gzip, deflate, br',
	Accept: '*/*',
	'Content-Type': 'application/json',
}

export class Helper {
	static createSession = () => {
		return cy
			.request({
				method: 'POST',
				url: `${fxtrApiUrl}/session`,
				headers,
				body: {
					agentid: '',
					app_session: {
						host: 'localhost:3000',
					},
					claims: {},
				},
			})
			.its('body.app_token')
	}

	static getSession = (appToken) => {
		return cy.request({
			method: 'GET',
			url: `${fxtrApiUrl}/session/${appToken}`,
			headers,
		})
	}

	static updatePhoneNumber = (appToken, phone = `+${Date.now()}`) => {
			this.getSession(appToken)
				.its('body')
				.then((body) => {
					cy.request({
						method: 'POST',
						url: `${regiApiUrl}/registration/${body.auth_token}/${body.app_guid}/phone`,
						body: { phone },
						headers,
					})
				})
		cy.task(
			'connectDB',
			`UPDATE phone_list SET isconfirmed = true, isprimary = true WHERE phone = '${phone}'`
		)
	}

	static updateProfile = (appToken) => {
		const bodyPattern = Cypress._.merge({}, profilePattern())
		this.getSession(appToken)
			.its('body')
			.then((body) => {
				cy.request({
					method: 'PUT',
					url: `${fxtrApiUrl}profile`,
					headers: {
						...headers,
						'X-Authorization': body.app_token,
						Origin: 'https://stage-riga.rock-west.net',
						Referer: 'https://stage-riga.rock-west.net/',
					},
					body: bodyPattern,
				})
			})
	}

	static confirmEmail = (email) => {
		cy.task(
			'connectDB',
			`UPDATE email_list SET isconfirmed = true WHERE email = '${email}'`
		)
	}

	static getRandomEmail = () =>
		faker.internet
			.email(`cypress-test${Date.now()}${faker.random.word()}`, faker.random.word(), 'testExample.com')
			.toLowerCase()

	static createUser = (
		randomEmail = Helper.getRandomEmail(),
		password = 'password', {isActive=true} = {}
	) => {
		const phoneNumber = `+${Date.now()}`
		this.createSession()
			.then((appToken) => {
				this.getSession(appToken)
					.its('body')
					.then((body) => {
						cy.request({
							method: 'POST',
							url: `${body.registration_url}/EN/submit`,
							form: true,
							body: {
								login: randomEmail,
								password,
								agreement: '1',
								resident: '1',
							},
							headers,
						})
					})
				this.updatePhoneNumber(appToken, phoneNumber)
				this.confirmEmail(randomEmail)
				if (isActive){
					this.updateProfile(appToken)
				}
			})
		return cy.wrap(randomEmail, { log: false })
	}
}
