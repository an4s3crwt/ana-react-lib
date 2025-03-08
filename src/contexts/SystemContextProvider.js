import React, { useRef, useState, useEffect } from 'react';
import { ServiceProvider } from './../services/serviceProvider';

// Contexto de propiedades
export const SystemContext = React.createContext({
  getService: (serviceKey) => undefined,
  startServices: () => Promise.resolve(false),
  stopServices: () => Promise.resolve(false),
  storeSetting: (key, value) => false,
  getSetting: (key) => undefined
});

// Crear proveedor de servicio
const serviceProvider = new ServiceProvider('ServiceProvider');

// Definición de propiedades para el proveedor
export const SystemContextProvider = (props) => {
  // Refs
  const serviceProviderRef = useRef(serviceProvider);
  const isMountedRef = useRef(false);

  const [settingsStorage, setSettingsStorage] = useState({});

  // Efectos
  useEffect(() => {
    // Montaje
    serviceProviderRef.current.startServices();
    isMountedRef.current = true;

    // Desmontaje
    return () => {
      serviceProviderRef.current.stopServices();
      isMountedRef.current = false;
    };
  }, []);

  const handleStoreSetting = (key, value) => {
    const settingsStorageCopy = { ...settingsStorage };
    settingsStorageCopy[key] = value;
    setSettingsStorage(settingsStorageCopy);

    return true;
  };

  const handleGetSetting = (key) => {
    return settingsStorage[key];
  };

  if (!isMountedRef.current && props.onInjectCustomServices) {
    const servicesToInject = props.onInjectCustomServices();
    servicesToInject.forEach(service =>
      serviceProviderRef.current.addService(service, service.key)
    );
  }

  return (
    <SystemContext.Provider
      value={{
        getService: serviceProviderRef.current.getService,
        startServices: serviceProviderRef.current.startServices,
        stopServices: serviceProviderRef.current.stopServices,
        storeSetting: handleStoreSetting,
        getSetting: handleGetSetting
      }}
    >
      {props.children}
    </SystemContext.Provider>
  );
};
