import React, {useState, useEffect} from 'react';
import {Text, View, Button, TouchableOpacity} from 'react-native';
import {useStore} from '../store';
import {GoogleSigninButton} from '@react-native-google-signin/google-signin';
import {getItem} from '../AsyncStorage';
import {StyleSheet} from 'react-native';
import {Icon} from 'react-native-elements';
import {getAdmins} from '../firebase';

const Login = props => {
  const {signIn, subscriber, signOut} = useStore();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={{fontSize: 40, color: 'black', fontWeight: '100'}}>
          Welcome To MessQR
        </Text>
        <Text style={{fontSize: 15, color: 'grey', fontWeight: '100'}}>
          Please login if you are a hostelite.
        </Text>
      </View>
      <GoogleSigninButton
        style={{width: 192, height: 48}}
        size={GoogleSigninButton.Size.Wide}
        color={GoogleSigninButton.Color.Light}
        onPress={() => signIn()}
      />
      {/* <Button title="Sign Out" onPress={() => signOut()} /> */}
      {/* <TouchableOpacity
        style={styles.adminButton}
        onPress={() => console.log('Tapped')}>
        <Icon name="admin-panel-settings" color="#444444" />
      </TouchableOpacity> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    marginBottom: 40,
    alignItems: 'center',
  },
  adminButton: {
    padding: 10,
    backgroundColor: 'white',
    borderRadius: 50,
    margin: 10,
    elevation: 3,
    position: 'absolute',
    bottom: 0,
    right: 0,
  },
});

export default Login;

/*

keytool -list -v -keystore ./android/app/debug.keystore -alias androiddebugkey -storepass android -keypass android

*/
