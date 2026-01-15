export interface Notification {
  id: number;
  subject: string;
  message: string;
  type?: string;
  read: boolean;
  shopId: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateNotificationInput {
  subject: string;
  message: string;
  type?: string;
  shopId: number;
  read?: boolean;
}

export interface UpdateNotificationInput extends Partial<CreateNotificationInput> {
  id: number;
}

export interface UnreadNotificationsCount {
  count: number;
}


