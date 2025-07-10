import React from 'react';
import PropTypes from 'prop-types';
import { KeyboardAvoidingView, Platform, Text, TextInput } from 'react-native';
import { createElement } from 'react-native-web';
import Fonts from '/app/_fonts';

const Input = ({
    label = '',
    twClass = '',
    autoCapitalize = 'none',
    autoComplete = 'off',
    autoCorrect = false,
    autoFocus = false,
    borderColor = 'border-gray-300',
    defaultValue,
    inputRef,
    keyboardType = 'default',
    onChangeText,
    onSubmitEditing,
    placeholder,
    returnKeyType = 'next',
    secureTextEntry = false,
    textContentType,
    width = 'w-full'
}) => {
    // Label element for web
    const Label = Platform.select({
        web: props => createElement('label', props),
        default: props => React.createElement(Text, props)
    });

    const fonts = Fonts(); // Access fonts object

    const inputId = Math.round(Math.random() * 9999999999).toString(); // Unique id number

    return (
        <>
            {label !== '' && <Label className='text-gray-500 text-sm font-semibold ml-1' htmlFor={inputId} style={fonts.families.ralewaySmall}>{label}</Label>}
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
                <TextInput
                    nativeID={inputId}
                    className={`text-gray-700 border ${borderColor} bg-white rounded-xl h-10 ${width} p-1 ${twClass}`}
                    autoCapitalize={autoCapitalize}
                    autoComplete={autoComplete}
                    autoCorrect={autoCorrect}
                    autoFocus={autoFocus}
                    defaultValue={defaultValue}
                    keyboardType={keyboardType}
                    onChangeText={onChangeText}
                    onSubmitEditing={onSubmitEditing}
                    placeholder={placeholder}
                    placeholderTextColor='#6b7280'
                    ref={inputRef}
                    returnKeyType={returnKeyType}
                    secureTextEntry={secureTextEntry}
                    submitBehavior={returnKeyType === 'go' ? 'blurAndSubmit' : 'submit'}
                    textContentType={textContentType}
                />
            </KeyboardAvoidingView>
        </>
    );
}

Input.propTypes = {
    label: PropTypes.string,
    twClass: PropTypes.string,
    autoCapitalize: PropTypes.string,
    autoComplete: PropTypes.string,
    autoCorrect: PropTypes.bool,
    autoFocus: PropTypes.bool,
    borderColor: PropTypes.string,
    defaultValue: PropTypes.string,
    inputRef: PropTypes.object,
    keyboardType: PropTypes.string,
    onChangeText: PropTypes.func,
    onSubmitEditing: PropTypes.func,
    placeholder: PropTypes.string,
    returnKeyType: PropTypes.string,
    secureTextEntry: PropTypes.bool,
    textContentType: PropTypes.string,
    width: PropTypes.oneOfType([PropTypes.bool, PropTypes.string])
}

export default Input;