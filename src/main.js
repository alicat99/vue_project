import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCfZdlz9mGnYtB8NGwgdKFP1n6yYwIr1DU",
  authDomain: "soongsil-af5dc.firebaseapp.com",
  projectId: "soongsil-af5dc",
  storageBucket: "soongsil-af5dc.appspot.com",
  messagingSenderId: "462824179207",
  appId: "1:462824179207:web:aeaa6e3c19deae124c0ca2",
  measurementId: "G-XRL5W54Y7M"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

const app = createApp(App)
app.use(router)
app.mount('#app')