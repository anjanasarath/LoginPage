/* globals jasmine*/
jasmine.VERBOSE = true;
if (!window.crypto) {
  window.crypto = { getRandomValues: require('polyfill-crypto.getrandomvalues') }; // eslint-disable-line
}
const AllureReporter = require('jasmine-allure-reporter');

jasmine.getEnv().addReporter(new AllureReporter({
  resultsDir: 'reports/allure-results/jest'
}));
