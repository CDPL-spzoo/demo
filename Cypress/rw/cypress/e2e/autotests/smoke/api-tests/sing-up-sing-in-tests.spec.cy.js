import {
	createSession,
	getSession,
	singUp,
	verifyIsRegisteredIsAuthorized,
	singIn
} from '../../../../api/authorization-requests'
import { getRandomNumber } from '../../../../support/Helpers'

let appToken, registrationUrl, loginUrl, email = `autotest${getRandomNumber(7)}@gmail.com`

describe('Sing Up api test', {tags: 'smoke'}, () => {

	it('should create session', async function() {
		await createSession().then(response => {
			expect(response.status).to.eq(200)
			appToken = response.body.app_token
		})
	})

	it('should get session', async function() {
		await getSession(appToken).then(response => {
			expect(response.status).to.eq(200)
			verifyIsRegisteredIsAuthorized(response, false)
			registrationUrl = response.body.registration_url
		})
	})

	it(`should sing up {email: "${email}; password: "password"}`, async function() {
		await singUp(registrationUrl, email).then(response => {
			expect(response.status).to.eq(200)
		})
	})

	it('C2784: should get session and check is_registered is_authorized "true"', async function() {
		await getSession(appToken).then(response => {
			expect(response.status).to.eq(200)
			verifyIsRegisteredIsAuthorized(response, true)
		})
	})
})

describe('Sing Up api test with registered email', () => {

	it('should create session', async function() {
		await createSession().then(response => {
			expect(response.status).to.eq(200)
			appToken = response.body.app_token
		})
	})

	it('should get session', async function() {
		await getSession(appToken).then(response => {
			expect(response.status).to.eq(200)
			verifyIsRegisteredIsAuthorized(response, false)
			registrationUrl = response.body.registration_url
		})
	})

	it(`should sing up with registered email: {${Cypress.env('realUsername')}}`, async function() {
		await singUp(registrationUrl, Cypress.env('realUsername')).then(response => {
			expect(response.status).to.eq(200)
		})
	})

	it('C2785: should get session and check is_registered is_authorized "false" status for registered email', async function() {
		await getSession(appToken).then(response => {
			expect(response.status).to.eq(200)
			verifyIsRegisteredIsAuthorized(response, false)
		})
	})
})

describe('Sing In api test with registered email', () => {

	it('should create session', async function() {
		await createSession().then(response => {
			expect(response.status).to.eq(200)
			appToken = response.body.app_token
		})
	})

	it('should get session', async function() {
		await getSession(appToken).then(response => {
			expect(response.status).to.eq(200)
			verifyIsRegisteredIsAuthorized(response, false)
			loginUrl = response.body.login_url
		})
	})

	it(`should sing in with registered email: {${Cypress.env('demoUsername')}}`, async function() {
		await singIn(loginUrl, Cypress.env('demoUsername')).then(response => {
			expect(response.status).to.eq(200)
		})
	})

	it('C2786: should get session and check is_registered is_authorized "true" status for registered email', async function() {
		await getSession(appToken).then(response => {
			expect(response.status).to.eq(200)
			verifyIsRegisteredIsAuthorized(response, true)
		})
	})
})
