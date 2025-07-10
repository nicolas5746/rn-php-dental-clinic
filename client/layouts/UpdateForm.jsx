import React from 'react';
import PropTypes from 'prop-types';
import { ActivityIndicator, ScrollView, Text, TouchableHighlight, View } from 'react-native';
import { HomeButton } from '/components/Buttons';
import { UserContext } from '/context/UserContext';
import { useDimensions } from '/hooks/Hooks';
import { isMobile } from '/utils/utils';
import Notification from '@ui/Notification';
import AppBackground from './AppBackground';
import MobileView from './MobileView';

const UpdateForm = ({ children, action, response, message, callback, title }) => {

    const { clearServerResponse, loading, serverResponse } = React.useContext(UserContext);

    const dimensions = useDimensions(); // Screen size values

    React.useEffect(() => {
        clearServerResponse();
    }, []);

    return (
        <MobileView>
            <AppBackground>
                <HomeButton />
                <ScrollView keyboardShouldPersistTaps='handled'>
                    <View className='flex-centered my-6'>
                        <View className='flex-centered w-full h-screen'>
                            <View className='flex-centered bg-white border border-gray-300 rounded-3xl w-72 pocket:w-80 xs:w-100 pocket:h-112 mb-4 p-8'style={isMobile && { transform: dimensions?.width >= 360 ? 'scale(1)' : 'scale(0.8)' }}>
                                <Text className='text-center text-gray-800 text-3xl font-bold mb-4'>{title}</Text>
                                <View className='flex items-start justify-center'>{children}</View>
                                <View className='flex-centered my-2'>
                                    <TouchableHighlight
                                        className='bg-blue-600 rounded w-24 h-8 my-1 p-1'
                                        underlayColor='#2563eb'
                                        {...(!loading && { onPress: () => callback(action) })}
                                    >
                                        <Text className={`text-center text-white font-semibold leading-5 ${loading && 'mt-0.5'}`}>
                                            {loading ? <ActivityIndicator color='#ffffff' size='small' /> : 'Submit'}
                                        </Text>
                                    </TouchableHighlight>
                                    <View className='h-8 mt-4 mb-1'>
                                        {serverResponse !== '' &&
                                            <Notification
                                                color={serverResponse === 'Please confirm your new e-mail' ? 'blue' : serverResponse === response ? 'green' : 'red'}
                                                icon={serverResponse === response ? 'circle-check' : 'circle-xmark'}
                                                response={serverResponse === response ? message : serverResponse}
                                            />}
                                    </View>
                                </View>
                            </View>
                        </View>
                    </View>
                </ScrollView>
            </AppBackground>
        </MobileView>
    );
}

UpdateForm.propTypes = {
    children: PropTypes.node,
    action: PropTypes.string,
    response: PropTypes.string,
    message: PropTypes.string,
    callback: PropTypes.func,
    title: PropTypes.string
}

export default UpdateForm;