import React from 'react';
import { ActivityIndicator, Image, Switch, Text, TouchableHighlight, View } from 'react-native';
import { Link } from 'expo-router';
import { UserContext } from '/context/UserContext';
import { useDimensions } from '/hooks/Hooks';
import { equilizeObjValues, hasKeyword, hasWord, isMobile } from '/utils/utils';
import Input from '/components/Input';
import UserForm from '/layouts/UserForm';
import Notification from '@ui/Notification';

const SignIn = () => {

    const grayBorder = 'border-gray-300';
    const redBorder = 'border-red-500';

    const { loading, loggedIn, serverResponse, updateUser, userController, userValues, emailRef, passwordRef } = React.useContext(UserContext);
    const [borderColor, setBorderColor] = React.useState({ email: '', password: '' });
    const [isAdmin, setIsAdmin] = React.useState(false);
    const [disableSwitch, setDisableSwitch] = React.useState(false);

    const dimensions = useDimensions(); // Screen size values
    // Request to sign-in on pressing enter
    React.useEffect(() => {
        const logIn = (event) => {
            const { key } = event;
            if (key === 'Enter') {
                setDisableSwitch(true);
                userController('LOGIN');
            }
        }
        if (!isMobile && !loggedIn) {
            window.addEventListener('keyup', logIn);
            return () => window.removeEventListener('keyup', logIn);
        }
    }, []);

    React.useEffect(() => {
        if (!userValues.hasOwnProperty('email')) updateUser({});
    }, []);
    // Change input's border colors
    React.useEffect(() => {
        const keywords = ['session', 'check', 'fields', 'blocked'];
        if (serverResponse === 'Enter e-mail and password' || hasKeyword(keywords, serverResponse)) {
            equilizeObjValues(borderColor, setBorderColor, redBorder);
        } else if (hasWord(serverResponse, 'e-mail')) {
            setBorderColor({ email: redBorder });
        } else if (hasWord(serverResponse, 'password') || hasWord(serverResponse, 'attempts')) {
            setBorderColor({ password: redBorder });
        } else {
            equilizeObjValues(borderColor, setBorderColor, grayBorder);
        }
        if (serverResponse !== '') setDisableSwitch(false);
    }, [serverResponse]);

    return (
        <UserForm>
            <View className='flex-centered' style={!isMobile && { height: dimensions?.height }}>
                <View
                    className={!isMobile && 'm-auto'}
                    style={isMobile ?
                        { height: dimensions?.width >= 360 ? dimensions?.height / 1.1 : dimensions?.height / 1.5, transform: dimensions?.width >= 360 ? 'scale(1)' : 'scale(0.6)' }
                        :
                        { transform: dimensions?.height <= 480 ? 'scale(0.6)' : dimensions?.height <= 640 ? 'scale(0.7)' : dimensions?.height <= 768 ? 'scale(0.8)' : 'scale(1)' }}
                >
                    <View className={isMobile && 'm-auto'}>
                        <View className='flex-centered mb-4'>
                            <Image
                                className='rounded-circle w-40 h-40'
                                source={{ uri: `https://res.cloudinary.com/${process.env.CLOUDINARY_USER}/image/upload/profile-icon_buepfk` }}
                            />
                        </View>
                        <View className='w-72 xxs:w-96 md:w-125 h-100 lg:h-125'>
                            <View className='bg-white border border-gray-300 rounded-3xl mb-4 p-8'>
                                <Text className='text-center text-gray-800 text-3xl font-bold mb-4'>Sign-In</Text>
                                <View className='flex-centered flex-row mb-2'>
                                    <Text className='text-gray-800 text-xs font-semibold mr-1'>Admin</Text>
                                    <Switch
                                        disabled={disableSwitch}
                                        onValueChange={() => setIsAdmin(!isAdmin)}
                                        thumbColor={isAdmin ? '#71bfff' : '#dcdcdc'}
                                        trackColor={{ true: '#026ac0', false: '#656565' }}
                                        value={isAdmin}
                                    />
                                </View>
                                <Input
                                    defaultValue={userValues?.email}
                                    label='E-mail'
                                    twClass='mb-2'
                                    borderColor={borderColor.email}
                                    autoComplete='email'
                                    autoFocus={true}
                                    inputRef={emailRef}
                                    keyboardType='email-address'
                                    onChangeText={(email) => updateUser({ ...userValues, email: email })}
                                    onSubmitEditing={() => passwordRef.current?.focus()}
                                    placeholder='Enter your e-mail'
                                    textContentType='emailAddress'
                                />
                                <Input
                                    defaultValue={userValues?.password}
                                    label='Password'
                                    twClass='mb-2'
                                    borderColor={borderColor.password}
                                    inputRef={passwordRef}
                                    keyboardType='password'
                                    onChangeText={(password) => updateUser({ ...userValues, password: password })}
                                    onSubmitEditing={() => userController('LOGIN')}
                                    placeholder='Enter your password'
                                    returnKeyType='go'
                                    secureTextEntry={true}
                                    textContentType='password'
                                />
                                <View className='flex items-end justify-center'>
                                    <Link
                                        className='text-blue-600 font-semibold mb-4'
                                        accessibilityLargeContentTitle='Forgot password?'
                                        href='/account/reset-password'
                                    >
                                        Forgot password?
                                    </Link>
                                </View>
                                <View className='flex-centered'>
                                    <TouchableHighlight
                                        className='bg-blue-600 rounded w-24 h-8 my-1 p-1'
                                        underlayColor='#2563eb'
                                        {...(!loading && { onPress: () => userController('LOGIN') })}
                                    >
                                        <Text className={`text-center text-white font-semibold leading-5 ${loading && 'mt-0.5'}`}>
                                            {loading ? <ActivityIndicator color='#ffffff' size='small' /> : 'Log-in'}
                                        </Text>
                                    </TouchableHighlight>
                                    <View className=' h-10 mt-2'>
                                        {serverResponse !== '' && <Notification color='red' icon='circle-xmark' response={serverResponse} />}
                                    </View>
                                </View>
                                <View className='flex-centered flex-row my-2'>
                                    <Text className='text-center text-gray-500 font-semibold'>New user? </Text>
                                    <Link className='text-center text-blue-600 font-semibold' href='/register'>Create an account</Link>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        </UserForm>
    );
}

export default SignIn;