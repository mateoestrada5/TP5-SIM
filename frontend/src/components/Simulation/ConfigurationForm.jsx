import React, { useState } from "react";
import { IoMdSettings } from "react-icons/io";

const ConfigurationForm = ({ longitudAlfombra, onChangeLongitudAlfombra, onChangeConfig, triggerNotification, setSimulationData }) => {
    const [isDirty, setIsDirty] = useState(false);

    const [formData, setFormData] = useState({
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
        longitudAlfombra: longitudAlfombra,
        colaEsperaMaximaHoras: 10,
        cantidadEventosVisualizar: 300,
        eventoInicial: 1,
        condicionCorte: "",
    });

    const handleChange = (e) => {
        const { name, value, type } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "number" ? Number(value) : value,
        }));
        setIsDirty(true);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setSimulationData({})
        if (triggerNotification) triggerNotification();
        const { condicionCorte, longitudAlfombra, ...formDataFiltered } = formData;
        onChangeConfig(formDataFiltered);
        setIsDirty(false);
    };

    const isFormIncomplete =
        !formData.condicionCorte || formData.condicionCorte === "";

    return (
        <form
            onSubmit={handleSubmit}
            className="bg-zinc-900 min-h-175 p-8 rounded-xl shadow space-y-6 border border-zinc-700"
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
                        value={formData.semilla || ''}
                        onChange={handleChange}
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
                        <span>Seleccionar condición:</span>
                        <select
                            name="condicionCorte"
                            value={formData.condicionCorte || ""}
                            onChange={e => {
                                setFormData(prev => ({
                                    ...prev,
                                    condicionCorte: e.target.value,
                                    cantidadEventos: "",
                                    tiempoLimite: "",
                                    clienteX: ""
                                }));
                            }}
                            className="ml-2 bg-zinc-800 text-zinc-100 border border-zinc-600 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">Seleccione...</option>
                            <option value="cantidadEventos">Cantidad de Eventos</option>
                            <option value="tiempoLimite">Tiempo Límite</option>
                            <option value="clienteX">Hasta descenso de cliente X</option>
                        </select>
                    </label>
                    {formData.condicionCorte === "cantidadEventos" && (
                        <div className="flex items-center gap-2">
                            <label className="text-zinc-100">Cantidad de Eventos:</label>
                            <input
                                type="number"
                                name="cantidadEventos"
                                value={formData.cantidadEventos}
                                onChange={handleChange}
                                min={0}
                                max={4000000}
                                required
                                className="w-24 bg-zinc-800 text-zinc-100 border border-zinc-600 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-zinc-400"
                                placeholder="Ej: 1000"
                            />
                        </div>
                    )}
                    {formData.condicionCorte === "tiempoLimite" && (
                        <div className="flex items-center gap-2">
                            <label className="text-zinc-100">Tiempo Límite:</label>
                            <input
                                type="number"
                                name="tiempoLimite"
                                value={formData.tiempoLimite}
                                onChange={handleChange}
                                min={1}
                                required
                                className="w-24 bg-zinc-800 text-zinc-100 border border-zinc-600 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-zinc-400"
                                placeholder="Ej: 500"
                            />
                        </div>
                    )}
                    {formData.condicionCorte === "clienteX" && (
                        <div className="flex items-center gap-2">
                            <label className="text-zinc-100">Cliente X:</label>
                            <input
                                type="number"
                                name="clienteX"
                                value={formData.clienteX}
                                onChange={handleChange}
                                min={1}
                                required
                                className="w-24 bg-zinc-800 text-zinc-100 border border-zinc-600 rounded px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-zinc-400"
                                placeholder="Ej: 50"
                            />
                        </div>
                    )}
                </div>
            </div>

            <div className="grid grid-cols-3 gap-6">

                {/* Campo 1 */}
                <div className="flex items-center justify-around gap-5">
                    <label className="w-2/5 mb-0 font-medium text-zinc-100">
                        Hora de inicio de la simulación (minutos)
                        <span className="text-zinc-400 block text-xs">(por defecto 0 minutos)</span>
                    </label>
                    <input
                        type="number"
                        name="horaInicio"
                        value={formData.horaInicio}
                        onChange={handleChange}
                        required
                        min={0}
                        className="w-24 bg-zinc-800 text-zinc-100 border border-zinc-600 rounded px-2 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-zinc-400"
                        placeholder="Ej: 40"
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
                            step="0.1"
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
                        Periodo de limpieza (minutos)
                        <span className="text-zinc-400 block text-xs">(por defecto 240 minutos)</span>
                    </label>
                    <input
                        type="number"
                        name="periodoLimpieza"
                        value={formData.periodoLimpieza}
                        onChange={handleChange}
                        min={1}
                        required
                        className="w-24 bg-zinc-800 text-zinc-100 border border-zinc-600 rounded px-2 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-zinc-400"
                        placeholder="Ej: 240"
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
                        value={longitudAlfombra}
                        onChange={(e) => onChangeLongitudAlfombra(Number(e.target.value))}
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
                    <div className="flex flex-col gap-2 items-center justify-center">
                        <input
                            type="number"
                            name="colaEsperaMaximaHoras"
                            value={formData.colaEsperaMaximaHoras}
                            onChange={handleChange}
                            min={1}
                            required
                            className="w-24 bg-zinc-800 text-zinc-100 border border-zinc-600 rounded px-2 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-zinc-400"
                            placeholder="Ej: 10"
                        />
                        <span className="text-zinc-400 text-xs">{formData.colaEsperaMaximaHoras * 60} minutos</span>
                    </div>

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
            <div className="flex flex-col items-center justify-center">
                <button
                    type="submit"
                    disabled={isFormIncomplete}
                    className={`w-[90%] py-2 mt-4 rounded-lg text-white text-center text-xl transition
                        ${isFormIncomplete
                            ? "bg-gray-400 cursor-not-allowed"
                            : "bg-blue-600 hover:bg-blue-700 cursor-pointer"
                        }`}
                >
                    Aplicar Cambios
                </button>
                {isDirty && (
                    <p className="mt-4 text-center text-yellow-300 ">Debe aplicar los cambios</p>
                )}
            </div>
        </form>
    );
};

export default ConfigurationForm;