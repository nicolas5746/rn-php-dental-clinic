import { Slot } from 'expo-router';
import { NativeWindStyleSheet } from 'nativewind';
import UserProvider from '/context/UserContext';

NativeWindStyleSheet.setOutput({ default: 'native' });

const Layout = () => {
    return (
        <UserProvider>
            <Slot />
        </UserProvider>
    );
}

export default Layout;