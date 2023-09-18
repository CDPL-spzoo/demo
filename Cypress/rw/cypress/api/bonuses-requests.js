export async function getAvailableBonuses() {
	return cy.request({
		method: 'GET',
		url: Cypress.env('bonusesUrl') + '/bonus',
		headers: {
			'x-authorization': 'anyString',
			'Connection': 'keep-alive',
			'Accept-Encoding': 'gzip, deflate, br',
			'Accept': '*/*'
		}
	})
}

export async function getConditionsForBonus(bonusGUID) {
	return cy.request({
		method: 'GET',
		url: Cypress.env('bonusesUrl') + '/bonus/' + bonusGUID,
		headers: {
			'x-authorization': 'anyString',
			'Connection': 'keep-alive',
			'Accept-Encoding': 'gzip, deflate, br',
			'Accept': '*/*'
		}
	})
}
