import React from 'react';
import { IntlProvider, intlShape } from 'react-intl';
import { mount, shallow } from 'enzyme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import theme from '../../src/js/themes';

const messages = {
  lookmeup: 'I was found!'
};

const intlProvider = new IntlProvider({ locale: 'en', messages }, {});
const { intl } = intlProvider.getChildContext();

function nodeWithIntlProp(node) {
  return React.cloneElement(node, { intl });
}

export function shallowWithIntl(node) {
  return shallow(nodeWithIntlProp(node), { context: { intl } });
}

export function mountWithIntl(node) {
  return mount(nodeWithIntlProp(
    <MuiThemeProvider muiTheme={theme}>
      {node}
    </MuiThemeProvider>
  ), {
    context: { intl },
    childContextTypes: { intl: intlShape }
  });
}
