import {makeAutoObservable} from 'mobx'
import { configure } from 'mobx';

configure({
    enforceActions: 'never', // или 'observed' или 'always'
});

export default class DeviceStore {
    constructor() {
        this._types = []
        this._brands = []
        this._devices = []
        this._selectedType = {}
        this._selectedBrand = {}
        this._page = 1
        this._totalCount = 0
        this._limit = 10
        this._brandsVisable = false
        this._typesVisable = false
        this._devicesVisable = false
        makeAutoObservable(this)
    }

    setTypes(types) {
        this._types = types
    }

    setBrands(brands) {
        this._brands = brands
    }

    setDevices(devices) {
        this._devices = devices
    }

    setSelectedType(type) {
        this._selectedType = type
    }

    setSelectedBrand(brand) {
        this._selectedBrand = brand
    }

    setPage(page) {
        this._page = page
    }

    setTotalCount(count) {
        this._totalCount = count
    }

    setBrandsVisable(is) {
        this._brandsVisable = is
    }

    setTypesVisable(is) {
        this._typesVisable = is
    }

    setDevicesVisable(is) {
        this._devicesVisable = is
    }

    get types() {
        return this._types
    }

    get brands() {
        return this._brands
    }

    get devices() {
        return this._devices
    }

    get selectedType() {
        this.setPage(1)
        return this._selectedType
    }

    get selectedBrand() {
        this.setPage(1)
        return this._selectedBrand
    }

    get totalCount() {
        return this._totalCount
    }

    get page() {
        return this._page
    }

    get limit() {
        return this._limit
    }

    get brandsVisable() {
        return this._brandsVisable
    }

    get typesVisable() {
        return this._typesVisable
    }

    get devicesVisable() {
        return this._devicesVisable
    }
}