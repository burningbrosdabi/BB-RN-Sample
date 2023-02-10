import {RoutePath, RoutePathSetting, RouteSetting} from 'routes/RouteSetting';

export class StoreUpdateRouteSetting extends RouteSetting  {
  shouldBeAuth = false;
  protected _path = RoutePath.storeUpdateScreen;
}

