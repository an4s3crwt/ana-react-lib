import { LogProvider } from "./../../logging";
import { LocalizationNamespaces } from "./../../i18n/l10n";
import { ResponseStateEnumeration } from "./../../communication";
import { ServiceKeys } from "./../serviceKeys";
import { IServiceProvider } from "./../serviceProvider";

export const ServiceStateEnumeration = {
  Unknown: 0,
  Initialized: 1,
  Running: 2,
  Stopped: 3,
  Error: 4,
};

export class Service {
  // IService
  key;
  display;
  description;
  state;

  // Props
  version = 0;
  changesSubscriberDictionary = {};
  changesSubscriptionCounter = 0;
  logger;
  serviceProvider;
  isDebugModeActive = false;

  constructor(key) {
    this.key = key;

    this.display = {
      keyNamespace: LocalizationNamespaces.System,
      key: "global.nodisplaydefined",
      value: "Service?",
    };

    this.description = {
      keyNamespace: LocalizationNamespaces.System,
      key: "global.nodescriptiondefined",
      value: "Description?",
    };

    this.state = ServiceStateEnumeration.Unknown;
    this.logger = LogProvider.getLogger(key);
  }

  async start() {
    this.logger.info(`Starting '${this.key}'.`);

    // Init fields
    this.changesSubscriberDictionary = {};

    var onStartingResponse = await this.onStarting();
    if (onStartingResponse.state === ResponseStateEnumeration.OK) {
      this.logger.info(`'${this.key}' is running.`);
      this.updateState(ServiceStateEnumeration.Running);
    } else {
      this.logger.error(`'${this.key}' could not be started.`);
      this.updateState(ServiceStateEnumeration.Error);
    }

    return onStartingResponse;
  }

  async stop() {
    this.logger.info(`Stopping '${this.key}'.`);

    var onStoppingResponse = await this.onStopping();
    if (onStoppingResponse.state === ResponseStateEnumeration.OK) {
      this.logger.info(`'${this.key}' is stopped.`);
      this.updateState(ServiceStateEnumeration.Stopped);
    } else {
      this.logger.error(`'${this.key}' could not be stopped.`);
      this.updateState(ServiceStateEnumeration.Error);
    }

    // Dispose fields
    this.changesSubscriberDictionary = {};

    return onStoppingResponse;
  }

  onChanges = (contextKey, callbackHandler) => {
    // Setup register key
    this.changesSubscriptionCounter++;
    const registerKey = `${contextKey}_${this.changesSubscriptionCounter}`;

    // Register callback
    this.changesSubscriberDictionary[registerKey] = callbackHandler;
    this.logger.debug(
      `Component with key '${registerKey}' has subscribed on 'Changes'.`
    );
    this.logger.debug(
      `'${
        Object.entries(this.changesSubscriberDictionary).length
      }' subscribers on 'Changes'.`
    );

    // Execute the callback to update the handler immediately
    callbackHandler(this.version, "Subscription successfully", this.key);

    return registerKey;
  };

  offChanges = (registerKey) => {
    // Delete callback
    var existingSubscriber = Object.entries(
      this.changesSubscriberDictionary
    ).find(([key, value]) => key === registerKey);
    if (existingSubscriber) {
      delete this.changesSubscriberDictionary[registerKey];
      this.logger.debug(
        `Component with key '${registerKey}' has unsubscribed on 'Changes'.`
      );
      this.logger.debug(
        `'${
          Object.entries(this.changesSubscriberDictionary).length
        }' subscribers on 'Changes'.`
      );

      return true;
    } else {
      this.logger.error(
        `Component with key '${registerKey}' not registered on 'Changes'.`
      );
      this.logger.debug(
        `'${
          Object.entries(this.changesSubscriberDictionary).length
        }' subscribers on 'Changes'.`
      );

      return false;
    }
  };

  injectServiceProvider = (serviceProvider) => {
    this.serviceProvider = serviceProvider;
  };

  setDebugMode = (enabled) => {
    this.isDebugModeActive = enabled;
  };

  // Abstract methods
  onStopping() {
    throw new Error("Method 'onStopping' must be implemented.");
  }

  onStarting() {
    throw new Error("Method 'onStarting' must be implemented.");
  }

  updateState = (state) => {
    this.state = state;
    this.updateVersion(
      `State changed to '${ServiceStateEnumeration[this.state]}'.`
    );
  };

  updateVersion = (reason) => {
    this.version++;
    this.logger.debug(
      `Version has been updated to '${this.version}'. ${reason}`
    );

    // Execute callbacks
    Object.entries(this.changesSubscriberDictionary).forEach(([key, value]) =>
      value(this.version, reason, this.key)
    );
  };
}
