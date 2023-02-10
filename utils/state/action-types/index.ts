export enum ActionType {
  SET_TOKEN = 'set_token',
  ALERT_SUCCESS = 'alert_success',
  ALERT_ERROR = 'alert_error',
  ALERT_CLEAR = 'alert_clear',
  LOGIN_SUCCESS = 'login_success',
  LOGIN_FAIL = 'login_fail',
  EMAIL_REGISTER_SUCCESS = 'email_register_success',
  EMAIL_REGISTER_FAIL = 'email_register_fail',
  EMAIL_LOGIN_SUCCESS = 'email_login_success',
  EMAIL_LOGIN_FAIL = 'email_login_fail',
  LOGOUT = 'logout',
  TOGGLE_LOADING = 'toggle_loading',
  RESET_STORE = 'reset_store',
  RESET_USER_STATE = 'reset_user_store',

  SET_USER_INFO = 'set_user_info',
  SET_USER_NAME = 'set_user_name',

  SET_CATEGORY_LIST = 'set_category_list',
  SET_FILTER = 'set_filter',
  SET_CATEGORY = 'set_category',
  RESET_FILTER = 'reset_filter',
  SET_STORE_FILTER = 'set_store_filter',
  RESET_STORE_FILTER = 'reset_store_filter',
  SET_FEEDBACK_ORDERING = 'set_feedback_ordering',
  SET_PRODUCT_ORDERING = 'set_product_ordering',
  SET_RECIPIENTS = 'set_recipients',
  ADD_RECIPIENT = 'add_recipient',
  UPDATE_RECIPIENT = 'update_recipient',
  DEL_RECIPIENT = 'del_recipient',
  SET_PROVINCES_LIST = 'set_provinces_list',
  SET_VOUCHERS_LIST = 'set_vouchers_list',

  // order
  SET_CANCEL_REASONS = 'set_cancel_reasons',
  SET_EXCHANGE_REASONS = 'set_exchange_reasons',

  SET_DELIVERED_ORDERS = 'set_delivered_orders',
  ADD_DELIVERED_ORDER = 'add_delivered_order',
  DEL_DELIVERED_ORDER = 'del_delivered_order',

  SET_CANCELLED_ORDERS = 'set_cancelled_orders',
  ADD_CANCELLED_ORDER = 'add_cancelled_order',
  DEL_CANCELLED_ORDER = 'del_cancelled_order',

  SET_EXCHANGED_ORDERS = 'set_exchanged_orders',
  ADD_EXCHANGED_ORDER = 'add_exchanged_order',
  DEL_EXCHANGED_ORDER = 'del_exchanged_order',

  SET_TOTAL_COMMENTS = 'set_total_comments',
  SET_COMMENTS = 'set_comments',
  ADD_COMMENT = 'add_comment',
  DEL_COMMENT = 'del_comment',

  SET_SEARCH_KEYWORD = 'SET_SEARCH_KEYWORD',
  REMOVE_SEARCH_KEYWORD = 'REMOVE_SEARCH_KEYWORD',

  SET_SEARCH_STORE_KEYWORD = 'SET_SEARCH_STORE_KEYWORD',
  SET_SEARCH_USER_KEYWORD = 'SET_SEARCH_USER_KEYWORD',
  REMOVE_SEARCH_USER_KEYWORD = 'REMOVE_SEARCH_USER_KEYWORD',
  REMOVE_SEARCH_STORE_KEYWORD = 'REMOVE_SEARCH_STORE_KEYWORD',

  SET_SEARCH_PRODUCT_KEYWORD = 'SET_SEARCH_PRODUCT_KEYWORD',
  REMOVE_SEARCH_PRODUCT_KEYWORD = 'REMOVE_SEARCH_PRODUCT_KEYWORD',
  REMOVE_SEARCH = 'REMOVE_SEARCH',
}
