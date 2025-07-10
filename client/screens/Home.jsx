import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { UserContext } from '/context/UserContext';
import { useDimensions } from '/hooks/Hooks';
import { isWeb } from '/utils/utils';
import Fonts from '/app/_fonts';
import Cards from '/components/Cards';
import Carousel from '/components/Carousel';
import OurApp from '/components/OurApp';
import Spinner from '/components/Spinner';
import Staff from '/components/Staff';
import AppBackground from '/layouts/AppBackground';
import MobileView from '/layouts/MobileView';
import UserMenu from '/layouts/UserMenu';
import Banner from '@ui/Banner';
import Footer from '@ui/Footer';
import Navbar from '@ui/Navbar';

const Home = () => {

  const { clearServerResponse, loading, showMenu, updateUser, userValues } = React.useContext(UserContext);

  const dimensions = useDimensions(); // Screen size values
  const fonts = Fonts(); // Access fonts object

  React.useEffect(() => {
    if (userValues.hasOwnProperty('activationToken') || userValues.hasOwnProperty('emailToken') || userValues.hasOwnProperty('resetToken')) updateUser({});
  }, [userValues]);

  React.useEffect(() => {
    clearServerResponse();
  }, []);

  return (
    <MobileView>
      {loading ?
        <Spinner />
        :
        showMenu ?
          <UserMenu />
          :
          <AppBackground>
            <ScrollView showsVerticalScrollIndicator={false}>
              <View className='flex flex-col min-h-screen'>
                <Banner />
                <Navbar />
                <View className='flex-1'>
                  <Text className='text-center text-sky-600 font-bold uppercase my-4' style={dimensions?.width >= 1024 ? fonts.families.interSuperLarge : fonts.families.interLarge}>dental clinic</Text>
                  <View className='mx-12 mb-8'>
                    <Text className='text-center text-cyan-600 font-medium leading-8' style={dimensions?.width >= 1024 ? fonts.families.ubuntuMedium : fonts.families.ubuntuSmall}>We are open Monday to Friday</Text>
                    <Text className='text-center text-cyan-600 font-medium leading-8' style={dimensions?.width >= 1024 ? fonts.families.ubuntuMedium : fonts.families.ubuntuSmall}>from 10:00 am to 6:00 pm</Text>
                    <Carousel />
                    <View className='mt-2 mb-10'>
                      <Text className='text-center text-cyan-700 font-medium leading-8' style={dimensions?.width >= 1024 ? fonts.families.ubuntuMedium : fonts.families.ubuntuSmall}>We provide all dental needs</Text>
                      <Text className='text-center text-cyan-700 font-medium leading-8 px-2' style={dimensions?.width >= 1024 ? fonts.families.ubuntuMedium : fonts.families.ubuntuSmall}>ensuring every patient receives the highest standard of care.</Text>
                    </View>
                    <Cards />
                    <View className='mt-2 mb-6'>
                      <Text className='text-center text-cyan-700 font-medium leading-8' style={dimensions?.width >= 1024 ? fonts.families.ubuntuMedium : fonts.families.ubuntuSmall}>We have a modern clinic</Text>
                      <Text className='text-center text-cyan-700 font-medium leading-8' style={dimensions?.width >= 1024 ? fonts.families.ubuntuMedium : fonts.families.ubuntuSmall}>with high quality dental care</Text>
                      <Text className='text-center text-cyan-700 font-medium leading-8' style={dimensions?.width >= 1024 ? fonts.families.ubuntuMedium : fonts.families.ubuntuSmall}>and the most professional and experienced team.</Text>
                    </View>
                    <Staff />
                    {isWeb && <OurApp />}
                  </View>
                </View>
                <Footer />
              </View>
            </ScrollView>
          </AppBackground>}
    </MobileView>
  );
}

export default Home;