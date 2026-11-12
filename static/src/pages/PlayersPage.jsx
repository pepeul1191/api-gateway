// src/pages/PlayersPage.jsx
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserNinja, faPlus, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';

export default function PlayersPage() {
  return (
    <div className="bg-white p-4 rounded shadow-sm">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="fw-bold m-0">
          <FontAwesomeIcon icon={faUserNinja} className="me-2 text-primary" /> 
          Mantenimiento de Jugadores (`players`)
        </h4>
        <button className="btn btn-primary d-flex align-items-center gap-2">
          <FontAwesomeIcon icon={faPlus} /> Nuevo Jugador
        </button>
      </div>

      <div className="table-responsive">
        <table className="table table-hover align-middle border">
          <thead className="table-light">
            <tr>
              <th>ID</th>
              <th>Nombre</th>
              <th>Ranking</th>
              <th>Edad / Altura / Peso</th>
              <th>Pie / Sexo</th>
              <th>Equipo</th>
              <th>Nación</th>
              <th className="text-end">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>1</td>
              <td>
                <div className="fw-bold">Lionel Messi</div>
                <small className="text-muted">/players/messi.jpg</small>
              </td>
              <td><span className="badge bg-success">90</span></td>
              <td>36 yrs | 169 cm | 67 kg</td>
              <td>Izquierdo / Masc</td>
              <td>Inter Miami</td>
              <td>Argentina</td>
              <td className="text-end">
                <button className="btn btn-sm btn-outline-warning me-2"><FontAwesomeIcon icon={faEdit} /></button>
                <button className="btn btn-sm btn-outline-danger"><FontAwesomeIcon icon={faTrash} /></button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}