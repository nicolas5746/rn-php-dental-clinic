import React from 'react';
import { UserContext } from '/context/UserContext';
import MobileView from '/layouts/MobileView';
import UpdateData from '/layouts/UpdateData';
import ErrorPage from '/screens/ErrorPage';

const ChangeEmail = () => {

    const { loggedIn } = React.useContext(UserContext);

    return (
        <>
            {loggedIn ?
                <UpdateData action='REQUEST-CHANGE-EMAIL' response='Please confirm your new e-mail' message='Please confirm your new e-mail' title='Update e-mail' />
                :
                <MobileView>
                    <ErrorPage code={403} message='Forbidden' />
                </MobileView>}
        </>
    );
}

export default ChangeEmail;