import React from 'react';
import { useState } from 'react';

const Header = () => {
    const [showModalIntegrantes, setShowModalIntegrantes] = useState(false);

    return (
        <header className="text-center py-8 px-10">
            <h1 className="text-4xl font-bold">Trabajo Práctico N° 5 - Simulación - 4K1</h1>
            <div className='flex flex-row items-center justify-between gap-10'>
                <h2 className="text-xl text-gray-200 mt-2 font-bold">Grupo N°1</h2>
                <h2 className="text-xl text-gray-200 mt-2">Sistema de Línea de Espera - Caso Alfombra Mágica</h2>

                <button
                    className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition cursor-pointer"
                    onClick={() => setShowModalIntegrantes(true)}
                >
                    Integrantes
                </button>
            </div>

            {showModalIntegrantes && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
                    style={{ backdropFilter: 'blur(3px)' }}
                >
                    <div className="bg-zinc-900 rounded-xl shadow-[0_0_40px_5px_white] shadow-white/10 p-8 max-w-2xl w-full relative">
                        <button
                            className="absolute top-2 right-2 text-gray-500 hover:text-white text-2xl cursor-pointer"
                            onClick={() => setShowModalIntegrantes(false)}
                            aria-label="Cerrar"
                        >
                            &times;
                        </button>
                        <h3 className="text-2xl font-bold mb-4 text-center">Integrantes</h3>
                        <table className="w-full text-left border-collapse">
                            <br/>
                            <thead>
                                <tr>
                                    <th className="border-b pb-2">Nombre</th>
                                    <th className="border-b pb-2">Legajo</th>
                                    <th className="border-b pb-2">Correo</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Juan Cruz Ceballos</td>
                                    <td>94239 </td>
                                    <td>juancruzceballos0@gmail.com </td>
                                </tr>
                                <tr>
                                    <td>Facundo Witt</td>
                                    <td>97848 </td>
                                    <td>facu.witt@gmail.com</td>
                                </tr>
                                <tr>
                                    <td> Brollo Lucas Emanuel</td>
                                    <td>93686 </td>
                                    <td>lucasbrollo33@gmail.com</td>
                                </tr>
                                <tr>
                                    <td>Valentina Bermudez</td>
                                    <td>95002 </td>
                                    <td>valenbermudez15@gmail.com</td>
                                </tr>
                                <tr>
                                    <td>Mateo Estrada Uriz</td>
                                    <td>95556 </td>
                                    <td>mateoestrada1403@gmail.com</td>
                                </tr>
                                <tr>
                                    <td>Santiago Stanglino</td>
                                    <td>98577 </td>
                                    <td>santistanglino04@gmail.com</td>
                                </tr>
                                <tr>
                                    <td>Matias Polizzi</td>
                                    <td>94398 </td>
                                    <td>matipolizzi2015@gmail.com</td>
                                </tr>
                                <tr>
                                    <td>Benjamin Castagno</td>
                                    <td>94769 </td>
                                    <td>benjamincastagno13@gmail.com</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </header>
    );
}

export default Header;