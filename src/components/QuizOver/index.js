import React, { Fragment, useEffect, useState } from 'react'
import { GiTrophyCup } from 'react-icons/gi'
import Loader from '../Loader'
import Modal from '../Modal'
import axios from 'axios'


const QuizOver = React.forwardRef((props, ref) => {

    const { levelNames,
        score,
        maxQuestions,
        quizLevel,
        percent,
        loadLevelQuestions
    } = props;

    const API_PUBLIC_KEY = process.env.REACT_APP_MARVEL_API_KEY;
    const hash = '3b06ad567f761ab0c53d5fef0fe49917';

    const [asked, setAsked] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [characterInfos, setCharacterInfos] = useState([]);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        setAsked(ref.current)

        //condition pour nettoyer le local storage en fonction de la date enregistrée.
        if (localStorage.getItem('marvelStorageDate')) {
            const date = localStorage.getItem('marvelStorageDate');
            checkDataDate(date);
        }

    }, [ref])

    const checkDataDate = date => {
        const today = Date.now();
        const timeDifference = today - date;

        //Conversion milli sc en nb de jour
        const daysDifference = timeDifference / (1000 * 3600 * 24);

        //si le nb de jour est sup a 15 jour, on nettoie le localstorage avec clear ()
        //et on enregistre une nouvelle date
        if (daysDifference >= 15) {
            localStorage.clear();
            localStorage.setItem('marvelStorageDate', Date.now());
        }
    }

    const showModal = id => {
        setOpenModal(true);

        //si il existe de la data dans le localstorage correspondant à l' id
        //Je met à jour caracterInfos avec les datas contenues dans le localstorage( JSON.parse va convertir les chaînes de caractères en objet).
        if (localStorage.getItem(id)) {
            setCharacterInfos(JSON.parse(localStorage.getItem(id)));
            setLoading(false);

            //Sinon je fais appel à l'API via Axios pour m'envoyer les datas demandées.
        } else {
            axios
                .get(`https://gateway.marvel.com/v1/public/characters/${id}?ts=1&apikey=${API_PUBLIC_KEY}&hash=${hash}`)
                .then(response => {
                    //on enregistre les datas reçues en réponse dans le setter de CharacterInfos et on le met à jour.
                    setCharacterInfos(response.data);
                    setLoading(false);

                    //On enregistre une copie des datas dans le local storage en utilisant une clé+valeur (id, response.data). 
                    //JSON.stringify transforme l'objet response.data en chaîne de caractères.
                    localStorage.setItem(id, JSON.stringify(response.data));

                    //si il n'existe pas de date enregistrée, enregistre la date
                    if (!localStorage.getItem('marvelStorageDate')) {
                        localStorage.setItem('marvelStorageDate', Date.now());
                    }
                })
                .catch(err => {
                    console.log(err)
                })
        }
    }

    const hideModal = () => {
        setOpenModal(false);
        setLoading(true);
    }

    //Pour afficher une majuscule à la première lettre du mot
    const capitalizeFistLetter = string => {
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    const averageGrade = maxQuestions / 2;

    if (score < averageGrade) {
        setTimeout(() => {
            loadLevelQuestions(quizLevel)
        }, 3000);
    }

    const decision = score >= averageGrade ? (
        <Fragment>
            <div className='stepsBtnContainer'>
                {
                    quizLevel < levelNames.length ?
                        (
                            <Fragment>
                                <p className='successMsg'>Bravo, passez au niveau suivant !</p>
                                <button className='btnResult successMsg' onClick={() => loadLevelQuestions(quizLevel)}>Niveau suivant</button>
                            </Fragment>
                        )
                        :
                        (
                            <Fragment>
                                <p className='successMsg'>
                                    <GiTrophyCup size='50' />  Bravo, vous êtes un expert !
                                </p>
                                <button className='btnResult gameOver' onClick={() => loadLevelQuestions(0)}>Accueil</button>
                            </Fragment>
                        )
                }
            </div>
            <div className='percentage'>
                <div className='progressPercent'>Réussite: {percent}%</div>
                <div className='progressPercent'>Note: {score}/{maxQuestions}</div>
            </div>
        </Fragment>
    )
        :
        (
            <Fragment>
                <div className='stepsBtnContainer'>
                    <p className='failureMsg'>Vous avez échoué ...</p>
                </div>
                <div className='percentage'>
                    <div className='progressPercent'>Réussite: {percent} %</div>
                    <div className='progressPercent'>Note: {score}/{maxQuestions}</div>
                </div>
            </Fragment>
        )

    const questionAnswer = score >= averageGrade ? (
        asked.map(question => {
            return (
                <tr key={question.id}>
                    <td>{question.question}</td>
                    <td>{question.answer}</td>
                    <td>
                        <button
                            className='btnInfo'
                            onClick={() => showModal(question.heroId)}
                        >
                            Infos</button>
                    </td>
                </tr>
            )
        })
    )
        :
        (
            <tr>
                <td colSpan="3">
                    <Loader
                        loadingMsg={'pas de réponses !'}
                        styling={{ textAlign: 'center', color: 'red' }}
                    />
                </td>
            </tr>
        )

    const resultInModal = !loading ? (
        <Fragment>
            <div className='modalHeader'>
                <h2>{characterInfos.data.results[0].name}</h2>
            </div>

            <div className='modalBody'>
                <div className="comicImage">
                    <img
                        src={characterInfos.data.results[0].thumbnail.path + '.' + characterInfos.data.results[0].thumbnail.extension}
                        alt={characterInfos.data.results[0].name}
                    />
                    <p>{characterInfos.attributionText}</p>
                </div>
                <div className="comicDetails">
                    <h3>Description</h3>
                    {
                        characterInfos.data.results[0].description ?
                            <p>{characterInfos.data.results[0].description}</p>
                            :
                            <p>Pas de description disponible.</p>
                    }
                    <h3>Plus d' infos</h3>
                    {
                        characterInfos.data.results[0].urls &&
                        characterInfos.data.results[0].urls.map((url, index) => {
                            return <a
                                key={index}
                                href={url.url}
                                target='_blank'
                                rel='noopener noreferrer'
                            >
                                {capitalizeFistLetter(url.type)}
                            </a>
                        })
                    }
                </div>
            </div>

            <div className='modalFooter'>
                <button className='modalBtn' onClick={hideModal}>Fermer</button>
            </div>
        </Fragment>
    )
        :
        (
            <Fragment>
                <div className='modalHeader'>
                    <h2>Veuillez patienter...</h2>
                </div>
                <div className='modalBody'>
                    <Loader />
                </div>
            </Fragment>
        )

    return (
        <Fragment>

            { decision}

            <hr />
            <p>Les réponses aux questions posées:</p>

            <div className='answerContainer'>
                <table className='answers'>
                    <thead>
                        <tr>
                            <th>Questions</th>
                            <th>Réponses</th>
                            <th>Infos</th>
                        </tr>
                    </thead>
                    <tbody>
                        {questionAnswer}
                    </tbody>
                </table>
            </div>

            <Modal showModal={openModal} hideModal={hideModal}>

                {resultInModal}

            </Modal>

        </Fragment>
    )
})



export default React.memo(QuizOver)
