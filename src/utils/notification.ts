export type NotificationType = 'success' | 'error' | 'info';

export interface CustomerNotificationPayload {
  title: string;
  description?: string;
  type?: NotificationType;
}

export const showCustomerNotification = (
  title: string,
  description?: string,
  type: NotificationType = 'success'
) => {
  if (typeof window !== 'undefined') {
    const event = new CustomEvent('show_global_customer_notification', {
      detail: { title, description, type }
    });
    window.dispatchEvent(event);
  }
};
