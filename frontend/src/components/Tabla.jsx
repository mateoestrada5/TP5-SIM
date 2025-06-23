import React from 'react'

function Tabla({ data }) {
    // Agrupación de columnas por tema
    const groupedColumns = [
        {
            title: 'EVENTO',
            columns: [
                { label: 'EVENTO (id_cliente_evento)', key: 'evento' },
            ],
        },
        {
            title: 'LLEGADA CLIENTE',
            columns: [
                { label: 'RND LL', key: 'rnd_ll' },
                { label: 'TIEMPO LL', key: 'tiempo_ll' },
                { label: 'HORA LL', key: 'hora_ll' },
            ],
        },
        {
            title: 'FIN DE DESCENSO',
            columns: [
                // En tiempo de descanso habra un boton (ojo) que renderice una tabla de runge kutta, como se calculo ese valor puntualmente.
                { label: 'TIEMPO DE DESCENSO', key: 'tiempo_descenso' },
                { label: 'HORA DESCENSO', key: 'hora_fin_descenso' },
                { label: 'ID CLIENTE DESCENSO', key: 'id_cliente_descenso' },
            ],
        },
        {
            title: 'SUSPENSIÓN',
            columns: [
                { label: 'PROXIMA SUSPENSIÓN', key: 'proxima_suspension' },
            ]
        },
        
        {
            title: 'LIMPIEZA',
            columns: [
                { label: 'PROXIMA LIMPIEZA', key: 'proxima_limpieza' },
                { label: 'TIEMPO LIMPIEZA', key: 'tiempo_limpieza' },
                { label: 'FIN DE LIMPIEZA', key: 'fin_limpieza' },
            ]
        },


        {
            title: 'ALFOMBRA',
            columns: [
                { label: 'ESTADO ALFOMBRA', key: 'estado_alfombra' },
                { label: 'COLA DE CLIENTE', key: 'cola' },
            ],
        },
    ];

    // Solo la columna de reloj como columna adicional y primera
    const otherColumns = [
        { label: 'RELOJ', key: 'reloj' },
    ];

    // Todas las columnas en orden: primero reloj, luego las agrupadas
    const columns = [
        ...otherColumns,
        ...groupedColumns.flatMap(group => group.columns),
    ];

    // Para saber cuántas columnas tiene cada grupo
    const groupColSpans = groupedColumns.map(group => group.columns.length);

    return (
        <div className="overflow-x-auto">
            <table className="min-w-full border border-zinc-700 rounded-lg shadow-sm bg-zinc-900">
                <thead>
                    {/* Fila de títulos de grupo */}
                    <tr>
                        {/* Celda vacía para la columna RELOJ */}
                        <th
                            className="px-4 py-2 border-b border-zinc-700 text-xs font-bold text-zinc-100 uppercase tracking-wider bg-zinc-700"
                        ></th>
                        {groupedColumns.map((group, idx) => (
                            <th
                                key={group.title}
                                colSpan={groupColSpans[idx]}
                                className="px-4 py-2 border-b border-zinc-700 text-xs font-bold text-zinc-100 uppercase tracking-wider bg-zinc-800"
                            >
                                {group.title}
                            </th>
                        ))}
                    </tr>
                    {/* Fila de títulos de columnas */}
                    <tr className="bg-zinc-700">
                        {columns.map(col => (
                            <th
                                key={col.key}
                                className="px-4 py-2 border-b border-zinc-700 text-xs font-semibold text-zinc-200 uppercase tracking-wider"
                            >
                                {col.label}
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {data && data.length > 0 ? (
                        data.map((item, index) => (
                            <tr
                                key={index}
                                className={index % 2 === 0 ? "bg-zinc-900" : "bg-zinc-800"}
                            >
                                {columns.map(col => (
                                    <td
                                        key={col.key}
                                        className="px-4 py-2 border-b border-zinc-800 text-sm text-zinc-100"
                                    >
                                        {item[col.key] !== undefined ? item[col.key] : ''}
                                    </td>
                                ))}
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td
                                colSpan={columns.length}
                                className="px-4 py-4 text-center text-zinc-400"
                            >
                                No hay datos para mostrar
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
        );
    }

export default Tabla;