import {makeAutoObservable} from 'mobx'

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