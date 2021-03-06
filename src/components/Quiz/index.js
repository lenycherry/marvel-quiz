import React, { Component, Fragment } from 'react';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { QuizMarvel } from '../quizMarvel';
import Levels from '../Levels';
import ProgressBar from '../ProgressBar';
import QuizOver from '../QuizOver';
import { FaChevronRight } from 'react-icons/fa';
//Pour les besoins du cours, ce composant a été travaillé en type classe

toast.configure();

const initialState = {
    quizLevel: 0,
    maxQuestions: 10,
    storedQuestions: [],
    question: null,
    options: [],
    idQuestion: 0,
    btnDisabled: true,
    userAnswer: null,
    score: 0,
    showWelcomeMsg: false,
    quizEnd: false,
    percent: null
}


const levelNames = ['debutant', 'confirme', 'expert'];

class Quiz extends Component {

    constructor(props) {
        super(props)

        this.state = initialState;
        this.storedDataRef = React.createRef();

    }


    loadQuestions = quizz => {
        //on récupère les datas du quiz
        const fetchedArrayQuiz = QuizMarvel[0].quizz[quizz];
        // si la longueur des datas est inf ou égal au state max de questions.
        if (fetchedArrayQuiz.length >= this.state.maxQuestions) {
            //on stock toutes les datas récupérées dans notre Ref, storeDataRef.
            this.storedDataRef.current = fetchedArrayQuiz;
            //on crée un nouveau tableau sans la data réponse et on met à jour le state storedQuestions.
            const newArray = fetchedArrayQuiz.map( ({ answer, ...keepRest}) => keepRest);
            this.setState({ storedQuestions: newArray })
        }
    }

    showToastMsg = pseudo => {
        if (!this.state.showWelcomeMsg) {
            this.setState({ showWelcomeMsg: true })
            toast.warn(`Bienvenue ${pseudo}, et bonne chance !`, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: false,
            });
        }
    }

    componentDidMount() {
        this.loadQuestions(levelNames[this.state.quizLevel])
    }

    nextQuestion = () => {
        if (this.state.idQuestion === this.state.maxQuestions - 1) {
            this.setState({ quizEnd: true })
        } else {
            this.setState(prevState => ({ idQuestion: prevState.idQuestion + 1 }))
        }
        //j'enregistre dans une variable la réponse extraite de la ref storeDataRef correspondant à l'id de la question.
        const goodAnswer = this.storedDataRef.current[this.state.idQuestion].answer;
        //si le choix du user correspont à la réponse, on incrémente le state score de 1.
        if (this.state.userAnswer === goodAnswer) {
            this.setState(prevState => ({
                score: prevState.score + 1
            }))
            //on affiche une notification success.
            toast.success('Bravo ! + 1 point', {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: false,
            });
            //sinon on affiche une notification error.
        } else {
            toast.error('Faux ! 0 point', {
                position: "top-right",
                autoClose: 2000,
                hideProgressBar: false,
                closeOnClick: true,
                pauseOnHover: true,
                draggable: false,
            });
        }

    }

    componentDidUpdate(prevProps, prevState) {

        const {
            maxQuestions,
            storedQuestions,
            idQuestion,
            score,
            quizEnd
        } = this.state;

        if ((storedQuestions !== prevState.storedQuestions) && storedQuestions.length) {
            //si on détecte une update de storequestions et que celui ci n'est pas vide
            //on va mettre à jour les states questions et options
            this.setState({
                question: storedQuestions[idQuestion].question,
                options: storedQuestions[idQuestion].options
            })
        }
        //si l'id de la question est différent du précédent et que le storedquestions n'est pas vide alors on met à jour les states question et options 
        //et on reset les states du bouton et de la sélection de réponse à leur valeur d'origine.
        if ((idQuestion !== prevState.idQuestion) && storedQuestions.length) {
            this.setState({
                question: storedQuestions[idQuestion].question,
                options: storedQuestions[idQuestion].options,
                userAnswer: null,
                btnDisabled: true
            })
        }
        // mise à jour du score si celui-ci est diff du score précédent via la méthode gameOver.
        if (quizEnd !== prevState.quizEnd) {
            const gradepercent = this.getPercentage(maxQuestions, score);
            this.gameOver(gradepercent);
        }
        //si le pseudo utilisateur est différent du props précédent, on invoque la méthode showToastMsg qui va afficher une notification.
        if (this.props.userData.pseudo !== prevProps.userData.pseudo) {
            this.showToastMsg(this.props.userData.pseudo)
        }
    }

    // sur un onClick d' une option, on lance cette méthode qui met a jour les states userAnswer et btnDisabled.
    //Une réponse est sélectionnée et le bouton devient cliquable.
    submitAnswer = selectedAnswer => {
        this.setState({
            userAnswer: selectedAnswer,
            btnDisabled: false
        })
    }

    getPercentage = (maxQuestions, ourScore) => (ourScore / maxQuestions) * 100;

    gameOver = percent => {

        if (percent >= 50) {
            this.setState({
                quizLevel: this.state.quizLevel + 1,
                percent
            })
        } else {
            this.setState({ percent })
        }
    }

    loadLevelQuestions = param => {
        this.setState({ ...initialState, quizLevel: param });
        this.loadQuestions(levelNames[param]);
    }

    render() {

        const {
            quizLevel,
            maxQuestions,
            question,
            options,
            idQuestion,
            btnDisabled,
            userAnswer,
            score,
            quizEnd,
            percent
        } = this.state;

        //gestion de l'affichage des options.
        const displayOptions = options.map((option, index) => {
            return (
                <p key={index}
                    //on ajoute la classe selected si le state de userAnswer correspond à cette option sinon elle est null.
                    className={`answerOptions ${userAnswer === option ? 'selected' : null}`}
                    onClick={() => this.submitAnswer(option)}
                >
                    <FaChevronRight />    {option}
                </p>
            )
        })
        //Si le state de quizEnd est true, on affiche le composant QuizOver, sinon on affiche les composants du quiz.
        return quizEnd ? (
            <QuizOver ref={this.storedDataRef}
                levelNames={levelNames}
                score={score}
                maxQuestions={maxQuestions}
                quizLevel={quizLevel}
                percent={percent}
                loadLevelQuestions={this.loadLevelQuestions}
            />
            )
            :
            (
                <Fragment>
                    <Levels
                        levelNames={levelNames}
                        quizLevel={quizLevel}
                    />
                    <ProgressBar idQuestion={idQuestion} maxQuestions={maxQuestions} />
                    <h2>{question}</h2>

                    { displayOptions}

                    <button onClick={() => this.nextQuestion()}
                        disabled={btnDisabled}
                        className='btnSubmit'
                    >
                        {idQuestion < maxQuestions - 1 ? 'Suivant' : 'Terminer'}
                    </button>
                </Fragment>
            )
    }
}

export default Quiz
