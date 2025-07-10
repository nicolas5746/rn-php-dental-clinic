import { StyleSheet } from 'react-native';
import { useFonts } from 'expo-font';
import { Inter_600SemiBold } from '@expo-google-fonts/inter';
import { Jost_600SemiBold } from '@expo-google-fonts/jost';
import { Oswald_700Bold } from '@expo-google-fonts/oswald';
import { Raleway_700Bold } from '@expo-google-fonts/raleway';
import { Ubuntu_700Bold } from '@expo-google-fonts/ubuntu';

const Fonts = () => {

    const [fontsLoaded] = useFonts({ Inter_600SemiBold, Jost_600SemiBold, Oswald_700Bold, Raleway_700Bold, Ubuntu_700Bold });

    const families = StyleSheet.create(fontsLoaded && {
        interSuperLarge: {
            fontFamily: 'Inter_600SemiBold',
            fontSize: 32
        },
        interLarge: {
            fontFamily: 'Inter_600SemiBold',
            fontSize: 24
        },
        interMedium: {
            fontFamily: 'Inter_600SemiBold',
            fontSize: 20
        },
        interSmall: {
            fontFamily: 'Inter_600SemiBold',
            fontSize: 14
        },
        jostLarge: {
            fontFamily: 'Jost_600SemiBold',
            fontSize: 24
        },
        jostSmall: {
            fontFamily: 'Jost_600SemiBold',
            fontSize: 14
        },
        oswaldLarge: {
            fontFamily: 'Oswald_700Bold',
            fontSize: 24
        },
        oswaldSmall: {
            fontFamily: 'Oswald_700Bold',
            fontSize: 16
        },
        ralewayLarge: {
            fontFamily: 'Raleway_700Bold',
            fontSize: 24
        },
        ralewaySmall: {
            fontFamily: 'Raleway_700Bold',
            fontSize: 12
        },
        ubuntuLarge: {
            fontFamily: 'Ubuntu_700Bold',
            fontSize: 24
        },
        ubuntuMedium: {
            fontFamily: 'Ubuntu_700Bold',
            fontSize: 20
        },
        ubuntuSmall: {
            fontFamily: 'Ubuntu_700Bold',
            fontSize: 16
        }
    });

    return { families };
}

export default Fonts;