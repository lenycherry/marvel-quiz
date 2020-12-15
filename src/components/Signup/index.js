import React, { useState, useContext } from 'react'
import { Link } from 'react-router-dom'
import { FirebaseContext } from '../Firebase'

const Signup = props => {

    const firebase = useContext(FirebaseContext);

    const data = {
        pseudo: '',
        email: '',
        password: '',
        confirmPassword: ''
    }

    const [loginData, setLoginData] = useState(data);
    const [error, setError] = useState('')

    //modifie les states en fonction d'un changement dans l'input
    const handleChange = e => {
        setLoginData({ ...loginData, [e.target.id]: e.target.value });
    }

    //Quand on submit, on fait appel à la fonction signupUser grâce au context FirebseContext pour enregistrer les datas dans firebase.
    const handleSubmit = e => {
        e.preventDefault();
        const { email, password, pseudo } = loginData;
        firebase.signupUser(email, password)
            //Lorsque la requête est effectuée, on crée un nouveau user (pseudo, email) dans la collection users de la bdd.
            .then(authUser => {
                return firebase.user(authUser.user.uid).set({
                    pseudo,
                    email
                })
                //lorsque c'est enregistré, on modifie les states du formulaire pour les remettre dans leur état d'origine, soit data (cad vides).
                //Renvoi vers la page d'acceuil grâce au props history et la méthode push (notre composant détient (props) en argument pour nous permettre de les utiliser.
                //si il y a une erreur dans le formulaire, on met à jour l'erreur pour l'afficher correctement dans la const errorMsg (gestion des erreurs)
                //et on modifie les states pour les remettre dans leur état d'origine, soit data (cad vides).
            })
            .then(() => {
                setLoginData({ ...data });
                props.history.push('/welcome');
            })
            .catch(error => {
                setError(error);
                setLoginData({ ...data })
            })
    }

    //destructuring de loginData. Extrait les datas d'un élément pour les mettre dans des variables distinctes.
    //ainsi chaque variable pourra être utilisée comme paramètre de value dans chaque input concerné par une data précise.
    const { pseudo, email, password, confirmPassword } = loginData;

    //affichage du bouton de validation selon conditions
    const btn = pseudo === '' || email === '' || password === '' || password !== confirmPassword
        ? <button disabled>Inscription</button> : <button>Inscription</button>

    //gestion des erreurs
    const errorMsg = error !== '' && <span>{error.message}</span>;

    return (
        <div className='signUpLoginBox'>
            <div className='slContainer'>
                <div className='formBoxLeftSignup'>
                </div>
                <div className='formBoxRight'>
                    <div className='formContent'>
                        {errorMsg}
                        <h2>Inscription</h2>
                        <form onSubmit={handleSubmit}>
                            <div className='inputBox'>
                                <input onChange={handleChange} value={pseudo} type='text' id='pseudo' autoComplete='off' required />
                                <label htmlFor='pseudo'>Pseudo</label>
                            </div>

                            <div className='inputBox'>
                                <input onChange={handleChange} value={email} type='email' id='email' autoComplete='off' required />
                                <label htmlFor='email'>Email</label>
                            </div>

                            <div className='inputBox'>
                                <input onChange={handleChange} value={password} type='password' id='password' autoComplete='off' required />
                                <label htmlFor='password'>Mot de passe</label>
                            </div>

                            <div className='inputBox'>
                                <input onChange={handleChange} value={confirmPassword} type='password' id='confirmPassword' autoComplete='off' required />
                                <label htmlFor='confirmPassword'>Confirmer votre mot de passe</label>
                            </div>

                            {btn}
                        </form>
                        <div className='linkContainer'>
                            <Link className='simpleLink' to='/login'>Déjà inscrit? Connectez-vous.</Link>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default Signup
