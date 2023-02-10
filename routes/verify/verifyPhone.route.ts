import { RoutePath, RoutePathSetting } from '../RouteSetting';

export type OnSuccessCb = (phoneNumber: string) => void;

interface PhoneVerifyParams {
  onSuccess?: OnSuccessCb;
  onCanceled?: () => void;
}

export class PhoneVerifyRouteSetting extends RoutePathSetting<PhoneVerifyParams> {
  protected _path: RoutePath = RoutePath.verifyPhone;
  shouldBeAuth = true;
}

export class OTPVerifyRouteSetting extends RoutePathSetting<{
  phone: string;
  onSuccess: OnSuccessCb;
}> {
  protected _path: RoutePath = RoutePath.verifyOTP;
  shouldBeAuth = true;
}

export class VerifyBlockedRouteSetting extends RoutePathSetting<{ phone: string }> {
  protected _path: RoutePath = RoutePath.verifyBlocked;
  shouldBeAuth = true;
}
