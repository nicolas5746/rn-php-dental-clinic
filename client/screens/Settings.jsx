import React from 'react';
import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Text, View } from 'react-native';
import { router } from 'expo-router';
import { BackButton, MenuButton } from '/components/Buttons';
import { UserContext } from '/context/UserContext';
import { isMobile } from '/utils/utils';

const Settings = () => {

    const { toggleMenu } = React.useContext(UserContext);

    const onPress = () => {
        toggleMenu();
        router.navigate('/');
    }

    return (
        <View className={`flex-centered bg-gray-200 ${isMobile && 'w-screen'} h-screen`}>
            <View className='flex flex-row items-center -ml-10'>
                <BackButton onPress={onPress} />
                <View className='items-start'>
                    <MenuButton route='/settings/change-email' title='Change your e-mail'>
                        <MaterialCommunityIcons color='#2563eb' name='email-outline' size={24} style={{ marginInline: '3px' }} />
                    </MenuButton>
                    <MenuButton route='/settings/change-password' title='Change your password'>
                        <MaterialIcons color='#2563eb' name='password' size={24} style={{ marginInline: '3px' }} />
                    </MenuButton>
                    <View className='flex flex-col border border-red-600 rounded-md w-48 h-10 mt-2'>
                        <Text className='bg-gray-200 text-center text-xs text-red-600 font-bold scale-[0.8] -top-2 w-24'>Danger Zone</Text>
                        <View className='flex items-center -top-4'>
                            <MenuButton route='/account/disable' color='red' title='Disable your account'>
                                <AntDesign color='#ef4444' name='warning' size={20} />
                            </MenuButton>
                        </View>
                    </View>
                </View>
            </View>
        </View>
    );
}

export default Settings;