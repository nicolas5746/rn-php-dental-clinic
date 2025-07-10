import React from 'react';
import PropTypes from 'prop-types';
import { UserContext } from '/context/UserContext';
import Appointments from '/screens/Appointments';
import ErrorPage from '/screens/ErrorPage';
import Profile from '/screens/Profile';
import Settings from '/screens/Settings';
import MobileView from './MobileView';

const Menu = ({ title }) => {

    const { loggedIn } = React.useContext(UserContext);

    return (
        <MobileView>
            {loggedIn ?
                title === 'profile' ? <Profile />
                    :
                    title === 'appointments' ? <Appointments />
                        :
                        title === 'settings' && <Settings />
                :
                <ErrorPage code={401} message='Unauthorized' />}
        </MobileView>
    );
}

Menu.propTypes = { title: PropTypes.string }

export default Menu;