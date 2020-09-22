
const path = require('path')


/**
 * node fs.createReadStream
 */
// const fs = require('fs')


/** 
 * my readStream
 */
const fs = require(path.join(__dirname, '../src/fs.createReadStream'))

let rs = fs.createReadStream(
  path.join(__dirname, '../1.txt'),
  {
    encoding: 'utf8',
    highWaterMark: 3,
    autoClose: false
  }
)

let onefd = 0

rs.on('open', fd => {
  console.log(fd, '文件打开了');
  onefd = fd
})

rs.on('close', err => {
  console.log('close');
})

rs.on('data', res => {
  console.log(res, 'data');
  rs.pause()

  setTimeout(() => {
    rs.resume()
  }, 2000)
})

rs.on('end', () => {
  console.log('end');
})

rs.on('error', err => {
  console.log(err);
})

