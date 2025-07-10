import React from 'react';
import PropTypes from 'prop-types';
import { DatePickerInput, enGB, registerTranslation } from 'react-native-paper-dates';
import { UserContext } from '/context/UserContext';
import { hasWord, isMobile } from '/utils/utils';

const DatePicker = ({ id = Math.round(Math.random() * 9999999999).toString(), defaultDate, endYear, onChange = null, startYear }) => {

    const { invalidDate, serverResponse, userValues } = React.useContext(UserContext);
    const [borderColor, setBorderColor] = React.useState('border-gray-300');
    const [date, setDate] = React.useState(new Date(defaultDate));

    registerTranslation('en-GB', enGB); // Support for languages

    React.useEffect(() => {
        if (userValues.hasOwnProperty('birthDate')) setDate(userValues.birthDate);
        if (userValues.hasOwnProperty('apptDate')) setDate(userValues.apptDate);
    }, [userValues, userValues.birthDate, userValues.apptDate]);

    React.useEffect(() => {
        (hasWord(serverResponse, '18 years') || hasWord(serverResponse, 'real age') || invalidDate) ?
            setBorderColor('border-red-500') : setBorderColor('border-gray-300');
    }, [invalidDate, serverResponse]);

    return (
        <DatePickerInput
            nativeID={id}
            animationType={isMobile ? 'slide' : 'fade'}
            className={`bg-white border ${borderColor} rounded-lg h-8 py-1`}
            endYear={endYear}
            iconColor='#3b82f6'
            inputMode='start'
            label=''
            locale='en-GB'
            mode='flat'
            onChange={onChange === null ? setDate : onChange}
            presentationStyle='overFullScreen'
            saveLabel={isMobile ? '💾' : 'Save'}
            startYear={startYear}
            value={date}
            withDateFormatInLabel={false}
        />
    );
}

DatePicker.propTypes = {
    id: PropTypes.string,
    defaultDate: PropTypes.instanceOf(Date),
    endYear: PropTypes.number,
    onChange: PropTypes.func,
    startYear: PropTypes.number
}

export default DatePicker;