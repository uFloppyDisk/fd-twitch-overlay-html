class StorageManager {
    constructor() { }

    _get(key) {
        if (!(typeof key === "string")) {
            key = String(key);
        }

        let value = localStorage.getItem(key);
        console.log(`Got ${key}`);

        return value;
    }

    _set(key, value) {
        if (!(typeof key === "string")) {
            key = String(key);
        }

        if (value instanceof Array) {
            value = JSON.stringify(value);
        } else if (!(typeof value === "string")) {
            value = String(value);
        }

        localStorage.setItem(key, value);
        console.log(`Set ${key} to value ${value}`);
    }

    createEntry(key, value) {
        if (!(localStorage.getItem(key) === null)) {
            throw new StorageException(`Tried adding new key: Key ${key} already exists.`);
        }

        this._set(key, value);
    }

    updateEntry(key, value) {
        if (localStorage.getItem(key) === null) {
            throw new StorageException(`Tried updating value: Key ${key} doesn't exist.`);
        }

        this._set(key, value);
    }

    getEntry(key, json=true) {
        if (localStorage.getItem(key) === null) {
            throw new StorageException(`Tried getting value: Key ${key} doesn't exist.`);
        }

        let value = this._get(key);

        if (json) {
            value = JSON.parse(value);
        }

        return value;
    }
}