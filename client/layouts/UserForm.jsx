import React from 'react';
import PropTypes from 'prop-types';
import { ScrollView } from 'react-native';
import { HomeButton } from '/components/Buttons';
import { UserContext } from '/context/UserContext';
import AppBackground from './AppBackground';
import MobileView from './MobileView';

const UserForm = ({ children }) => {

    const { clearServerResponse } = React.useContext(UserContext);

    React.useEffect(() => {
        clearServerResponse();
    }, []);

    return (
        <MobileView>
            <AppBackground>
                <ScrollView className='h-screen' keyboardShouldPersistTaps='handled' showsVerticalScrollIndicator={false}>
                    <HomeButton />
                    {children}
                </ScrollView>
            </AppBackground>
        </MobileView>
    );
}

UserForm.propTypes = { children: PropTypes.node }

export default UserForm;