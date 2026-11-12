// src/pages/LeaguesPage.jsx
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrophy, faPlus, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';

export default function LeaguesPage() {
  return (
    <div className="bg-white p-4 rounded shadow-sm">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="fw-bold m-0">
          <FontAwesomeIcon icon={faTrophy} className="me-2 text-primary" /> 
          Mantenimiento de Ligas (`leagues`)
        </h4>
        <button className="btn btn-primary d-flex align-items-center gap-2">
          <FontAwesomeIcon icon={faPlus} /> Nueva Liga
        </button>
      </div>

      <table className="table table-hover align-middle border">
        <thead className="table-light">
          <tr>
            <th>ID</th>
            <th>Nombre Liga (`name`)</th>
            <th>Nación (`nation_id`)</th>
            <th className="text-end">Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1</td>
            <td>LaLiga</td>
            <td>España</td>
            <td className="text-end">
              <button className="btn btn-sm btn-outline-warning me-2"><FontAwesomeIcon icon={faEdit} /></button>
              <button className="btn btn-sm btn-outline-danger"><FontAwesomeIcon icon={faTrash} /></button>
            </td>
          </tr>
          <tr>
            <td>2</td>
            <td>Premier League</td>
            <td>Inglaterra</td>
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