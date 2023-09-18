import { currencyPairs, timeInterval } from '../../../../support/app-data'
import { verifyCandlesCount, verifyCandlesSorting } from '../../../../support/Helpers'
import { getCandlesInGivenParisAndTimeInterval } from '../../../../api/candles-requests'

describe('Forex crypto instruments api tests', {tags: 'smoke'}, () => {
	const to = (parseInt(Date.now().toString()) - 300000).toString()
	const from = (parseInt(to) - 3600000).toString()

	it('C583: should check the number of BTC/USD candles and sorting for M1', async function() {
		await getCandlesInGivenParisAndTimeInterval(currencyPairs['btc_usd_rw'], timeInterval['m1'],
			from, to).then(response => {
			const times = response.body.map((el) => Number(el.time))
			expect(response.status).to.eq(200)
			verifyCandlesCount(times, timeInterval['m1'], currencyPairs['btc_usd_rw'])
			verifyCandlesSorting(times, 1)
		})
	})

	it('C583: should check the number of BTC/USD candles and sorting for M5', async function() {
		await getCandlesInGivenParisAndTimeInterval(currencyPairs['btc_usd_rw'], timeInterval['m5'],
			from, to).then(response => {
			const times = response.body.map((el) => Number(el.time))
			expect(response.status).to.eq(200)
			verifyCandlesCount(times, timeInterval['m5'], currencyPairs['btc_usd_rw'])
			verifyCandlesSorting(times, 5)
		})
	})

	it('C583: should check the number of BTC/USD candles and sorting for M15', async function() {
		await getCandlesInGivenParisAndTimeInterval(currencyPairs['btc_usd_rw'], timeInterval['m15'],
			from, to).then(response => {
			const times = response.body.map((el) => Number(el.time))
			expect(response.status).to.eq(200)
			verifyCandlesCount(times, timeInterval['m15'], currencyPairs['btc_usd_rw'])
			verifyCandlesSorting(times, 15)
		})
	})

	it('C583: should check the number of BTC/USD candles and sorting for M30', async function() {
		await getCandlesInGivenParisAndTimeInterval(currencyPairs['btc_usd_rw'], timeInterval['m30'],
			from, to).then(response => {
			const times = response.body.map((el) => Number(el.time))
			expect(response.status).to.eq(200)
			verifyCandlesCount(times, timeInterval['m30'], currencyPairs['btc_usd_rw'])
			verifyCandlesSorting(times, 30)
		})
	})

	it('C583: should check the number of BTC/USD candles and sorting for H1', async function() {
		await getCandlesInGivenParisAndTimeInterval(currencyPairs['btc_usd_rw'], timeInterval['h1'],
			from, to).then(response => {
			const times = response.body.map((el) => Number(el.time))
			expect(response.status).to.eq(200)
			verifyCandlesCount(times, timeInterval['h1'], currencyPairs['btc_usd_rw'])
			verifyCandlesSorting(times, 60)
		})
	})

	it('C583: should check the number of ETH/USD candles and sorting for M1', async function() {
		await getCandlesInGivenParisAndTimeInterval(currencyPairs['eth_usd_rw'], timeInterval['m1'],
			from, to).then(response => {
			const times = response.body.map((el) => Number(el.time))
			expect(response.status).to.eq(200)
			verifyCandlesCount(times, timeInterval['m1'], currencyPairs['eth_usd_rw'])
			verifyCandlesSorting(times, 1)
		})
	})

	it('C583: should check the number of ETH/USD candles and sorting for M5', async function() {
		await getCandlesInGivenParisAndTimeInterval(currencyPairs['eth_usd_rw'], timeInterval['m5'],
			from, to).then(response => {
			const times = response.body.map((el) => Number(el.time))
			expect(response.status).to.eq(200)
			verifyCandlesCount(times, timeInterval['m5'], currencyPairs['eth_usd_rw'])
			verifyCandlesSorting(times, 5)
		})
	})

	it('C583: should check the number of ETH/USD candles and sorting for M15', async function() {
		await getCandlesInGivenParisAndTimeInterval(currencyPairs['eth_usd_rw'], timeInterval['m15'],
			from, to).then(response => {
			const times = response.body.map((el) => Number(el.time))
			expect(response.status).to.eq(200)
			verifyCandlesCount(times, timeInterval['m15'], currencyPairs['eth_usd_rw'])
			verifyCandlesSorting(times, 15)
		})
	})

	it('C583: should check the number of ETH/USD candles and sorting for M30', async function() {
		await getCandlesInGivenParisAndTimeInterval(currencyPairs['eth_usd_rw'], timeInterval['m30'],
			from, to).then(response => {
			const times = response.body.map((el) => Number(el.time))
			expect(response.status).to.eq(200)
			verifyCandlesCount(times, timeInterval['m30'], currencyPairs['eth_usd_rw'])
			verifyCandlesSorting(times, 30)
		})
	})

	it('C583: should check the number of ETH/USD candles and sorting for H1', async function() {
		await getCandlesInGivenParisAndTimeInterval(currencyPairs['eth_usd_rw'], timeInterval['h1'],
			from, to).then(response => {
			const times = response.body.map((el) => Number(el.time))
			expect(response.status).to.eq(200)
			verifyCandlesCount(times, timeInterval['h1'], currencyPairs['eth_usd_rw'])
			verifyCandlesSorting(times, 60)
		})
	})

	it('C583: should check the number of LTC/USD candles and sorting for M1', async function() {
		await getCandlesInGivenParisAndTimeInterval(currencyPairs['ltc_usd_rw'], timeInterval['m1'],
			from, to).then(response => {
			const times = response.body.map((el) => Number(el.time))
			expect(response.status).to.eq(200)
			verifyCandlesCount(times, timeInterval['m1'], currencyPairs['ltc_usd_rw'])
			verifyCandlesSorting(times, 1)
		})
	})

	it('C583: should check the number of LTC/USD candles and sorting for M5', async function() {
		await getCandlesInGivenParisAndTimeInterval(currencyPairs['ltc_usd_rw'], timeInterval['m5'],
			from, to).then(response => {
			const times = response.body.map((el) => Number(el.time))
			expect(response.status).to.eq(200)
			verifyCandlesCount(times, timeInterval['m5'], currencyPairs['ltc_usd_rw'])
			verifyCandlesSorting(times, 5)
		})
	})

	it('C583: should check the number of LTC/USD candles and sorting for M15', async function() {
		await getCandlesInGivenParisAndTimeInterval(currencyPairs['ltc_usd_rw'], timeInterval['m15'],
			from, to).then(response => {
			const times = response.body.map((el) => Number(el.time))
			expect(response.status).to.eq(200)
			verifyCandlesCount(times, timeInterval['m15'], currencyPairs['ltc_usd_rw'])
			verifyCandlesSorting(times, 15)
		})
	})

	it('C583: should check the number of LTC/USD candles and sorting for M30', async function() {
		await getCandlesInGivenParisAndTimeInterval(currencyPairs['ltc_usd_rw'], timeInterval['m30'],
			from, to).then(response => {
			const times = response.body.map((el) => Number(el.time))
			expect(response.status).to.eq(200)
			verifyCandlesCount(times, timeInterval['m30'], currencyPairs['ltc_usd_rw'])
			verifyCandlesSorting(times, 30)
		})
	})

	it('C583: should check the number of LTC/USD candles and sorting for H1', async function() {
		await getCandlesInGivenParisAndTimeInterval(currencyPairs['ltc_usd_rw'], timeInterval['h1'],
			from, to).then(response => {
			const times = response.body.map((el) => Number(el.time))
			expect(response.status).to.eq(200)
			verifyCandlesCount(times, timeInterval['h1'], currencyPairs['ltc_usd_rw'])
			verifyCandlesSorting(times, 60)
		})
	})

	it.skip('should check the number of XLM/USD candles and sorting for M1', async function() {
		await getCandlesInGivenParisAndTimeInterval(currencyPairs['xlm_usd_rw'], timeInterval['m1'],
			from, to).then(response => {
			const times = response.body.map(async (el) => Number(el.time))
			expect(response.status).to.eq(200)
			verifyCandlesCount(times, timeInterval['m1'], currencyPairs['xlm_usd_rw'])
			verifyCandlesSorting(times, 1)
		})
	})

	it('C583: should check the number of XLM/USD candles and sorting for M5', async function() {
		await getCandlesInGivenParisAndTimeInterval(currencyPairs['xlm_usd_rw'], timeInterval['m5'],
			from, to).then(response => {
			const times = response.body.map((el) => Number(el.time))
			expect(response.status).to.eq(200)
			verifyCandlesCount(times, timeInterval['m5'], currencyPairs['xlm_usd_rw'])
			verifyCandlesSorting(times, 5)
		})
	})

	it('C583: should check the number of XLM/USD candles and sorting for M15', async function() {
		await getCandlesInGivenParisAndTimeInterval(currencyPairs['xlm_usd_rw'], timeInterval['m15'],
			from, to).then(response => {
			const times = response.body.map((el) => Number(el.time))
			expect(response.status).to.eq(200)
			verifyCandlesCount(times, timeInterval['m15'], currencyPairs['xlm_usd_rw'])
			verifyCandlesSorting(times, 15)
		})
	})

	it('C583: should check the number of XLM/USD candles and sorting for M30', async function() {
		await getCandlesInGivenParisAndTimeInterval(currencyPairs['xlm_usd_rw'], timeInterval['m30'],
			from, to).then(response => {
			const times = response.body.map((el) => Number(el.time))
			expect(response.status).to.eq(200)
			verifyCandlesCount(times, timeInterval['m30'], currencyPairs['xlm_usd_rw'])
			verifyCandlesSorting(times, 30)
		})
	})

	it('C583: should check the number of XLM/USD candles and sorting for H1', async function() {
		await getCandlesInGivenParisAndTimeInterval(currencyPairs['xlm_usd_rw'], timeInterval['h1'],
			from, to).then(response => {
			const times = response.body.map((el) => Number(el.time))
			expect(response.status).to.eq(200)
			verifyCandlesCount(times, timeInterval['h1'], currencyPairs['xlm_usd_rw'])
			verifyCandlesSorting(times, 60)
		})
	})

	it('C583: should check the number of XRP/USD candles and sorting for M1', async function() {
		await getCandlesInGivenParisAndTimeInterval(currencyPairs['xrp_usd_rw'], timeInterval['m1'],
			from, to).then(response => {
			const times = response.body.map((el) => Number(el.time))
			expect(response.status).to.eq(200)
			verifyCandlesCount(times, timeInterval['m1'], currencyPairs['xrp_usd_rw'])
			verifyCandlesSorting(times, 1)
		})
	})

	it('C583: should check the number of XRP/USD candles and sorting for M5', async function() {
		await getCandlesInGivenParisAndTimeInterval(currencyPairs['xrp_usd_rw'], timeInterval['m5'],
			from, to).then(response => {
			const times = response.body.map((el) => Number(el.time))
			expect(response.status).to.eq(200)
			verifyCandlesCount(times, timeInterval['m5'], currencyPairs['xrp_usd_rw'])
			verifyCandlesSorting(times, 5)
		})
	})

	it('C583: should check the number of XRP/USD candles and sorting for M15', async function() {
		await getCandlesInGivenParisAndTimeInterval(currencyPairs['xrp_usd_rw'], timeInterval['m15'],
			from, to).then(response => {
			const times = response.body.map((el) => Number(el.time))
			expect(response.status).to.eq(200)
			verifyCandlesCount(times, timeInterval['m15'], currencyPairs['xrp_usd_rw'])
			verifyCandlesSorting(times, 15)
		})
	})

	it('C583: should check the number of XRP/USD candles and sorting for M30', async function() {
		await getCandlesInGivenParisAndTimeInterval(currencyPairs['xrp_usd_rw'], timeInterval['m30'],
			from, to).then(response => {
			const times = response.body.map((el) => Number(el.time))
			expect(response.status).to.eq(200)
			verifyCandlesCount(times, timeInterval['m30'], currencyPairs['xrp_usd_rw'])
			verifyCandlesSorting(times, 30)
		})
	})

	it('C583: should check the number of XRP/USD candles and sorting for H1', async function() {
		await getCandlesInGivenParisAndTimeInterval(currencyPairs['xrp_usd_rw'], timeInterval['h1'],
			from, to).then(response => {
			const times = response.body.map((el) => Number(el.time))
			expect(response.status).to.eq(200)
			verifyCandlesCount(times, timeInterval['h1'], currencyPairs['xrp_usd_rw'])
			verifyCandlesSorting(times, 60)
		})
	})

	it('C583: should check the number of DOT/USD candles and sorting for M1', async function() {
		await getCandlesInGivenParisAndTimeInterval(currencyPairs['dot_usd_rw'], timeInterval['m1'],
			from, to).then(response => {
			const times = response.body.map((el) => Number(el.time))
			expect(response.status).to.eq(200)
			verifyCandlesCount(times, timeInterval['m1'], currencyPairs['dot_usd_rw'])
			verifyCandlesSorting(times, 1)
		})
	})

	it('C583: should check the number of DOT/USD candles and sorting for M5', async function() {
		await getCandlesInGivenParisAndTimeInterval(currencyPairs['dot_usd_rw'], timeInterval['m5'],
			from, to).then(response => {
			const times = response.body.map((el) => Number(el.time))
			expect(response.status).to.eq(200)
			verifyCandlesCount(times, timeInterval['m5'], currencyPairs['dot_usd_rw'])
			verifyCandlesSorting(times, 5)
		})
	})

	it('C583: should check the number of DOT/USD candles and sorting for M15', async function() {
		await getCandlesInGivenParisAndTimeInterval(currencyPairs['dot_usd_rw'], timeInterval['m15'],
			from, to).then(response => {
			const times = response.body.map((el) => Number(el.time))
			expect(response.status).to.eq(200)
			verifyCandlesCount(times, timeInterval['m15'], currencyPairs['dot_usd_rw'])
			verifyCandlesSorting(times, 15)
		})
	})

	it('C583: should check the number of DOT/USD candles and sorting for M30', async function() {
		await getCandlesInGivenParisAndTimeInterval(currencyPairs['dot_usd_rw'], timeInterval['m30'],
			from, to).then(response => {
			const times = response.body.map((el) => Number(el.time))
			expect(response.status).to.eq(200)
			verifyCandlesCount(times, timeInterval['m30'], currencyPairs['dot_usd_rw'])
			verifyCandlesSorting(times, 30)
		})
	})

	it('C583: should check the number of DOT/USD candles and sorting for H1', async function() {
		await getCandlesInGivenParisAndTimeInterval(currencyPairs['dot_usd_rw'], timeInterval['h1'],
			from, to).then(response => {
			const times = response.body.map((el) => Number(el.time))
			expect(response.status).to.eq(200)
			verifyCandlesCount(times, timeInterval['h1'], currencyPairs['dot_usd_rw'])
			verifyCandlesSorting(times, 60)
		})
	})

	it('C583: should check the number of ADA/USD candles and sorting for M1', async function() {
		await getCandlesInGivenParisAndTimeInterval(currencyPairs['ada_usd_rw'], timeInterval['m1'],
			from, to).then(response => {
			const times = response.body.map((el) => Number(el.time))
			expect(response.status).to.eq(200)
			verifyCandlesCount(times, timeInterval['m1'], currencyPairs['ada_usd_rw'])
			verifyCandlesSorting(times, 1)
		})
	})

	it('C583: should check the number of ADA/USD candles and sorting for M5', async function() {
		await getCandlesInGivenParisAndTimeInterval(currencyPairs['ada_usd_rw'], timeInterval['m5'],
			from, to).then(response => {
			const times = response.body.map((el) => Number(el.time))
			expect(response.status).to.eq(200)
			verifyCandlesCount(times, timeInterval['m5'], currencyPairs['ada_usd_rw'])
			verifyCandlesSorting(times, 5)
		})
	})

	it('C583: should check the number of ADA/USD candles and sorting for M15', async function() {
		await getCandlesInGivenParisAndTimeInterval(currencyPairs['ada_usd_rw'], timeInterval['m15'],
			from, to).then(response => {
			const times = response.body.map((el) => Number(el.time))
			expect(response.status).to.eq(200)
			verifyCandlesCount(times, timeInterval['m15'], currencyPairs['ada_usd_rw'])
			verifyCandlesSorting(times, 15)
		})
	})

	it('C583: should check the number of ADA/USD candles and sorting for M30', async function() {
		await getCandlesInGivenParisAndTimeInterval(currencyPairs['ada_usd_rw'], timeInterval['m30'],
			from, to).then(response => {
			const times = response.body.map((el) => Number(el.time))
			expect(response.status).to.eq(200)
			verifyCandlesCount(times, timeInterval['m30'], currencyPairs['ada_usd_rw'])
			verifyCandlesSorting(times, 30)
		})
	})

	it('C583: should check the number of ADA/USD candles and sorting for H1', async function() {
		await getCandlesInGivenParisAndTimeInterval(currencyPairs['ada_usd_rw'], timeInterval['h1'],
			from, to).then(response => {
			const times = response.body.map((el) => Number(el.time))
			expect(response.status).to.eq(200)
			verifyCandlesCount(times, timeInterval['h1'], currencyPairs['ada_usd_rw'])
			verifyCandlesSorting(times, 60)
		})
	})
})