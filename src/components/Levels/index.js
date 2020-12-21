import React, { useEffect, useState } from 'react'
import Stepper from 'react-stepper-horizontal'

const Levels = ({ levelNames, quizLevel }) => {


    const [levels, setLevels] = useState([]);

    //On va parcourir le tableau contenu dans levelName et mettre chaque data dans un level
    //le tout contenu à présent dans quizSteps. On va mettre à jour les levels et donc le tableau quizsteps.
    useEffect(() => {
        const quizsteps = levelNames.map(level => ({ title: level.toUpperCase() }));
        setLevels(quizsteps);
    }, [levelNames]);

    return (
        <div className='levelsContainer' style={{background: 'transparent'}}>
                <Stepper
                    steps={ levels }
                    activeStep={quizLevel}
                    circleTop={0}
                    activeTitleColor={'#d31017'}
                    activeColor={'#d31017'}
                    completeTitleColor={'#E0E0E0'}
                    completeColor={'#E0E0E0'}
                    completeBarColor={'#E0E0E0'}
                    barStyle={'dashed'}
                    size={45}
                    circleFontSize={20}
                 />
        </div>
    )
}

export default React.memo(Levels)
