import React, { useState, useContext, useEffect } from 'react'
import { FirebaseContext } from '../Firebase'
import Logout from '../Logout'
import Quiz from '../Quiz'
import Loader from '../Loader';

const Welcome = props => {

    const firebase = useContext(FirebaseContext);
    const [userSession, setUserSession] = useState(null);
    const [userData, setUserData] = useState({});


    //va vérifier si il y a eu un changement sur userSession en regardant si il existe un user avec le listener de firebase onAuthStateChange,
    // si il y a un user on change le state de userSession, si il n'y en a pas on redirige vers l'accueil grâce au props history.push.
    useEffect(() => {

        let listener = firebase.auth.onAuthStateChanged(user => {
            user ? setUserSession(user) : props.history.push('/');
        })

        //si user est différent de null
        //on va chercher l'id du user
        //on récupère la data avec .get
        //si on a une réponse et qu'on a trouvé le user. On vérifie si la data existe (via doc) et on récupère toute la data dans une variable.
        //et on va mettre à jour le state de userData avec cette variable.
        if (!!userSession) {
            firebase.user(userSession.uid)
                .get()
                .then(doc => {
                    if (doc && doc.exists) {
                        const myData = doc.data()
                        setUserData(myData)
                    }
                })
                .catch(error => {

                })
        }

        return () => {
            listener()
        };
    }, [userSession])

    //si userSession est null, on affiche un loader le temps que le listener fasse sa vérif et redirige au besoin.
    //si le listener détecte un user on affiche le contenu.
    return userSession === null ? (
        <Loader
            loadingMsg={'Authentification...'}
            styling={{ textAlign: 'center', color: '#FFFFFF' }}
        />
    ) : (
            <div className='quiz-bg'>
                <div className='container'>
                    <Logout />
                    <Quiz userData={userData} />
                </div>

            </div>
        )
}

export default Welcome
