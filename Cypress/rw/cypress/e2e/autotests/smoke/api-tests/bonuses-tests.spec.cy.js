import { getAvailableBonuses, getConditionsForBonus } from '/cypress/api/bonuses-requests'
import { bonusGUID } from '../../../../support/app-data'
import { verifyBonusConditions } from '../../../../support/Helpers'

describe('Bonuses api tests', {tags: 'smoke'}, () => {

	it('C2779: should check available bonuses GUID', async function() {
		await getAvailableBonuses().then(response => {
			expect(response.status).to.eq(200)
			expect(response.body).to.contain(bonusGUID['welcome_bonus'])
			expect(response.body).to.contain(bonusGUID['trades_count_bonus'])
			expect(response.body).to.contain(bonusGUID['volume_bonus'])
			expect(response.body).to.contain(bonusGUID['promocode_bonus'])
		})
	})

	it('C2780: should check "welcome" bonus conditions', async function() {
		await getConditionsForBonus(bonusGUID['welcome_bonus']).then(response => {
			expect(response.status).to.eq(200)
			verifyBonusConditions(response, 0, 1, 40, 1, 10, 0, 0)
			verifyBonusConditions(response, 1, 2, 40, 3, 50, 0, 0)
			verifyBonusConditions(response, 2, 3, 40, 7, 100, 0, 0)
		})
	})

	it('C2781: should check "trades count" bonus conditions', async function() {
		await getConditionsForBonus(bonusGUID['trades_count_bonus']).then(response => {
			expect(response.status).to.eq(200)
			verifyBonusConditions(response, 0, 1, 10, 10, 0, 86400, 0)
			verifyBonusConditions(response, 1, 2, 25, 100, 0, 604800, 0)
			verifyBonusConditions(response, 2, 3, 50, 200, 0, 864000, 0)
		})
	})

	it('C2782: should check "volume" bonus conditions', async function() {
		await getConditionsForBonus(bonusGUID['volume_bonus']).then(response => {
			expect(response.status).to.eq(200)
			verifyBonusConditions(response, 0, 1, 2, 0, 0, 0, 10)
			verifyBonusConditions(response, 1, 2, 2.5, 0, 0, 0, 20)
			verifyBonusConditions(response, 2, 3, 3, 0, 0, 0, 30)
		})
	})

	it('C2783: should check "promocode" bonus conditions', async function() {
		await getConditionsForBonus(bonusGUID['promocode_bonus']).then(response => {
			expect(response.status).to.eq(200)
			verifyBonusConditions(response, 0, 1, 40, 1, 10, 0, 0)
			verifyBonusConditions(response, 1, 2, 40, 3, 50, 0, 0)
			verifyBonusConditions(response, 2, 3, 40, 7, 100, 0, 0)
		})
	})
})