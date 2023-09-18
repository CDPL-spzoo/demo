const { test, expect } = require('@playwright/test');

test.describe('Api tests', () => {
    const headers = {
        'accept': 'application/json, text/plain, */*',
        'sec-fetch-site': 'same-origin',
        'cookie': `authToken=${process.env.AUTH_TOKEN}`
    };

    test('Get base url', async ({ request, baseURL }) => {
        const response = await request.get(baseURL);
        expect(response.status()).toEqual(200);
    });

    test('get vehicle count', async ({ request, baseURL }) => {
        const queryParams = '?conditions=%7B%22$and%22:[%7B%22car.fuel%22:%7B%22$in%22:[%22diesel%22]%7D%7D,%7B%22status%22:%7B%22$in%22:[%22created%22,%22pending%22,%22activated%22,%22cancelling%22,%22cancelled%22]%7D%7D]%7D&count=true';
        const url = `${baseURL}/nimda/api/contracts${queryParams}`;
        const response = await request.get(url, { headers: headers });
        expect(response.status()).toEqual(200);
        expect(await response.json()).toMatchObject({ 'count': expect.any(Number) });
    });

    test('get all vehicles', async ({ request, baseURL }) => {
        const queryParams = '?conditions=%7B%22$and%22:[%7B%22$or%22:[%7B%22car.fuel%22:%7B%22$in%22:[%22diesel%22,%22gasoline%22,%22electric%22,%22hybrid%22,%22gas%22]%7D%7D,%7B%22car.fuel%22:%7B%22$exists%22:false%7D%7D]%7D,%7B%22status%22:%7B%22$in%22:[%22created%22,%22pending%22,%22activated%22,%22cancelling%22,%22cancelled%22]%7D%7D]%7D&limit=50&populate=fleets+company&skip=0&sort=-_id&stream=true';
        const url = `${baseURL}/nimda/api/contracts${queryParams}`;
        const response = await request.get(url, { headers: headers });
        expect(response.status()).toEqual(200);
        expect(await response.json()).toMatchObject(expect.any(Array));
    });
});
