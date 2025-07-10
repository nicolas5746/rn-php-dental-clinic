import PropTypes from 'prop-types';
import { ScrollView, Text, View } from 'react-native';
import { HomeButton } from '/components/Buttons';
import { useDimensions } from '/hooks/Hooks';
import AppBackground from '/layouts/AppBackground';

const ErrorPage = ({ code, message }) => {

    const dimensions = useDimensions(); // Screen size values

    return (
        <AppBackground>
            <ScrollView showsVerticalScrollIndicator={false}>
                <HomeButton />
                <View className='flex-centered flex-col' style={{ height: dimensions?.height, width: dimensions?.width }}>
                    <Text className='text-center text-gray-800 text-3xl font-black my-2'>Error {code}</Text>
                    <Text className='text-center text-gray-600 text-4xl font-bold mt-2 mb-6'>{message}</Text>
                </View>
            </ScrollView>
        </AppBackground>
    );
}

ErrorPage.propTypes = {
    code: PropTypes.number,
    message: PropTypes.string
}

export default ErrorPage;