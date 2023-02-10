import { RoutePath, RouteSetting } from 'routes/RouteSetting';

export class CartRouteSetting extends RouteSetting {
  protected _path = RoutePath.cart;
  shouldBeAuth = true;
  
}
