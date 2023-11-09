import {$authHost, $host} from './index';

export const createType = async (type) => {
    const {data} = await $authHost.post('api/type', type)
    return data
}

export const fetchTypes = async () => {
    const {data} = await $host.get('api/type')
    return data
}

export const deleteType = async (typeId) => {
    const { data } = await $authHost.delete(`api/type/${typeId}`);
    return data;
}

export const updateType = async (typeId, updatedTypeData) => {
    const { data } = await $authHost.put(`api/type/${typeId}`, updatedTypeData);
    return data;
}

export const createBrand = async (brand) => {
    const {data} = await $authHost.post('api/brand', brand)
    return data
}

export const fetchBrands = async () => {
    const {data} = await $host.get('api/brand')
    return data
}

export const deleteBrand = async (brandId) => {
    const { data } = await $authHost.delete(`api/brand/${brandId}`);
    return data;
}

export const updateBrand = async (brandId, updatedBrandData) => {
    const { data } = await $authHost.put(`api/brand/${brandId}`, updatedBrandData);
    return data;
}

export const createDevice = async (device) => {
    const {data} = await $authHost.post('api/device', device)
    return data
}

export const fetchDevices = async (page, limit = 5) => {
    const { data } = await $host.get('api/device', {
        params: {
            page,
            limit,
        }
    });
    return data;
}

export const fetchOneDevice = async (id) => {
    const {data} = await $host.get(`api/device/${id}`)
    return data
}

export const deleteDevice = async (id) => {
    const {data} = await $host.delete(`api/device/${id}`)
    return data
}

export const updateDevice = async (id, updatedData) => {
    const { data } = await $host.patch(`api/device/${id}`, updatedData);
    return data;
}

export const createBanner = async (banner) => {
    const {data} = await $authHost.post('api/banner', banner)
    return data
}

export const fetchBanners = async () => {
    const {data} = await $host.get('api/banner')
    return data
}

export const deleteBanner = async (bannerId) => {
    const { data } = await $authHost.delete(`api/banner/${bannerId}`);
    return data;
}