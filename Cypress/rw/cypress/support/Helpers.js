import { timeInterval } from './app-data'

export function getRandomNumber(length) {
	return Math.floor(Math.random() * Math.pow(10, length))
}

export function verifyCandlesSorting(candles, minute) {
	try {
		for (let i = 0; i < candles.length - 1; i++) {
			assert((candles[i + 1] - candles[i]) === 60000 * minute)
		}
	} catch (error) {
		cy.log(error.stackTrace)
	}
}

export function verifyCandlesCount(candles, minute, currencies) {
	cy.log(`${currencies} Candles length for ${minute} in one hour is ` + candles.length)
	if (minute === timeInterval['m1']) {
		assert(candles.length === 60)
	} else if (minute === timeInterval['m5']) {
		assert(candles.length === 12)
	} else if (minute === timeInterval['m15']) {
		assert(candles.length === 4)
	} else if (minute === timeInterval['m30']) {
		assert(candles.length === 2)
	} else if (minute === timeInterval['h1']) {
		assert(candles.length === 1)
	}
}

export function verifyBonusConditions(response, index, level, bonusAmount, deals, deposit, timeFrame, volume) {
	expect(response.body.levels[index].level).to.eq(level)
	expect(response.body.levels[index].bonus_amount).to.eq(bonusAmount)
	expect(response.body.levels[index].level_conditions.deals).to.eq(deals)
	expect(response.body.levels[index].level_conditions.deposit).to.eq(deposit)
	expect(response.body.levels[index].level_conditions.time_frame).to.eq(timeFrame)
	expect(response.body.levels[index].level_conditions.volume).to.eq(volume)
}