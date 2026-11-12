// src/pages/NationsPage.jsx
import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faPlus, 
  faGlobe, 
  faPencil, 
  faTrash,
  faEye,
  faCopy
} from '@fortawesome/free-solid-svg-icons';
import DataTable from '../widgets/DataTable.jsx';
//import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';

export default function NationsPage() {
  const { token } = "useAuth()";
  //const [refreshKey, setRefreshKey] = useState(0);

  // Configuración de columnas
  const columnKeys = ['id', 'name'];
  const columnNames = ['ID', 'Nombre'];
  const columnTypes = ['td', 'input[text]'];
  const columnClasses = ['text-center', ''];
  const columnStyles = [{ width: '80px' }, {}];
  const tdStyles = [{}, {}];

  // Botones de acción personalizados con FontAwesome
  const actionButtons = [
    {
      label: 'Editar',
      class: 'btn-warning btn-sm',
      icon: faPencil, // Usar el icono directamente desde FontAwesome
      style: { minWidth: '70px' },
      action: (record) => {
        console.log('Editar nación:', record);
        toast.info(`Editando: ${record.name}`);
      }
    },
    {
      label: 'Ver',
      class: 'btn-info btn-sm',
      icon: faEye,
      style: { minWidth: '70px' },
      action: (record) => {
        console.log('Ver nación:', record);
        toast.info(`Viendo: ${record.name}`);
      }
    },
    {
      label: 'Duplicar',
      class: 'btn-secondary btn-sm',
      icon: faCopy,
      style: { minWidth: '80px' },
      action: (record) => {
        console.log('Duplicar nación:', record);
        toast.info(`Duplicando: ${record.name}`);
      }
    },
    {
      label: 'Eliminar',
      class: 'btn-danger btn-sm',
      icon: faTrash,
      style: { minWidth: '70px' },
      action: (record) => {
        console.log('Eliminar nación:', record);
        toast.warning(`¿Eliminar ${record.name}?`);
      }
    }
  ];

  // Configuración de paginación
  const pagination = {
    display: true,
    step: 10,
    totalPages: 0,
    actualPage: 1
  };

  // Parámetros de consulta para filtros
  const [queryParams, setQueryParams] = useState({
    page: 1,
    limit: 10,
    name: ''
  });

  // Manejador para el botón "Agregar"
  const handleAdd = () => {
    toast.info('Abrir modal para crear nueva nación');
  };

  // Manejador para guardar cambios
  const handleSave = () => {
    toast.success('Cambios guardados correctamente');
    setRefreshKey(prev => prev + 1);
  };

  return (
    <div className="bg-white p-4 rounded shadow-sm">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>
          <FontAwesomeIcon icon={faGlobe} className="me-2" />
          Mantenimiento de Naciones
        </h2>
        
        {/* Filtro por nombre */}
        <div className="d-flex gap-2 align-items-center">
          <input
            type="text"
            className="form-control"
            placeholder="Buscar por nombre..."
            value={queryParams.name}
            onChange={(e) => {
              setQueryParams(prev => ({
                ...prev,
                name: e.target.value,
                page: 1
              }));
            }}
            style={{ width: '250px' }}
          />
          <button 
            className="btn btn-primary d-flex align-items-center gap-2"
            onClick={handleAdd}
          >
            <FontAwesomeIcon icon={faPlus} /> Crear Nación
          </button>
        </div>
      </div>

      {/* DataTable con configuración completa */}
      <DataTable
        //key={refreshKey}
        recordId="id"
        fetchURL="/api/v1/nations"
        saveURL="/api/v1/nations/save"
        deleteURL="/api/v1/nations"
        columnKeys={columnKeys}
        columnTypes={columnTypes}
        columnNames={columnNames}
        columnClasses={columnClasses}
        columnStyles={columnStyles}
        tdStyles={tdStyles}
        actionButtons={actionButtons}
        pagination={pagination}
        queryParams={queryParams}
        jwtToken={token}
        addButton={{
          display: true,
          disabled: false,
          action: handleAdd
        }}
        saveButton={{
          display: true,
          disabled: false,
          action: handleSave
        }}
        // Configuración personalizada de la columna de acciones
        actionsColumnClass="text-center" // Clase para el encabezado de acciones
        actionsColumnStyle={{ minWidth: '320px', backgroundColor: '#f8f9fa' }}
        actionsCellClass="text-center" // Clase para cada celda de acciones
        actionsCellStyle={{ padding: '6px 4px' }}
        messages={{
          success: 'Naciones actualizadas correctamente',
          errorNetwork: 'No hay conexión con el servidor',
          notFound: 'No se encontraron naciones',
          serverError: 'Error interno del servidor',
          requestError: 'No se recibió respuesta del servidor',
          otherError: 'Ocurrió un error al obtener los datos'
        }}
        onAlert={(message) => {
          if (message.status === 'success') {
            toast.success(message.text);
          } else if (message.status === 'warning') {
            toast.warning(message.text);
          } else if (message.status === 'danger') {
            toast.error(message.text);
          } else {
            toast.info(message.text);
          }
        }}
      />
    </div>
  );
}