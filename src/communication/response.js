import { ILocalizableContent } from './../i18n/l10n'; //no lo uso?

const ResponseStateEnumeration = {
  Unknown: 0,
  OK: 1,
  Error: 2
};

class ResponseMessage {
  constructor(display, context, logText = '') {
    this.display = display;
    this.context = context;
    this.logText = logText;
  }
}

class Response {
  constructor(state = ResponseStateEnumeration.OK, messageStack = [], payload = null) {
    this.state = state;
    this.messageStack = messageStack;
    this.payload = payload;
  }
}

const createResponse = (payload, state = ResponseStateEnumeration.OK, messageStack = []) => {
  return new Response(state, messageStack, payload);
};

export { ResponseStateEnumeration, ResponseMessage, Response, createResponse };
