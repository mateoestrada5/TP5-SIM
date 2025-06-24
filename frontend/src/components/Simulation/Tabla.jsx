import React from 'react';
import RungeKuttaLogic from '../RungeKutta/RungeKuttaLogic';

const groupedColumns = [
  {
    title: 'INFORMACIÓN PRINCIPAL',
    columns: [
      { label: 'NÚMERO', key: 'numero' },
      { label: 'RELOJ', key: 'reloj' },
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
      { label: 'TIEMPO DE DESCENSO', key: 'tiempo_descenso' },
      { label: 'HORA DESCENSO', key: 'hora_fin_descenso' },
      { label: 'ID CLIENTE DESCENSO', key: 'id_cliente_descenso' },
    ],
  },
  {
    title: 'SUSPENSIÓN',
    columns: [
      { label: 'PROXIMA SUSPENSIÓN', key: 'proxima_suspension' },
    ],
  },
  {
    title: 'LIMPIEZA',
    columns: [
      { label: 'PROXIMA LIMPIEZA', key: 'proxima_limpieza' },
      { label: 'TIEMPO LIMPIEZA', key: 'tiempo_limpieza' },
      { label: 'FIN DE LIMPIEZA', key: 'fin_limpieza' },
    ],
  },
  {
    title: 'ALFOMBRA',
    columns: [
      { label: 'ESTADO ALFOMBRA', key: 'estado_alfombra' },
      { label: 'COLA DE CLIENTE', key: 'cola' },
    ],
  },
];

const getAllColumns = () => groupedColumns.flatMap(group => group.columns);
const getGroupColSpans = () => groupedColumns.map(group => group.columns.length);

const Tabla = ({ data, rungeKuttaParams, rungeKuttaResults }) => {
  const columns = getAllColumns();
  const groupColSpans = getGroupColSpans();

  return (
    <div className='max-h-120 max-w-screen overflow-y-auto overflow-x-scroll border border-zinc-700'>

      <table className="min-w-full  rounded-lg shadow-sm bg-zinc-800 ">
        <thead className="sticky top-0 z-30">
          {/* Encabezado de grupos */}
          <tr>
            {groupedColumns.map((group, idx) => (
              <th
                key={group.title}
                colSpan={groupColSpans[idx]}
                className={`px-4 py-2 text-xs font-bold text-zinc-100 uppercase tracking-wider bg-zinc-800 ${idx === 0 ? 'sticky left-0 z-30' : ''}`}
              >
                {group.title}
              </th>
            ))}
          </tr>

          {/* Encabezado de columnas */}
          <tr className="bg-zinc-700">
            {columns.map((col, idx) => (
              <th
                key={col.key}
                className={`px-4 py-2 text-xs font-semibold  text-zinc-200 uppercase tracking-wider
                    ${[0, 1, 2].includes(idx) ? `sticky top-1 z-20 bg-zinc-700 ${idx === 0 ? 'left-1' : idx === 1 ? 'left-[90px]' : 'left-[155px] '}` : ''
                  }`}
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
                className={index % 2 === 0 ? 'bg-[#131316]' : 'bg-[#1E1E21]'}
              >
                {columns.map((col, idx) => (
                  <td
                    key={col.key}
                    className={`px-4 py-2 text-sm text-zinc-100 text-center
                    ${[0, 1, 2].includes(idx) ? `sticky z-10 bg-inherit ${idx === 0 ? 'left-1' : idx === 1 ? 'left-[90px]' : 'left-[155px]'}`: index % 2 === 0 ? 'bg-zinc-900' : 'bg-zinc-800'
                    }`}
                  >
                    {col.key === 'tiempo_descenso' ? (
                      item[col.key] ? (
                        <div className="flex items-center gap-5 justify-evenly">
                          <span>{item[col.key]}</span>
                          <RungeKuttaLogic rungeKuttaParams={rungeKuttaParams} rungeKuttaResults={rungeKuttaResults} />
                        </div>
                      ) : null
                    ) : (
                      item[col.key] ?? ''
                    )}

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
