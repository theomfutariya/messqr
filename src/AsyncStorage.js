import AsyncStorage from '@react-native-async-storage/async-storage';

const storeItem = async (key, value) => {
  try {
    const jsonValue = JSON.stringify(value);
    // console.log('StoreItem called AsyncStorage:', jsonValue);
    await AsyncStorage.setItem(key, jsonValue);
  } catch (e) {
    console.log('Error storing in async storage', e);
  }
};

const getItemByKey = async key => {
  console.log('In get item working or not');
  try {
    const jsonValue = await AsyncStorage.getItem(key);
    console.log('Getting Item: ', jsonValue);
    return jsonValue !== null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    console.log('Error reading in async storage', e);
  }
};

const removeItem = async key => {
  try {
    await AsyncStorage.removeItem(key);
    return true;
  } catch (exception) {
    return false;
  }
};
const clearAll = async () => {
  try {
    await AsyncStorage.clear();
  } catch (e) {
    // clear error
  }

  console.log('Cleared AsyncStorage');
};

export {storeItem, getItemByKey, removeItem, clearAll};
