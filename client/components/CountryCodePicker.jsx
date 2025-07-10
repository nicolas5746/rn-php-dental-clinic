import React from 'react';
import PropTypes from 'prop-types';
import Ionicons from '@expo/vector-icons/Ionicons';
import { ActivityIndicator, BackHandler, FlatList, Image, Keyboard, Pressable, ScrollView, Text, View } from 'react-native';
import { useNavigation } from 'expo-router';
import { SelectButton } from '/components/Buttons';
import { UserContext } from '/context/UserContext';
import { useDimensions } from '/hooks/Hooks';
import { isMobile, isWeb } from '/utils/utils';
import Input from '/components/Input';
import MobileView from '/layouts/MobileView';

const CountryCodePicker = ({ close = () => { }, open = () => { }, showList }) => {

    const { areaCallingCodes, clearServerResponse, updateUser, user, userValues } = React.useContext(UserContext);
    const [areaInfo, setAreaInfo] = React.useState({ callingCode: '', cca2: '', flag: user?.flag ?? areaCallingCodes[0]?.flag });
    const [filtered, setFiltered] = React.useState('');

    const dimensions = useDimensions(); // Screen size values
    const navigation = useNavigation(); // Access navigation object
    // Select country code and close picker
    const onSelect = (item) => {
        updateUser({ ...userValues, callingCode: item.callingCode, cca2: item.cca2, flag: item.flag });
        close();
    }
    // Store Area Code
    React.useEffect(() => {
        let callingCode = (userValues.hasOwnProperty('callingCode')) ? `(${userValues.callingCode})` : (user.hasOwnProperty('cca2')) && areaCallingCodes.filter((item) => item.cca2 === user.cca2).map((item) => `(${item.callingCode})`);
        let cca2 = (userValues.hasOwnProperty('cca2')) ? userValues.cca2 : (user.hasOwnProperty('cca2')) && user.cca2;
        let flag = (userValues.hasOwnProperty('flag')) ? userValues.flag : (user.hasOwnProperty('cca2')) && areaCallingCodes.filter((item) => item.cca2 === user.cca2).map((item) => item.flag);

        setAreaInfo({ callingCode: Array.isArray(callingCode) ? callingCode[0] : callingCode, cca2: cca2, flag: Array.isArray(flag) ? flag[0] : flag });
    }, [areaCallingCodes, userValues, user.cca2]);
    // Event of back press in mobile-web
    React.useEffect(() => {
        if (showList) {
            if (isMobile && isWeb) {
                const beforeRemove = navigation.addListener('beforeRemove', (event) => {
                    event.preventDefault(); // Prevent default behavior of leaving the screen
                    close();
                });
                return () => navigation.removeListener('beforeRemove', beforeRemove);
            }
        }
    }, [showList]);
    // Events of back press in mobile and 'Esc' key in desktop web
    React.useEffect(() => {
        clearServerResponse();
        const onBackPress = () => {
            close();
            if (showList) {
                return true;
            } else {
                return false;
            }
        }
        const onPressEsc = (event) => {
            const { key } = event;
            if (key === 'Escape') close();
        }
        if (isMobile) {
            const backHandler = BackHandler.addEventListener('hardwareBackPress', onBackPress);
            return () => backHandler.remove();
        } else {
            window.addEventListener('keyup', onPressEsc);
            return () => window.removeEventListener('keyup', onPressEsc);
        }
    }, []);

    return (
        <>
            {showList ?
                areaCallingCodes.length === 0 ?
                    <ActivityIndicator className='flex-centered bg-gray-200 w-full h-screen' color='#3b82f6' size='large' />
                    :
                    <MobileView>
                        <ScrollView className='bg-gray-200' style={{ height: dimensions?.height }}>
                            <View className='mt-2 ml-2'>
                                <Ionicons color='#555555' name='close-sharp' onPress={close} size={24} />
                            </View>
                            <View className='flex-centered'>
                                <View className='flex-centered'>
                                    <Input
                                        autoCapitalize='words'
                                        autoCorrect={true}
                                        borderColor='border-gray-300'
                                        onChangeText={(event) => setFiltered(event.trim())}
                                        onSubmitEditing={() => Keyboard.dismiss()}
                                        placeholder='Enter your country'
                                        width='w-60'
                                    />
                                </View>
                                <View className='w-84 py-8'>
                                    <View className='ml-8'>
                                        <FlatList
                                            data={filtered.length >= 1 ? areaCallingCodes.filter((item) => item.name.toLowerCase().match(filtered.toLowerCase())) : areaCallingCodes}
                                            initialNumToRender={20}
                                            keyExtractor={(item) => item.cca2}
                                            numColumns={1}
                                            renderItem={({ item, index }) => (<View className='flex flex-row items-center justify-start'>
                                                <SelectButton
                                                    onPress={() => onSelect(item)}
                                                    status={userValues.hasOwnProperty('cca2') ? (item.cca2 === userValues.cca2 && 'checked') : (index === 0 && 'checked')}
                                                    title={`(${item.callingCode}) ${item.name}`}
                                                    width='w-60'
                                                >
                                                    <Image className='w-4 h-3 mx-1' source={{ uri: item.flag }} />
                                                </SelectButton>
                                            </View>)}
                                            scrollEnabled={false}
                                        />
                                    </View>
                                </View>
                            </View>
                        </ScrollView>
                    </MobileView>
                :
                <View className='flex-centered flex-row w-auto mr-1'>
                    {areaCallingCodes.length === 0 ?
                        <ActivityIndicator className='scale-[0.5] w-1 mx-12' color='#0061fc' size='small' />
                        :
                        <Pressable className='flex-centered border border-gray-300 rounded-xl w-full h-10' onPress={open}>
                            <View className='flex flex-row items-center'>
                                <Image className='w-3 sm:w-4 h-2 sm:h-3' source={{ uri: areaInfo.flag }} />
                                <Text className='text-xs sm:text-sm font-semibold ml-1'>{areaInfo.callingCode}</Text>
                            </View>
                        </Pressable>}
                </View>}
        </>
    );
}

CountryCodePicker.propTypes = {
    close: PropTypes.func,
    open: PropTypes.func,
    showList: PropTypes.bool
}

export default CountryCodePicker;