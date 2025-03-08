import { Service } from './abstractions';
import { ServiceDictionary } from './serviceDictionary';
import { LogProvider } from './../logging';
import { ResponseStateEnumeration } from './../communication';

export class ServiceProvider {
  constructor(key) {
    this.key = key;
    this.serviceDictionary = ServiceDictionary;
    this.logger = LogProvider.getLogger(this.key);
  }

  addService(service, serviceKey) {
    if (this.serviceDictionary[serviceKey]) return;
    this.logger.info(`Service '${serviceKey}' added.`);
    this.serviceDictionary[serviceKey] = service;
  }

  getService(serviceKey) {
    const service = this.serviceDictionary[serviceKey];
    if (service) return service;
    this.logger.error(`Service '${serviceKey}' not found.`);
    return undefined;
  }

  async startServices() {
    this.logger.info(`'${Object.keys(this.serviceDictionary).length}' services detected.`);
    this.logger.info(`Starting services.`);

    const serviceStartPromises = Object.values(this.serviceDictionary).map(service => {
      service.injectServiceProvider(this);
      return service.start();
    });

    const serviceStartResponses = await Promise.all(serviceStartPromises);
    const failedServices = serviceStartResponses.filter(r => r.state === ResponseStateEnumeration.Error);

    if (failedServices.length > 0)
      this.logger.error(`Not all services could be started. '${failedServices.length}' services failed!`);
    else
      this.logger.info(`All services started and ready.`);

    return failedServices.length === 0;
  }

  async stopServices() {
    this.logger.info(`'${Object.keys(this.serviceDictionary).length}' services detected.`);
    this.logger.info(`Stopping services.`);

    const serviceStopPromises = Object.values(this.serviceDictionary).map(service => service.stop());
    const serviceStopResponses = await Promise.all(serviceStopPromises);
    const failedServices = serviceStopResponses.filter(r => r.state === ResponseStateEnumeration.Error);

    if (failedServices.length > 0)
      this.logger.error(`Not all services could be stopped. '${failedServices.length}' services failed!`);
    else
      this.logger.info(`All services stopped.`);

    return failedServices.length === 0;
  }
}
