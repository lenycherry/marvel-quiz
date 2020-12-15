import React, { Component } from 'react'
import Levels from '../Levels'
import ProgressBar from '../ProgressBar'
//Pour les besoins du cours, ce composant a été retravaillé en type classe



class Quiz extends Component {

    render() {

        const { pseudo } = this.props.userData;

        return (
            <div>
                <Levels />
                <ProgressBar />
                <h2>Notre question Quiz</h2>
                <p className='answerOptions'>Question 1</p>
                <p className='answerOptions'>Question 2</p>
                <p className='answerOptions'>Question 3</p>
                <p className='answerOptions'>Question 4</p>
                <button className='btnSubmit'>Suivant</button>
            </div>
        )
    }
}

export default Quiz
