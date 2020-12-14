import React, { useState, Fragment, useContext, useEffect } from 'react'
import { FirebaseContext } from '../Firebase'
import Logout from '../Logout'
import Quiz from '../Quiz'

const Welcome = (props) => {

    const [userSession, setUserSession] = useState(null);
    const firebase = useContext(FirebaseContext);


    //va vérifier si il y a eu un changement sur userSession en regardant si il existe un user avec le listener de firebase onAuthStateChange,
    // si il y a un user on change le state de userSession, si il n'y en a pas on redirige vers l'accueil grâce au props history.push.
    useEffect(() => {

        let listener = firebase.auth.onAuthStateChanged(user => {
            user ? setUserSession(user) : props.history.push('/');
        })

        return () => {
          listener()
        }
    }, [])

//si userSession est null, on affiche un loader le temps que le listener fasse sa vérif et redirige au besoin.
//si le listener détecte un user on affiche le contenu.
    return userSession === null ? (
        <Fragment>
            <div className='loader'></div>
            <p>Loading ...</p>
        </Fragment>
    ) : (
            <div className='quiz-bg'>
                <div className='container'>
                    <Logout />
                    <Quiz />
                </div>

            </div>
        )
}

export default Welcome
