import database from '@react-native-firebase/database';
import firestore from '@react-native-firebase/firestore';
import {useStore} from '../src/store';

export const getData = () => {
  database()
    .ref('/user/123')
    .once('value')
    .then(snapshot => {
      console.log('User data: ', snapshot.val());
    });
};

export const getPlates = async () => {
  const ref = firestore().collection('oneqr').doc('messqr').collection('date');
  const data = await ref.get();

  if (data === undefined) {
    return null;
  }
  let ret = {};
  data.docs.forEach(doc => {
    ret[doc.id] = doc.data();
  });
  console.log(ret);
  return ret;
};

export const getPlateByDate = async date => {
  const today = getDate();
  const ref = firestore()
    .collection('oneqr')
    .doc('messqr')
    .collection('date')
    .doc(date);
  const dt = await ref.get();
  const data = dt._data;

  console.log(data);
  if (data === undefined) {
    return null;
  }
  return data;
};

export const addPlate = async meal => {
  const today = getDate();
  console.log(today);
  const ref = firestore()
    .collection('oneqr')
    .doc('messqr')
    .collection('date')
    .doc(today);
  const dt = await ref.get();
  const data = dt._data;

  console.log('Logging data', data);

  if (data === undefined) {
    ref.set({
      breakfast: meal === 'breakfast' ? 1 : 0,
      lunch: meal === 'lunch' ? 1 : 0,
      dinner: meal === 'dinner' ? 1 : 0,
    });
  } else {
    ref.update({
      breakfast: data.breakfast + (meal === 'breakfast' ? 1 : 0),
      lunch: data.lunch + (meal === 'lunch' ? 1 : 0),
      dinner: data.dinner + (meal === 'dinner' ? 1 : 0),
    });
  }
};

export const getDate = (customDate = null) => {
  const date = customDate !== null ? new Date(customDate) : new Date();
  const today =
    (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()) +
    '-' +
    (date.getMonth() + 1 < 10
      ? '0' + (date.getMonth() + 1)
      : date.getMonth() + 1) +
    '-' +
    date.getFullYear();
  return today;
};

export const getPlateDetails = async () => {
  const user = useStore.getState().user;
  const uid = user.uid;
  const today = getDate();
  const ref = database().ref(`/users/${uid}/date/${today}`);
  const currMeal = getMeal();
  return await ref.once('value').then(snapshot => {
    return snapshot.val();
  });
};

export const initUser = () => {
  const user = useStore.getState().user;
  const uid = user.uid;
  const email = user.email;
  const name = user.displayName;
  const photoURL = user.photoURL;

  database()
    .ref(`/users/${uid}`)
    .set({name: name, email: email, photoURL: photoURL, date: null})
    .then(() => console.log('Data set.'));
};

const getMeal = () => {
  const meals = {
    breakfast: {
      start: 8,
      end: 10,
    },
    lunch: {
      start: 13,
      end: 15,
    },
    dinner: {
      start: 19,
      end: 22,
    },
  };
  var dt = new Date();
  var curHours = dt.getHours();
  switch (curHours) {
    case curHours >= meals.breakfast.start && curHours <= meals.breakfast.end:
      return 'breakfast';
    case curHours >= meals.lunch.start && curHours <= meals.lunch.end:
      return 'lunch';
    case curHours >= meals.dinner.start && curHours <= meals.dinner.end:
      return 'dinner';
  }
  return 'lunch';
};

export const setPlate = async () => {
  const user = useStore.getState().user;
  const uid = user.uid;
  const today = getDate();
  const ref = database().ref(`/users/${uid}/date/${today}`);
  const currMeal = getMeal();
  return await ref.once('value').then(snapshot => {
    console.log('User data: ', snapshot.val());
    if (snapshot.val() && snapshot.val()['' + currMeal] === true) {
      console.log('Already plated');
      return false;
    } else {
      return ref
        .update({
          [currMeal]: true,
        })
        .then(() => {
          addPlate(currMeal);
          console.log('Plate updated.');
          return true;
        });
    }
  });
};
/*
{"displayName": "VIREN RAHUL BHOSALE",
 "email": "2019bit056@sggs.ac.in",
  "emailVerified": true,
  "isAnonymous": false,
  "metadata": {
    "creationTime": 1655205509661,
    "lastSignInTime": 1656418008554},
    "phoneNumber": null,
    "photoURL": "https://lh3.googleusercontent.com/a-/AOh14GjZTq_jDpMdDZv89SFatW1Zwp2EafwqLECn7SF9uA=s96-c",
    "providerData": [[Object]],
    "providerId": "firebase",
    "tenantId": null,
    "uid": "IEwoCTm54XUWl9Lwg5ZXp7NKrS83"
  }
*/

export const hostelGateScan = async () => {
  const user = useStore.getState().user;

  const today = getDate();
  const ref = firestore().collection('oneqr').doc('hostelqr').collection(today);

  ref
    .add({
      name: user.displayName,
      regNumber: user.uid,
      time: firestore.FieldValue.serverTimestamp(),
    })
    .then(() => {
      console.log('hostelqr added!');
    });
};

export const addInventory = async data => {
  const today = getDate();
  const ref = firestore()
    .collection('oneqr')
    .doc('messqr')
    .collection('inventory')
    .doc(today);

  const dt = await ref.get();
  const predata = dt._data;

  let processedData = {};
  data.forEach(obj => {
    processedData[obj[Object.keys(obj)[0]]] = [
      parseInt(obj[Object.keys(obj)[1]]),
      parseInt(obj[Object.keys(obj)[2]]),
    ];
  });
  if (predata === undefined) {
    ref.set(processedData);
  } else {
    ref.update(processedData);
  }
};

export const getInventoryByDate = async date => {
  const today = getDate();
  const ref = firestore()
    .collection('oneqr')
    .doc('messqr')
    .collection('inventory')
    .doc(date);

  const dt = await ref.get();
  const predata = dt._data;

  if (predata === undefined) {
    return null;
  }
  console.log(predata);
  return predata;
};
export const getInventory = async () => {
  const ref = firestore()
    .collection('oneqr')
    .doc('messqr')
    .collection('inventory');

  const data = await ref.get();

  if (data === undefined) {
    return null;
  }
  let ret = {};
  data.docs.forEach(doc => {
    ret[doc.id] = doc.data();
  });
  console.log(ret);
  return ret;
};

export const getAdmins = async () => {
  const ref = firestore()
    .collection('oneqr')
    .doc('messqr')
    .collection('admins')
    .doc('emails');

  const data = await ref.get();
  const emailIds = data._data.ids;
  return emailIds;
};
