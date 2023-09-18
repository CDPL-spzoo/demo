const fs = require('fs')
const { Client } = require('pg')

module.exports = (on, config) => {
	on('task', {
		async connectDB(query) {
			const client = new Client({
				...config.db,
			})
			await client.connect()
			const res = await client.query(query)
			await client.end()
			return res.rows
		},
	})
	on('task', {
		async connectDB2(query) {
			const client = new Client({
				...config.db2
			})
			await client.connect()
			const res = await client.query(query)
			await client.end()
			return res.rows
		},
	})
	on('after:run', (results) => {
		if (process.env.RESULTS) {
			fs.writeFileSync(
				`../test_results/${Date.now()}.results.json`,
				JSON.stringify(results, null, '  ')
			)
		}
	})
	require('@cypress/grep/src/plugin')(config)

	return config
}