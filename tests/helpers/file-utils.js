const fs = require('fs');
const path = require('path');

const getFiles = (ext, directory) => new Promise((resolve, reject) => {
  fs.readdir(directory, (err, data) => {
    if (err) {
      reject(err);
    } else {
      resolve(ext ? data.filter(file => path.extname(file).toLowerCase() === ext) : data);
    }
  });
});

const getHarFiles = getFiles.bind(null, '.har');

const loadFile = fileName => new Promise((resolve, reject) => {
  fs.readFile(fileName, 'utf8', (err, data) => {
    if (err) {
      reject(err);
    } else {
      resolve({ fileName, data });
    }
  });
});

const loadJSON = jsonFileName => new Promise((resolve) => {
  loadFile(jsonFileName)
    .then(({ fileName, data }) => {
      try {
        const dataObject = JSON.parse(data);
        resolve({ fileName, data: dataObject, status: { success: true } });
      } catch (e) {
        resolve({ fileName, status: { success: false, e } });
      }
    })
    .catch((error) => {
      resolve({ fileName: jsonFileName, status: { success: false, error: error.code } });
    });
});

const writeFile = (fileName, contents) => new Promise((resolve, reject) => {
  fs.writeFile(fileName, contents, 'utf8', (err) => {
    if (err) {
      reject(err);
    } else {
      resolve();
    }
  });
});


module.exports = {
  getFiles,
  getHarFiles,
  loadFile,
  loadJSON,
  writeFile
};
