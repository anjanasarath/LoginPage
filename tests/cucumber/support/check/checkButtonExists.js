module.exports = (falseCase, text, done) => {
  // This assumes a user is logged in, so the bottom info bar should be on-screen
  browser.waitForExist('div*=PrivacyPerfect', 10000);

  /* eslint-disable no-undef */
  const button = $('button').$(`div=${text}`);
  /* eslint-enable no-undef */

  const isExisting = button.isExisting();

  if (falseCase) {
    expect(isExisting).to.not
            .equal(true, `Expected button "${text}" not to be found`);
  } else {
    expect(isExisting).to
            .equal(true, `Expected button "${text}" to be found`);
  }
  done();
};
