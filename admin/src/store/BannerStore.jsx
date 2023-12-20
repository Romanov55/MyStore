import {makeAutoObservable} from 'mobx'
import { configure } from 'mobx';

configure({
    enforceActions: 'never', // или 'observed' или 'always'
});

export default class BannerStore {
    constructor() {
        this._banners = []
        this._bannersVisable = false
        makeAutoObservable(this)
    }

    setBannersVisable(is) {
        this._bannersVisable = is
    }

    setBanners(banners) {
        this._banners = banners
    }

    get bannersVisable() {
        return this._bannersVisable
    }

    get banners() {
        return this._banners
    }
}