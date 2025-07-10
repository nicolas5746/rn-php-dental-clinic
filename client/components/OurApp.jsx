import React from 'react';
import { Image, Text, View } from 'react-native';
import { Link } from 'expo-router';
import Fonts from '/app/_fonts';

const OurApp = () => {

    const [qr, setQr] = React.useState({ apk_link: '', apk_qr: '' });
    const fonts = Fonts(); // Access fonts object

    React.useEffect(() => {
        (async () => {
            const url = 'https://api.npoint.io/2cb9ef8b2be562a4f678';
            await fetch(url)
                .then((response) => response.json())
                .then((response) => setQr({ apk_link: response.app.apk, apk_qr: response.app.apk_qr }))
                .catch((error) => console.error(error.message));
        })();
    }, []);

    return (
        <View className='flex-centered'>
            <Text className='text-center text-sky-600 font-bold uppercase my-4' style={fonts.families.interMedium}>download our app</Text>
            <Image source={{ uri: qr.apk_qr }} style={{ height: 150, width: 150 }} />
            <View className='flex-centered mt-2'>
                <Text className='text-gray-500 font-semibold'>or click this</Text>
                <Link className='text-sky-600 font-bold' accessibilityLargeContentTitle='QR Link' href={qr.apk_link} target='_blank'>Link</Link>
            </View>
        </View>
    );
}

export default OurApp;