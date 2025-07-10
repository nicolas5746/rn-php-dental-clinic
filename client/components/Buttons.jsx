import React from 'react';
import PropTypes from 'prop-types';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Pressable, Text, View } from 'react-native';
import { RadioButton } from 'react-native-paper';
import { Link, router } from 'expo-router';
import { UserContext } from '/context/UserContext';
import Fonts from '/app/_fonts';

export const BackButton = ({ onPress }) => {

    const [hover, setHover] = React.useState(false);

    return (
        <Pressable
            className='flex-centered w-12 h-12 mx-4'
            accessibilityLargeContentTitle='Go back'
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            onPress={onPress}
        >
            <Ionicons color={`${hover ? '#337ef6' : '#3b82f6'}`} name='arrow-back-circle' size={36} />
        </Pressable>
    );
}

BackButton.propTypes = { onPress: PropTypes.func }

export const HomeButton = () => {

    const [hover, setHover] = React.useState(false);

    const fonts = Fonts(); // Access fonts object

    return (
        <Link
            className={`absolute ${hover ? 'bg-gray-100' : 'bg-white'} flex-centered text-center rounded-md border border-gray-300 w-20 h-8 left-4 top-4 my-1 p-1 lg:py-0 z-50`}
            accessibilityLargeContentTitle='Home'
            href='/'
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
        >
            <Ionicons color='#2563eb' name='home' size={12} />
            <Text className='text-sm lg:text-base text-blue-500 font-semibold' style={fonts.families.jostSmall}> Home</Text>
        </Link>
    );
}

export const LinkTo = ({ bgColor, bgHover, route, title }) => {

    const [hover, setHover] = React.useState(false);

    return (
        <Link
            className={`${hover ? bgHover : bgColor} text-center text-white font-semibold leading-5 rounded w-24 h-8 mx-2 p-1`}
            accessibilityLargeContentTitle={title}
            href={route}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
        >
            {title}
        </Link>
    );
}

LinkTo.propTypes = {
    bgColor: PropTypes.string,
    bgHover: PropTypes.string,
    route: PropTypes.string,
    title: PropTypes.string
}

export const MenuButton = ({ children, action = () => { }, route, color = 'blue', title }) => {

    const { hideMenu } = React.useContext(UserContext);
    const [hover, setHover] = React.useState(false);
    const [textColor, setTextColor] = React.useState('');

    const fonts = Fonts(); // Access fonts object

    const handleOnPress = () => {
        action();
        hideMenu();
        router.navigate(route);
    }

    React.useEffect(() => {
        if (color === 'blue') {
            (hover) ? setTextColor('text-blue-700') : setTextColor('text-blue-800');
        }
        if (color === 'red') {
            (hover) ? setTextColor('text-red-600') : setTextColor('text-red-500');
        }
    }, [color, hover]);

    return (
        <Pressable
            className='my-2'
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            onPress={handleOnPress}
        >
            <View className='flex-centered flex-row'>
                {children}
                <Text className={`${textColor} font-bold mx-2`} style={fonts.families.jostSmall}>{title}</Text>
            </View>
        </Pressable>
    );
}

MenuButton.propTypes = {
    children: PropTypes.node,
    action: PropTypes.func,
    color: PropTypes.string,
    route: PropTypes.string,
    title: PropTypes.string
}

export const SelectButton = ({ children, onPress = () => { }, status = 'unchecked', title, width = 'w-48' }) => {

    const [checked, setChecked] = React.useState(false);

    const handleOnPress = () => {
        setChecked(!checked);
        onPress();
    }

    return (
        <View className='flex flex-row items-center justify-start'>
            <RadioButton color='#3b82f6' onPress={handleOnPress} status={checked ? 'checked' : status} />
            {children}
            <Text className={`text-gray-900 font-semibold capitalize ${width}`} onPress={handleOnPress}>{title}</Text>
        </View>
    );
}

SelectButton.propTypes = {
    children: PropTypes.node,
    onPress: PropTypes.func,
    status: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
    title: PropTypes.string,
    width: PropTypes.string
}

export default () => { }