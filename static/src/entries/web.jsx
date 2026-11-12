// src/entries/web.jsx
import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGlobe, faLock, faUser, faSignOutAlt, faCheckCircle, faExclamationCircle } from '@fortawesome/free-solid-svg-icons';
import 'bootstrap/dist/css/bootstrap.min.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min.js';
import './web.css' 

function AppLogin() {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('123456');
  const [token, setToken] = useState('');
  const [responseMsg, setResponseMsg] = useState(null);
  const [loading, setLoading] = useState(false);

  // Cargar token del localStorage al iniciar la app
  useEffect(() => {
    const savedToken = localStorage.getItem('jwt_token');
    if (savedToken) {
      setToken(savedToken);
    }
  }, []);

  // Manejar el inicio de sesión
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setResponseMsg(null);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await res.json();

      if (data.success && data.data?.token) {
        const newToken = data.data.token;
        localStorage.setItem('jwt_token', newToken);
        setToken(newToken);
        setResponseMsg({ type: 'success', text: data.message });
      } else {
        setResponseMsg({ type: 'error', text: data.error || data.message || 'Error en el login' });
      }
    } catch (error) {
      setResponseMsg({ type: 'error', text: 'No se pudo conectar con el servidor de Auth' });
    } finally {
      setLoading(false);
    }
  };

  // Cerrar sesión
  const handleLogout = () => {
    localStorage.removeItem('jwt_token');
    setToken('');
    setResponseMsg({ type: 'success', text: 'Sesión cerrada correctamente' });
  };

  // Probar consumo de un microservicio protegido (ej. Productos)
  const testProtectedService = async (endpoint) => {
    setResponseMsg(null);
    try {
      const res = await fetch(endpoint, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      const data = await res.json();

      if (res.ok) {
        setResponseMsg({ type: 'success', text: `Respuesta de ${endpoint}: ${JSON.stringify(data)}` });
      } else {
        setResponseMsg({ type: 'error', text: `Acceso denegado [${res.status}]: ${data.error || data.message || 'No autorizado'}` });
      }
    } catch (error) {
      setResponseMsg({ type: 'error', text: 'Error de red al intentar consultar el servicio' });
    }
  };

  return (
    <div className="container py-5" style={{ maxWidth: '600px', fontFamily: 'sans-serif' }}>
      <div className="text-center mb-4">
        <h1 className="text-indigo-600 font-bold mb-2">API Gateway & Auth 🚀</h1>
        <p className="text-muted">Panel de control y pruebas con JWT</p>
      </div>

      {/* Alertas de respuesta */}
      {responseMsg && (
        <div className={`alert ${responseMsg.type === 'success' ? 'alert-success' : 'alert-danger'} d-flex align-items-center`} role="alert">
          <FontAwesomeIcon icon={responseMsg.type === 'success' ? faCheckCircle : faExclamationCircle} className="me-2" />
          <div className="text-break small">{responseMsg.text}</div>
        </div>
      )}

      {!token ? (
        /* Formulario de Login */
        <div className="card shadow-sm p-4 border-0 bg-light">
          <h3 className="h5 mb-3 text-secondary">Iniciar Sesión</h3>
          <form onSubmit={handleLogin}>
            <div className="mb-3">
              <label className="form-label small fw-bold">Usuario</label>
              <div className="input-group">
                <span className="input-group-text"><FontAwesomeIcon icon={faUser} /></span>
                <input 
                  type="text" 
                  className="form-control" 
                  value={username} 
                  onChange={(e) => setUsername(e.target.value)} 
                  required 
                />
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label small fw-bold">Contraseña</label>
              <div className="input-group">
                <span className="input-group-text"><FontAwesomeIcon icon={faLock} /></span>
                <input 
                  type="password" 
                  className="form-control" 
                  value={password} 
                  onChange={(e) => setPassword(e.target.value)} 
                  required 
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary w-100" disabled={loading}>
              {loading ? 'Autenticando...' : 'Obtener JWT Token'}
            </button>
          </form>
        </div>
      ) : (
        /* Panel de Control con Token Activo y Botones de Prueba */
        <div className="card shadow-sm p-4 border-0 bg-light">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h3 className="h5 text-success m-0">¡Sesión Activa! 🎉</h3>
            <button onClick={handleLogout} className="btn btn-outline-danger btn-sm">
              <FontAwesomeIcon icon={faSignOutAlt} className="me-1" /> Cerrar Sesión
            </button>
          </div>

          <div className="mb-3">
            <label className="form-label small text-muted fw-bold">JWT Almacenado en LocalStorage:</label>
            <div className="p-2 bg-white border rounded text-monospace small text-truncate" style={{ fontSize: '0.8rem' }}>
              {token}
            </div>
          </div>

          <hr />

          <h5 className="h6 text-secondary mb-3">Probar Microservicios Protegidos</h5>
          <div className="d-grid gap-2">
            <button 
              onClick={() => testProtectedService('/api/products')} 
              className="btn btn-dark text-start d-flex justify-content-between align-items-center"
            >
              <span>Consultar Productos (Sinatra)</span>
              <FontAwesomeIcon icon={faGlobe} />
            </button>

            <button 
              onClick={() => testProtectedService('/api/users')} 
              className="btn btn-secondary text-start d-flex justify-content-between align-items-center"
            >
              <span>Consultar Usuarios (Flask)</span>
              <FontAwesomeIcon icon={faGlobe} />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// 3. Montaje en el DOM
const container = document.getElementById('root')

if (container) {
  ReactDOM.createRoot(container).render(
    <React.StrictMode>
      <AppLogin />
    </React.StrictMode>
  )
}