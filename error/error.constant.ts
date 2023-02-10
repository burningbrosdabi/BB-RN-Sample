declare type ErrorMap = { [id: string]: string };
export const AXIOS_NO_CONNECTION_CODE = 'ECONNABORTED';
export const ServerErrorCode: ErrorMap = {
  TIME_OUT: 'SERVER_TIME_OUT',
  OTHER: 'SERVER_ERROR',
  NO_CONNECTION: 'NO_CONNECTION',
  NO_RESPONSE: 'NO_REPSONE',
};

export const SerializeErrorCode: ErrorMap = {
  SERIALIZE_ERROR: 'SERIALIZE_ERROR',
};

export const ProductApiErrorCode: ErrorMap = {
  GET_FILTERED_PRODUCT_LIST_ERROR: 'GET_FILTERED_PRODUCT_LIST_ERROR',
};

export const CartErrorCode: ErrorMap = {
  FAILED_TO_REMOVE_SOME_ITEM: 'FAILED_TO_REMOVE_SOME_ITEM',
};

export const PhoneVerifyErrorCode: ErrorMap = {
  ACCOUNT_HAS_BEEN_BLOCKED: 'ACCOUNT_HAS_BEEN_BLOCKED',
  INCORRECT_OTP: 'INCORRECT_OTP',
  VERIFIED: 'VERIFIED',
  OTP_EXPIRED:'OTP_EXPIRED'
};

export const CheckoutErrorCode: ErrorMap = {
  EMPTY_RECIPIENT_LIST: 'EMPTY_RECIPIENT_LIST',
  PHONE_VERIFICATION_IS_REQUIRED: 'PHONE_VERIFICATION_IS_REQUIRED',
  UNABLE_TO_GET_PROVINCES: 'UNABLE_TO_GET_PROVINCES',
  FAILED_TO_GET_USER_RECIPIENT: 'FAILED_TO_GET_USER_RECIPIENT',
  CANCEL_PHONE_VERIFY: 'CANCEL_PHONE_VERIFY',
  CANCEL_CREATE_RECIPIENT: 'CANCEL_CREATE_RECIPIENT',
};

export const FeedErrorCode: ErrorMap ={
  FAILED_TO_UPLOAD_IMAGE: 'FAILED_TO_UPLOAD_IMAGE',
  FAILED_TO_CREATE_FEED: 'FAILED_TO_CREATE_FEED',
  FAILED_TO_UPDATE_FEED: 'FAILED_TO_UPDATE_FEED',
  FAILED_TO_DELETE_FEED: 'FAILED_TO_DELETE_FEED'
}

export const ASYNC_FUNCTION_TIMEOUT = 'ASYNC_FUNCTION_TIMEOUT';
export const UNHANDLED_EXCEPTION = 'UNHANDLED_EXCEPTION';


export const errorDictionary: ErrorMap = {
  [UNHANDLED_EXCEPTION]:
    'Đã có lỗi bất thường xảy ra. Chúng tôi thật sự xin lỗi vì sự bất tiện này.',
  [ServerErrorCode.TIME_OUT]:
    'Đã quá thời gian kết nỗi với hệ thống, bạn vui lòng kiểm tra kêt nối mạng nhé!',
  [ServerErrorCode.OTHER]: 'Oops, hệ thống đã xảy ra lỗi, bạn vui lòng thử lại sau nhé!',
  [ServerErrorCode.NO_CONNECTION]: 'Không có kết nối mạng, bạn vui lòng kiểm tra và thử lại nhé!',
  [ServerErrorCode.NO_RESPONSE]: 'Không thể nhận được phản hồi từ hệ thống',

  [ProductApiErrorCode.GET_FILTERED_PRODUCT_LIST_ERROR]:
    'Không thể lấy dữ liệu sản phẩm từ bộ lọc.',

  [SerializeErrorCode.SERIALIZE_ERROR]: 'Dữ liệu sai định dạng.',

  [CartErrorCode.FAILED_TO_REMOVE_SOME_ITEM]:
    'Đã có lỗi xảy ra. Một số sản phẩm không thể bỏ khỏi giỏ hàng.',

  [PhoneVerifyErrorCode.ACCOUNT_HAS_BEEN_BLOCKED]:
    'Due to unusual activity, we have blocked this process. Please try again after 30 minutes.',
  [PhoneVerifyErrorCode.VERIFIED]:
    'Số điện thoại này đã được xác thực. Bạn vui lòng sử dụng số điện thoại khác.',

  [CheckoutErrorCode.UNABLE_TO_GET_PROVINCES]:
    'Không thể lấy thông tin địa chị quận, huyện, thành phố.',
  [CheckoutErrorCode.CANCEL_PHONE_VERIFY]:
    'Bạn cần xác thực số điện thoại để có thể tiến hành đặt hàng',
  [CheckoutErrorCode.CANCEL_CREATE_RECIPIENT]:
    'Bạn cần có ít nhất 1 địa chỉ nhận hàng để có thể tiến hành đặt hàng',
  [PhoneVerifyErrorCode.INCORRECT_OTP]: 'Mã OTP không đúng. Bạn hãy thử lại nhé',
  [PhoneVerifyErrorCode.OTP_EXPIRED]: 'Mã OTP của bạn đã hết hạn.',

  [FeedErrorCode.FAILED_TO_UPLOAD_IMAGE]: 'Đã xảy ra lỗi khi tải ảnh',
  [FeedErrorCode.FAILED_TO_CREATE_FEED]: 'Đã xảy ra lỗi khi thực hiện tạo bài viết',
  [FeedErrorCode.FAILED_TO_UPDATE_FEED]: 'Đã xảy ra lỗi khi cập nhật bài viết',
  [FeedErrorCode.FAILED_TO_DELETE_FEED]: 'Đã xảy ra lỗi khi xoá bài viết',
};
