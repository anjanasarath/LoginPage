const path = require('path');
const harConsolidate = require('../helpers/har-consolidate');
const moment = require('moment');
const url = require('url');
const table = require('markdown-table');

const { writeFile } = require('../helpers/file-utils');

const sortByDate = (a, b) => {
  if (moment(a.startedDateTime).isSame(moment(b.startedDateTime))) {
    return 0;
  } else if (moment(a.startedDateTime).isBefore(moment(b.startedDateTime))) {
    return 1;
  }
  return -1;
};

const harDirectory = 'har';
harConsolidate(path.resolve(__dirname, harDirectory))
  .then((data) => {
    const apiEntries = data.log.entries.filter((entry) => {
      const jsonRequests =
        entry.request.headers.filter(header => header.value.toLowerCase().indexOf('json') !== -1)
        || entry.response.headers.filter(header => header.value.toLowerCase().indexOf('json') !== -1);
      return jsonRequests.length;
    })
    .sort(sortByDate)
    .map((entry) => {
      entry.request.parsedUrl = url.parse(entry.request.url, true);
      return entry;
    });

    data.log.entries = apiEntries;
    return data;
  })
  .then((data) => {
    const tableRows = [['filename', '\#', 'method', 'uri', 'path', 'response']] // eslint-disable-line no-useless-escape
      .concat(data.log.entries
      .map(entry => [
        entry.fileName,
        entry.connection,
        entry.request.method,
        entry.startedDateTime,
        entry.request.parsedUrl.path,
        entry.response.status
      ]));
    console.log(table(tableRows));
    writeFile(path.resolve(__dirname, './all.har.json'), JSON.stringify(data, null, 4));
  })
  .catch((err) => {
    throw err;
  });
