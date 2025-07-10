import React from 'react';
import * as Linking from 'expo-linking';
import AntDesign from '@expo/vector-icons/AntDesign';
import { Text, View } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { HomeButton, LinkTo } from '/components/Buttons';
import { UserContext } from '/context/UserContext';
import { useDimensions } from '/hooks/Hooks';
import { isMobile, isWeb } from '/utils/utils';
import Spinner from '/components/Spinner';
import AppBackground from '/layouts/AppBackground';
import MobileView from '/layouts/MobileView';
import UpdateData from '/layouts/UpdateData';
import ErrorPage from '/screens/ErrorPage';

const Verification = () => {

    const { loading, registered, serverResponse, userController, updateUser, userValues } = React.useContext(UserContext);
    const [hideSpinner, setHideSpinner] = React.useState(false);

    const dimensions = useDimensions(); // Screen size values
    const params = useLocalSearchParams(); // URL parameters for the current component
    // Store URL params
    const getUrlParams = () => {
        if (Object.keys(params).length > 0) {
            if (params.hasOwnProperty('id') && params.hasOwnProperty('new_email') && params.hasOwnProperty('token')) {
                updateUser({ id: params.id, newEmail: params.new_email, emailToken: params.token });
            } else if (params.hasOwnProperty('id') && params.hasOwnProperty('token')) {
                updateUser({ id: params.id, activationToken: params.token });
            } else if (params.hasOwnProperty('email') && params.hasOwnProperty('token')) {
                updateUser({ email: params.email, resetToken: params.token });
            }
            // console.log(params);
        }
        setHideSpinner(true);
    }
    // Check if url scheme is supported by app
    const checkSupportedUrl = async (url) => {
        try {
            const supportedUrl = await Linking.canOpenURL(url);

            if (supportedUrl) {
                await Linking.openURL(url)
                    .then(() => setHideSpinner(true))
                    .catch(() => getUrlParams());
            }
            else {
                getUrlParams();
            }
        } catch (error) {
            console.error(error);
            alert('Failed to open url with app!');
        }
    }
    // Handle scheme and url
    React.useEffect(() => {
        if (isMobile && isWeb) {
            const baseUrl = Linking.createURL('/'); // Base url
            const currentUrl = Linking.getLinkingURL(); // Get current url
            const newScheme = currentUrl.replace(baseUrl, 'com.dentalclinic4u://'); // Change scheme

            checkSupportedUrl(newScheme);
        } else {
            getUrlParams();
        }
    }, []);
    // Send requests
    React.useEffect(() => {
        if (userValues.hasOwnProperty('activationToken')) userController('ACTIVATE');
        if (userValues.hasOwnProperty('emailToken')) userController('CHANGE-EMAIL');
    }, [userValues]);

    return (
        <MobileView>
            <>
                {hideSpinner ?
                    serverResponse === 'Verification successful' || serverResponse === 'Your password has been reset' || serverResponse === 'E-mail updated' || registered ?
                        <AppBackground>
                            <HomeButton />
                            <View className='flex-centered' style={{ height: dimensions?.height, width: dimensions?.width }}>
                                {serverResponse === 'E-mail updated' ?
                                    <>
                                        <AntDesign color='#22c55e' name='checkcircle' size={24} />
                                        <Text className='text-center text-lg text-blue-500 font-semibold h-10 my-2'>Your e-mail has been updated</Text>
                                    </>
                                    :
                                    <>
                                        {serverResponse === 'Your password has been reseted' ?
                                            <Text className='text-center text-lg text-green-600 font-semibold h-10'>{serverResponse}</Text>
                                            :
                                            serverResponse === 'Verification successful' &&
                                            <>
                                                <Text className='text-center text-lg text-green-600 font-semibold h-8 my-1'>Thank you!</Text>
                                                <Text className='text-center text-lg text-blue-500 font-semibold h-12 px-6'>Your account has been activated</Text>
                                            </>}
                                        {registered ?
                                            <>
                                                <AntDesign color='#22c55e' name='checksquare' size={24} />
                                                <Text className='text-center text-lg text-green-500 font-semibold h-10 sm:h-8 my-1'>Registration successful!</Text>
                                                <Text className='text-center text-lg text-blue-600 font-semibold h-16 my-2 px-6'>Check your e-mail inbox and verify your account</Text>
                                            </>
                                            :
                                            <LinkTo bgColor='bg-blue-600' bgHover='bg-blue-500' route='/login' title='Sign In' />}
                                    </>}
                            </View>
                        </AppBackground>
                        :
                        params.hasOwnProperty('email') && params.hasOwnProperty('token') ?
                            <UpdateData action='RESET-PASSWORD' response='Your password has been reseted' message='Your password has been reseted' title='New password' />
                            :
                            !loading && <ErrorPage code={403} message='Forbidden' />
                    :
                    <Spinner />}
            </>
        </MobileView>
    );
}

export default Verification;