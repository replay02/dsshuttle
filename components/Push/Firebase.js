import RNFirebase from 'react-native-firebase';

const configurationOptions = {
  apiKey: "AIzaSyBHILWQzifSk7cp0bz2HOPub_zGQrxiMHs",
  authDomain: "dsshuttlepush.firebaseapp.com",
  databaseURL: "https://dsshuttlepush.firebaseio.com",
  projectId: "dsshuttlepush",
  storageBucket: "dsshuttlepush.appspot.com",
  messagingSenderId: "123915951549",
  appId: "1:123915951549:web:cf823590b80c1203"
}

const firebase = RNFirebase.initializeApp(configurationOptions)

export default firebase