export const NotificationService = {
  instance: {
    hasPermission: jest.fn(),
    hasNotificationObserver: {
      next: jest.fn(),
    },
  },
  getNotifications: jest.fn(),
};
