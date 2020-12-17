import React, { Fragment } from 'react'

const ProgressBar = ({ idQuestion, maxQuestions }) => {

    const getWidth = (totalQuestions, questionId) => {
        return (100 / totalQuestions) * questionId;
    }

    const actualQuestion = idQuestion + 1;
    const progressPercent = getWidth(maxQuestions, actualQuestion);

    return (
        <Fragment>
            <div className='percentage'>
                <div className='progressPercent'>{`Question: ${actualQuestion}/${maxQuestions}`}</div>
                <div className='progressPercent'>{`Progression: ${progressPercent}%`}</div>
            </div>
            <div className='progressBar'>
                <div className='progressBarChange' style={{ width: `${progressPercent}%` }}></div>
            </div>
        </Fragment>
    )
}
// memo va permettre de vérifier si les arguments de la fonction on changé, si oui il relancera le composant (puisque c'est une fonction), si non, il ne le rechargera pas.
export default React.memo(ProgressBar)
