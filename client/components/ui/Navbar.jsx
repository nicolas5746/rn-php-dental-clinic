import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { ActivityIndicator, Image, Pressable, Text, View } from 'react-native';
import { LinkTo } from '/components/Buttons';
import { UserContext } from '/context/UserContext';
import { capitalize, isMobile } from '/utils/utils';
import Fonts from '/app/_fonts';

const Navbar = () => {

    const { loggedIn, toggleMenu, user } = React.useContext(UserContext);
    const [hover, setHover] = React.useState(false);
    const [hideSpinner, setHideSpinner] = React.useState(false);

    const fonts = Fonts(); // Access fonts object

    React.useEffect(() => {
        setHideSpinner(true);
    }, []);

    return (
        <>
            {hideSpinner ?
                loggedIn ?
                    <View className={`flex flex-row items-start justify-between ${!isMobile && 'mt-4 lg:mt-0'} px-2 sm:px-4 py-5`}>
                        <View className='flex flex-row items-center justify-start basis-2/5 mx-8'>
                            <Text className='text-blue-800 mx-4' style={fonts.families.oswaldSmall}>Welcome {capitalize(user?.firstName)}</Text>
                            {user?.profilePicture !== null &&
                                <Image
                                    className='w-8 h-8 me-2 rounded-full'
                                    source={{ uri: user?.profilePicture }}
                                />}
                        </View>
                        <View className='h-14'>
                            <Pressable
                                className='flex items-center w-28 pe-1 md:me-0'
                                onMouseEnter={() => setHover(true)}
                                onMouseLeave={() => setHover(false)}
                                onPress={toggleMenu}
                            >
                                {hover ?
                                    <FontAwesome6 color='#2563eb' name='bars-staggered' size={32} />
                                    :
                                    <FontAwesome color='#3e74e9' name='bars' size={32} />}
                            </Pressable>
                        </View>
                    </View>
                    :
                    <View className={`flex-centered flex-row ${isMobile ? 'my-4' : 'my-8 lg:my-4'}`}>
                        <LinkTo bgColor='bg-blue-500' bgHover='bg-blue-600' route='/register' title='Sign Up' />
                        <LinkTo bgColor='bg-blue-600' bgHover='bg-blue-500' route='/login' title='Sign In' />
                    </View>
                :
                <ActivityIndicator className='flex-centered py-5' color='#3b82f6' size='small' />}
        </>
    );
}

export default Navbar;