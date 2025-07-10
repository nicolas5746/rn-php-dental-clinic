import React from 'react';
import AntDesign from '@expo/vector-icons/AntDesign';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import Fontisto from '@expo/vector-icons/Fontisto';
import Ionicons from '@expo/vector-icons/Ionicons';
import { View } from 'react-native';
import { BackButton, MenuButton } from '/components/Buttons';
import { UserContext } from '/context/UserContext';

const UserMenu = () => {

    const { hideMenu, userController } = React.useContext(UserContext);

    return (
        <View className='flex-centered bg-gray-200 h-screen'>
            <View className='flex flex-row items-center -ml-14'>
                <BackButton onPress={hideMenu} />
                <View className='items-start'>
                    <MenuButton route='/profile' title='My Profile'>
                        <FontAwesome5 color='#2563eb' name='address-card' size={24} style={{ marginInline: '3px' }} />
                    </MenuButton>
                    <MenuButton route='/appointments' title='My Appointments'>
                        <Fontisto color='#2563eb' name='date' size={24} style={{ marginInline: '3px' }} />
                    </MenuButton>
                    <MenuButton route='/settings' title='My Settings'>
                        <Ionicons color='#2563eb' name='settings-outline' size={24} style={{ marginInline: '3px' }} />
                    </MenuButton>
                    <MenuButton action={() => userController('LOGOUT')} route='/' title='Logout'>
                        <AntDesign color='#2563eb' name='logout' size={24} style={{ marginInline: '3px', transform: 'scaleX(-1)' }} />
                    </MenuButton>
                </View>
            </View>
        </View>
    );
}

export default UserMenu;