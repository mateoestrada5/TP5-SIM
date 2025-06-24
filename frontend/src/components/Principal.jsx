import React, { useState } from 'react';

import Tabla from './Simulation/Tabla';
import Header from './Information/Header';
import ConfigurationForm from './Simulation/ConfigurationForm';
import RungeKuttaForm from './RungeKutta/RungeKuttaForm';
import ResultInterpretation from './Simulation/ResultInterpretation';
import SimulationLogic from './Information/SimulationLogic';

import { FaCheck } from "react-icons/fa6";
import ReloadButton from './Simulation/ReloadButton';
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
        periodoLimpieza: 4,
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

    const [simulationData, setSimulationData] = useState([]);
    const [rungeKuttaResults, setRungeKuttaResults] = useState({});
    const [results, setResults] = useState([]);
    const [showNotification, setShowNotification] = useState(false);
    const [notificationClass, setNotificationClass] = useState('');

    const API_URL = "http://127.0.0.1:8000";

    const handleRunSimulation = () => {

        if (simulationData.length > 0) {
            console.log("Ya se ha ejecutado una simulación. Por favor, reinicie la página para ejecutar una nueva.");
            return;
        }

        axios
            .get(`http://127.0.0.1:8000/test-post-new`)
            .then(response => {
                const data = response.data;
                console.log('Datos de la simulación:', data);

            })
            .catch(error => {
                console.error('Error al ejecutar la simulación:', error);
            });



        // const mockData = {
        //     data: [
        //         {
        //             "evento": "Inicialización",
        //             "id_cliente": "",
        //             "reloj": "0.00",
        //             "rnd_ll": 0.1838,
        //             "tiempo_ll": 3.1838,
        //             "hora_ll": 3.1838,
        //             "tiempo_descenso": "",
        //             "hora_fin_descenso": "",
        //             "id_cliente_descenso": "",
        //             "prox_suspension": 30,
        //             "prox_limpieza": 50,
        //             "fin_limpieza": "",
        //             "estado_alfombra": "L",
        //             "cola": 0,
        //             "acumulador_tiempo_espera": 0,
        //             "clientes_comienzan_atencion": 0,
        //             "cola_maxima_actual": 0,
        //             "espera_maxima_cola": 0,
        //             "clientes": []
        //         },
        //         {
        //             "evento": "Llegada Cliente",
        //             "id_cliente": 1,
        //             "reloj": "3.18",
        //             "rnd_ll": 0.4371,
        //             "tiempo_ll": 3.4371,
        //             "hora_ll": 6.6209,
        //             "tiempo_descenso": 4.612,
        //             "hora_fin_descenso": 7.7958,
        //             "id_cliente_descenso": 1,
        //             "prox_suspension": 30,
        //             "prox_limpieza": 50,
        //             "fin_limpieza": "",
        //             "estado_alfombra": "O",
        //             "cola": 0,
        //             "acumulador_tiempo_espera": 0,
        //             "clientes_comienzan_atencion": 1,
        //             "cola_maxima_actual": 0,
        //             "espera_maxima_cola": 0,
        //             "clientes": [
        //                 {
        //                     "id_cliente": 1,
        //                     "estado": "SA",
        //                     "hora_llegada": 3.1838
        //                 }
        //             ]
        //         },
        //         {
        //             "evento": "Llegada Cliente",
        //             "id_cliente": 2,
        //             "reloj": "6.62",
        //             "rnd_ll": 0.9072,
        //             "tiempo_ll": 3.9072,
        //             "hora_ll": 10.5281,
        //             "tiempo_descenso": "",
        //             "hora_fin_descenso": 7.7958,
        //             "id_cliente_descenso": 1,
        //             "prox_suspension": 30,
        //             "prox_limpieza": 50,
        //             "fin_limpieza": "",
        //             "estado_alfombra": "O",
        //             "cola": 1,
        //             "acumulador_tiempo_espera": 0,
        //             "clientes_comienzan_atencion": 1,
        //             "cola_maxima_actual": 1,
        //             "espera_maxima_cola": 0,
        //             "clientes": [
        //                 {
        //                     "id_cliente": 1,
        //                     "estado": "SA",
        //                     "hora_llegada": 3.1838
        //                 },
        //                 {
        //                     "id_cliente": 2,
        //                     "estado": "EA",
        //                     "hora_llegada": 6.6209
        //                 }
        //             ]
        //         },
        //         {
        //             "evento": "Fin Descenso",
        //             "id_cliente": 1,
        //             "reloj": "7.80",
        //             "rnd_ll": "",
        //             "tiempo_ll": "",
        //             "hora_ll": 10.5281,
        //             "tiempo_descenso": 4.612,
        //             "hora_fin_descenso": 12.4078,
        //             "id_cliente_descenso": 2,
        //             "prox_suspension": 30,
        //             "prox_limpieza": 50,
        //             "fin_limpieza": "",
        //             "estado_alfombra": "O",
        //             "cola": 0,
        //             "acumulador_tiempo_espera": 1.1749,
        //             "clientes_comienzan_atencion": 2,
        //             "cola_maxima_actual": 1,
        //             "espera_maxima_cola": 1.1749,
        //             "clientes": [
        //                 {
        //                     "id_cliente": 2,
        //                     "estado": "SA",
        //                     "hora_llegada": 6.6209
        //                 }
        //             ]
        //         },
        //         {
        //             "evento": "Llegada Cliente",
        //             "id_cliente": 3,
        //             "reloj": "10.53",
        //             "rnd_ll": 0.5531,
        //             "tiempo_ll": 3.5531,
        //             "hora_ll": 14.0812,
        //             "tiempo_descenso": "",
        //             "hora_fin_descenso": 12.4078,
        //             "id_cliente_descenso": 2,
        //             "prox_suspension": 30,
        //             "prox_limpieza": 50,
        //             "fin_limpieza": "",
        //             "estado_alfombra": "O",
        //             "cola": 1,
        //             "acumulador_tiempo_espera": 1.1749,
        //             "clientes_comienzan_atencion": 2,
        //             "cola_maxima_actual": 1,
        //             "espera_maxima_cola": 1.1749,
        //             "clientes": [
        //                 {
        //                     "id_cliente": 2,
        //                     "estado": "SA",
        //                     "hora_llegada": 6.6209
        //                 },
        //                 {
        //                     "id_cliente": 3,
        //                     "estado": "EA",
        //                     "hora_llegada": 10.5281
        //                 }
        //             ]
        //         },
        //         {
        //             "evento": "Fin Descenso",
        //             "id_cliente": 2,
        //             "reloj": "12.41",
        //             "rnd_ll": "",
        //             "tiempo_ll": "",
        //             "hora_ll": 14.0812,
        //             "tiempo_descenso": 4.612,
        //             "hora_fin_descenso": 17.0198,
        //             "id_cliente_descenso": 3,
        //             "prox_suspension": 30,
        //             "prox_limpieza": 50,
        //             "fin_limpieza": "",
        //             "estado_alfombra": "O",
        //             "cola": 0,
        //             "acumulador_tiempo_espera": 3.0546,
        //             "clientes_comienzan_atencion": 3,
        //             "cola_maxima_actual": 1,
        //             "espera_maxima_cola": 1.8797,
        //             "clientes": [
        //                 {
        //                     "id_cliente": 3,
        //                     "estado": "SA",
        //                     "hora_llegada": 10.5281
        //                 }
        //             ]
        //         },
        //         {
        //             "evento": "Llegada Cliente",
        //             "id_cliente": 4,
        //             "reloj": "14.08",
        //             "rnd_ll": 0.6126,
        //             "tiempo_ll": 3.6126,
        //             "hora_ll": 17.6938,
        //             "tiempo_descenso": "",
        //             "hora_fin_descenso": 17.0198,
        //             "id_cliente_descenso": 3,
        //             "prox_suspension": 30,
        //             "prox_limpieza": 50,
        //             "fin_limpieza": "",
        //             "estado_alfombra": "O",
        //             "cola": 1,
        //             "acumulador_tiempo_espera": 3.0546,
        //             "clientes_comienzan_atencion": 3,
        //             "cola_maxima_actual": 1,
        //             "espera_maxima_cola": 1.8797,
        //             "clientes": [
        //                 {
        //                     "id_cliente": 3,
        //                     "estado": "SA",
        //                     "hora_llegada": 10.5281
        //                 },
        //                 {
        //                     "id_cliente": 4,
        //                     "estado": "EA",
        //                     "hora_llegada": 14.0812
        //                 }
        //             ]
        //         },
        //         {
        //             "evento": "Fin Descenso",
        //             "id_cliente": 3,
        //             "reloj": "17.02",
        //             "rnd_ll": "",
        //             "tiempo_ll": "",
        //             "hora_ll": 17.6938,
        //             "tiempo_descenso": 4.612,
        //             "hora_fin_descenso": 21.6318,
        //             "id_cliente_descenso": 4,
        //             "prox_suspension": 30,
        //             "prox_limpieza": 50,
        //             "fin_limpieza": "",
        //             "estado_alfombra": "O",
        //             "cola": 0,
        //             "acumulador_tiempo_espera": 5.9932,
        //             "clientes_comienzan_atencion": 4,
        //             "cola_maxima_actual": 1,
        //             "espera_maxima_cola": 2.9386,
        //             "clientes": [
        //                 {
        //                     "id_cliente": 4,
        //                     "estado": "SA",
        //                     "hora_llegada": 14.0812
        //                 }
        //             ]
        //         },
        //         {
        //             "evento": "Llegada Cliente",
        //             "id_cliente": 5,
        //             "reloj": "17.69",
        //             "rnd_ll": 0.2877,
        //             "tiempo_ll": 3.2877,
        //             "hora_ll": 20.9815,
        //             "tiempo_descenso": "",
        //             "hora_fin_descenso": 21.6318,
        //             "id_cliente_descenso": 4,
        //             "prox_suspension": 30,
        //             "prox_limpieza": 50,
        //             "fin_limpieza": "",
        //             "estado_alfombra": "O",
        //             "cola": 1,
        //             "acumulador_tiempo_espera": 5.9932,
        //             "clientes_comienzan_atencion": 4,
        //             "cola_maxima_actual": 1,
        //             "espera_maxima_cola": 2.9386,
        //             "clientes": [
        //                 {
        //                     "id_cliente": 4,
        //                     "estado": "SA",
        //                     "hora_llegada": 14.0812
        //                 },
        //                 {
        //                     "id_cliente": 5,
        //                     "estado": "EA",
        //                     "hora_llegada": 17.6938
        //                 }
        //             ]
        //         },
        //         {
        //             "evento": "Llegada Cliente",
        //             "id_cliente": 6,
        //             "reloj": "20.98",
        //             "rnd_ll": 0.8843,
        //             "tiempo_ll": 3.8843,
        //             "hora_ll": 24.8658,
        //             "tiempo_descenso": "",
        //             "hora_fin_descenso": 21.6318,
        //             "id_cliente_descenso": 4,
        //             "prox_suspension": 30,
        //             "prox_limpieza": 50,
        //             "fin_limpieza": "",
        //             "estado_alfombra": "O",
        //             "cola": 2,
        //             "acumulador_tiempo_espera": 5.9932,
        //             "clientes_comienzan_atencion": 4,
        //             "cola_maxima_actual": 2,
        //             "espera_maxima_cola": 2.9386,
        //             "clientes": [
        //                 {
        //                     "id_cliente": 4,
        //                     "estado": "SA",
        //                     "hora_llegada": 14.0812
        //                 },
        //                 {
        //                     "id_cliente": 5,
        //                     "estado": "EA",
        //                     "hora_llegada": 17.6938
        //                 },
        //                 {
        //                     "id_cliente": 6,
        //                     "estado": "EA",
        //                     "hora_llegada": 20.9815
        //                 }
        //             ]
        //         },
        //         {
        //             "evento": "Fin Descenso",
        //             "id_cliente": 4,
        //             "reloj": "21.63",
        //             "rnd_ll": "",
        //             "tiempo_ll": "",
        //             "hora_ll": 24.8658,
        //             "tiempo_descenso": 4.612,
        //             "hora_fin_descenso": 26.2438,
        //             "id_cliente_descenso": 5,
        //             "prox_suspension": 30,
        //             "prox_limpieza": 50,
        //             "fin_limpieza": "",
        //             "estado_alfombra": "O",
        //             "cola": 1,
        //             "acumulador_tiempo_espera": 9.9312,
        //             "clientes_comienzan_atencion": 5,
        //             "cola_maxima_actual": 2,
        //             "espera_maxima_cola": 3.938,
        //             "clientes": [
        //                 {
        //                     "id_cliente": 5,
        //                     "estado": "SA",
        //                     "hora_llegada": 17.6938
        //                 },
        //                 {
        //                     "id_cliente": 6,
        //                     "estado": "EA",
        //                     "hora_llegada": 20.9815
        //                 }
        //             ]
        //         },
        //         {
        //             "evento": "Llegada Cliente",
        //             "id_cliente": 7,
        //             "reloj": "24.87",
        //             "rnd_ll": 0.8807,
        //             "tiempo_ll": 3.8807,
        //             "hora_ll": 28.7465,
        //             "tiempo_descenso": "",
        //             "hora_fin_descenso": 26.2438,
        //             "id_cliente_descenso": 5,
        //             "prox_suspension": 30,
        //             "prox_limpieza": 50,
        //             "fin_limpieza": "",
        //             "estado_alfombra": "O",
        //             "cola": 2,
        //             "acumulador_tiempo_espera": 9.9312,
        //             "clientes_comienzan_atencion": 5,
        //             "cola_maxima_actual": 2,
        //             "espera_maxima_cola": 3.938,
        //             "clientes": [
        //                 {
        //                     "id_cliente": 5,
        //                     "estado": "SA",
        //                     "hora_llegada": 17.6938
        //                 },
        //                 {
        //                     "id_cliente": 6,
        //                     "estado": "EA",
        //                     "hora_llegada": 20.9815
        //                 },
        //                 {
        //                     "id_cliente": 7,
        //                     "estado": "EA",
        //                     "hora_llegada": 24.8658
        //                 }
        //             ]
        //         },
        //         {
        //             "evento": "Fin Descenso",
        //             "id_cliente": 5,
        //             "reloj": "26.24",
        //             "rnd_ll": "",
        //             "tiempo_ll": "",
        //             "hora_ll": 28.7465,
        //             "tiempo_descenso": 4.612,
        //             "hora_fin_descenso": 30.8558,
        //             "id_cliente_descenso": 6,
        //             "prox_suspension": 30,
        //             "prox_limpieza": 50,
        //             "fin_limpieza": "",
        //             "estado_alfombra": "O",
        //             "cola": 1,
        //             "acumulador_tiempo_espera": 15.1935,
        //             "clientes_comienzan_atencion": 6,
        //             "cola_maxima_actual": 2,
        //             "espera_maxima_cola": 5.2623,
        //             "clientes": [
        //                 {
        //                     "id_cliente": 6,
        //                     "estado": "SA",
        //                     "hora_llegada": 20.9815
        //                 },
        //                 {
        //                     "id_cliente": 7,
        //                     "estado": "EA",
        //                     "hora_llegada": 24.8658
        //                 }
        //             ]
        //         },
        //     ]
        // };
        // setSimulationData(mockData.data);

        // const mockRKResults = [
        //     {
        //         "numero": 1,
        //         "tn": 0,
        //         "xn": 0,
        //         "k1": 0,
        //         "k2": 0,
        //         "k3": 0.001,
        //         "k4": 0.5,
        //         "xn_1": -0.2
        //     },
        //     {
        //         "numero": 2,
        //         "tn": 0,
        //         "xn": 0,
        //         "k1": 0,
        //         "k2": 0,
        //         "k3": 0.001,
        //         "k4": 0.5,
        //         "xn_1": -0.2
        //     },
        //     {
        //         "numero": 3,
        //         "tn": 0,
        //         "xn": 0,
        //         "k1": 0,
        //         "k2": 0,
        //         "k3": 0.001,
        //         "k4": 0.5,
        //         "xn_1": -0.2
        //     },
        //     {
        //         "numero": 4,
        //         "tn": 0,
        //         "xn": 0,
        //         "k1": 0,
        //         "k2": 0,
        //         "k3": 0.001,
        //         "k4": 0.5,
        //         "xn_1": -0.2
        //     },
        //     {
        //         "numero": 5,
        //         "tn": 0,
        //         "xn": 0,
        //         "k1": 0,
        //         "k2": 0,
        //         "k3": 0.001,
        //         "k4": 0.5,
        //         "xn_1": -0.2
        //     },
        //     {
        //         "numero": 6,
        //         "tn": 0,
        //         "xn": 0,
        //         "k1": 0,
        //         "k2": 0,
        //         "k3": 0.001,
        //         "k4": 0.5,
        //         "xn_1": -0.2
        //     },
        //     {
        //         "numero": 7,
        //         "tn": 0,
        //         "xn": 0,
        //         "k1": 0,
        //         "k2": 0,
        //         "k3": 0.001,
        //         "k4": 0.5,
        //         "xn_1": -0.2
        //     },
        //     {
        //         "numero": 8,
        //         "tn": 0,
        //         "xn": 0,
        //         "k1": 0,
        //         "k2": 0,
        //         "k3": 0.001,
        //         "k4": 0.5,
        //         "xn_1": -0.2
        //     },
        //     {
        //         "numero": 9,
        //         "tn": 0,
        //         "xn": 0,
        //         "k1": 0,
        //         "k2": 0,
        //         "k3": 0.001,
        //         "k4": 0.5,
        //         "xn_1": -0.2
        //     },
        //     {
        //         "numero": 10,
        //         "tn": 0,
        //         "xn": 0,
        //         "k1": 0,
        //         "k2": 0,
        //         "k3": 0.001,
        //         "k4": 0.5,
        //         "xn_1": -0.2
        //     },
        // ];
        // setRungeKuttaResults(mockRKResults);

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