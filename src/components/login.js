import React from 'react';
import Linkify from 'react-linkify';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import * as Colors from 'material-ui/styles/colors';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import TextField from 'material-ui/TextField';
import SubHeader from 'material-ui/Subheader';
import RaisedButton from 'material-ui/RaisedButton';
import styles from './styles';

const muiTheme = getMuiTheme({
    palette: {

        primary1Color: Colors.red50,
        primary2Color: Colors.indigo700,

    },

});

export default class Login extends React.Component {
    render() {
        return (
                <div className='login' >
                    <SubHeader className='subhead0' style={styles.subHeaderStyle}>Sign In</SubHeader>
                    <div>

                            <input className='input0' type="text" name="email" placeholder="Email / Login ID"></input>

                            <input className='input0 input01' type="password" name="password" placeholder="Enter your password"></input>

                        <SubHeader className='subhead1'>
                            <Linkify>Forgot Password?</Linkify>
                        </SubHeader>
                        <div className='raisedButton'>
                            <RaisedButton labelColor="White" backgroundColor="#456b7b" label="Sign in"></RaisedButton>
                        </div>
                    </div>
                </div>
        )
    };
}

