import React from 'react';
import PropTypes from 'prop-types';
import AntDesign from '@expo/vector-icons/AntDesign';
import { Text, View } from 'react-native';
import { HomeButton } from '/components/Buttons';
import { UserContext } from '/context/UserContext';
import { useDimensions } from '/hooks/Hooks';
import { equilizeObjValues, hasKeyword, hasWord } from '/utils/utils';
import Input from '/components/Input';
import AppBackground from './AppBackground';
import MobileView from './MobileView';
import UpdateForm from './UpdateForm';

const UpdateData = ({ action, response, message, title }) => {

    const grayBorder = 'border-gray-300';
    const redBorder = 'border-red-500';

    const emailRef = React.useRef(null);

    const { serverResponse, updateUser, user, userController, userValues, passwordRef, newPasswordRef, confirmNewPasswordRef } = React.useContext(UserContext);
    const [borderColor, setBorderColor] = React.useState({ email: grayBorder, password: grayBorder, newPassword: grayBorder, confirmNewPassword: grayBorder });

    const dimensions = useDimensions(); // Screen size values
    // User changes initial state
    React.useEffect(() => {
        if (action === 'REQUEST-CHANGE-EMAIL') {
            updateUser(current => {
                const { newEmail, ...rest } = current;
                return rest;
            });
        }
        if (action === 'CHANGE-PASSWORD') {
            updateUser(current => {
                const { newPassword, ...rest } = current;
                return rest;
            });
            updateUser(current => {
                const { confirmNewPassword, ...rest } = current;
                return rest;
            });
        }
        updateUser(current => {
            const { password, ...rest } = current;
            return rest;
        });
    }, []);
    // Change input's border colors
    React.useEffect(() => {
        const keywords = ['updated', 'sended', 'reseted', 'new e-mail'];
        if (hasKeyword(keywords, serverResponse)) {
            equilizeObjValues(borderColor, setBorderColor, grayBorder);
        } else if (hasWord(serverResponse, 'fields')) {
            setBorderColor({ email: redBorder, password: redBorder });
        } else if (hasWord(serverResponse, 'e-mail')) {
            setBorderColor({ email: redBorder });
        } else if (hasWord(serverResponse, 'confirm')) {
            setBorderColor({ password: grayBorder, newPassword: grayBorder, confirmNewPassword: redBorder });
        } else if (hasWord(serverResponse, 'new')) {
            setBorderColor({ password: grayBorder, newPassword: redBorder, confirmNewPassword: redBorder });
        } else if (hasWord(serverResponse, 'password')) {
            setBorderColor({ password: redBorder });
        } else {
            equilizeObjValues(borderColor, setBorderColor, grayBorder);
        }
    }, [serverResponse]);

    return (
        <>
            {serverResponse === 'E-mail has been sended' ?
                <MobileView>
                    <AppBackground>
                        <HomeButton />
                        <View className='flex-centered' style={{ height: dimensions?.height, width: dimensions?.width }}>
                            <AntDesign color='#22c55e' name='checkcircle' size={24} />
                            <Text className='text-center text-lg text-green-500 font-semibold h-10 sm:h-8 mt-2'>{serverResponse}</Text>
                            <Text className='text-center text-lg text-blue-600 font-semibold h-16 my-1 px-6'>Check your e-mail to reset your password</Text>
                        </View>
                    </AppBackground>
                </MobileView>
                :
                <UpdateForm
                    action={action}
                    response={response}
                    message={message}
                    callback={userController}
                    title={title}
                >
                    {action === 'REQUEST-CHANGE-EMAIL' &&
                        <>
                            <Input
                                defaultValue={user.email}
                                label='Your new e-mail'
                                twClass='mb-2'
                                autoComplete='email'
                                autoFocus={true}
                                borderColor={borderColor.email}
                                inputRef={emailRef}
                                keyboardType='email-address'
                                onChangeText={(newEmail) => updateUser({ ...userValues, newEmail: newEmail })}
                                onSubmitEditing={() => passwordRef.current?.focus()}
                                placeholder='Enter your e-mail'
                                reference='email'
                                textContentType='emailAddress'
                                width='w-60'
                            />
                            <Input
                                label='Your current password'
                                twClass='mb-2'
                                borderColor={borderColor.password}
                                inputRef={passwordRef}
                                keyboardType='password'
                                onChangeText={(password) => updateUser({ ...userValues, password: password })}
                                onSubmitEditing={() => userController(action)}
                                placeholder='Enter your password'
                                reference='password'
                                returnKeyType='go'
                                secureTextEntry={true}
                                textContentType='password'
                                width='w-60'
                            />
                        </>}
                    {action === 'CHANGE-PASSWORD' &&
                        <>
                            <Input
                                label='Your current Password'
                                twClass='mb-6'
                                autoFocus={true}
                                borderColor={borderColor.password}
                                inputRef={passwordRef}
                                keyboardType='password'
                                onChangeText={(password) => updateUser({ ...userValues, password: password })}
                                onSubmitEditing={() => newPasswordRef.current?.focus()}
                                placeholder='Enter your password'
                                secureTextEntry={true}
                                textContentType='password'
                                width='w-60'
                            />
                            <Input
                                label='Your new password'
                                twClass='mb-2'
                                borderColor={borderColor.newPassword}
                                inputRef={newPasswordRef}
                                keyboardType='password'
                                onChangeText={(newPassword) => updateUser({ ...userValues, newPassword: newPassword })}
                                onSubmitEditing={() => confirmNewPasswordRef.current?.focus()}
                                placeholder='Enter your new password'
                                secureTextEntry={true}
                                textContentType='password'
                                width='w-60'
                            />
                            <Input
                                twClass='mb-2'
                                label='Confirm your new password'
                                borderColor={borderColor.confirmNewPassword}
                                inputRef={confirmNewPasswordRef}
                                keyboardType='password'
                                onChangeText={(confirmNewPassword) => updateUser({ ...userValues, confirmNewPassword: confirmNewPassword })}
                                onSubmitEditing={() => userController(action)}
                                placeholder='Enter your new password again'
                                returnKeyType='go'
                                secureTextEntry={true}
                                textContentType='password'
                                width='w-60'
                            />
                        </>}
                    {action === 'REQUEST-RESET-PASSWORD' &&
                        <Input
                            defaultValue={userValues?.email}
                            label='Your e-mail'
                            twClass='mb-2'
                            autoFocus={true}
                            borderColor={borderColor.email}
                            autoComplete='email'
                            inputRef={emailRef}
                            keyboardType='email-address'
                            onChangeText={(email) => updateUser({ ...userValues, email: email })}
                            onSubmitEditing={() => userController(action)}
                            placeholder='Enter your e-mail'
                            returnKeyType='go'
                            reference='email'
                            textContentType='emailAddress'
                            width='w-60'
                        />}
                    {action === 'RESET-PASSWORD' &&
                        <>
                            <Input
                                label='Your new password'
                                twClass='mb-2'
                                autoFocus={true}
                                borderColor={borderColor.newPassword}
                                inputRef={newPasswordRef}
                                keyboardType='password'
                                onChangeText={(newPassword) => updateUser({ ...userValues, newPassword: newPassword })}
                                onSubmitEditing={() => confirmNewPasswordRef.current?.focus()}
                                placeholder='Enter your new password'
                                secureTextEntry={true}
                                textContentType='password'
                                width='w-60'
                            />
                            <Input
                                twClass='mb-2'
                                label='Confirm your new password'
                                borderColor={borderColor.confirmNewPassword}
                                inputRef={confirmNewPasswordRef}
                                keyboardType='password'
                                onChangeText={(confirmNewPassword) => updateUser({ ...userValues, confirmNewPassword: confirmNewPassword })}
                                onSubmitEditing={() => userController(action)}
                                placeholder='Enter your new password again'
                                returnKeyType='go'
                                secureTextEntry={true}
                                textContentType='password'
                                width='w-60'
                            />
                        </>}
                </UpdateForm>}
        </>
    );
}

UpdateData.propTypes = {
    action: PropTypes.string,
    response: PropTypes.string,
    message: PropTypes.string,
    title: PropTypes.string
}

export default UpdateData;