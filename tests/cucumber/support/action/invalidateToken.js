module.exports = (done) => {
  // must run an execute script for change to localstorage to work in firefox.
  browser.execute(() => {
    window.localStorage.setItem('auth-pp', 'bananas');
  });

  done();
};
