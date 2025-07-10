import React from 'react';
import { UserContext } from '/context/UserContext';
import MobileView from '/layouts/MobileView';
import UpdateData from '/layouts/UpdateData';
import ErrorPage from '/screens/ErrorPage';

const ChangePassword = () => {

    const { loggedIn } = React.useContext(UserContext);

    return (
        <>
            {loggedIn ?
                <UpdateData action='CHANGE-PASSWORD' response='Password updated' message='Your password has been updated' title='Update password' />
                :
                <MobileView>
                    <ErrorPage code={403} message='Forbidden' />
                </MobileView>}
        </>
    );
}

export default ChangePassword;