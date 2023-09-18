import { getCandlesInGivenParisAndTimeInterval } from '../../../../api/candles-requests'
import { currencyPairs, timeInterval } from '../../../../support/app-data'
import { verifyCandlesCount, verifyCandlesSorting } from '../../../../support/Helpers'

describe('Forex major instruments api tests', {tags: 'smoke'}, () => {
	const to = (parseInt(Date.now().toString()) - 300000).toString()
	const from = (parseInt(to) - 3600000).toString()

	it('C583: should check the number of EUR/USD candles and sorting for M1', async function() {
		await getCandlesInGivenParisAndTimeInterval(currencyPairs['eur_usd_rw'], timeInterval['m1'],
			from, to).then(response => {
			const times = response.body.map((el) => Number(el.time))
			expect(response.status).to.eq(200)
			verifyCandlesCount(times, timeInterval['m1'], currencyPairs['eur_usd_rw'])
			verifyCandlesSorting(times, 1)
		})
	})

	it('C583: should check the number of EUR/USD candles and sorting for M5', async function() {
		await getCandlesInGivenParisAndTimeInterval(currencyPairs['eur_usd_rw'], timeInterval['m5'],
			from, to).then(response => {
			const times = response.body.map((el) => Number(el.time))
			expect(response.status).to.eq(200)
			verifyCandlesCount(times, timeInterval['m5'], currencyPairs['eur_usd_rw'])
			verifyCandlesSorting(times, 5)
		})
	})

	it('C583: should check the number of EUR/USD candles and sorting for M15', async function() {
		await getCandlesInGivenParisAndTimeInterval(currencyPairs['eur_usd_rw'], timeInterval['m15'],
			from, to).then(response => {
			const times = response.body.map((el) => Number(el.time))
			expect(response.status).to.eq(200)
			verifyCandlesCount(times, timeInterval['m15'], currencyPairs['eur_usd_rw'])
			verifyCandlesSorting(times, 15)
		})
	})

	it('C583: should check the number of EUR/USD candles and sorting for M30', async function() {
		await getCandlesInGivenParisAndTimeInterval(currencyPairs['eur_usd_rw'], timeInterval['m30'],
			from, to).then(response => {
			const times = response.body.map((el) => Number(el.time))
			expect(response.status).to.eq(200)
			verifyCandlesCount(times, timeInterval['m30'], currencyPairs['eur_usd_rw'])
			verifyCandlesSorting(times, 30)
		})
	})

	it('C583: should check the number of EUR/USD candles and sorting for H1', async function() {
		await getCandlesInGivenParisAndTimeInterval(currencyPairs['eur_usd_rw'], timeInterval['h1'],
			from, to).then(response => {
			const times = response.body.map((el) => Number(el.time))
			expect(response.status).to.eq(200)
			verifyCandlesCount(times, timeInterval['h1'], currencyPairs['eur_usd_rw'])
			verifyCandlesSorting(times, 60)
		})
	})

	it('C583: should check the number of GBP/USD candles and sorting for M1', async function() {
		await getCandlesInGivenParisAndTimeInterval(currencyPairs['gbp_usd_rw'], timeInterval['m1'],
			from, to).then(response => {
			const times = response.body.map((el) => Number(el.time))
			expect(response.status).to.eq(200)
			verifyCandlesCount(times, timeInterval['m1'], currencyPairs['gbp_usd_rw'])
			verifyCandlesSorting(times, 1)
		})
	})

	it('C583: should check the number of GBP/USD candles and sorting for M5', async function() {
		await getCandlesInGivenParisAndTimeInterval(currencyPairs['gbp_usd_rw'], timeInterval['m5'],
			from, to).then(response => {
			const times = response.body.map((el) => Number(el.time))
			expect(response.status).to.eq(200)
			verifyCandlesCount(times, timeInterval['m5'], currencyPairs['gbp_usd_rw'])
			verifyCandlesSorting(times, 5)
		})
	})

	it('C583: should check the number of GBP/USD candles and sorting for M15', async function() {
		await getCandlesInGivenParisAndTimeInterval(currencyPairs['gbp_usd_rw'], timeInterval['m15'],
			from, to).then(response => {
			const times = response.body.map((el) => Number(el.time))
			expect(response.status).to.eq(200)
			verifyCandlesCount(times, timeInterval['m15'], currencyPairs['gbp_usd_rw'])
			verifyCandlesSorting(times, 15)
		})
	})

	it('C583: should check the number of GBP/USD candles and sorting for M30', async function() {
		await getCandlesInGivenParisAndTimeInterval(currencyPairs['gbp_usd_rw'], timeInterval['m30'],
			from, to).then(response => {
			const times = response.body.map((el) => Number(el.time))
			expect(response.status).to.eq(200)
			verifyCandlesCount(times, timeInterval['m30'], currencyPairs['gbp_usd_rw'])
			verifyCandlesSorting(times, 30)
		})
	})

	it('C583: should check the number of GBP/USD candles and sorting for H1', async function() {
		await getCandlesInGivenParisAndTimeInterval(currencyPairs['gbp_usd_rw'], timeInterval['h1'],
			from, to).then(response => {
			const times = response.body.map((el) => Number(el.time))
			expect(response.status).to.eq(200)
			verifyCandlesCount(times, timeInterval['h1'], currencyPairs['gbp_usd_rw'])
			verifyCandlesSorting(times, 60)
		})
	})

	it('C583: should check the number of USD/CHF candles and sorting for M1', async function() {
		await getCandlesInGivenParisAndTimeInterval(currencyPairs['usd_chf_rw'], timeInterval['m1'],
			from, to).then(response => {
			const times = response.body.map((el) => Number(el.time))
			expect(response.status).to.eq(200)
			verifyCandlesCount(times, timeInterval['m1'], currencyPairs['usd_chf_rw'])
			verifyCandlesSorting(times, 1)
		})
	})

	it('C583: should check the number of USD/CHF candles and sorting for M5', async function() {
		await getCandlesInGivenParisAndTimeInterval(currencyPairs['usd_chf_rw'], timeInterval['m5'],
			from, to).then(response => {
			const times = response.body.map((el) => Number(el.time))
			expect(response.status).to.eq(200)
			verifyCandlesCount(times, timeInterval['m5'], currencyPairs['usd_chf_rw'])
			verifyCandlesSorting(times, 5)
		})
	})

	it('C583: should check the number of USD/CHF candles and sorting for M15', async function() {
		await getCandlesInGivenParisAndTimeInterval(currencyPairs['usd_chf_rw'], timeInterval['m15'],
			from, to).then(response => {
			const times = response.body.map((el) => Number(el.time))
			expect(response.status).to.eq(200)
			verifyCandlesCount(times, timeInterval['m15'], currencyPairs['usd_chf_rw'])
			verifyCandlesSorting(times, 15)
		})
	})

	it('C583: should check the number of USD/CHF candles and sorting for M30', async function() {
		await getCandlesInGivenParisAndTimeInterval(currencyPairs['usd_chf_rw'], timeInterval['m30'],
			from, to).then(response => {
			const times = response.body.map((el) => Number(el.time))
			expect(response.status).to.eq(200)
			verifyCandlesCount(times, timeInterval['m30'], currencyPairs['usd_chf_rw'])
			verifyCandlesSorting(times, 30)
		})
	})

	it('C583: should check the number of USD/CHF candles and sorting for H1', async function() {
		await getCandlesInGivenParisAndTimeInterval(currencyPairs['usd_chf_rw'], timeInterval['h1'],
			from, to).then(response => {
			const times = response.body.map((el) => Number(el.time))
			expect(response.status).to.eq(200)
			verifyCandlesCount(times, timeInterval['h1'], currencyPairs['usd_chf_rw'])
			verifyCandlesSorting(times, 60)
		})
	})

	it('C583: should check the number of USD/JPY candles and sorting for M1', async function() {
		await getCandlesInGivenParisAndTimeInterval(currencyPairs['usd_jpy_rw'], timeInterval['m1'],
			from, to).then(response => {
			const times = response.body.map((el) => Number(el.time))
			expect(response.status).to.eq(200)
			verifyCandlesCount(times, timeInterval['m1'], currencyPairs['usd_jpy_rw'])
			verifyCandlesSorting(times, 1)
		})
	})

	it('C583: should check the number of USD/JPY candles and sorting for M5', async function() {
		await getCandlesInGivenParisAndTimeInterval(currencyPairs['usd_jpy_rw'], timeInterval['m5'],
			from, to).then(response => {
			const times = response.body.map((el) => Number(el.time))
			expect(response.status).to.eq(200)
			verifyCandlesCount(times, timeInterval['m5'], currencyPairs['usd_jpy_rw'])
			verifyCandlesSorting(times, 5)
		})
	})

	it('C583: should check the number of USD/JPY candles and sorting for M15', async function() {
		await getCandlesInGivenParisAndTimeInterval(currencyPairs['usd_jpy_rw'], timeInterval['m15'],
			from, to).then(response => {
			const times = response.body.map((el) => Number(el.time))
			expect(response.status).to.eq(200)
			verifyCandlesCount(times, timeInterval['m15'], currencyPairs['usd_jpy_rw'])
			verifyCandlesSorting(times, 15)
		})
	})

	it('C583: should check the number of USD/JPY candles and sorting for M30', async function() {
		await getCandlesInGivenParisAndTimeInterval(currencyPairs['usd_jpy_rw'], timeInterval['m30'],
			from, to).then(response => {
			const times = response.body.map((el) => Number(el.time))
			expect(response.status).to.eq(200)
			verifyCandlesCount(times, timeInterval['m30'], currencyPairs['usd_jpy_rw'])
			verifyCandlesSorting(times, 30)
		})
	})

	it('C583: should check the number of USD/JPY candles and sorting for H1', async function() {
		await getCandlesInGivenParisAndTimeInterval(currencyPairs['usd_jpy_rw'], timeInterval['h1'],
			from, to).then(response => {
			const times = response.body.map((el) => Number(el.time))
			expect(response.status).to.eq(200)
			verifyCandlesCount(times, timeInterval['h1'], currencyPairs['usd_jpy_rw'])
			verifyCandlesSorting(times, 60)
		})
	})

	it('C583: should check the number of USD/CAD candles and sorting for M1', async function() {
		await getCandlesInGivenParisAndTimeInterval(currencyPairs['usd_cad_rw'], timeInterval['m1'],
			from, to).then(response => {
			const times = response.body.map((el) => Number(el.time))
			expect(response.status).to.eq(200)
			verifyCandlesCount(times, timeInterval['m1'], currencyPairs['usd_cad_rw'])
			verifyCandlesSorting(times, 1)
		})
	})

	it('C583: should check the number of USD/CAD candles and sorting for M5', async function() {
		await getCandlesInGivenParisAndTimeInterval(currencyPairs['usd_cad_rw'], timeInterval['m5'],
			from, to).then(response => {
			const times = response.body.map((el) => Number(el.time))
			expect(response.status).to.eq(200)
			verifyCandlesCount(times, timeInterval['m5'], currencyPairs['usd_cad_rw'])
			verifyCandlesSorting(times, 5)
		})
	})

	it('C583: should check the number of USD/CAD candles and sorting for M15', async function() {
		await getCandlesInGivenParisAndTimeInterval(currencyPairs['usd_cad_rw'], timeInterval['m15'],
			from, to).then(response => {
			const times = response.body.map((el) => Number(el.time))
			expect(response.status).to.eq(200)
			verifyCandlesCount(times, timeInterval['m15'], currencyPairs['usd_cad_rw'])
			verifyCandlesSorting(times, 15)
		})
	})

	it('C583: should check the number of USD/CAD candles and sorting for M30', async function() {
		await getCandlesInGivenParisAndTimeInterval(currencyPairs['usd_cad_rw'], timeInterval['m30'],
			from, to).then(response => {
			const times = response.body.map((el) => Number(el.time))
			expect(response.status).to.eq(200)
			verifyCandlesCount(times, timeInterval['m30'], currencyPairs['usd_cad_rw'])
			verifyCandlesSorting(times, 30)
		})
	})

	it('C583: should check the number of USD/CAD candles and sorting for H1', async function() {
		await getCandlesInGivenParisAndTimeInterval(currencyPairs['usd_cad_rw'], timeInterval['h1'],
			from, to).then(response => {
			const times = response.body.map((el) => Number(el.time))
			expect(response.status).to.eq(200)
			verifyCandlesCount(times, timeInterval['h1'], currencyPairs['usd_cad_rw'])
			verifyCandlesSorting(times, 60)
		})
	})

	it('C583: should check the number of AUD/USD candles and sorting for M1', async function() {
		await getCandlesInGivenParisAndTimeInterval(currencyPairs['aud_usd_rw'], timeInterval['m1'],
			from, to).then(response => {
			const times = response.body.map((el) => Number(el.time))
			expect(response.status).to.eq(200)
			verifyCandlesCount(times, timeInterval['m1'], currencyPairs['aud_usd_rw'])
			verifyCandlesSorting(times, 1)
		})
	})

	it('C583: should check the number of AUD/USD candles and sorting for M5', async function() {
		await getCandlesInGivenParisAndTimeInterval(currencyPairs['aud_usd_rw'], timeInterval['m5'],
			from, to).then(response => {
			const times = response.body.map((el) => Number(el.time))
			expect(response.status).to.eq(200)
			verifyCandlesCount(times, timeInterval['m5'], currencyPairs['aud_usd_rw'])
			verifyCandlesSorting(times, 5)
		})
	})

	it('C583: should check the number of AUD/USD candles and sorting for M15', async function() {
		await getCandlesInGivenParisAndTimeInterval(currencyPairs['aud_usd_rw'], timeInterval['m15'],
			from, to).then(response => {
			const times = response.body.map((el) => Number(el.time))
			expect(response.status).to.eq(200)
			verifyCandlesCount(times, timeInterval['m15'], currencyPairs['aud_usd_rw'])
			verifyCandlesSorting(times, 15)
		})
	})

	it('C583: should check the number of AUD/USD candles and sorting for M30', async function() {
		await getCandlesInGivenParisAndTimeInterval(currencyPairs['aud_usd_rw'], timeInterval['m30'],
			from, to).then(response => {
			const times = response.body.map((el) => Number(el.time))
			expect(response.status).to.eq(200)
			verifyCandlesCount(times, timeInterval['m30'], currencyPairs['aud_usd_rw'])
			verifyCandlesSorting(times, 30)
		})
	})

	it('C583: should check the number of AUD/USD candles and sorting for H1', async function() {
		await getCandlesInGivenParisAndTimeInterval(currencyPairs['aud_usd_rw'], timeInterval['h1'],
			from, to).then(response => {
			const times = response.body.map((el) => Number(el.time))
			expect(response.status).to.eq(200)
			verifyCandlesCount(times, timeInterval['h1'], currencyPairs['aud_usd_rw'])
			verifyCandlesSorting(times, 60)
		})
	})

	it('C583: should check the number of AUD/NZD candles and sorting for M1', async function() {
		await getCandlesInGivenParisAndTimeInterval(currencyPairs['aud_nzd_rw'], timeInterval['m1'],
			from, to).then(response => {
			const times = response.body.map((el) => Number(el.time))
			expect(response.status).to.eq(200)
			verifyCandlesCount(times, timeInterval['m1'], currencyPairs['aud_nzd_rw'])
			verifyCandlesSorting(times, 1)
		})
	})

	it('C583: should check the number of AUD/NZD candles and sorting for M5', async function() {
		await getCandlesInGivenParisAndTimeInterval(currencyPairs['aud_nzd_rw'], timeInterval['m5'],
			from, to).then(response => {
			const times = response.body.map((el) => Number(el.time))
			expect(response.status).to.eq(200)
			verifyCandlesCount(times, timeInterval['m5'], currencyPairs['aud_nzd_rw'])
			verifyCandlesSorting(times, 5)
		})
	})

	it('C583: should check the number of AUD/NZD candles and sorting for M15', async function() {
		await getCandlesInGivenParisAndTimeInterval(currencyPairs['aud_nzd_rw'], timeInterval['m15'],
			from, to).then(response => {
			const times = response.body.map((el) => Number(el.time))
			expect(response.status).to.eq(200)
			verifyCandlesCount(times, timeInterval['m15'], currencyPairs['aud_nzd_rw'])
			verifyCandlesSorting(times, 15)
		})
	})

	it('C583: should check the number of AUD/NZD candles and sorting for M30', async function() {
		await getCandlesInGivenParisAndTimeInterval(currencyPairs['aud_nzd_rw'], timeInterval['m30'],
			from, to).then(response => {
			const times = response.body.map((el) => Number(el.time))
			expect(response.status).to.eq(200)
			verifyCandlesCount(times, timeInterval['m30'], currencyPairs['aud_nzd_rw'])
			verifyCandlesSorting(times, 30)
		})
	})

	it('C583: should check the number of AUD/NZD candles and sorting for H1', async function() {
		await getCandlesInGivenParisAndTimeInterval(currencyPairs['aud_nzd_rw'], timeInterval['h1'],
			from, to).then(response => {
			const times = response.body.map((el) => Number(el.time))
			expect(response.status).to.eq(200)
			verifyCandlesCount(times, timeInterval['h1'], currencyPairs['aud_nzd_rw'])
			verifyCandlesSorting(times, 60)
		})
	})

	it('C583: should check the number of AUD/CAD candles and sorting for M1', async function() {
		await getCandlesInGivenParisAndTimeInterval(currencyPairs['aud_cad_rw'], timeInterval['m1'],
			from, to).then(response => {
			const times = response.body.map((el) => Number(el.time))
			expect(response.status).to.eq(200)
			verifyCandlesCount(times, timeInterval['m1'], currencyPairs['aud_cad_rw'])
			verifyCandlesSorting(times, 1)
		})
	})

	it('C583: should check the number of AUD/CAD candles and sorting for M5', async function() {
		await getCandlesInGivenParisAndTimeInterval(currencyPairs['aud_cad_rw'], timeInterval['m5'],
			from, to).then(response => {
			const times = response.body.map((el) => Number(el.time))
			expect(response.status).to.eq(200)
			verifyCandlesCount(times, timeInterval['m5'], currencyPairs['aud_cad_rw'])
			verifyCandlesSorting(times, 5)
		})
	})

	it('C583: should check the number of AUD/CAD candles and sorting for M15', async function() {
		await getCandlesInGivenParisAndTimeInterval(currencyPairs['aud_cad_rw'], timeInterval['m15'],
			from, to).then(response => {
			const times = response.body.map((el) => Number(el.time))
			expect(response.status).to.eq(200)
			verifyCandlesCount(times, timeInterval['m15'], currencyPairs['aud_cad_rw'])
			verifyCandlesSorting(times, 15)
		})
	})

	it('C583: should check the number of AUD/CAD candles and sorting for M30', async function() {
		await getCandlesInGivenParisAndTimeInterval(currencyPairs['aud_cad_rw'], timeInterval['m30'],
			from, to).then(response => {
			const times = response.body.map((el) => Number(el.time))
			expect(response.status).to.eq(200)
			verifyCandlesCount(times, timeInterval['m30'], currencyPairs['aud_cad_rw'])
			verifyCandlesSorting(times, 30)
		})
	})

	it('C583: should check the number of AUD/CAD candles and sorting for H1', async function() {
		await getCandlesInGivenParisAndTimeInterval(currencyPairs['aud_cad_rw'], timeInterval['h1'],
			from, to).then(response => {
			const times = response.body.map((el) => Number(el.time))
			expect(response.status).to.eq(200)
			verifyCandlesCount(times, timeInterval['h1'], currencyPairs['aud_cad_rw'])
			verifyCandlesSorting(times, 60)
		})
	})

	it('C583: should check the number of AUD/CHF candles and sorting for M1', async function() {
		await getCandlesInGivenParisAndTimeInterval(currencyPairs['aud_chf_rw'], timeInterval['m1'],
			from, to).then(response => {
			const times = response.body.map((el) => Number(el.time))
			expect(response.status).to.eq(200)
			verifyCandlesCount(times, timeInterval['m1'], currencyPairs['aud_chf_rw'])
			verifyCandlesSorting(times, 1)
		})
	})

	it('C583: should check the number of AUD/CHF candles and sorting for M5', async function() {
		await getCandlesInGivenParisAndTimeInterval(currencyPairs['aud_chf_rw'], timeInterval['m5'],
			from, to).then(response => {
			const times = response.body.map((el) => Number(el.time))
			expect(response.status).to.eq(200)
			verifyCandlesCount(times, timeInterval['m5'], currencyPairs['aud_chf_rw'])
			verifyCandlesSorting(times, 5)
		})
	})

	it('C583: should check the number of AUD/CHF candles and sorting for M15', async function() {
		await getCandlesInGivenParisAndTimeInterval(currencyPairs['aud_chf_rw'], timeInterval['m15'],
			from, to).then(response => {
			const times = response.body.map((el) => Number(el.time))
			expect(response.status).to.eq(200)
			verifyCandlesCount(times, timeInterval['m15'], currencyPairs['aud_chf_rw'])
			verifyCandlesSorting(times, 15)
		})
	})

	it('C583: should check the number of AUD/CHF candles and sorting for M30', async function() {
		await getCandlesInGivenParisAndTimeInterval(currencyPairs['aud_chf_rw'], timeInterval['m30'],
			from, to).then(response => {
			const times = response.body.map((el) => Number(el.time))
			expect(response.status).to.eq(200)
			verifyCandlesCount(times, timeInterval['m30'], currencyPairs['aud_chf_rw'])
			verifyCandlesSorting(times, 30)
		})
	})

	it('C583: should check the number of AUD/CHF candles and sorting for H1', async function() {
		await getCandlesInGivenParisAndTimeInterval(currencyPairs['aud_chf_rw'], timeInterval['h1'],
			from, to).then(response => {
			const times = response.body.map((el) => Number(el.time))
			expect(response.status).to.eq(200)
			verifyCandlesCount(times, timeInterval['h1'], currencyPairs['aud_chf_rw'])
			verifyCandlesSorting(times, 60)
		})
	})

	it('C583: should check the number of AUD/JPY candles and sorting for M1', async function() {
		await getCandlesInGivenParisAndTimeInterval(currencyPairs['aud_jpy_rw'], timeInterval['m1'],
			from, to).then(response => {
			const times = response.body.map((el) => Number(el.time))
			expect(response.status).to.eq(200)
			verifyCandlesCount(times, timeInterval['m1'], currencyPairs['aud_jpy_rw'])
			verifyCandlesSorting(times, 1)
		})
	})

	it('C583: should check the number of AUD/JPY candles and sorting for M5', async function() {
		await getCandlesInGivenParisAndTimeInterval(currencyPairs['aud_jpy_rw'], timeInterval['m5'],
			from, to).then(response => {
			const times = response.body.map((el) => Number(el.time))
			expect(response.status).to.eq(200)
			verifyCandlesCount(times, timeInterval['m5'], currencyPairs['aud_jpy_rw'])
			verifyCandlesSorting(times, 5)
		})
	})

	it('C583: should check the number of AUD/JPY candles and sorting for M15', async function() {
		await getCandlesInGivenParisAndTimeInterval(currencyPairs['aud_jpy_rw'], timeInterval['m15'],
			from, to).then(response => {
			const times = response.body.map((el) => Number(el.time))
			expect(response.status).to.eq(200)
			verifyCandlesCount(times, timeInterval['m15'], currencyPairs['aud_jpy_rw'])
			verifyCandlesSorting(times, 15)
		})
	})

	it('C583: should check the number of AUD/JPY candles and sorting for M30', async function() {
		await getCandlesInGivenParisAndTimeInterval(currencyPairs['aud_jpy_rw'], timeInterval['m30'],
			from, to).then(response => {
			const times = response.body.map((el) => Number(el.time))
			expect(response.status).to.eq(200)
			verifyCandlesCount(times, timeInterval['m30'], currencyPairs['aud_jpy_rw'])
			verifyCandlesSorting(times, 30)
		})
	})

	it('C583: should check the number of AUD/JPY candles and sorting for H1', async function() {
		await getCandlesInGivenParisAndTimeInterval(currencyPairs['aud_jpy_rw'], timeInterval['h1'],
			from, to).then(response => {
			const times = response.body.map((el) => Number(el.time))
			expect(response.status).to.eq(200)
			verifyCandlesCount(times, timeInterval['h1'], currencyPairs['aud_jpy_rw'])
			verifyCandlesSorting(times, 60)
		})
	})
})