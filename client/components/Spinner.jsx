import { ActivityIndicator } from 'react-native';
import { useDimensions } from '/hooks/Hooks';

const Spinner = () => {

    const dimensions = useDimensions(); // Screen size values

    return (
        <ActivityIndicator
            className='flex-centered bg-white'
            color='#3b82f6'
            size='large'
            style={{ height: dimensions?.height, width: dimensions?.width }}
        />
    )
}

export default Spinner;