const path  = require('path');

console.log('123123-----------------------');

module.exports = {
  output: {
    filename: 'bundle.js',
    path: path.join(__dirname, 'bundle')
  }

};