const publicIp = require('public-ip')
const dns = require('dns')
const axios = require('axios')
require('dotenv').config()

let lastIp = null

function ConnectionException(message) {
  this.message = message
  this.name = 'ConnectionException'
}
async function saveIp(ip) {
  try {
    const response = await axios({
      url: process.env.ENDPOINT, 
      method: 'POST',
      data: {
        ip,
      },
    })
    return response
  } catch (error) {
    console.log(error)
  }
}

async function getMyIp() {
  try {
    const meuIp = await publicIp.v4()
    return meuIp
  } catch (error) {
    console.log(error)
  }
}
function hasConnection() {
  return new Promise((resolve, reject) => {
    dns.lookupService('8.8.8.8', 53, async (error, hostname) => {
      try {
        if (error) {
          throw new ConnectionException('No Connection Internet')
        }
        resolve(hostname)
      } catch (error) {
        reject(error)
      }
    })
  })
}
async function execute() {
  try {
    const connected = await hasConnection()
    console.log(connected)

    const meuIp = await getMyIp()
    console.log(meuIp)

    if (meuIp !== lastIp) {
      const response = await saveIp(meuIp)
      console.log('meu ip mudou', response)
      lastIp = meuIp
    }

    const response = await saveIp(meuIp)
    console.log(response)
  } catch (error) {
    console.log(error)
  }
}
setInterval(async () => {
  await execute()
}, 5000)
