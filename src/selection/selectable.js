import { LocalizableContent } from './../i18n/l10n';

export class SelectableBase {
  constructor({ display, description = null, key, isVisible = true }) {
    this.display = display instanceof LocalizableContent ? display : new LocalizableContent(display);
    this.description = description ? (description instanceof LocalizableContent ? description : new LocalizableContent(description)) : null;
    this.key = key;
    this.isVisible = isVisible;
  }
}

export class SelectableValue extends SelectableBase {
  constructor({ value, ...baseOptions }) {
    super(baseOptions);
    this.value = value;
  }
}
