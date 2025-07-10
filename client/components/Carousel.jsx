import React from 'react';
import { FlatList, Image, Text, View } from 'react-native';
import { UserContext } from '/context/UserContext';
import { useDimensions } from '/hooks/Hooks';
import { delay } from '/utils/utils';
import Fonts from '/app/_fonts';

const Carousel = () => {

    const flatListRef = React.useRef(); // Reference for the images list
    const { imagesInfo } = React.useContext(UserContext);
    const [slide, setSlide] = React.useState(false);
    const [activeIndex, setActiveIndex] = React.useState(0);

    const dimensions = useDimensions(); // Screen size values
    const fonts = Fonts(); // Access fonts object
    // Render font families
    const interLarge = fonts.families.interLarge;
    const interMedium = fonts.families.interMedium;
    const interSmall = fonts.families.interSmall;
    // Change index
    const scrollToIndex = React.useCallback(() => {
        const lastImageInfo = imagesInfo?.images?.length - 1;

        setActiveIndex(() => {
            if (activeIndex >= lastImageInfo) {
                return 0;
            } else {
                return activeIndex + 1;
            }
        });
        setSlide(false);
        flatListRef?.current?.scrollToIndex({ animated: true, index: (activeIndex === lastImageInfo) ? 0 : activeIndex + 1 });
        // console.log(activeIndex);
    }, [activeIndex, imagesInfo.images]);
    // Infinite slide
    React.useEffect(() => {
        if (!slide) {
            setSlide(true);
            delay(() => scrollToIndex(), 5000); // Change index every 5 seconds
        }
    }, [slide]);

    return (
        <FlatList
            data={imagesInfo?.images}
            getItemLayout={(_, index) => ({ length: dimensions?.width, offset: dimensions?.width * index, index })}
            horizontal
            initialNumToRender={1}
            initialScrollIndex={activeIndex}
            keyExtractor={(item) => item.id}
            ref={flatListRef}
            renderItem={({ item }) => (<View className='my-6' style={{ width: dimensions?.width }}>
                <View className='relative flex-centered w-full h-80 lg:h-96'>
                    <Image className='w-full h-full' source={{ uri: item.image }} />
                    <View className={`absolute ${item.id % 2 === 0 ? 'bg-sky-500' : 'bg-blue-500'} flex-centered opacity-75 h-full`} style={{ width: dimensions?.width }}></View>
                    <View className='absolute flex-centered w-full h-full -left-12'>
                        <Text className='text-center text-white text-sm sm:text-lg lg:text-3xl text-shadow-lg/30 font-semibold -top-4 mb-4 py-1 px-1' style={interLarge}>{item.title.toUpperCase()}</Text>
                        <Text className='text-center text-white text-sm sm:text-xl lg:text-4xl text-shadow-lg/30 leading-6 sm:leading-8 w-1/2 px-1' style={dimensions?.width >= 480 ? interMedium : interSmall}>{item.description}</Text>
                    </View>
                </View>
            </View>)}
            scrollEnabled={false}
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
        />
    );
}

export default Carousel;