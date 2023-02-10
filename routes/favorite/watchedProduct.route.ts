import { RoutePath, RouteSetting } from 'routes/RouteSetting';

export class FavoriteWatchedProductRouteSetting extends RouteSetting {
  shouldBeAuth = true;
  protected _path = RoutePath.favoriteWatchedProduct;
}
