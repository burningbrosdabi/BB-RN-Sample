import { ImageRequireSource } from 'react-native';

export enum OrderStatus {
  processing = 'processing', // '0'
  confirmed = 'confirmed', // '1,2',
  delivering = 'delivering', // 3
  delivered = 'delivered', // '4,5',
  cancelled = 'cancelled',
  exchanged = 'exchanged', // '9,10,11'
}

export const OrderStatusMap: { [key in OrderStatus]: string } = {
  [OrderStatus.processing]: '0',
  [OrderStatus.confirmed]: '1,2',
  [OrderStatus.delivering]: '3',
  [OrderStatus.delivered]: '4,5',
  [OrderStatus.exchanged]: '9,10,11',
  [OrderStatus.cancelled]: '6',
};

type OrderStatusContent = {
  text: string;
  image: ImageRequireSource;
  empty: ImageRequireSource;
};

export const OrderStatusContentMap: { [key in OrderStatus]: OrderStatusContent } = {
  [OrderStatus.processing]: {
    text: 'Chờ xác nhận',
    image: require('/assets/images/icon/info_confirm.png'),
    empty: require('/assets/images/icon/info_processing_order.png'),
  },
  [OrderStatus.confirmed]: {
    text: 'Chờ lấy hàng',
    image: require('/assets/images/icon/info_prepare.png'),
    empty: require('/assets/images/icon/info_confirmed_order.png'),
  },
  [OrderStatus.delivering]: {
    text: 'Đang giao',
    image: require('/assets/images/icon/info_shipping.png'),
    empty: require('/assets/images/icon/info_delivering_order.png'),
  },
  [OrderStatus.delivered]: {
    text: 'Đã giao',
    image: require('/assets/images/icon/info_receive.png'),
    empty: require('/assets/images/icon/info_delivered_order.png')
  },
  [OrderStatus.exchanged]: {
    text: 'Trả hàng',
    image: require('/assets/images/icon/refund_icon.png'),
    empty: require('/assets/images/icon/info_cancelled_order.png')
  },
  [OrderStatus.cancelled]: {
    text: 'Hủy',
    image: require('/assets/images/icon/cancel_order_icon.png'),
    empty: require('/assets/images/icon/info_refunded_order.png')
  },
};
