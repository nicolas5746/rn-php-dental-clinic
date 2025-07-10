import React from 'react';
import { Image, Text, View } from 'react-native';
import { Link } from 'expo-router';
import { UserContext } from '/context/UserContext';

const Cards = () => {

    const { loggedIn } = React.useContext(UserContext);
    const [hover, setHover] = React.useState({ join: false, schedules: false });

    return (
        <View className='mb-4'>
            <View className='flex-centered flex-row w-full'>
                <Link className='w-1/2 mr-1 sm:mr-4' accessibilityLargeContentTitle={loggedIn ? 'My profile' : 'Join us'} href={loggedIn ? '/profile' : '/register'}>
                    <View className='relative w-full h-32 pocket:h-40 sm:h-60 lg:h-96' onMouseEnter={() => setHover({ join: true })} onMouseLeave={() => setHover({ join: false })}>
                        <Image className='rounded-md w-full h-full' source={{ uri: `https://res.cloudinary.com/${process.env.CLOUDINARY_USER}/image/upload/dental_clinic_wan9vf` }} />
                        <View className={`absolute ${hover.join ? 'bg-cyan-500' : 'bg-cyan-600'} opacity-75 rounded-md w-full h-full`}></View>
                        <Text className='absolute text-center text-white text-sm pocket:text-base sm:text-3xl text-shadow-lg/30 font-semibold w-full px-1 top-9/20 -translate-1/2'>{loggedIn ? 'Profile' : 'Join us'}</Text>
                    </View>
                </Link>
                <Link className='w-1/2 ml-1 sm:ml-4' accessibilityLargeContentTitle='Schedule an appointment' href={loggedIn ? '/appointments' : '/login'}>
                    <View className='relative w-full h-32 pocket:h-40 sm:h-60 lg:h-96' onMouseEnter={() => setHover({ schedules: true })} onMouseLeave={() => setHover({ schedules: false })}>
                        <Image className='rounded-md w-full h-full' source={{ uri: `https://res.cloudinary.com/${process.env.CLOUDINARY_USER}/image/upload/appointments_yuafd2` }} />
                        <View className={`absolute ${hover.schedules ? 'bg-blue-500' : 'bg-blue-600'} opacity-75 rounded-md w-full h-full`}></View>
                        <Text className='absolute text-center text-white text-sm pocket:text-base sm:text-3xl text-shadow-lg/30 font-semibold w-full px-1 top-9/20 -translate-1/2'>Appointments</Text>
                    </View>
                </Link>
            </View>
        </View>
    );
}

export default Cards;