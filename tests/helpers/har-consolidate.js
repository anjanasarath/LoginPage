const { getHarFiles, loadFile } = require('./file-utils');
const path = require('path');

const harConsolidate = harDirectory => getHarFiles(path.resolve(__dirname, harDirectory))
    .then(data => Promise.all(data.map(fileName => loadFile(path.resolve(__dirname, harDirectory, fileName)))))
    .then(allContents => allContents.reduce((consolidation, { fileName, data }) => {
      const har = JSON.parse(data);
      har.log.entries = har.log.entries.map((entry) => {
        entry.fileName = path.relative(path.resolve(process.cwd(), 'tests', 'mocked', 'har'), fileName);
        return entry;
      });

      har.log.pages = har.log.pages.map((page) => {
        page.fileName = path.relative(path.resolve(process.cwd(), 'tests', 'mocked', 'har'), fileName);
        return page;
      });

      if (!consolidation.log) {
        return har;
      }

      consolidation.log.pages = consolidation.log.pages.concat(har.log.pages);
      consolidation.log.entries = consolidation.log.entries.concat(har.log.entries);

      return consolidation;
    }, {}));

module.exports = harConsolidate;
