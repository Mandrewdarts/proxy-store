export type SubscriptionCallback<T> = (state: T) => void;

type State = object;
type UpdateStateCallback<T> = (state: T) => T;

export class ProxyStore<T extends State> {
  public state: any;
  private subscriptions = new Set<SubscriptionCallback<T>>();

  constructor(private _init: T) {
    this.state = new Proxy<T>(this._init, {
      set: (target: any, key: string, value: any) => {
        target[key] = value;
        this.subscriptions.forEach((fn: SubscriptionCallback<T>) => fn(target));
        return true;
      },

      get: (target: any, key: any) => {
        return target[key];
      },
    });
  }

  subscribe(fn: SubscriptionCallback<T>) {
    this.subscriptions.add(fn);
    return () => this.subscriptions.delete(fn);
  }

  update(fn: UpdateStateCallback<T>) {
    const newState: any = fn({ ...this.state });
    Object.keys(newState).forEach(
      (key: string | number) => (this.state[key] = newState[key])
    );
  }

  get(): T {
    return this.state;
  }

  select(fn: (state: T) => any) {
    return fn(this.state);
  }
}
