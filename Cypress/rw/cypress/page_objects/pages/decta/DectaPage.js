import { dectaPageFields } from '../../../support/app-data'

export function fillCardCredentials(isValidCard) {
	cy.origin(
		`https://transactions.decta.com/`,
		{ args: {...dectaPageFields, isValidCard} },
		({
			 cardholderNameField, cardNumberField, cardMonthField, cardYearField,
			 cvcField, agreeMerchantsTermsCheckbox, payNowButton, cardholderName,
			 cardNumber, wrongCardNumber, cardMonth, cardYear, acceptCvc, isValidCard
		 }) => {
			let usedCardNumber = isValidCard ? cardNumber : wrongCardNumber;
			cy.get(cardholderNameField).type(cardholderName)
			cy.get(cardNumberField).type(usedCardNumber)
			cy.get(cardMonthField).type(cardMonth)
			cy.get(cardYearField).type(cardYear)
			cy.get(cvcField).type(acceptCvc)
			cy.get(agreeMerchantsTermsCheckbox).click()
			cy.get(payNowButton).click()
		})
}