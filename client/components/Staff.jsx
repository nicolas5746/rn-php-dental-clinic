import React from 'react';
import { FlatList, Image, Text, View } from 'react-native';
import { UserContext } from '/context/UserContext';
import { useDimensions } from '/hooks/Hooks';
import { isMobile } from '/utils/utils';
import Fonts from '/app/_fonts';

const Staff = () => {

    const { imagesInfo } = React.useContext(UserContext);

    const dimensions = useDimensions(); // Screen size values
    const fonts = Fonts(); // Access fonts object
    // Render font families
    const jostSmall = fonts.families.jostSmall;
    const ralewaySmall = fonts.families.ralewaySmall;

    return (
        <View style={{ height: dimensions?.width >= 768 ? 450 : 1150, width: dimensions?.width - 100}}>
            <Text className='text-center text-cyan-600 font-bold uppercase my-8' style={fonts.families.interLarge}>our staff</Text>
            <View className='flex-centered'>
                <FlatList
                    data={imagesInfo?.profiles}
                    horizontal={dimensions?.width >= 768 ? true : false}
                    initialNumToRender={3}
                    keyExtractor={(item) => item?.id}
                    renderItem={({ item }) => (<View className='flex items-start mx-4 my-2'>
                        <View className={`flex-centered flex-col ${isMobile ? 'mx-6 pocket:mx-12' : 'md:mx-8'}`}>
                            <Image className='rounded-md w-36 md:w-44 lg:w-52 h-60' source={{ uri: item.image }} />
                            <Text className='text-center text-cyan-700 mt-1' style={jostSmall}>{item.name}</Text>
                            <Text className='text-center text-sky-700 w-36 md:w-40 lg:w-48 mt-2' style={ralewaySmall}>Graduated from {item.education}</Text>
                        </View>
                    </View>)}
                    scrollEnabled={false}
                    showsHorizontalScrollIndicator={false}
                    showsVerticalScrollIndicator={false}
                />
            </View>
        </View>
    );
}

export default Staff;