import {RoutePath, RoutePathSetting, RouteSetting} from 'routes/RouteSetting';


export class PromotionRouteSetting extends RouteSetting {
    shouldBeAuth = false;
    protected _path = RoutePath.promotion;
}
