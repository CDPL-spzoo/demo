const { Client } = require('pg')
exports.removeUsers = async(config) => {
	if (config.db && config.db2){
		const client = new Client({
			...config.db,
		})
		await client.connect()
		const emails = await client.query(`SELECT userid FROM email_list WHERE email like 'cypress-test%'`).then((res) => res.rows)
		const userIds = []
		if (emails.length) {
			emails.forEach(user => {
				userIds.push(user.userid)
			})
			const phones = await client.query(`DELETE FROM phone_list where userid in (${userIds.toString().replace('[', '').replace(']', '')})`)
			const users = await client.query(`SELECT guid FROM user_list WHERE id in (${userIds.toString().replace('[', '').replace(']', '')})`).then((res) => res.rows)
			const usersGuids = []
			users.forEach(user => {
				usersGuids.push(`'${user.guid}'`)
			})
			console.log('phone removing status')
			console.log(phones.command, `count = ${phones.rowCount}`)
			console.log('emails removing status')
			const emailsDeleteResp = await client.query(`DELETE FROM email_list WHERE email like 'cypress-test%'`)
			console.log(emailsDeleteResp.command, `count = ${emailsDeleteResp.rowCount}`)
			await client.end()
			const client2 = new Client({
				...config.db2,
			})
			await client2.connect()
			const user_profiles = await client2.query(`UPDATE user_profile SET deleted_at = current_timestamp  WHERE guid in (${usersGuids.toString().replace('[', '').replace(']', '')})`)
			console.log('profile delete status')
			console.log(user_profiles.command, `count = ${user_profiles.rowCount}`)
			await client2.end()
		} else {
			console.log('there are no users to delete')
			await client.end()
		}
	}
}