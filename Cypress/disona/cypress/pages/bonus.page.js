import { BasePage } from './base.page'
import { recurse } from 'cypress-recurse'

const steps = 'foreignObject'
const prevButton = '[class*="styled__PrevBtn-"]'
const nextButton = '[class*="styled__NextBtn-"]'
export class BonusPage extends BasePage{
	getAllSteps = () => cy.get(steps)
	getStepByNumber = (number) => cy.get(`${steps}:eq(${number-1})`)
	getActiveStep = () => cy.get('.fzBcVy').parents('.bonus-hill-bubble').next(steps)
	getPrevButton = () => cy.get(prevButton)
	getNextButton = () => cy.get(nextButton).not(prevButton)
	clickNextButton = () => this.getNextButton().click()
	clickPrevButton = ({force=false}={}) => this.getPrevButton().click({force})
	clickPrevButtonTillDisabled = () => recurse(
		() => this.getPrevButton(),
		(btn) => expect(btn).to.be.disabled,
		{
			log: false,
			limit: 4,
			delay: 1000,
			post() {
				const bonusPage = new BonusPage()
				bonusPage.clickPrevButton({force:true})
			}
		})
}