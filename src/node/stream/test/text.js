let fs = require('fs')
const path = require('path')



let rs = fs.createReadStream(path.join(__dirname, '../1.txt'), { encoding: 'utf8', highWaterMark: 3 })
const resArr = []
rs.on('data', (data) => {
  resArr.push(data)
  rs.pause()
  setTimeout(() => {
    rs.resume()
  }, 200);
})
rs.on('end', () => { console.log(resArr.join('')); })
