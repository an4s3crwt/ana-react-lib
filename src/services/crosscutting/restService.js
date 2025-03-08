import { Service } from '../abstractions';
import { createResponse, ResponseStateEnumeration } from '../../communication';
import { LocalizationNamespaces } from '../../i18n/l10n';

export class RESTService extends Service {

  // Props
  constructor(key) {
    super(key);

    this.display = {
      keyNamespace: LocalizationNamespaces.System,
      key: 'services.restservice.display',
      value: 'REST Service'
    };

    this.description = {
      keyNamespace: LocalizationNamespaces.System,
      key: 'services.restservice.description',
      value: 'Provides all interaction options for REST communication.'
    };

    this.authorizationHeader = '';
  }

  get(url, init) {
    return this.invokeAsync('GET', url, undefined, init);
  }

  post(url, data, init) {
    return this.invokeAsync('POST', url, data, init);
  }

  put(url, data, init) {
    return this.invokeAsync('PUT', url, data, init);
  }

  delete(url, data, init) {
    return this.invokeAsync('DELETE', url, data, init);
  }

  setAuthorization(authorizationHeader) {
    this.authorizationHeader = authorizationHeader;
  }

  async onStarting() {
    return createResponse(true, ResponseStateEnumeration.OK, []);
  }

  async onStopping() {
    return createResponse(true, ResponseStateEnumeration.OK, []);
  }

  getHeaders(data) {
    var headers = new Headers();

    // We only accept json as payload
    headers.set('Accept', 'application/json');

    // We can use different authorizations. `Bearer TOKEN`, `Basic USERNAME:PASSWORD`, etc.
    if (this.authorizationHeader !== '')
      headers.set('Authorization', this.authorizationHeader);

    // We define the type of the content by the data type
    if (data) {
      if (typeof data === 'object') {
        headers.set('Content-Type', 'application/json');
      } else {
        headers.set('Content-Type', 'application/x-www-form-urlencoded');
      }
    }

    return headers;
  }

  getBody(data) {
    var body = undefined;

    // Body data type must match "Content-Type" header
    if (data) {
      if (typeof data === 'object') {
        body = JSON.stringify(data);
      } else {
        body = String(data);
      }
    }

    return body;
  }

  getRequestInit(method, init) {
    var requestInit = {
      method: method,               // *GET, POST, PUT, DELETE, etc.
      mode: "same-origin",          // no-cors, cors, *same-origin
      cache: "default",             // *default, no-cache, reload, force-cache, only-if-cached
      credentials: "same-origin",   // include, *same-origin, omit
      redirect: "follow",           // manual, *follow, error
      referrer: "client",
    }

    if (init) {
      if (init.mode)
        requestInit.mode = init.mode;

      if (init.credentials)
        requestInit.credentials = init.credentials;
    }

    return requestInit;
  }

  async invokeAsync(method, url, data, init) {
    var responseOk = false;
    var responseStatus = 0;
    var responseStatusText = '';

    var requestInit = this.getRequestInit(method, init);
    var headers = this.getHeaders(data);
    var body = this.getBody(data);
    requestInit.headers = headers;
    requestInit.body = body;

    if (this.isDebugModeActive)
      this.logger.info(`REST request '${method}' has started on url ${url}.`);

    return fetch(url, requestInit)
      .then((response) => {

        // Save the response state
        responseOk = response.ok;
        responseStatus = response.status;
        responseStatusText = response.statusText;

        // Check how to resolve the body
        var responseContentType = response.headers.get("content-type");
        if (responseContentType && responseContentType.indexOf("application/json") !== -1)
          return response.json();
        else
          return response.text();

      })
      .then((responseObject) => {

        // Setup the response object
        var responseData = {
          state: ResponseStateEnumeration.Unknown,
          messageStack: []
        }

        if (this.isDebugModeActive)
          this.logger.info(`REST request '${method}' has returned from url ${url}. [${responseStatus}, ${responseStatusText}]`);

        if (responseObject == null || responseObject == undefined) {

          var displayKey = "services.restservice.novalidresponse";
          var displayValue = `No valid response.`;
          var logMessage = `${displayValue} Response object is null or undefined.`;

          responseData.messageStack.push({
            display: {
              keyNamespace: LocalizationNamespaces.System,
              key: displayKey,
              value: displayValue,
            },
            context: this.key,
            logText: logMessage
          });

          this.logger.error(logMessage);
        }
        else if (typeof responseObject == 'string') {

          var payload = {
            data: responseObject
          }

          responseData.state = ResponseStateEnumeration.OK;
          responseData.payload = payload;
        }
        else if (typeof responseObject == 'object') {

          var assertedResponseData = responseObject;
          if (assertedResponseData.state && assertedResponseData.messageStack && assertedResponseData.payload) {

            responseData.state = assertedResponseData.state;
            responseData.messageStack = assertedResponseData.messageStack;
            responseData.payload = assertedResponseData.payload;
          }
          else {

            responseData.state = ResponseStateEnumeration.OK;
            responseData.payload = responseObject;
          }
        }
        else {

          var displayKey = "services.restservice.noresponse";
          var displayValue = `No response available.`;
          var logMessage = `${displayValue} No idea what's going on here. Go and drink a coffee.`;

          responseData.messageStack.push({
            display: {
              key: displayKey,
              keyNamespace: LocalizationNamespaces.System,
              value: displayValue,
            },
            context: this.key,
            logText: logMessage
          });

          this.logger.error(logMessage);
        }

        // Fill the response object
        var response = {
          state: responseData.state,
          messageStack: responseData.messageStack,
          payload: responseData.payload,
        };

        return response;
      })
      .catch((reason) => {

        // Setup the response object
        var response = {
          state: ResponseStateEnumeration.Error,
          messageStack: []
        };

        return response;
      });

  };
}
