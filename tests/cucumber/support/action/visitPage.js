module.exports = (page, done) => {
  browser.url(`/#/${page}`);
  browser.waitUntil(() => browser.execute(() => document.readyState === 'complete'), 10000, 100);
  done();
};
