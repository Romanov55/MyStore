import React, { useContext } from "react";
import { observer } from 'mobx-react';
import { Context } from '../index';
import DeviceItem from "./DeviceItem";
import { Button } from "react-bootstrap";
import { deleteDevice, fetchDevices } from "../http/deviceAPI";
import Pages from "./Pages";

const DeviceList = observer(() => {
    const {device} = useContext(Context)

    // Удаление девайса
    const handleDeleteDevice = async (deviceId) => {
        try {
            await deleteDevice(deviceId);
            // После успешного удаления, очистите текущий список устройств
            device.setDevices([]);
            // Загрузите новый список устройств
            const data = await fetchDevices(device.page, device.limit);
            // Обновите список устройств с новыми данными
            device.setDevices(data.rows);
        } catch (error) {
            console.error("Ошибка при удалении устройства:", error);
        }
    };

    return (
        <div>
            <div className="d-flex flex-wrap">
                {device.devicesVisable && Array.isArray(device.devices) && device.devices.map(device => 
                    <div key={device.id}>
                        <DeviceItem device={device}/>
                        <Button className="d-flex justify-content-center" variant="danger" onClick={() => handleDeleteDevice(device.id)}>
                            Удалить
                        </Button>
                    </div>
                )}
            </div>
            {device.devicesVisable && <Pages />}
        </div>
    )
});

export default DeviceList;