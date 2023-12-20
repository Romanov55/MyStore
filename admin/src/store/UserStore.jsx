import {makeAutoObservable} from 'mobx'
import { configure } from 'mobx';

configure({
    enforceActions: 'never', // или 'observed' или 'always'
});

export default class UserStore {
    constructor() {
        this._isAuth = false
        this._user = {}
        makeAutoObservable(this)
    }

    setIsAuth(bool) {
        this._isAuth = bool
    }

    setUser(bool) {
        this._user = bool
    }

    get isAuth() {
        return this._isAuth
    }

    get user() {
        return this._user
    }
}