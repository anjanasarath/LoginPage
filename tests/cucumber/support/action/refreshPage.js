module.exports = (done) => {
  browser.refresh();
  browser.waitUntil(() => browser.execute(() => document.readyState === 'complete'), 10000, 500);
  done();
};
