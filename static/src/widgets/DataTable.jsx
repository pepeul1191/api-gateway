// DataTable.jsx - Versión completa y corregida
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faPlus, 
  faCheck, 
  faTimes, 
  faTrash, 
  faPen,
  faAngleDoubleLeft, 
  faAngleLeft, 
  faAngleRight, 
  faAngleDoubleRight,
  faFolderOpen,
  faUpload,
  faEye,
  faGlobe,
  faTrophy,
  faUsers,
  faRunning,
  faTags,
  faChartPie,
  faEdit,
  faCopy,
  faSave
} from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { Modal } from 'bootstrap';
import { useNavigate } from 'react-router-dom';
import Autocomplete from './Autocomplete.jsx';
import random from '../helpers/random.js';

// Mapa de iconos
const ICON_MAP = {
  'fa-plus': faPlus,
  'fa-check': faCheck,
  'fa-times': faTimes,
  'fa-trash': faTrash,
  'fa-pencil': faPen,
  'fa-pen': faPen,
  'fa-edit': faEdit,
  'fa-angle-double-left': faAngleDoubleLeft,
  'fa-angle-left': faAngleLeft,
  'fa-angle-right': faAngleRight,
  'fa-angle-double-right': faAngleDoubleRight,
  'fa-folder-open': faFolderOpen,
  'fa-upload': faUpload,
  'fa-picture-o': faEye,
  'fa-eye': faEye,
  'fa-globe': faGlobe,
  'fa-trophy': faTrophy,
  'fa-users': faUsers,
  'fa-running': faRunning,
  'fa-tags': faTags,
  'fa-chart-pie': faChartPie,
  'fa-copy': faCopy,
  'fa-save': faSave,
};

