import {RoutePath, RoutePathSetting, RouteSetting} from "routes";
import {StoreInfo} from "model";
import {isNil} from "lodash";

export type StoreParams = {
    pk?: number;
    store?: StoreInfo;
    ordering?: string;
}

export class StoreRouteSetting extends RoutePathSetting<StoreParams> {
    shouldBeAuth = false;
    protected _path = RoutePath.storeDetail;

    guard(): boolean {
        return !isNil(this.params?.pk) || !isNil(this.params?.store?.pk)
    }
}

