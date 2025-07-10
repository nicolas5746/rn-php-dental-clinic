import React from 'react';
import PropTypes from 'prop-types';
import { FlatList } from 'react-native';
import { SelectButton } from '/components/Buttons';
import { UserContext } from '/context/UserContext';

const SelectList = ({ data, numColumns, callback, value, width }) => {

    const { userValues } = React.useContext(UserContext);

    return (<FlatList
        data={data}
        initialNumToRender={1}
        keyExtractor={(_, index) => index}
        numColumns={numColumns}
        renderItem={({ item, index }) => (<SelectButton
            onPress={() => callback(item)}
            status={userValues.hasOwnProperty(value) ? (item === userValues[value] && 'checked') : (index === 0 && 'checked')}
            title={item}
            width={width}
        />)}
        scrollEnabled={false}
    />);
}

SelectList.propTypes = {
    data: PropTypes.array,
    numColumns: PropTypes.number,
    callback: PropTypes.func,
    value: PropTypes.string,
    width: PropTypes.string
}

export default SelectList;