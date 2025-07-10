import React from 'react';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import { Text, View } from 'react-native';
import { Link } from 'expo-router';
import { isMobile } from '/utils/utils';
import Fonts from '/app/_fonts';

const Footer = () => {

    const [portfolio, setPortfolio] = React.useState('');
    const [hover, setHover] = React.useState(false);

    const fonts = Fonts(); // Access fonts object
    // Portfolio link
    React.useEffect(() => {
        (async () => {
            const url = 'https://api.npoint.io/0274475edb0f9685ef3d';
            await fetch(url)
                .then((response) => response.json())
                .then((response) => setPortfolio(response.url))
                .catch((error) => console.error(error.message));
        })();
    }, []);

    return (
        <View className={`bg-blue-800 opacity-75 w-full ${isMobile ? 'h-40' : 'h-32'}`}>
            <View className='flex-centered flex-col w-full h-32'>
                <Text className='text-center text-white uppercase w-60 mt-1' style={fonts.families.interLarge}>dental clinic</Text>
                <Link accessibilityLargeContentTitle={portfolio} href={portfolio} target='_blank'>
                    <Text className='text-center text-white underline w-80 mt-1' style={fonts.families.interSmall}>{portfolio}</Text>
                </Link>
                <View className='flex flex-row items-center justify-around w-32 h-8 mt-2'>
                    <Link accessibilityLargeContentTitle='Whatsapp' href='https://www.whatsapp.com/' target='_blank'>
                        <View className='bg-white rounded-md overflow-hidden' style={{ height: 25, width: 25 }}>
                            <FontAwesome5 color='#2fb22f' name='whatsapp-square' size={32} style={{ marginHorizontal: -1, marginVertical: -5 }} />
                        </View>
                    </Link>
                    <Link accessibilityLargeContentTitle='Facebook' href='https://www.facebook.com/' target='_blank'>
                        <View className='bg-white rounded-md overflow-hidden' style={{ height: 25, width: 25 }}>
                            <FontAwesome5 color='#0000ce' name='facebook-square' size={32} style={{ marginHorizontal: -1, marginVertical: -5 }} />
                        </View>
                    </Link>
                    <Link accessibilityLargeContentTitle='Instagram' href='https://www.instagram.com/' target='_blank'>
                        <View className='bg-white rounded-md overflow-hidden' style={{ height: 25, width: 26 }}>
                            <FontAwesome5 color='#ec0075' name='instagram-square' size={32} style={{ marginHorizontal: -1, marginVertical: -5 }} />
                        </View>
                    </Link>
                </View>
            </View>
            <View className='absolute flex items-end right-0'>
                <View className='border-solid border-t-[75px] border-l-[75px] border-x-transparent w-0 h-0'></View>
                <View className='absolute flex-centered top-3 right-1'>
                    <Link
                        accessibilityLargeContentTitle='My Code'
                        href='https://github.com/nicolas5746/rn-php-dental-clinic'
                        onMouseEnter={() => setHover(true)}
                        onMouseLeave={() => setHover(false)}
                        target='_blank'
                    >
                        <View className={`${hover ? 'bg-gray-950' : 'bg-black'} rounded-full overflow-hidden`} style={{ height: 30, width: 30 }}>
                            <FontAwesome5 color='#ffffff' name='github' size={28} style={{ marginHorizontal: 2, marginVertical: -1 }} />
                        </View>
                    </Link>
                </View>
            </View>
        </View>
    );
}

export default Footer;