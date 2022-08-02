import create from 'zustand';
import auth from '@react-native-firebase/auth';
import {storeItem, removeItem, getItem, clearAll} from '../AsyncStorage';
import {useContext} from 'react';
import {WEB_CLIENT_ID} from 'react-native-dotenv';

import {
  GoogleSignin,
  GoogleSigninButton,
} from '@react-native-google-signin/google-signin';
import {getAdmins, initUser} from '../firebase';

GoogleSignin.configure({
  webClientId: WEB_CLIENT_ID,
});

// const inst = user.email.split('@')[1] === 'sggs.ac.in';

export const useStore = create((set, get) => ({
  user: null,
  isNewUser: false,
  isAdmin: false,
  admins: [],
  setUser: user => {
    set({user: user});
  },
  signIn: async () => {
    const {idToken} = await GoogleSignin.signIn();
    const googleCredential = auth.GoogleAuthProvider.credential(idToken);
    auth()
      .signInWithCredential(googleCredential)
      .then(async res => {
        set({isNewUser: res.additionalUserInfo.isNewUser});
      });
  },
  signOut: async () => {
    GoogleSignin.signOut().then(() =>
      auth()
        .signOut()
        .then(() => {
          console.log('User signed out!');
          set({isLoggedIn: false});
          clearAll();
        }),
    );
  },
  subscriber: auth().onAuthStateChanged(onAuthStateChanged),
}));

async function onAuthStateChanged(user) {
  console.log('onAuthChanged');
  useStore.setState({user: user});

  if (user) {
    console.log('User is isAdmin', user);
    await getAdmins().then(admins => {
      console.log(admins);
      useStore.setState({isAdmin: admins.includes(user.email)});
    });
  }
  if (user) {
    storeItem('user', user);
    if (useStore.getState().isNewUser) {
      console.log('New User');
      initUser();
    } else {
      console.log(useStore.getState().isNewUser);
    }
  }
}
