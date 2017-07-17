module.exports = (field, value, done) => {
  browser.waitForExist('input', 10000);
  /* eslint-disable no-undef */

  // title or label of field must be the exact name
  const inputField = $(`div=${field}`).$('input');
  /* eslint-enable no-undef */

  inputField.click();
  inputField.setValue(value);
  done();
};
