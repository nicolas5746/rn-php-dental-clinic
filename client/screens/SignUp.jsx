import React from 'react';
import AntDesign from '@expo/vector-icons/AntDesign';
import { ActivityIndicator, Platform, Pressable, Text, TouchableHighlight, View } from 'react-native';
import { createElement } from 'react-native-web';
import { UserContext } from '/context/UserContext';
import { useDimensions } from '/hooks/Hooks';
import { dateCreator, equilizeObjValues, hasWord, isMobile } from '/utils/utils';
import Fonts from '/app/_fonts';
import CountryCodePicker from '/components/CountryCodePicker';
import DatePicker from '/components/DatePicker';
import Input from '/components/Input';
import UserForm from '/layouts/UserForm';
import Notification from '@ui/Notification';

const SignUp = () => {

    const grayBorder = 'border-gray-300';
    const redBorder = 'border-red-500';

    const passwordRef = React.useRef(null);
    const confirmPasswordRef = React.useRef(null);
    const firstNameRef = React.useRef(null);
    const lastNameRef = React.useRef(null);
    const phoneRef = React.useRef(null);

    const { dateIsInvalid, invalidDate, loading, loggedIn, serverResponse, updateUser, userController, userValues } = React.useContext(UserContext);
    const [borderColor, setBorderColor] = React.useState({ newUserEmail: '', password: '', confirmPassword: '', firstName: '', lastName: '', cca2: '', phone: '' });
    const [showList, setShowList] = React.useState(false);
    const [values, setValues] = React.useState({ newUserEmail: '', password: '', confirmPassword: '', firstName: '', lastName: '', cca2: '', phone: '', birthDate: dateCreator(new Date(), -18) });

    const dimensions = useDimensions(); // Screen size values
    const fonts = Fonts(); // Access fonts object

    const Label = Platform.select({
        web: props => createElement('label', props),
        default: props => React.createElement(Text, props)
    });

    const datePickerId = Math.round(Math.random() * 9999999999).toString(); // Unique id number
    // Send request to register user
    const register = () => {
        dateIsInvalid(false);
        (userValues.hasOwnProperty('birthDate') && new Date(userValues.birthDate) == 'Invalid Date') ? dateIsInvalid(true) : userController('SIGNUP');
    }
    // Update input data
    const onChangeField = (event, key) => {
        setValues((prev) => ({ ...prev, [key]: !isNaN(new Date(event)) ? event : event.trim() }));
        updateUser({ ...userValues, [key]: !isNaN(new Date(event)) ? event : event.trim() });
    }
    // Request to sign-up on pressing enter
    React.useEffect(() => {
        const signUp = (event) => {
            const { key } = event;
            if (key === 'Enter') register();
        }
        if (!isMobile && !loggedIn) {
            window.addEventListener('keyup', signUp);
            return () => window.removeEventListener('keyup', signUp);
        }
    }, []);

    React.useEffect(() => {
        (userValues.hasOwnProperty('cca2')) ? setValues((prev) => ({ ...prev, cca2: userValues.cca2 })) : setValues((prev) => ({ ...prev, cca2: '' }));
    }, [userValues, userValues.cca2]);
    // Change input's border colors
    React.useEffect(() => {
        if (hasWord(serverResponse, 'successful')) {
            equilizeObjValues(borderColor, setBorderColor, grayBorder);
            updateUser({});
        } else if (hasWord(serverResponse, 'fields')) {
            let newValues = {};
            for (const [key, value] of Object.entries(values)) {
                if (value === '' && key !== 'birthDate') newValues[key] = redBorder;
                setBorderColor(newValues);
            }
        } else if (hasWord(serverResponse, 'e-mail')) {
            setBorderColor({ newUserEmail: redBorder });
        } else if (hasWord(serverResponse, 'first')) {
            setBorderColor({ firstName: redBorder });
        } else if (hasWord(serverResponse, 'last')) {
            setBorderColor({ lastName: redBorder });
        } else if (hasWord(serverResponse, 'password')) {
            setBorderColor({ password: redBorder, confirmPassword: redBorder });
        } else if (hasWord(serverResponse, 'country')) {
            setBorderColor({ cca2: redBorder });
        } else if (hasWord(serverResponse, 'phone')) {
            setBorderColor({ phone: redBorder });
        } else {
            equilizeObjValues(borderColor, setBorderColor, grayBorder);
        }
    }, [serverResponse, values]);

    React.useEffect(() => {
        updateUser({});
    }, []);

    return (
        <>
            {showList && <CountryCodePicker close={() => setShowList(false)} showList={showList} />}
            <View className={`${showList ? 'hidden' : 'visible'}`}>
                <UserForm>
                    <View className='flex-centered my-1' style={!isMobile && { height: dimensions?.height }}>
                        <View
                            className={`w-11/12 sm:w-125 h-150 lg:h-175  ${!isMobile && 'm-auto'}`}
                            style={isMobile ?
                                { height: dimensions?.width >= 360 ? dimensions?.height : dimensions?.height / 1.5, transform: dimensions?.width >= 360 ? 'scale(0.9)' : 'scale(0.6)' }
                                :
                                { transform: dimensions?.height <= 480 ? 'scale(0.6)' : dimensions?.height <= 640 ? 'scale(0.7)' : dimensions?.height <= 768 ? 'scale(0.8)' : 'scale(1)' }}
                        >
                            <View className={`bg-white border border-gray-300 rounded-3xl ${isMobile && 'my-auto'} p-5 sm:p-8`}>
                                <Text className='text-center text-gray-800 text-3xl font-bold mb-4'>Sign-Up</Text>
                                <Input
                                    defaultValue={values.newUserEmail}
                                    label='E-mail'
                                    twClass='mb-1'
                                    autoComplete='email'
                                    autoFocus={true}
                                    borderColor={borderColor.newUserEmail}
                                    keyboardType='email-address'
                                    onChangeText={(event) => onChangeField(event, 'newUserEmail')}
                                    onSubmitEditing={() => passwordRef.current?.focus()}
                                    placeholder='Enter your e-mail'
                                    textContentType='emailAddress'
                                />
                                <Input
                                    defaultValue={values.password}
                                    label='Password'
                                    twClass='mb-1'
                                    borderColor={borderColor.password}
                                    inputRef={passwordRef}
                                    keyboardType='password'
                                    onChangeText={(event) => onChangeField(event, 'password')}
                                    onSubmitEditing={() => confirmPasswordRef.current?.focus()}
                                    placeholder='Enter your password'
                                    secureTextEntry={true}
                                    textContentType='password'
                                />
                                <Input
                                    defaultValue={values.confirmPassword}
                                    twClass='mb-1'
                                    borderColor={borderColor.confirmPassword}
                                    inputRef={confirmPasswordRef}
                                    keyboardType='password'
                                    onChangeText={(event) => onChangeField(event, 'confirmPassword')}
                                    onSubmitEditing={() => firstNameRef.current?.focus()}
                                    placeholder='Enter your password again'
                                    secureTextEntry={true}
                                    textContentType='password'
                                />
                                <Input
                                    defaultValue={values.firstName}
                                    label='First Name'
                                    twClass='mb-1'
                                    autoCapitalize='words'
                                    autoComplete='name'
                                    autoCorrect={true}
                                    borderColor={borderColor.firstName}
                                    inputRef={firstNameRef}
                                    onChangeText={(event) => onChangeField(event, 'firstName')}
                                    onSubmitEditing={() => lastNameRef.current?.focus()}
                                    placeholder='Enter your first name'
                                    textContentType='name'
                                />
                                <Input
                                    defaultValue={values.lastName}
                                    label='Last Name'
                                    twClass='mb-1'
                                    autoCapitalize='words'
                                    autoComplete='name'
                                    autoCorrect={true}
                                    borderColor={borderColor.lastName}
                                    inputRef={lastNameRef}
                                    onChangeText={(event) => onChangeField(event, 'lastName')}
                                    onSubmitEditing={() => phoneRef.current?.focus()}
                                    placeholder='Enter your last name'
                                    textContentType='name'
                                />
                                <View className='h-16 mb-2'>
                                    <Label className='text-gray-500 text-sm font-semibold ml-1' htmlFor={datePickerId} style={fonts.families.ralewaySmall}>Date of birth</Label>
                                    <DatePicker
                                        id={datePickerId}
                                        defaultDate={dateCreator(new Date(), -18)}
                                        endYear={new Date().getFullYear()}
                                        onChange={(event) => onChangeField(event, 'birthDate')}
                                        startYear={new Date().getFullYear() - 100}
                                    />
                                </View>
                                <View className='flex flex-row w-full mb-1 gap-1'>
                                    <View className='flex flex-col basis-1/4'>
                                        <Text className='text-gray-500 text-left text-sm font-semibold ml-1 mb-1' style={fonts.families.ralewaySmall}>{dimensions?.width >= 432 ? 'Country Code' : 'CCa'}</Text>
                                        {values.cca2 === '' ?
                                            <Pressable className={`flex-centered border ${borderColor.cca2} rounded-xl h-10`} onPress={() => setShowList(true)}>
                                                <AntDesign color='#5592f4' name='questioncircle' size={22} />
                                            </Pressable>
                                            :
                                            <CountryCodePicker open={() => setShowList(true)} showList={showList} />}
                                    </View>
                                    <View className='flex flex-col basis-3/4'>
                                        <Text className='text-gray-500 text-sm font-semibold ml-1 mb-1' style={fonts.families.ralewaySmall}>Phone Number</Text>
                                        <Input
                                            defaultValue={values.phone}
                                            autoComplete='tel'
                                            borderColor={borderColor.phone}
                                            inputRef={phoneRef}
                                            keyboardType='phone-pad'
                                            onChangeText={(event) => onChangeField(event, 'phone')}
                                            onSubmitEditing={register}
                                            placeholder='Enter your phone number'
                                            returnKeyType='go'
                                            textContentType='telephoneNumber'
                                            width='w-auto'
                                        />
                                    </View>
                                </View>
                                <View className='flex-centered mt-4'>
                                    <TouchableHighlight
                                        className='bg-blue-600 rounded w-24 h-8 p-1'
                                        underlayColor='#2563eb'
                                        {...(!loading && { onPress: register })}
                                    >
                                        <Text className={`text-center text-white font-semibold leading-5 ${loading && 'mt-0.5'}`}>
                                            {loading ? <ActivityIndicator color='#ffffff' size='small' /> : 'Register'}
                                        </Text>
                                    </TouchableHighlight>
                                    <View className='h-10 mt-4'>
                                        {serverResponse !== '' && <Notification color='red' icon='circle-xmark' response={invalidDate ? 'Invalid date' : serverResponse} />}
                                    </View>
                                </View>
                            </View>
                        </View>
                    </View>
                </UserForm>
            </View>
        </>
    );
}

export default SignUp;