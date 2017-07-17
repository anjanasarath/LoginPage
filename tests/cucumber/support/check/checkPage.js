module.exports = (text, done) => {
  browser.waitForExist(`div=${text}`, 10000);
  done();
};
