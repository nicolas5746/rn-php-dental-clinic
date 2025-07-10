import React from 'react';
import { UserContext } from '/context/UserContext';
import Menu from '/layouts/Menu';
import MobileView from '/layouts/MobileView';
import ErrorPage from '/screens/ErrorPage';

const Profile = () => {

    const { loggedIn } = React.useContext(UserContext);

    return (
        <>
            {loggedIn ?
                <Menu title='profile' />
                :
                <MobileView>
                    <ErrorPage code={403} message='Forbidden' />
                </MobileView>}
        </>
    );
}

export default Profile;