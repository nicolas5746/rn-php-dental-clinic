import React from 'react';
import { UserContext } from '/context/UserContext';
import MobileView from '/layouts/MobileView';
import ErrorPage from '/screens/ErrorPage';
import SignIn from '/screens/SignIn';

const Login = () => {

    const { loggedIn } = React.useContext(UserContext);

    return (
        <>
            {loggedIn ?
                <MobileView>
                    <ErrorPage code={403} message='Forbidden' />
                </MobileView>
                :
                <SignIn />}
        </>
    );
}

export default Login;