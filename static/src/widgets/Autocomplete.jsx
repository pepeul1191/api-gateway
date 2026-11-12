// src/components/Autocomplete.jsx
import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import './Autocomplete.css';

const Autocomplete = ({
  searchUrl = '',
  jwtKey = 'jwtToken',
  placeholder = 'Buscar...',
  minChars = 2,
  debounceMs = 300,
  onSelect = null,
  idKey = 'id',
  labelKey = 'name',
  value: initialValue = '',
  onSelected,
}) => {
  // Estado
  const [searchTerm, setSearchTerm] = useState(initialValue || '');
  const [results, setResults] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [selectedLabel, setSelectedLabel] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [value, setValue] = useState(initialValue || '');

  // Refs
  const debounceTimerRef = useRef(null);
  const inputRef = useRef(null);
  const isMountedRef = useRef(true);

  // Efecto para sincronizar value externo
  useEffect(() => {
    if (initialValue !== searchTerm) {
      setSearchTerm(initialValue || '');
      setValue(initialValue || '');
    }
  }, [initialValue]);

  // Limpiar al desmontar
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  // Función de búsqueda
  const search = useCallback(async (term) => {
    setError('');
    setResults([]);
    setShowResults(false);

    if (!term || term.length < minChars) {
      return;
    }

    if (!searchUrl) {
      setError('searchUrl no configurada');
      return;
    }

    setIsLoading(true);

    try {
      const jwt = typeof localStorage !== 'undefined' ? localStorage.getItem(jwtKey) : null;
      const config = {
        headers: jwt ? { Authorization: `Bearer ${jwt}` } : {},
      };

      const url = `${searchUrl}?name=${encodeURIComponent(term)}`;
      const response = await axios.get(url, config);

      if (!isMountedRef.current) return;

      if (response.data && response.data.success && response.data.data && Array.isArray(response.data.data.list)) {
        setResults(response.data.data.list);
        setShowResults(response.data.data.list.length > 0);
      } else if (Array.isArray(response.data)) {
        setResults(response.data);
        setShowResults(response.data.length > 0);
      } else {
        setError(response.data?.message || 'Error en la búsqueda');
        setShowResults(false);
      }
    } catch (err) {
      if (!isMountedRef.current) return;
      setError(err.response?.data?.message || err.message || 'Error en la búsqueda');
      setShowResults(false);
    } finally {
      if (isMountedRef.current) {
        setIsLoading(false);
      }
    }
  }, [searchUrl, jwtKey, minChars]);

  // Manejador de cambio de input
  const handleInputChange = useCallback((e) => {
    const newValue = e.target.value;
    setSearchTerm(newValue);
    setValue(newValue);
    
    // Si estamos escribiendo, resetear selección
    if (selectedId) {
      setSelectedId(null);
      setSelectedLabel('');
    }
    
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    if (!newValue) {
      setResults([]);
      setShowResults(false);
      return;
    }

    debounceTimerRef.current = setTimeout(() => {
      search(newValue);
    }, debounceMs);
  }, [selectedId, search, debounceMs]);

  // Seleccionar un resultado
  const selectResult = useCallback((item) => {
    const newValue = item[labelKey];
    
    setSelectedId(item[idKey]);
    setSelectedLabel(newValue);
    setSearchTerm(newValue);
    setValue(newValue);
    setShowResults(false);
    setResults([]);

    const selectionData = { id: item[idKey], label: newValue };
    
    if (onSelected) {
      onSelected(selectionData);
    }
    
    if (typeof onSelect === 'function') {
      onSelect(selectionData);
    }
  }, [idKey, labelKey, onSelect, onSelected]);

  // Limpiar
  const clear = useCallback(() => {
    setSearchTerm('');
    setValue('');
    setSelectedId(null);
    setSelectedLabel('');
    setResults([]);
    setShowResults(false);
    setError('');
    
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  // Manejar blur
  const handleBlur = useCallback(() => {
    setTimeout(() => {
      setShowResults(false);
    }, 200);
  }, []);

  // Manejar focus
  const handleFocus = useCallback(() => {
    if (results.length > 0) {
      setShowResults(true);
    }
  }, [results]);

  return (
    <div className="autocomplete-container">
      <div className="input-group-wrapper">
        <input
          ref={inputRef}
          type="text"
          className="form-control"
          placeholder={placeholder}
          value={value}
          onChange={handleInputChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          autoComplete="off"
        />
        {(selectedId || searchTerm) && (
          <button 
            type="button" 
            className="clear-btn" 
            onClick={clear} 
            title="Limpiar"
          >
            ✕
          </button>
        )}
      </div>

      {error && (
        <div className="error-text">{error}</div>
      )}

      {showResults && (
        <div className="results-dropdown">
          {isLoading ? (
            <div className="loading-text">Buscando...</div>
          ) : results.length > 0 ? (
            results.map((item) => (
              <div 
                key={item[idKey]}
                className="result-item"
                onMouseDown={(e) => {
                  e.preventDefault();
                  selectResult(item);
                }}
              >
                <div className="result-label">{item[labelKey]}</div>
              </div>
            ))
          ) : (
            <div className="no-results">Sin resultados</div>
          )}
        </div>
      )}
    </div>
  );
};

export default Autocomplete;