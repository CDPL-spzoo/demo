const {urls} = require('./urls.js')
import ws from 'k6/ws';
import { check } from 'k6';
import exec from 'k6/execution';
import { sleep } from 'k6';
import { randomIntBetween } from 'https://jslib.k6.io/k6-utils/1.2.0/index.js';

export const options = {
    vus: __ENV.USERS ? __ENV.USERS :1,
    iterations: __ENV.USERS ? __ENV.USERS :1,
    duration: __ENV.EXECTIME? `${+__ENV.EXECTIME +540}s`:'10m'
};

export default function () {
    const executionTime = (__ENV.EXECTIME) ? +__ENV.EXECTIME*1000 : 60000;
    const openCloseTimeout = (__ENV.OPENCLOSETIMEOUT)? +__ENV.OPENCLOSETIMEOUT : 1000
    const retries = (__ENV.CONNECTIONRETRIES) ? +__ENV.CONNECTIONRETRIES : 1
    const getOrdersId = []
    for (let i=0; i<20; i++){
        getOrdersId.push(JSON.stringify({"id": i, "type": "GetOrders", "body": {}}))
    }
    const tick = JSON.stringify({"id": Date.now(), "type":"TicksSubscribe", "body": {"symbol":"EURUSD.RW"}})
    const openOrder = () => JSON.stringify({"id": +`${Math.floor(Math.random() * 10000)}${Date.now()}` , "type":"OpenOrder", "body": {"symbol":"EURUSD.rw", "type": 0, "volume": 0.01}})
    const closeOrder = (orderId) => JSON.stringify({"id": `${Math.floor(Math.random() * 10000)}${Date.now()}`, "type":"CloseOrder", "body": {"ticket": orderId, "volume": 0.01, "deviation": 100}})
    const url = urls[exec.vu.idInTest]
    let execution = true
    sleep(randomIntBetween(0, 10));
    const res = () => ws.connect(url, function (socket) {
        socket.on('open',  () => {
            console.log('connected')
            socket.send(openOrder())
            socket.setInterval(() => {
                if (execution) {
                    socket.send(JSON.stringify({
                        "id": `${Math.floor(Math.random() * 10000)}${Date.now()}`,
                        "type": "GetOrders",
                        "body": {}
                    }))
                }
            }, 250)


        });
        socket.on('message', (data) => {
            if (JSON.parse(data).type === 'OpenOrder'){
                console.log(JSON.parse(data))
                const orderId = JSON.parse(data).body.ticket
                socket.setTimeout(() => socket.send(closeOrder(orderId)), openCloseTimeout)
            }

            if(JSON.parse(data).type === 'Orders' && JSON.parse(data).id === 0){
                console.log(JSON.parse(data))
                const orders = JSON.parse(data).body.orders
                // all orders removing
                if (__ENV.REMOVEORDERS) {
                    for (let order of orders) socket.send(closeOrder(order.ticket))
                }
            }
            // if (JSON.parse(data).type === 'Orders' ) console.log(JSON.parse(data))
            if(JSON.parse(data).type === 'CloseOrder' && execution){
                console.log(JSON.parse(data))
                socket.setTimeout(() => socket.send(openOrder()), openCloseTimeout)
            }

        });
        socket.on('close', () => {
            console.log('disconnected')

        });
        socket.on('error', function (e) {
            if (e.error() != 'websocket: close sent') {
                console.log('An unexpected error occured: ', e.error());
            }
        });
        socket.setTimeout(function () {
            execution = false
            socket.setTimeout(() => socket.send(getOrdersId[0]), 4000)
            socket.setTimeout(() => socket.close(), 10000);
        }, executionTime);
    });
    let result = res()
    for (let i=0; i<retries; i++){
        if (result.status === 500) {
            console.log(result.status)
            console.log('reconnect')
            sleep(randomIntBetween(1, 3))
            result = res()
        }
        else if (result.status === 101) {
            console.log(result.status)
            break
        }
    }
    check(result, { 'status is 101': (r) => r && r.status === 101 });
}