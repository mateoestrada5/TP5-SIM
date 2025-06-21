import React from 'react'

// Definimos la interfaz para un item de datos (ajustala según lo que devuelve tu API)
export interface DataItem {
  tiempo_actual: number
  random_llegada: number
  tiempo_llegada: number
}

interface TablaProps {
  data: DataItem[]
}

// const Tabla: React.FC<TablaProps> = ({ data }) => {
//   return (
//     <table border={1} cellPadding={5} style={{ borderCollapse: 'collapse' }}>
//       <thead>
//         <tr>
//           <th>TIEMPO ACTUAL</th>
//           <th>RANDOM LLEGADA</th>
//           <th>TIEMPO DE LLEGADA</th>
//         </tr>
//       </thead>
//       <tbody>
//         {data.map(item => (
//           <tr key={item.tiempo_actual}>
//             <td>{item.tiempo_actual}</td>
//             <td>{item.random_llegada}</td>
//             <td>{item.tiempo_llegada}</td>
//           </tr>
//         ))}
//       </tbody>
//     </table>
//   )
// }





const Tabla: React.FC<TablaProps> = () => {
    return (
        <table border={1} cellPadding={5} style={{ borderCollapse: 'collapse' }}>
            <thead>
            <tr>
                <th>EVENTO</th>
                <th>RELOJ</th>
                <th>RND LL</th>
                <th>TIEMPO LL</th>
                <th>HORA LLEGADA</th>
                <th>TIEMPO DE DESCENSO</th>
                <th>HORA DESCENSO</th>
                <th>ID CLIENTE</th>
            </tr>
            </thead>
            <tbody>
                <tr>
                    <td>inicializacion</td>
                    <td>0</td>
                    <td>0.80</td>
                    <td>3.45</td>
                    <td>3.45</td>
                    <td></td>
                    <td></td>
                    <td></td>
                </tr>
                <tr>
                    <td>llegada_cliente(1)</td>
                    <td>3.45</td>
                    <td>0.80</td>
                    <td>3.45</td>
                    <td>6.90</td>
                    <td>4.612</td>
                    <td>8.062</td>
                    <td>1</td>
                </tr>
            {/*{data.map(item => (*/}
            {/*    <tr key={item.tiempo_actual}>*/}
            {/*        <td>{item.tiempo_actual}</td>*/}
            {/*        <td>{item.random_llegada}</td>*/}
            {/*        <td>{item.tiempo_llegada}</td>*/}
            {/*    </tr>*/}
            {/*))}*/}
            </tbody>
        </table>
    )
}

export default Tabla
