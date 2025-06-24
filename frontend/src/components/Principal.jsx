import React, { useState } from 'react';

import Tabla from './Simulation/Tabla';
import Header from './Information/Header';
import ConfigurationForm from './Simulation/ConfigurationForm';
import RungeKuttaForm from './RungeKutta/RungeKuttaForm';
import ResultInterpretation from './Simulation/ResultInterpretation';
import SimulationLogic from './Information/SimulationLogic';

import { FaCheck } from "react-icons/fa6";
import ReloadButton from './Simulation/ReloadButton';

const Principal = () => {
    const [longitudAlfombra, setLongitudAlfombra] = useState(120);

    const [configParams, setConfigParams] = useState({
        condicionCorte: "cantidadEventos",
        tiempoLimite: "",
        clienteX: "",
        cantidadEventos: 1000,
        frecuenciaLlegadaMin: 3.0,
        frecuenciaLlegadaMax: 4.5,
        periodoSuspension: 40,
        periodoLimpieza: 4,
        duracionLimpieza: 20,
        // longitudAlfombra: longitudAlfombra,
        colaMaximaHoras: 10,
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
        // xFinal: longitudAlfombra,
    });

    const configParamsWithLongitudAlfombra = {
        ...configParams,longitudAlfombra: longitudAlfombra
    };

    const rungeKuttaParamsWithXFinal = {
        ...rungeKuttaParams, xFinal: longitudAlfombra
    };

    const handleChangeLongitudAlfombra = (newLongitud) => {
        setLongitudAlfombra(newLongitud);
    };

    const [simulationData, setSimulationData] = useState([]);
    const [rungeKuttaResults, setRungeKuttaResults] = useState({});
    const [results, setResults] = useState([]);
    const [showNotification, setShowNotification] = useState(false);
    const [notificationClass, setNotificationClass] = useState('');

    const handleRunSimulation = () => {

        if (simulationData.length > 0) {
            return (
                console.log("Ya se ha ejecutado una simulación. Por favor, reinicie la página para ejecutar una nueva.")
            )}
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

        const mockData = {
            data: [
                {
                    "numero": 1,
                    "reloj": 12.5,
                    "evento": "LLEGADA (3)",
                    "rnd_ll": 0.67,
                    "tiempo_ll": 5.4,
                    "hora_ll": 17.9,
                    "tiempo_descenso": "",
                    "hora_fin_descenso": 18.1,
                    "id_cliente_descenso": 2,
                    "proxima_suspension": 30.0,
                    "proxima_limpieza": 35.0,
                    "tiempo_limpieza": 3.0,
                    "fin_limpieza": 38.0,
                    "estado_alfombra": "OCUPADA",
                    "cola": 2
                },
                {
                    "numero": 2,
                    "reloj": 18.1,
                    "evento": "FIN DESCENSO (2)",
                    "rnd_ll": "",
                    "tiempo_ll": "",
                    "hora_ll": 22.1,
                    "tiempo_descenso": 7.8,
                    "hora_fin_descenso": 25.9,
                    "id_cliente_descenso": 3,
                    "proxima_suspension": 30.0,
                    "proxima_limpieza": 35.0,
                    "tiempo_limpieza": 3.0,
                    "fin_limpieza": 38.0,
                    "estado_alfombra": "OCUPADA",
                    "cola": 1
                },
                {
                    "numero": 3,
                    "reloj": 17.9,
                    "evento": "LLEGADA (4)",
                    "rnd_ll": 0.88,
                    "tiempo_ll": 6.0,
                    "hora_ll": 31.3,
                    "tiempo_descenso": "",
                    "hora_fin_descenso": 25.9,
                    "id_cliente_descenso": 3,
                    "proxima_suspension": 30.0,
                    "proxima_limpieza": 35.0,
                    "tiempo_limpieza": 3.0,
                    "fin_limpieza": 38.0,
                    "estado_alfombra": "OCUPADA",
                    "cola": 2
                },
                {
                    "numero": 1,
                    "reloj": 12.5,
                    "evento": "LLEGADA (3)",
                    "rnd_ll": 0.67,
                    "tiempo_ll": 5.4,
                    "hora_ll": 17.9,
                    "tiempo_descenso": "",
                    "hora_fin_descenso": 18.1,
                    "id_cliente_descenso": 2,
                    "proxima_suspension": 30.0,
                    "proxima_limpieza": 35.0,
                    "tiempo_limpieza": 3.0,
                    "fin_limpieza": 38.0,
                    "estado_alfombra": "OCUPADA",
                    "cola": 2
                },
                {
                    "numero": 2,
                    "reloj": 18.1,
                    "evento": "FIN DESCENSO (2)",
                    "rnd_ll": "",
                    "tiempo_ll": "",
                    "hora_ll": 22.1,
                    "tiempo_descenso": 7.8,
                    "hora_fin_descenso": 25.9,
                    "id_cliente_descenso": 3,
                    "proxima_suspension": 30.0,
                    "proxima_limpieza": 35.0,
                    "tiempo_limpieza": 3.0,
                    "fin_limpieza": 38.0,
                    "estado_alfombra": "OCUPADA",
                    "cola": 1
                },
                {
                    "numero": 3,
                    "reloj": 17.9,
                    "evento": "LLEGADA (4)",
                    "rnd_ll": 0.88,
                    "tiempo_ll": 6.0,
                    "hora_ll": 31.3,
                    "tiempo_descenso": "",
                    "hora_fin_descenso": 25.9,
                    "id_cliente_descenso": 3,
                    "proxima_suspension": 30.0,
                    "proxima_limpieza": 35.0,
                    "tiempo_limpieza": 3.0,
                    "fin_limpieza": 38.0,
                    "estado_alfombra": "OCUPADA",
                    "cola": 2
                },
                {
                    "numero": 1,
                    "reloj": 12.5,
                    "evento": "LLEGADA (3)",
                    "rnd_ll": 0.67,
                    "tiempo_ll": 5.4,
                    "hora_ll": 17.9,
                    "tiempo_descenso": "",
                    "hora_fin_descenso": 18.1,
                    "id_cliente_descenso": 2,
                    "proxima_suspension": 30.0,
                    "proxima_limpieza": 35.0,
                    "tiempo_limpieza": 3.0,
                    "fin_limpieza": 38.0,
                    "estado_alfombra": "OCUPADA",
                    "cola": 2
                },
                {
                    "numero": 2,
                    "reloj": 18.1,
                    "evento": "FIN DESCENSO (2)",
                    "rnd_ll": "",
                    "tiempo_ll": "",
                    "hora_ll": 22.1,
                    "tiempo_descenso": 7.8,
                    "hora_fin_descenso": 25.9,
                    "id_cliente_descenso": 3,
                    "proxima_suspension": 30.0,
                    "proxima_limpieza": 35.0,
                    "tiempo_limpieza": 3.0,
                    "fin_limpieza": 38.0,
                    "estado_alfombra": "OCUPADA",
                    "cola": 1
                },
                {
                    "numero": 3,
                    "reloj": 17.9,
                    "evento": "LLEGADA (4)",
                    "rnd_ll": 0.88,
                    "tiempo_ll": 6.0,
                    "hora_ll": 31.3,
                    "tiempo_descenso": "",
                    "hora_fin_descenso": 25.9,
                    "id_cliente_descenso": 3,
                    "proxima_suspension": 30.0,
                    "proxima_limpieza": 35.0,
                    "tiempo_limpieza": 3.0,
                    "fin_limpieza": 38.0,
                    "estado_alfombra": "OCUPADA",
                    "cola": 2
                },
                {
                    "numero": 1,
                    "reloj": 12.5,
                    "evento": "LLEGADA (3)",
                    "rnd_ll": 0.67,
                    "tiempo_ll": 5.4,
                    "hora_ll": 17.9,
                    "tiempo_descenso": "",
                    "hora_fin_descenso": 18.1,
                    "id_cliente_descenso": 2,
                    "proxima_suspension": 30.0,
                    "proxima_limpieza": 35.0,
                    "tiempo_limpieza": 3.0,
                    "fin_limpieza": 38.0,
                    "estado_alfombra": "OCUPADA",
                    "cola": 2
                },
                {
                    "numero": 2,
                    "reloj": 18.1,
                    "evento": "FIN DESCENSO (2)",
                    "rnd_ll": "",
                    "tiempo_ll": "",
                    "hora_ll": 22.1,
                    "tiempo_descenso": 7.8,
                    "hora_fin_descenso": 25.9,
                    "id_cliente_descenso": 3,
                    "proxima_suspension": 30.0,
                    "proxima_limpieza": 35.0,
                    "tiempo_limpieza": 3.0,
                    "fin_limpieza": 38.0,
                    "estado_alfombra": "OCUPADA",
                    "cola": 1
                },
                {
                    "numero": 3,
                    "reloj": 17.9,
                    "evento": "LLEGADA (4)",
                    "rnd_ll": 0.88,
                    "tiempo_ll": 6.0,
                    "hora_ll": 31.3,
                    "tiempo_descenso": "",
                    "hora_fin_descenso": 25.9,
                    "id_cliente_descenso": 3,
                    "proxima_suspension": 30.0,
                    "proxima_limpieza": 35.0,
                    "tiempo_limpieza": 3.0,
                    "fin_limpieza": 38.0,
                    "estado_alfombra": "OCUPADA",
                    "cola": 2
                },
            ]
        };
        setSimulationData(mockData.data);

        const mockRKResults = [
            {
                "numero": 1,
                "tn": 0,
                "xn": 0,
                "k1": 0,
                "k2": 0,
                "k3": 0.001,
                "k4": 0.5,
                "xn_1": -0.2
            },
            {
                "numero": 2,
                "tn": 0,
                "xn": 0,
                "k1": 0,
                "k2": 0,
                "k3": 0.001,
                "k4": 0.5,
                "xn_1": -0.2
            },
            {
                "numero": 3,
                "tn": 0,
                "xn": 0,
                "k1": 0,
                "k2": 0,
                "k3": 0.001,
                "k4": 0.5,
                "xn_1": -0.2
            },
            {
                "numero": 4,
                "tn": 0,
                "xn": 0,
                "k1": 0,
                "k2": 0,
                "k3": 0.001,
                "k4": 0.5,
                "xn_1": -0.2
            },
            {
                "numero": 5,
                "tn": 0,
                "xn": 0,
                "k1": 0,
                "k2": 0,
                "k3": 0.001,
                "k4": 0.5,
                "xn_1": -0.2
            },
            {
                "numero": 6,
                "tn": 0,
                "xn": 0,
                "k1": 0,
                "k2": 0,
                "k3": 0.001,
                "k4": 0.5,
                "xn_1": -0.2
            },
            {
                "numero": 7,
                "tn": 0,
                "xn": 0,
                "k1": 0,
                "k2": 0,
                "k3": 0.001,
                "k4": 0.5,
                "xn_1": -0.2
            },
            {
                "numero": 8,
                "tn": 0,
                "xn": 0,
                "k1": 0,
                "k2": 0,
                "k3": 0.001,
                "k4": 0.5,
                "xn_1": -0.2
            },
            {
                "numero": 9,
                "tn": 0,
                "xn": 0,
                "k1": 0,
                "k2": 0,
                "k3": 0.001,
                "k4": 0.5,
                "xn_1": -0.2
            },
            {
                "numero": 10,
                "tn": 0,
                "xn": 0,
                "k1": 0,
                "k2": 0,
                "k3": 0.001,
                "k4": 0.5,
                "xn_1": -0.2
            },
        ];
        setRungeKuttaResults(mockRKResults);

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
                    <button
                        className={`m-4 px-12 py-3 ${(simulationData.length > 0) ? "bg-zinc-500" : "bg-blue-600 hover:bg-blue-700 cursor-pointer"} text-white text-xl rounded-xl transition `}
                        onClick={handleRunSimulation}
                        title='Ejecutar Simulación'
                    >
                        Ejecutar Simulación
                    </button>
                    <ReloadButton setSimulationData={setSimulationData} />
                </div>
            </section>


            <section id="simulation" className='text-white'>
                <Tabla 
                    data={simulationData} 
                    rungeKuttaParams={rungeKuttaParamsWithXFinal} 
                    rungeKuttaResults={rungeKuttaResults} />
            </section>

            {/* resultados */}
            <section id="results" className='text-white'>
                <ResultInterpretation results={results} />
            </section>

        </div>
    );
};

export default Principal;