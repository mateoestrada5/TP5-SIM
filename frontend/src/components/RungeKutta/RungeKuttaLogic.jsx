import React, { useState } from 'react';
import { FaEye } from "react-icons/fa";

import 'katex/dist/katex.min.css';
import { BlockMath, InlineMath } from 'react-katex';

export const formatNumber = (num, dec) => {
        if (num === null || num === undefined || isNaN(num)) return '';
        return Number(num).toFixed(dec);
    };

const RungeKuttaLogic = ({ rungeKuttaParams, rungeKuttaResults }) => {
    const [showModalRungeKuttaLogic, setShowModalRungeKuttaLogic] = useState(false);
    const [showTooltip, setShowTooltip] = useState(false);
    const { t0, x0, h, ecuacionA, ecuacionB, ecuacionC, xFinal } = rungeKuttaParams;

    

    // Fórmulas de Runge-Kutta de orden 4
    const rk4Latex = `
            \\begin{aligned}
            k_1 &= h \\cdot f(x_n, y_n) \\\\
            k_2 &= h \\cdot f\\left(x_n + \\frac{h}{2},\\ y_n + \\frac{1}{2} k_1 \\right) \\\\
            k_3 &= h \\cdot f\\left(x_n + \\frac{h}{2},\\ y_n + \\frac{1}{2} k_2 \\right) \\\\
            k_4 &= h \\cdot f\\left(x_n + h,\\ y_n + k_3 \\right) \\\\
            y_{n+1} &= y_n + \\frac{1}{6} (k_1 + 2 k_2 + 2 k_3 + k_4)
            \\end{aligned}
        `;

    return (
        <div className="relative inline-block">
            <button
                className="text-white hover:text-gray-500 cursor-pointer"
                onClick={() => setShowModalRungeKuttaLogic(true)}
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
            >
                <FaEye />
            </button>
            {showTooltip && (
                <div className="absolute left-1/2 -translate-x-1/2 -top-8 bg-black text-white text-xs rounded px-2 py-1 shadow z-50 pointer-events-none whitespace-nowrap">
                    Cálculo de Runge-Kutta
                </div>
            )}

            {showModalRungeKuttaLogic && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
                    style={{ backdropFilter: 'blur(3px)' }}
                >
                    <div className="bg-zinc-900 rounded-xl shadow-[0_0_40px_5px_white] shadow-white/10 p-8 max-w-[85%] w-full max-h-[85%] relative overflow-y-auto">
                        <button
                            className="absolute top-2 right-2 text-gray-500 hover:text-white text-2xl cursor-pointer"
                            onClick={() => setShowModalRungeKuttaLogic(false)}
                            aria-label="Cerrar"
                        >
                            &times;
                        </button>
                        <h3 className="text-2xl font-bold mb-4 text-center">Lógica de Runge-Kutta</h3>
                        <div className="space-y-4 flex flex-col items-center justify-center">

                            <div>
                                <h4 className="font-semibold text-lg mb-1">Método de Runge-Kutta (Orden 4)</h4>

                                <div className='text-sm text-gray-400 mb-2'>
                                    Para realizar el cálculo del tiempo de descenso de un cliente en la alfombra, se utiliza el método de Runge-Kutta de orden 4. Este método es una técnica numérica para resolver ecuaciones diferenciales ordinarias.
                                    <hr className='text-gray-400/30 m-2' />
                                    Se han seguido las siguientes fórmulas:
                                </div>

                                <div className="bg-zinc-800 rounded-xl p-3 my-2">
                                    <BlockMath math={rk4Latex} />
                                </div>
                            </div>

                            <div className="w-[70%]">
                                <h4 className="font-semibold text-lg mb-1">Parámetros</h4>
                                <div>
                                    <table className="min-w-full text-sm text-left border border-zinc-700 mb-2 table-fixed">
                                        <colgroup>
                                            <col className="w-1/3" />
                                            <col className="w-1/3" />
                                            <col className="w-1/3" />
                                        </colgroup>
                                        <thead>
                                            <tr>
                                                <th className="bg-zinc-800 px-3 py-1">Parámetro</th>
                                                <th className="bg-zinc-800 px-3 py-1">Descripción</th>
                                                <th className="bg-zinc-800 px-3 py-1">Valor</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr>
                                                <td className="border-b border-zinc-700 px-3 py-1">h</td>
                                                <td className="border-b border-zinc-700 px-3 py-1">Paso</td>
                                                <td className="border-b border-zinc-700 px-3 py-1">{`${h}`}</td>
                                            </tr>
                                            <tr>
                                                <td className="border-b border-zinc-700 px-3 py-1">f(x, y)</td>
                                                <td className="border-b border-zinc-700 px-3 py-1">Ecuacion Diferencial</td>
                                                <td className="border-b border-zinc-700 px-3 py-1">
                                                    <InlineMath math={`\\frac{dX}{dt} = ${ecuacionA}\\,x^2 ${ecuacionB >= 0 ? '+ ' + ecuacionB : '- ' + Math.abs(ecuacionB)}\\,x ${ecuacionC >= 0 ? '+ ' + ecuacionC : '- ' + Math.abs(ecuacionC)}`} />
                                                </td>
                                            </tr>
                                            <tr>
                                                <td className="border-b border-zinc-700 px-3 py-1">t<sub>0</sub>, x<sub>0</sub></td>
                                                <td className="border-b border-zinc-700 px-3 py-1">Condición Inicial</td>
                                                <td className="border-b border-zinc-700 px-3 py-1">{`X(${t0}) = ${x0}`}</td>
                                            </tr>
                                            <tr>
                                                <td className="border-b border-zinc-700 px-3 py-1">x<sub>final</sub></td>
                                                <td className="border-b border-zinc-700 px-3 py-1">Condición Final</td>
                                                <td className="border-b border-zinc-700 px-3 py-1">{`X(t) = ${xFinal}`}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <div className='w-[85%]'>
                                <h4 className="font-semibold text-lg mb-1">Tabla</h4>
                                <table className="w-full text-sm text-left border border-zinc-700 mb-2 table-fixed">
                                    <colgroup>
                                        <col className="w-1/8" />
                                        <col className="w-1/8" />
                                        <col className="w-1/8" />
                                        <col className="w-1/8" />
                                        <col className="w-1/8" />
                                        <col className="w-1/8" />
                                        <col className="w-1/8" />
                                        <col className="w-1/8" />
                                    </colgroup>
                                    <thead>
                                        <tr>
                                            <th className="border-b border-zinc-700 bg-zinc-800 px-3 py-1">Número</th>
                                            <th className="border-b border-zinc-700 bg-zinc-800 px-3 py-1">t<sub className='text-sm'>n</sub></th>
                                            <th className="border-b border-zinc-700 bg-zinc-800 px-3 py-1">x<sub className='text-sm'>n</sub></th>
                                            <th className="border-b border-zinc-700 bg-zinc-800 px-3 py-1">k<sub className='text-sm'>1</sub></th>
                                            <th className="border-b border-zinc-700 bg-zinc-800 px-3 py-1">k<sub className='text-sm'>2</sub></th>
                                            <th className="border-b border-zinc-700 bg-zinc-800 px-3 py-1">k<sub className='text-sm'>3</sub></th>
                                            <th className="border-b border-zinc-700 bg-zinc-800 px-3 py-1">k<sub className='text-sm'>4</sub></th>
                                            <th className="border-b border-zinc-700 bg-zinc-800 px-3 py-1">X<sub className='text-sm'>n+1</sub></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {rungeKuttaResults.lineas.map((fila, index) => (
                                            <tr key={index} className="border-t border-zinc-700">
                                                <td className="px-3 py-1">{fila.n}</td>
                                                <td className="px-3 py-1">{formatNumber(fila.t, 6)}</td>
                                                <td className="px-3 py-1">{formatNumber(fila.x, 6)}</td>
                                                <td className="px-3 py-1">{fila.x_sig ? formatNumber(fila.k1, 6) : ""}</td>
                                                <td className="px-3 py-1">{fila.x_sig ? formatNumber(fila.k2, 6) : ""}</td>
                                                <td className="px-3 py-1">{fila.x_sig ? formatNumber(fila.k3, 6) : ""}</td>
                                                <td className="px-3 py-1">{fila.x_sig ? formatNumber(fila.k4, 6) : ""}</td>
                                                <td className="px-3 py-1">{fila.x_sig ? formatNumber(fila.x_sig, 6) : ""}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

export default RungeKuttaLogic;

