import React from 'react';
import PropTypes from 'prop-types';
import { Alert, Image, Keyboard } from 'react-native';
import { useNetworkState } from 'expo-network';
import { router } from 'expo-router';
import { useAsyncStorage } from '/hooks/Hooks';
import { capitalize, dateCreator, equilizeObjValues, isMobile, isWeb, sortAlphabetically } from '/utils/utils';
import handleAuthService from '/services/auth.service';
// Create a context that components can provide or read
export const UserContext = React.createContext({
    userController: () => { }
});
// Create references
const emailRef = React.createRef();
const passwordRef = React.createRef();
const newPasswordRef = React.createRef();
const confirmNewPasswordRef = React.createRef();
// Provider to access data and functions
const UserProvider = ({ children }) => {

    const [invalidDate, setInvalidDate] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [registered, setRegistered] = React.useState(false);
    const [showMenu, setShowMenu] = React.useState(false);
    const [backgroundImage, setBackgroundImage] = React.useState('');
    const [serverResponse, setServerResponse] = React.useState('');
    const [appointments, setAppointments] = React.useState([]);
    const [areaCallingCodes, setAreaCallingCodes] = React.useState([]);
    const [imagesInfo, setImagesInfo] = React.useState({});
    const [userValues, setUserValues] = React.useState({});

    const [loggedIn, setLoggedIn] = useAsyncStorage('loggedIn', false);
    const [user, setUser] = useAsyncStorage('user', {
        id: '',
        email: '',
        firstName: '',
        lastName: '',
        cca2: '',
        phone: '',
        birthDate: '',
        age: '',
        profilePicture: '',
        sessionToken: ''
    });

    const networkState = useNetworkState(); // Access network state of the device, including connectivity and type
    // Set the session token key
    const sessionTokenKey = (isWeb) ? 'session_token_web' : 'session_token_mobile';
    // Update states with functions
    const dateIsInvalid = (value) => setInvalidDate(value);
    const hideMenu = () => setShowMenu(false);
    const toggleMenu = () => setShowMenu(!showMenu);
    const clearServerResponse = () => setServerResponse('');
    const updateUser = (newValues) => setUserValues(newValues);
    // Submit data to server
    const submitForm = (url, data, succesful, error, callback = () => { }, isLoading = true, alternativeCallback = () => { }) => {
        const success = async (response) => {
            const result = await response.json();
            const message = result[0].Message;
            setServerResponse(message);
            (message === succesful || succesful === true) ? callback(result) : alternativeCallback();
            setLoading(false);
        }
        setLoading(isLoading);
        handleAuthService(url, data, success, error); // Make a request to server
    }
    // Handle user actions
    const userController = (action) => {
        setServerResponse('');

        if (action === 'LOGIN') {
            const url = 'https://dentalclinic4userver.vercel.app/api/session.php';
            const data = {
                action: action,
                email: (isMobile && !isWeb) ? userValues?.email : emailRef.current.value,
                password: (isMobile && !isWeb) ? userValues?.password : passwordRef.current.value,
                is_mobile: !isWeb
            }
            const callback = (result) => {
                const info = result[0]?.Info;
                setLoggedIn(true);
                setUser({
                    id: info?.user_id,
                    email: info?.user_email,
                    firstName: info?.first_name,
                    lastName: info?.last_name,
                    cca2: info?.cca2,
                    phone: info?.phone,
                    birthDate: info?.birth_date,
                    age: info?.age,
                    profilePicture: info?.profile_picture,
                    sessionToken: isWeb ? info?.session_token_web : info?.session_token_mobile,
                    registered: info?.registered
                });
                router.navigate('/');
                setUserValues({});
                if (!isMobile && isWeb) {
                    emailRef.current.clear();
                    passwordRef.current.clear();
                }
            }
            const error = () => {
                setLoading(false);
                setLoggedIn(false);
            }
            submitForm(url, data, 'Connected', error, callback);
        }

        if (action === 'LOGOUT') {
            const url = 'https://dentalclinic4userver.vercel.app/api/session.php';
            const data = {
                action: action,
                id: user?.id,
                [sessionTokenKey]: user?.sessionToken,
                is_mobile: !isWeb ?? ''
            }
            const callback = () => {
                setShowMenu(false);
                setLoggedIn(false);
                equilizeObjValues(user, setUser);
                setUserValues({});
                setLoading(false);
                router.navigate('/');
            }
            const error = () => {
                setLoading(false);
                if (isWeb) {
                    alert('Something went wrong, try again!');
                } else if (isMobile) {
                    Alert.alert(
                        'Oops!', 'Something went wrong, try again!',
                        [{ text: 'OK', onPress: () => null, style: 'cancel' }],
                        { cancelable: true, onDismiss: () => null }
                    );
                }
            }
            submitForm(url, data, 'Disconnected', error, callback);
        }

        if (action === 'SIGNUP') {
            const url = 'https://dentalclinic4userver.vercel.app/api/register.php';
            const data = {
                email: userValues?.newUserEmail,
                password: userValues?.password,
                confirm_password: userValues?.confirmPassword,
                first_name: capitalize(userValues?.firstName),
                last_name: capitalize(userValues?.lastName),
                birth_date: (!isNaN(new Date(userValues?.birthDate)) ? new Date(userValues?.birthDate) : dateCreator(new Date(), -18)).toISOString().split('T')[0],
                cca2: userValues?.cca2,
                phone: userValues?.phone
            }
            const callback = () => {
                setUserValues({});
                setRegistered(true);
                router.navigate('/account');
            }
            submitForm(url, data, 'Registration successful', () => setLoading(false), callback, true, () => setRegistered(false));
        }

        if (action === 'ACTIVATE') {
            const url = 'https://dentalclinic4userver.vercel.app/api/credentials.php';
            const data = { action: action, id: userValues?.id, token: userValues?.activationToken }
            const error = () => {
                if (isWeb) {
                    alert('Something went wrong, try again!');
                } else if (isMobile) {
                    Alert.alert(
                        'Oops!', 'Something went wrong, try again!',
                        { text: 'OK', onPress: () => null, style: 'cancel' },
                        { cancelable: true, onDismiss: () => null }
                    );
                }
            }
            setRegistered(false);
            submitForm(url, data, true, error, () => setUserValues({}));
        }

        if (action === 'CHANGE-PROFILE') {
            const url = 'https://dentalclinic4userver.vercel.app/api/update.php';
            const data = {
                action: action,
                id: user?.id,
                first_name: userValues?.firstName,
                last_name: userValues?.lastName,
                profile_picture: userValues?.profilePicture,
                cca2: userValues?.cca2,
                phone: userValues?.phone,
                birth_date: !isNaN(new Date(userValues?.birthDate)) ? new Date(userValues?.birthDate).toISOString().split('T')[0] : user?.birthDate,
                [sessionTokenKey]: user?.sessionToken,
                is_mobile: !isWeb
            }
            const callback = () => {
                setUser({ ...user, ...userValues });
                setUserValues({});
            }
            submitForm(url, data, 'Profile updated', () => setLoading(false), callback);
        }

        if (action === 'REQUEST-CHANGE-EMAIL') {
            const url = 'https://dentalclinic4userver.vercel.app/api/update.php';
            const data = {
                action: action,
                id: user?.id,
                email: user?.email,
                new_email: (userValues.hasOwnProperty('newEmail') ? userValues.newEmail : user?.email),
                password: userValues?.password,
                [sessionTokenKey]: user?.sessionToken,
                is_mobile: !isWeb
            }
            const callback = () => {
                setUserValues({});
                passwordRef.current.clear();
                Keyboard.dismiss();
            }
            submitForm(url, data, 'Please confirm your new e-mail', () => setLoading(false), callback);
        }

        if (action === 'CHANGE-EMAIL') {
            const url = 'https://dentalclinic4userver.vercel.app/api/credentials.php';
            const data = {
                action: action,
                id: userValues?.id,
                new_email: userValues?.newEmail,
                token: userValues?.emailToken
            }
            const callback = () => {
                setUser({ ...user, email: userValues?.newEmail });
                setUserValues({});
            }
            setRegistered(false);
            submitForm(url, data, 'E-mail updated', () => setLoading(false), callback);
        }

        if (action === 'CHANGE-PASSWORD') {
            const url = 'https://dentalclinic4userver.vercel.app/api/update.php';
            const data = {
                action: action,
                id: user?.id,
                password: userValues?.password,
                new_password: userValues?.newPassword,
                confirm_new_password: userValues?.confirmNewPassword,
                [sessionTokenKey]: user?.sessionToken,
                is_mobile: !isWeb
            }
            const callback = () => {
                setUserValues({});
                passwordRef.current.clear();
                newPasswordRef.current.clear();
                confirmNewPasswordRef.current.clear();
                Keyboard.dismiss();
            }
            submitForm(url, data, 'Password updated', () => setLoading(false), callback);
        }

        if (action === 'REQUEST-RESET-PASSWORD') {
            const url = 'https://dentalclinic4userver.vercel.app/api/credentials.php';
            const data = { action: action, email: userValues?.email }
            const callback = () => {
                setUserValues({});
                Keyboard.dismiss();
            }
            submitForm(url, data, 'E-mail has been sended', () => setLoading(false), callback);
        }

        if (action === 'RESET-PASSWORD') {
            const url = 'https://dentalclinic4userver.vercel.app/api/credentials.php';
            const data = {
                action: action,
                email: userValues?.email,
                new_password: userValues?.newPassword,
                confirm_new_password: userValues?.confirmNewPassword,
                token: userValues?.resetToken
            }
            const callback = () => {
                setUserValues({ email: userValues?.email });
                newPasswordRef.current.clear();
                confirmNewPasswordRef.current.clear();
            }
            setRegistered(false);
            submitForm(url, data, 'Your password has been reseted', () => setLoading(false), callback);
        }

        if (action === 'DISABLE-ACCOUNT') {
            const url = 'https://dentalclinic4userver.vercel.app/api/update.php';
            const data = {
                action: action,
                id: user?.id,
                password: userValues?.password ?? '',
                [sessionTokenKey]: user?.sessionToken,
                is_mobile: !isWeb
            }
            const callback = () => {
                setUserValues({});
                passwordRef.current.clear();
                Keyboard.dismiss();
            }
            submitForm(url, data, 'Your account has been disabled', () => setLoading(false), callback);
        }

        if (action === 'GET APPOINTMENTS') {
            const url = 'https://dentalclinic4userver.vercel.app/api/appointments.php';
            const data = { action: action, id: user?.id, [sessionTokenKey]: user?.sessionToken, is_mobile: !isWeb }
            const callback = (result) => {
                setAppointments({
                    scheduled: result[0]?.Appointments.filter((item) => item.cancelation === 0),
                    types: result[0]?.Types,
                    hours: result[0]?.Hours
                });
                setUserValues({});
            }
            submitForm(url, data, true, () => setLoading(false), callback);
        }

        if (action === 'CHECK AVAILABILITY') {
            const url = 'https://dentalclinic4userver.vercel.app/api/appointments.php';
            const data = {
                action: action,
                id: user.id,
                [sessionTokenKey]: user.sessionToken,
                appt_date: new Date(userValues.apptDate).toISOString().split('T')[0] ?? '',
                is_mobile: !isWeb
            }
            const callback = (result) => setAppointments({ ...appointments, hours: Object.values(result[0].Hours) });
            submitForm(url, data, true, () => setLoading(false), callback, false);
        }

        if (action === 'ADD APPOINTMENT') {
            const url = 'https://dentalclinic4userver.vercel.app/api/appointments.php';
            const data = {
                action: action,
                id: user?.id,
                [sessionTokenKey]: user?.sessionToken,
                appt_type: userValues?.apptType,
                appt_date: new Date(userValues?.apptDate).toISOString().split('T')[0],
                appt_time: userValues?.apptTime,
                is_mobile: !isWeb
            }
            submitForm(url, data, 'Booked successfully', () => setLoading(false));
        }

        if (action === 'CANCEL APPOINTMENT') {
            const url = 'https://dentalclinic4userver.vercel.app/api/appointments.php';
            const data = {
                action: action,
                id: user?.id,
                [sessionTokenKey]: user?.sessionToken,
                appt_id: userValues?.apptId,
                is_mobile: !isWeb
            }
            submitForm(url, data, 'Your appointment has been canceled', () => setLoading(false), () => setUserValues({}));
        }
    }
    // Pre-fetch images
    const getImages = async () => {
        const url = `https://res.cloudinary.com/${process.env.CLOUDINARY_USER}/image/upload/app-background_d1feum`;
        const prefetch = await Image.prefetch(url);
        // Background image
        Promise.resolve(prefetch)
            .then(() => setBackgroundImage(url))
            .catch((error) => console.error(error.message));
        // Get images for carousel and dentists profiles
        await fetch('https://api.npoint.io/2cb9ef8b2be562a4f678')
            .then((response) => response.json())
            .then((data) => setImagesInfo(data))
            .catch((error) => console.error(error.message));
        // Get area codes and flags
        await fetch('https://api.npoint.io/9efdf8ccb2b6b275964a')
            .then((response) => response.json())
            .then((data) => {
                let areaData = data.map((item) => {
                    return {
                        callingCode: item.code,
                        cca2: item.cca2,
                        flag: item.flag,
                        name: item.name,
                    }
                });
                setAreaCallingCodes(sortAlphabetically(areaData));
            });
    }
    // Discard all userValues keys that are empty
    React.useEffect(() => {
        if (userValues.hasOwnProperty('email') && userValues.email === '') setUserValues((current) => {
            const { email, ...rest } = current;
            return rest;
        });
        if (userValues.hasOwnProperty('newUserEmail') && userValues.newUserEmail === '') setUserValues((current) => {
            const { newUserEmail, ...rest } = current;
            return rest;
        });
        if (userValues.hasOwnProperty('password') && userValues.password === '') setUserValues((current) => {
            const { password, ...rest } = current;
            return rest;
        });
        if (userValues.hasOwnProperty('confirmPassword ') && userValues.confirmPassword === '') setUserValues((current) => {
            const { confirmPassword, ...rest } = current;
            return rest;
        });
        if (userValues.hasOwnProperty('newPassword') && userValues.newPassword === '') setUserValues((current) => {
            const { newPassword, ...rest } = current;
            return rest;
        });
        if (userValues.hasOwnProperty('confirmNewPassword') && userValues.confirmNewPassword === '') setUserValues((current) => {
            const { confirmNewPassword, ...rest } = current;
            return rest;
        });
        if (userValues.hasOwnProperty('firstName') && userValues.firstName === '') setUserValues((current) => {
            const { firstName, ...rest } = current;
            return rest;
        });
        if (userValues.hasOwnProperty('lastName') && userValues.lastName === '') setUserValues((current) => {
            const { lastName, ...rest } = current;
            return rest;
        });
        if (userValues.hasOwnProperty('phone') && userValues.phone === '') setUserValues((current) => {
            const { phone, ...rest } = current;
            return rest;
        });
    }, [userValues, userValues.email, userValues.newUserEmail, userValues.password, userValues.confirmPassword, userValues.newPassword, userValues.confirmNewPassword, userValues.firstName, userValues.lastName, userValues.phone]);
    // Check connectivity
    React.useEffect(() => {
        if (networkState.isConnected) getImages();
        if (networkState.isConnected === false) setBackgroundImage('');
    }, [networkState.isConnected]);

    return (
        <UserContext.Provider value={{
            appointments,
            areaCallingCodes,
            backgroundImage,
            clearServerResponse,
            dateIsInvalid,
            hideMenu,
            imagesInfo,
            invalidDate,
            loading,
            loggedIn,
            registered,
            serverResponse,
            showMenu,
            toggleMenu,
            updateUser,
            user,
            userController,
            userValues,
            emailRef,
            passwordRef,
            newPasswordRef,
            confirmNewPasswordRef
        }}>
            {children}
        </UserContext.Provider>
    );
}

UserProvider.propTypes = { children: PropTypes.node }

export default UserProvider;