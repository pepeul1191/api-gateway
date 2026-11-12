// src/components/widgets/UploadFile.jsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import './UploadFile.css'

const UploadFile = ({
  postUrl = '',
  jwtKey = 'jwtToken',
  extraParams = {},
  responseFormat = 'standard',
  baseURL = '/',
  allowedExtensions = [],
  maxFileSizeMB = 5,
  multiple = false,
  maxFiles = 1,
  fieldName = 'file',
  headers = {},
  hideInput = false,
  showProgress = true,
  showCleanButton = true,
  fileUrlPrefix = '',
  fileUrl: initialFileUrl = '',
  messageDuration = 5000,
  onUploaded,
  onError,
  onProgress,
  onClear,
}) => {
  // Estado
  const [selectedFile, setSelectedFile] = useState(null);
  const [upload, setUpload] = useState({
    file: null,
    progress: 0,
    status: 'pending', // pending | uploading | done | error
    response: null,
    error: null,
    fileUrl: null
  });
  const [errors, setErrors] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');
  const [fileUrl, setFileUrl] = useState(initialFileUrl);
  
  // Ref para el input file
  const inputRef = useRef(null);
  
  // Ref para timeouts
  const errorTimeoutsRef = useRef([]);
  const successTimeoutRef = useRef(null);

  // Guardar valor inicial para reset
  const initialFileUrlRef = useRef(initialFileUrl);

  // Limpiar timeouts al desmontar
  useEffect(() => {
    return () => {
      clearAllTimeouts();
    };
  }, []);

  // Funciones de utilidad
  const humanSize = (bytes) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const clearAllTimeouts = () => {
    errorTimeoutsRef.current.forEach(timeout => clearTimeout(timeout));
    errorTimeoutsRef.current = [];
    
    if (successTimeoutRef.current) {
      clearTimeout(successTimeoutRef.current);
      successTimeoutRef.current = null;
    }
  };

  const addErrorWithTimeout = (errorMsg) => {
    setErrors(prev => [...prev, errorMsg]);
    
    const timeout = setTimeout(() => {
      setErrors(prev => prev.filter(e => e !== errorMsg));
      errorTimeoutsRef.current = errorTimeoutsRef.current.filter(t => t !== timeout);
    }, messageDuration);
    
    errorTimeoutsRef.current = [...errorTimeoutsRef.current, timeout];
  };

  const setSuccessWithTimeout = (message) => {
    setSuccessMessage(message);
    
    if (successTimeoutRef.current) {
      clearTimeout(successTimeoutRef.current);
    }
    
    successTimeoutRef.current = setTimeout(() => {
      setSuccessMessage('');
      successTimeoutRef.current = null;
    }, messageDuration);
  };

  const validateFile = (file) => {
    // Validar extensión
    if (allowedExtensions && allowedExtensions.length > 0) {
      const name = file.name || '';
      const ext = name.split('.').pop().toLowerCase();
      if (!allowedExtensions.map(x => x.toLowerCase()).includes(ext)) {
        return `Extensión no permitida (.${ext})`;
      }
    }

    // Validar tamaño
    if (maxFileSizeMB && maxFileSizeMB > 0) {
      const maxBytes = Number(maxFileSizeMB) * 1024 * 1024;
      if (file.size > maxBytes) {
        return `Archivo mayor a ${maxFileSizeMB} MB (${humanSize(file.size)})`;
      }
    }

    return null;
  };

  // Función para resetear al estado inicial
  const resetToInitial = useCallback(() => {
    setSelectedFile(null);
    setUpload({
      file: null,
      progress: 0,
      status: 'pending',
      response: null,
      error: null,
      fileUrl: null
    });
    setErrors([]);
    setSuccessMessage('');
    setFileUrl(initialFileUrlRef.current);
    
    if (inputRef.current) {
      inputRef.current.value = '';
    }
    
    clearAllTimeouts();
    
    if (onClear) {
      onClear({ fileUrl: initialFileUrlRef.current });
    }
  }, [onClear]);

  // Función pública clear
  const clear = useCallback(() => {
    resetToInitial();
  }, [resetToInitial]);

  // Exponer clear como método público (similar a export function clear)
  useEffect(() => {
    // Si necesitas exponer el método, puedes usar useImperativeHandle
    // o simplemente pasar la función como prop
  }, [clear]);

  const triggerFileInput = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  const onFileChange = (e) => {
    handleFiles(e.target.files);
  };

  const handleFiles = (fileList) => {
    setErrors([]);
    setSuccessMessage('');
    clearAllTimeouts();
    
    const arr = Array.from(fileList || []);

    if (arr.length === 0) return;
    
    if (arr.length > 1) {
      addErrorWithTimeout('Solo puede seleccionar un archivo');
      return;
    }

    const file = arr[0];
    const err = validateFile(file);
    if (err) {
      addErrorWithTimeout(`${file.name}: ${err}`);
      return;
    }

    // Reemplazar archivo seleccionado
    setSelectedFile(file);
    setUpload({
      file: file,
      progress: 0,
      status: 'pending',
      response: null,
      error: null,
      fileUrl: null
    });
    
    // Auto-subir si hideInput es true
    if (!hideInput && postUrl) {
      uploadFile(file);
    }
  };

  const uploadFile = async (fileParam) => {
    const fileToUpload = fileParam || selectedFile;
    
    if (!fileToUpload) {
      addErrorWithTimeout('No hay archivo seleccionado');
      return;
    }

    if (!postUrl) {
      addErrorWithTimeout('No se ha configurado postUrl');
      return;
    }

    if (upload.status === 'done' || upload.status === 'uploading') {
      return;
    }

    setUpload(prev => ({ ...prev, status: 'uploading' }));
    setErrors([]);
    setSuccessMessage('');
    clearAllTimeouts();

    const form = new FormData();
    form.append(fieldName, fileToUpload);
    
    for (const k in extraParams) {
      if (Object.prototype.hasOwnProperty.call(extraParams, k)) {
        form.append(k, extraParams[k]);
      }
    }

    const jwt = typeof localStorage !== 'undefined' ? localStorage.getItem(jwtKey) : null;
    const cfg = {
      headers: {
        ...headers,
        ...(jwt ? { Authorization: `Bearer ${jwt}` } : {}),
        'Content-Type': 'multipart/form-data'
      },
      onUploadProgress: (evt) => {
        const percent = evt.total ? Math.round((evt.loaded * 100) / evt.total) : 0;
        setUpload(prev => ({ ...prev, progress: percent }));
        if (onProgress) {
          onProgress({ file: fileToUpload, progress: percent });
        }
      }
    };

    try {
      const res = await axios.post(postUrl, form, cfg);
      
      let newFileUrl = '';
      let responseData = res.data;

      setUpload(prev => ({ ...prev, response: responseData }));

      // Extraer URL del archivo de la respuesta
      if (responseData?.data?.url) {
        newFileUrl = responseData.data.url;
      } else if (responseData?.url) {
        newFileUrl = responseData.url;
      } else if (responseData?.data?.fileUrl) {
        newFileUrl = responseData.data.fileUrl;
      } else if (responseData?.fileUrl) {
        newFileUrl = responseData.fileUrl;
      } else if (fileUrlPrefix && responseData?.data) {
        const d = responseData.data;
        if (d.folder && d.filename) {
          newFileUrl = `${fileUrlPrefix}${d.folder}/${d.filename}`;
        } else if (d.filename) {
          newFileUrl = fileUrlPrefix + d.filename;
        }
      }

      if (newFileUrl) {
        setFileUrl(newFileUrl);
        setUpload(prev => ({ ...prev, fileUrl: newFileUrl }));
      }

      // Normalizar respuesta
      if (responseFormat === 'standard') {
        if (responseData?.success) {
          setUpload(prev => ({ ...prev, status: 'done' }));
          
          if (responseData.data?.folder && responseData.data?.filename) {
            const url = `${responseData.data.folder}/${responseData.data.filename}`;
            setFileUrl(url);
            setUpload(prev => ({ ...prev, fileUrl: url }));
          }
          
          const msg = responseData.message || 'Archivo subido exitosamente';
          setSuccessWithTimeout(msg);
          console.log('File uploaded successfully. URL:', fileUrl);
          
          if (onUploaded) {
            onUploaded({
              file: fileToUpload,
              data: responseData.data,
              message: responseData.message,
              fileUrl: newFileUrl || fileUrl
            });
          }
        } else {
          const errMsg = responseData?.message || responseData?.error || 'Error desconocido';
          setUpload(prev => ({
            ...prev,
            status: 'error',
            error: errMsg
          }));
          addErrorWithTimeout(errMsg);
          
          if (onError) {
            onError({
              file: fileToUpload,
              error: errMsg,
              message: responseData?.message,
              response: responseData
            });
          }
        }
      } else {
        // raw
        setUpload(prev => ({ ...prev, status: 'done' }));
        setSuccessWithTimeout('Archivo subido exitosamente');
        
        if (onUploaded) {
          onUploaded({
            file: fileToUpload,
            data: responseData,
            fileUrl: newFileUrl || fileUrl
          });
        }
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Error al subir el archivo';
      
      setUpload(prev => ({
        ...prev,
        status: 'error',
        error: err.response?.data || err.message || err
      }));
      
      addErrorWithTimeout(errorMsg);
      
      if (onError) {
        onError({
          file: fileToUpload,
          error: upload.error,
          response: err.response?.data || null
        });
      }
    }
  };

  const removeFile = () => {
    resetToInitial();
  };

  const openFileInNewTab = () => {
    console.log('Opening file URL:', fileUrl);
    if (fileUrl) {
      window.open(`${baseURL}/${fileUrl}`, '_blank');
    }
  };

  // Calcular si el botón clear debe estar deshabilitado
  const isClearDisabled = !selectedFile && fileUrl === initialFileUrlRef.current;

  return (
    <div className={!hideInput ? 'upload-box' : ''}>
      <div className="mb-2">
        {hideInput ? (
          <>
            <button 
              type="button" 
              className="btn btn-primary" 
              onClick={triggerFileInput}
            >
              <i className="fa fa-folder-open" aria-hidden="true"></i>
              Archivo
            </button>

            <input 
              ref={inputRef}
              type="file" 
              onChange={onFileChange}
              multiple={false}
              style={{ display: 'none' }}
            />

            <button 
              type="button"
              className="btn btn-primary" 
              onClick={() => uploadFile()}
              disabled={!postUrl || !selectedFile || upload.status === 'uploading' || upload.status === 'done'}
            >
              <i className="fa fa-upload" aria-hidden="true"></i>
              Subir
            </button>

            {fileUrl && (
              <button   
                type="button" 
                className="btn btn-primary" 
                onClick={openFileInNewTab}
                title="Ver archivo"
              >
                <i className="fa fa-picture-o" aria-hidden="true"></i>
                Ver
              </button>
            )}

            {showCleanButton && (
              <button 
                className="btn btn-secondary" 
                onClick={clear}
                disabled={isClearDisabled}
              >
                <i className="fa fa-trash" aria-hidden="true"></i>
                Limpiar
              </button>
            )}
          </>
        ) : (
          <input 
            ref={inputRef}
            type="file" 
            onChange={onFileChange}
            multiple={false}
          />
        )}
      </div>

      {/* Contenedor de mensajes */}
      <div className="message-container">
        {errors.length > 0 && (
          <div className="mb-2">
            {errors.map((err, index) => (
              <small key={index} className="status-label error">{err}</small>
            ))}
          </div>
        )}

        {successMessage && (
          <div className="mb-2">
            <small className="status-label success">{successMessage}</small>
          </div>
        )}
      </div>
      
      {selectedFile && showProgress && (
        <div className="mb-2">
          <div className="file-row">
            <div>
              <strong>{selectedFile.name}</strong>
              <div className="small-muted">{humanSize(selectedFile.size)}</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              {upload.status === 'uploading' && (
                <>
                  <progress value={upload.progress} max="100">{upload.progress}%</progress>
                  <small className="status-label info">Subiendo...</small>
                </>
              )}
              {upload.status === 'done' && (
                <>
                  <small className="status-label success">Subido</small>
                  {fileUrl && (
                    <button 
                      type="button" 
                      className="btn btn-sm btn-outline-info" 
                      onClick={openFileInNewTab}
                      title="Ver archivo"
                    >
                      Ver
                    </button>
                  )}
                </>
              )}
              {upload.status === 'error' && (
                <>
                  <small className="status-label error">Error</small>
                  {upload.error && (
                    <span className="small-muted ms-2">
                      {typeof upload.error === 'string' ? upload.error : JSON.stringify(upload.error)}
                    </span>
                  )}
                </>
              )}
              {upload.status === 'pending' && (
                <small className="status-label pending">Pendiente</small>
              )}
              <button 
                type="button" 
                className="btn btn-sm btn-outline-danger" 
                onClick={removeFile}
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      {!hideInput && (
        <div className="d-flex gap-2">
          <button 
            className="btn btn-primary" 
            onClick={() => uploadFile()}
            disabled={!postUrl || !selectedFile || upload.status === 'uploading' || upload.status === 'done'}
          >
            Subir
          </button>
          <button 
            className="btn btn-secondary" 
            onClick={clear}
            disabled={!selectedFile}
          >
            Limpiar
          </button>
        </div>
      )}
    </div>
  );
};

export default UploadFile;