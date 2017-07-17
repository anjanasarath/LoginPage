const self = module.exports = {
  user: {},

  assignRole: (role) => {
    const users = [
      { type: 'Administration', email: 'stephanie.nemeth@spronq.com', password: 'berlin' },
      { type: 'privacyOfficer', email: 'privacyOfficer@example.com', password: 'blah' },
      { type: 'businessUser', email: 'businessUser@example.com', password: 'blah' }
    ];

    const selectedUser = users.find(user => user.type === role);
    self.user = Object.assign({}, selectedUser);
  },

  go: () => {
    browser.url('/#/login');
    browser.waitForExist('input', 10000);
  },

  login: () => {
    self.go();
    browser.setValue('input[name=username]', self.user.email);
    browser.setValue('input[name=password]', self.user.password);
    browser.click('button=Log in now');
  }
};
