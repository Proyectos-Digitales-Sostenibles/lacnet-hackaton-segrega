export class Mutex {
  locked = false;
  waiting: ((unlock: () => void) => void)[] = [];

  private constructor() {}
  private static locks: { [key: string]: Mutex } = {};

  public static getLock(lock: string) {
    if (!Mutex.locks[lock]) Mutex.locks[lock] = new Mutex();
    return Mutex.locks[lock];
  }

  // Function to acquire the lock
  async lock(onlyWaitOne = false) {
    const unlock = () => {
      // Unlock function to release the lock
      const next = this.waiting.shift();
      if (next) next(unlock);
      else this.locked = false;
    };

    // If already locked, queue the next lock attempt
    if (this.locked) {
      if (onlyWaitOne && this.waiting.length > 0) {
        const err: Error & { customCode?: string } = new Error('Already waiting for existing lock');
        err.customCode = 'ALREADY_WAITING';
        throw err;
      }
      await new Promise((resolve) => this.waiting.push(resolve));
      return unlock;
    } else {
      this.locked = true;
      return Promise.resolve(unlock);
    }
  }
}
