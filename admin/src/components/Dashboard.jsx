import React, { useContext } from "react";
import { Button, Container } from "react-bootstrap";
import { Context } from "..";

function Dashboard() {
    const {device} = useContext(Context)
    const {banner} = useContext(Context)

    const handleShowBrands = () => {
        device.setBrandsVisable(!device.brandsVisable);
        device.setTypesVisable(false);
        device.setDevicesVisable(false);
        banner.setBannersVisable(false);
    };

    const handleShowTypes = () => {
        device.setTypesVisable(!device.typesVisable);
        device.setBrandsVisable(false);
        device.setDevicesVisable(false);
        banner.setBannersVisable(false);
    };
    
    const handleShowDevices = () => {
        device.setDevicesVisable(!device.devicesVisable);
        device.setBrandsVisable(false);
        device.setTypesVisable(false);
        banner.setBannersVisable(false);
    };

    const handleShowBanners = () => {
        banner.setBannersVisable(!banner.bannersVisable);
        device.setBrandsVisable(false);
        device.setTypesVisable(false);
        device.setDevicesVisable(false);
    };

    return (
        <Container className="d-flex flex-column">
            <Button className="mt-1" onClick={handleShowDevices}>Товары</Button>
            <Button className="mt-1" onClick={handleShowTypes}>Категории</Button>
            <Button className="mt-1" onClick={handleShowBrands}>Бренды</Button>
            <Button className="mt-1" onClick={handleShowBanners}>Баннеры</Button>
        </Container>
    );
}

export default Dashboard;
