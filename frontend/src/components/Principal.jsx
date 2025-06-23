import React, { useState } from 'react';

import Tabla from './Tabla';
import Header from './Header';
import ConfigurationForm from './ConfigurationForm';
import RungeKuttaForm from './RungeKuttaForm';
import ResultInterpretation from './ResultInterpretation';
import SimulationLogic from './SimulationLogic';

import { FaCheck } from "react-icons/fa6";

const Principal = () => {
    const [configParams, setConfigParams] = useState({});
    const [rungeKuttaParams, setRungeKuttaParams] = useState({});
    const [simulationData, setSimulationData] = useState([]);
    const [results, setResults] = useState([]);
    const [showNotification, setShowNotification] = useState(false);
    const [notificationClass, setNotificationClass] = useState('');

    const handleRunSimulation = () => {
        // Aquí iría la lógica para ejecutar la simulación

        // fetch('api/simulation', {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json',
        //     },
        //     body: JSON.stringify({ configParams, rungeKuttaParams }),
        // })
        // .then(response => response.json())
        // .then(data => {
        //     setSimulationData(data.simulationData);
        //     setResults(data.results);
        // })
        // .catch(error => {
        //     console.error('Error al ejecutar la simulación:', error);
        // });
    }

    const triggerNotification = () => {
        setNotificationClass('animate-slide-in-left');
        setShowNotification(true);

        setTimeout(() => setNotificationClass('animate-slide-out-left'), 1800);
        setTimeout(() => setShowNotification(false), 2200);
    };

    return (
        <div>
            {/* Titulo y presentacion de la pagina */}
            <section id="header" className='text-white'>
                <Header />
            </section>

            {/* Simulation parameters form */}
            <section id="configuration" className="text-white px-4">
                {/* Notification positioned bottom-left and above all content */}
                {showNotification && (
                    <div
                        className={`fixed bottom-6 left-6 z-[9999] flex items-center gap-3 px-6 py-4 h-30 w-fit
                rounded-lg bg-green-600/30 text-white text-xl font-medium shadow-lg border border-green-400 
                backdrop-blur-md transition-all duration-300 ease-in-out ${notificationClass}`}
                    >
                        <FaCheck className="text-green-300" />
                        ¡Cambios aplicados exitosamente!
                    </div>
                )}



                <div className="grid grid-cols-[2fr_1fr] gap-4">
                    <ConfigurationForm configParams={configParams} onChangeConfig={setConfigParams} triggerNotification={triggerNotification} />
                    <RungeKuttaForm rungeKuttaParams={rungeKuttaParams} onChangeRK={setRungeKuttaParams} triggerNotification={triggerNotification} />
                </div>

                <div className="flex flex-row items-center justify-center">
                    <SimulationLogic />
                    <button
                        className="m-4 px-12 py-3 bg-blue-600 text-white text-xl rounded-xl hover:bg-blue-700 transition cursor-pointer"
                        onClick={handleRunSimulation}
                    >
                        Ejecutar Simulación
                    </button>
                </div>
            </section>


            <section id="simulation" className='text-white'>
                <Tabla data={simulationData} />
            </section>

            {/* resultados */}
            <section id="results" className='text-white'>
                <ResultInterpretation results={results} />
            </section>

        </div>
    );
};

export default Principal;