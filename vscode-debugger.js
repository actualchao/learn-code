const path = require('path');
const process = require('process');

const numCPUs = require('os').cpus().length;

require('child_process').exec('npx webpack', function(err, stdout, stderr) {
  debugger;
  console.log(stdout);

});
// require('child_process').exec('npm config get prefix', function(err, stdout, stderr) {
//   const nixLib = (process.platform.indexOf('win') === 0) ? '' : 'lib'; // win/*nix support

//   const webpackPath = path.resolve(path.join(stdout.replace('\n', ''), nixLib, 'node_modules', 'webpack-cli', 'bin', 'cli.js'));
//   console.log(webpackPath);
//   require(webpackPath);
// });