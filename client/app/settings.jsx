import React from 'react';
import { UserContext } from '/context/UserContext';
import Menu from '/layouts/Menu';
import MobileView from '/layouts/MobileView';
import ErrorPage from '/screens/ErrorPage';

const Settings = () => {

    const { loggedIn } = React.useContext(UserContext);

    return (
        <>
            {loggedIn ?
                <Menu title='settings' />
                :
                <MobileView>
                    <ErrorPage code={403} message='Forbidden' />
                </MobileView>}
        </>
    );
}

export default Settings;