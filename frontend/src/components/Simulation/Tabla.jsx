import React from 'react';
import RungeKuttaLogic from '../RungeKutta/RungeKuttaLogic';
import { formatNumber } from '../RungeKutta/RungeKuttaLogic';

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
    title: 'MÉTRICAS GENERALES',
    columns: [
      { label: 'COLA MÁXIMA', key: 'cola_maxima' },
      { label: 'PROMEDIO TIEMPO ESPERA', key: 'promedio_tiempo_espera' },
      { label: 'CONTADOR CLIENTES COMIENZAN DESCENSO', key: 'contador_clientes_comienzan_descenso' },
      { label: 'ESPERA COLA MÁXIMA', key: 'espera_cola_maxima' },
    ],
  }
];

const getAllColumns = () => groupedColumns.flatMap(group => group.columns);
const getGroupColSpans = () => groupedColumns.map(group => group.columns.length);

// FALTA EL MANEJO DINAMICO DE LOS CLIENTES, EN TEORIA VOY A TENER LA CANTIDAD MAXIMA DE CLIENTES PARA PODER  CREAR LAS COLUMNAS NECESARIAS
// FALTA DEFINIR SI LAS METRICAS GENERALES SON COLUMNAS O SOLO ALGO QUE APARECERA EN RESULTADOS FINALES
// LA ULTIMA FILA DEBO DEFINIR COMO QUEDA Y/O QUE ME LA RETORNE EL BACK DISTINGUIDA PARA MOSTRARLA EN UNA FILA SEPARADA
// 


const Tabla = ({ data, rungeKuttaParams, rungeKuttaResults }) => {

  // {
  //       "eventos": [
  //           {
  //               "numero": 1,
  //               "evento": "Inicialización",
  //               "id_cliente": "",
  //               "reloj": "0.00",
  //               "rnd_ll": 0.1838,
  //               "tiempo_ll": 3.1838,
  //               "hora_ll": 3.1838,
  //               "tiempo_descenso": "",
  //               "hora_fin_descenso": "",
  //               "id_cliente_descenso": "",
  //               "prox_suspension": 30,
  //               "prox_limpieza": 50,
  //               "fin_limpieza": "",
  //               "estado_alfombra": "L",
  //               "cola": 0,
  //               "acumulador_tiempo_espera": 0,
  //               "clientes_comienzan_atencion": 0,
  //               "cola_maxima_actual": 0,
  //               "espera_maxima_cola": 0,
  //               "clientes": []
  //           },
  //           {
  //               "numero": 2,
  //               "evento": "Llegada Cliente",
  //               "id_cliente": 2,
  //               "reloj": "6.62",
  //               "rnd_ll": 0.9072,
  //               "tiempo_ll": 3.9072,
  //               "hora_ll": 10.5281,
  //               "tiempo_descenso": "",
  //               "hora_fin_descenso": 7.7958,
  //               "id_cliente_descenso": 1,
  //               "prox_suspension": 30,
  //               "prox_limpieza": 50,
  //               "fin_limpieza": "",
  //               "estado_alfombra": "O",
  //               "cola": 1,
  //               "acumulador_tiempo_espera": 0,
  //               "clientes_comienzan_atencion": 1,
  //               "cola_maxima_actual": 1,
  //               "espera_maxima_cola": 0,
  //               "clientes": [
  //                   {
  //                       "id_cliente": 1,
  //                       "estado": "SA",
  //                       "hora_llegada": 3.1838
  //                   },
  //                   {
  //                       "id_cliente": 2,
  //                       "estado": "EA",
  //                       "hora_llegada": 6.6209
  //                   }
  //               ]
  //           }
  //       ],
  //       "cola_maxima": 2,
  //       "promedio_tiempo_espera": 2.7421,
  //       "contador_clientes_comienzan_descenso": 17,
  //       "espera_cola_maxima": 6.7213,
  //  }

  const columns = getAllColumns();
  const groupColSpans = getGroupColSpans();

  const eventos = data?.eventos || []; // Accede al array correctamente

  return (
    <div className='max-h-120 overflow-y-auto overflow-x-scroll border border-zinc-700'>
      <table className="w-max rounded-lg shadow-sm bg-zinc-800">
        <thead className="sticky top-0 z-30 ">
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

          <tr className="bg-zinc-700">
            {columns.map((col, idx) => (
              <th
                key={col.key}
                className={`px-4 py-2 text-xs max-w-[110px] font-semibold text-zinc-200 uppercase tracking-wider bg-zinc-700 
                ${[0, 1, 2].includes(idx)
                    ? `sticky top-1 z-20 bg-zinc-700 ${idx === 0 ? 'left-1' : idx === 1 ? 'left-[90px]' : 'left-[235px] '}`
                    : ''}`}
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
                        ? `sticky z-10 bg-inherit ${idx === 0 ? 'left-1' : idx === 1 ? 'left-[90px]' : 'left-[235px]'}`
                        : index % 2 === 0 ? 'bg-zinc-900' : 'bg-zinc-800'
                      }`}
                  >
                    {col.key === 'numero' ? (
                      <span className="font-bold">{item.numero}</span>

                    ) : col.key === 'evento' ? (
                      <span>{item[col.key]} ({item.id_cliente || ''})</span>

                    ) : col.key === 'tiempo_descenso' ? (
                      rungeKuttaResults && rungeKuttaResults.length > 0 ? (
                        <div>
                          {item.hora_fin_descenso && rungeKuttaResults.length > 0 ? (
                            <div className='flex items-center gap-5 justify-evenly'>
                              <span >{formatNumber(rungeKuttaResults[rungeKuttaResults.length - 1].t, 2)}</span>
                              <RungeKuttaLogic rungeKuttaParams={rungeKuttaParams} rungeKuttaResults={rungeKuttaResults} />
                            </div>
                          ) : (
                            ''
                          )}
                        </div>
                      ) : ''
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
