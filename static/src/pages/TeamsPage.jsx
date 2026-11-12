// src/pages/TeamsPage.jsx
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShieldHalved, faPlus, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';

export default function TeamsPage() {
  return (
    <div className="bg-white p-4 rounded shadow-sm">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="fw-bold m-0">
          <FontAwesomeIcon icon={faShieldHalved} className="me-2 text-primary" /> 
          Mantenimiento de Equipos (`teams`)
        </h4>
        <button className="btn btn-primary d-flex align-items-center gap-2">
          <FontAwesomeIcon icon={faPlus} /> Nuevo Equipo
        </button>
      </div>

      <table className="table table-hover align-middle border">
        <thead className="table-light">
          <tr>
            <th>ID</th>
            <th>Nombre Equipo (`name`)</th>
            <th>Liga (`league_id`)</th>
            <th className="text-end">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1</td>
            <td>Real Madrid CF</td>
            <td>LaLiga</td>
            <td className="text-end">
              <button className="btn btn-sm btn-outline-warning me-2"><FontAwesomeIcon icon={faEdit} /></button>
              <button className="btn btn-sm btn-outline-danger"><FontAwesomeIcon icon={faTrash} /></button>
            </td>
          </tr>
          <tr>
            <td>2</td>
            <td>Manchester City</td>
            <td>Premier League</td>
            <td className="text-end">
              <button className="btn btn-sm btn-outline-warning me-2"><FontAwesomeIcon icon={faEdit} /></button>
              <button className="btn btn-sm btn-outline-danger"><FontAwesomeIcon icon={faTrash} /></button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}