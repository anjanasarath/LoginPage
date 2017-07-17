module.exports = {

  go() {
    browser.url('/');
    browser.waitUntil(() => browser.execute(() => document.readyState === 'complete'), 10000, 100);
  }

};
