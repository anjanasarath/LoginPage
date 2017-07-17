const serverReplay = require('../helpers/server-replay');
const path = require('path');

module.exports = (harFile, port, debug) => {
  // eslint-disable-next-line global-require
  const har = require(harFile);

  serverReplay(har, {
    resolvePath: path.dirname('./'),
    port,
    config: {
      mappings: [],
      replacements: []
    },
    debug
  });
};