const DataTable = ({
  recordId = 'id',
  observer: initialObserver = { new: [], edit: [], delete: [] },
  fetchURL = null,
  saveURL = null,
  deleteURL = null,
  data: initialData = [],
  columnKeys = [],
  columnTypes = [],
  columnNames = [],
  columnClasses = [],
  columnStyles = [],
  tdStyles = [],
  addButton: initialAddButton = {
    display: false,
    disabled: false,
    action: () => {},
  },
  saveButton: initialSaveButton = {
    display: false,
    disabled: false,
    action: () => {},
  },
  extraData = {},
  extraReplace = [],
  actionButtons = [],
  pagination: initialPagination = {
    display: false,
    step: 10,
    totalPages: 0,
    actualPage: 1,
    offset: 0,
    total: 0,
    limit: 0,
  },
  queryParams: initialQueryParams = {},
  messages = {
    success: 'Datos actualizados',
    errorNetwork: 'No hay conexión con el servidor',
    notFound: 'Recurso no encontrado',
    serverError: 'Error interno del servidor',
    requestError: 'No se recibió respuesta del servidor',
    otherError: 'Ocurrió un error no esperado al traer los datos del servidor',
  },
  jwtToken = null,
  onAlert,
  onSuggestionSelected,
  actionsColumnClass = 'text-end',
  actionsColumnStyle = { minWidth: '150px' },
  actionsCellClass = 'text-end',
  actionsCellStyle = {},
}) => {
  const navigate = useNavigate();

  // ESTADOS - Todas las variables están definidas aquí
  const [data, setData] = useState(initialData);
  const [observer, setObserver] = useState(initialObserver);
  const [pagination, setPagination] = useState(initialPagination);
  const [queryParams, setQueryParams] = useState(initialQueryParams);
  const [addButton] = useState(initialAddButton);
  const [saveButton] = useState(initialSaveButton);
  const [messageConfirmationModal, setMessageConfirmationModal] = useState({
    text: '',
    status: ''
  });
  const [idForDeleting, setIdForDeleting] = useState(null);
  const [btnDisabledDeleteConfirmation, setBtnDisabledDeleteConfirmation] = useState(false);

  // REFS
  const deleteConfirmationModalRef = useRef(null);
  const deleteConfirmationInstance = useRef(null);

  // EFECTOS
  useEffect(() => {
    if (deleteConfirmationModalRef.current) {
      deleteConfirmationInstance.current = new Modal(deleteConfirmationModalRef.current);
    }
  }, []);

  // Llamar list cuando cambian los parámetros de paginación
  useEffect(() => {
    if (pagination.display && fetchURL) {
      list();
    }
  }, [pagination.actualPage, pagination.step, fetchURL, pagination.display]);

  // FUNCIONES DE UTILIDAD
  const getNestedValue = (obj, path) => {
    if (!obj || !path) return '';
    return path.split('.').reduce((current, key) => {
      return current && current[key] !== undefined ? current[key] : '';
    }, obj);
  };

  const setNestedValue = (obj, path, value) => {
    if (!obj || !path) return;
    const keys = path.split('.');
    const lastKey = keys.pop();
    let target = obj;
    for (const key of keys) {
      if (!target[key]) target[key] = {};
      target = target[key];
    }
    target[lastKey] = value;
  };

  const dataSearch = (key, idSearched) => {
    for (let i = 0; i < data.length; i++) {
      if (data[i][key] === idSearched) {
        return data[i];
      }
    }
    return null;
  };

  const parseAutocompleteOptions = (spec) => {
    const result = {};
    const m = String(spec).match(/^autocomplete\((.*)\)$/);
    if (!m) return result;
    const inner = m[1];
    const parts = inner.split(',').map(p => p.trim()).filter(Boolean);
    parts.forEach(part => {
      const [k, ...rest] = part.split('=');
      if (!k) return;
      const key = k.trim();
      let val = rest.join('=').trim();
      if ((val.startsWith("'") && val.endsWith("'")) || (val.startsWith('"') && val.endsWith('"'))) {
        val = val.slice(1, -1);
      }
      if (val === 'true') val = true;
      else if (val === 'false') val = false;
      else if (!isNaN(val) && val !== '') val = Number(val);
      result[key] = val;
    });
    return result;
  };

  const getIcon = (iconName) => {
    if (!iconName) return null;
    if (iconName && typeof iconName === 'object' && iconName.icon) {
      return iconName;
    }
    const icon = ICON_MAP[iconName];
    if (icon) return icon;
    const cleanName = iconName.replace(/^fa-/, '');
    return ICON_MAP[`fa-${cleanName}`] || null;
  };

  const cleanMessage = () => {
    setTimeout(() => {
      setMessageConfirmationModal({ text: '', status: '' });
      setBtnDisabledDeleteConfirmation(false);
      if (deleteConfirmationInstance.current) {
        deleteConfirmationInstance.current.hide();
      }
    }, 4300);
  };

  // FUNCIONES DE DATOS
  const list = useCallback(() => {
    if (!fetchURL) {
      console.error('No hay URL para traer datos');
      return;
    }

    const params = { ...queryParams };
    if (pagination.display) {
      params.step = pagination.step;
      params.page = pagination.actualPage;
    }

    axios.get(fetchURL, {
      params: Object.keys(params).length > 0 ? params : undefined,
      headers: {
        'Authorization': `Bearer ${jwtToken}`
      }
    })
      .then(response => {
        if (pagination.display) {
          const genericResponse = response.data.data;
          setData(genericResponse.list || []);
          setPagination(prev => ({
            ...prev,
            totalPages: genericResponse.pages || 0,
            offset: genericResponse.offset + 1 || 0,
            total: genericResponse.total || 0,
            limit: (genericResponse.offset + prev.step) > (genericResponse.total || 0)
              ? (genericResponse.total || 0)
              : (genericResponse.offset + prev.step)
          }));
        } else {
          const genericResponse = response.data.data;
          setData(genericResponse.list || []);
        }
      })
      .catch(error => {
        console.error(error);
        if (onAlert) {
          if (error.code === 'ERR_NETWORK') {
            onAlert({ text: messages.errorNetwork, status: 'danger' });
          } else if (error.response) {
            const status = error.response.status;
            switch (status) {
              case 404:
                onAlert({ text: messages.notFound, status: 'warning' });
                break;
              case 500:
                onAlert({ text: messages.serverError, status: 'danger' });
                break;
              default:
                onAlert({ text: `Error HTTP: ${status}`, status: 'danger' });
                break;
            }
          } else if (error.request) {
            onAlert({ text: messages.requestError, status: 'danger' });
          } else {
            onAlert({ text: messages.otherError, status: 'danger' });
          }
        }
      });
  }, [fetchURL, queryParams, pagination.display, pagination.step, pagination.actualPage, jwtToken, messages, onAlert]);

  const addRow = () => {
    const tmp = {};
    for (const key of columnKeys) {
      if (key === 'id' || key === '_id') {
        tmp[key] = `tmp_${random(10)}`;
      } else {
        tmp[key] = '';
      }
    }
    setData([...data, tmp]);
  };

  const deleteRow = (record, keyId) => {
    const idToRemove = record[keyId];
    const isTmp = idToRemove.toString().includes('tmp');

    setObserver(prev => {
      const newObserver = { ...prev };
      newObserver.new = prev.new.filter(u => u !== idToRemove);
      newObserver.edit = prev.edit.filter(u => u !== idToRemove);
      if (!prev.delete.includes(idToRemove) && !isTmp) {
        newObserver.delete = [...prev.delete, idToRemove];
      }
      return newObserver;
    });

    setData(data.filter(item => item[keyId] !== idToRemove));
  };

  const askToDeleteRow = (record, key) => {
    setIdForDeleting(record[key]);
    if (deleteConfirmationInstance.current) {
      deleteConfirmationInstance.current.show();
    }
  };

  const deleteRowFromDB = () => {
    setBtnDisabledDeleteConfirmation(true);
    if (deleteURL && idForDeleting) {
      axios.delete(`${deleteURL}/${idForDeleting}`, {
        headers: {
          'Authorization': `Bearer ${jwtToken}`
        }
      })
        .then(response => {
          console.log(response);
          setData(data.filter(item => item.id !== idForDeleting));
          setMessageConfirmationModal({
            text: response.data.message || 'Registro borrado correctamente',
            status: 'success'
          });
          cleanMessage();
        })
        .catch(error => {
          setMessageConfirmationModal({
            text: error.message || 'Error al eliminar',
            status: 'danger'
          });
          console.error(error);
          cleanMessage();
        });
    } else {
      console.error('No hay URL para eliminar datos o id a eliminar');
    }
  };

  const saveChanges = () => {
    console.log(observer);
    console.log(data);

    const dataToSend = { new: [], edit: [], delete: [] };

    observer.new.forEach(id => {
      const record = data.find(r => r[recordId] === id);
      if (record) dataToSend.new.push(record);
    });

    observer.edit.forEach(id => {
      const record = data.find(r => r[recordId] === id);
      if (record) dataToSend.edit.push(record);
    });

    observer.delete.forEach(id => {
      dataToSend.delete.push(id);
    });

    if (dataToSend.new.length === 0 && dataToSend.edit.length === 0 && dataToSend.delete.length === 0) {
      if (onAlert) {
        onAlert({
          text: 'No se han registrados cambios',
          status: 'warning'
        });
      }
      return;
    }

    if (!saveURL) {
      console.error('No hay URL para guardar');
      return;
    }

    axios.post(saveURL, {
      news: dataToSend.new,
      edits: dataToSend.edit,
      deletes: dataToSend.delete,
      extra: extraData,
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jwtToken}`
      }
    })
      .then(response => {
        const genericResponse = response.data;
        const newData = [...data];

        if (genericResponse.data && Array.isArray(genericResponse.data)) {
          genericResponse.data.forEach(created => {
            const found = newData.find(r => r[recordId] === created.tmp);
            if (found) {
              const newId = created[recordId];
              const parsedValue = /^\d+$/.test(newId) ? parseInt(newId, 10) : newId;
              found[recordId] = parsedValue;
            }
          });
        }

        setData(newData);
        setObserver({ new: [], edit: [], delete: [] });

        if (onAlert) {
          onAlert({
            text: messages.success,
            status: 'success'
          });
        }
      })
      .catch(error => {
        console.error(error);
        if (error.response && onAlert) {
          onAlert({
            text: error.response.data?.message || 'Error al guardar',
            status: 'danger'
          });
        }
      });
  };

  // MANEJADORES DE EVENTOS
  const handleTextInput = (record, key, event) => {
    setNestedValue(record, key, event.target.value);
    const rowKey = record[recordId];
    if (String(rowKey).includes('tmp')) {
      if (!observer.new.includes(rowKey)) {
        setObserver(prev => ({ ...prev, new: [...prev.new, rowKey] }));
      }
    } else {
      if (!observer.edit.includes(rowKey)) {
        setObserver(prev => ({ ...prev, edit: [...prev.edit, rowKey] }));
      }
    }
    setData([...data]);
  };

  const handleRadioClick = (record, key, newValue, event) => {
    record[key] = newValue;
    const rowKey = record[recordId];
    if (String(rowKey).includes('tmp')) {
      if (!observer.new.includes(rowKey)) {
        setObserver(prev => ({ ...prev, new: [...prev.new, rowKey] }));
      }
    } else {
      if (!observer.edit.includes(rowKey)) {
        setObserver(prev => ({ ...prev, edit: [...prev.edit, rowKey] }));
      }
    }
    setData([...data]);
  };

  const handleRadioThClick = (key, event) => {
    const isChecked = event.target.checked;
    const newData = data.map(record => {
      record[key] = isChecked;
      const rowKey = record[recordId];
      if (!observer.edit.includes(rowKey)) {
        setObserver(prev => ({ ...prev, edit: [...prev.edit, rowKey] }));
      }
      return record;
    });
    setData(newData);
  };

  const handleSuggestionClicked = (record, event) => {
    const rowKey = record[recordId];
    if (String(rowKey).includes('tmp_')) {
      if (!observer.new.includes(rowKey)) {
        setObserver(prev => ({ ...prev, new: [...prev.new, rowKey] }));
      }
    } else {
      if (!observer.edit.includes(rowKey)) {
        setObserver(prev => ({ ...prev, edit: [...prev.edit, rowKey] }));
      }
    }
    setData([...data]);
    if (onSuggestionSelected && event?.detail) {
      onSuggestionSelected({
        record,
        suggestion: event.detail,
        rowKey,
        isNew: String(rowKey).includes('tmp_')
      });
    }
  };

  // FUNCIONES DE PAGINACIÓN
  const firstPage = () => {
    setPagination(prev => ({ ...prev, actualPage: 1 }));
  };

  const previousPage = () => {
    setPagination(prev => ({ ...prev, actualPage: Math.max(1, prev.actualPage - 1) }));
  };

  const nextPage = () => {
    setPagination(prev => ({ ...prev, actualPage: Math.min(prev.totalPages, prev.actualPage + 1) }));
  };

  const lastPage = () => {
    setPagination(prev => ({ ...prev, actualPage: prev.totalPages || 1 }));
  };

  const handleStepChange = (event) => {
    setPagination(prev => ({
      ...prev,
      step: +event.target.value,
      actualPage: 1,
      offset: 0
    }));
  };

  // NAVEGACIÓN
  const goToLink = (href) => {
    navigate(href);
  };

  const goToHref = (href) => {
    window.location.href = href;
  };

  const openTab = (href) => {
    window.open(href, '_blank');
  };

  // RENDER
  return (
    <>
      {/* Modal de confirmación */}
      <div ref={deleteConfirmationModalRef} className="modal fade" tabIndex="-1">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Confirmación de Eliminación</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Cerrar"></button>
            </div>
            <div className="modal-body">
              {messageConfirmationModal.text && (
                <div className={`alert alert-${messageConfirmationModal.status}`} role="alert">
                  {messageConfirmationModal.text}
                </div>
              )}
              ¿Seguro que quiere borrar el registro?
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
                disabled={btnDisabledDeleteConfirmation}
              >
                <FontAwesomeIcon icon={faTimes} className="me-1" /> Cancelar
              </button>
              <button
                type="button"
                className="btn btn-danger"
                disabled={btnDisabledDeleteConfirmation}
                onClick={deleteRowFromDB}
              >
                <FontAwesomeIcon icon={faTrash} className="me-1" /> Eliminar
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Controles de la tabla */}
      <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
        <div className="d-flex align-items-center">
          {pagination.display && data.length > 0 && (
            <>
              <label htmlFor="rows-per-page" className="form-label mb-0 me-2">Filas por página:</label>
              <select
                className="form-select"
                id="rows-per-page"
                style={{ width: '120px' }}
                value={pagination.step}
                onChange={handleStepChange}
              >
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
              </select>
            </>
          )}
        </div>
        <div className="d-flex gap-2 flex-wrap">
          {addButton.display && (
            <button
              className="btn btn-primary d-flex align-items-center gap-2"
              disabled={addButton.disabled}
              onClick={() => {
                if (typeof addButton.action === 'function') {
                  addButton.action();
                } else {
                  addRow();
                }
              }}
            >
              <FontAwesomeIcon icon={faPlus} /> Agregar Registro
            </button>
          )}
          <button 
            className="btn btn-success d-flex align-items-center gap-2" 
            onClick={saveChanges}
          >
            <FontAwesomeIcon icon={faCheck} /> Guardar Cambios
          </button>
        </div>
      </div>

      {/* Tabla */}
      {data.length > 0 ? (
        <div className="table-responsive">
          <table className="table table-striped table-hover">
            <thead>
              <tr>
                {columnNames.map((name, i) => (
                  columnTypes[i] === 'radiobuttonAll' ? (
                    <th key={i} className={columnClasses[i] || ''} style={columnStyles[i] || {}} scope="col">
                      {name}
                      <input
                        className="form-check-input form-check-input-all"
                        type="checkbox"
                        onChange={(event) => handleRadioThClick(columnKeys[i], event)}
                      />
                    </th>
                  ) : (
                    <th key={i} className={columnClasses[i] || ''} style={columnStyles[i] || {}} scope="col">
                      {name}
                    </th>
                  )
                ))}
                {actionButtons.length > 0 && (
                  <th 
                    className={actionsColumnClass} 
                    style={actionsColumnStyle}
                    scope="col"
                  >
                    Acciones
                  </th>
                )}
              </tr>
            </thead>
            <tbody>
              {data.map((record, rowIndex) => (
                <tr key={rowIndex}>
                  {columnKeys.map((key, i) => (
                    <td key={i} className={`data-td ${columnClasses[i] || ''}`} style={tdStyles[i] || {}}>
                      {columnTypes[i] === 'input[text]' && (
                        <input
                          type="text"
                          value={getNestedValue(record, key)}
                          onChange={(e) => handleTextInput(record, key, e)}
                          style={{ width: '100%' }}
                        />
                      )}
                      {String(columnTypes[i]).startsWith('autocomplete') && (() => {
                        const opts = parseAutocompleteOptions(columnTypes[i]);
                        return (
                          <Autocomplete
                            searchUrl={opts.searchUrl}
                            idKey={opts.idKey}
                            labelKey={opts.labelKey}
                            minChars={opts.minChars}
                            debounceMs={opts.debounceMs}
                            hideInput={opts.hideInput}
                            showProgress={opts.showProgress}
                            value={getNestedValue(record, key)}
                            onSelected={(e) => {
                              const opts2 = parseAutocompleteOptions(columnTypes[i]);
                              setNestedValue(record, key, e.label || e);
                              if (opts2.idTarget) {
                                setNestedValue(record, opts2.idTarget, e.id);
                              }
                              handleSuggestionClicked(record, { detail: e });
                            }}
                          />
                        );
                      })()}
                      {columnTypes[i] === 'td-datetime' && (
                        <span>{getNestedValue(record, key)}</span>
                      )}
                      {(columnTypes[i] === 'radiobutton' || columnTypes[i] === 'radiobuttonAll') && (
                        <input
                          className="form-check-input"
                          type="checkbox"
                          checked={getNestedValue(record, key)}
                          onChange={(event) => {
                            const newValue = event.target.checked;
                            setNestedValue(record, key, newValue);
                            handleRadioClick(record, key, newValue, event);
                          }}
                        />
                      )}
                      {!['input[text]', 'autocomplete', 'td-datetime', 'radiobutton', 'radiobuttonAll'].some(t =>
                        String(columnTypes[i]).startsWith(t) || columnTypes[i] === t
                      ) && (
                        <span>{getNestedValue(record, key) ?? ''}</span>
                      )}
                    </td>
                  ))}
                  {actionButtons.length > 0 && (
                    <td 
                      className={`actions-cell ${actionsCellClass}`} 
                      style={actionsCellStyle}
                    >
                      <div className="d-flex gap-1 flex-wrap justify-content-end">
                        {actionButtons.map((button, btnIndex) => {
                          const icon = getIcon(button.icon);
                          return (
                            <button
                              key={btnIndex}
                              className={`btn ${button.class || 'btn-secondary'}`}
                              style={button.style || { minWidth: '60px' }}
                              onClick={() => {
                                if (typeof button.action === 'function') {
                                  button.action(record);
                                }
                              }}
                              title={button.label}
                              disabled={button.disabled || false}
                            >
                              {icon && <FontAwesomeIcon icon={icon} className="me-1" />}
                              {button.label}
                            </button>
                          );
                        })}
                      </div>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
            {pagination.display && data.length > 0 && (
              <tfoot>
                <tr>
                  <td colSpan={columnKeys.length + (actionButtons.length > 0 ? 1 : 0)}>
                    <div className="d-flex justify-content-between align-items-center flex-wrap gap-2">
                      <div>
                        <span>
                          Página {pagination.actualPage || 1} de {pagination.totalPages || 1} -
                          Mostrando filas {pagination.offset || 0}-{pagination.limit || data.length} de {pagination.total || data.length}
                        </span>
                      </div>
                      <nav aria-label="Page navigation">
                        <ul className="pagination mb-0">
                          <li className="page-item">
                            <button
                              className={`page-link ${pagination.actualPage === 1 ? 'disabled' : ''}`}
                              type="button"
                              onClick={firstPage}
                              disabled={pagination.actualPage === 1}
                            >
                              <FontAwesomeIcon icon={faAngleDoubleLeft} className="me-1" /> Primero
                            </button>
                          </li>
                          <li className="page-item">
                            <button
                              className={`page-link ${pagination.actualPage === 1 ? 'disabled' : ''}`}
                              type="button"
                              onClick={previousPage}
                              disabled={pagination.actualPage === 1}
                            >
                              <FontAwesomeIcon icon={faAngleLeft} className="me-1" /> Anterior
                            </button>
                          </li>
                          <li className="page-item">
                            <button
                              className={`page-link ${pagination.actualPage === pagination.totalPages ? 'disabled' : ''}`}
                              type="button"
                              onClick={nextPage}
                              disabled={pagination.actualPage === pagination.totalPages}
                            >
                              Siguiente <FontAwesomeIcon icon={faAngleRight} className="ms-1" />
                            </button>
                          </li>
                          <li className="page-item">
                            <button
                              className={`page-link ${pagination.actualPage === pagination.totalPages ? 'disabled' : ''}`}
                              type="button"
                              onClick={lastPage}
                              disabled={pagination.actualPage === pagination.totalPages}
                            >
                              Último <FontAwesomeIcon icon={faAngleDoubleRight} className="ms-1" />
                            </button>
                          </li>
                        </ul>
                      </nav>
                    </div>
                  </td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      ) : (
        <p className="text-center text-muted py-4">No hay registros para mostrar.</p>
      )}
    </>
  );
};

export default DataTable;