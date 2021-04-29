const publicIp = require('public-ip')
const dns = require('dns')

function ConnectionException(message) {
  this.message = message
  this.name = 'ConnectionException'
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
  } catch (error) {
    console.log(error)
  }
}
setInterval(async () => {
  await execute()
}, 5000)
