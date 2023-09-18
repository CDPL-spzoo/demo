export async function getCandlesInGivenParisAndTimeInterval(currencyPairs, timeInterval, from, to) {
	return cy.request({
		method: 'GET',
		url: Cypress.env('candlesUrl') + currencyPairs + timeInterval,
		qs: {
			'from': from,
			'to': to
		},
		headers: {
			'x-authorization': '',
			'Connection': 'keep-alive',
			'Accept-Encoding': 'gzip, deflate, br',
			'Accept': '*/*'
		}
	})
}
