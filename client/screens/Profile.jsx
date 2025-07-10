import React from 'react';
import * as ImagePicker from 'expo-image-picker';
import Feather from '@expo/vector-icons/Feather';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { ActivityIndicator, Image, Keyboard, Pressable, ScrollView, Text, TouchableHighlight, View } from 'react-native';
import { HomeButton } from '/components/Buttons';
import { UserContext } from '/context/UserContext';
import { useDimensions } from '/hooks/Hooks';
import { capitalize, equilizeObjValues, hasKeyword, hasWord, isMobile, isWeb } from '/utils/utils';
import CountryCodePicker from '/components/CountryCodePicker';
import DatePicker from '/components/DatePicker';
import Input from '/components/Input';
import AppBackground from '/layouts/AppBackground';
import Notification from '@ui/Notification';

const Profile = () => {

  const grayBorder = 'border-gray-300';
  const redBorder = 'border-red-500';

  const { areaCallingCodes, clearServerResponse, dateIsInvalid, invalidDate, loading, serverResponse, updateUser, user, userController, userValues } = React.useContext(UserContext);

  const [edit, setEdit] = React.useState(false);
  const [save, setSave] = React.useState(false);
  const [showList, setShowList] = React.useState(false);
  const [chooseImage, setChooseImage] = React.useState(false);
  const [loadingImage, setLoadingImage] = React.useState(false);
  const [borderColor, setBorderColor] = React.useState({ firstName: '', lastName: '', phone: '' });
  const [callingCode, setCallingCode] = React.useState('');
  const [images, setImages] = React.useState({
    default: `https://res.cloudinary.com/${process.env.CLOUDINARY_USER}/image/upload/profile-icon_buepfk`,
    preview: user.profilePicture ?? '',
    profile: ''
  });
  const [newValues, setNewValues] = React.useState({});

  const dimensions = useDimensions(); // Screen size values
  // Upload image to Cloudinary
  const handleUploadImage = async (image) => {
    setLoadingImage(true);
    setChooseImage(false);
    const uploadURL = `https://api.cloudinary.com/v1_1/${process.env.CLOUDINARY_USER}/image/upload`;
    const data = new FormData();
    data.append('file', image);
    data.append('upload_preset', process.env.UPLOAD_PRESET);
    data.append('cloud_name', process.env.CLOUDINARY_USER);

    try {
      const response = await fetch(uploadURL,
        {
          method: 'POST',
          body: data
        }
      );
      const result = await response.json();

      setImages({ ...images, profile: result.secure_url });
      updateUser({ profilePicture: result.secure_url });
    } catch (error) {
      console.error(error);
      setLoadingImage(false);
    }
  }
  // Upload image if is selected from gallery or taken from camera
  const imageIsReady = (result) => {
    // console.log(result.assets[0]);
    const ext = result.assets[0].uri.substring(result.assets[0].uri.lastIndexOf('.') + 1);
    const fileName = result.assets[0].uri.replace(/^.*[\\\/]/, '');

    let image = isMobile ?
      {
        uri: result.assets[0].uri,
        name: fileName,
        type: `image/${ext}`
      }
      : result.assets[0].uri;

    try {
      handleUploadImage(image);
      // console.log(result);
    } catch (error) {
      console.error(error);
      return null;
    }
  }
  // ImagePicker
  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
      base64: true
    });

    if (!result.canceled) imageIsReady(result);
  }
  // Request to open camera
  const openCamera = async () => {
    // Request permission to access the camera
    const permissions = await ImagePicker.requestCameraPermissionsAsync();

    if (permissions.granted === false) {
      (isMobile) ?
        Alert.alert(
          'Wait!', 'You have denied access to your camera',
          { text: 'OK', onPress: () => null, style: 'cancel' },
          { cancelable: true, onDismiss: () => null }
        )
        :
        alert('You have denied access to your camera');
      return;
    }

    const result = await ImagePicker.launchCameraAsync();

    if (!result.canceled) imageIsReady(result);
  }
  // Allow editing
  const handleEdit = () => {
    clearServerResponse();
    setNewValues({});
    setEdit(true);
  }
  // Reset all changes
  const handleClearChanges = () => {
    setNewValues({});
    updateUser({});
    setEdit(false);
    setSave(false);
    dateIsInvalid(false);
  }
  // Change profile
  const handleRequestUpdate = () => {
    userController('CHANGE-PROFILE');
    setSave(true);
  }
  // Make request if there are changes to send
  const handleSaveChanges = () => {
    if (Object.keys(newValues).length > 0 || userValues.cca2 !== undefined && userValues.cca2 !== user.cca2) {
      clearServerResponse();
      if (!invalidDate) handleRequestUpdate();
    } else {
      handleClearChanges();
    }
  }
  // Set calling code
  React.useEffect(() => {
    const matchCode = areaCallingCodes?.filter((item) => item.cca2 === user.cca2).map((item) => item.callingCode);
    setCallingCode(matchCode[0]);
  }, [areaCallingCodes, user.cca2]);
  // Set image preview
  React.useEffect(() => {
    setImages({ ...images, preview: user.profilePicture === null || user.profilePicture === '' ? images.default : user.profilePicture });
  }, [user.profilePicture]);
  // Request update profile image
  React.useEffect(() => {
    if (images.profile !== '') userController('CHANGE-PROFILE');
  }, [images.profile]);
  // Clean unnecessary user keys
  React.useEffect(() => {
    const dateIsSelected = newValues.hasOwnProperty('birthDate');
    const dateIsNotValid = newValues.birthDate == 'Invalid Date';

    dateIsNotValid ? dateIsInvalid(true) : dateIsInvalid(false);

    updateUser({ ...userValues, ...newValues });

    if (newValues.firstName === user.firstName) {
      setNewValues(current => {
        const { firstName, ...rest } = current;
        return rest;
      });
    }
    if (newValues.lastName === user.lastName) {
      setNewValues(current => {
        const { lastName, ...rest } = current;
        return rest;
      });
    }
    if (newValues.phone === user.phone) {
      setNewValues(current => {
        const { phone, ...rest } = current;
        return rest;
      });
    }
    if (dateIsSelected && dateIsNotValid) {
      updateUser(current => {
        const { birthDate, ...rest } = current;
        return rest;
      });
    } else if (dateIsSelected && new Date(newValues.birthDate).toISOString().split('T')[0] === new Date(user.birthDate).toISOString().split('T')[0]) {
      setNewValues(current => {
        const { birthDate, ...rest } = current;
        return rest;
      });
      updateUser(current => {
        const { birthDate, ...rest } = current;
        return rest;
      });
    }
  }, [newValues, newValues.birthDate, newValues.firstName, newValues.lastName, newValues.phone, user.birthDate, user.firstName, user.lastName, user.phone]);
  // Clean up if profile is updated
  React.useEffect(() => {
    const keywords = ['first', 'last', 'phone'];
    if (save) {
      if (hasWord(serverResponse, 'updated')) {
        handleClearChanges();
      } else if (hasKeyword(keywords, serverResponse) || invalidDate) {
        setEdit(true);
        setSave(false);
      }
    }
  }, [invalidDate, serverResponse, save]);
  // Change input's border colors
  React.useEffect(() => {
    if (hasWord(serverResponse, 'updated')) {
      equilizeObjValues(borderColor, setBorderColor, grayBorder);
      setLoadingImage(false);
    } else if (hasWord(serverResponse, 'first')) {
      setBorderColor({ firstName: redBorder });
    } else if (hasWord(serverResponse, 'last')) {
      setBorderColor({ lastName: redBorder });
    } else if (hasWord(serverResponse, 'phone')) {
      setBorderColor({ phone: redBorder });
    } else {
      equilizeObjValues(borderColor, setBorderColor, grayBorder);
    }
  }, [serverResponse]);

  React.useEffect(() => {
    clearServerResponse();
    updateUser({});
  }, []);

  return (
    <>
      {showList && <CountryCodePicker close={() => setShowList(false)} showList={showList} />}
      <ScrollView className={showList && 'hidden'} keyboardShouldPersistTaps='never' showsVerticalScrollIndicator={false}>
        <AppBackground>
          <HomeButton />
          <View className='flex-centered'>
            <Pressable
              className='flex-centered w-60 xs:w-96 sm:w-125 h-screen'
              onPress={() => setChooseImage(false)}
              style={[
                isMobile ?
                  { transform: dimensions?.width >= 360 ? 'scale(1)' : 'scale(0.8)' }
                  :
                  { transform: dimensions?.height <= 480 ? 'scale(0.6)' : dimensions?.height <= 640 ? 'scale(0.7)' : dimensions?.height <= 768 ? 'scale(0.8)' : 'scale(1)' },
                { cursor: 'default' }
              ]}
            >
              <View className='flex-centered flex-col bg-white border border-gray-300 rounded-3xl p-5 sm:p-8'>
                {loadingImage ?
                  <ActivityIndicator className='flex-centered bg-gray-100 rounded-full w-64 h-64' color='#3b82f6' size='small' />
                  :
                  <Image className='w-36 pocket:w-64 h-36 pocket:h-64 rounded-full mt-4' source={{ uri: images.preview === '' ? images.default : images.preview }} />}
                <View className='flex-centered my-2'>
                  {!edit &&
                    (chooseImage ?
                      <View className='flex-centered flex-row h-11 mt-2 gap-x-8 gap-y-2'>
                        <Pressable className='cursor-pointer' onPress={openCamera}>
                          <Feather color='black' name='camera' size={20} />
                        </Pressable>
                        <Pressable className='cursor-pointer' onPress={pickImage}>
                          <FontAwesome color='black' name='photo' size={20} />
                        </Pressable>
                      </View>
                      :
                      <TouchableHighlight className='flex-centered cursor-pointer mt-1' onPress={isMobile ? () => setChooseImage(true) : pickImage}>
                        <Image
                          className='w-8 h-8'
                          accessibilityLargeContentTitle='Change your profile picture'
                          source={{ uri: `https://res.cloudinary.com/${process.env.CLOUDINARY_USER}/image/upload/change-picture_ebdydr` }}
                        />
                      </TouchableHighlight>)}
                </View>
                <View className={`flex flex-col w-80 sm:w-100 ${edit && isMobile ? 'mt-2.5 pocket:mt-5' : 'mt-0.5'}`}>
                  {/* Register Date */}
                  {!edit &&
                    <View className='flex flex-row items-baseline justify-center mb-1 gap-1'>
                      <Text className='profile-category basis-1/2'>Registered:</Text>
                      <Text className='profile-info my-1 basis-1/2'>{user.registered}</Text>
                    </View>}
                  {/* First Name */}
                  <View className={`flex flex-row items-baseline justify-center ${edit ? `${isMobile && !isWeb && 'right-12'} my-2 gap-2` : 'my-1 gap-1'}`}>
                    <View className={edit ? 'basis-1/3' : 'basis-1/2'}>
                      <Text className='profile-category'>First Name:</Text>
                    </View>
                    <View className={edit ? 'basis-3/5' : 'basis-1/2'}>
                      {edit ?
                        <Input
                          autoCapitalize='words'
                          autoComplete='name'
                          autoCorrect={true}
                          borderColor={borderColor.firstName}
                          defaultValue={capitalize(user.firstName)}
                          onChangeText={(event) => setNewValues({ ...newValues, firstName: capitalize(event.trim()) })}
                          onSubmitEditing={() => Keyboard.dismiss()}
                          placeholder={capitalize(user.firstName)}
                          textContentType='name'
                          width={isMobile && 'w-48'}
                        />
                        :
                        <Text className='profile-info my-1'>{capitalize(user.firstName)}</Text>}
                    </View>
                  </View>
                  {/* Last Name */}
                  <View className={`flex flex-row items-baseline justify-center ${edit ? `${isMobile && !isWeb && 'right-12'} my-2 gap-2` : 'my-1 gap-1'}`}>
                    <View className={edit ? 'basis-1/3' : 'basis-1/2'}>
                      <Text className='profile-category'>Last Name:</Text>
                    </View>
                    <View className={edit ? 'basis-3/5' : 'basis-1/2'}>
                      {edit ?
                        <Input
                          autoCapitalize='words'
                          autoComplete='name'
                          autoCorrect={true}
                          borderColor={borderColor.lastName}
                          defaultValue={capitalize(user.lastName)}
                          onChangeText={(event) => setNewValues({ ...newValues, lastName: capitalize(event.trim()) })}
                          onSubmitEditing={() => Keyboard.dismiss()}
                          placeholder={capitalize(user.lastName)}
                          textContentType='name'
                          width={isMobile && 'w-48'}
                        />
                        :
                        <Text className='profile-info my-1'>{capitalize(user.lastName)}</Text>}
                    </View>
                  </View>
                  {/* Phone */}
                  <View className={`flex flex-row items-baseline justify-center ${edit ? `${isMobile && !isWeb ? 'right-12 my-6' : 'my-2'} gap-2` : 'my-1 gap-1'}`}>
                    <View className={edit ? 'basis-[35%]' : 'basis-1/2'}>
                      <Text className='profile-category'>Phone:</Text>
                    </View>
                    <View className={`${edit ? `${isMobile && 'left-4'} basis-[62%]` : 'basis-1/2'}`}>
                      {edit ?
                        <View className='flex flex-row items-center justify-center w-full gap-1'>
                          <View className={`flex flex-col ${isMobile ? 'basis-1/2' : 'basis-1/3'}`}>
                            <CountryCodePicker open={() => setShowList(true)} showList={showList} />
                          </View>
                          <View className={`flex flex-col ${isMobile ? 'basis-2/3' : 'basis-3/5'}`}>
                            <Input
                              autoComplete='tel'
                              borderColor={borderColor.phone}
                              defaultValue={user.phone}
                              keyboardType='phone-pad'
                              onChangeText={(event) => setNewValues({ ...newValues, phone: event.trim() })}
                              onSubmitEditing={() => Keyboard.dismiss()}
                              placeholder={user.phone}
                              textContentType='telephoneNumber'
                              width='w-auto'
                            />
                          </View>
                        </View>
                        :
                        <View className={`flex flex-row items-center`}>
                          {callingCode === undefined ?
                            <ActivityIndicator className='scale-[0.5] w-1 mx-2' color='#0061fc' size='small' />
                            :
                            <Text className='profile-info my-1'>{`${callingCode} ${user.phone}`}</Text>}
                        </View>}
                    </View>
                  </View>
                  {/* Age */}
                  <View className={`flex flex-row items-baseline justify-center ${edit ? `${isMobile && !isWeb && 'right-12'} my-2 gap-2` : 'my-1 gap-1'}`}>
                    <View className={edit ? 'basis-1/3' : 'basis-1/2'}>
                      <Text className='profile-category'>{edit ? 'Date of birth:' : 'Age:'}</Text>
                    </View>
                    <View className={edit ? 'basis-3/5' : 'basis-1/2'}>
                      {edit ?
                        <View className={isMobile ? 'w-48' : 'w-full'}>
                          <DatePicker
                            defaultDate={new Date(user.birthDate)}
                            endYear={new Date().getFullYear()}
                            onChange={(date) => setNewValues({ ...newValues, birthDate: date })}
                            startYear={new Date().getFullYear() - 100}
                          />
                        </View>
                        :
                        <Text className='profile-info my-1'>{user.age}</Text>}
                    </View>
                  </View>
                  {/* Buttons */}
                  <View className='flex-centered flex-col'>
                    {edit ?
                      <>
                        {loading ?
                          <ActivityIndicator className='flex-centered mt-8 mb-5' color='#3b82f6' size='small' />
                          :
                          <>
                            <View className='flex flex-row mt-3'>
                              <Pressable onPress={handleSaveChanges}>
                                <Text className='profile-button m-2'>Save</Text>
                              </Pressable>
                              <Pressable onPress={handleClearChanges}>
                                <Text className='profile-button m-2'>Cancel</Text>
                              </Pressable>
                            </View>
                            <View className='h-6 my-1'>
                              {((newValues.hasOwnProperty('firstName') && newValues.firstName === '') || (newValues.hasOwnProperty('lastName') && newValues.lastName === '') || (newValues.hasOwnProperty('phone') && newValues.phone === '')) ?
                                <Notification color='red' icon='circle-xmark' response={`Can't be empty`} />
                                :
                                serverResponse !== '' && serverResponse !== 'Profile updated' && <Notification color='red' icon='circle-xmark' response={invalidDate ? 'Invalid Date' : serverResponse} />}
                            </View>
                          </>}
                      </>
                      :
                      <>
                        <Pressable onPress={handleEdit}>
                          <Text className='profile-button my-3'>Edit</Text>
                        </Pressable>
                        <View className='h-6 mb-1'>
                          {serverResponse === 'Profile updated' && <Notification color='green' icon='circle-check' response={serverResponse} />}
                        </View>
                      </>}
                  </View>
                </View>
              </View>
            </Pressable>
          </View>
        </AppBackground>
      </ScrollView>
    </>
  );
}

export default Profile;