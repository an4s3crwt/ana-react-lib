import { Service } from "../abstractions";
import {
  createResponse,
  ResponseStateEnumeration,
} from "./../../communication";
import { NavigationTypeEnumeration } from "../../navigation";
import { LocalizationNamespaces } from "../../i18n/l10n";

export const NavigationRequestCallbackMethod = (navigationRequest) => {};

export class NavigationService extends Service {
  // INavigationService
  history = [];

  // Props
  navigationRequestSubscriberDictionary = {};
  navigationRequestSubscriptionCounter = 0;
  historyOverflowLimit = 2000;

  constructor(key) {
    super(key);

    this.display = {
      keyNamespace: LocalizationNamespaces.System,
      key: "services.navigationservice.display",
      value: "Navigation Service",
    };

    this.description = {
      keyNamespace: LocalizationNamespaces.System,
      key: "services.navigationservice.description",
      value: "Provides all interaction options for UI navigation.",
    };
  }

  show = (navigationData, url) => {
    var navigationRequest = {
      key: navigationData.key,
      type: navigationData.type
        ? navigationData.type
        : NavigationTypeEnumeration.View,
      url: url,
      timeStamp: Date.now(),
    };

    this.processNaviagtionRequest(navigationRequest);
  };

  onNavigationRequest = (contextKey, callbackHandler) => {
    // Setup register key
    this.navigationRequestSubscriptionCounter++;
    const registerKey = `${contextKey}_${this.navigationRequestSubscriptionCounter}`;

    // Register callback
    this.navigationRequestSubscriberDictionary[registerKey] = callbackHandler;
    this.logger.debug(
      `Component with key '${registerKey}' has subscribed on 'NavigationRequest'.`
    );
    this.logger.debug(
      `'${
        Object.entries(this.navigationRequestSubscriberDictionary).length
      }' subscribers on 'Changes'.`
    );

    return registerKey;
  };

  offNavigationRequest = (registerKey) => {
    // Delete callback
    var existingSubscriber = Object.entries(
      this.navigationRequestSubscriberDictionary
    ).find(([key, value]) => key === registerKey);
    if (existingSubscriber) {
      delete this.navigationRequestSubscriberDictionary[registerKey];
      this.logger.debug(
        `Component with key '${registerKey}' has unsubscribed on 'Changes'.`
      );
      this.logger.debug(
        `'${
          Object.entries(this.navigationRequestSubscriberDictionary).length
        }' subscribers on 'Changes'.`
      );

      return true;
    } else {
      this.logger.error(
        `Component with key '${registerKey}' not registered on 'Changes'.`
      );
      this.logger.debug(
        `'${
          Object.entries(this.navigationRequestSubscriberDictionary).length
        }' subscribers on 'Changes'.`
      );

      return false;
    }
  };

  async onStarting() {
    return createResponse(true, ResponseStateEnumeration.OK, []);
  }

  async onStopping() {
    return createResponse(true, ResponseStateEnumeration.OK, []);
  }

  processNaviagtionRequest = (navigationRequest) => {
    // Execute callbacks
    Object.entries(this.navigationRequestSubscriberDictionary).forEach(
      ([key, value]) => value(navigationRequest)
    );

    // Archive navigation request
    this.archiveNavigationRequest(navigationRequest);

    // Increase service version
    this.updateVersion(
      `Navigation requested has been added [${navigationRequest.key}, ${navigationRequest.type}]`
    );
  };

  archiveNavigationRequest = (navigationRequest) => {
    // Add navigation request
    this.history.unshift(navigationRequest);

    if (this.history.length > this.historyOverflowLimit) this.history.pop();
  };
}
