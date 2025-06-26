import React from 'react';
import RungeKuttaLogic from '../RungeKutta/RungeKuttaLogic';
import { IoPersonSharp } from "react-icons/io5";

const groupedColumns = [
  {
    title: 'INFORMACIÓN PRINCIPAL',
    columns: [
      { label: 'NÚMERO', key: 'numero' },
      { label: 'EVENTO (id_cliente_evento)', key: 'evento' },
      { label: 'RELOJ', key: 'reloj' },
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
    columns: [{ label: 'PRÓXIMA SUSPENSIÓN', key: 'prox_suspension' }],
  },
  {
    title: 'LIMPIEZA',
    columns: [
      { label: 'PRÓXIMA LIMPIEZA', key: 'prox_limpieza' },
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
  {
    title: 'MÉTRICAS ACTUALES',
    columns: [
      { label: 'ACUMULADOR TIEMPO ESPERA', key: 'acumulador_tiempo_espera' },
      { label: 'CLIENTES EN ATENCIÓN', key: 'clientes_comienzan_atencion' },
      { label: 'COLA MÁXIMA ACTUAL', key: 'cola_maxima_actual' },
      { label: 'ESPERA MÁXIMA ACTUAL', key: 'espera_maxima_cola' },
    ],
  },
  {
    title: "CLIENTES",
    columns: [
      { label: 'CLIENTES', key: 'clientes' }
    ]
  }
];

const getAllColumns = () => groupedColumns.flatMap(group => group.columns);
const getGroupColSpans = () => groupedColumns.map(group => group.columns.length);


const Tabla = ({ data, rungeKuttaParams, rungeKuttaResults }) => {

  const columns = getAllColumns();
  const groupColSpans = getGroupColSpans();

  const eventos = data?.eventos || [];

  return (
    <div className='max-h-160 overflow-y-auto overflow-x-scroll border border-zinc-700'>
      <table className="w-max rounded-lg shadow-sm bg-zinc-800">
        <thead className="sticky top-0 z-30 ">
          <tr>
            {groupedColumns.map((group, idx) => (
              <th
                key={group.title}
                colSpan={groupColSpans[idx]}
                className={`px-4 py-2 text-xs font-bold text-zinc-100 uppercase tracking-wider bg-zinc-800 
                    ${idx === 0 ? 'sticky left-0 z-30' : ''}
                    ${group.title?.includes('CLIENTES') ? 'text-left' : 'text-center'}`}
              >
                {group.title}
              </th>
            ))}
          </tr>

          <tr className="bg-zinc-700">
            {columns.map((col, idx) => (
              <th
                key={col.key}
                className={`px-4 py-2 text-xs max-w-[107px] font-semibold text-zinc-200 uppercase tracking-wider bg-zinc-700 
                ${[0, 1, 2].includes(idx)
                    ? `sticky top-1 z-20 bg-zinc-700 ${idx === 0 ? 'left-1' : idx === 1 ? 'left-[90px]' : 'left-[242px] '}`
                    : ''}
                ${col.key === 'clientes' ? 'justify-start text-left' : 'text-center'}`}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {eventos.length > 0 ? (
            eventos.map((item, index) => (
              <tr key={index} className={index % 2 === 0 ? 'bg-[#131316]' : 'bg-[#1E1E21]'}>
                {columns.map((col, idx) => (
                  <td
                    key={col.key}
                    className={`px-4 py-2 text-sm text-zinc-100 text-center
                    ${[0, 1, 2].includes(idx)
                        ? `sticky z-10 bg-inherit ${idx === 0 ? 'left-1' : idx === 1 ? 'left-[90px]' : 'left-[236px]'}`
                        : index % 2 === 0 ? 'bg-zinc-900' : 'bg-zinc-800'
                      }`}
                  >
                    {col.key === 'numero' ? (
                      <span className="font-bold">{item.n_evento}</span>

                    ) : col.key === 'evento' ? (
                      <span>{item[col.key]} ({item.id_cliente || ''})</span>

                    ) : col.key === 'estado_alfombra' ? (
                      <span
                        className={`font-semibold px-2 py-1 rounded 
                          ${{
                            L: "bg-green-600/90 text-white",
                            O: "bg-yellow-600/90 text-white",
                            ES: "bg-red-500/90 text-white",
                            EL: "bg-blue-600/90 text-white",
                          }[item[col.key]] || "bg-zinc-700 text-white"
                          }`}
                        title={item.estado_alfombra === "L" ? "Libre" : item.estado_alfombra === "O" ? "Ocupado" : item.estado_alfombra === "ES" ? "En Suspensión" : "En Limpieza"}
                      >
                        {item[col.key]}
                      </span>

                    )
                      : col.key === 'clientes' ? (
                        <div className={"flex gap-1 text-white"}>
                          {item.clientes.map((cliente) => (
                            <IoPersonSharp
                              className={`text-lg border-2 rounded-full
                                ${cliente.estado === "SA" ? "text-green-500" : "text-yellow-400"}
                                
                              `}
                              title={`Estado: ${cliente.estado === "SA" ? "Siendo Atendido" : "Esperando Atención"} \nID: ${cliente.id_cliente} \nHora llegada: ${cliente.hora_llegada}`} />
                          ))}
                        </div>
                      )
                        : col.key === 'tiempo_descenso' ? (
                          <div>
                            {item.hora_fin_descenso & item.tiempo_descenso ? (
                              <div className='flex items-center gap-5 justify-evenly'>
                                <span>{item[col.key]}</span>
                                <RungeKuttaLogic rungeKuttaParams={rungeKuttaParams} rungeKuttaResults={rungeKuttaResults} />
                              </div>
                            ) : ''}

                          </div>
                        ) : (
                          item[col.key] !== undefined && item[col.key] !== '' && item[col.key] !== null
                            ? item[col.key]
                            : ''
                        )}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length} className="px-4 py-4 text-center text-zinc-400">
                No hay datos para mostrar
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Tabla;
