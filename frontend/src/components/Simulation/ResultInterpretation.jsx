import React from 'react';

const ResultInterpretation = ({ results }) => {
    if (!results) return null;

    const {
        cola_maxima,
        promedio_tiempo_espera,
        contador_clientes_comienzan_descenso,
        espera_cola_maxima,
        tiempo_simulacion
    } = results;

    const data = [
        {
            label: 'Cola máxima',
            value: cola_maxima,
            description: 'Cantidad máxima de clientes en la cola',
        },
        {
            label: 'Promedio tiempo de espera',
            value: promedio_tiempo_espera,
            description: 'Tiempo promedio que un cliente espera (minutos)',
        },
        {
            label: 'Clientes que comienzan descenso',
            value: contador_clientes_comienzan_descenso,
            description: 'Cantidad de clientes que inician el descenso',
        },
        {
            label: 'Espera en cola máxima',
            value: espera_cola_maxima,
            description: 'Mayor tiempo de espera registrado (minutos)',
        },
        {
            label: 'Tiempo de Simulacion',
            value: tiempo_simulacion,
            description: 'El tiempo que demoro en realizarse la simulación'
        }
    ];

    return (
        <div className="flex flex-wrap gap-6 justify-center my-8">
            {data.map((item, idx) => (
                <div
                    key={idx}
                    className="bg-zinc-900 border border-zinc-700 rounded-xl px-8 py-6 w-90 shadow-md text-center"
                >
                    <div className="text-base text-white mb-2">
                        {item.label}
                    </div>
                    <div className="text-3xl font-bold text-blue-500">
                        {item.value}
                    </div>
                    <div className="text-sm text-zinc-300 mt-2">
                        {item.description}
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ResultInterpretation;
