import React, {useState, useEffect} from 'react';
import {StyleSheet, Text, View, Button} from 'react-native';
import {useStore} from '../store';

import {Icon} from 'react-native-elements';

import {getData, getPlateDetails, getAdmins} from '../firebase';

export default function HomeScreen({navigation}) {
  const [plates, setPlates] = useState(null);
  const {signOut} = useStore();

  const user = useStore(state => state.user);

  const plateDetails = async () => {
    setPlates(await getPlateDetails());
  };
  const setAdmins = async () => {
    console.log('logging');
    await getAdmins().then(admins => {
      console.log('Setting admins from Home.js', admins);
      useStore.setState({admins: admins});
    });
  };
  const checkUserValid = async () => {
    console.log(user.email);
    if (user.email.split('@')[1] !== 'sggs.ac.in') {
      console.log('Invalid user');
      signOut();
    } else {
      console.log('Vaild user');
    }
  };
  useEffect(() => {
    checkUserValid();
    const unsubscribe = navigation.addListener('focus', () => {
      plateDetails();
    });
    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribe;
  }, [navigation]);

  console.log('In home', user);
  return (
    <>
      <View style={styles.container}>
        <View style={styles.head}>
          <Text style={styles.textHead}>Welcome to MESS-QR Application!</Text>
          <Text style={styles.textHead}>
            {user !== null ? user.displayName : null}
          </Text>
        </View>
      </View>
      <View style={styles.body}>
        <View
          style={[
            styles.row,
            plates !== null && plates['breakfast']
              ? {shadowColor: 'green'}
              : null,
          ]}>
          <View style={styles.time}>
            <Text style={styles.timeText}>08:00 - 10:00</Text>
          </View>
          <Text style={[styles.text]}>
            Breafast:{' '}
            {plates ? (plates['breakfast'] ? 'Done' : 'Not Done') : 'Not Done'}
          </Text>
        </View>
        <View
          style={[
            styles.row,
            plates !== null && plates['lunch'] ? {shadowColor: 'green'} : null,
          ]}>
          <View style={styles.time}>
            <Text style={styles.timeText}>12:00 - 14:00</Text>
          </View>
          <Text style={[styles.text]}>
            Lunch:{' '}
            {plates ? (plates['lunch'] ? 'Done' : 'Not Done') : 'Not Done'}
          </Text>
        </View>
        <View
          style={[
            styles.row,
            plates !== null && plates['dinner'] ? {shadowColor: 'green'} : null,
          ]}>
          <View style={styles.time}>
            <Text style={styles.timeText}>09:00 - 21:00</Text>
          </View>
          <Text style={[styles.text]}>
            Dinner:{' '}
            {plates ? (plates['dinner'] ? 'Done' : 'Not Done') : 'Not Done'}
          </Text>
        </View>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    // justifyContent: 'center',
    paddingTop: 50,
  },
  body: {flex: 2, alignItems: 'center'},
  text: {
    color: '#000',
    fontSize: 20,
    fontWeight: '500',
    margin: 20,
    marginRight: 0,
  },
  head: {
    alignItems: 'center',
  },
  textHead: {
    color: '#000',
    fontSize: 25,
    fontWeight: '300',
  },
  row: {
    margin: 10,
    flexDirection: 'row',
    backgroundColor: 'white',
    borderRadius: 50,
    elevation: 10,
    width: '70%',
  },
  time: {
    backgroundColor: '#545454',
    alignItems: 'center',
    justifyContent: 'center',
    borderTopLeftRadius: 50,
    borderBottomLeftRadius: 50,
    padding: 10,
  },
  timeText: {
    fontWeight: '900',
    color: 'white',
  },
});
