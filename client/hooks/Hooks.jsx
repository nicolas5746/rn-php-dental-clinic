import React from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useWindowDimensions } from 'react-native';

export const useAsyncStorage = (key, initialValue) => {
    const [store, setStore] = React.useState(initialValue);

    React.useEffect(() => {
        AsyncStorage.getItem(key)
            .then((value) => {
                if (value !== null) setStore(JSON.parse(value));
            })
            .catch((error) => console.error(error));
    }, [key]);

    const setStorage = async (data) => {
        try {
            await AsyncStorage.setItem(key, JSON.stringify(data));
            setStore(data);
        } catch (error) {
            console.error(error);
        }
    }

    const removeItem = async () => {
        try {
            await AsyncStorage.removeItem(key);
            setStore(initialValue);
        } catch (error) {
            console.error(error);
        }
    }

    return [store, setStorage, removeItem];
}

export const useDimensions = () => {
    
    const { fontScale, height, scale, width } = useWindowDimensions();

    return { fontScale, height, scale, width }
}

export default () => { }