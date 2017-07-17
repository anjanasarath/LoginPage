const fetch = require('node-fetch');
const path = require('path');
const yargs = require('yargs');
const loadJSON = require('./file-utils').loadJSON;

const argv = yargs
  .options({
    out: {
      alias: 'o',
      describe: 'output filename'
    }
  })
  .help()
  .argv;

const {
  runId,
  serverAuthKey,
  serverUrl,
  gitDomain,
  gitOwner,
  gitBranch,
  gitRepository,
  gitCommit,
  buildStarted,
  buildUrl,
  buildStartedBy
} = argv;

const unitTestsData = loadJSON(path.resolve('./reports/jest.json'))
  .then(({ fileName, status, data }) => ({
    status,
    fileName: path.relative(process.cwd(), fileName),
    data: data ? [
      'numFailedTestSuites',
      'numFailedTests',
      'numPassedTestSuites',
      'numPassedTests',
      'numPendingTestSuites',
      'numPendingTests',
      'numRuntimeErrorTestSuites',
      'numTotalTestSuites',
      'numTotalTests'
    ].reduce((accumulator, current) => {
      accumulator[current] = data[current];
      return accumulator;
    }, {}) : {}
  }));

const coverageData = loadJSON(path.resolve('./reports/coverage-summary.json'))
  .then(({ fileName, data, status }) => ({
    status,
    fileName: path.relative(process.cwd(), fileName),
    data: data ? ['lines', 'statements', 'functions', 'branches'].reduce((accumulator, current) => {
      accumulator[current] = data.total[current];
      return accumulator;
    }, {}) : {} }));

const eslintData = loadJSON(path.resolve('./reports/eslint.json'))
  .then(({ fileName, data, status }) => ({
    status,
    fileName: path.relative(process.cwd(), fileName),
    data: data ? data.reduce((accumulator, current) => {
      accumulator.errors += current.errorCount;
      accumulator.warnings += current.warningCount;
      return accumulator;
    }, {
      warnings: 0,
      errors: 0
    }) : {}
  }));

Promise.all([unitTestsData, coverageData, eslintData])
  .then(([unitTests, coverage, eslint]) => fetch(serverUrl, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      'X-Vibe-Reporting-Auth': serverAuthKey
    },
    method: 'POST',
    body: JSON.stringify({ runId,
      project: {
        domain: gitDomain,
        owner: gitOwner,
        branch: gitBranch,
        repository: gitRepository,
        commit: gitCommit
      },
      build: {
        started: buildStarted,
        url: buildUrl,
        startedBy: buildStartedBy
      },
      reports: { unitTests, coverage, eslint } })
  }).then((res) => {
    if (res.status !== 200) {
      throw res.status;
    }
  })).catch((e) => {
    console.error(e);
  });

