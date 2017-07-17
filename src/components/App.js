import React from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import * as Colors from 'material-ui/styles/colors';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import TextField from 'material-ui/TextField';
import AppBarIconButton from './appBar';
import injectTapEventPlugin from 'react-tap-event-plugin';
import Login from './login';

injectTapEventPlugin();

const muiTheme = getMuiTheme({
    palette: {

        primary1Color: Colors.grey100,
        primary2Color: Colors.indigo700,

    },
    appBar: {
        height: 60,
        margin: '0px',
        },
});

export default class App extends React.Component {

    render() {
        return (
            <div>
                <MuiThemeProvider muiTheme={muiTheme}>
                      <div className='container'>
                            <AppBarIconButton />
                          <div className='loginForm'>
                            <Login />
                          </div>
                       </div>
                </MuiThemeProvider>
            </div>
        );
    }
}
