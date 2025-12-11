type QueueItem = {
  resolve: (token: string) => void;
  reject: (error: any) => void;
};

// Deprecated: Cookie-based auth no longer performs client-side refreshes.
export class RefreshQueue {
  private isRefreshing: boolean = false;
  private failedQueue: QueueItem[] = [];

  get refreshing() {
    return this.isRefreshing;
  }

  set refreshing(value: boolean) {
    this.isRefreshing = value;
  }

  addToQueue(): Promise<string> {
    return new Promise<string>((resolve, reject) => {
      this.failedQueue.push({ resolve, reject });
    });
  }

  processQueue(error: any, token: string | null = null) {
    this.failedQueue.forEach(promise => {
      if (error) {
        promise.reject(error);
      } else if (token) {
        promise.resolve(token);
      }
    });
    this.failedQueue = [];
  }
} 