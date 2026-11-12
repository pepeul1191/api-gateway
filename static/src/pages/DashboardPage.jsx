// src/pages/DashboardPage.jsx
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGlobe, faTrophy, faShieldHalved, faUserNinja } from '@fortawesome/free-solid-svg-icons';

export default function DashboardPage() {
  return (
    <div>
      <h2 className="fw-bold mb-3">Panel Principal</h2>
      <p className="text-muted">Resumen general de las entidades registradas en el sistema.</p>

      <div className="row g-3 mt-2">
        <div className="col-md-3">
          <div className="card border-0 shadow-sm p-3 border-start border-primary border-4">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h6 className="text-muted text-uppercase fw-bold m-0">Naciones</h6>
                <h2 className="fw-bold m-0 mt-2">211</h2>
              </div>
              <FontAwesomeIcon icon={faGlobe} className="text-primary fs-1 opacity-25" />
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card border-0 shadow-sm p-3 border-start border-success border-4">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h6 className="text-muted text-uppercase fw-bold m-0">Ligas</h6>
                <h2 className="fw-bold m-0 mt-2">45</h2>
              </div>
              <FontAwesomeIcon icon={faTrophy} className="text-success fs-1 opacity-25" />
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card border-0 shadow-sm p-3 border-start border-warning border-4">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h6 className="text-muted text-uppercase fw-bold m-0">Equipos</h6>
                <h2 className="fw-bold m-0 mt-2">720</h2>
              </div>
              <FontAwesomeIcon icon={faShieldHalved} className="text-warning fs-1 opacity-25" />
            </div>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card border-0 shadow-sm p-3 border-start border-danger border-4">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h6 className="text-muted text-uppercase fw-bold m-0">Jugadores</h6>
                <h2 className="fw-bold m-0 mt-2">18,500</h2>
              </div>
              <FontAwesomeIcon icon={faUserNinja} className="text-danger fs-1 opacity-25" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}