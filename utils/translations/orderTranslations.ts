export const orderStatusTranslation: { [key: number]: { description: string, traslation: string } } = {
  0: { description: "Order Processing", traslation: 'Chờ xác nhận' },
  1: { description: "Order Paid", traslation: 'Chờ lấy hàng' },
  2: { description: "Order Confirmed", traslation: 'Chờ lấy hàng' },
  3: { description: "Delivering", traslation: 'Đang giao' },
  4: { description: "Delivered", traslation: 'Đã giao' },
  5: { description: "Order Completed", traslation: 'Đã giao' },
  6: { description: "Cancelled", traslation: 'Đã hủy' },
  7: { description: "Refund Processing", traslation: 'Yêu cầu hoàn tiền' },
  8: { description: "Refund Completed", traslation: 'Đã hoàn tiền' },
  9: { description: "Change Requested", traslation: 'Đang chờ đổi hàng' },
  10: { description: "Change Processing", traslation: 'Đang chờ đổi hàng' },
  11: { description: "Change Completed", traslation: 'Đã xử lý' },
};