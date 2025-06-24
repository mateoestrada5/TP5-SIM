import React, {useState} from 'react';

import 'katex/dist/katex.min.css';
import { BlockMath } from 'react-katex';

import { IoIosInformationCircleOutline } from "react-icons/io";

const SimulationLogic = () => {

    const [showModalSimulationLogic, setShowModalSimulationLogic] = useState(false);
    const [showTooltip, setShowTooltip] = useState(false);

    return (
        <div className="relative inline-block">
            <button
                className="p-3 bg-zinc-700 text-white rounded-full text-xl hover:bg-zinc-600 transition cursor-pointer"
                onClick={() => setShowModalSimulationLogic(true)}
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
            >
                <IoIosInformationCircleOutline />
            </button>
            {showTooltip && (
                <div className="absolute left-1/2 -translate-x-1/2 -top-8 bg-black text-white text-xs rounded px-2 py-1 shadow z-50 pointer-events-none whitespace-nowrap">
                    Información sobre el caso
                </div>
            )}

            {showModalSimulationLogic && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
                    style={{ backdropFilter: 'blur(3px)' }}
                >
                    <div className="bg-zinc-900 rounded-xl shadow-[0_0_40px_5px_white] shadow-white/10 p-8 max-w-2xl w-full relative">
                        <button
                            className="absolute top-2 right-2 text-zinc-500 hover:text-white text-2xl cursor-pointer"
                            onClick={() => setShowModalSimulationLogic(false)}
                            aria-label="Cerrar"
                        >
                            &times;
                        </button>
                        <h3 className="text-2xl font-bold mb-4 text-center">Lógica de Simulación</h3>
                        <div className="space-y-4">
                            <div>
                                <h4 className="font-semibold text-lg mb-1">Objetos | Estados de Objeto</h4>
                                <table className="min-w-full text-sm text-left border border-zinc-700 mb-2">
                                    <thead>
                                        <tr>
                                            <th className="border-b border-zinc-700 px-3 py-1">Nombre</th>
                                            <th className="border-b border-zinc-700 px-3 py-1">Estados</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td className="border-b border-zinc-700 px-3 py-1">Cliente</td>
                                            <td className="border-b border-zinc-700 px-3 py-1">Creado, Esperando Atención, Siendo Atendido</td>
                                        </tr>
                                        <tr>
                                            <td className="px-3 py-1">Alfombra</td>
                                            <td className="px-3 py-1">Libre, Ocupado, En Limpieza, En Suspensión</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div>
                                <h4 className="font-semibold text-lg mb-1">Eventos</h4>
                                <ul className="list-disc list-inside space-y-1 pl-2">
                                    <li>Inicialización</li>
                                    <li>Llegada de cliente (cli-i)</li>
                                    <li>Fin de descenso (cli-i)</li>
                                    <li>Fin de suspensión</li>
                                    <li>Fin de limpieza</li>
                                    <li>Fin de simulación</li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="font-semibold text-lg mb-1">Cantidad de colas</h4>
                                <p>1 (Uno)</p>
                            </div>
                            <div>
                                <h4 className="font-semibold text-lg mb-1">Ecuación Diferencial</h4>
                                <p>
                                    <span className="px-2 py-1 rounded font-mono text-base">
                                        <BlockMath math="\frac{dX}{dt} = 0.5x^2 - 0.2x + 5" />
                                    </span>
                                </p>
                            </div>
                            <div>
                                <h4 className="font-semibold text-lg mb-1">Distribuciones y Tiempos:</h4>
                                <ul className="list-disc list-inside space-y-1 pl-2">
                                    <li>Llegada de Clientes: Distribución Uniforme (3; 4.5) minutos</li>
                                    <li>Periodo de Suspensión: 40 minutos</li>
                                    <li>Periodo de Limpieza: 4 horas</li>
                                    <li>Duración de Limpieza: 20 minutos</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default SimulationLogic;