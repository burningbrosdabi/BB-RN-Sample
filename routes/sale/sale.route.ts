import { FeedbackInfo } from 'model';
import { RoutePath, RoutePathSetting, RouteSetting } from '../RouteSetting';

export class SaleDetailParams {
  id: number;

  constructor(id: number) {
    this.id = id;
  }
}

export class SaleDetailRouteSetting extends RoutePathSetting<SaleDetailParams> {
  protected _path: RoutePath = RoutePath.saleDetail;
  shouldBeAuth = false;
}

export class SalesParams{
  is_ended?:boolean
}

export class SalesRouteSetting extends RoutePathSetting<SalesParams> {
  protected _path: RoutePath = RoutePath.sales;
  shouldBeAuth = false;
}

// export class SaleListScreenRouteSettings extends RouteSetting{
//   protected _path: RoutePath = RoutePath.magazines;
//   shouldBeAuth = false;
// }
