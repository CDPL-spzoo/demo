// @ts-ignore

declare global {

	namespace Cypress {

		interface Chainable<subject> {

			setCookies(cookies: any): Chainable<any>,
			performLogin(login, password): Chainable<any>,
			performRegistration(login, password): Chainable<any>,
			getCurrentDateTime(): Chainable<any>,
			sendSupportMessage(message: string): Chainable<any>,
			waitForLoader(timeout?: number): Chainable<any>
			createUserAndLoginToDisona(email, password, { isActive}?): Chainable<any>
		}
	}
}