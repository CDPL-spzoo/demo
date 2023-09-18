import { FAQPage } from '../pages/faq.page'

describe('FAQ', () => {
	const faqPage = new FAQPage()
	const { email, password } = Cypress.env()

	beforeEach(() => {
		cy.visit('/login')
		cy.performLogin(email, password)
		cy.visit('/faq')
	})

	it('C2725: Question popup', function () {
		faqPage.getAllQuestions().each((question) => {
			cy.wrap(question).click()
			faqPage.getQuestionPopUp().filter(`:contains("${question.text()}")`)
				.should('be.visible')
				.and('contain.text', question.text())
			faqPage.clickClosePopUpButton()
			faqPage.getQuestionPopUp().filter(`:contains("${question.text()}")`).should('not.be.visible').wait(200)
		})
	})

	it('C2726: Searching', function () {
		faqPage.getAllQuestions()
		faqPage.typeInSearchInput('payment')
		faqPage.getAllQuestions().each((question) => {
			cy.wrap(question).click()
			faqPage.getQuestionPopUp().filter(`:contains("${question.text()}")`)
				.should('be.visible')
				.and('contain.text', 'payment')
			faqPage.clickClosePopUpButton()
			faqPage.getQuestionPopUp().filter(`:contains("${question.text()}")`).should('not.be.visible').wait(200)
		})
	})
})
