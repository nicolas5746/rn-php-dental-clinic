import React from 'react';
import { Alert, BackHandler } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useNetworkState } from 'expo-network';
import Home from '/screens/Home';
import NoConnection from '/screens/NoConnection';

const Index = () => {

    const [isOffine, setIsOffline] = React.useState(false);
    // Access current network state of the device, including connectivity and type
    const networkState = useNetworkState();
    // Check connectivity
    React.useEffect(() => {
        (networkState.isConnected) ? setIsOffline(false) : (networkState.isConnected !== undefined) && setIsOffline(true);
    }, [networkState.isConnected]);
    // Detect when user press back
    React.useEffect(() => {
        const backAction = () => {
            Alert.alert(
                'Wait', 'Are you sure you want to exit?',
                [
                    { text: 'CANCEL', onPress: () => null, style: 'cancel' },
                    { text: 'YES', onPress: () => BackHandler.exitApp(), style: 'destructive' },
                ],
                { cancelable: true, onDismiss: () => null }
            );
            return true;
        }

        const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

        return () => backHandler.remove();
    }, [BackHandler]);

    return (
        <SafeAreaProvider>
            {isOffine ? <NoConnection /> : <Home />}
        </SafeAreaProvider>
    );
}

export default Index;