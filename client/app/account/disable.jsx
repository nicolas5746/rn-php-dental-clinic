import React from 'react';
import { UserContext } from '/context/UserContext';
import MobileView from '/layouts/MobileView';
import DisableAccount from '/screens/DisableAccount';
import ErrorPage from '/screens/ErrorPage';

const Disable = () => {

    const { loggedIn, serverResponse } = React.useContext(UserContext);

    return (
        <>
            {loggedIn || serverResponse === 'Disconnected' ?
                <DisableAccount />
                :
                <MobileView>
                    <ErrorPage code={403} message='Forbidden' />
                </MobileView>}
        </>
    );
}

export default Disable;