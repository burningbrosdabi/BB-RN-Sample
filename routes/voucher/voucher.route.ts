import { ICoupon } from 'model/coupon/coupon';
import { RoutePath, RouteSetting } from 'routes/RouteSetting';
import { store } from 'utils/state';
import { isNil } from 'lodash';
import { showDialog } from 'utils/state/action-creators';
import { SubCartSummary } from 'model/checkout/checkout';

interface IVoucherRouteParam {
  selectedCoupon: ICoupon | null;
  setCoupon: (coupon: ICoupon) => void;
  subcartSummary: SubCartSummary[];
}
export type { IVoucherRouteParam };

export class VoucherScreenRouteSetting extends RouteSetting<IVoucherRouteParam> {
  shouldBeAuth = true;
  protected _path = RoutePath.voucherScreen;

  guard(): boolean {
    if (isNil(this?.params?.subcartSummary)) {
      store.dispatch(
        showDialog({
          title: 'Không thể mở màn hình chọn mã khuyến mãi',
          description: 'Đã có lỗi xảy ra, bạn vui lòng thử lại sau nhé!',
          actions: [{ text: 'OK', onPress: () => {} }],
        }),
      );

      return false;
    }

    return true;
  }
}
