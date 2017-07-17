require('react');

describe('enzyme-mui-intl helper', () => {
  let shallow;
  let mount;
  let getMuiTheme;
  let cloneElement;
  let createElement;
  const MuiThemeProvider = jest.fn();

  MuiThemeProvider.meh = 100;
  const options = { intl: 'intl' };

  beforeEach(() => {
    jest.resetModules();

    shallow = jest.fn((node, options) => [Object.assign({}, node, { shallow: true }), options]);
    mount = jest.fn((node, options) => [Object.assign({}, node, { mount: true }), options]);
    jest.mock('enzyme', () => ({ mount, shallow }));

    const IntlProvider = jest.fn(() => ({
      getChildContext: () => (options)
    }));
    const intlShape = jest.fn();
    jest.mock('react-intl', () => ({ IntlProvider, intlShape }));

    jest.mock('material-ui/styles/MuiThemeProvider', () => {});

    cloneElement = jest.fn((...args) => args);
    createElement = jest.fn((...args) => args);
    jest.mock('react', () => ({ cloneElement, createElement }));

    jest.mock('material-ui/styles/MuiThemeProvider', () => ({ MuiThemeProvider }));
    getMuiTheme = jest.fn(theme => theme);
    jest.mock('material-ui/styles/getMuiTheme', () => getMuiTheme);
  });

  describe('shallowWithIntl', () => {
    let enzymeMuiIntl;
    let shallowWithIntl;

    beforeEach(() => {
      enzymeMuiIntl = require('../enzyme-mui-intl'); // eslint-disable-line global-require
      shallowWithIntl = enzymeMuiIntl.shallowWithIntl;
    });

    it('should be a function', () => {
      expect(shallowWithIntl).toBeDefined();
    });

    it('should return a result', () => {
      const node = { };
      const result = shallowWithIntl(node);

      expect(result)
        .toBeDefined();
    });

    it('should have called shallow', () => {
      const node = { };
      const result = shallowWithIntl(node);

      expect(shallow)
        .toHaveBeenCalled();
      expect(shallow.mock.calls.length)
        .toBe(1);

      const [[shallowNode, shallowOptions], shallowContext] = shallow.mock.calls[0];
      expect(shallowNode)
          .toBe(node);
      expect(shallowOptions)
        .toEqual(options);
    });

    it('should have called cloneElement', () => {
      const node = { };
      const result = shallowWithIntl(node);

      expect(cloneElement)
        .toHaveBeenCalled();
      expect(cloneElement.mock.calls.length)
        .toBe(1);

      const [cloneElementNode, cloneElementOptions] = cloneElement.mock.calls[0];
      expect(cloneElementNode)
        .toBe(node);
      expect(cloneElementOptions)
        .toEqual(options);
    });
  });

  describe('mountWithIntl', () => {
    let enzymeMuiIntl;
    let mountWithIntl;

    beforeEach(() => {
      enzymeMuiIntl = require('../enzyme-mui-intl'); // eslint-disable-line global-require
      mountWithIntl = enzymeMuiIntl.mountWithIntl;
    });

    it('should be a function', () => {
      expect(mountWithIntl).toBeDefined();
    });

    it('should return a result', () => {
      const node = { };
      const result = mountWithIntl(node);

      expect(result).toBeDefined();
    });

    it('should have called mount', () => {
      const node = { };
      const result = mountWithIntl(node);
      expect(mount)
        .toHaveBeenCalled();
      expect(cloneElement)
        .toHaveBeenCalled();
    });
  });
});
