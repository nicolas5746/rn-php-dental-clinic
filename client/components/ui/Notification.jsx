import React from 'react';
import PropTypes from 'prop-types';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { Pressable, Text, View } from 'react-native';
import { UserContext } from '/context/UserContext';
import { useDimensions } from '/hooks/Hooks';
import { hasWord, isMobile } from '/utils/utils';

const Notification = ({ color, icon, response }) => {

    const { loading, serverResponse } = React.useContext(UserContext);
    const [borderColor, setBorderColor] = React.useState('');
    const [hideNotification, setHideNotification] = React.useState(false);

    const dimensions = useDimensions(); // Screen size values

    React.useEffect(() => {
        if (hasWord(serverResponse, 'canceled') || serverResponse === 'Disconnected') setHideNotification(loading);
    }, [loading]);

    React.useEffect(() => {
        if (color === 'blue') setBorderColor('border-blue-600');
        if (color === 'green') setBorderColor('border-green-500');
        if (color === 'red') setBorderColor('border-red-600');
    }, [color]);

    return (
        <>
            {!hideNotification &&
                <View
                    className={`flex flex-row items-center justify-between bg-gray-100 border-l-4 ${borderColor} rounded-tr rounded-br ${isMobile ? 'w-68' : 'w-60 px-2 py-4'}
                    ${response.length > 35 ? (isMobile ? 'h-16 px-3' : dimensions?.width <= 480 ? 'w-68 h-16' : 'w-96 h-16') : response.length > 60 ? (isMobile ? 'h-24 px-3' : dimensions?.width <= 480 ? 'w-68 h-16' : 'w-96 h-16') : (isMobile ? 'h-8' : 'h-6')}`}
                >
                    <View className='ml-0.5 mt-px'>
                        <FontAwesome6 color={color} name={icon} size={12} />
                    </View>
                    <Text className='text-center text-gray-500 font-semibold px-0.5'>{response}</Text>
                    <View className='w-0.5 xs:w-2'></View>
                    <Pressable className='absolute right-0.5 xs:right-2 top-0.5 xs:top-2' accessibilityLargeContentTitle='Close' onPress={() => setHideNotification(true)}>
                        <FontAwesome6 color='#555555' name='xmark' size={10} />
                    </Pressable>
                </View>}
        </>
    );
}

Notification.propTypes = {
    color: PropTypes.string,
    icon: PropTypes.string,
    response: PropTypes.string
}

export default Notification;