import React from 'react';
import { UserContext } from '/context/UserContext';
import MobileView from '/layouts/MobileView';
import UpdateData from '/layouts/UpdateData';
import ErrorPage from '/screens/ErrorPage';

const ResetPassword = () => {

    const { loggedIn } = React.useContext(UserContext);

    return (
        <>
            {loggedIn ?
                <MobileView>
                    <ErrorPage code={403} message='Forbidden' />
                </MobileView>
                :
                <UpdateData action='REQUEST-RESET-PASSWORD' response='E-mail has been sended' message='Check your e-mail inbox to reset your password' title='Reset your password' />}
        </>
    );
}

export default ResetPassword;