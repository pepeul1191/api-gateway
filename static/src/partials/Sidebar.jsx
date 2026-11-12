import React from 'react';
import { NavLink } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGlobe, faTrophy, faUsers, faRunning, faTags, faChartPie } from '@fortawesome/free-solid-svg-icons';

export default function Sidebar() {
  const linkClass = ({ isActive }) => 
    `nav-link d-flex align-items-center gap-2 ${isActive ? 'active bg-primary text-white' : 'text-dark'}`;

  return (
    <div className="d-flex flex-column p-3 bg-light border-end" style={{ width: '250px', minHeight: '100vh' }}>
      <a href="/" className="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-dark text-decoration-none px-2">
        <span className="fs-4 fw-bold">Futbol App</span>
      </a>
      <hr />
      <ul className="nav nav-pills flex-column mb-auto gap-1">
        <li className="nav-item">
          <NavLink to="/admin" end className={linkClass}>
            <FontAwesomeIcon icon={faChartPie} /> Dashboard
          </NavLink>
        </li>
        <li>
          <NavLink to="/admin/players" className={linkClass}>
            <FontAwesomeIcon icon={faRunning} /> Jugadores
          </NavLink>
        </li>
        <li>
          <NavLink to="/admin/teams" className={linkClass}>
            <FontAwesomeIcon icon={faUsers} /> Equipos
          </NavLink>
        </li>
        <li>
          <NavLink to="/admin/leagues" className={linkClass}>
            <FontAwesomeIcon icon={faTrophy} /> Ligas
          </NavLink>
        </li>
        <li>
          <NavLink to="/admin/nations" className={linkClass}>
            <FontAwesomeIcon icon={faGlobe} /> Naciones
          </NavLink>
        </li>
        <li>
          <NavLink to="/admin/catalogs" className={linkClass}>
            <FontAwesomeIcon icon={faTags} /> Catálogos Auxiliares
          </NavLink>
        </li>
      </ul>
    </div>
  );
}