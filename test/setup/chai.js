/* eslint-disable no-console */

global.chai = require('chai');
global.should = global.chai.should();
global.expect = global.chai.expect;

try {
  require('bluebird'); // eslint-disable-line global-require
  console.warn('This project still uses bluebird');
  console.warn('Consider migrating to NodeJS promises');
} catch (err) {} // eslint-disable-line no-empty
global.sinon = require('sinon');

const chaiplugins = ['chai-as-promised', 'chai-http', 'dirty-chai', 'sinon-chai'];
chaiplugins.forEach(plugin => chai.use(require(plugin))); // eslint-disable-line
