import {
  StyleSheet,
  Text,
  View,
  Button,
  Image,
  TouchableOpacity,
} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import ScanScreen from './Scan';
import {useState, useEffect} from 'react';
import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {Linking} from 'react-native';

const Tab = createBottomTabNavigator();

export default function Pay() {
  const navigation = useNavigation();

  const handleClick = () => {
    navigation.navigate('Home');
  };
  const openPaymentApp = async payApp => {
    let url = '';
    switch (payApp) {
      case 'PAYTM':
        url = 'paytmmp://';
        break;
      case 'GPAY':
        url = 'tez://upi/';
        break;
      case 'PHONEPE':
        url = 'phonepe://';
        break;
    }
    url = url + 'pay?pa=virenbhosale@kotak&pn=Mess Meal&am=20&cu=INR';
    console.log('URL : ', url);
    try {
      await Linking.openURL(url);
    } catch (err) {
      console.error('ERROR : ', err);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Please pay ₹ 20.00 on given UPI</Text>
      <Image style={styles.imgStyle} source={require('../assets/qr.png')} />
      <Text style={styles.text}>UPI ID: omfutariya@oksbi</Text>
      <Text style={styles.text}>Pay Using:</Text>
      <View style={{flexDirection: 'row'}}>
        <TouchableOpacity
          style={styles.paymentButton}
          title="GPay"
          onPress={() => {
            openPaymentApp('GPAY');
          }}>
          <Text style={styles.paymentText}>GPay</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.paymentButton}
          title="PayTm"
          onPress={() => {
            openPaymentApp('PAYTM');
          }}>
          <Text style={styles.paymentText}>PayTm</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.paymentButton}
          title="PhonePe"
          onPress={() => {
            openPaymentApp('PHONEPE');
          }}>
          <Text style={styles.paymentText}>PhonePe</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 50,
  },
  text: {
    textAlign: 'center',
    margin: 20,
    color: 'black',
    fontWeight: '300',
    fontSize: 20,
  },
  imgStyle: {
    width: 300,
    height: 300,
  },
  paymentButton: {
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 10,
    margin: 10,
    elevation: 10,
  },
  paymentText: {
    color: 'black',
  },
});
