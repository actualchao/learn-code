const parser = require('@babel/parser');
const esprima = require('esprima');

const code = 'let aa = ()=>{console.log(\'11\')}';

const res1 = parser.parse(code);
console.log(res1);


console.log('---------');
const res2 = esprima.parseScript(code);
console.log(res2);