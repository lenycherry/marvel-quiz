import React, { Component } from 'react'
import { QuizMarvel } from '../quizMarvel'
import Levels from '../Levels'
import ProgressBar from '../ProgressBar'
//Pour les besoins du cours, ce composant a été travaillé en type classe



class Quiz extends Component {

    state = {
        levelNames: ['debutant', 'confirme', 'expert'],
        quizLevel: 0,
        maxQuestions: 10,
        storedQuestions: [],
        question: null,
        options: [],
        idQuestion: 0,
        btnDisabled: true,
        userAnswer: null,
        score: 0
    }

    storedDataRef = React.createRef();

    loadQuestions = quizz => {
        //on récupère les datas du quiz
        const fetchedArrayQuiz = QuizMarvel[0].quizz[quizz];
        // si la longueur des datas est inf ou égal au state max de questions.
        if (fetchedArrayQuiz.length >= this.state.maxQuestions) {
            //on stock toutes les datas récupérées dans notre Ref, storeDataRef.
            this.storedDataRef.current = fetchedArrayQuiz;
            //on crée un nouveau tableau sans la data réponse et on met à jour le state storedQuestions.
            const newArray = fetchedArrayQuiz.map(({ answer, ...keepRest }) => keepRest);
            this.setState({
                storedQuestions: newArray
            })
        } else {
            //End
        }
    }

    componentDidMount() {
        this.loadQuestions(this.state.levelNames[this.state.quizLevel])
    }

    nextQuestion = () => {
        if (this.state.idQuestion === this.state.maxQuestions - 1) {
            //End
        } else {
            this.setState(prevState => ({
                idQuestion: prevState.idQuestion + 1
            }))
        }
        //j'enregistre dans une variable la réponse extraite de la ref storeDataRef correspondant à l'id de la question.
        const goodAnswer = this.storedDataRef.current[this.state.idQuestion].answer;
        //si le choix du user correspont à la réponse, on incrémente le state score de 1.
        if (this.state.userAnswer === goodAnswer) {
            this.setState(prevState => ({
                score: prevState.score + 1
            }))
        }

    }

    componentDidUpdate(prevProps, prevState) {
        if (this.state.storedQuestions !== prevState.storedQuestions) {
            //si on détecte une update de storequestions
            //on va mettre à jour les states questions et options
            this.setState({
                question: this.state.storedQuestions[this.state.idQuestion].question,
                options: this.state.storedQuestions[this.state.idQuestion].options
            })
        }
        //si l'id de la question est différent du précédent alors on met à jour les states question et options 
        //et on reset les states du bouton et de la sélection de réponse à leur valeur d'origine.
        if (this.state.idQuestion !== prevState.idQuestion) {
            this.setState({
                question: this.state.storedQuestions[this.state.idQuestion].question,
                options: this.state.storedQuestions[this.state.idQuestion].options,
                userAnswer: null,
                btnDisabled: true
            })
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

    render() {

        const { pseudo } = this.props.userData;

        //gestion de l'affichage des options.
        const displayOptions = this.state.options.map((option, index) => {
            return (
                <p key={index}
                    //on ajoute la classe selected si le state de userAnswer correspond à cette option sinon elle est null.
                    className={`answerOptions ${this.state.userAnswer === option ? 'selected' : null}`}
                    onClick={() => this.submitAnswer(option)}
                >
                    {option}
                </p>
            )
        })

        return (
            <div>
                <Levels />
                <ProgressBar />
                <h2>{this.state.question}</h2>

                { displayOptions}

                <button  onClick={()=>this.nextQuestion()} disabled={this.state.btnDisabled} className='btnSubmit'>Suivant</button>
            </div>
        )
    }
}

export default Quiz
