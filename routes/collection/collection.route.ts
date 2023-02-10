import {isNil} from 'lodash';
import {Collection, CollectionType} from 'model/collection/collection';
import {RoutePath, RoutePathSetting, RouteSetting} from 'routes/RouteSetting';

export interface ILandingParams {
    type: CollectionType;
    id: number
}

export class LandingParams implements ILandingParams {
    id: number;
    type: CollectionType;

    constructor(id: number, type: CollectionType) {
        this.id = id;
        this.type = type;
    }
}

export class LandingRouteSetting extends RoutePathSetting<ILandingParams> {
    protected _path: RoutePath = RoutePath.collection;
    shouldBeAuth = false;

    guard() {
        return !isNil(this.params?.type) && !isNil(this.params?.id);
    }
}

export class CollectionsScreenRouteSetting extends RouteSetting {
    protected _path: RoutePath = RoutePath.collections;
    shouldBeAuth = false;
}