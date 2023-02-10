import { RoutePath, RouteSetting } from 'routes/RouteSetting';
import { PickType } from "_api";
import { PickResult } from "model/pick/pick";

export class PickResultRouteSetting extends RouteSetting {
    protected _path = RoutePath.pickResult;
    shouldBeAuth = true;

}

export class PickABRouteSetting extends RouteSetting {
    protected _path = RoutePath.pickAB;
    shouldBeAuth = true;

}

export class PickIn6RouteSetting extends RouteSetting {
    protected _path = RoutePath.pickIn6;
    shouldBeAuth = true;
}

export class PickIn6ExplanationRouteSetting extends RouteSetting {
    protected _path = RoutePath.pickExplanation;
    shouldBeAuth = true;

}


export class PickAnalysisRouteSetting extends RouteSetting<{ data?: PickResult, type: PickType }> {
    protected _path = RoutePath.pickAnalysis;
    shouldBeAuth = true;

}

export class PickRecommendRouteSetting extends RouteSetting<{ type: PickType }> {
    protected _path = RoutePath.pickRecommend;
    shouldBeAuth = true;
}

export class PickHistoryRouteSetting extends RouteSetting {
    protected _path = RoutePath.pickHistory;
    shouldBeAuth = true;
}