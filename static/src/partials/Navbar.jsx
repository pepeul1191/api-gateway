import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';

export default function Navbar({ user = { name: "Usuario Admin" } }) {
  return (
    <nav className="navbar navbar-expand navbar-light bg-white border-bottom px-4 py-2">
      <div className="ms-auto d-flex align-items-center gap-3">
        <div className="d-flex align-items-center gap-2 text-secondary">
          <FontAwesomeIcon icon={faUser} />
          <span className="fw-medium">{user.name}</span>
        </div>
        <a href="/sign-out" className="btn btn-outline-danger btn-sm d-flex align-items-center gap-2">
          <FontAwesomeIcon icon={faSignOutAlt} />
          Cerrar Sesión
        </a>
      </div>
    </nav>
  );
}