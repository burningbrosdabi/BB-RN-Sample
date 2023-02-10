import {
  JsonObject,
  JsonProperty,
} from 'json2typescript/src/json2typescript/json-convert-decorators';
import { JsonSerializable, OrderItem } from 'model';
import { RoutePath, RoutePathSetting } from 'routes/RouteSetting';
import { OrderStatus } from 'scenes/order/orderHistory/type';

export interface IOrderDetailParams {
  id: string;
}

@JsonObject('OrderDetailParams')
export class OrderDetailParams
  extends JsonSerializable<OrderDetailParams>
  implements IOrderDetailParams
{
  @JsonProperty('id', String, false)
  id!: string;

  protected get classRef(): new () => OrderDetailParams {
    return OrderDetailParams;
  }
}

export interface IOrderHistoryParams {
  initTabIndex?: number;
}

export class OrderHistoryRouteSetting extends RoutePathSetting<IOrderHistoryParams> {
  protected _path = RoutePath.orderHistoryScreen;
  shouldBeAuth = true;
}

export class OrderDetailRouteSetting extends RoutePathSetting<IOrderDetailParams> {
  protected _path = RoutePath.orderDetailScreen;
  shouldBeAuth = true;
}

export interface IOrderDeliverParams {
  id?: string;
  data?: OrderItem;
  initTabIndex?: number;
}

@JsonObject('OrderDeliveryParams')
export class OrderDeliveryParams
  extends JsonSerializable<OrderDeliveryParams>
  implements IOrderDeliverParams
{
  @JsonProperty('id', String, true)
  id?: string;

  data?: OrderItem;

  protected get classRef(): new () => OrderDeliveryParams {
    return OrderDeliveryParams;
  }
}

export class OrderDeliveryRouteSetting extends RoutePathSetting<IOrderDeliverParams> {
  protected _path = RoutePath.orderDeliveryStatusScreen;
  shouldBeAuth = true;
}

export class OrderRouteParams {
  status: OrderStatus;

  constructor(status: OrderStatus) {
    this.status = status;
  }
}

export class OrdersRouteSetting extends RoutePathSetting<OrderRouteParams> {
  protected _path = RoutePath.orders;
  shouldBeAuth = true;
}
