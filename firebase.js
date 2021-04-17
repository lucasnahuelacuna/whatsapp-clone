import firebase from 'firebase'

const firebaseConfig = {
    apiKey: "AIzaSyApTkwxBVXqig6-Og_viyfNUoNvOlnRhqo",
    authDomain: "whatsapp-clone-ba90c.firebaseapp.com",
    projectId: "whatsapp-clone-ba90c",
    storageBucket: "whatsapp-clone-ba90c.appspot.com",
    messagingSenderId: "368264250379",
    appId: "1:368264250379:web:72c6c7815a0ab277be730e"
};

const firebaseApp = !firebase.apps.length 
    ? firebase.initializeApp(firebaseConfig) 
    : firebase.app()

const db = firebaseApp.firestore()
const auth = firebaseApp.auth()
const provider = new firebase.auth.GoogleAuthProvider()

export { db, auth, provider }
