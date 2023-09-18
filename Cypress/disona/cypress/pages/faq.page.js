import { BasePage } from './base.page'

const question = '[class*="styled__Question-"]'
const questionPopUp = '[class*="styled__AnswerModal-"]'
const closePopUpBtn = '[class*="styled__CloseBtnWrapper"]'
const searchInput = 'input[class*="styled__Input-"]'

export class FAQPage extends BasePage{
		getAllQuestions = () => cy.get(question)
		getQuestionPopUp = () => cy.get(questionPopUp)
		clickClosePopUpButton = () => cy.get(closePopUpBtn).click()
		getSearchInput = () => cy.get(searchInput)
		typeInSearchInput = (text) => this.getSearchInput().type(text).wait(200)
}