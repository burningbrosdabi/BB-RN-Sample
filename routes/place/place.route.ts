import { Location } from 'model';
import { RoutePath, RoutePathSetting } from 'routes/RouteSetting';

export class PlaceDetailParams {
    location: Location

    constructor(location: Location) {
        this.location = location
    }
}


export class PlaceDetailRouteSetting extends RoutePathSetting<PlaceDetailParams> {
    protected _path: RoutePath = RoutePath.placeDetail;
    shouldBeAuth = false;
}
