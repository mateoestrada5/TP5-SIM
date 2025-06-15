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

const Tabla: React.FC<TablaProps> = ({ data }) => {
  return (
    <table border={1} cellPadding={5} style={{ borderCollapse: 'collapse' }}>
      <thead>
        <tr>
          <th>TIEMPO ACTUAL</th>
          <th>RANDOM LLEGADA</th>
          <th>TIEMPO DE LLEGADA</th>
        </tr>
      </thead>
      <tbody>
        {data.map(item => (
          <tr key={item.tiempo_actual}>
            <td>{item.tiempo_actual}</td>
            <td>{item.random_llegada}</td>
            <td>{item.tiempo_llegada}</td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default Tabla
