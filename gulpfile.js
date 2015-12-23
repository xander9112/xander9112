var argv = require('yargs').argv;
var production = argv.production !== undefined;

module.exports = production;

var requireDir = require('require-dir');
requireDir('./tasks', {recurse: true});
