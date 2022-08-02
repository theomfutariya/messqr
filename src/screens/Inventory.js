import {
  StyleSheet,
  View,
  TextInput,
  Text,
  ScrollView,
  FlatList,
  Alert,
  ToastAndroid,
  TouchableOpacity,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {Icon} from 'react-native-elements';
import {addInventory, getDate} from '../firebase';
import {AutocompleteDropdown} from 'react-native-autocomplete-dropdown';
export default function Inventory() {
  const [inputs, setInputs] = useState([{item: '', quantity: '', cost: ''}]);
  const [today, setDate] = useState(null);
  const [tempItem, setTempItem] = useState(null);

  useEffect(() => {
    setDate(getDate().split('-').join('/'));
  }, []);

  const showToast = content => {
    ToastAndroid.show(content, ToastAndroid.SHORT);
  };

  const createTwoButtonAlert = (data, index) => {
    let item = data[index]['item'];
    let quantity = data[index]['quantity'];
    Alert.alert('Delete', `Do you want to delete ${item} and ${quantity}?`, [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {
        text: 'Delete',
        onPress: () => {
          data.splice(index, 1);
          setInputs(data);
        },
      },
    ]);
  };

  const addInput = () => {
    let input = {item: '', quantity: '', cost: ''};
    setInputs([input, ...inputs]);
  };

  const removeInput = index => {
    console.log('remove elements');
    let data = [...inputs];
    createTwoButtonAlert(data, index);
  };

  const handleChange = (index, name, text) => {
    let data = [...inputs];
    data[index][name] = text;
    setInputs(data);
  };

  const handleSubmit = () => {
    console.log(inputs);
    addInventory(inputs);
  };

  return (
    <View style={styles.container}>
      <Text
        style={{
          color: 'black',
          fontSize: 30,
          fontWeight: '300',
          marginBottom: 10,
        }}>
        {today}
      </Text>
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {inputs.map((input, index) => {
          return (
            <View key={index} style={[styles.inputRow]}>
              <TextInput
                placeholder="Item"
                placeholderTextColor={'#949494'}
                name="item"
                style={styles.input}
                onChangeText={text => handleChange(index, 'item', text)}
                value={input.item}
              />

              <TextInput
                placeholder="kg/ltr"
                keyboardType="numeric"
                placeholderTextColor={'#949494'}
                name="quantity"
                style={styles.input}
                onChangeText={text => handleChange(index, 'quantity', text)}
                value={input.quantity}
              />
              <TextInput
                placeholder="Cost"
                keyboardType="numeric"
                placeholderTextColor={'#949494'}
                name="cost"
                style={styles.input}
                onChangeText={text => handleChange(index, 'cost', text)}
                value={input.cost}
              />
              {index === 0 ? (
                <Icon
                  name="add"
                  reverse
                  size={15}
                  color={'#242424'}
                  onPress={() => {
                    if (input.item && input.quantity) addInput();
                    else showToast('Please enter valules properly');
                  }}
                />
              ) : (
                <Icon
                  name="close"
                  reverse
                  size={15}
                  color={'#242424'}
                  onPress={() => removeInput(index)}
                />
              )}
            </View>
          );
        })}
      </ScrollView>
      <TouchableOpacity
        style={styles.submitButton}
        onPress={() => handleSubmit()}>
        <Text style={{color: 'black'}}>Submit</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
    // backgroundColor: 'green',
  },
  flatList: {
    zIndex: -1,
    width: '100%',
    // backgroundColor: 'red',
  },
  input: {
    width: '25%',
    height: 40,
    borderWidth: 1,
    borderColor: '#949494',
    borderRadius: 10,
    padding: 10,
    color: 'black',
  },
  inputRow: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    // backgroundColor: 'red',
  },
  dropdown: {
    height: 50,
    borderColor: 'gray',
    borderWidth: 0.5,
    borderRadius: 8,
    paddingHorizontal: 8,
  },
  label: {
    position: 'absolute',
    backgroundColor: 'white',
    left: 22,
    top: 8,
    zIndex: 999,
    paddingHorizontal: 8,
    fontSize: 14,
    color: '#949494',
  },
  placeholderStyle: {
    fontSize: 16,
    color: '#949494',
  },
  selectedTextStyle: {
    fontSize: 16,
    color: '#949494',
  },
  inputSearchStyle: {
    height: 40,
    fontSize: 16,
    color: '#949494',
  },
  submitButton: {
    width: '75%',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 50,
  },
  scroll: {
    // backgroundColor: 'blue',
    width:'100%'
  },
});
