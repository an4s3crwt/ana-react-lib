import { SelectableBase } from './../selection/selectable.js';
export const NavigationTypeEnumeration = Object.freeze({
  View: 'View',
  Dialog: 'Dialog'
});

export class NavigationElementBase extends SelectableBase {
  constructor({ importPath, type = NavigationTypeEnumeration.View, ...baseOptions }) {
    super(baseOptions);
    this.importPath = importPath;
    this.type = type;
  }
}

export class NavigationRequest {
  constructor({ key, type, url = null, timeStamp }) {
    this.key = key;
    this.type = type;
    this.url = url;
    this.timeStamp = timeStamp;
  }
}
