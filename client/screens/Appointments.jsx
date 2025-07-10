import React from 'react';
import AntDesign from '@expo/vector-icons/AntDesign';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import Ionicons from '@expo/vector-icons/Ionicons';
import { ActivityIndicator, FlatList, Pressable, ScrollView, Text, TouchableHighlight, View } from 'react-native';
import { HomeButton } from '/components/Buttons';
import { UserContext } from '/context/UserContext';
import { useDimensions } from '/hooks/Hooks';
import { delay, equilizeObjValues, hasKeyword, hasWord, isMobile, objValuesAreEqual } from '/utils/utils';
import DatePicker from '/components/DatePicker';
import SelectList from '/components/SelectList';
import AppBackground from '/layouts/AppBackground';
import Notification from '@ui/Notification';

const Appointments = () => {

    const grayBorder = 'border-gray-300';
    const redBorder = 'border-red-500';

    const { appointments, dateIsInvalid, loading, serverResponse, updateUser, userController, userValues } = React.useContext(UserContext);
    const [addAppt, setAddAppt] = React.useState(false);
    const [showSpinner, setShowSpinner] = React.useState(true);
    const [selection, setSelection] = React.useState({ type: false, time: false });
    const [submit, setSubmit] = React.useState({ book: false, cancel: false });
    const [availableHours, setAvailableHours] = React.useState([]);
    const [borderColor, setBorderColor] = React.useState({ type: grayBorder, time: grayBorder });
    const [apptId, setApptId] = React.useState('');

    const dimensions = useDimensions(); // Screen size values
    // Keywords
    const invalidDatesKeywords = ['monday and friday', 'already passed', 'closed'];
    const badResponseKeywords = ['choose', 'taken', 'already passed', 'closed'];

    const onPress = () => {
        if (addAppt) {
            userController('ADD APPOINTMENT');
        } else {
            equilizeObjValues(borderColor, setBorderColor, grayBorder);
            setAddAppt(true);
            setApptId('');
            setSubmit({ book: false, cancel: false });
            updateUser({ apptDate: new Date() });
        }
    }

    const onSelectType = (type) => {
        updateUser({ ...userValues, apptType: type });
        setSelection({ type: false, time: false });
    }

    const onSelectTime = (time) => {
        updateUser({ ...userValues, apptTime: time });
        setSelection({ type: false, time: false });
    }

    const close = () => {
        if (objValuesAreEqual(selection, false)) {
            setAddAppt(false);
            userController('GET APPOINTMENTS');
        }
        setSelection({ type: false, time: false });
    }

    React.useEffect(() => {
        userController('GET APPOINTMENTS');
    }, []);
    // Change selection border color
    React.useEffect(() => {
        if (userValues.hasOwnProperty('apptType')) setBorderColor({ ...borderColor, type: grayBorder });
        if (userValues.hasOwnProperty('apptTime')) setBorderColor({ ...borderColor, time: grayBorder });
        if (userValues.hasOwnProperty('apptId')) delay(() => {
            userController('CANCEL APPOINTMENT');
            setApptId('');
        }, 1500);
    }, [userValues]);

    React.useEffect(() => {
        (serverResponse === '' || hasWord(serverResponse, 'canceled')) ? setShowSpinner(true) : setShowSpinner(false);
        if (hasKeyword(invalidDatesKeywords, serverResponse)) {
            setAvailableHours([]);
            dateIsInvalid(true);
            updateUser((current) => {
                const { apptTime, ...rest } = current;
                return rest;
            });
        } else {
            dateIsInvalid(false);
            setAvailableHours(appointments?.hours);
        }
        if (hasWord(serverResponse, 'canceled')) {
            setSubmit({ book: false, cancel: true });
            userController('GET APPOINTMENTS');
            updateUser((current) => {
                const { apptId, ...rest } = current;
                return rest;
            });
        }
        if (hasWord(serverResponse, 'booked')) {
            setAddAppt(false);
            setSelection({ type: false, time: false });
            setSubmit({ book: true, cancel: false });
            userController('GET APPOINTMENTS');
            updateUser({});
        } else if (hasWord(serverResponse, 'type')) {
            setBorderColor({ type: redBorder, time: grayBorder });
        } else if (hasWord(serverResponse, 'time')) {
            setBorderColor({ type: grayBorder, time: redBorder });
        }
    }, [appointments.hours, serverResponse]);

    return (
        <>
            <ScrollView showsVerticalScrollIndicator={false}>
                <AppBackground>
                    <HomeButton />
                    <View className='flex-centered'>
                        <View className='flex-centered w-11/12 sm:w-125 h-screen' style={{ transform: dimensions?.width >= 360 ? 'scale(1)' : 'scale(0.8)' }}>
                            <Pressable onPress={() => setApptId('')} style={{ cursor: 'default' }}>
                                {addAppt &&
                                    <View className='left-3 top-24 pocket:top-20 w-6 z-50' accessibilityLargeContentTitle='Close'>
                                        <Ionicons color='#555555' name='close-sharp' onPress={close} size={24} />
                                    </View>}
                                <View className='flex flex-col items-center justify-around bg-white border border-gray-300 rounded-3xl w-80 xs:w-96 sm:w-150 h-100 xs:h-125 sm:h-150 mt-14 pocket:mt-10 p-5 sm:p-8'>
                                    <Text className={`text-center text-gray-800 text-3xl font-bold ${isMobile && selection.type && 'top-6'}`}>
                                        {selection.type ? 'Appointment types' : selection.time ? 'Available hours' : addAppt ? 'Add a new appointment' : 'My Appointments'}
                                    </Text>
                                    {selection.type ?
                                        <View className={`flex-centered ${isMobile && 'top-10 xs:top-0'}`}>
                                            <SelectList
                                                data={appointments.types}
                                                numColumns={1}
                                                callback={onSelectType}
                                                value='apptType'
                                                width='w-24'
                                            />
                                        </View>
                                        :
                                        selection.time ?
                                            <View className='flex-centered w-full'>
                                                {showSpinner ?
                                                    <ActivityIndicator className='flex-centered bg-white w-64 h-64' color='#3b82f6' size='small' />
                                                    :
                                                    hasKeyword(invalidDatesKeywords, serverResponse) ?
                                                        <Text className='text-center font-semibold'>{serverResponse}</Text>
                                                        :
                                                        <SelectList
                                                            data={availableHours}
                                                            numColumns={3}
                                                            callback={onSelectTime}
                                                            value='apptTime'
                                                            width='w-16'
                                                        />}
                                            </View>
                                            :
                                            addAppt ?
                                                <View className='flex flex-col'>
                                                    <Pressable className={`flex-centered border ${borderColor.type} rounded-2xl mb-2 py-2`} onPress={() => setSelection({ type: true, time: false })}>
                                                        <Text className={userValues.hasOwnProperty('apptType') && 'font-semibold capitalize'}>{userValues.hasOwnProperty('apptType') ? userValues.apptType : 'Choose your appt. type'}</Text>
                                                    </Pressable>
                                                    <View className={`${isMobile ? 'w-48 pocket:w-52 h-8' : 'w-44 sm:w-60 h-16'}`}>
                                                        <DatePicker
                                                            defaultDate={new Date()}
                                                            endYear={new Date().getFullYear() + 1}
                                                            onChange={(date) => updateUser({ ...userValues, apptDate: date })}
                                                            startYear={new Date().getFullYear()}
                                                        />
                                                    </View>
                                                    <Pressable
                                                        className={`flex-centered border ${borderColor.time} rounded-2xl mt-2 py-2`}
                                                        onPress={() => {
                                                            userController('CHECK AVAILABILITY');
                                                            setSelection({ type: false, time: true });
                                                        }}
                                                    >
                                                        <Text className={userValues.hasOwnProperty('apptTime') && 'font-semibold'}>{userValues.hasOwnProperty('apptTime') ? userValues.apptTime : 'Pick an hour'}</Text>
                                                    </Pressable>
                                                </View>
                                                :
                                                showSpinner ?
                                                    <ActivityIndicator className='flex-centered bg-white w-64 h-64' color='#3b82f6' size='small' />
                                                    :
                                                    hasWord(serverResponse, 'loaded') && appointments.scheduled?.length > 0 ?
                                                        <View className={`${dimensions?.width <= 480 ? 'scale-[0.8]' : 'scale-none'} ${isMobile && 'w-96'}`}>
                                                            <ScrollView className={`${appointments.scheduled?.length > 5 && 'h-44'}`}>
                                                                <View className='flex-centered flex-row'>
                                                                    <View className='border border-gray-800'>
                                                                        <View className='flex flex-row h-6 mb-px'>
                                                                            <Text className='appt-category-200 w-8'>N°</Text>
                                                                            <Text className='appt-category-100 w-36'>Appointment Type</Text>
                                                                            <Text className={`appt-category-200 ${isMobile ? 'w-24' : 'w-20'}`}>Date</Text>
                                                                            <Text className='appt-category-100 w-12'>Hour</Text>
                                                                        </View>
                                                                        <FlatList
                                                                            data={appointments?.scheduled}
                                                                            initialNumToRender={5}
                                                                            keyExtractor={(item) => item.appt_id}
                                                                            numColumns={1}
                                                                            renderItem={({ item, index }) => (<View className={`flex-row h-7 ${userValues.apptId === item.appt_id && 'bg-gray-200'}`}>
                                                                                <View className='border border-gray-300 w-8'>
                                                                                    <Text className={`text-center font-semibold ${userValues.apptId === item.appt_id && 'text-red-500 line-through'} py-1`}>{index + 1}</Text>
                                                                                </View>
                                                                                <View className='border border-gray-300 w-36'>
                                                                                    <Text className={`text-center font-semibold capitalize ${userValues.apptId === item.appt_id && 'text-red-500 line-through'} py-1`}>{item.appt_type}</Text>
                                                                                </View>
                                                                                <View className={`border border-gray-300 ${isMobile ? 'w-24' : 'w-20'}`}>
                                                                                    <Text className={`text-center font-semibold ${userValues.apptId === item.appt_id && 'text-red-500 line-through'} py-1`}>{item.appt_date.split('/').reverse().join('/')}</Text>
                                                                                </View>
                                                                                <View className='border border-gray-300 w-12'>
                                                                                    <Text className={`text-center font-semibold ${userValues.apptId === item.appt_id && 'text-red-500 line-through'} py-1`}>{item.appt_time}</Text>
                                                                                </View>
                                                                            </View>)}
                                                                            scrollEnabled={false}
                                                                        />
                                                                    </View>
                                                                    <View className='flex flex-col'>
                                                                        <View className='w-6 h-7 mr-1 sm:mx-1'></View>
                                                                        <View className='flex-centered w-6 mr-1 sm:mx-1'>
                                                                            <FlatList
                                                                                data={appointments?.scheduled}
                                                                                initialNumToRender={5}
                                                                                keyExtractor={(item) => item.appt_id}
                                                                                renderItem={({ item }) => (<>
                                                                                    {item.cancelation === 0 ?
                                                                                        apptId === item.appt_id ?
                                                                                            <Pressable className='h-7' onPress={() => updateUser({ apptId: item.appt_id })}>
                                                                                                <FontAwesome5 color='#555555' name='trash' size={20} />
                                                                                            </Pressable>
                                                                                            :
                                                                                            <Pressable className='h-7' onPress={() => setApptId(item.appt_id)}>
                                                                                                <AntDesign color='#555555' name='edit' size={20} />
                                                                                            </Pressable>
                                                                                        :
                                                                                        <View className='h-7'></View>}
                                                                                </>)}
                                                                                scrollEnabled={false}
                                                                            />
                                                                        </View>
                                                                    </View>
                                                                </View>
                                                            </ScrollView>
                                                        </View>
                                                        :
                                                        hasWord(serverResponse, 'scheduled') &&
                                                        <Text className='text-center font-semibold'>{serverResponse}</Text>}
                                    <View className='flex-centered mt-4'>
                                        {objValuesAreEqual(selection, false) &&
                                            <TouchableHighlight className='bg-blue-600 rounded w-32 h-8 p-1' underlayColor='#2563eb' {...(!loading && { onPress: onPress })}>
                                                <Text className={`text-center text-white font-semibold leading-5 ${addAppt && loading && 'mt-0.5'}`}>
                                                    {!addAppt ? 'Add new' : loading ? <ActivityIndicator color='#ffffff' size='small' /> : 'Book'}
                                                </Text>
                                            </TouchableHighlight>}
                                    </View>
                                    <View className='h-8'>
                                        {addAppt ?
                                            hasKeyword(badResponseKeywords, serverResponse) && objValuesAreEqual(selection, false) &&
                                            <Notification color='red' icon='circle-xmark' response={serverResponse} />
                                            :
                                            <View className='mt-3'>
                                                {submit.book ?
                                                    <Notification color='green' icon='circle-check' response='Booked successfully' />
                                                    :
                                                    submit.cancel &&
                                                    <Notification color='blue' icon='circle-check' response='Your appointment has been canceled' />}
                                            </View>}
                                    </View>
                                </View>
                            </Pressable>
                        </View>
                    </View>
                </AppBackground>
            </ScrollView>
        </>
    );
}

export default Appointments;