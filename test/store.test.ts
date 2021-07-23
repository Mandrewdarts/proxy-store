import { ProxyStore } from '../src';

describe('ProxyStore', () => {
  it('should intialize a store', () => {
    const p = new ProxyStore({ name: 'Luke' });

    expect(p.get().name).toEqual('Luke');
  });

  it('should be updatable', () => {
    const p = new ProxyStore({ name: 'Luke' });
    p.state.name = 'Han';

    expect(p.get().name).toEqual('Han');
  });

  it('should handle selectors', () => {
    const p = new ProxyStore({
      user: { name: { first: 'Ben', last: 'Solo' } },
    });
    const firstName = p.select(state => state.user.name.first);
    expect(firstName).toEqual('Ben');
  });

  it('should handle subscriptions', () => {
    const p = new ProxyStore({ name: 'Luke' });
    const sub = jest.fn();
    p.subscribe(sub);

    p.update(state => {
      state.name = 'Hans';
      return state;
    });

    expect(sub).toHaveBeenCalledTimes(1);
  });

  it('should handle nested subscriptions', () => {
    const p = new ProxyStore({
      user: { first_name: 'Luke', last_name: 'Skywalker' },
    });
    const sub = jest.fn();
    p.subscribe(sub);

    p.update(state => {
      state.user.first_name = 'Rey';
      return state;
    });

    expect(sub).toHaveBeenCalled();
    expect(p.state.user.first_name).toEqual('Rey');
  });

  it('should remove subscriptions', () => {
    const p = new ProxyStore({
      user: { first_name: 'Luke', last_name: 'Skywalker' },
    });

    const sub = jest.fn();
    const unsub = p.subscribe(sub);

    p.update(state => {
      state.user.first_name = 'Rey';
      return state;
    });

    expect(sub).toHaveBeenCalledTimes(1);

    unsub();

    p.update(state => {
      state.user.first_name = 'Luke';
      return state;
    });

    expect(sub).toHaveBeenCalledTimes(1);
  });
});
