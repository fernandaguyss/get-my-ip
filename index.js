const publicIp = require('public-ip')
;(async () => {
  const meuIp = await publicIp.v4()
  console.log(meuIp)
})()
