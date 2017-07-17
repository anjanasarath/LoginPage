const path = require('path');
const reporter = require('cucumberjs-allure-reporter');

reporter.config({
  targetDir: path.resolve(process.cwd(), './reports/allure-results/cucumber')
});

module.exports = reporter;
