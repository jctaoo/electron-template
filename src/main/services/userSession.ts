import Store from 'electron-store';

type StoreType = {
    token: String;
};

const store = new Store<StoreType>();

export function storeUserSession(token: String) {
    console.log(`storeUserSession: ${token}`);
    store.set('token', token);
}

export function clearUserSession() {
    store.delete('token');
}

export function retrieveUserSession() {
    return store.get('token');
}