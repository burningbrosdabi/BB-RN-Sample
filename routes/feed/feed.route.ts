import { RoutePath, RoutePathSetting, RouteSetting } from 'routes/RouteSetting';
import { Asset } from "react-native-image-picker";
import { ProductDetailProps } from "routes";

export class FeedDetailParams {
    pk: number;

    constructor(pk: number) {
        this.pk = pk;
    }
}

export class KolFeedbackParams {
    title?: string;

    constructor(title: string) {
        this.title = title;
    }
}

export class FeedsScreenRoutSetting extends RouteSetting {
    protected _path: RoutePath = RoutePath.feeds;
    shouldBeAuth = false;
}

export class KolFeedbackScreenRoutSetting extends RouteSetting<KolFeedbackParams> {
    protected _path: RoutePath = RoutePath.kolFeedback;
    shouldBeAuth = false;
}

export class FeedDetailRouteSetting extends RoutePathSetting<FeedDetailParams> {
    protected _path: RoutePath = RoutePath.feed;
    shouldBeAuth = false;
}

export class FeedCreatingRouteSetting extends RouteSetting {
    protected _path: RoutePath = RoutePath.feedCreate;
    shouldBeAuth = true;
}

export class FeedWritingRouteSetting extends RoutePathSetting<{
    assets?: Asset[] | string[], pk?: number, description?: string
}> {
    protected _path: RoutePath = RoutePath.feedWriting;
    shouldBeAuth = true;
}

export class FeedFollowsRouteSetting extends RouteSetting {
    protected _path: RoutePath = RoutePath.feedFollows;
    shouldBeAuth = true;
}

export class FollowingFeedRoutSetting extends RouteSetting {
    protected _path: RoutePath = RoutePath.followingFeeds;
    shouldBeAuth = false;
}