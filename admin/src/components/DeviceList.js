import React, { useContext, useState } from "react";
import { observer } from 'mobx-react';
import { Context } from '../index';
import DeviceItem from "./DeviceItem";
import { Button } from "react-bootstrap";
import { deleteDevice, fetchDevices } from "../http/deviceAPI";
import Pages from "./Pages";
import UpdateDevice from "./modals/updateDevice";

const DeviceList = observer(() => {
    const { device } = useContext(Context);

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

    const [visibleDevices, setVisibleDevices] = useState({});

    const toggleDeviceVisibility = (deviceId) => {
        // Обновить видимость для конкретного устройства
        setVisibleDevices({
            ...visibleDevices,
            [deviceId]: !visibleDevices[deviceId]
        });
    };

    return (
        <div>
            <div className="d-flex flex-wrap">
                {device.devicesVisable && Array.isArray(device.devices) && device.devices.map(item => 
                    <div 
                        key={item.id}
                        onClick={() => toggleDeviceVisibility(item.id)}
                    >
                        <DeviceItem device={item}/>
                        <Button
                            className="d-flex justify-content-center"
                            variant="danger"
                            onClick={(e) => {
                                e.stopPropagation(); // Предотвращение всплытия события
                                handleDeleteDevice(item.id);
                            }}
                        >
                            Удалить
                        </Button>
                        <UpdateDevice show={visibleDevices[item.id]} onHide={() => toggleDeviceVisibility(item.id)} deviceToUpdate={item} />
                    </div>
                    
                )}
            </div>
            {device.devicesVisable && <Pages />}
            
        </div>
    );
});

export default DeviceList;
