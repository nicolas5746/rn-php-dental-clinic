import React from 'react';
import PropTypes from 'prop-types';
import { SafeAreaView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { UserContext } from '/context/UserContext';
import { isWeb } from '/utils/utils';

const MobileView = ({ children }) => {

    const { loading } = React.useContext(UserContext);
   
    const insets = useSafeAreaInsets(); // Handle safe area insets

    return (
        <SafeAreaView style={!isWeb && !loading && { paddingBottom: insets.bottom, paddingTop: insets.top }}>
            <StatusBar style='auto' />
            {children}
        </SafeAreaView>
    );
}

MobileView.propTypes = { children: PropTypes.node }

export default MobileView;