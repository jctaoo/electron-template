import Store from 'electron-store';

type StoreType = {
    token: String;
};

const store = new Store<StoreType>();

export function storeUserSession(token: String) {
    store.set('token', token);
}

export function retrieveUserSession() {
    return store.get('token');
}