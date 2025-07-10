import React from 'react';
import { ActivityIndicator, ScrollView, Text, TouchableHighlight, View } from 'react-native';
import { HomeButton, LinkTo } from '/components/Buttons';
import { UserContext } from '/context/UserContext';
import { delay } from '/utils/utils';
import Input from '/components/Input';
import AppBackground from '/layouts/AppBackground';
import MobileView from '/layouts/MobileView';
import Notification from '@ui/Notification';

const DisableAccount = () => {

    const grayBorder = 'border-gray-300';
    const redBorder = 'border-red-500';

    const { clearServerResponse, loading, serverResponse, updateUser, userController, passwordRef } = React.useContext(UserContext);
    const [borderColor, setBorderColor] = React.useState(grayBorder);
    const [confirmWithPass, setConfirmWithPass] = React.useState(false);
    const [hideButton, setHideButton] = React.useState(false);

    React.useEffect(() => {
        clearServerResponse();
    }, []);
    // Log out when account is disabled
    React.useEffect(() => {
        if (serverResponse === 'Your account has been disabled') delay(() => userController('LOGOUT'), 3000);
        if (serverResponse !== '') {
            if (serverResponse === 'Your account has been disabled' || serverResponse === 'Disconnected') {
                setBorderColor(grayBorder);
                setHideButton(true);
            } else {
                setBorderColor(redBorder);
            }
        }
    }, [serverResponse]);

    return (
        <MobileView>
            <AppBackground>
                <HomeButton />
                <View className='absolute flex-centered w-full my-6'>
                    <ScrollView keyboardShouldPersistTaps='handled'>
                        <View className='flex-centered w-80 sm:w-96 h-screen'>
                            <View className={`bg-white border border-gray-300 rounded-3xl ${confirmWithPass ? 'h-72' : 'h-56 sm:h-44'} mb-4 p-8`}>
                                <Text className='text-center text-gray-800 text-3xl font-bold mb-4'>Disable account</Text>
                                {confirmWithPass ?
                                    <View className='flex-centered flex-col w-60 my-2'>
                                        <View className='flex items-start justify-center'>
                                            <Input
                                                label='Your password'
                                                twClass='mb-4'
                                                autoFocus={true}
                                                borderColor={borderColor}
                                                inputRef={passwordRef}
                                                keyboardType='password'
                                                onChangeText={(password) => updateUser({ password: password })}
                                                onSubmitEditing={() => userController('DISABLE-ACCOUNT')}
                                                placeholder='Enter your password'
                                                reference='password'
                                                returnKeyType='go'
                                                secureTextEntry={true}
                                                textContentType='password'
                                                width='w-60'
                                            />
                                        </View>
                                        <View className='h-8 my-1'>
                                            {!hideButton &&
                                                <TouchableHighlight
                                                    className='bg-blue-600 rounded w-24 h-8 p-1'
                                                    underlayColor='#2563eb'
                                                    {...(!loading && { onPress: () => userController('DISABLE-ACCOUNT') })}
                                                >
                                                    <Text className={`text-center text-white font-semibold leading-5 ${loading && 'mt-0.5'}`}>
                                                        {loading ? <ActivityIndicator color='#ffffff' size='small' /> : 'Submit'}
                                                    </Text>
                                                </TouchableHighlight>}
                                        </View>
                                        <View className='h-8 mt-4 mb-1'>
                                            {serverResponse !== '' &&
                                                <Notification
                                                    color={serverResponse === 'Your account has been disabled' || serverResponse === 'Disconnected' ? 'blue' : 'red'}
                                                    icon={serverResponse === 'Your account has been disabled' || serverResponse === 'Disconnected' ? 'circle-check' : 'circle-xmark'}
                                                    response={serverResponse}
                                                />}
                                        </View>
                                    </View>
                                    :
                                    <>
                                        <Text className='text-center text-gray-400 text-base font-bold'>Are you sure?</Text>
                                        <View className='flex-centered flex-row my-2'>
                                            <TouchableHighlight className='bg-blue-600 rounded w-24 h-8 my-1 p-1' onPress={() => setConfirmWithPass(true)} underlayColor='#2563eb'>
                                                <Text className='text-center text-white font-semibold leading-5'>Yes</Text>
                                            </TouchableHighlight>
                                            <LinkTo bgColor='bg-blue-600' bgHover='bg-blue-700' route='/' title='No' />
                                        </View>
                                    </>}
                            </View>
                        </View>
                    </ScrollView>
                </View>
            </AppBackground>
        </MobileView>
    );
}

export default DisableAccount;