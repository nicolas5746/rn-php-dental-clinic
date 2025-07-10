import React from 'react';
import { Image } from 'react-native';

const Banner = () => {

    return (
        <Image
            className='w-full h-40 xs:h-48 sm:h-60 lg:h-96 xxl:h-125'
            source={{ uri: `https://res.cloudinary.com/${process.env.CLOUDINARY_USER}/image/upload/banner_djtoit` }}
        />
    );
}

export default Banner;