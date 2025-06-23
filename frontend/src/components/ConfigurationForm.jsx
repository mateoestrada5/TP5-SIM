import React, { useState } from "react";
import { IoMdSettings } from "react-icons/io";

const ConfigurationForm = ({ configParams, onChangeConfig, triggerNotification }) => {
    const [formData, setFormData] = useState({
        condicionCorte: "cantidadEventos",
        tiempoLimite: "",
        clienteX: "",
        cantidadEventos: 1000,
        frecuenciaLlegadaMin: 3.0,
        frecuenciaLlegadaMax: 4.5,
        periodoSuspension: 40,
        periodoLimpieza: 4,
        duracionLimpieza: 20,
        longitudAlfombra: 120,
        colaMaximaHoras: 10,
        cantidadEventosVisualizar: 300,
        eventoInicial: 1,
    });

    const handleChange = (e) => {
        const { name, value, type } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "number" ? Number(value) : value,
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (triggerNotification) triggerNotification();
        onChangeConfig(formData);
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="bg-zinc-900 p-8 rounded-xl shadow space-y-6 border border-zinc-700"
        >
            <div className="flex items-center gap-4 mb-6">
                <IoMdSettings size={32} />
                <p className="font-bold text-start text-lg">Parámetros de la Simulación</p>
                {/* Campo Semilla */}
                <div className="flex items-center gap-2 ml-8">
                    <label className="font-medium text-zinc-100 whitespace-nowrap">
                        Semilla:
                    </label>
                    <input
                        type="number"
                        name="semilla"
                        value={formData.semilla}
                        onChange={handleChange}
                        min={1}
                        required
                        className="w-40 bg-zinc-800 text-zinc-100 border border-zinc-600 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-zinc-400"
                        placeholder="Ej: 1"
                    />
                </div>
            </div>

            {/* Condición de corte */}
            <div className="mb-8">
                <h2 className="font-bold text-md mb-2 text-zinc-100">Condición de corte</h2>
                <div className="flex gap-8 items-center">
                    <label className="flex items-center gap-2 text-zinc-100">
                        <input
                            type="radio"
                            name="condicionCorte"
                            value="cantidadEventos"
                            checked={formData.condicionCorte === "cantidadEventos"}
                            onChange={handleChange}
                        />
                        Cantidad de Eventos
                    </label>
                    <label className="flex items-center gap-2 text-zinc-100">
                        <input
                            type="radio"
                            name="condicionCorte"
                            value="tiempoLimite"
                            checked={formData.condicionCorte === "tiempoLimite"}
                            onChange={handleChange}
                        />
                        Tiempo Límite (minuto máximo de simulación)
                        <input
                            type="number"
                            name="tiempoLimite"
                            value={formData.tiempoLimite}
                            onChange={handleChange}
                            min={1}
                            disabled={formData.condicionCorte !== "tiempoLimite"}
                            className="w-24 ml-2 bg-zinc-800 text-zinc-100 border border-zinc-600 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-zinc-400"
                            placeholder="Ej: 500"
                        />
                    </label>
                    <label className="flex items-center gap-2 text-zinc-100">
                        <input
                            type="radio"
                            name="condicionCorte"
                            value="clienteX"
                            checked={formData.condicionCorte === "clienteX"}
                            onChange={handleChange}
                        />
                        Hasta descenso de cliente X
                        <input
                            type="number"
                            name="clienteX"
                            value={formData.clienteX}
                            onChange={handleChange}
                            min={1}
                            disabled={formData.condicionCorte !== "clienteX"}
                            className="w-24 ml-2 bg-zinc-800 text-zinc-100 border border-zinc-600 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-zinc-400"
                            placeholder="Ej: 50"
                        />
                    </label>
                </div>
            </div>

            <div className="grid grid-cols-3 gap-6">
                {/* Campo 1 */}
                <div className="flex items-center justify-around gap-5">
                    <label className="w-2/5 mb-0 font-medium text-zinc-100">
                        Cantidad de Eventos (N)
                        <span className="text-zinc-400 block text-xs">(por defecto 1000 eventos)</span>
                    </label>
                    <input
                        type="number"
                        name="cantidadEventos"
                        value={formData.cantidadEventos}
                        onChange={handleChange}
                        min={1}
                        required
                        className="w-24 bg-zinc-800 text-zinc-100 border border-zinc-600 rounded px-2 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-zinc-400"
                        placeholder="Ej: 1000"
                        disabled={formData.condicionCorte !== "cantidadEventos"}
                    />
                </div>
                {/* Campo 2: Frecuencia de Llegada (min y max) */}
                <div className="flex items-center justify-around gap-5">
                    <label className="w-2/5 mb-0 font-medium text-zinc-100">
                        Frecuencia de Llegada (minutos, decimal)
                        <span className="text-zinc-400 block text-xs">(ingrese límite inferior y superior, por defecto 3.00 y 4.50)</span>
                    </label>
                    <div className="flex gap-2 items-center">
                        <input
                            type="number"
                            step="0.01"
                            name="frecuenciaLlegadaMin"
                            value={formData.frecuenciaLlegadaMin}
                            onChange={handleChange}
                            min={0}
                            required
                            className="w-20 bg-zinc-800 text-zinc-100 border border-zinc-600 rounded px-2 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-zinc-400"
                            placeholder="Mín"
                        />
                        <span className="text-zinc-100">-</span>
                        <input
                            type="number"
                            step="0.01"
                            name="frecuenciaLlegadaMax"
                            value={formData.frecuenciaLlegadaMax}
                            onChange={handleChange}
                            min={formData.frecuenciaLlegadaMin}
                            required
                            className="w-20 bg-zinc-800 text-zinc-100 border border-zinc-600 rounded px-2 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-zinc-400"
                            placeholder="Máx"
                        />
                    </div>
                </div>
                {/* Campo 3 */}
                <div className="flex items-center justify-around gap-5">
                    <label className="w-2/5 mb-0 font-medium text-zinc-100">
                        Periodo de suspensión (minutos)
                        <span className="text-zinc-400 block text-xs">(por defecto 40 minutos)</span>
                    </label>
                    <input
                        type="number"
                        name="periodoSuspension"
                        value={formData.periodoSuspension}
                        onChange={handleChange}
                        min={1}
                        required
                        className="w-24 bg-zinc-800 text-zinc-100 border border-zinc-600 rounded px-2 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-zinc-400"
                        placeholder="Ej: 40"
                    />
                </div>
                {/* Campo 4 */}
                <div className="flex items-center justify-around gap-5">
                    <label className="w-2/5 mb-0 font-medium text-zinc-100">
                        Periodo de limpieza (horas)
                        <span className="text-zinc-400 block text-xs">(por defecto 4 horas)</span>
                    </label>
                    <input
                        type="number"
                        name="periodoLimpieza"
                        value={formData.periodoLimpieza}
                        onChange={handleChange}
                        min={1}
                        required
                        className="w-24 bg-zinc-800 text-zinc-100 border border-zinc-600 rounded px-2 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-zinc-400"
                        placeholder="Ej: 4"
                    />
                </div>
                {/* Campo 5 */}
                <div className="flex items-center justify-around gap-5">
                    <label className="w-2/5 mb-0 font-medium text-zinc-100">
                        Duración de la limpieza (minutos)
                        <span className="text-zinc-400 block text-xs">(por defecto 20 minutos)</span>
                    </label>
                    <input
                        type="number"
                        name="duracionLimpieza"
                        value={formData.duracionLimpieza}
                        onChange={handleChange}
                        min={1}
                        required
                        className="w-24 bg-zinc-800 text-zinc-100 border border-zinc-600 rounded px-2 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-zinc-400"
                        placeholder="Ej: 20"
                    />
                </div>
                {/* Campo 6 */}
                <div className="flex items-center justify-around gap-5">
                    <label className="w-2/5 mb-0 font-medium text-zinc-100">
                        Longitud de la alfombra mágica (metros)
                        <span className="text-zinc-400 block text-xs">(mayor a 0, por defecto 120 metros)</span>
                    </label>
                    <input
                        type="number"
                        name="longitudAlfombra"
                        value={formData.longitudAlfombra}
                        onChange={handleChange}
                        min={0}
                        required
                        className="w-24 bg-zinc-800 text-zinc-100 border border-zinc-600 rounded px-2 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-zinc-400"
                        placeholder="Ej: 120"
                    />
                </div>
                {/* Campo 7 */}
                <div className="flex items-center justify-around gap-5">
                    <label className="w-2/5 mb-0 font-medium text-zinc-100">
                        Cola máxima al cabo de "Horas"
                        <span className="text-zinc-400 block text-xs">(por defecto 10 horas)</span>
                    </label>
                    <input
                        type="number"
                        name="colaMaximaHoras"
                        value={formData.colaMaximaHoras}
                        onChange={handleChange}
                        min={1}
                        required
                        className="w-24 bg-zinc-800 text-zinc-100 border border-zinc-600 rounded px-2 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-zinc-400"
                        placeholder="Ej: 10"
                    />
                </div>
                {/* Campo 8 */}
                <div className="flex items-center justify-around gap-5">
                    <label className="w-2/5 mb-0 font-medium text-zinc-100">
                        Cantidad de eventos a visualizar
                        <span className="text-zinc-400 block text-xs">(por defecto 300)</span>
                    </label>
                    <input
                        type="number"
                        name="cantidadEventosVisualizar"
                        value={formData.cantidadEventosVisualizar}
                        onChange={handleChange}
                        min={1}
                        required
                        className="w-24 bg-zinc-800 text-zinc-100 border border-zinc-600 rounded px-2 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-zinc-400"
                        placeholder="Ej: 300"
                    />
                </div>
                {/* Campo 9 */}
                <div className="flex items-center justify-around gap-5">
                    <label className="w-2/5 mb-0 font-medium text-zinc-100">
                        Evento Inicial (Número)
                        <span className="text-zinc-400 block text-xs">(a partir de este se muestra la cantidad de eventos siguientes)</span>
                    </label>
                    <input
                        type="number"
                        name="eventoInicial"
                        value={formData.eventoInicial}
                        onChange={handleChange}
                        min={1}
                        required
                        className="w-24 bg-zinc-800 text-zinc-100 border border-zinc-600 rounded px-2 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-zinc-400"
                        placeholder="Ej: 1"
                    />
                </div>
            </div>
            <div className="flex items-center justify-center">
                <button
                    type="submit"
                    className="w-[90%] bg-blue-600 text-white py-2 mt-4 rounded-lg hover:bg-blue-700 transition cursor-pointer"
                >
                    Aplicar Cambios
                </button>
            </div>
        </form>
    );
};

export default ConfigurationForm;