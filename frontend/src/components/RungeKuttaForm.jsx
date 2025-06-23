import React, { useState } from "react";
import { IoMdSettings } from "react-icons/io";

const RungeKuttaForm = ({rungeKuttaParams, onChangeRK, triggerNotification}) => {
    const [formData, setFormData] = useState({
        t0: 0,
        x0: 0,
        h: 0.001,
        ecuacionA: 0.5,
        ecuacionB: -0.2,
        ecuacionC: 5,
        xFinal: 120,
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (triggerNotification) triggerNotification();
        onChangeRK(formData);
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="max-w-2xl mx-auto bg-zinc-900 p-8 rounded-xl shadow space-y-6 border border-zinc-700"
        >
            <div className="flex items-center gap-4 mb-6">
                <IoMdSettings size={32} />
                <p className="font-bold text-start text-lg">Parámetros del Runge-Kutta</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <label className="flex mb-2 font-medium text-zinc-100 gap-2 items-center justify-start">Condición Inicial <p className="text-xl">t₀ :</p></label>
                    <input
                        type="number"
                        name="t0"
                        value={formData.t0}
                        onChange={handleChange}
                        step="any"
                        required
                        className="w-full bg-zinc-800 text-zinc-100 border border-zinc-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-zinc-400"
                        placeholder="t inicial (ej: 0)"
                    />
                </div>
                <div>
                    <label className="flex mb-2 font-medium text-zinc-100 gap-2 items-center justify-start">Condición Inicial <p className="text-xl">x₀ :</p></label>
                    <input
                        type="number"
                        name="x0"
                        value={formData.x0}
                        onChange={handleChange}
                        step="any"
                        required
                        className="w-full bg-zinc-800 text-zinc-100 border border-zinc-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-zinc-400"
                        placeholder="x inicial (ej: 0)"
                    />
                </div>
                <div>
                    <label className="block mb-1 font-medium text-zinc-100">Paso h:</label>
                    <input
                        type="number"
                        name="h"
                        value={formData.h}
                        onChange={handleChange}
                        step="any"
                        min="0"
                        required
                        className="w-full bg-zinc-800 text-zinc-100 border border-zinc-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-zinc-400"
                        placeholder="h (ej: 0.001)"
                    />
                </div>
                <div>
                    <label className="block mb-1 font-medium text-zinc-100">Ecuación A:</label>
                    <input
                        type="number"
                        name="ecuacionA"
                        value={formData.ecuacionA}
                        onChange={handleChange}
                        step="any"
                        required
                        className="w-full bg-zinc-800 text-zinc-100 border border-zinc-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-zinc-400"
                        placeholder="Coeficiente A (ej: 0.5)"
                    />
                </div>
                <div>
                    <label className="block mb-1 font-medium text-zinc-100">Ecuación B:</label>
                    <input
                        type="number"
                        name="ecuacionB"
                        value={formData.ecuacionB}
                        onChange={handleChange}
                        step="any"
                        required
                        className="w-full bg-zinc-800 text-zinc-100 border border-zinc-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-zinc-400"
                        placeholder="Coeficiente B (ej: -0.2)"
                    />
                </div>
                <div>
                    <label className="block mb-1 font-medium text-zinc-100">Ecuación C:</label>
                    <input
                        type="number"
                        name="ecuacionC"
                        value={formData.ecuacionC}
                        onChange={handleChange}
                        step="any"
                        required
                        className="w-full bg-zinc-800 text-zinc-100 border border-zinc-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-zinc-400"
                        placeholder="Coeficiente C (ej: 5)"
                    />
                </div>
                <div>
                    <label className="flex mb-2 font-medium text-zinc-100 gap-2 items-center justify-start">Condición de corte <p className="text-xl">x<sub>final</sub> :</p></label>
                    <input
                        type="number"
                        name="xFinal"
                        value={formData.xFinal}
                        onChange={handleChange}
                        step="any"
                        min="0"
                        required
                        className="w-full bg-zinc-800 text-zinc-100 border border-zinc-600 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-zinc-400"
                        placeholder="x final (ej: 120)"
                    />
                </div>
            </div>
            <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition cursor-pointer"
            >
                Aplicar Cambios
            </button>
        </form>
    );
};

export default RungeKuttaForm;