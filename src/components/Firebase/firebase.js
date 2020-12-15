import app from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

const config = {
    apiKey: "AIzaSyDyG-i0FuKkSJFO667INp4Ua3zBzzhCY4g",
    authDomain: "marvel-quiz-a9ddc.firebaseapp.com",
    projectId: "marvel-quiz-a9ddc",
    storageBucket: "marvel-quiz-a9ddc.appspot.com",
    messagingSenderId: "654099229872",
    appId: "1:654099229872:web:3cb5952601c1aaf98cdf75"
  };

class Firebase {
    constructor(){
        app.initializeApp(config)
        this.auth = app.auth();
        this.db = app.firestore();
    }

    //inscription
    signupUser = (email, password) =>
    this.auth.createUserWithEmailAndPassword(email, password); 

    //connexion
    loginUser = (email, password) =>
    this.auth.signInWithEmailAndPassword(email, password); 

    //déconnexion
    signoutUser = () => this.auth.signOut();

    //Récuperer le mot de passe
    passwordReset = email => this.auth.sendPasswordResetEmail(email);

    //Récuperer l' id utilsateur dans la bdd
    user = uid => this.db.doc(`users/${uid}`);
}

export default Firebase