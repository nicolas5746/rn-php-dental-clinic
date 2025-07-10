import { Platform } from 'react-native';
// Uppercase every first letter
export const capitalize = (str) => {
    return str?.replace(/(^\w|\s\w)(\S*)/g, (_, m1, m2) => m1.toUpperCase() + m2.toLowerCase());
}
// Creates a date with current day and month, and optionally choosing year
export const dateCreator = (date, years = 0) => {
    return new Date(
        date.getFullYear() + years,
        date.getMonth(),
        Math.min(date.getDate(), new Date(date.getFullYear() + years, date.getMonth() + 1, 0).getDate())
    );
}
// Delay a function for 'X' miliseconds
export const delay = (action, ms) => {
    return setTimeout(action, ms);
}
// Set all keys to the same value
export const equilizeObjValues = (value, store, newValue = '') => {
    let currentValues = {};
    return Object.keys(value).forEach((key) => {
        currentValues[key] = newValue;
        store(currentValues);
    });
}
// Check if array values has at least one string that matches
export const hasKeyword = (keywords, str) => {
    return keywords.some((keyword) => str.toLowerCase().includes(keyword)) ? true : false;
}
// Check if string includes a word
export const hasWord = (str, word) => {
    return str.toLowerCase().includes(word) ? true : false;
}
// Check if is mobile device
export const isMobile = (Platform.OS === 'android' || Platform.OS === 'ios' || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) ? true : false;
// Check if is open in web
export const isWeb = (Platform.OS === 'web') ? true : false;
// Check if the value of every key of an object is equal
export const objValuesAreEqual = (obj, value) => {
    return (Object.keys(obj).every((key) => obj[key] === value)) ? true : false;
}
// Sort an array alphabetically
export const sortAlphabetically = (data) => {
    return data?.sort((a, b) => {
        if (a.name < b.name) return -1;
        if (a.name > b.name) return 1;
        return 0;
    });
}

export default () => { }