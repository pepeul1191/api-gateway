// src/entries/web.jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGlobe, faPlus, faTrash } from '@fortawesome/free-solid-svg-icons';
import './web.css' 

// 1. Recibimos los props mediante desestructuración ({ titulo, descripcion, color })
function MiTarjeta({ titulo, descripcion, color }) {
  return (
    <div style={{ padding: '1rem', border: '1px solid #e5e7eb', borderRadius: '8px', maxWidth: '400px', margin: '1rem auto', background: '#f9fafb' }}>
      {/* Usamos el prop 'color' y 'titulo' */}
      <h3 style={{ color: color || '#10b981', margin: '0 0 0.5rem 0' }}>{titulo}</h3>
      {/* Usamos el prop 'descripcion' */}
      <p style={{ margin: 0, color: '#4b5563' }}>{descripcion}</p>
    </div>
  )
}

// 2. Pasamos los valores (props) desde el componente principal
function HolaMundo() {
  return (
    <div style={{ fontFamily: 'sans-serif', textAlign: 'center', marginTop: '2rem' }}>
      <h1 style={{ color: '#4f46e5' }}>¡Hola Mundo desde React! 🚀</h1>
      <p>Esta es mi sub-aplicación desplegada desde <code>src/entries/web.jsx</code>.</p>
      
      {/* Llamamos al componente enviándole diferentes props */}
      <MiTarjeta 
        titulo="Primer Componente con Props 🧩" 
        descripcion="Este texto viene desde un prop dinámico." 
        color="#4f46e5"
      />

      <MiTarjeta 
        titulo="¡Segundo Componente reutilizable! ✨" 
        descripcion="Puedes usar el mismo componente con distinta información." 
        color="#e11d48"
      />

      <MiTarjeta 
        titulo="¡Segundo Componente reutilizable! ✨" 
        descripcion="Puedes usar el mismo componente con distinta información." 
        color="#4b5563"
      />

      <div className="p-4 flex gap-3 items-center">
        <FontAwesomeIcon icon={faGlobe} className="text-blue-500 text-2xl" />
        <button className="bg-blue-600 text-white px-3 py-1.5 rounded flex items-center gap-2">
          <FontAwesomeIcon icon={faPlus} />
          Crear Nación
        </button>
      </div>
    </div>
  )
}

// 3. Montaje en el DOM
const container = document.getElementById('root')

if (container) {
  ReactDOM.createRoot(container).render(
    <React.StrictMode>
      <HolaMundo />
    </React.StrictMode>
  )
}