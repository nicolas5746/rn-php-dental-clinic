import { ScrollView, Text, View } from 'react-native';
import { useDimensions } from '/hooks/Hooks';
import MobileView from '/layouts/MobileView';

const NoConnection = () => {

    const dimensions = useDimensions(); // Screen size values

    return (
        <MobileView>
            <ScrollView showsVerticalScrollIndicator={false}>
                <View className='flex-centered flex-col' style={{ height: dimensions?.height, width: dimensions?.width }}>
                    <Text className='text-center text-gray-800 text-4xl font-black mb-4'>No Internet</Text>
                    <Text className='text-center text-gray-600 text-4xl font-bold'>Connection</Text>
                </View>
            </ScrollView>
        </MobileView>
    );
}

export default NoConnection;