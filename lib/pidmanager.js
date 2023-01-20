const { promisify } = require('util');

const ps = require('ps-node');
const debug = require('debug')('pidmanager');

ps.lookupAsync = promisify(ps.lookup);
ps.killAsync = promisify(ps.kill);

const delay = require('timers/promises').setTimeout;

const DISCONNECT_DELAY = 1000;
const DEBUG_PID_LOG = 10000;
const pids = new Set();

process.on('exit', () => debug('exit'));

let killing = false;
async function kill() {
  debug('disconnect');
  if (killing) {
    debug('already killing');
    return;
  }
  killing = true;
  await delay(DISCONNECT_DELAY);
  await Promise.all([...pids].map(async (pid) => {
    try {
      debug(pid);
      const [proc] = await ps.lookupAsync({ pid });
      if (proc) {
        debug('kill', pid);
        await ps.killAsync(pid).catch();
      }
    } catch (err) {
      debug('proc err', err);
    }
  }));
  debug('pid manager exit');
  process.exit(); // eslint-disable-line no-process-exit
}

['disconnect', 'SIGINT', 'SIGTERM'].forEach(ev => process.on(ev, kill));

// CMDS in the structure a:1234 and r:1234. 'a' adds a pid to the manager, r removes a pid from the manager.
process.on('message', (msg) => {
  debug('message', msg);
  const [cmd, pid] = msg.split(':');
  if (cmd === 'r') pids.delete(pid);
  else pids.add(pid);
});

// Leave one of these to make sure the process continues until the parent exits
// process.stdin.on('data', msg => debug('proc in', msg.toString().trim()));
setInterval(() => debug('pids', pids), DEBUG_PID_LOG);
