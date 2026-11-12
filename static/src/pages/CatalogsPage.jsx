// src/pages/CatalogsPage.jsx
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTags, faPlus, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';

export default function CatalogsPage() {
  const [activeTab, setActiveTab] = useState('play_styles');

  return (
    <div className="bg-white p-4 rounded shadow-sm">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="fw-bold m-0">
          <FontAwesomeIcon icon={faTags} className="me-2 text-primary" /> 
          Catálogos Auxiliares
        </h4>
        <button className="btn btn-primary btn-sm d-flex align-items-center gap-2">
          <FontAwesomeIcon icon={faPlus} /> Agregar Registro
        </button>
      </div>

      {/* Navegación por Pestañas */}
      <ul className="nav nav-tabs mb-4">
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === 'play_styles' ? 'active fw-bold' : ''}`}
            onClick={() => setActiveTab('play_styles')}
          >
            Estilos (`play_styles`)
          </button>
        </li>
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === 'positions' ? 'active fw-bold' : ''}`}
            onClick={() => setActiveTab('positions')}
          >
            Posiciones (`positions`)
          </button>
        </li>
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === 'foots' ? 'active fw-bold' : ''}`}
            onClick={() => setActiveTab('foots')}
          >
            Pies (`foots`)
          </button>
        </li>
        <li className="nav-item">
          <button 
            className={`nav-link ${activeTab === 'sexs' ? 'active fw-bold' : ''}`}
            onClick={() => setActiveTab('sexs')}
          >
            Sexo (`sexs`)
          </button>
        </li>
      </ul>

      {/* Contenido según la pestaña seleccionada */}
      <table className="table table-hover align-middle border">
        <thead className="table-light">
          <tr>
            <th>ID</th>
            <th>Nombre / Descripción (`name`)</th>
            <th className="text-end">Acciones</th>
          </tr>
        </thead>
        <tbody>
          {activeTab === 'play_styles' && (
            <>
              <tr><td>1</td><td>Tiki-Taka</td><td className="text-end"><button className="btn btn-sm btn-outline-warning me-2"><FontAwesomeIcon icon={faEdit} /></button><button className="btn btn-sm btn-outline-danger"><FontAwesomeIcon icon={faTrash} /></button></td></tr>
              <tr><td>2</td><td>Counter-Attack</td><td className="text-end"><button className="btn btn-sm btn-outline-warning me-2"><FontAwesomeIcon icon={faEdit} /></button><button className="btn btn-sm btn-outline-danger"><FontAwesomeIcon icon={faTrash} /></button></td></tr>
            </>
          )}

          {activeTab === 'positions' && (
            <>
              <tr><td>1</td><td>ST (Delantero)</td><td className="text-end"><button className="btn btn-sm btn-outline-warning me-2"><FontAwesomeIcon icon={faEdit} /></button><button className="btn btn-sm btn-outline-danger"><FontAwesomeIcon icon={faTrash} /></button></td></tr>
              <tr><td>2</td><td>GK (Portero)</td><td className="text-end"><button className="btn btn-sm btn-outline-warning me-2"><FontAwesomeIcon icon={faEdit} /></button><button className="btn btn-sm btn-outline-danger"><FontAwesomeIcon icon={faTrash} /></button></td></tr>
            </>
          )}

          {activeTab === 'foots' && (
            <>
              <tr><td>1</td><td>Left (Zurdo)</td><td className="text-end"><button className="btn btn-sm btn-outline-warning me-2"><FontAwesomeIcon icon={faEdit} /></button><button className="btn btn-sm btn-outline-danger"><FontAwesomeIcon icon={faTrash} /></button></td></tr>
              <tr><td>2</td><td>Right (Diestro)</td><td className="text-end"><button className="btn btn-sm btn-outline-warning me-2"><FontAwesomeIcon icon={faEdit} /></button><button className="btn btn-sm btn-outline-danger"><FontAwesomeIcon icon={faTrash} /></button></td></tr>
            </>
          )}

          {activeTab === 'sexs' && (
            <>
              <tr><td>1</td><td>Male</td><td className="text-end"><button className="btn btn-sm btn-outline-warning me-2"><FontAwesomeIcon icon={faEdit} /></button><button className="btn btn-sm btn-outline-danger"><FontAwesomeIcon icon={faTrash} /></button></td></tr>
              <tr><td>2</td><td>Female</td><td className="text-end"><button className="btn btn-sm btn-outline-warning me-2"><FontAwesomeIcon icon={faEdit} /></button><button className="btn btn-sm btn-outline-danger"><FontAwesomeIcon icon={faTrash} /></button></td></tr>
            </>
          )}
        </tbody>
      </table>
    </div>
  );
}