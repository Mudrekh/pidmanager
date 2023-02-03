const { fork } = require('child_process');
const path = require('path');

const debug = require('debug')('pidmanager');

module.exports = function () {
  const pidmanager = fork(path.join(__dirname, 'pidmanager.js'), { detached: true });
  pidmanager.unref();
  pidmanager.on('error', err => debug(err));
  return pidmanager;
};
