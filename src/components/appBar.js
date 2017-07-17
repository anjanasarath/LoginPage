import React from 'react';
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import NavigationClose from 'material-ui/svg-icons/navigation/close';
import FlatButton from 'material-ui/FlatButton';
import styles from './styles';

function handleTouchTap() {
    alert('onTouchTap triggered on the title component');
}

const AppBarIconButton = () => (
    <AppBar
        title={<span style={styles.title0} >Need An Account?</span>}
        onTitleTouchTap={handleTouchTap}
        iconElementRight={<FlatButton backgroundColor="#456b7b" label="CREATE ACCOUNT" />}
        showMenuIconButton={false}
    />
);

export default AppBarIconButton;