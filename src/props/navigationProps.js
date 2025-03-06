import { NavigationElementBase } from '../navigation/navigation';

export class NavigationElementProps extends NavigationElementBase {
  constructor({ icon = null, ...baseOptions }) {
    super(baseOptions);
    this.icon = icon;
  }
}
