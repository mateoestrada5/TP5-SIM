import React, { useState } from 'react';

import Tabla from './Simulation/Tabla';
import Header from './Information/Header';
import ConfigurationForm from './Simulation/ConfigurationForm';
import RungeKuttaForm from './RungeKutta/RungeKuttaForm';
import ResultInterpretation from './Simulation/ResultInterpretation';
import SimulationLogic from './Information/SimulationLogic';

import { FaCheck } from "react-icons/fa6";
import ReloadButton from './Simulation/ReloadButton';
import { TbReload } from "react-icons/tb";

import axios from 'axios';

const Principal = () => {
    const [longitudAlfombra, setLongitudAlfombra] = useState(120);

    const [configParams, setConfigParams] = useState({
        semilla: "",
        tiempoLimite: "",
        clienteX: "",
        cantidadEventos: "",
        horaInicio: 0,
        frecuenciaLlegadaMin: 3.0,
        frecuenciaLlegadaMax: 4.5,
        periodoSuspension: 40,
        periodoLimpieza: 240,
        duracionLimpieza: 20,
        colaEsperaMaximaHoras: 10,
        cantidadEventosVisualizar: 300,
        eventoInicial: 1,
    });

    const [rungeKuttaParams, setRungeKuttaParams] = useState({
        t0: 0,
        x0: 0,
        h: 0.001,
        ecuacionA: 0.5,
        ecuacionB: -0.2,
        ecuacionC: 5,
    });

    const rungeKuttaParamsWithXFinal = {
        ...rungeKuttaParams, xFinal: longitudAlfombra
    };

    const handleChangeLongitudAlfombra = (newLongitud) => {
        setLongitudAlfombra(newLongitud);
    };

    const isValidConfig = () => {
        const { tiempoLimite, clienteX, cantidadEventos } = configParams;
        return tiempoLimite !== "" || clienteX !== "" || cantidadEventos !== "";
    };

    const [simulationData, setSimulationData] = useState({});
    const [rungeKuttaResults, setRungeKuttaResults] = useState({});
    const [results, setResults] = useState([]);
    const [showNotification, setShowNotification] = useState(false);
    const [notificationClass, setNotificationClass] = useState('');
    const [isLoading, setIsLoading] = useState(false);


    const handleRunSimulation = () => {

        if (simulationData?.length > 0) {
            console.log("Ya se ha ejecutado una simulación. Por favor, reinicie la página para ejecutar una nueva.");
            return;
        }

        setIsLoading(true);

        axios
            .post("http://localhost:8000/simular", {
                config: configParams,
                rungeKutta: rungeKuttaParamsWithXFinal
            })
            .then(response => {
                const data = response.data;
                console.log('Datos:', data);

                const {
                    runge_kutta,
                    cola_maxima,
                    promedio_tiempo_espera,
                    contador_clientes_comienzan_descenso,
                    espera_cola_maxima,
                    eventos,
                    acumulador_tiempos_espera,
                    tiempo_simulacion,
                } = data;

                const resultados = {
                    cola_maxima,
                    promedio_tiempo_espera,
                    contador_clientes_comienzan_descenso,
                    espera_cola_maxima,
                    acumulador_tiempos_espera,
                    tiempo_simulacion
                };

                const simulacion = {
                    eventos,
                };


                setSimulationData(simulacion);

                // console.log(runge_kutta)
                setRungeKuttaResults(runge_kutta);
                // console.log(rungeKuttaResults)

                setResults(resultados);
            })
            .catch(error => {
                console.error('Error al obtener los datos:', error);
            })
            .finally(() => {
                setIsLoading(false); // ✅ Terminó la carga
            });;
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
                    <ConfigurationForm
                        longitudAlfombra={longitudAlfombra}
                        onChangeLongitudAlfombra={handleChangeLongitudAlfombra}
                        onChangeConfig={setConfigParams}
                        triggerNotification={triggerNotification}
                        setSimulationData={setSimulationData} />
                    <RungeKuttaForm
                        xFinal={longitudAlfombra}
                        onChangeXFinal={handleChangeLongitudAlfombra}
                        onChangeRK={setRungeKuttaParams}
                        triggerNotification={triggerNotification}
                        setSimulationData={setSimulationData} />
                </div>

                <div className="flex flex-row items-center justify-center">
                    <SimulationLogic />

                    {isLoading ? (
                        <div className='bg-blue-600 hover:bg-blue-700 text-white text-xl rounded-xl m-4 px-31 py-4'>
                            <TbReload className="animate-spin text-2xl" />
                        </div>
                    ) : (
                        <button
                            className={`m-4 px-12 py-3 ${(!isValidConfig()) ? "bg-zinc-500 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700 cursor-pointer"} text-white text-xl rounded-xl transition `}
                            onClick={handleRunSimulation}
                            title='Ejecutar Simulación'
                            disabled={!isValidConfig()}
                        >
                            Ejecutar Simulación
                        </button>
                    )}
                    <ReloadButton setSimulationData={setSimulationData} />
                </div>
            </section>


            <section id="simulation" className='text-white'>
                <Tabla
                    data={simulationData}
                    rungeKuttaParams={rungeKuttaParamsWithXFinal}
                    rungeKuttaResults={rungeKuttaResults} />
            </section>


            <section id="results" className='text-white'>
                <ResultInterpretation results={results} />
            </section>

        </div>
    );
};

export default Principal;