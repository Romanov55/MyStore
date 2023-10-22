import React from "react";
import { Col, Card, Button } from "react-bootstrap";
import Image from "react-bootstrap/Image"
import star from "./assets/star.png"
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { DEVICE_ROUTE } from "../utils/consts";
import { deleteDevice, fetchDevices } from "../http/deviceAPI";

const DeviceItem = ({device}) => {
    const history = useHistory()

    // Удаление девайса
    const handleDeleteDevice = async (deviceId) => {
        try {
            await deleteDevice(deviceId);
            // После успешного удаления обновите список устройств
            await fetchDevices(device.selectedType?.id, device.selectedBrand?.id, device.page, device.limit);
            // обновление списка на странице
            device.setDevices(await fetchDevices());
        } catch (error) {
            console.error("Ошибка при удалении устройства:", error);
        }
    };

    return (
        <Col md={2} className="m-3" onClick={() => history.push(DEVICE_ROUTE + '/' + device.id)}>
            <Card style={{width: 150, cursor: 'pointer'}} border={'light'}>
                <Image width={150} height={150} src={process.env.REACT_APP_API_URL + device.img}/>
                <div className="text-black-50 d-flex justify-content-between align-items-center mt-1">
                    <div>{device.brand}</div>
                    <div className="d-flex align-items-center">
                        <div></div>
                        <Image width={18} height={18} src={star}/>
                    </div>
                </div>
                <div>{device.name}</div>
                <Button variant="danger" onClick={() => handleDeleteDevice(device.id)}>
                    Удалить
                </Button>
            </Card>
        </Col>
    )
};

export default DeviceItem;