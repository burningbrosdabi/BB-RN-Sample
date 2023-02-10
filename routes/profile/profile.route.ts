import { RoutePath, RoutePathSetting } from 'routes/RouteSetting';


export interface IUserFeedbackListParams {
}
export class userFeedbackListRouteSetting extends RoutePathSetting<IUserFeedbackListParams> {
  protected _path = RoutePath.userFeedbackListScreen;
  shouldBeAuth = true;
}

export class IUserFollowListParams {
  key?: number

  constructor(key: number) {
    this.key = key;
  }
}


export class userFollowListRouteSetting extends RoutePathSetting<IUserFollowListParams> {
  protected _path = RoutePath.follow;
  shouldBeAuth = true;
}

export interface ISettingsParams {
}
export class settingsRouteSetting extends RoutePathSetting<ISettingsParams> {
  protected _path = RoutePath.setting;
  shouldBeAuth = true;
}


export interface IProfileUpdateParams {
}

export class profileUpdateRouteSetting extends RoutePathSetting<IProfileUpdateParams> {
  protected _path = RoutePath.profileUpdate;
  shouldBeAuth = true;
}


export interface ISocialSettingParams {
}

export class socialSettingRouteSetting extends RoutePathSetting<ISocialSettingParams> {
  protected _path = RoutePath.socialSetting;
  shouldBeAuth = true;
}

export interface INotificationSettingParams {
}

export class notificationSettingRouteSetting extends RoutePathSetting<INotificationSettingParams> {
  protected _path = RoutePath.notificationSetting;
  shouldBeAuth = true;
}


export interface ITermsAndConditionsParams {
}

export class termsAndConditionsRouteSetting extends RoutePathSetting<ITermsAndConditionsParams> {
  protected _path = RoutePath.termsAndConditions;
  shouldBeAuth = true;
}

export interface ISupporterSettingParams {
}

export class supporterSettingRouteSetting extends RoutePathSetting<ISupporterSettingParams> {
  protected _path = RoutePath.supporterSetting;
  shouldBeAuth = true;
}


export class IUserFavoriteParams {
  key?: number

  constructor(key: number) {
    this.key = key;
  }
}

export class userFavoriteRouteSetting extends RoutePathSetting<IUserFavoriteParams> {
  protected _path = RoutePath.favorite;
  shouldBeAuth = true;
}

export class UserProfileParams {
  pk: number;
  constructor(pk: number) {
    this.pk = pk;
  }
}

export class UserProfileRouteSetting extends RoutePathSetting<UserProfileParams>{
  protected _path = RoutePath.UserProfile;
  shouldBeAuth = false;

}