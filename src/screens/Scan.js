import React, {useState, useEffect, useRef} from 'react';

import {
  StyleSheet,
  View,
  Button,
  TouchableOpacity,
  AppRegistry,
  Text,
  Linking,
} from 'react-native';

import {Icon} from 'react-native-elements';

import {setPlate, hostelGateScan} from '../firebase';
import QRCodeScanner from 'react-native-qrcode-scanner';
import {RNCamera} from 'react-native-camera';

export default function ScanScreen({navigation}) {
  const [valid, setValid] = useState(false);
  const [flash, setFlash] = useState(false);
  let scanner = useRef(null);
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      setValid(false);
    });

    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribe;
  }, [navigation]);

  const onScan = async qr => {
    console.log(qr.data);
    if (qr.data.split('-')[0] === 'messqr') {
      const t = await setPlate();
      console.log('Logging', t);
      setValid(t);
    } else if (qr === 'hostelGate') {
      hostelGateScan();
    } else {
      console.log('Wrong qr');
    }
  };

  return (
    <>
      <View style={styles.container}>
        <View style={styles.validity}>
          {valid ? (
            <Icon name="check" reverse color="green" />
          ) : (
            <Icon name="close" reverse color="red" />
          )}
          <Text style={[styles.valid]}>{valid ? 'Valid' : 'Not Valid'}</Text>
        </View>
        <View style={styles.scanner} onPress={() => console.log('pressed')}>
          <View style={styles.menuRow}>
            <Icon
              name="refresh"
              reverse
              raised
              onPress={() => scanner.reactivate()}
            />
            <Icon
              name={flash ? 'flash-off' : 'flash-on'}
              reverse
              raised
              onPress={() => setFlash(!flash)}
            />
          </View>
          <QRCodeScanner
            ref={node => {
              scanner = node;
            }}
            onRead={e => onScan(e)}
            showMarker={true}
            flashMode={
              flash
                ? RNCamera.Constants.FlashMode.torch
                : RNCamera.Constants.FlashMode.off
            }
            cameraStyle={styles.cameraContainer}
          />
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
  validity: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingRight: 10,
    borderRadius: 200,
    elevation: 5,
  },
  valid: {
    color: 'black',
    fontSize: 30,
    fontWeight: 'bold',
  },
  centerText: {
    flex: 1,
    fontSize: 18,
    padding: 32,
    color: '#777',
  },
  textBold: {
    fontWeight: '500',
    color: '#000',
  },
  scanner: {
    alignItems: 'flex-end',
  },
  cameraContainer: {
    margin: 0,
  },
  menuRow: {
    flexDirection: 'row',
    marginTop: 20,
    position: 'absolute',
    backgroundColor: '#D3D3D3',
    borderTopLeftRadius: 15,
    padding: 3,
  },
});
