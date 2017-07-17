module.exports = (text, done) => {
  browser.click(`button=${text}`);

  done();
};
